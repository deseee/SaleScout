import { SquareClient, SquareEnvironment, SquareError } from 'square';

/**
 * Square migration Wave 1 #1 (Checkout, 2026-09-07) -- lazy Square client, mirrors the
 * existing utils/stripe.ts getStripe() lazy-init pattern (throw a clear error if the env
 * var is missing, cache a singleton per process).
 *
 * TWO DIFFERENT CLIENT SHAPES -- Square's auth model is NOT like Stripe Connect's
 * `{ stripeAccount }` per-request option:
 *   - getSquarePlatformClient() -- FindA.Sale's OWN Square developer account access token
 *     (SQUARE_ACCESS_TOKEN). Platform-level calls only (OAuth token exchange, webhook
 *     signature verification key lookups). NEVER used to create a payment on an
 *     organizer's behalf -- see getSquareClientForMerchant below for why.
 *   - getSquareClientForMerchant(accessToken) -- a FRESH client scoped to the connected
 *     ORGANIZER's own OAuth access token. Confirmed via Square's own docs (Collect
 *     Application Fees guide, "Your Square account" section, read live 2026-09-07):
 *     "Square identifies the seller's Square account by reading the access token obtained
 *     in the OAuth code flow and used in the CreatePayment request." Unlike Stripe's
 *     Destination-charge model (one platform-token client + a per-call `stripeAccount`
 *     request option), a Square app_fee_money charge on behalf of a connected merchant
 *     requires the ENTIRE client to be authorized as that merchant -- there is no
 *     cheaper way to scope a single call the way Stripe does.
 *
 * WHERE THE ORGANIZER'S ACCESS TOKEN COMES FROM: see squarePaymentService.ts's
 * resolveOrganizerSquareAccessToken() -- THAT is the real gap (no token-storage schema
 * field exists yet), not this file. This file just turns a token string into a client.
 */

let platformClient: SquareClient | null = null;

const resolveEnvironment = (): SquareEnvironment => {
  const raw = (process.env.SQUARE_ENVIRONMENT || '').trim().toLowerCase();
  return raw === 'sandbox' ? SquareEnvironment.Sandbox : SquareEnvironment.Production;
};

export const getSquarePlatformClient = (): SquareClient => {
  if (!platformClient) {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        'SQUARE_ACCESS_TOKEN is not defined in environment variables. Set it in your .env file before initializing Square.'
      );
    }
    platformClient = new SquareClient({
      token,
      environment: resolveEnvironment(),
    });
  }
  return platformClient;
};

/**
 * Per-request client scoped to a connected ORGANIZER's OWN OAuth access token -- every
 * checkout/POS/refund call site that charges on an organizer's behalf must use this, not
 * getSquarePlatformClient(). Deliberately NOT cached/singleton (unlike the platform
 * client above): a merchant's token can rotate/refresh between requests once the
 * Connect-onboarding dispatch implements real token storage + refresh, and caching a
 * stale one here would silently keep charging against a revoked/expired token instead of
 * surfacing the failure immediately.
 */
export const getSquareClientForMerchant = (organizerAccessToken: string): SquareClient => {
  if (!organizerAccessToken) {
    throw new Error(
      'getSquareClientForMerchant: organizerAccessToken is required (empty/undefined) -- this is a caller bug, not a runtime condition to handle silently.'
    );
  }
  return new SquareClient({
    token: organizerAccessToken,
    environment: resolveEnvironment(),
  });
};

export { SquareError };
export default getSquarePlatformClient;

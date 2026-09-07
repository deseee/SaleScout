import { SquareError } from 'square';
import { prisma } from '../lib/prisma';
import { getSquareClientForMerchant, getSquarePlatformClient } from '../utils/square';
import { decryptToken, encryptToken } from '../utils/tokenCrypto';
import { buildSquareIdempotencyKey, toSquareMoney } from './squarePaymentService';
import { refreshSquareAccessToken } from './squareConnectService'; // no circular import -- squareConnectService.ts does not import this file

/**
 * squareVendorBoothCartService.ts -- Square side of vendor-booth-cart-checkout
 * (2026-09-07, vendor-booth-cart-checkout dispatch, dedicated follow-up to Wave 1 of the
 * Square-replaces-Stripe migration). Mirrors vendorBoothCartController.ts's per-leg,
 * per-booth-own-account shape -- see that file's own header comment (ADR-020) for the
 * Stripe-side design this is a Square-flavored sibling of.
 *
 * ============================================================================
 * RESEARCHED ANSWER -- multi-merchant charge (collect shopper's card once, charge N
 * independently-connected booths in real time), the open question this dispatch was asked
 * to resolve, NOT guessed at:
 * ============================================================================
 * Square DOES support this via the Cards API's documented "Shared Card on File" mechanism
 * (developer.squareup.com/docs/cards-api/walkthrough-shared-card, fetched live 2026-09-07):
 *   1. Tokenize the shopper's card ONCE client-side via the Web Payments SDK (produces a
 *      single-use sourceId, same primitive squarePaymentService.ts/squarePosPaymentAdapter.ts
 *      already use).
 *   2. Create a Customer + Card in FindA.Sale's OWN platform Square developer account
 *      (getSquarePlatformClient(), NOT any connected merchant's token) using that sourceId --
 *      this "shared card" gets an id in the `ccof:...` namespace.
 *   3. For EACH connected booth, create (or reuse) a Customer in THAT booth's own connected
 *      account, then call CreatePayment scoped to that booth's own OAuth access token with
 *      `sourceId` = the shared card id and `customerId` = the booth-side customer. Square
 *      resolves which merchant a payment belongs to from the ACCESS TOKEN used for the call
 *      (same "the whole client is scoped to one merchant" model squarePaymentService.ts's
 *      header comment already documents for the non-booth-cart surface) -- so this is
 *      genuinely N separate real-time API calls, one per booth, each a live charge on that
 *      booth's own account, NOT one Stripe-style single-PaymentIntent-many-destinations call.
 *      That is functionally equivalent to what the shopper experiences (one card entry, N
 *      booths charged) even though the underlying mechanics differ from Stripe's
 *      docs.stripe.com/connect/direct-charges-multiple-accounts primitive.
 * Required OAuth scopes: `PAYMENTS_WRITE_SHARED_ONFILE` (added to squareConnectService.ts's
 * SQUARE_OAUTH_SCOPES by this dispatch) + `CUSTOMERS_WRITE` (also added). FLAGGED, NOT
 * silently assumed safe: Square's own "Cards on File Requirements" doc
 * (developer.squareup.com/docs/app-marketplace/requirements/cards-on-file) ties shared-card
 * functionality to Square's App Marketplace partner program in places -- whether
 * PAYMENTS_WRITE_SHARED_ONFILE requires a separate Square-side app review/approval before it
 * works in production (beyond the OAuth scope grant itself) was NOT confirmed this session.
 * This is the real-per-leg-split path (chosen over the single-merchant-then-settle fallback
 * the scoping doc offered) because it preserves the existing per-booth-is-its-own-merchant-
 * of-record model exactly -- see this dispatch's handoff for the full evidence trail.
 *
 * ============================================================================
 * RESEARCHED ANSWER -- hub-owner-share live Transfer equivalent (does Square let the
 * platform move money from one connected merchant's account to a DIFFERENT connected
 * merchant's account, mirroring Stripe's `transfers.create({ destination })`):
 * ============================================================================
 * NO. Confirmed via Square's own docs (Collect Application Fees guide,
 * developer.squareup.com/docs/payments-api/take-payments-and-collect-fees) and the Payouts
 * API (developer.squareup.com/docs/payouts-api/overview): `app_fee_money` lets the PLATFORM
 * take its OWN cut from a payment processed on a connected merchant's account, and a Payout
 * only ever moves a merchant's OWN balance to THEIR OWN linked bank account -- there is no
 * Square primitive for the platform to redirect a slice of Merchant A's payment to Merchant
 * B's account. This is a real architectural gap versus Stripe's Connect Transfers, not a
 * missing scope or an unresearched corner. Consequence: `transferHubOwnerShareForLeg` in
 * vendorBoothCartController.ts (edited by this dispatch) NO-OPS for SQUARE legs -- the hub
 * owner's computed share (BoothCartLeg.hubOwnerShareAmount, already persisted identically to
 * the Stripe path) is NEVER auto-transferred for a Square leg. It sits as an accrued-but-
 * unsettled amount for a FUTURE settlement-sweep mechanism (querying captured SQUARE legs'
 * hubOwnerShareAmount into VendorBoothPayout/VendorBoothSettlementBatch, the existing manual
 * settlement system -- this dispatch added VendorBoothPayout.processor/squareTransferId as
 * additive schema so that future mechanism has somewhere to record the result, but does NOT
 * build the sweep itself -- explicitly flagged, not silently dropped, see this dispatch's
 * handoff item 6).
 */

export class SquareBoothOnboardingIncompleteError extends Error {
  constructor(vendorBoothId: string) {
    super(
      `Square payments aren't available for this booth yet (vendorBoothId=${vendorBoothId}) -- ` +
        'either Square onboarding was never completed for this booth, or the stored OAuth token ' +
        'is missing/expired with no usable refresh token on file.'
    );
    this.name = 'SquareBoothOnboardingIncompleteError';
  }
}

const SQUARE_TOKEN_REFRESH_SKEW_MS = 5 * 60 * 1000; // 5 minutes -- same skew squarePaymentService.ts uses

/**
 * Booth-scoped sibling of squarePaymentService.ts's resolveOrganizerSquareAccessToken --
 * VendorBooth is a DIFFERENT Prisma model from Organizer, so this cannot reuse that function
 * directly, but the decrypt/refresh/persist logic is intentionally identical (same skew, same
 * fail-closed posture, same "never fabricate a token" guarantee).
 */
export async function resolveVendorBoothSquareAccessToken(booth: {
  id: string;
  squareAccountId: string | null;
  squareOnboarded: boolean;
}): Promise<string> {
  if (!booth.squareOnboarded || !booth.squareAccountId) {
    throw new SquareBoothOnboardingIncompleteError(booth.id);
  }

  const row = await prisma.vendorBooth.findUnique({
    where: { id: booth.id },
    select: {
      squareAccessTokenEncrypted: true,
      squareRefreshTokenEncrypted: true,
      squareTokenExpiresAt: true,
    },
  });

  if (!row?.squareAccessTokenEncrypted) {
    throw new SquareBoothOnboardingIncompleteError(booth.id);
  }

  const expiresAt = row.squareTokenExpiresAt;
  const needsRefresh = !!expiresAt && expiresAt.getTime() <= Date.now() + SQUARE_TOKEN_REFRESH_SKEW_MS;

  if (!needsRefresh) {
    return decryptToken(row.squareAccessTokenEncrypted);
  }

  if (!row.squareRefreshTokenEncrypted) {
    console.error(
      `[squareVendorBoothCartService] Booth ${booth.id}'s Square access token is expired/expiring ` +
        'with no refresh token on file -- re-onboarding required.'
    );
    throw new SquareBoothOnboardingIncompleteError(booth.id);
  }

  try {
    const refreshToken = decryptToken(row.squareRefreshTokenEncrypted);
    const refreshed = await refreshSquareAccessToken(refreshToken);
    await prisma.vendorBooth.update({
      where: { id: booth.id },
      data: {
        squareAccessTokenEncrypted: encryptToken(refreshed.accessToken),
        ...(refreshed.refreshToken ? { squareRefreshTokenEncrypted: encryptToken(refreshed.refreshToken) } : {}),
        squareTokenExpiresAt: refreshed.expiresAt ? new Date(refreshed.expiresAt) : null,
      },
    });
    return refreshed.accessToken;
  } catch (err) {
    console.error(`[squareVendorBoothCartService] Failed to refresh Square access token for booth ${booth.id}:`, err);
    throw new SquareBoothOnboardingIncompleteError(booth.id);
  }
}

/**
 * Step 1+2 of the Shared Card on File walkthrough -- create a Customer + Card in
 * FindA.Sale's OWN platform Square account from the shopper's single-use sourceId. Called
 * ONCE per cart (mirrors createBoothCartQrSetupIntent's single platform-level Stripe
 * Customer+SetupIntent per cart). No idempotency/reuse check -- mirrors the Stripe path's
 * own simplicity (a fresh platform Customer object per cart there too); this is a small,
 * accepted amount of Customer-object clutter in the platform's own Square account, same
 * trade-off already made on the Stripe side.
 */
export async function createSquareSharedCardForCart(params: {
  cartTransactionId: string;
  sourceId: string;
}): Promise<{ platformCustomerId: string; sharedCardId: string }> {
  const client = getSquarePlatformClient();

  const customerResponse = await client.customers.create({
    referenceId: params.cartTransactionId,
    note: 'FindA.Sale booth-cart QR/in-app rail -- shared-card-on-file platform customer',
  });
  const platformCustomerId = (customerResponse as any)?.customer?.id;
  if (!platformCustomerId) {
    throw new Error('[squareVendorBoothCartService] Square CreateCustomer (platform account) returned no customer id');
  }

  const cardResponse = await client.cards.create({
    idempotencyKey: buildSquareIdempotencyKey(['sharedcard', params.cartTransactionId]),
    sourceId: params.sourceId,
    card: {
      customerId: platformCustomerId,
      referenceId: params.cartTransactionId,
    } as any,
  } as any);
  const sharedCardId = (cardResponse as any)?.card?.id;
  if (!sharedCardId) {
    throw new Error('[squareVendorBoothCartService] Square CreateCard (shared card) returned no card id');
  }

  return { platformCustomerId, sharedCardId };
}

export interface SquareBoothLegAuthorizeParams {
  boothAccessToken: string;
  sharedCardId: string;
  amountCents: number;
  appFeeCents: number;
  cartTransactionId: string;
  vendorBoothId: string;
  hubId: string;
  squareLocationId?: string | null;
}

export interface SquareBoothLegAuthorizeSuccess {
  ok: true;
  paymentId: string;
  status: string;
}
export interface SquareBoothLegAuthorizeFailure {
  ok: false;
  code: string;
  message: string;
}
export type SquareBoothLegAuthorizeResult = SquareBoothLegAuthorizeSuccess | SquareBoothLegAuthorizeFailure;

const DECLINE_MESSAGE = 'Your card was declined. Please check your card details or try a different card.';

/**
 * Step 3+4 of the Shared Card on File walkthrough, per booth: create (or find) a Customer
 * in THIS booth's own connected account, then CreatePayment scoped to the booth's own
 * access token using the shared card as source_id. Delayed capture (autocomplete:false),
 * mirroring squarePosPaymentAdapter.ts's researched hold-window rationale -- lets
 * captureBoothCart's existing whole-cart-authorize-then-capture-all shape work unmodified.
 */
export async function authorizeSquareBoothCartLeg(
  params: SquareBoothLegAuthorizeParams
): Promise<SquareBoothLegAuthorizeResult> {
  const client = getSquareClientForMerchant(params.boothAccessToken);

  let boothCustomerId: string;
  try {
    const customerResponse = await client.customers.create({
      referenceId: params.cartTransactionId,
      note: `FindA.Sale booth-cart QR/in-app rail -- booth ${params.vendorBoothId}`,
    });
    boothCustomerId = (customerResponse as any)?.customer?.id;
    if (!boothCustomerId) {
      return { ok: false, code: 'NO_CUSTOMER_IN_RESPONSE', message: DECLINE_MESSAGE };
    }
  } catch (err) {
    if (err instanceof SquareError) {
      const first = (err as any).errors?.[0];
      console.warn(`[squareVendorBoothCartService] Square CreateCustomer (booth account) failed: ${first?.code || 'SQUARE_ERROR'} -- ${first?.detail || err.message}`);
      return { ok: false, code: first?.code || 'SQUARE_ERROR', message: DECLINE_MESSAGE };
    }
    throw err;
  }

  try {
    const paymentResponse = await client.payments.create({
      idempotencyKey: buildSquareIdempotencyKey(['boothleg', params.cartTransactionId, params.vendorBoothId]),
      sourceId: params.sharedCardId,
      customerId: boothCustomerId,
      amountMoney: toSquareMoney(params.amountCents),
      ...(params.appFeeCents > 0 ? { appFeeMoney: toSquareMoney(params.appFeeCents) } : {}),
      ...(params.squareLocationId ? { locationId: params.squareLocationId } : {}),
      // Delayed capture -- see squarePosPaymentAdapter.ts's file-header for the researched
      // hold-window rationale this dispatch reuses unchanged (7-day card-not-present window).
      autocomplete: false,
      referenceId: params.cartTransactionId.slice(0, 40),
      note: `FindA.Sale booth cart leg -- hub ${params.hubId}, booth ${params.vendorBoothId}`,
    } as any);
    const payment = (paymentResponse as any)?.payment;
    if (!payment?.id) {
      return { ok: false, code: 'NO_PAYMENT_IN_RESPONSE', message: DECLINE_MESSAGE };
    }
    return { ok: true, paymentId: payment.id, status: payment.status ?? 'UNKNOWN' };
  } catch (err) {
    if (err instanceof SquareError) {
      const first = (err as any).errors?.[0];
      console.warn(`[squareVendorBoothCartService] Square CreatePayment decline/error: ${first?.code || 'SQUARE_ERROR'} -- ${first?.detail || err.message}`);
      return { ok: false, code: first?.code || 'SQUARE_ERROR', message: DECLINE_MESSAGE };
    }
    throw err;
  }
}

/** Re-verify a leg's live status before capturing (mirrors captureBoothCart's Stripe re-check loop). */
export async function getSquareBoothCartLegStatus(boothAccessToken: string, paymentId: string): Promise<string | null> {
  const client = getSquareClientForMerchant(boothAccessToken);
  const response = await client.payments.get({ paymentId });
  return (response as any)?.payment?.status ?? null;
}

/** Completes (captures) a held/APPROVED Square booth-cart leg payment. */
export async function completeSquareBoothCartLeg(boothAccessToken: string, paymentId: string): Promise<string> {
  const client = getSquareClientForMerchant(boothAccessToken);
  const response = await client.payments.complete({ paymentId });
  return (response as any)?.payment?.status ?? 'UNKNOWN';
}

/** Cancels (voids) an uncaptured (APPROVED) Square booth-cart leg payment -- free, no charge ever landed. */
export async function cancelSquareBoothCartLeg(boothAccessToken: string, paymentId: string): Promise<void> {
  const client = getSquareClientForMerchant(boothAccessToken);
  await client.payments.cancel({ paymentId });
}

/**
 * Refunds a captured booth-cart leg's Square payment, scoped to the BOOTH's own access
 * token (not the organizer's -- a booth-cart leg's merchant of record is the booth's own
 * connected account, same Direct-charge-equivalent model the Stripe path already uses).
 * Deliberately does NOT attempt any hub-owner-share reversal -- see this file's header
 * comment: Square has no Transfer-between-merchants primitive, so no live Transfer was ever
 * made for a Square leg's hub-owner share in the first place, meaning there is nothing to
 * reverse here (unlike the Stripe path's settleHubOwnerReversalForLeg call).
 */
export async function refundVendorBoothSquarePayment(
  boothAccessToken: string,
  paymentId: string,
  refundAmountCents: number,
  reason?: string
): Promise<void> {
  const client = getSquareClientForMerchant(boothAccessToken);
  await client.refunds.create({
    idempotencyKey: buildSquareIdempotencyKey(['boothlegrefund', paymentId, String(refundAmountCents)]),
    paymentId,
    amountMoney: toSquareMoney(refundAmountCents),
    ...(reason ? { reason } : {}),
  } as any);
}

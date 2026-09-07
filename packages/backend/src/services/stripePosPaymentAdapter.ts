import Stripe from 'stripe';
import { getStripe } from '../utils/stripe';
import { getAccountStatus } from '../services/stripeConnectService';

const stripe = () => getStripe();

/**
 * Stripe POS Payment Adapter -- Square migration Wave 1 #3, Phone-based POS (2026-09-07).
 *
 * Extracts the Stripe-specific logic that already lived inline in
 * posPaymentController.ts into a named module, with ZERO behavior change -- every
 * function below runs the exact same code path that was already live, just named so
 * squarePosPaymentAdapter.ts can sit next to it as a symmetrical sibling and
 * posPaymentController.ts can branch on `processor` at each of the call sites the Wave 1
 * scoping doc identified: account-status preflight, payment creation, ID backfill,
 * retrieve/confirm, status check.
 *
 * Do NOT change the Stripe path's timing here -- the scoping doc is explicit that only
 * Square's charge-creation timing moves (request-time -> accept/confirm-time); Stripe's
 * PaymentIntent is still created at REQUEST time, exactly as before.
 */

export interface PreflightOk {
  ok: true;
}
export interface PreflightFail {
  ok: false;
  status: number;
  message: string;
}
export type PreflightResult = PreflightOk | PreflightFail;

/**
 * Live capability preflight -- unchanged from the inline version this replaces. Never
 * trusts organizer.stripeConnectId's mere presence; always live-checks Stripe's own
 * charges_enabled flag (a DB-cache vs live-Stripe discrepancy was confirmed for at least
 * one real organizer, see the original inline comment this was extracted from in git
 * history for posPaymentController.ts's createPaymentRequest).
 */
export async function preflightAccountStatus(organizer: {
  stripeConnectId: string | null;
}): Promise<PreflightResult> {
  if (!organizer.stripeConnectId) {
    return {
      ok: false,
      status: 400,
      message: "This organizer's Stripe account cannot currently accept charges. Please check Stripe onboarding status.",
    };
  }
  try {
    const liveStatus = await getAccountStatus(organizer.stripeConnectId);
    if (!liveStatus.chargesEnabled) {
      return {
        ok: false,
        status: 400,
        message: "This organizer's Stripe account cannot currently accept charges. Please check Stripe onboarding status.",
      };
    }
    return { ok: true };
  } catch (statusErr) {
    console.error('[stripePosPaymentAdapter] getAccountStatus preflight failed:', statusErr);
    return {
      ok: false,
      status: 502,
      message: "Could not verify the organizer's payment account status. Please try again.",
    };
  }
}

export interface CreatePaymentParams {
  cardAmountCents: number;
  platformFeeCents: number;
  posRequestId: string;
  organizerId: string;
  organizerUserId: string;
  shopperUserId: string;
  saleId: string;
  isSplitPayment: boolean;
  stripeConnectId: string;
}

export interface CreatePaymentSuccess {
  ok: true;
  paymentIntentId: string;
  clientSecret: string;
}
export interface CreatePaymentFailure {
  ok: false;
  status: number;
  message: string;
}
export type CreatePaymentResult = CreatePaymentSuccess | CreatePaymentFailure;

/**
 * Payment creation -- unchanged: PaymentIntent created at REQUEST time (not accept time),
 * matching Stripe's existing, already-live behavior exactly.
 */
export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  try {
    const paymentIntent = await stripe().paymentIntents.create(
      {
        amount: params.cardAmountCents,
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: params.platformFeeCents,
        metadata: {
          requestId: params.posRequestId,
          organizerId: params.organizerId,
          organizerUserId: params.organizerUserId,
          shopperId: params.shopperUserId,
          saleId: params.saleId,
          source: 'pos_payment_request',
          isSplitPayment: params.isSplitPayment ? 'true' : 'false',
        },
      },
      {
        stripeAccount: params.stripeConnectId,
        idempotencyKey: `pos-payment-request-${params.posRequestId}`,
      }
    );
    return { ok: true, paymentIntentId: paymentIntent.id, clientSecret: paymentIntent.client_secret! };
  } catch (err: any) {
    console.error('[stripePosPaymentAdapter] Failed to create Stripe Payment Intent:', err);
    return { ok: false, status: 500, message: err.message || 'Failed to create payment intent' };
  }
}

export interface RetrieveAndVerifyParams {
  paymentIntentId: string;
  stripeConnectId: string;
  posRequestId: string;
}
export interface RetrieveAndVerifySuccess {
  ok: true;
  externalPaymentId: string;
}
export interface RetrieveAndVerifyFailure {
  ok: false;
  status: number;
  message: string;
}
export type RetrieveAndVerifyResult = RetrieveAndVerifySuccess | RetrieveAndVerifyFailure;

/**
 * Retrieve/confirm + status check -- unchanged. Verifies the PaymentIntent actually
 * succeeded and belongs to this exact request before the controller proceeds to
 * fulfillment (Purchase creation, stock decrement, etc).
 */
export async function retrieveAndVerifyPayment(
  params: RetrieveAndVerifyParams
): Promise<RetrieveAndVerifyResult> {
  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe().paymentIntents.retrieve(
      params.paymentIntentId,
      {},
      { stripeAccount: params.stripeConnectId }
    );
  } catch (err: any) {
    console.error('[stripePosPaymentAdapter] Failed to retrieve PaymentIntent:', err);
    return { ok: false, status: 400, message: 'Could not verify payment with Stripe' };
  }

  if (paymentIntent.status !== 'succeeded') {
    return {
      ok: false,
      status: 400,
      message: `Payment intent status is ${paymentIntent.status}, expected succeeded`,
    };
  }

  if (
    paymentIntent.metadata?.source !== 'pos_payment_request' ||
    paymentIntent.metadata?.requestId !== params.posRequestId
  ) {
    return { ok: false, status: 400, message: 'Payment intent does not match this payment request' };
  }

  return { ok: true, externalPaymentId: paymentIntent.id };
}

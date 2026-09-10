import { randomUUID } from 'crypto';
import {
  createSquareCheckoutLink,
  type CreateSquareCheckoutLinkResult,
} from './squareCheckoutLinkService';
import { buildSquareIdempotencyKey } from './squarePaymentService'; // Square idempotency_key is capped at 45 chars (see that function's own header) -- a raw `hold-invoice-<uuid>` string is 49 chars and would 400 against the live API

/**
 * Hold-to-Pay invoice creation, Square branch -- Square changeover Wave S2 #3 (2026-09-09).
 *
 * Shared by BOTH Hold-to-Pay invoice creation entry points --
 * reservationController.ts's markSoldAndCreateInvoice and posController.ts's
 * sendHoldInvoice (card/balance-due leg only; the fully-cash leg never touches a
 * processor at all and is unaffected by this file) -- so the pre-generated-id +
 * paymentNote correlation trick below is implemented exactly once instead of drifting
 * between the two call sites. See claude_docs/feature-notes/
 * square-changeover-remaining-work-scoping-2026-09-09.md Section 1.4 Wave S2 #3.
 *
 * WHY THE HOLDINVOICE ID IS PRE-GENERATED HERE, BEFORE THE HOLDINVOICE ROW EXISTS:
 * squareCheckoutLinkService.ts's own header comment ("SQUARE HAS NO METADATA FIELD ON A
 * PAYMENT LINK") is explicit that Square's payment-link paymentNote is a "best-effort,
 * lossy" channel and that durable correlation should key off the returned
 * paymentLinkId/orderId stored on the caller's own DB row -- but HoldInvoice has no
 * squarePaymentLinkId/squareOrderId column (confirmed via a direct schema.prisma read
 * this dispatch), and Square's Payment Links API has no UpdatePaymentLink-style call
 * that can backfill paymentNote after creation the way stripeController.ts /
 * reservationController.ts backfill a Stripe PaymentIntent's metadata.invoiceId once the
 * HoldInvoice row exists (see markSoldAndCreateInvoice's own "Payments fix (2026-08-03)"
 * comment). Since the note can only be set AT creation time, the invoice's id is
 * generated here -- a v4 UUID, not a real Prisma cuid. This is standard, fully-supported
 * Prisma behavior: HoldInvoice.id's `@default(cuid())` is only invoked when the `id`
 * field is OMITTED from `.create()`; supplying `id` explicitly produces an equally valid,
 * equally unique primary key. Generating it BEFORE either the Square call or the
 * HoldInvoice.create() call lets the SAME real, exact-match id carry all the way through:
 * Square's paymentNote -> the resulting Payment.note (Square's own docs: paymentNote is
 * "attached to the resulting Payment once paid") -> squareWebhookController.ts decodes it
 * back out of `payment.note` on `payment.updated` to find this exact HoldInvoice row and
 * call markHoldInvoicePaid. This is a single, short, single-key note ("invoiceId=<uuid>")
 * with no truncation or collision risk (well inside the 500-char cap) -- it is NOT the
 * free-form multi-key case that file's header comment is cautioning callers against.
 *
 * RESOLVED (Wave S3 follow-up, 2026-09-09): HoldInvoice now has squarePaymentLinkId/
 * squareOrderId columns (schema migration applied and DB-verified this session). Both
 * callers of this helper (reservationController.ts's markSoldAndCreateInvoice,
 * posController.ts's sendHoldInvoice) persist the returned paymentLinkId/orderId onto
 * their HoldInvoice.create() call immediately after a successful result -- this helper
 * itself does not write to the DB (see "callers... must not create the HoldInvoice row
 * before calling this function" below), so the persistence happens at each call site,
 * not here. This closes the gap this comment used to document: invoiceExpiryJob.ts's
 * Square-side revert branch can now call deleteSquareCheckoutLink against a real,
 * persisted squarePaymentLinkId instead of only being able to revert the item server-side.
 */

export interface CreateHoldInvoiceSquareCheckoutParams {
  organizerId: string;
  /** Pre-generated HoldInvoice.id -- the caller MUST pass this same value to
   *  `prisma.holdInvoice.create({ data: { id: ... } })` immediately after a successful
   *  result, and must NOT create the HoldInvoice row before calling this function (the
   *  Square Payment Link's paymentNote can only be set at link-creation time). */
  holdInvoiceId: string;
  amountCents: number;
  description: string;
  /** 0 means no application fee -- see createSquareCheckoutLink's own doc. */
  appFeeCents: number;
}

export type CreateHoldInvoiceSquareCheckoutResult = CreateSquareCheckoutLinkResult;

/** Generates the pre-assigned HoldInvoice.id used for BOTH the Square idempotencyKey and
 *  the paymentNote correlation value. Call once per invoice-creation attempt, before
 *  createHoldInvoiceSquareCheckout. */
export function generateHoldInvoiceId(): string {
  return randomUUID();
}

/** The paymentNote key both this file's encode side (via createSquareCheckoutLink's
 *  `metadata` param) and squareWebhookController.ts's decode side agree on. Exported so
 *  the two ends of the pair are traceable to one definition instead of a duplicated
 *  string literal drifting apart later. */
export const HOLD_INVOICE_NOTE_KEY = 'invoiceId';

/**
 * Creates the Square Payment Link for a Hold-to-Pay invoice's card/balance-due leg.
 * Callers: on success, create the HoldInvoice row with `id: holdInvoiceId` and
 * `processor: 'SQUARE'`, `stripeSessionId: null`, `stripePaymentIntentId: null`. On
 * failure (`ok: false`) or a thrown `SquareOnboardingIncompleteError`, no HoldInvoice
 * row should be created at all -- same "external call first, DB row second" ordering
 * the Stripe branch already follows in both call sites, just with the id pre-assigned
 * so the paymentNote can carry it.
 */
export async function createHoldInvoiceSquareCheckout(
  params: CreateHoldInvoiceSquareCheckoutParams
): Promise<CreateHoldInvoiceSquareCheckoutResult> {
  return createSquareCheckoutLink({
    organizerId: params.organizerId,
    idempotencyKey: buildSquareIdempotencyKey(['hold-invoice', params.holdInvoiceId]),
    amountCents: params.amountCents,
    description: params.description,
    appFeeCents: params.appFeeCents,
    metadata: { [HOLD_INVOICE_NOTE_KEY]: params.holdInvoiceId },
  });
}

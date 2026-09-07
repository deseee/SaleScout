import { Request, Response } from 'express';
import { WebhooksHelper } from 'square';
import { prisma } from '../lib/prisma';
import { createNotification } from '../lib/notificationService';

/**
 * Square webhook payload envelope shape (confirmed via live fetch of Square's webhook event
 * catalog + individual event-type reference pages, 2026-09-07 -- see the Wave 1 #5 dispatch
 * handoff for citations). EVERY Square webhook event (unlike Stripe) carries
 * merchant_id/event_id/type at the TOP level of the envelope, not nested inside data.object.
 */
interface SquareWebhookEnvelope {
  merchant_id?: string;
  location_id?: string;
  type: string;
  event_id: string;
  created_at?: string;
  data?: {
    type?: string;
    id?: string;
    object?: Record<string, any>;
  };
}

/**
 * TODO (Wave 1 #1 -- Checkout, squarePaymentController.ts/squarePaymentService.ts, a
 * concurrent dispatch not yet built at the time this file was written): integration point
 * for real Square payment-status sync (Purchase/HoldInvoice/POSPaymentRequest records).
 * Deliberately NOT importing from a file that doesn't exist yet -- would break the build for
 * whichever dispatch lands second. Once that dispatch lands, replace this stub's body (or
 * this call site in handleSquareWebhook below) with the real sync call.
 */
async function syncSquarePaymentStatus(
  eventType: 'payment.created' | 'payment.updated',
  payment: any
): Promise<void> {
  console.log(
    `[square-webhook] ${eventType} received for Square payment ${payment?.id ?? 'unknown'} ` +
    `(status=${payment?.status ?? 'unknown'}, order_id=${payment?.order_id ?? 'unknown'}) -- ` +
    `payment-sync integration point (see TODO above), not yet wired.`
  );
}

/**
 * TODO (Wave 1 #4 -- Refunds/disputes, squareRefundService.ts, a concurrent dispatch not yet
 * built at the time this file was written): integration point for refund status sync.
 */
async function syncSquareRefundStatus(refund: any): Promise<void> {
  console.log(
    `[square-webhook] refund.updated received for Square refund ${refund?.id ?? 'unknown'} ` +
    `(status=${refund?.status ?? 'unknown'}, payment_id=${refund?.payment_id ?? 'unknown'}) -- ` +
    `refund-sync integration point (see TODO above), not yet wired.`
  );
}

/**
 * TODO (Wave 1 #4 -- Refunds/disputes, squareRefundService.ts's proposed
 * handleSquareDisputeWebhook, a concurrent dispatch not yet built at the time this file was
 * written): integration point for the real card-network dispute lifecycle. Keep fully
 * separate from FindA.Sale's own internal buyer-ticket Dispute model (disputeController.ts)
 * -- same separation the Stripe side already maintains (stripeController.ts's
 * charge.dispute.* handlers vs disputeController.ts).
 */
async function syncSquareDisputeStatus(
  eventType: 'dispute.created' | 'dispute.state.updated',
  dispute: any
): Promise<void> {
  console.log(
    `[square-webhook] ${eventType} received for Square dispute ${dispute?.id ?? 'unknown'} ` +
    `(state=${dispute?.state ?? 'unknown'}, disputed_payment_id=${dispute?.disputed_payment?.payment_id ?? 'unknown'}) -- ` +
    `dispute-sync integration point (see TODO above), not yet wired.`
  );
}

/**
 * TODO (Wave 1 #2 -- Connect-equivalent onboarding, squareConnectService.ts, a concurrent
 * dispatch not yet built at the time this file was written): THIS IS THE NAMED INTEGRATION
 * POINT for the bank-fingerprint fraud guard (mirrors connectAccountGuard.ts's
 * recordAndCheckBankFingerprints() on the Stripe side; writes should target
 * ConnectBankFingerprint rows with processor='SQUARE' per the Wave 0 schema addition).
 * Dispatch #2 should replace this stub's body -- or replace the call site below in
 * handleSquareWebhook -- with the real Square-side collision-detection logic, same
 * flag-don't-block posture as the Stripe guard (does not hard-block, since legitimate
 * shared-bank cases exist).
 *
 * NOTE (found live during this dispatch, 2026-09-07): Square's `BankAccount` object DOES
 * document a `fingerprint` field ("A Square-assigned, unique identifier for the bank account
 * based on the account information... can be used to compare account entries and determine
 * if they represent the same real-world bank account" --
 * developer.squareup.com/reference/square/objects/BankAccount) BUT the bank_account.verified
 * webhook's own example payload does NOT include `fingerprint` inside
 * `data.object.bank_account` (only id/account_number_suffix/country/currency/account_type/
 * holder_name/primary_bank_identification_number/location_id/status/creditable/debitable/
 * version/bank_name -- confirmed via a live fetch of that exact webhook's reference page).
 * This is new supporting evidence for the exact open question the scoping doc already
 * flagged for dispatch #2 ("whether Square exposes a connected merchant's bank-account
 * fingerprint via any API/webhook a third-party OAuth app can call... NOT confirmed") --
 * still unresolved here, not silently assumed either way. If the webhook payload truly omits
 * it, dispatch #2's documented polling fallback (GET /v2/merchants/{id} + the bank-accounts
 * endpoint on a cron) is probably required rather than optional.
 */
async function recordAndCheckSquareBankFingerprint(
  eventType: 'bank_account.created' | 'bank_account.verified',
  bankAccount: any,
  merchantId: string | undefined
): Promise<void> {
  const hasFingerprint = typeof bankAccount?.fingerprint === 'string' && bankAccount.fingerprint.length > 0;
  console.log(
    `[square-webhook] ${eventType} received for merchant ${merchantId ?? 'unknown'}, bank account ` +
    `${bankAccount?.id ?? 'unknown'} (fingerprint present in payload: ${hasFingerprint}) -- ` +
    `bank-fingerprint fraud-guard integration point (see TODO above), not yet wired to ConnectBankFingerprint.`
  );
}

/**
 * POST /api/square/webhook
 *
 * Verifies + processes Square webhook events. Mirrors billingController.ts's
 * handleStripeWebhook two-phase (PENDING -> COMPLETED | FAILED) idempotency pattern,
 * reusing the same shared ProcessedWebhookEvent table with a `square:${event_id}` namespace
 * prefix (confirmed live via grep, 2026-09-07: StripeEvent has zero writers anywhere in the
 * backend -- dead table, do not use it).
 *
 * Signature verification uses Square's own WebhooksHelper.verifySignature (from the `square`
 * npm package) rather than hand-rolled HMAC comparison, per CLAUDE.md dispatch instructions.
 */
export const handleSquareWebhook = async (req: Request, res: Response) => {
  let event: SquareWebhookEnvelope | undefined;
  let idempotencyKey = '';

  try {
    const signatureHeader = req.headers['x-square-hmacsha256-signature'] as string | undefined;
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

    if (!signatureKey || !notificationUrl) {
      console.error('[square-webhook] SQUARE_WEBHOOK_SIGNATURE_KEY or SQUARE_WEBHOOK_NOTIFICATION_URL not configured');
      return res.status(500).json({ message: 'Square webhook not configured' });
    }

    if (!signatureHeader) {
      console.warn('[square-webhook] Missing x-square-hmacsha256-signature header -- rejecting.');
      return res.status(400).json({ message: 'Missing signature header' });
    }

    // express.raw() (wired in index.ts, mirrors the Stripe/billing webhook routes) leaves
    // req.body as a Buffer -- WebhooksHelper.verifySignature needs the exact raw string body
    // (it concatenates notificationUrl + requestBody before HMAC'ing -- confirmed via the
    // `square` npm package's own source, wrapper/WebhooksHelper.js).
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body ?? '');

    let isValid = false;
    try {
      isValid = await WebhooksHelper.verifySignature({
        requestBody: rawBody,
        signatureHeader,
        signatureKey,
        notificationUrl,
      });
    } catch (verifyErr: any) {
      console.error('[square-webhook] Signature verification threw:', verifyErr?.message || verifyErr);
      return res.status(400).json({ message: 'Webhook signature verification failed' });
    }

    if (!isValid) {
      console.warn('[square-webhook] Signature verification failed -- rejecting event.');
      return res.status(400).json({ message: 'Webhook signature verification failed' });
    }

    try {
      event = JSON.parse(rawBody) as SquareWebhookEnvelope;
    } catch (parseErr: any) {
      console.error('[square-webhook] Failed to parse verified webhook body as JSON:', parseErr?.message || parseErr);
      return res.status(400).json({ message: 'Invalid JSON body' });
    }

    if (!event?.event_id || !event?.type) {
      console.warn('[square-webhook] Verified event missing event_id/type -- rejecting.');
      return res.status(400).json({ message: 'Malformed event' });
    }

    // Namespaced idempotency key -- exact same pattern billingController.ts uses for
    // `billing:${event.id}` (billingController.ts:118), applied to Square's `event_id` field
    // (Square's envelope names it event_id, not id, unlike Stripe's Event object).
    idempotencyKey = `square:${event.event_id}`;

    // INSERT-FIRST preserves the P0 concurrent-duplicate race guard (first inserter wins) --
    // same two-phase status idiom as billingController.ts / stripeController.ts.
    try {
      await prisma.processedWebhookEvent.create({
        data: { eventId: idempotencyKey, status: 'PENDING' },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        const existing = await prisma.processedWebhookEvent
          .findUnique({ where: { eventId: idempotencyKey } })
          .catch(() => null);
        if (existing?.status === 'COMPLETED') {
          console.warn(`[square-webhook] Duplicate event ${event.event_id} (type: ${event.type}) already COMPLETED -- skipping.`);
          return res.json({ received: true, duplicate: true });
        }
        if (existing?.status === 'FAILED') {
          console.warn(`[square-webhook] Event ${event.event_id} (type: ${event.type}) previously FAILED -- reprocessing.`);
          await prisma.processedWebhookEvent
            .update({ where: { eventId: idempotencyKey }, data: { status: 'PENDING' } })
            .catch(() => {});
          // fall through to reprocess below
        } else {
          console.warn(`[square-webhook] Event ${event.event_id} (type: ${event.type}) in-flight (PENDING) -- skipping concurrent reprocess.`);
          return res.json({ received: true, duplicate: true });
        }
      } else {
        console.warn(`[square-webhook] Failed to check idempotency for event ${event.event_id}:`, err);
      }
    }

    console.log(`[square-webhook] Received event ${event.event_id} type=${event.type} merchant=${event.merchant_id ?? 'unknown'}`);

    const dataObject = event.data?.object ?? {};

    // Wrap the entire switch so any handler throw marks the idempotency row FAILED (not
    // permanently COMPLETED) and returns 500 -> Square retries with backoff, instead of
    // silently stranding an event (same posture as stripeController.ts's webhookHandler).
    switch (event.type) {
      case 'payment.created':
      case 'payment.updated': {
        const payment = dataObject.payment ?? {};
        await syncSquarePaymentStatus(event.type as 'payment.created' | 'payment.updated', payment);
        break;
      }

      case 'refund.updated': {
        const refund = dataObject.refund ?? {};
        await syncSquareRefundStatus(refund);
        break;
      }

      case 'dispute.created':
      case 'dispute.state.updated': {
        const dispute = dataObject.dispute ?? {};
        await syncSquareDisputeStatus(event.type as 'dispute.created' | 'dispute.state.updated', dispute);
        break;
      }

      case 'bank_account.created':
      case 'bank_account.verified': {
        const bankAccount = dataObject.bank_account ?? {};
        await recordAndCheckSquareBankFingerprint(
          event.type as 'bank_account.created' | 'bank_account.verified',
          bankAccount,
          event.merchant_id
        );
        break;
      }

      case 'payout.paid':
      case 'payout.failed': {
        // Self-contained -- mirrors stripeController.ts's payout.paid/payout.failed handlers
        // (:3916-4010), but simpler: EVERY Square webhook envelope carries merchant_id at the
        // top level (confirmed live via Square's own docs, 2026-09-07), unlike Stripe where
        // payout.paid/failed needed event.account (a Connect-specific quirk) instead of the
        // usual event.data.object shape. Resolve Organizer directly off event.merchant_id ->
        // Organizer.squareMerchantId (Wave 0 schema field).
        const payout = dataObject.payout ?? {};
        const merchantId = event.merchant_id;

        if (!merchantId) {
          console.warn(`[square-webhook] ${event.type} event ${event.event_id} has no merchant_id -- cannot resolve organizer, skipping.`);
          break;
        }

        try {
          const organizer = await prisma.organizer.findFirst({
            where: { squareMerchantId: merchantId },
            select: { id: true, userId: true },
          });

          if (organizer) {
            const currency = payout?.amount_money?.currency_code || payout?.amount_money?.currency || 'USD';
            const amountFormatted = `$${((payout?.amount_money?.amount ?? 0) / 100).toFixed(2)} ${String(currency).toUpperCase()}`;
            const arrival = payout?.arrival_date
              ? new Date(payout.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null;

            if (event.type === 'payout.paid') {
              await createNotification({
                userId: organizer.userId,
                type: 'payout_paid',
                title: 'Your payout has landed',
                body: `Your payout of ${amountFormatted} has been sent to your bank account${arrival ? ` (estimated arrival ${arrival})` : ''}.`,
                link: '/organizer/payouts',
                channel: 'OPERATIONAL',
                sendEmail: true,
              }).catch((err) => console.error(`[square-webhook] Failed to create payout_paid notification for organizer ${organizer.id}:`, err));
            } else {
              // payout.failed -- Square's Payout object (per live docs, 2026-09-07) does not
              // document a failure_message/failure_code field the way Stripe's Payout does;
              // only `status` is confirmed present. Generic message until/unless a real
              // failure-reason field is confirmed against a live payload -- flagged in the
              // handoff, not guessed at.
              await createNotification({
                userId: organizer.userId,
                type: 'payout_failed',
                title: 'Your payout failed',
                body: `Your payout of ${amountFormatted} could not be completed. Check your Square Dashboard for details, or contact support.`,
                link: '/organizer/payouts',
                channel: 'OPERATIONAL',
                sendEmail: true,
              }).catch((err) => console.error(`[square-webhook] Failed to create payout_failed notification for organizer ${organizer.id}:`, err));
            }
          } else {
            console.warn(`[square-webhook] ${event.type}: no Organizer found for Square merchant ${merchantId}`);
          }
        } catch (err) {
          console.error(`[square-webhook] Failed to process ${event.type} for merchant ${merchantId}:`, err);
        }
        break;
      }

      default:
        // Billing-only (subscription lifecycle) and every other Square event type are
        // correctly out of scope -- billing stays on Stripe permanently (see the Square
        // scoping doc's Wave 1 #5 section).
        console.log(`[square-webhook] Unhandled event type ${event.type} -- ignoring.`);
        break;
    }

    // Terminal state written only AFTER the switch completed successfully (mirrors
    // billingController.ts:382-385 / stripeController.ts:2686-2689).
    await prisma.processedWebhookEvent.update({
      where: { eventId: idempotencyKey },
      data: { status: 'COMPLETED' },
    }).catch((e) => console.warn(`[square-webhook] Failed to mark event ${event?.event_id} COMPLETED:`, e));

    res.json({ received: true });
  } catch (handlerErr: any) {
    // Mark FAILED so a Square retry is allowed to REPROCESS (fail-open) instead of being
    // short-circuited by a COMPLETED row that was never actually earned (mirrors
    // billingController.ts:387-402 / stripeController.ts's webhookHandler catch).
    if (idempotencyKey) {
      await prisma.processedWebhookEvent.update({
        where: { eventId: idempotencyKey },
        data: { status: 'FAILED' },
      }).catch((e) => console.warn(`[square-webhook] Failed to mark event ${event?.event_id} FAILED:`, e));
    }
    console.error(`[square-webhook] handler threw for event ${event?.event_id} type=${event?.type}`, handlerErr);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  }
};

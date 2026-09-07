import { prisma as prismaClient } from '../lib/prisma';

type PrismaClientLike = typeof prismaClient;

/**
 * Square Payment Eligibility Gate -- Square-flavored sibling of
 * services/paymentEligibilityService.ts's assertSaleCanAcceptPayment.
 *
 * WHY A SEPARATE FUNCTION INSTEAD OF PARAMETERIZING THE EXISTING ONE: the Stripe version's
 * Fix 1 check is Stripe-account-shaped (`!organizerStripeConnectId ||
 * organizerStripeConnectId.startsWith('acct_test_') || organizerStripeOnboarded !== true`)
 * -- the `acct_test_` seeded-placeholder prefix check has no Square equivalent (Square
 * merchant ids have a different format and FindA.Sale never seeds a Square placeholder
 * value the way it once did for Stripe). Overloading the Stripe function with an
 * optional "which processor" flag would make its one already-carefully-audited
 * carding-incident-driven code path (2026-08-27, 2026-09-03 fixes) harder to reason
 * about for a live production gate. A small, clearly-named sibling is safer than a
 * conditional inside the original.
 *
 * Fix 2 (sale must be PUBLISHED) and Fix 3 (velocity/anomaly circuit breaker) are
 * IDENTICAL in shape and reuse the SAME Sale.paymentsHeldAt/paymentsHeldReason columns --
 * those are processor-agnostic, shared platform-wide state (a sale held by a Stripe-side
 * carding burst must also block a Square checkout attempt against that same sale, and
 * vice versa). This is deliberately NOT a duplicated/independent circuit breaker.
 */

export interface SquareSaleEligibilityInput {
  id: string;
  status: string;
  paymentsHeldAt: Date | null;
}

export interface SquarePaymentEligibilityBlockedResult {
  blocked: true;
  status: number;
  body: { message: string; code: string };
}

export interface SquarePaymentEligibilityAllowedResult {
  blocked: false;
}

export type SquarePaymentEligibilityResult =
  | SquarePaymentEligibilityBlockedResult
  | SquarePaymentEligibilityAllowedResult;

const SALE_PAYMENTS_HELD_RESPONSE = {
  status: 409 as const,
  body: {
    message: 'This sale is temporarily unavailable for purchases. Please try again later or contact support.',
    code: 'SALE_PAYMENTS_HELD',
  },
};

export async function assertSaleCanAcceptSquarePayment(params: {
  prisma: PrismaClientLike;
  sale: SquareSaleEligibilityInput;
  organizerSquareMerchantId: string | null | undefined;
  organizerSquareOnboarded: boolean | null | undefined;
}): Promise<SquarePaymentEligibilityResult> {
  const { prisma, sale, organizerSquareMerchantId, organizerSquareOnboarded } = params;

  // Fix 1 -- require completed Square onboarding. Same response shape as the Stripe
  // equivalent's SELLER_PAYMENTS_UNAVAILABLE so the frontend's existing handling covers
  // this path unchanged.
  if (!organizerSquareMerchantId || organizerSquareOnboarded !== true) {
    return {
      blocked: true,
      status: 409,
      body: {
        message: "This seller isn't set up to accept online payments yet. Please contact the organizer to arrange your purchase.",
        code: 'SELLER_PAYMENTS_UNAVAILABLE',
      },
    };
  }

  // Fix 2 -- sale must be PUBLISHED.
  if (sale.status !== 'PUBLISHED') {
    return {
      blocked: true,
      status: 409,
      body: { message: 'This sale is no longer active.', code: 'SALE_NOT_ACTIVE' },
    };
  }

  // Fix 3a -- already held: fast path, no query needed.
  if (sale.paymentsHeldAt) {
    return { blocked: true, ...SALE_PAYMENTS_HELD_RESPONSE };
  }

  // Fix 3b -- velocity/anomaly circuit breaker, keyed on DECLINE RATE, identical shape to
  // paymentEligibilityService.ts's own check (see that file's header comment for the full
  // 2026-08-27 incident rationale). Purchase.status/createdAt/saleId are processor-agnostic
  // columns, so this reads the SAME rolling window Stripe purchases against this sale would
  // also be counted in.
  const recentPurchases = await prisma.purchase.findMany({
    where: { saleId: sale.id, createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) } },
    select: { status: true },
  });

  const totalAttempts = recentPurchases.length;
  const failedCount = recentPurchases.filter((p) => p.status === 'FAILED').length;
  const failureRate = totalAttempts > 0 ? failedCount / totalAttempts : 0;

  if (failedCount >= 3 && failureRate >= 0.3) {
    const reason = `VELOCITY_ANOMALY: ${failedCount} FAILED out of ${totalAttempts} purchase attempts (${Math.round(failureRate * 100)}%) within 30min`;
    await prisma.sale.update({
      where: { id: sale.id },
      data: { paymentsHeldAt: new Date(), paymentsHeldReason: reason },
    });
    return { blocked: true, ...SALE_PAYMENTS_HELD_RESPONSE };
  }

  return { blocked: false };
}

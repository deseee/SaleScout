-- Square migration, vendor-booth-cart-checkout dispatch (2026-09-07). Purely additive --
-- no column dropped, renamed, or made NOT NULL without a default. Zero downtime.
-- See claude_docs/feature-notes/square-replaces-stripe-architecture-and-scoping-2026-09-07.md
-- ("Vendor-Booth-Cart-Checkout Scoping Pass" section) for the design this migration implements.

-- ============================================================
-- Part A -- BoothCartTransaction: transient shopper->register token relay slot for the
-- Square QR/in-app rail (Square has no server-hosted session object like Stripe's SetupIntent
-- the register can poll directly -- see schema.prisma's comment on these columns for the full
-- rationale).
-- ============================================================
ALTER TABLE "BoothCartTransaction" ADD COLUMN "squarePendingSourceId" TEXT;
ALTER TABLE "BoothCartTransaction" ADD COLUMN "squarePendingSourceIdSetAt" TIMESTAMP(3);

-- ============================================================
-- Part B -- VendorBoothPayout: processor discriminator + Square sibling id (scoping-pass
-- correction: already-nullable stripeTransferId means no design decision was needed here).
-- Not yet written by any Square code path this dispatch built -- see handoff item 5
-- (transferHubOwnerShareForLeg no-ops for SQUARE legs; a future settlement-sweep mechanism
-- would populate this column).
-- ============================================================
ALTER TABLE "VendorBoothPayout" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "VendorBoothPayout" ADD COLUMN "squareTransferId" TEXT;

-- ============================================================
-- Part C -- VendorBoothFeeCharge: same additive discriminator + sibling id columns. Model
-- stays dormant in production (confirmed by the scoping pass) -- no Square logic built for it
-- this dispatch, added purely for forward-compatibility so a future dispatch needs no migration.
-- ============================================================
ALTER TABLE "VendorBoothFeeCharge" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "VendorBoothFeeCharge" ADD COLUMN "squarePaymentId" TEXT;
ALTER TABLE "VendorBoothFeeCharge" ADD COLUMN "squareTransferId" TEXT;

DROP INDEX IF EXISTS "VendorBoothFeeCharge_squarePaymentId_key";
CREATE UNIQUE INDEX "VendorBoothFeeCharge_squarePaymentId_key" ON "VendorBoothFeeCharge" ("squarePaymentId");

DROP INDEX IF EXISTS "VendorBoothFeeCharge_squarePaymentId_idx";
CREATE INDEX "VendorBoothFeeCharge_squarePaymentId_idx" ON "VendorBoothFeeCharge" ("squarePaymentId");

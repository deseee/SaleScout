-- Square migration Wave 0 (2026-09-07) — schema prerequisite for replacing Stripe with Square.
-- Purely additive: every new column is nullable or has a default. No existing column is
-- dropped, renamed, or made non-nullable. Zero data loss, zero downtime.
--
-- Scope note: BoothCartLeg, VendorBoothPayout, and VendorBoothFeeCharge are deliberately
-- EXCLUDED from this migration. BoothCartLeg.stripePaymentIntentId is NOT NULL, so it cannot
-- be purely-additively extended the way the models below can — vendor-booth-cart checkout is
-- being scoped as its own separate surface (see claude_docs/feature-notes/
-- square-replaces-stripe-architecture-and-scoping-2026-09-07.md).

-- ============================================================
-- Purchase
-- ============================================================
ALTER TABLE "Purchase" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "Purchase" ADD COLUMN "squarePaymentId" TEXT;

-- Mirrors the existing Purchase_stripePaymentIntentId_itemId_unique compound partial-unique
-- index (see migration 20260723000000_purchase_pi_itemid_compound_unique): a single Square
-- Payment can span multiple Purchase rows in a multi-item cart, so uniqueness is scoped to
-- (squarePaymentId, itemId), not squarePaymentId alone, and only enforced when non-null.
DROP INDEX IF EXISTS "Purchase_squarePaymentId_itemId_unique";
CREATE UNIQUE INDEX "Purchase_squarePaymentId_itemId_unique"
  ON "Purchase" ("squarePaymentId", "itemId")
  WHERE "squarePaymentId" IS NOT NULL;

-- ============================================================
-- POSPaymentRequest
-- ============================================================
ALTER TABLE "POSPaymentRequest" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "POSPaymentRequest" ADD COLUMN "squarePaymentId" TEXT;
ALTER TABLE "POSPaymentRequest" ADD COLUMN "squareSourceId" TEXT;
ALTER TABLE "POSPaymentRequest" ADD COLUMN "squareLocationId" TEXT;

DROP INDEX IF EXISTS "POSPaymentRequest_squarePaymentId_key";
CREATE UNIQUE INDEX "POSPaymentRequest_squarePaymentId_key"
  ON "POSPaymentRequest" ("squarePaymentId");

-- ============================================================
-- HoldInvoice
-- ============================================================
ALTER TABLE "HoldInvoice" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "HoldInvoice" ADD COLUMN "squarePaymentId" TEXT;

DROP INDEX IF EXISTS "HoldInvoice_squarePaymentId_key";
CREATE UNIQUE INDEX "HoldInvoice_squarePaymentId_key"
  ON "HoldInvoice" ("squarePaymentId");

-- ============================================================
-- ConsignorPayout (NOT ConsignorSettlementBatch — that model has no stripe field to mirror)
-- ============================================================
ALTER TABLE "ConsignorPayout" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "ConsignorPayout" ADD COLUMN "squareTransferId" TEXT;

-- ============================================================
-- ClientPayout
-- ============================================================
ALTER TABLE "ClientPayout" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "ClientPayout" ADD COLUMN "squareTransferId" TEXT;
ALTER TABLE "ClientPayout" ADD COLUMN "squareAccountId" TEXT;

DROP INDEX IF EXISTS "ClientPayout_squareTransferId_key";
CREATE UNIQUE INDEX "ClientPayout_squareTransferId_key"
  ON "ClientPayout" ("squareTransferId");

-- ============================================================
-- ConnectBankFingerprint
-- Additive only — stripeAccountId stays required/untouched. Whether the existing
-- @@unique([stripeAccountId, fingerprint, ownerType, ownerId]) needs to incorporate
-- processor/squareAccountId to catch a Stripe+Square collusion pair is an OPEN DESIGN
-- QUESTION left to the Connect-onboarding dispatch (Wave 1 #2) — not resolved here.
-- ============================================================
ALTER TABLE "ConnectBankFingerprint" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "ConnectBankFingerprint" ADD COLUMN "squareAccountId" TEXT;

-- ============================================================
-- Organizer
-- ============================================================
ALTER TABLE "Organizer" ADD COLUMN "squareMerchantId" TEXT;
ALTER TABLE "Organizer" ADD COLUMN "squareOnboarded" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organizer" ADD COLUMN "squareLocationId" TEXT;

-- ============================================================
-- Consignor
-- ============================================================
ALTER TABLE "Consignor" ADD COLUMN "squareAccountId" TEXT;
ALTER TABLE "Consignor" ADD COLUMN "squareOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- VendorBooth
-- Onboarding identity only. BoothCartLeg/VendorBoothPayout/VendorBoothFeeCharge (actual
-- booth-cart money movement) are NOT touched by this migration — see scope note above.
-- ============================================================
ALTER TABLE "VendorBooth" ADD COLUMN "squareAccountId" TEXT;
ALTER TABLE "VendorBooth" ADD COLUMN "squareOnboarded" BOOLEAN NOT NULL DEFAULT false;

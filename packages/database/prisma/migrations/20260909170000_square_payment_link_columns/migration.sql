-- Square PaymentLink checkout columns (2026-09-09): adds Square Payment Link / Order id
-- tracking to Purchase, HoldInvoice, and POSPaymentLink, and makes POSPaymentLink's Stripe
-- payment-link columns nullable so a SQUARE-processor link can omit them entirely --
-- mirrors the existing processor-column precedent already shipped on BoothCartLeg
-- (20260907020000_square_oauth_token_storage_and_boothcartleg_processor) and
-- POSPaymentRequest/Purchase/HoldInvoice (20260907010000_square_migration_wave0_schema).
-- See claude_docs/feature-notes/square-changeover-remaining-work-scoping-2026-09-09.md.
--
-- Purely additive except the two POSPaymentLink Stripe-column relaxations (DROP NOT NULL).
-- Safe: both columns have been NOT NULL since POSPaymentLink was created, so every existing
-- row already has a non-NULL value -- this is a metadata-only change, no table rewrite, no
-- backfill required. No column is dropped or renamed and no existing Stripe-path data or
-- behavior changes. Hand-authored to match schema.prisma exactly -- `prisma migrate dev`
-- cannot run in this sandbox (packages/backend/node_modules/@prisma/client is a broken NTFS
-- junction here, confirmed recurring across prior sessions). Applied for real via Patrick's
-- own `prisma migrate deploy` run against Railway.

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "squarePaymentLinkId" TEXT,
ADD COLUMN     "squareOrderId" TEXT;

-- CreateIndex
CREATE INDEX "Purchase_squarePaymentId_idx" ON "Purchase"("squarePaymentId");

-- CreateIndex
CREATE INDEX "Purchase_squarePaymentLinkId_idx" ON "Purchase"("squarePaymentLinkId");

-- AlterTable
ALTER TABLE "HoldInvoice" ADD COLUMN     "squarePaymentLinkId" TEXT,
ADD COLUMN     "squareOrderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "HoldInvoice_squarePaymentLinkId_key" ON "HoldInvoice"("squarePaymentLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "HoldInvoice_squareOrderId_key" ON "HoldInvoice"("squareOrderId");

-- CreateIndex
CREATE INDEX "HoldInvoice_squarePaymentLinkId_idx" ON "HoldInvoice"("squarePaymentLinkId");

-- AlterTable
ALTER TABLE "POSPaymentLink" ALTER COLUMN "stripePaymentLinkId" DROP NOT NULL,
ALTER COLUMN "stripePaymentLinkUrl" DROP NOT NULL,
ADD COLUMN     "processor" TEXT NOT NULL DEFAULT 'STRIPE',
ADD COLUMN     "squarePaymentLinkId" TEXT,
ADD COLUMN     "squareOrderId" TEXT,
ADD COLUMN     "squarePaymentLinkUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "POSPaymentLink_squarePaymentLinkId_key" ON "POSPaymentLink"("squarePaymentLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "POSPaymentLink_squareOrderId_key" ON "POSPaymentLink"("squareOrderId");

-- CreateIndex
CREATE INDEX "POSPaymentLink_squarePaymentLinkId_idx" ON "POSPaymentLink"("squarePaymentLinkId");

-- CreateIndex
CREATE INDEX "POSPaymentLink_squareOrderId_idx" ON "POSPaymentLink"("squareOrderId");

-- Square migration Wave 0.5 (2026-09-07) -- closes the OAuth-token-storage schema gap flagged
-- by all four Wave 1 money-movement dispatches (checkout #1, Connect-equivalent onboarding #2,
-- POS #3, refunds #4 -- each shipped a resolve-token integration seam that always threw because
-- nowhere existed to persist a Square OAuth access/refresh token), and resolves the previously-
-- deferred BoothCartLeg schema decision (Option A -- see claude_docs/feature-notes/
-- square-replaces-stripe-architecture-and-scoping-2026-09-07.md, "Vendor-Booth-Cart-Checkout
-- Scoping Pass" section).
--
-- Purely additive except one column relaxation (BoothCartLeg.stripePaymentIntentId dropped to
-- nullable). No column is dropped or renamed. No existing Stripe-path data or behavior changes.
-- Zero downtime: every ADD COLUMN below is nullable or has a default; the DROP NOT NULL is a
-- metadata-only change; the new CHECK constraint is validated immediately but is provably
-- satisfied by 100% of existing rows (see the comment above it).

-- ============================================================
-- Part A -- Square OAuth token storage (Option 1: parallel encrypted columns directly on
-- each of the three owner models, continuing Wave 0's own established convention of putting
-- Square identity fields directly on Organizer/Consignor/VendorBooth rather than a shared
-- ownerType/ownerId-keyed table like MarketplaceAccount -- see schema.prisma's comment on
-- Organizer.squareAccessTokenEncrypted for the full rationale).
--
-- Tokens are APPLICATION-LAYER encrypted via packages/backend/src/utils/tokenCrypto.ts
-- (enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>) BEFORE they ever reach these columns --
-- these are plain TEXT columns at the DB layer, exactly mirroring MarketplaceAccount.
-- accessToken/refreshToken's existing precedent (schema.prisma ~6657).
-- ============================================================

ALTER TABLE "Organizer" ADD COLUMN "squareAccessTokenEncrypted" TEXT;
ALTER TABLE "Organizer" ADD COLUMN "squareRefreshTokenEncrypted" TEXT;
ALTER TABLE "Organizer" ADD COLUMN "squareTokenExpiresAt" TIMESTAMP(3);

ALTER TABLE "Consignor" ADD COLUMN "squareAccessTokenEncrypted" TEXT;
ALTER TABLE "Consignor" ADD COLUMN "squareRefreshTokenEncrypted" TEXT;
ALTER TABLE "Consignor" ADD COLUMN "squareTokenExpiresAt" TIMESTAMP(3);

ALTER TABLE "VendorBooth" ADD COLUMN "squareAccessTokenEncrypted" TEXT;
ALTER TABLE "VendorBooth" ADD COLUMN "squareRefreshTokenEncrypted" TEXT;
ALTER TABLE "VendorBooth" ADD COLUMN "squareTokenExpiresAt" TIMESTAMP(3);

-- ============================================================
-- Part B -- BoothCartLeg Option A (multi-processor support for booth-cart-checkout legs)
-- ============================================================

-- Relax stripePaymentIntentId to nullable so a future SQUARE-processor leg can omit it
-- entirely. Safe: the column has been NOT NULL since it was created, so every existing row
-- already has a non-NULL value (a real PaymentIntent id, the 'claim_...' pre-authorization
-- token, or the 'cash_...' marker) -- this ALTER is metadata-only, no table rewrite, no risk
-- of introducing a NULL where the app doesn't expect one on any pre-existing row.
ALTER TABLE "BoothCartLeg" ALTER COLUMN "stripePaymentIntentId" DROP NOT NULL;

ALTER TABLE "BoothCartLeg" ADD COLUMN "processor" TEXT NOT NULL DEFAULT 'STRIPE';
ALTER TABLE "BoothCartLeg" ADD COLUMN "squarePaymentId" TEXT;

-- squarePaymentId gets its own unique index, mirroring stripePaymentIntentId's existing
-- @unique treatment (Postgres unique indexes permit unlimited NULLs, so this is safe with
-- every existing row's squarePaymentId being NULL today).
DROP INDEX IF EXISTS "BoothCartLeg_squarePaymentId_key";
CREATE UNIQUE INDEX "BoothCartLeg_squarePaymentId_key" ON "BoothCartLeg" ("squarePaymentId");

-- Mirrors the existing (already-redundant-with-the-unique-index, but precedented) explicit
-- btree @@index the codebase already keeps alongside stripePaymentIntentId's own @unique
-- constraint -- matching, not introducing, that convention for the new column.
DROP INDEX IF EXISTS "BoothCartLeg_squarePaymentId_idx";
CREATE INDEX "BoothCartLeg_squarePaymentId_idx" ON "BoothCartLeg" ("squarePaymentId");

-- App-level invariant promoted to a real DB CHECK constraint (Prisma's schema DSL cannot
-- express a CHECK constraint -- see the schema.prisma comment on this model for the pointer
-- back to this file): once a leg's status leaves 'PENDING', exactly one of
-- stripePaymentIntentId / squarePaymentId must be set (XOR). PENDING rows are exempt because
-- the existing Stripe-path claim token is written PRE-authorization while status is still
-- PENDING (see the model's own long-standing comment on stripeTransferId's 'CLAIMING'
-- sentinel and the model header comment) -- so a PENDING Stripe-path leg legitimately already
-- has stripePaymentIntentId set; a future PENDING Square-path leg may have neither set yet,
-- which this constraint also permits.
--
-- Added with immediate validation (not NOT VALID), which is safe here: the column was NOT
-- NULL until the ALTER two statements above, so literally every existing row --
-- regardless of status -- already has stripePaymentIntentId set and squarePaymentId NULL,
-- which satisfies the XOR unconditionally. There is no historical data that could fail this
-- check, so a two-step NOT VALID + VALIDATE CONSTRAINT split (normally preferred on a live
-- table to avoid a long-held lock during validation) buys no safety margin here -- the scan
-- is a guaranteed no-op pass over already-conforming data.
ALTER TABLE "BoothCartLeg"
  ADD CONSTRAINT "BoothCartLeg_processor_id_invariant"
  CHECK (
    "status" = 'PENDING'
    OR (("stripePaymentIntentId" IS NOT NULL) <> ("squarePaymentId" IS NOT NULL))
  );

-- Vendor booth Square onboarding notification stamp (2026-09-09). Sibling column to the
-- four lifecycle notification stamps added in 20260728190000_vendor_booth_lifecycle_notifications
-- (claimNotifiedAt / confirmNotifiedAt / decisionNotifiedAt / stripeNotifiedAt) -- same
-- "record that a send happened" pattern, one nullable TIMESTAMP column, additive only.
--
-- Purely additive: one nullable TIMESTAMP column on "VendorBooth". Nothing is dropped,
-- nothing is retyped, no default is applied, and no existing row changes meaning.
--
-- Backfill: deliberately none, matching the stripeNotifiedAt precedent. Every pre-existing
-- booth gets NULL, which is the truth -- no Square-onboarding-complete notification has
-- ever been sent by this codebase. A null value genuinely means "nobody has been told",
-- not "not tracked".
--
-- IF NOT EXISTS matches the exact syntax the sibling stripeNotifiedAt column was
-- originally created with in 20260728190000_vendor_booth_lifecycle_notifications/migration.sql.

ALTER TABLE "VendorBooth" ADD COLUMN IF NOT EXISTS "squareNotifiedAt" TIMESTAMP(3);

-- =====================================================================================
-- DESTRUCTIVE DRIFT RECONCILIATION -- PENDING PATRICK APPROVAL -- DO NOT APPLY
-- =====================================================================================
-- This file deliberately lives OUTSIDE prisma/migrations/, so `prisma migrate deploy`
-- will never pick it up. Nothing here runs until Patrick approves each item and it is
-- promoted into a real, dated migration folder.
--
-- Every statement below either DROPS an object or rewrites a primary key. Per CLAUDE.md
-- section 7 (Removal Gate) these are DECISIONS, not fixes -- each is presented with the
-- evidence and the alternative, and none is bundled with the additive migration
-- (20260817140000_reconcile_prod_drift_additive).
--
-- Evidence gathered 2026-08-17, read-only, against live Railway production.
-- Companion doc: claude_docs/architecture/ADR-108-production-drift-reconciliation-2026-08-17.md
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- ITEM D1 -- ProcessedWebhookEvent primary key. THREE-WAY DIVERGENCE. Recommend APPROVE.
-- >>> PROMOTED to migration 20260908120000_reconcile_prod_drift_destructive_d1_d2_d6_d7,
-- >>> 2026-09-08 -- no longer pending in this file. Re-verified live read-only before
-- >>> promotion; see that migration folder for the exact re-verification notes.
-- -------------------------------------------------------------------------------------
-- schema.prisma  : eventId String @id           (no `id` field at all)
-- production     : columns eventId/status/processedAt/updatedAt, NO PRIMARY KEY AT ALL --
--                  only UNIQUE("eventId"). The table was altered outside the migration history.
-- migration replay: CREATE TABLE ... "id" TEXT NOT NULL PRIMARY KEY (20260309200001).
--
-- Consequence today: a database rebuilt from migrations (CI, disaster recovery) has an extra
-- NOT NULL "id" column with no default that Prisma does not know about, so EVERY Stripe
-- webhook idempotency insert fails with a not-null violation. This is the single highest-impact
-- drift item found -- restoring from migrations produces a database where Stripe webhooks
-- cannot be recorded. Production is unaffected (the column is already gone there).
--
-- Direction: SCHEMA WINS. eventId is the correct key.
ALTER TABLE "ProcessedWebhookEvent" DROP COLUMN IF EXISTS "id";

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = '"ProcessedWebhookEvent"'::regclass AND contype = 'p'
  ) THEN
    ALTER TABLE "ProcessedWebhookEvent"
      ADD CONSTRAINT "ProcessedWebhookEvent_pkey" PRIMARY KEY ("eventId");
  END IF;
END $$;


-- -------------------------------------------------------------------------------------
-- ITEM D2 -- Seven indexes created by migrations but hand-dropped from production.
--            Recommend APPROVE for six; see D3 for the seventh.
-- >>> The six APPROVE indexes PROMOTED to migration
-- >>> 20260908120000_reconcile_prod_drift_destructive_d1_d2_d6_d7, 2026-09-08 -- no
-- >>> longer pending in this file. D3 (the seventh, MetroTopFinds) is untouched and
-- >>> still needs Patrick's A/B decision below.
-- -------------------------------------------------------------------------------------
-- Each was created by a real migration and then removed from production by hand -- no
-- migration drops them (verified: `grep -rn "DROP INDEX" */migration.sql` lists none of these).
-- The 2026-08-09 DB space pass is the probable cause.
--
-- Direction: PRODUCTION + SCHEMA AGREE, MIGRATION HISTORY IS WRONG. schema.prisma declares
-- none of these six, so nothing in the product expects them. Dropping them on a rebuilt DB
-- restores parity. Zero data loss -- these are indexes, and each is one CREATE INDEX away
-- from being restored if a query ever needs it.
DROP INDEX IF EXISTS "Sale_prelaunchAt_idx";
DROP INDEX IF EXISTS "Sale_status_markdownEnabled_markdownFloor_idx";
DROP INDEX IF EXISTS "Organizer_corroborationScore_idx";
DROP INDEX IF EXISTS "Organizer_sourceCount_idx";
DROP INDEX IF EXISTS "Organizer_directoryNextCheckAt_idx";
DROP INDEX IF EXISTS "idx_Organizer_cashFeeBalance_updatedAt";


-- -------------------------------------------------------------------------------------
-- ITEM D3 -- MetroTopFinds composite index. DECISION NEEDED -- two valid answers, pick one.
-- -------------------------------------------------------------------------------------
-- schema.prisma declares @@index([citySlug, soldAt]) and migration 20260501030000 creates
-- "MetroTopFinds_citySlug_soldAt_idx". Production does NOT have it; production instead has
-- three single-column indexes (citySlug, metro, soldAt) that no migration and no schema
-- declaration creates (they are restored by section 4 of the additive migration).
--
-- OPTION A (recommended, cheaper): production wins. Delete `@@index([citySlug, soldAt])` from
--   schema.prisma and drop the composite from rebuilt databases. Production has run on the
--   three singles for months; adding a composite back costs disk on the table the 2026-08-09
--   space pass was trying to shrink.
-- DROP INDEX IF EXISTS "MetroTopFinds_citySlug_soldAt_idx";
--
-- OPTION B: schema wins. Move `CREATE INDEX IF NOT EXISTS "MetroTopFinds_citySlug_soldAt_idx"
--   ON "MetroTopFinds"("citySlug","soldAt");` into the additive migration, which adds it to
--   production. Non-destructive, but costs index space in prod.


-- -------------------------------------------------------------------------------------
-- ITEM D4 -- Dead columns invisible to Prisma. DECISION NEEDED (Removal Gate).
-- -------------------------------------------------------------------------------------
-- Present in production, absent from schema.prisma, so Prisma can neither read nor write them.
-- None is harmful today; all four are pure disaster-recovery noise and wasted storage.
--
--   Item.isPrivate               BOOLEAN NOT NULL DEFAULT false -- ZERO code references anywhere
--                                in packages/ (grep-verified 2026-08-17). NOT a live feature.
--                                NOTE: the pending migration 20260817070000 currently ADDs this
--                                column and its comment claims "(schema.prisma)" -- that comment
--                                is wrong, the field is not in schema.prisma. Either drop the
--                                column here, or leave that ADD in place purely for parity.
--   Organizer.returnWindowHours  schema.prisma has returnWindowHours on Sale, not Organizer.
--   Sale.ripples                 shadowed by the SaleRipple[] relation of the same name.
--   Item.searchVector            full-text search column maintained by raw SQL, not Prisma.
--                                DO NOT DROP -- verified live 2026-08-17: itemSearchService.ts
--                                queries i."searchVector" in raw SQL at lines 139, 150 and 314.
--                                Correct fix is to declare it in schema.prisma, not remove it.
--
-- No statements are pre-written for these -- Patrick decides per column, and the correct fix
-- for searchVector is very likely "declare it in schema.prisma with Unsupported()", not a drop.


-- -------------------------------------------------------------------------------------
-- ITEM D5 -- OrganizerClaimEmail table. DECISION NEEDED (Removal Gate). Flagged in ADR-107.
-- -------------------------------------------------------------------------------------
-- Live table in production with 0 rows, absent from schema.prisma, carrying a real FK
-- (OrganizerClaimEmail_organizerId_fkey). It IS created by migrations 20260223014341 /
-- 20260501060000, so this is NOT replay drift -- production and a rebuilt DB agree. It is
-- schema drift only: Prisma cannot see the table at all. Zero rows, and zero code references
-- anywhere in packages/ (grep-verified 2026-08-17 -- only the two migration files match).
-- Alternative to dropping: declare the model in schema.prisma. Dropping is cleaner.
-- DROP TABLE IF EXISTS "OrganizerClaimEmail";


-- -------------------------------------------------------------------------------------
-- ITEM D6 -- TrailCheckIn.photoId + FK. Orphaned since the TrailPhoto/checkInId redesign.
-- Recommend APPROVE. Added 2026-09-07 (ADR-122).
-- >>> PROMOTED to migration 20260908120000_reconcile_prod_drift_destructive_d1_d2_d6_d7,
-- >>> 2026-09-08 -- no longer pending in this file.
-- -------------------------------------------------------------------------------------
-- schema.prisma:3663 carries an explicit comment: "photoId removed -- photos are queried
-- via TrailPhoto.checkInId" -- confirming this was an intentional design change that was
-- never migrated out of production. Live-verified 2026-09-07: column is nullable text,
-- 0 of 0 rows have a non-null value. Zero data loss.
--
-- Direction: SCHEMA WINS.
ALTER TABLE "TrailCheckIn" DROP CONSTRAINT IF EXISTS "TrailCheckIn_photoId_fkey";
ALTER TABLE "TrailCheckIn" DROP COLUMN IF EXISTS "photoId";


-- -------------------------------------------------------------------------------------
-- ITEM D7 -- WorkspaceMember.staffMemberId. Orphaned column. Recommend APPROVE.
-- Added 2026-09-07 (ADR-122).
-- >>> PROMOTED to migration 20260908120000_reconcile_prod_drift_destructive_d1_d2_d6_d7,
-- >>> 2026-09-08 -- no longer pending in this file.
-- -------------------------------------------------------------------------------------
-- Not declared anywhere in schema.prisma (the only staffMemberId field in the current
-- schema belongs to the unrelated WorkspaceSalesActivity model). Live-verified 2026-09-07:
-- nullable text, 0 non-null rows. Likely a leftover from the 2026-04-12 Staff->Team rename
-- (20260412000001_rename_staff_to_member) that never touched WorkspaceMember itself.
--
-- Direction: SCHEMA WINS.
ALTER TABLE "WorkspaceMember" DROP COLUMN IF EXISTS "staffMemberId";


-- -------------------------------------------------------------------------------------
-- NOTE D8 -- StaffMember*->TeamMember* constraint/index name drift. NOT a ready-to-run
-- item. Added 2026-09-07 (ADR-122), see ADR-122 for full evidence.
-- -------------------------------------------------------------------------------------
-- Migration 20260412000001_rename_staff_to_member correctly renamed the StaffMember/
-- StaffAvailability/StaffPerformance tables (and their FK columns) to TeamMember/
-- TeamMemberAvailability/TeamMemberPerformance -- but Postgres does not auto-rename
-- constraint/index/pkey identifiers on ALTER TABLE RENAME. Production still carries names
-- like "StaffMember_pkey" and "WorkspaceLeaderboardEntry_staffMemberId_fkey" attached to the
-- correctly-renamed tables/columns. Confirmed 2026-09-07: no table literally named
-- "StaffMember" exists in production; only TeamMember/TeamMemberAvailability/
-- TeamMemberPerformance do. This is cosmetic constraint-name drift only -- same false-alarm
-- class as the SaleSubscriber _unique->_key rename ADR-108 already caught (ADR-108 line 30).
-- Zero data risk either direction. No statements written -- rename these to the current
-- Prisma-convention names only when a migration already touches these tables for another
-- reason; not worth a dedicated pass.

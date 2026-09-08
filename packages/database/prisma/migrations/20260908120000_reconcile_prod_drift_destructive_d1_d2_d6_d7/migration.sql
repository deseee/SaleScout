-- Migration: reconcile_prod_drift_destructive_d1_d2_d6_d7 (ADR-108 + ADR-122, promoted 2026-09-08)
-- Promotes items D1, D2, D6, D7 from
-- packages/database/prisma/manual/2026-08-17-drift-destructive-PENDING-APPROVAL.sql
-- after Patrick's explicit session authorization ("dispatch the db investigation and
-- cleanup") to re-verify and promote ONLY these four already-"Recommend APPROVE" items.
-- D3 (needs a real A/B decision), D4 (Patrick decides per column; searchVector is
-- explicitly DO-NOT-DROP), D5 (Removal Gate decision needed) and D8 (not worth a
-- dedicated pass) are intentionally NOT included here -- see the PENDING-APPROVAL.sql
-- file for those.
--
-- SQL below is copied verbatim from the PENDING-APPROVAL file's D1/D2/D6/D7 blocks --
-- not rewritten. Every statement is IF EXISTS / IF NOT EXISTS guarded, so it is safe to
-- run even where production has already partially converged (see re-verification notes
-- below and in the session's handoff report).
--
-- Live re-verified read-only against Railway production, 2026-09-08, immediately before
-- this file was written (see session report for exact queries/output):
--   D1: ProcessedWebhookEvent has columns eventId/status/processedAt/updatedAt only --
--       no "id" column in production today (matches). Production has ALSO already
--       gained a real PRIMARY KEY constraint (ProcessedWebhookEvent_pkey on eventId) --
--       an improvement since the 2026-08-17 evidence (which found only a UNIQUE
--       constraint, no PK). This makes both statements below no-ops against current
--       production; they remain necessary to fix a database REBUILT FROM MIGRATION
--       HISTORY (disaster recovery / CI), which still creates the extra "id" column per
--       migration 20260309200001 until this file ships.
--   D2: All 6 named indexes confirmed absent from live production and absent from
--       schema.prisma; zero code references found (grep, 2026-09-08).
--   D6: TrailCheckIn.photoId confirmed nullable text; table has 0 total rows in
--       production today (stronger than the original "0 non-null" finding). FK
--       TrailCheckIn_photoId_fkey confirmed present. schema.prisma:3700 still carries
--       the "photoId removed" comment; no photoId field declared on the model.
--   D7: WorkspaceMember.staffMemberId confirmed nullable text, 0 of 11 production rows
--       non-null. schema.prisma's only staffMemberId field belongs to the unrelated
--       WorkspaceSalesActivity model (line 4869); WorkspaceMember declares no such field.
-- No contradictions found for any of the four items. Applied for real via Patrick's own
-- `prisma migrate deploy` run against Railway (this session did not execute any of the
-- statements below against production).

-- ============================================================
-- D1 -- ProcessedWebhookEvent primary key. Schema wins (eventId is the correct key).
-- ============================================================
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

-- ============================================================
-- D2 -- Six indexes created by migration history but hand-dropped from production.
-- Production + schema agree; migration history is the outlier. None declared in
-- schema.prisma. Zero data loss -- these are indexes only.
-- ============================================================
DROP INDEX IF EXISTS "Sale_prelaunchAt_idx";
DROP INDEX IF EXISTS "Sale_status_markdownEnabled_markdownFloor_idx";
DROP INDEX IF EXISTS "Organizer_corroborationScore_idx";
DROP INDEX IF EXISTS "Organizer_sourceCount_idx";
DROP INDEX IF EXISTS "Organizer_directoryNextCheckAt_idx";
DROP INDEX IF EXISTS "idx_Organizer_cashFeeBalance_updatedAt";

-- ============================================================
-- D6 -- TrailCheckIn.photoId + FK. Orphaned since the TrailPhoto/checkInId redesign
-- (schema.prisma:3700 comment). 0 rows in production (verified 2026-09-08). Zero data loss.
-- ============================================================
ALTER TABLE "TrailCheckIn" DROP CONSTRAINT IF EXISTS "TrailCheckIn_photoId_fkey";
ALTER TABLE "TrailCheckIn" DROP COLUMN IF EXISTS "photoId";

-- ============================================================
-- D7 -- WorkspaceMember.staffMemberId. Not declared anywhere in schema.prisma. 0 non-null
-- rows in production (verified 2026-09-08, 11 total rows). Zero data loss.
-- ============================================================
ALTER TABLE "WorkspaceMember" DROP COLUMN IF EXISTS "staffMemberId";

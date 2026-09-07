-- Migration: square_hub_owner_share_settlement (ADR-123, 2026-09-07)
-- Purely additive -- no column dropped, renamed, or made NOT NULL without a default on any
-- existing table, and no existing row is touched. Hand-authored to match schema.prisma
-- exactly -- `prisma migrate dev` cannot run in this sandbox (packages/backend/node_modules
-- and packages/database/node_modules are broken NTFS junctions here, confirmed recurring
-- across prior sessions). Applied for real via Patrick's own `prisma migrate deploy` run
-- against Railway. See claude_docs/architecture/ADR-123-square-hub-owner-share-settlement-
-- app-fee-allocations.md for the full design this migration implements.

-- ============================================================
-- Part A -- BoothCartLeg: real-time Square settlement bookkeeping (ADR-123 §4).
-- hubOwnerShareSettledAt is the Square-path sibling of the existing stripeTransferId
-- column -- records a FACT ("this leg's hub-owner share was paid atomically with its own
-- payment via app_fee_allocations"), not a separate transfer object id (Square's real-time
-- allocation path has no separate transfer id to store).
-- hubOwnerShareManualPayoutId is a nullable FK to the new HubOwnerShareManualPayout table
-- below, set once a bounded-fallback-bucket leg (pre-ADR-123 legacy leg, or a rare
-- authorize-time allocation failure) is manually marked paid.
-- ============================================================
ALTER TABLE "BoothCartLeg" ADD COLUMN "hubOwnerShareSettledAt" TIMESTAMP(3);
ALTER TABLE "BoothCartLeg" ADD COLUMN "hubOwnerShareManualPayoutId" TEXT;

CREATE INDEX "BoothCartLeg_hubOwnerShareSettledAt_idx" ON "BoothCartLeg"("hubOwnerShareSettledAt");
CREATE INDEX "BoothCartLeg_hubOwnerShareManualPayoutId_idx" ON "BoothCartLeg"("hubOwnerShareManualPayoutId");

-- ============================================================
-- Part B -- HubOwnerShareManualPayout: new table, organizer-scoped (hub-owner-scoped), NOT
-- vendor-booth-scoped -- deliberately NOT a VendorBoothPayout row. See ADR-123 §7 for the
-- full rationale (wrong grain + would contradict VendorBoothPayout.revenueShareOwed's
-- locked ADR-090 Phase 3 invariant of always being 0 / zero money movement). Bounded,
-- manual, NOT a recurring cron (ADR-123 §3.3) -- closes out BoothCartLeg rows whose
-- hub-owner share was never settled via real-time app_fee_allocations.
-- ============================================================
CREATE TABLE "HubOwnerShareManualPayout" (
    "id"              TEXT NOT NULL,
    "hubId"           TEXT NOT NULL,
    "organizerId"     TEXT NOT NULL,
    "amountCents"     INTEGER NOT NULL,
    "method"          TEXT NOT NULL,
    "notes"           TEXT,
    "paidAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HubOwnerShareManualPayout_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HubOwnerShareManualPayout_hubId_idx" ON "HubOwnerShareManualPayout"("hubId");
CREATE INDEX "HubOwnerShareManualPayout_organizerId_idx" ON "HubOwnerShareManualPayout"("organizerId");

-- ============================================================
-- Part C -- Foreign keys (added after both tables/columns exist, standard Prisma-generated
-- ordering). hub -> SaleHub is onDelete: Cascade (explicit in schema.prisma, matches
-- VendorBoothSettlementBatch's identical hub relation). BoothCartLeg.hubOwnerShareManualPayout
-- has no onDelete specified in schema.prisma; Prisma's documented default for an OPTIONAL
-- relation is SET NULL (VendorBoothPayout.settlementBatch is the existing precedent for this
-- exact default in this codebase).
-- ============================================================
ALTER TABLE "HubOwnerShareManualPayout" ADD CONSTRAINT "HubOwnerShareManualPayout_hubId_fkey"
    FOREIGN KEY ("hubId") REFERENCES "SaleHub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BoothCartLeg" ADD CONSTRAINT "BoothCartLeg_hubOwnerShareManualPayoutId_fkey"
    FOREIGN KEY ("hubOwnerShareManualPayoutId") REFERENCES "HubOwnerShareManualPayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

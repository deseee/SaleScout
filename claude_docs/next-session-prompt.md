# Next Session Resume Prompt
*Written: 2026-03-10T00:00:00Z*
*Session ended: normally*

## Resume From

Dispatch `findasale-dev` immediately for **Session 107A — B1 Schema**. Run in **continuous mode (E1.5)**: complete 107A → 107B → 107C without stopping between sessions unless Patrick intervenes or a blocker appears.

## What Was In Progress

Nothing mid-task. Session 106 wrapped cleanly. All decisions locked and documented.

## What Was Completed This Session (106)

- B1 Linchpin ADR written and approved (`claude_docs/feature-notes/b1-sale-type-item-type-adr-2026-03-10.md`)
- Full fee structure deep dive — Pitchman (25 ideas), R&D (competitor benchmarking), Architect (FeeStructure DB design), Advisory Board (stress test + debate)
- **10% flat fee LOCKED** across all item types — replaces 5%/7%
- STACK.md updated with Fee Structure section
- STATE.md updated: MAILERLITE_API_KEY done, fee lock noted, dev sequence set
- MESSAGE_BOARD.json updated: msg-004 (architect ADR), msg-005 (advisory board), msg-006 (fee locked, dev sequence approved)
- session-log.md updated with Session 106 entry
- context.md regenerated (207 lines — healthy)

## Environment Notes

**Patrick must complete before 107A dev starts:**
1. Push all Session 105 + 106 files (push block below)
2. Run Neon migration `20260310000001` if not yet done (FTS indexes)

**Architect skill installed copy is stale** — read-only, still shows old 5%/7% fee. Not a blocker for 107A dev (ADR is the authoritative spec). Repackage after 107 sprint.

**`SESSION_WRAP_PROTOCOL.md` and `WRAP_PROTOCOL_QUICK_REFERENCE.md`** are in `claude_docs/` root — should be in `claude_docs/operations/` per file-creation-schema. Flag for `findasale-records` to move. Not urgent.

## Exact Context — 107A/B/C Dev Instructions

Full spec: `claude_docs/feature-notes/b1-sale-type-item-type-adr-2026-03-10.md`

**Session 107A — Schema (start here):**
1. Add `SaleType` + `ListingType` enums to `packages/shared/src/types.ts`
2. Write migration `20260311000001_add_sale_type_item_listing_type`:
   - Add `Sale.saleType String @default("ESTATE")` (ESTATE/YARD/AUCTION/FLEA_MARKET)
   - Add `Item.listingType String @default("FIXED")` (FIXED/AUCTION/REVERSE_AUCTION/LIVE_DROP/POS)
   - Backfill: `UPDATE Sale SET saleType='AUCTION' WHERE isAuctionSale=true`
   - Backfill: `UPDATE Item SET listingType='AUCTION' WHERE auctionStartPrice IS NOT NULL AND auctionEndTime IS NOT NULL`
   - Backfill: `UPDATE Item SET listingType='REVERSE_AUCTION' WHERE reverseAuction=true`
   - Backfill: `UPDATE Item SET listingType='LIVE_DROP' WHERE isLiveDrop=true`
3. Add `FeeStructure` model to `schema.prisma`:
   ```prisma
   model FeeStructure {
     id          String   @id @default(cuid())
     listingType String   @default("*")
     feeRate     Float    @default(0.10)
     updatedAt   DateTime @updatedAt
   }
   ```
4. Seed single row: `{ listingType: "*", feeRate: 0.10 }`
5. Run locally, verify backfill counts, stage for Neon deploy

**Session 107B — Backend (continuous, no stop after 107A):**
5. `saleController` — accept `saleType` on create/update; deprecate `isAuctionSale` write paths (keep read for backwards compat)
6. `itemController` — accept `listingType` on create/update; map from selection, not from booleans
7. Purchase/payment flow — read `feeRate` from `FeeStructure` table at transaction time. Query: `WHERE listingType = item.listingType OR listingType = "*" ORDER BY specificity`. NO hardcoded rates anywhere.
8. Search endpoints — filter by `saleType` instead of `isAuctionSale`

**Session 107C — Frontend + QA (continuous, no stop after 107B):**
9. `SaleForm` — replace "Is this an auction sale?" toggle with `saleType` selector (ESTATE / YARD / AUCTION / FLEA_MARKET)
10. `ItemForm` — `listingType` selector driving conditional field groups (auction fields show on AUCTION, reverse fields on REVERSE_AUCTION, live-drop fields on LIVE_DROP)
11. Search/browse filter params updated to use `saleType`
12. QA: verify 10% fee on test Purchase records across all item types; verify saleType filters; verify auction bidding flow on `listingType = AUCTION` items

**Do NOT remove** `isAuctionSale`, `reverseAuction`, or `isLiveDrop` from schema this sprint — mark deprecated in code comments only.

## Push Block for Patrick — Session 105 + 106 Files

```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add claude_docs/STATE.md
git add claude_docs/STACK.md
git add claude_docs/operations/MESSAGE_BOARD.json
git add claude_docs/feature-notes/b1-sale-type-item-type-adr-2026-03-10.md
git add claude_docs/logs/session-log.md
git add context.md
git add claude_docs/next-session-prompt.md
git commit -m "Session 106: B1 ADR, 10% flat fee locked, FeeStructure design, dev sequence 107A/B/C"
.\push.ps1
```

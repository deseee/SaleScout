# Next Session Prompt — S263

**Date:** 2026-03-24 (S262 complete)
**Status:** Brand drift fully resolved. Phase 2a+2b deployed. Phase 2c pending. QA needed.

---

## S263 PRIORITY 1 — QA Smoke Test (All S262 Changes Live)

MANDATORY per CLAUDE.md §10. Verify all S262 fixes are live on finda.sale via Chrome MCP.

**Test Plan:**
- **Brand Drift Batches 3+4:** City pages (`/city/denver`), map page (`/map`), calendar page (`/calendar`), search empty state, trending page, inspiration page — verify "secondary sale organizer" copy is live, no "estate sale only" language.
- **XP Profile/Leaderboard:** Login as user11 (shopper), navigate to `/shopper/loyalty` — RankBadge + RankProgressBar rendering? Navigate to `/shopper/leaderboard` — top 50 showing? No API 404 errors in console.
- **Encyclopedia Rename:** Search for "Resale Encyclopedia" on relevant pages — verify rename is live across all Batch 1 pages.

If ANY test fails, flag immediately and dispatch findasale-dev before other work.

---

## S263 PRIORITY 2 — Explorer's Guild Phase 2c (Wire XP Events)

Scoped in Phase 2a architecture but implementation status unconfirmed. Verify completeness:
- Purchase completion → `xpService.awardXp(userId, 'purchase_complete', itemValue)` in `purchaseController`
- Sale listing created → award XP in `saleController`
- Referral accepted → award XP in `referralController`
- Auction win → award XP in `bidController`

If NOT already wired, dispatch findasale-dev to add the calls. Use xpService signatures from Phase 2a implementation.

---

## S263 PRIORITY 3 — Brand Drift Batches 3+4 QA (Live Verification)

Separate from Priority 1 smoke test — deep dive on copy consistency:
- Verify ALL page titles/H1/meta descriptions use "secondary sale" or specific sale types, never "estate sale only"
- Check component SaleShareButton, ReferralWidget, og-image API for brand voice compliance
- Spot-check 3 key pages for dark mode rendering (no hardcoded colors in new copy)

If copy issues found, dispatch findasale-dev for targeted fixes.

---

## S263 PRIORITY 4 — Explorer's Guild Phase 2 Shopper UX Review (Optional)

Once Phase 2c is confirmed complete and QA passes, optional deep dive:
- Does the XP system surface well to shoppers? RankBadge visibility on loyalty/profile pages?
- Are XP sink UI components clear (RarityBoost, Coupon redemption)?
- Any usability gaps in leaderboard (pagination, search, sorting)?

Feedback loop to findasale-gamedesign if design tweaks needed.

---

## Context

**Phase 2 Status:** 2a+2b deployed to live (Neon + Railway + Vercel). Phase 2c scope confirmed but implementation check needed. No major blockers.

**Brand Drift Status:** Batches 1+2 pushed (commit b06242d). Batches 3+4 committed locally, awaiting push confirmation from S263 QA.

**Platform serves 5 sale types:** estate sales, yard sales, auctions, flea markets, consignment.

---

## Test Accounts (Live on Neon)

All password: `password123`
- `user1@example.com` — ADMIN + SIMPLE organizer
- `user2@example.com` — PRO organizer (Stripe connected)
- `user3@example.com` — TEAMS organizer (Stripe connected)
- `user11@example.com` — Shopper with full XP activity

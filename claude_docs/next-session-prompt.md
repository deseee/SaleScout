# Next Session Prompt — S251

**Date:** 2026-03-23 (S250 wrap complete)
**Status:** Seed data overhaul complete. Strategic session is the priority.

---

## FIRST TASK — Live smoke test

Run Chrome MCP against finda.sale. Log in as user11@example.com and verify the key data-dependent features now show real data: Loot Log, Loyalty, Trails, Collector Passport, Purchases tab, Bids, Wishlists/Alerts, Notifications, Leaderboard. These were all empty before the seed overhaul.

---

## S251 Priority 1 — Strategic Session (decisions needed from Patrick)

All of these require Patrick input before work can be dispatched:

1. **TR1 — Trails "Create Trail" button** → `/shopper/trails/create` doesn't exist. REMOVE / REDIRECT / BUILD?
2. **OP1 — Organizer "Start Verification" button** → `/organizer/verification` doesn't exist. REMOVE / BUILD?
3. **OS3 — Workspace public URL broken** → public workspace page doesn't exist. REMOVE / BUILD?
4. **Double footers** (I2, CP3, LY11, AL5, TR2, S3) — browser QA to pinpoint the duplicate element + fix
5. **Gamification spec** (L2-L7, LY1-LY2, OV1, RE3, PR4) — points, badges, stamps, milestones, leaderboard, Hunt Pass
6. **Feature overlap** (AL1, FV1, PR5) — favorites vs wishlists vs alerts vs sale interests
7. **Support tier reality** (P3) — what does each tier's support mean for a solo founder?
8. **Page consolidation** (PSU1-PSU4, S2, PF1) — premium/subscription/upgrade overlap, settings vs profile
9. **Shopper/organizer parity** (OD3, OS1)
10. **Homepage redesign** (H2, H3)
11. **Plan a Sale visibility** (PL1)
12. **F7: Profile edit buttons** — /profile with edit controls, or editing only in /settings?

---

## Patrick Action Items (carry-forwards)

- [ ] Push S250 wrap docs (see push block below)
- [ ] Install findasale-dev.skill via Cowork UI (carry-forward from S248)
- [ ] Install findasale-qa.skill via Cowork UI (carry-forward from S248)

---

## Context Loading

- Read `claude_docs/S248-walkthrough-findings.md` — full work queue with all item codes
- Test accounts: Shopper `user11@example.com`, PRO `user2@example.com`, ADMIN+SIMPLE `user1@example.com`, TEAMS `user3@example.com` (all `password123`)

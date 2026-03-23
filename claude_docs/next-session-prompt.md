# Next Session Prompt — S250

**Date:** 2026-03-23 (S249 wrap complete)
**Status:** 18 bugs + 8 dark mode violations fixed. Strategic session queued with carry-forwards.

---

## FIRST TASK — Verify S249 push landed

Confirm all 18 changed code files are on GitHub main. Check Vercel is GREEN.

---

## S250 Priority 1 — Seed Data Overhaul

14 DATA items from S248-walkthrough-findings.md — nearly every feature is untestable without realistic data:
Purchases, badges, Stripe-enabled accounts, image URLs, wishlists, favorites, loot log, trails data, notifications, bids, referrals, bounties, leaderboard data, command center data.
Requires architect + dev session to redesign the seed script.

---

## S250 Priority 2 — Strategic Session (schedule when Patrick is ready)

These all require Patrick decisions. Full list including carry-forwards from S249:

1. **Gamification spec** (L2-L7, LY1-LY2, OV1, RE3, PR4) — points, badges, stamps, milestones, leaderboard, Hunt Pass
2. **Feature overlap** (AL1, FV1, PR5) — favorites vs wishlists vs alerts vs sale interests
3. **Support tier reality** (P3) — what does each tier's support mean for a solo founder?
4. **Page consolidation** (PSU1-PSU4, S2, PF1) — premium/subscription/upgrade overlap, settings vs profile
5. **Shopper/organizer parity** (OD3, OS1)
6. **Homepage redesign** (H2, H3)
7. **Plan a Sale visibility** (PL1)
8. **F7: Profile edit buttons** — /profile with edit controls, or editing only in /settings?
9. **TR1/OP1/OS3 original intent** — Trails create route, organizer verification, workspace public URL — what were these intended to be? Decide fix/redirect/remove after understanding original plan.
10. **Double footers** (I2, CP3, LY11, AL5, TR2, S3) — browser QA to pinpoint + fix

---

## Patrick Action Items (from S249)

- [ ] Run push block (18 code files + 4 wrap docs — use `.\push.ps1`)
- [ ] Install findasale-dev.skill via Cowork UI (carry-forward from S248)
- [ ] Install findasale-qa.skill via Cowork UI (carry-forward from S248)

---

## Context Loading

- Read `claude_docs/S248-walkthrough-findings.md` — full work queue
- Test accounts: Shopper `user11@example.com`, PRO `user2@example.com`, ADMIN+SIMPLE `user1@example.com`, TEAMS `user3@example.com` (all `password123`)

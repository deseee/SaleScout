# Next Session Prompt — S257

**Date:** 2026-03-23 (S256 complete)
**Status:** SD4 fixed. 12 Tier 1 UX items shipped. UX specs for full 41-item backlog + onboarding exist. Live QA not yet run — MANDATORY FIRST TASK.

---

## MANDATORY FIRST TASK — Live QA Smoke Test

**Before any new work**, dispatch `findasale-qa` to verify S256 changes are live and working on finda.sale:

1. **SD4** — Log in as user11. Shopper dashboard → streak counter and points balance show real values (not 0/empty).
2. **Nav labels** — Shopper dropdown shows "Shopper Dashboard". Organizer dropdown shows "Organizer Profile" and "Organizer Dashboard". Organizer dropdown includes Payouts link.
3. **ThemeToggle** — Desktop header has toggle icon between notification bell and avatar. Clicking it switches theme.
4. **shopper/settings** — Single footer (no double footer).
5. **Shopper dashboard Overview tab** — Hunt Pass info card visible at top.
6. **organizer/dashboard** — POS button visible above the fold. No duplicate Reputation Score card.
7. **organizer/webhooks** — New webhook form shows testing help text with RequestBin/ngrok/Zapier links.
8. **shopper/collector-passport** — Specialties and Keywords sections have descriptive help text.

If any check fails → dispatch `findasale-dev` to fix before proceeding to new work.

---

## S257 PRIORITY 1 — Tier 2+ UX Batches

UX specs are ready in `claude_docs/ux-spotchecks/S256-UX-SPECS-41-items-onboarding.md`.

Read the spec, identify remaining Tier 2+ batches (Tier 1 was completed in S256), and dispatch in parallel to `findasale-dev`. Target 8–12 items per dispatch.

---

## S257 PRIORITY 2 — Organizer Onboarding Flow

Spec exists in `claude_docs/ux-spotchecks/S256-UX-SPECS-41-items-onboarding.md` (5-step onboarding flow section at the bottom).

Dispatch `findasale-dev` to implement. Reference the spec for acceptance criteria.

---

## S257 PRIORITY 3 — Strategic Items (17 items from S248)

Read `claude_docs/S248-walkthrough-findings.md` strategic section.
Route to:
- Product strategy decisions → `findasale-advisory-board`
- Feature ideas → `findasale-innovation`
- Competitive implications → `findasale-competitor`

Do not dispatch to dev without advisory/innovation review first.

---

## Context

Last commits: `b7b05c3` (SD4 streaks fix), `6dafd59` (nav labels + shopper settings), `af48ac2` (Tier 1 UX polish batch)

Beta week is active — real users testing. Prioritize user-visible fixes and flows.

---

## Test Accounts (Live on Neon)

All password: `password123`
- `user1@example.com` — ADMIN + SIMPLE organizer
- `user2@example.com` — PRO organizer (Stripe connected)
- `user3@example.com` — TEAMS organizer (Stripe connected)
- `user11@example.com` — Shopper with full activity (9 bids, 6 purchases, streaks, points)

# Next Session Prompt — S261

**Date:** 2026-03-23 (S260 complete)
**Status:** Explorer's Guild Phase 1 copy shipped. RPG spec locked. Phase 2 ready to plan when Patrick says go.

---

## S261 PRIORITY 1 — Dashboard Copy Fix (Quick, 1-line)

The organizer dashboard still says "Manage your estate sales and track earnings." — needs to say something sale-type-neutral.

Dispatch to findasale-dev. Single-line edit in `packages/frontend/pages/organizer/dashboard.tsx`. No Architect needed.

---

## S261 PRIORITY 2 — Skill Bias Audit (Remaining SKILL.md Files)

S260 fixed: global CLAUDE.md, project CLAUDE.md, findasale-innovation SKILL.md, findasale-advisory-board SKILL.md.

Could not confirm edits to findasale-dev, findasale-ux, findasale-qa SKILL.md (zip archives — couldn't read/edit directly).

Action: Dispatch skill-creator to audit and fix those 3 SKILL.md files for "estate sale" → "secondary sale organizers" bias.

---

## S261 PRIORITY 3 — Explorer's Guild Phase 2 Planning

Phase 2 = full XP economy (new schema tables, API endpoints, frontend components). NOT a quick dispatch — this is a multi-session build.

**Spec is ready:** `claude_docs/research/gamification-rpg-spec-S260.md` — all 8 decisions locked.

**Schema additions required:**
- `rarity` enum on Loot Legend items: `COMMON | UNCOMMON | RARE | LEGENDARY`
- `seasonalResetAt` timestamp on User
- `explorerRank` on User: `INITIATE | SCOUT | RANGER | SAGE | GRANDMASTER`
- `xp_fraud_flags` audit table
- `xp_coupon_transactions`, `rarity_boosts`, `hunt_pass_discounts` sink tables

**Before dispatching dev:** Run through findasale-architect for schema sign-off first.

---

## Explorer's Guild — What's Done vs. What's Next

**DONE (Phase 1 — no schema):**
- ✅ Copy rebrand: collector→explorer labels on all 5 frontend files
- ✅ Roadmap entries #122 (P1) + #123 (P2) added
- ✅ RPG spec locked (gamification-rpg-spec-S260.md)

**TODO (Phase 2 — requires schema):**
- XP earn events + sinks
- Rarity tier system on Loot Legend items
- Seasonal reset logic
- Sage payoffs (Sourcebook publishing, 48h Early Bird alerts, Sage Coupon)
- Shareable moment cards (5 variants)
- Abuse prevention flags dashboard

---

## Research Docs Available (claude_docs/research/)

- `gamification-rpg-spec-S260.md` — **LOCKED SPEC** — 8 decisions, schema/API/frontend breakdown
- `gamification-revised-spec-S259.md` — full XP thresholds, archetype paths
- `gamification-xp-economy-S259.md` — 25-source XP economy table
- `gamification-board-review-S259.md` — board positions + voting
- `PATRICK_DECISION_SUMMARY-S259.md` — what's locked vs. open

---

## Context

Last push: S260 wrap. Phase 1 copy changes on `main`. Vercel/Railway will auto-deploy.
Beta week active. No blockers.

**Platform serves 5 sale types:** estate sales, yard sales, auctions, flea markets, consignment. All features and language must work across all 5.

---

## Test Accounts (Live on Neon)

All password: `password123`
- `user1@example.com` — ADMIN + SIMPLE organizer
- `user2@example.com` — PRO organizer (Stripe connected)
- `user3@example.com` — TEAMS organizer (Stripe connected)
- `user11@example.com` — Shopper with full activity

# Next Session Prompt — S259

**Date:** 2026-03-23 (S258 complete)
**Status:** S258 all batches shipped (dev batches A/B/C, Q2 My Saves, Q3 Premium consolidation, Advisory Board decisions, Innovation Agent narrative concepts). Ready for S259 work. No blockers.

---

## MANDATORY FIRST — Live Smoke Test (Chrome MCP)

**Per CLAUDE.md §10 post-fix verification:** S258 shipped multiple UX batches (6 shopper fixes, 6 functional fixes, onboarding restructure, Q2/Q3 consolidations). Before ANY new work, smoke test ALL changed pages live on finda.sale as:
- user2 (PRO organizer) — test organizer onboarding flow (steps 1-5), pricing page, premium consolidation
- user3 (TEAMS organizer) — same
- user11 (shopper) — test My Saves tabs (Items + Sellers), trending wishlist buttons, TreasureHuntBanner dismiss, contact page, collector-passport dark mode, ActivitySummary dark mode, all pages with domain fix checks

**Test list:**
- /organizer/onboarding (all 5 steps, progress indicator, localStorage dismiss)
- /organizer/pricing (all tiers, Stripe CTAs, current plan highlight)
- /pricing (redirects to /organizer/pricing)
- /shopper/wishlist renamed to "My Saves", 2 tabs (Items + Sellers)
- /trending (wishlist/favorite buttons on cards)
- /inspiration (no double footer)
- /collector-passport (dark mode rendering)
- /contact (subject field, copy, domain finda.sale)
- TreasureHuntBanner (dismissible, stays dismissed on reload)
- ActivitySummary skeleton (dark mode)
- All domain references changed from findasale.com → finda.sale

**Success criteria:** All pages load, no 404s, localStorage persists, dark mode renders correctly, all domain strings are finda.sale (not findasale.com).

If any failures, flag immediately and dispatch findasale-dev before proceeding to next tasks.

---

## S259 PRIORITY 1 — Gamification Narrative Research + Spec Blend

**Context:** Innovation Agent produced 3 concepts (S258):
1. **Treasure Map Collector's Guild** — rank progression (Initiate→Scout→Ranger→Sage→Grandmaster), Guild XP, Legendary Achievements, Expedition Stamps
2. **Antiquarian's Collection Quest** — prestige, expertise levels, collection specialties
3. **Estate Sale Seasonal Challenge Circuit** — seasonal resets, seasonal badges, quarterly leaderboard

Patrick rejected simple deletion of gamification mechanics. Instead: **blend Concepts 1+3** with competitive research to find a unified narrative that works across secondary sale types (estate sales, yard sales, auctions, flea markets, consignment).

**Research needed:**
- How do competing platforms (eBay, Depop, Vinted, ThredUP, Etsy, Catawiki) structure gamification for secondary market sellers/collectors?
- What narratives work for multiple sale types (not just estate sales)?
- Guild rank progression — what achievements unlock rewards? What are the rewards?
- Seasonal challenges — what makes a good seasonal arc?

**Dispatch to:** `findasale-innovation` with research findings. Produce a **unified spec** before any dev work. Patrick signs off before implementation.

---

## S259 PRIORITY 2 — Agent Prompt Bias Fix

**Finding from S258:** Patrick flagged that agent prompts persistently inject "estate sale" as the only platform use case. Reality: FindA.Sale serves **5 secondary sale organizers:** estate sales, yard sales, auctions, flea markets, consignment.

**Action:** Audit and update:
- `/sessions/ecstatic-elegant-euler/mnt/.claude/CLAUDE.md` (global instructions)
- `/sessions/ecstatic-elegant-euler/mnt/FindaSale/CLAUDE.md` (project CLAUDE.md)
- All relevant agent SKILL.md files (`findasale-dev`, `findasale-ux`, `findasale-innovation`, etc.)

**Replace:** "estate sale operators" → "secondary sale organizers"

**Ensure:** All agent prompts understand that features must work across all 5 sale types, not just estate sales.

---

## S259 PRIORITY 3 — Guild Narrative Copy Implementation

**Blocker:** Waiting for gamification narrative spec from S259-PRIORITY 1.

**Once Patrick approves the unified narrative:**
- Update OnboardingWizard.tsx copy to reflect the narrative theme
- Update collector-passport.tsx labels/copy to align with guild/seasonal concepts
- Update Hunt Pass terminology (if needed) to fit the narrative
- Label achievements, ranks, badges with narrative-appropriate names

**Dispatch to:** `findasale-dev` once spec locked.

---

## Context

Last commits: S258 batch commits for dev batches A/B/C, Q2 My Saves, Q3 Premium consolidation.

Beta week is active. Focus on: smoke test → gamification strategy → copy alignment.

**Important note:** All feature decisions now must account for platform serving 5 sale types, not just estate sales. Competitive research should include secondary markets (eBay, resale, auction houses).

---

## Test Accounts (Live on Neon)

All password: `password123`
- `user1@example.com` — ADMIN + SIMPLE organizer
- `user2@example.com` — PRO organizer (Stripe connected)
- `user3@example.com` — TEAMS organizer (Stripe connected)
- `user11@example.com` — Shopper with full activity (9 bids, 6 purchases, streaks, points)

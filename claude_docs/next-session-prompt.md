# Next Session Prompt — S237

**Date:** 2026-03-22 (S236 wrap complete)
**Status:** All S236 code + docs pushed. Beta testers evaluating this week — every session until launch is tester-readiness focused.

---

## Session Start Checklist

1. Load `STATE.md` — reflects S236 completion
2. **MANDATORY: Live smoke test** (CLAUDE.md §10 rule) — use Chrome MCP to verify every page fixed in S236:
   - `/settings` → should redirect by role
   - `/wishlist` → should redirect to `/shopper/favorites`
   - `/profile` as organizer → should NOT show Hunt Pass, badges, bids
   - `/organizer/premium` → pricing contrast should be readable
   - Any page with bid/like/follow → should redirect to `/login` (not `/auth/login`)
3. If ANY page fails live test → dispatch findasale-dev BEFORE all other work

---

## S237 Priority: Tester-Ready Polish

Real potential customers are testing the product this week (starting ~2026-03-22). They explore freely in all roles. Every broken page costs credibility. Every confusing label loses trust. The product must feel finished.

**1. Git cleanup (first thing):**
- Add `.gitignore` entries: `_tmp_*`, `.skills/`, `.claude/`, `package-lock.json`, `conversation-defaults-SKILL-*.tmp.*`
- Commit all ~80 legitimate untracked doc files in one batch: `claude_docs/archive/`, `claude_docs/research/`, `claude_docs/audits/`, `claude_docs/operations/`, etc.
- Goal: `git status` shows ZERO noise after this

**2. Seed realistic test data:**
- Create 2-3 real-looking sales with photos, descriptions, plausible prices
- Use real Grand Rapids addresses (public places, not homes)
- Real organizer names, not "Test Organizer 1"
- Items with variety: furniture, collectibles, tools, kitchenware

**3. Full role walkthrough:**
- Walk through as SHOPPER: browse → search → view sale → view items → favorite → message organizer
- Walk through as ORGANIZER: dashboard → create sale → add items → AI tagging → publish → view analytics
- Walk through as unauthenticated user: browse → try to interact → login flow → back to where they were

**4. Mobile verification:**
- PWA install prompt working?
- Touch targets large enough?
- No horizontal scroll?
- Navigation usable on small screens?

---

## Pending Patrick Decisions

1. Review `claude_docs/research/INNOVATION_HANDOFF_S236.md` — confirm Reputation + Condition Tags as P0 pre-beta features
2. Confirm sale-type-aware discovery as Q3 feature
3. Legal budget for digital assets review ($2-3K) — approve/defer

---

## Context Loading

- `claude_docs/patrick-dashboard.md` — one-pager status
- `claude_docs/feature-decisions/demo-readiness-plan-S236.md` — demo script + readiness assessment
- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)

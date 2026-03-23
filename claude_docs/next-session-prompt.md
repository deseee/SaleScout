# Next Session Prompt — S246

**Date:** 2026-03-23 (S245 wrap complete)
**Status:** Shopper dashboard bugs fixed + pushed. QA behavioral correction complete. Real browser testing required for 4 features.

---

## S246 Priority — COMPREHENSIVE SHOPPER FRONTEND QA SCAN

**This is the ONLY priority until complete. Do not start new feature work before this finishes.**

### BEFORE ANYTHING ELSE — Install updated skills

Two .skill files were packaged by skill-creator in S245. They must be installed before dispatching any QA work:
- `findasale-qa` — updated with Chrome MCP Unavailable Protocol and real-data verification rules
- `conversation-defaults` — updated with Rule 32 (no substitutes for browser testing)

Patrick: Install both .skill files from the workspace folder via Cowork UI.

---

### Priority 1 — REAL BROWSER QA (findasale-qa agent, Chrome MCP)

Dispatch `findasale-qa` for a comprehensive shopper frontend scan. **This is not a code audit. This is browser testing with real data.**

#### Features that are UNVERIFIED and need real data seeded + browser tested:

These were marked "correct" in S245 based on API shape alone. user11 has ZERO entries for all of them. Each needs test data seeded, then verified in Chrome:

1. **Loot Log** — user11 needs purchase entries. Navigate to `/shopper/loot-log`. Verify entries render.
2. **Loyalty** — user11 needs loyalty stamps. Navigate to `/shopper/loyalty`. Verify stamps/progress render.
3. **Trails** — user11 needs trail entries. Navigate to `/shopper/trails`. Verify trails render.
4. **Collector Passport** — user11 needs passport data. Navigate to `/shopper/collector-passport`. Verify passport renders.

For each: if the API has no endpoint to create test data, insert directly via curl to the backend or note it's blocked.

#### Features to verify with fresh eyes after S245 push:

5. **Favorites tab** — `/shopper/dashboard` → Favorites tab. Should show user11's saved items (API shape fix was pushed in S245).
6. **Subscribed tab** — `/shopper/dashboard` → Subscribed tab. Should show organizers user11 follows (dynamic tab was pushed in S245).
7. **Purchases tab** — `/shopper/dashboard` → Purchases. Does user11 have any purchases? If not, note EMPTY STATE renders correctly.
8. **Pickups tab** — `/shopper/dashboard` → Pickups. Verify empty or populated state.
9. **Overview tab** — Dashboard overview — no broken cards, no layout issues.
10. **6 quick-link buttons** — Collection, Loyalty, Alerts, Trails, Loot Log, Receipts — click each, verify correct page loads.
11. **Missing buttons on /profile** — Patrick reported buttons missing on user11's `/profile` page after S245 push. Investigate and diagnose.

#### Message reply end-to-end (still pending from S244):

12. Login as `user2@example.com` (organizer). Find or create a message thread with user11. Send a reply.
13. Login as `user11@example.com` (shopper). Verify the organizer's reply appears in the inbox.
14. Both sides must be verified. Do not mark as verified until both accounts confirm.

---

### QA Verification Standard (Rule 32 — CRITICAL)

A feature is only ✅ Verified if ALL THREE are true:
1. Navigated to the page in Chrome as user11 (shopper)
2. Data was actually visible in the UI (not just returned by API)
3. UI renders data correctly

If Chrome MCP fails → status = UNVERIFIED. Never substitute API testing.
If user11 has no data → seed it first, then test.

---

### Priority 2 (after QA scan complete)

- Beta tester feedback triage — respond to any user-reported issues
- L-002: Mobile viewport test (375px in Chrome DevTools — no real device needed)

---

## Context Loading

- Read `claude_docs/brand/DECISIONS.md` at session start
- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)
- Auth rate limit is 50 failed attempts per 15 min
- S245 push is live: messaging feedback, dashboard favorites fix, subscribed tab dynamic, dark mode buttons

---

## S245 Files Changed

- `packages/frontend/pages/messages/[id].tsx` — error/success toast on reply send
- `packages/frontend/pages/sales/[id].tsx` — dark mode button variants
- `packages/frontend/hooks/useFollows.ts` — NEW hook for followed organizers
- `packages/frontend/pages/shopper/dashboard.tsx` — favorites shape fix + subscribed tab dynamic

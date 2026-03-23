# Next Session Prompt — S254

**Date:** 2026-03-23 (S253 complete)
**Status:** Rate limiter fix + bids route + /organizer/upgrade redirect all live. 7 new bugs found in QA. 4 P1 fixes queued. 2 DECISION NEEDED items waiting on Patrick.

---

## FIRST — Two DECISION NEEDED Items (Patrick Input Required Before Dev)

These two 404s need a direction before dispatching dev:

**1. `/organizer/profile` — 404 (page doesn't exist)**
Options:
- A) Create a read-only profile view page at this route
- B) Redirect to `/organizer/settings` (Profile tab — write controls already there)
- C) Clean up any nav links pointing here and remove the route entirely

**2. `/organizer/inventory` — 404 (page doesn't exist)**
Options:
- A) Create an inventory management page at this route
- B) Redirect to `/organizer/sales` (exists, lists sales)
- C) Clean up nav links and remove the route entirely

Once Patrick decides, dispatch the appropriate 1-2 line fix to findasale-dev.

---

## S254 Priority 1 — Fix /organizer/premium → redirect to /organizer/subscription

**~10-line fix. Same exact pattern as /organizer/upgrade.tsx (already fixed in S253).**

Dispatch to findasale-dev:
- File: `packages/frontend/pages/organizer/premium.tsx`
- Replace entire file with `getServerSideProps` redirect to `/organizer/subscription`
- Verify live: navigate to finda.sale/organizer/premium as logged-in organizer, confirm it lands on /organizer/subscription

---

## S254 Priority 2 — Fix bids page item photos missing

Dispatch to findasale-dev to investigate:
- `/api/bids` endpoint returns `photoUrls` from `item.photoUrls` (Prisma `select`)
- In QA, the bids page rendered item titles and amounts but DOM had 0 `<img>` elements for items
- Check: are seeded bid items' `photoUrls` populated? Run query against Neon to verify
- Check: does the `bids.tsx` frontend render `photoUrls[0]` with a fallback? Or does it silently skip on empty array?
- Fix whichever layer is broken (seed data, API response, or frontend render logic)

---

## S254 Priority 3 — Fix double onboarding modals on organizer dashboard

Dispatch to findasale-dev:
- On `/organizer/dashboard` fresh load (user2 = Bob Smith, PRO organizer), two onboarding modals stack simultaneously:
  1. Background (light): "Step 1: Your Profile" — Business Name, Phone, Bio fields with "Remind Me Later" / "Save & Continue"
  2. Foreground (dark): "Welcome to FindA.Sale! You're set up as a sale organizer. Let's go →" with "Skip"
- Root cause: likely two separate onboarding modal components both checking the same incomplete condition (no profile setup + new user wizard)
- Fix: ensure only one modal shows at a time; dismiss/complete one before showing the other

---

## S254 Priority 4 — Fix shopper onboarding "Skip" navigates to /login

Dispatch to findasale-dev:
- The shopper welcome modal ("Welcome to FindA.Sale! Discover estate sales..." with "Show me around" + "Skip") has a "Skip" link/button that navigates to `/login` instead of just closing the modal
- Affects any shopper page that shows the onboarding modal
- Fix: "Skip" should close/dismiss the modal and mark onboarding as skipped in local state (not navigate away)

---

## After Fixes — Re-run QA Checks

Once dev fixes are pushed and Railway/Vercel deploys:
1. Navigate to finda.sale/organizer/premium as user2 → confirm redirect to /organizer/subscription
2. Navigate to finda.sale/shopper/bids as user11 → confirm item photos visible
3. Log in as user2 (Bob Smith), go to /organizer/dashboard (hard reload) → confirm only ONE modal shows
4. Log in as user11, navigate to any page with the shopper welcome modal → click "Skip" → confirm stays on page (no /login redirect)
5. Re-run Item 7 after /organizer/profile DECISION NEEDED is resolved

---

## Test Accounts (Live on Neon)

All password: `password123`
- `user1@example.com` — ADMIN + SIMPLE organizer (Alice Johnson)
- `user2@example.com` — PRO organizer (Bob Smith) — use for organizer tests
- `user3@example.com` — TEAMS organizer (Stripe connected)
- `user11@example.com` — Shopper (Karen Anderson) — 9 bids, 6 purchases, wishlists, follows, notifications

---

## Context Loading

- Read `claude_docs/STATE.md` — S253 completion, 4 P1 fix priorities, 2 DECISION NEEDED items
- Last commit: `011d18b44552c8e512a8c8ce7b4f321781702384`
- QA findings detail: `/sessions/gifted-eloquent-pascal/qa-findings-s253-remaining-2026-03-23.md` (in Cowork session — may not persist; use STATE.md as source of truth)
- Beta week context: fixes are prioritized by user-visible impact

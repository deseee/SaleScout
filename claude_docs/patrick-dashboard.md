# FindA.Sale — Patrick's Dashboard
Last Updated: 2026-03-22 (S240)

## Build Status
- **Vercel (Frontend):** Live — [finda.sale](https://finda.sale)
- **Railway (Backend):** Live
- **Scheduled Tasks:** 3 active (weekly site audit Sun 10pm, brand drift Mon 10am, Monday digest 8am)

## What Just Happened (S240)

All 12 findings from the automated Sunday night audit were fixed and pushed.

**High priority fixes:**
- Item pages were broken for every shopper — fixed (removed overly strict status filter in backend)
- `/settings` was hanging forever for logged-out users — fixed (now redirects to login)
- Every page on the site had invalid nested `<main>` tags (accessibility violation) — fixed in Layout.tsx
- `/notifications` DOM was duplicating the entire page layout — resolved as side effect of the main tag fix

**Medium/low fixes:**
- 9 pages still said "estate sales" — swept and updated to all-sale-types language (hubs, categories, calendar, neighborhoods, cities, surprise-me, FAQ, footer, homepage subtitle)
- /hubs empty state now has a "Browse All Sales →" button
- Admin pages now redirect to login instead of silently bouncing to homepage
- LiveFeed no longer shows "Reconnecting..." to beta testers
- Sale detail filter label now reads "Show: All" instead of the confusing "All items sold or reserved"
- Shopper dashboard login redirect now preserves the redirect parameter

**D-007 locked:**
- Teams tier: 12-member cap
- Enterprise tier confirmed above Teams (contact-sales, $500–800/mo, annual contracts, isEnterpriseAccount feature flag)
- Implementation happens next session

## What You Need To Do

1. **Nothing urgent** — the push is complete, all 15 files are on main
2. **Mobile check** — browser automation can't test mobile properly. Spot-check the site on a real phone (iPhone SE if you have one): homepage, sale detail, item grid, nav

## Upcoming (S241)

1. Live-verify S240 fixes are working in production
2. Implement D-007 — 12-member cap in backend + schema migration + pricing page update
3. Mobile real-device spot-check

## Pending Decisions
- None — all carry-forward decisions are either locked (D-007) or deferred

## Project Health
- **Features shipped:** 71 across 4 tiers
- **Beta status:** Live. Real customers evaluating this week.
- **Platform scope:** All secondary sales types (estate, garage, yard, auction, flea, consignment)
- **Audit:** 12/12 findings from first automated audit resolved same session

---

**Note:** Updated by main session at every wrap. Monday digest will also update this file automatically.

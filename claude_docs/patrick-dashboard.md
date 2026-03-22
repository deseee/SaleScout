# FindA.Sale — Patrick's Dashboard
Last Updated: 2026-03-22 (Session 237 wrap)

## Build Status
- **Vercel (Frontend):** ✅ Live — [finda.sale](https://finda.sale)
- **Railway (Backend):** ✅ Live
- **Sentry:** Review at https://deseee.sentry.io — S233/S234 fixes should have reduced error volume

## Live QA Status
- **Status:** All S237 fixes verified live in production. Map working. Organizer profile correct. /auth redirect working.
- **Data:** 25 sales now show Grand Rapids, MI (was Riverside, IL). 10 organizer addresses fixed.
- **Beta tester readiness:** Site is showing correctly. Role walkthrough + mobile check deferred to S238.

## No Blocking Patrick Actions
All scripts run. All pushes complete. No manual steps before S238.

## Next 3 Decisions
1. Resend → Brevo or Postmark? (weekly digest burning 80/100 free quota on Sundays — decide before user count grows)
2. Approve Reputation + Condition Tags as P0 pre-beta features (`INNOVATION_HANDOFF_S236.md`)
3. Budget approval for digital assets legal review ($2-3K)

## Project Health
- **Features shipped:** 71 across 4 tiers (SIMPLE/PRO/TEAMS + FREE shopper)
- **Beta status:** Live and verified. Real customers evaluating this week.
- **Platform scope:** Estate sales, yard sales, auctions, flea markets, consignment

## What Was Just Done (S237)
- ✅ Fixed map blank (Leaflet CJS interop bug — `require('leaflet').default` was undefined)
- ✅ Fixed organizer profile showing Hunt Pass / My Bids / My Referrals (wrong roles array check)
- ✅ Fixed `/auth/login` → 404 (permanent redirect to `/login` added)
- ✅ .gitignore updated — _tmp_*, .skills/, .claude/ excluded from git permanently
- ✅ ~80 untracked claude_docs files committed (S198–S236 backlog cleared)
- ✅ All 25 sales + 10 organizers updated: "Riverside, IL" → "Grand Rapids, MI"
- ✅ Live smoke test passed: map (24 tiles), profile identity, auth redirect all verified

## S238 Work Queue
1. **Full role walkthrough** (shopper + organizer + unauthenticated) — deferred from S237
2. **Mobile verification** (PWA install, touch targets, responsive, no horizontal scroll)
3. **Resend quota decision** — free plan at risk on beta Sundays

---

**Note:** Updated by Records agent at every session wrap. Read this instead of STATE.md for a quick status check.

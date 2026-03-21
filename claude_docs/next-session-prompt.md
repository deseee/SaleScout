# Next Session Prompt — S228

## First: Verify Railway + Stripe Checkout

Railway cache-bust was pushed at the end of S227 (commit 57fabb05, ~22:44 UTC). Check Railway build status:
1. Open Railway dashboard and confirm new deployment from that commit is LIVE
2. Test `/api/stripe/checkout-session` endpoint — should return 200, not 404
3. Test the Upgrade flow on /pricing as an authenticated SIMPLE-tier organizer

If still 404 after Railway shows READY: dispatch findasale-ops to investigate the backend route mounting.

## Primary Work: Fix /pricing WARN Findings

QA audit from S227 found 2 issues on /pricing. Dispatch **findasale-dev** for both:

### WARN 1: Unauthenticated button text
- **Issue:** PRO and TEAMS tier cards show "Upgrade to PRO" / "Upgrade to TEAMS" for unauthenticated users — should be "Sign up for PRO" / "Sign up for TEAMS"
- **File:** likely `packages/frontend/pages/pricing.tsx` — check auth state and conditionally render button label
- **Acceptance:** Unauthenticated visitors see "Sign up for X"; authenticated SIMPLE users see "Upgrade to X"

### WARN 2: No post-Stripe return feedback
- **Issue:** After Stripe checkout redirects back to dashboard, there's no parsing of `?upgrade=success` or `?upgrade=cancelled` query params — user sees no confirmation
- **Files:** Stripe checkout session likely sets `success_url` and `cancel_url` with `?upgrade=success` / `?upgrade=cancelled`. Dashboard needs to read these params and show a toast or banner.
- **Acceptance:** Dashboard shows success toast on `?upgrade=success`; shows neutral message on `?upgrade=cancelled`; clears params from URL after reading

## Secondary: Verify Archived Skill Installs

In S227 we packaged and presented:
- `context-maintenance.skill` — archived redirect to findasale-records
- `findasale-push-coordinator.skill` — archived redirect to CLAUDE.md §5+§11

If Patrick hasn't clicked "Copy to your skills" for both, prompt him to do so. You can confirm by asking Patrick or by checking which skill descriptions appear in the session's available skills list.

## Patrick: Local Sync

Multiple MCP pushes happened in S227. Run this to sync your local repo before any commits:

```
git pull
```

or just run `.\push.ps1` — it self-heals with fetch+merge.

## Roadmap: What's Next

Once the /pricing fixes are dispatched, pick from:
- **#73** Two-Channel Notification System (gated by #72 ✅ now unblocked)
- **#74** Role-Aware Registration Consent Flow (gated by #72 ✅)
- **#75** Tier Lapse State Logic (gated by #72 ✅)
- **Pre-beta safety #106–#109:** Organizer Reputation Scoring, Chargeback+Collusion Tracking, Winning Bid Velocity Check, Off-Platform Transaction Detection
- **Railway env vars still needed:** `AI_COST_CEILING_USD` (set to monthly budget), `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831`

## Reference

- Vercel URL: https://findasale-git-main-patricks-projects-f27190f8.vercel.app
- Test accounts:
  - Shopper: user11@example.com / password123
  - Organizer PRO: user2@example.com / password123
  - Admin/SIMPLE: user1@example.com / password123
- CLAUDE.md v5.0 is the single authority. CORE.md is retired.
- Scheduled tasks: 11 active (see findasale-records SKILL.md for full list)

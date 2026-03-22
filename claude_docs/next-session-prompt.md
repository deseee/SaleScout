# Next Session Prompt — S231

**Date:** 2026-03-21
**Status:** S230 COMPLETE — QA audit done, BUG #22 backend fixed (not yet pushed/verified)

---

## First: Push S230 Changes

```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/backend/src/middleware/auth.ts packages/backend/src/routes/organizers.ts
git add claude_docs/audits/s227-qa-audit.md
git add claude_docs/STATE.md claude_docs/logs/session-log.md claude_docs/next-session-prompt.md claude_docs/.last-wrap
git commit -m "S230: BUG #22 backend fix (requireOrganizer checks roles array) + QA audit report"
.\push.ps1
```

---

## 1. Verify BUG #22 Backend Fix Live

After push: log in as Nina (user1@example.com), navigate to `/organizer/sales`. Sales list should load (no more "Unable to load sales" error). Onboarding modal should complete without 403 loop.

---

## 2. Patrick Manual Actions (Still Blocking #73/#74/#75 Runtime)

**CRITICAL — still not run:**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy
npx prisma generate
```

---

## 3. Bug Fix Dispatch Queue (S231)

Priority order from S230 QA audit:

| Bug | Severity | Scope | Notes |
|-----|----------|-------|-------|
| BUG #22 backend sweep | P0 → P1 | Backend, 15 files | 15 controllers still have `role !== 'ORGANIZER'`. `requireOrganizer` export is in `auth.ts` — dev just needs to import + apply. |
| BUG #32 favorites toggle | P1 | Frontend | Toggle API always returns "Item removed." Favorites page always 0. Same component as #31. |
| BUG #31 heart SVG fill | P1 | Frontend | SVG `fill` stays `none` regardless of toggle state. Aria-label toggles correctly. Same component. |
| BUG #30 Follow handler | P1 | Frontend | Button fires ZERO requests. `POST /api/organizers/:id/follow` endpoint works (verified). Need organizer ID in button onClick. |
| BUG #33 onboarding loop | P2 | Frontend | Skip doesn't persist `findasale_onboarded` to localStorage on navigation. |

Dispatch BUG #31 + #32 together (same component). Then BUG #30. Then BUG #22 sweep.

---

## 4. Next Features: #106–#109 Pre-Beta Safety Batch

Only after bugs above are cleared and Prisma actions run:

| # | Feature | Scope | Estimate |
|---|---------|-------|----------|
| #106 | Rate limit burst capacity | Redis, 429 fallback | M |
| #107 | Database connection pooling | Railway, Neon | M |
| #108 | API timeout guards | Backend, all routes | S |
| #109 | Graceful degradation on outages | Notification, email, AI | M |

---

## Outstanding Configuration

**Railway Environment Variables (Still Missing):**
```
AI_COST_CEILING_USD=5.00
MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831
```

---

## Reference

- Vercel URL: https://findasale-git-main-patricks-projects-f27190f8.vercel.app
- Backend: https://backend-production-153c9.up.railway.app
- Test accounts: Shopper user11, PRO user2, SIMPLE+ADMIN user1, TEAMS user3 (all password123)
- Audit report: `claude_docs/audits/s227-qa-audit.md`
- CLAUDE.md v5.0 is single authority

---

**Next Session Lead:** Push S230 changes → verify BUG #22 live → dispatch #31+#32 to findasale-dev → then #30 → then #22 sweep

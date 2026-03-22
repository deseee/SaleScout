# Next Session Prompt — S230

**Date:** 2026-03-21
**Status:** S229 COMPLETE — Builds repaired, pending Railway/Vercel green confirmation + Prisma actions

---

## Immediate Actions

### 1. Verify Railway + Vercel Build Green
Latest commit fixed `subscriptionStatus` JWT issue. Confirm both are green before any new work:
- Railway backend: should show successful `npx tsc` + startup
- Vercel frontend: should show clean build with no type errors

### 2. Patrick Manual Actions (Still Blocking #73/#74/#75 Runtime)
**CRITICAL — these have NOT been run yet:**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy   # applies RoleConsent + dual-role schema migrations to Neon
npx prisma generate         # regenerates TypeScript client with new fields
```

Without these:
- Feature #73 notifications won't save to DB (table may not exist in Neon)
- Feature #74 RoleConsent records won't save (table doesn't exist at runtime)
- Feature #75 lapse banner visible but subscriptionStatus won't update (webhook writes fail)

---

## Next Features: #106–#109 Pre-Beta Safety Batch

| # | Feature | Scope | Estimate | Notes |
|---|---------|-------|----------|-------|
| #106 | Rate limit burst capacity | Redis, 429 fallback | M | Spike detection, temp overages with backoff |
| #107 | Database connection pooling | Railway, Neon | M | Prevent connection exhaustion under load |
| #108 | API timeout guards | Backend, all routes | S | 30s timeout on all external calls (Stripe, Resend, AI) |
| #109 | Graceful degradation on outages | Notification, email, AI | M | Queue fallback when external services timeout |

Estimate: 2 sessions back-to-back.

---

## Outstanding Configuration

**Railway Environment Variables (Still Missing):**
```
AI_COST_CEILING_USD=5.00
MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831
```
Set in Railway Variables tab → redeploy backend.

---

## S229 Summary

Build repair session. No new features. All 6 issues resolved:
- **stripeController.ts** — 3 webhook handlers using `findUnique` on non-`@unique` field → `findFirst`
- **useNotifications.ts** — named import for default export → fixed + hook deleted (dead code)
- **#75 lapse banner** — `tierLapsedAt` is on `UserRoleSubscription`, not `Organizer`; switched to `subscriptionStatus === 'canceled'` which IS on Organizer + in JWT
- **Lapse banner CTA** — `/organizer/billing` (404) → `/organizer/subscription`
- **notifications.tsx** — `window.location.href` → `router.push` (internal) / `window.open` (external)

---

## Decision Log (Locked — S229)

- **`tierLapsedAt` not in JWT:** Field lives on `UserRoleSubscription`, not `Organizer`. JWT is built from `organizerProfile` (Organizer). Use `subscriptionStatus: 'canceled'` to detect lapse state — it's set by the webhook handlers.
- **Dead hook deleted:** `useNotifications.ts` had no callers. `notifications.tsx` owns its own state. Hook deleted to eliminate maintenance surface.

---

## Reference

- Vercel URL: https://findasale-git-main-patricks-projects-f27190f8.vercel.app
- Test accounts:
  - Shopper: user11@example.com / password123
  - Organizer PRO: user2@example.com / password123
  - Admin/SIMPLE: user1@example.com / password123
- CLAUDE.md v5.0 is the single authority
- Scheduled tasks: 11 active (see findasale-records SKILL.md for full list)

---

**Next Session Lead:** Verify builds green → run Prisma actions → findasale-dev (#106–#109 dispatch)

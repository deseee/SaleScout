# Next Session Prompt — S235

**Date:** 2026-03-22
**Status:** S234 COMPLETE — Build fixes done. Passkey security hardened. Features #106–#109 pre-beta safety batch shipped. Railway env vars set. Prisma actions completed.

---

## Session Start Checklist

1. Load `STATE.md`
2. Check Sentry (https://deseee.sentry.io) — verify errors from S233 continue resolving after S234 passkey/timeout middleware deploys
3. Verify Railway + Vercel build green after S234 push

---

## Still-Pending Patrick Actions

**pnpm-lock.yaml regeneration (BLOCKING Railway build):**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
pnpm install
git add pnpm-lock.yaml packages/backend/package.json
git commit -m "fix: add rate-limit-redis to lockfile"
.\push.ps1
```

**Railway env vars for #107 (DATABASE_URL_UNPOOLED):**
```
DATABASE_URL=postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**prisma generate after Railway env vars set:**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma generate
```

---

## 1. Start: Patrick Runs pnpm install + Lockfile Commit

The rate-limit-redis package was added to backend but pnpm-lock.yaml is stale. Patrick must:
1. Run `pnpm install` in project root
2. Commit pnpm-lock.yaml + package.json
3. Push (.\.push.ps1)

This unblocks Railway build. Vercel depends on it.

---

## 2. Patrick Sets Railway env vars for #107

After lockfile is committed:
1. Set DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct) in Railway dashboard
2. Run `prisma generate` locally to regenerate client with directUrl field

This completes #107 connection pooling config. Required before any database-heavy load testing.

---

## 3. Verify Builds Green

After Patrick's lockfile + env var commits:
1. Monitor Railway build — should complete without ERR_ERL_KEY_GEN_IPV6 or frozen-lockfile errors
2. Monitor Vercel build — should complete without TypeScript errors
3. If both green, proceed to QA

---

## 4. Full Follow System + Edit-Sale Dates Live Test (Deferred from S234 QA)

**Scope:** Live test on https://finda.sale the two backend fixes that were code-verified but not live-tested:
- **Follow system:** Organizer's follow button fires POST, counter increments, refresh persists
- **Edit-sale dates:** Dates pre-populate from existing sale data (was blank in S232 BUG-07)

Use test account `user2` (PRO organizer) or `user11` (shopper). Create/edit a test sale if needed.

---

## 5. Beta Recruitment Outreach (CONDITIONAL)

**QA verdict from S234:** CONDITIONAL GO — all 24 prior bugs fixed, #106–#109 hardening complete, passkey security improved.

If live testing (§4) clears all flows:
- Dispatch `findasale-sales-ops` to start organizer recruitment outreach
- Prepare 5–10 beta organizers list (Grand Rapids area, estate sale experience)
- Outreach script: "We're launching FindA.Sale beta — early access to streamline estate sale management"

---

## Reference

- Vercel: https://findasale-git-main-patricks-projects-f27190f8.vercel.app
- Backend: https://backend-production-153c9.up.railway.app
- Sentry: https://deseee.sentry.io/issues/errors-outages/
- Test accounts: Shopper `user11`, PRO `user2`, SIMPLE+ADMIN `user1`, TEAMS `user3` (all `password123`)
- QA audit (original — S232): `claude_docs/operations/qa-audit-2026-03-22.md`
- Passkey security fixes: `packages/backend/src/lib/webauthnChallenges.ts`, `packages/backend/src/controllers/passkeyController.ts`
- Features #106–#109: `packages/backend/src/middleware/requestTimeout.ts`, `packages/database/prisma/schema.prisma` (directUrl)

---

**Next Session Lead:** Patrick runs pnpm install + env vars → verify builds green → live test follow system + edit dates → if PASS, dispatch sales-ops for beta recruitment

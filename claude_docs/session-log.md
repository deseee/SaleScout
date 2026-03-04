# Session Log — FindA.Sale

Cross-session memory for Claude. Updated at every session end.
Read this at session start to understand recent context without loading extra files.
Keep only the 5 most recent sessions. Delete older entries — git history and STATE.md are the durable record.

---

## Recent Sessions

### 2026-03-04 (session 31 — H1-H11 Pre-Beta Audit Fixes + Track B Docker Gap)
**Worked on:** Fixed all 11 high-severity pre-beta audit findings. H1: organizer badges/rating in getSale. H2: Promise.allSettled for partial upload success. H3: email/name normalization on auth. H4: weekend filter Saturday edge case. H5: mobile card views for 3 dashboard tables. H6: loading="lazy" on 16 frontend files (Python script introduced JSX arrow-operator bug in SaleCard.tsx — caught and fixed). H7: Zod CSV row validation. H8: global Express error handler. H9: Stripe webhook secret guard. H10: CAN-SPAM one-click unsubscribe (email link + backend endpoint + /unsubscribe page). H11: Resend domain — already verified, no action needed. Track B: tested all 5 Docker-from-VM options (MCP registry ✗, TCP 2375/2376 ✗, SSH ✗, relay ✗) — accepted gap, documented in RECOVERY.md entry 17. All 27 changed files pushed to GitHub via MCP.
**Decisions:** Docker-from-VM gap is permanent unless Patrick manually enables TCP socket in Docker Desktop settings. Working pattern remains copy-paste PowerShell. Python lazy-load scripts that use regex on JSX must be reviewed for arrow-operator splits before committing.
**Next up:** Activate fixes in Docker (`docker compose restart backend`, then `docker compose build --no-cache frontend && docker compose up -d`). Then begin M1-M19 medium findings or move to real-user beta.
**Blockers:** None. All fixes pushed. Docker restart/rebuild required to activate on localhost.

### 2026-03-03 (session 30 — C1-C7 Audit Fixes + DB Reset + Smoke Tests)
**Worked on:** Fixed all 7 critical audit findings: C1 role whitelist, C2 referralCode in JWT/AuthContext, C3 category+condition in getSale, C4 AffiliateLink userId + schema, C5 Stripe idempotency key, C6/C7 verified clean. Fixed cascading schema drift (SaleSubscriber composite PK mismatch, Favorite.updatedAt not in DB). Ran migrate reset --force to fix migration drift, fixed seed.ts (missing AffiliateLink userId), regenerated Prisma client. Smoke-tested C1/C2/C3 via Claude in Chrome fetch API — all pass. Added RECOVERY.md entries 12–16. Also discovered: `docker exec` JSON POST via curl silently fails on Windows PowerShell (req.body={}); Claude in Chrome is the correct tool for API smoke tests. Learned: Chrome extension must be connected at session start.
**Decisions:** Use Claude in Chrome (browser fetch) for all API smoke tests — never curl through docker exec sh -c on Windows. Schema.prisma must match migration SQL exactly; always verify with grep on migration files before editing. Prisma client must be regenerated after any schema change AND container restarted to pick it up.
**Next up:** Fix H1-H11 (high severity findings). Also explore Docker-from-VM workarounds — investigate MCP Docker connector or TCP socket approach so Claude can run docker commands without Patrick copy-pasting from PowerShell.
**Blockers:** None. All C1-C7 fixes pushed to GitHub. DB seeded and healthy.

### 2026-03-03 (session 29 — Pre-Beta Audit: Health Scout + Full User Journey)
**Worked on:** Health scout scan (7 phases) — GREEN status, 0 critical, 1 high, 2 medium. Fixed high: removed password reset token from console log (auth.ts:96). Fixed medium: gated env-var presence logs behind NODE_ENV (index.ts:176-182). Ran comprehensive user journey audit across registration, login, homepage, sale detail, organizer dashboard, shopper dashboard, referrals, creator dashboard, photo upload, responsive design, PWA compliance, SEO, Stripe payments, error handling, email/notification, and performance. Appended Part 2 (PWA/SEO/payments/errors/perf) to audit report. Total: 51 findings — 7 critical, 11 high, 19 medium, 14 low. All findings documented in `claude_docs/pre-beta-audit-2026-03-03.md` with file:line, severity, and fix instructions. Supplemental detail in `claude_docs/audit-remaining-areas-2026-03-03.md`.
**Decisions:** Health report and audit report are the authoritative fix list for beta readiness. Next sessions use Sonnet to execute fixes in priority order (C1-C7 first, then H1-H11, then M1-M19). All 3 Stripe critical issues (C5-C7) must be fixed before any real payment transactions.
**Next up:** Fix all 7 critical findings (C1-C7) in priority order. Then high findings. See `pre-beta-audit-2026-03-03.md` Combined Recommended Fix Order table.
**Blockers:** None. All audit docs pushed to GitHub.

### 2026-03-03 (session 28 — Workflow Audit, Seed Fixes, Retrospective Task)
**Worked on:** Research-backed audit of AI workflow vs power-user best practices → `claude_docs/workflow-audit-2026-03-03.md`. Fixed `update-context.js` stale Docker fallback. Fixed two seed bugs: organizer role + stripeConnectId always null. Reseeded DB — clean. Created `findasale-workflow-retrospective` scheduled task (8th of month, 9am). Wrote full pre-beta audit plan to `claude_docs/next-session-prompt.md`. Added GitHub MCP self-awareness to CLAUDE.md (Section 5) and self_healing_skills.md (Skill 11 rewritten). Added Phase 0 tool/plugin inventory to next-session-prompt.md.
**Decisions:** Never preserve stale Docker data in update-context.js. Seed stripeConnectId always null. GitHub MCP is the push mechanism for all session wraps. Workflow retrospective runs on the 8th.
**Next up:** Full pre-beta audit using Opus 4.5 — Phase 0 tool inventory, health-scout, manual flow audit, backend security scan, PWA/SEO, schema review. See `next-session-prompt.md`.
**Blockers:** None. All changes pushed to GitHub.

### 2026-03-03 (session 27 — Image Loading, CORS & Backend Fixes)
**Worked on:** Fixed "Error Loading Sales" on finda.sale via `ngrok-skip-browser-warning: true` header in axios (ngrok interstitial was returning HTML instead of JSON to browser fetch). Fixed sale/item card images not loading via multi-round diagnosis: (1) added `fastly.picsum.photos` to CSP `img-src`; (2) fixed Workbox OSM tile pattern, added NetworkOnly for Stripe, StaleWhileRevalidate for picsum; (3) updated seed.ts to use direct `fastly.picsum.photos` HMAC URLs (no redirect chain — eliminates SW redirect interception). Added CORS regex for Vercel preview deployments (`findasale*.vercel.app`). Added `app.set('trust proxy', 1)` to silence rate-limiter X-Forwarded-For warning from ngrok. All fixes committed to GitHub (c813d57, 3cf0833, 28fa3e0). finda.sale images confirmed working.
**Decisions:** Direct fastly.picsum.photos URLs (HMAC-signed, no redirect) are the correct approach for seed photos — avoids SW + redirect chain interaction entirely. `next.config.js` is NOT bind-mounted in Docker, so CSP changes require a frontend rebuild to reach localhost:3000.
**Next up:** (1) `docker compose build --no-cache frontend && docker compose up -d` to fix localhost:3000 images. (2) Re-seed DB after rebuild: `docker exec findasale-backend-1 sh -c "cd /app && npx tsx packages/database/prisma/seed.ts"`. (3) Check Resend domain verification. (4) Decide on permanent backend host (Railway/Render/Fly.io).
**Blockers:** localhost:3000 images still broken — next.config.js CSP change not picked up by Docker frontend container until rebuild.

### 2026-03-03 (session 26 — Dev Tooling & Full Rebrand Completion)
**Worked on:** CSP fix for ngrok API calls (connect-src now derives origin from NEXT_PUBLIC_API_URL at build time, committed acec537). Session self-awareness improvements: update-context.js emits ## Environment section (GitHub auth, ngrok URL, CLI tools); CORE.md got edit transparency rule; context-maintenance skill updated with capabilities inventory, dirty-session detection (.last-wrap), breakpoint wraps, two-tier memory, next-session-prompt.md handoff doc. Post-commit hook (.git/hooks/post-commit) auto-regenerates context.md on every commit. All 9 salescout-* scheduled tasks replaced with 8 findasale-* equivalents. backend/.env updated to local Docker postgres URL. All remaining salescout/SaleScout references removed from skills (dev-environment, health-scout, findasale-deploy) and project docs (CLAUDE.md, SECURITY.md, STATE.md, session-log.md, self_healing_skills.md). Three skill files repackaged and ready to install.
**Decisions:** Historical session-log entries with SaleScout references preserved as accurate records of the rebrand. findasale-deploy replaces salescout-deploy — old skill must be uninstalled after new one is installed.
**Next up:** (1) Install dev-environment.skill, health-scout.skill, findasale-deploy.skill via Cowork skill manager. (2) Uninstall salescout-deploy. (3) Verify ngrok up: `docker logs findasale-ngrok-1`. (4) Set NEXT_PUBLIC_API_URL in Vercel env vars + redeploy to fix "Error Loading Sales". (5) Check Resend domain verification. (6) Decide on permanent backend host (Railway/Render/Fly.io).
**Blockers:** 3 skill files waiting to be installed. NEXT_PUBLIC_API_URL not baked into Vercel build — finda.sale shows "Error Loading Sales" until redeployed.


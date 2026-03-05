# Next Session Resume Prompt
*Written: 2026-03-05T00:00:00Z*
*Session ended: normally*

## Resume From

Run the self-healing diagnostic below first, then begin Sprint T — T1 stress test suite.

---

## Self-Healing Diagnostic — Run at Start of Next Session

This week (sessions 54–61) had repeated git, Docker, and deploy failures. Run this before touching any code:

### 1. Git state check
```powershell
git status
git log --oneline -5
```
Expected: clean working tree, HEAD at `3974bbb` or later. If dirty — see self_healing_skills.md entry #29 (nuclear reset: `git fetch origin && git reset --hard origin/main`).

### 2. Docker health
```powershell
docker compose ps
docker compose logs --tail=20 backend
docker compose logs --tail=10 frontend
```
Expected: all services running. No `Cannot find module` errors. If backend crashes on `@sentry/node` or similar — run `pnpm install && docker compose build --no-cache backend && docker compose up -d`.

### 3. reservationExpiryJob
In backend logs: look for `TypeError: Cannot read properties of undefined (reading 'findMany')`. If present — stale Prisma client → `docker compose build --no-cache backend && docker compose up -d`.

### 4. roadmap.md version
```powershell
head -3 claude_docs/roadmap.md
```
Expected: `v9 — Post-launch reorganization`. If it shows v3, v6, or any earlier version — local file is stale. Overwrite from GitHub using the MCP: `mcp__github__get_file_contents` for `deseee/findasale` → `claude_docs/roadmap.md`.

### 5. Vercel status
Check https://vercel.com dashboard — last deployment should be green. If failed with `ERR_PNPM_OUTDATED_LOCKFILE` — run `pnpm install && git add pnpm-lock.yaml && git commit -m "chore: update lockfile" && git push` (self_healing entry #32).

### 6. Sentry end-to-end test (not yet verified)
Add temporarily to `packages/backend/src/index.ts` before `Sentry.setupExpressErrorHandler`:
```typescript
app.get('/sentry-test', () => { throw new Error('Sentry test — backend'); });
```
Hit `http://localhost:5000/sentry-test` → check Sentry backend project for the event → remove the route and commit.

---

## What Was In Progress

Nothing mid-task. All blockers from sessions 59–61 resolved. Sprint T has not started.

---

## What Was Completed This Session (61)

- Sentry fully deployed: `@sentry/node` + `@sentry/nextjs` running in Docker, Vercel green, DSNs in Railway + Vercel
- `pnpm-lock.yaml` committed (was blocking Vercel with `ERR_PNPM_OUTDATED_LOCKFILE`)
- Git CRLF crisis resolved: `.gitattributes` rule + case-sensitivity duplicate index entries caused perpetual dirty `roadmap.md`/`ROADMAP.md` loop — resolved via `git reset --hard origin/main`
- Local `roadmap.md` restored from v3 (stale) to v9 (current)
- `self_healing_skills.md` entries 29 (updated with nuclear fix), 30 (`.gitattributes` CRLF), 31 (case-sensitivity duplicate index), 32 (pnpm frozen lockfile) added

---

## Environment Notes

- Git: clean, HEAD at `3974bbb` (chore: update lockfile for @sentry/node and @sentry/nextjs)
- Docker: all containers running after rebuild (backend + frontend + image-tagger)
- Vercel: deploying from commit `3974bbb` — check dashboard for green
- Railway: backend live, `SENTRY_DSN` set
- `pnpm-lock.yaml` is current

## Known Issues Still Open

- **Phase 31 OAuth** — social login dormant until `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` added to Vercel env vars + redirect URIs configured at `https://finda.sale/api/auth/callback/{google,facebook}`
- **Uptime monitoring** — Patrick needs to create UptimeRobot or StatusGator free account and share alert URL
- **Sentry end-to-end test** — see diagnostic step 6 above

---

## Sprint T Spec (start here after diagnostic passes)

Full spec in `claude_docs/roadmap.md` → Sprint T section. Work order:

1. **T1** — `scripts/health-check.ts`: schema drift, dead routes, stale doc refs, orphaned migrations, console.log stubs
2. **T2** — Extend `.githooks/pre-push` with Prisma lint + auth middleware grep
3. **T3** — Favorites categories: `GET /api/favorites?category=X` + tab UI on `/favorites` page
4. **T4** — Virtual Line SMS E2E: complete `lineController` scaffold with Twilio join + notify flow

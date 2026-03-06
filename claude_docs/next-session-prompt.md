# Next Session Resume Prompt
*Written: 2026-03-05 (Session 75 wrap)*
*Session ended: normally*

## Resume From

GitHub sync — partially complete. Batches 1–3 pushed via MCP. Patrick is completing
the remainder via PowerShell (manual push — see below). After that, next feature work
is CA7 (human documentation) or CD2 Phase 2 (engagement layer) on Patrick's signal.

---

## GitHub Sync Status

### Already pushed via MCP (Batches 1–3):
- `packages/database/prisma/` — schema.prisma + all 26 migrations + seed.ts + migration_lock.toml
- `packages/backend/src/index.ts`, `instrument.ts`
- `packages/backend/src/services/` — cloudAIService.ts, emailReminderService.ts, pointsService.ts, webhookService.ts
- `packages/backend/src/lib/` — prisma.ts, socket.ts
- `packages/backend/src/middleware/auth.ts`
- `packages/backend/src/models/LineEntry.ts`
- `packages/backend/src/utils/` — stripe.ts, webpush.ts
- `packages/backend/src/controllers/` — all 22 controller files

### Patrick pushes manually from PowerShell:
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale

git add packages/backend/src/routes
git add packages/backend/src/jobs
git add packages/backend/src/tests
git add packages/frontend/components
git add packages/frontend/hooks
git add packages/frontend/contexts
git add packages/frontend/lib
git add packages/frontend/pages
git add packages/frontend/styles
git add packages/frontend/types
git add packages/frontend/public
git add packages/frontend/*.ts packages/frontend/*.js packages/frontend/*.json
git add packages/shared/src
git add packages/database/package.json
git add packages/backend/package.json packages/backend/tsconfig.json packages/backend/Dockerfile
git add packages/frontend/Dockerfile
git add docker-compose.yml package.json pnpm-workspace.yaml railway.toml
git add claude_docs/
git add CLAUDE.md README.md context.md
git commit -m "sync: push all remaining source files from sessions 65-74"
git push origin main
```
**Skip:** `.env` files, `pnpm-lock.yaml`, `node_modules/`, `.next/`, `dist/`, `build/`, `tsconfig.tsbuildinfo`

---

## Workflow Change (effective this session)

MCP push is now limited to 1–5 files per session wrap.
Bulk pushes are always done manually by Patrick from PowerShell.
CLAUDE.md Section 5 updated to reflect this.

---

## What Was Completed Sessions 74–75

- Audited local vs GitHub — flagged ~200 unpushed files
- Updated ROADMAP.md to v11, pushed (commit `c0597e2`)
- Pushed Batches 1–3 via MCP (database, backend core, all controllers)
- Decided bulk push workflow should be manual — updated CLAUDE.md + this file

---

## Next Feature Work (Patrick's signal)

- **CA7** — Human-facing documentation (user guide, organizer guide)
- **CD2 Phase 2** — Engagement layer (recently viewed, wishlist alerts, scarcity nudges)
- **P1** — Business cards (PNG logos ready in `claude_docs/brand/`), Google Business Profile
- **P2** — Stripe business account, Google Voice, Search Console
- **P5** — OAuth credentials (Google + Facebook) + Railway env var additions

## Pending Manual Actions (unchanged)

- Phase 31 OAuth env vars in Vercel: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- Railway migrations: verify 4 pending migrations ran on last deploy
- Support email `support@finda.sale` not configured

## Environment Notes

Native dev stack (no Docker for core). Beta target: March 12–19, 2026.

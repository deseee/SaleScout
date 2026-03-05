# Next Session Resume Prompt
*Written: 2026-03-05T14:15:00Z*
*Session ended: normally — doc audit complete, feature blockers pending*

## Resume From
Fix the three environment blockers below before starting Sprint T.

## What Was In Progress
Three blockers need resolving before Sprint T can start:

1. **Git CRLF drift** — ROADMAP.md perpetually dirty on Windows due to `core.autocrlf`. Run:
   ```powershell
   git stash
   git pull --rebase
   git stash pop
   git push
   ```
   If ROADMAP.md still shows as modified after stash, commit it directly:
   ```powershell
   git add claude_docs/ROADMAP.md
   git commit -m "docs: fix CRLF drift on ROADMAP.md"
   git pull --rebase
   git push
   ```
   Also re-commit the archive files (came back after git reset):
   ```powershell
   git add claude_docs/archive/
   git rm --cached claude_docs/pre-beta-audit-2026-03-03.md claude_docs/rebrand-audit.md claude_docs/workflow-audit-2026-03-03.md
   git commit -m "docs: archive one-time audit files"
   git push
   ```

2. **reservationExpiryJob TypeError** — `prisma.itemReservation` undefined, Prisma client predates Phase 21. Fix:
   ```powershell
   docker-compose up --build -d backend
   ```

3. **next-auth missing from frontend** — in `package.json` but container never rebuilt. Fix:
   ```powershell
   pnpm install
   docker compose build --no-cache frontend
   docker compose up -d
   ```

## What Was Completed This Session
- Full claude_docs audit: STACK.md fixed, DEVELOPMENT.md cleaned, OPS.md rewritten
- 3 one-time audit files moved to `claude_docs/archive/`
- CORE.md §14: Tier 1/2/3 doc classification + anti-bloat rules
- CORE.md §2 step 6: GitHub sync check at session start
- context-maintenance skill: Step 0 (Archive Check) added to Session End Protocol
- self_healing entry #29: git local/GitHub drift pattern

## Environment Notes
- Local git needs a clean `git pull --rebase + git push` (see blocker 1 above)
- Install `context-maintenance.skill` from the FindaSale folder root (updated Archive Check step)
- All doc changes pushed to GitHub via MCP

## Exact Context
- Archive files moved locally to `claude_docs/archive/` (not yet committed — blocker 1)
- CORE.md: §14 and §2 step 6 live on GitHub (SHA: `371563b7`)
- self_healing_skills.md: 29 entries on GitHub (SHA: `8640c3b2`)
- reservationExpiryJob error: `TypeError: Cannot read properties of undefined (reading 'findMany')` in `packages/backend/src/jobs/reservationExpiryJob.ts`
- Sprint T spec: `claude_docs/roadmap.md` — stress tests, pre-commit validation, favorites categories, virtual line SMS E2E

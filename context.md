# Dynamic Project Context
*Generated at 2026-03-05 (session 43 — compressed)*

## Git Status
- **Branch:** main
- **Commit:** 2b017cb
- **Remote:** https://github.com/deseee/findasale.git

## Last Session
### 2026-03-05 (session 42)
Sprint A complete. Stripe 7% fee now item-level. category/condition persistence bug fixed.
**Next:** Sprint B — Phase 24+25 design system + bottom tab nav.

## Health Status
Last scan: 2026-03-03 — **GREEN**. One high-severity item (password reset token logged) needs fix before real traffic.

## Signals
⚠ Env drift — in .env.example but missing from .env: HF_TOKEN
✓ TODOs: none found

---

## Path Lookup

Quick-reference paths for common file lookups. Use `ls` or Glob for deeper exploration.

```
Root Config:
  docker-compose.yml, package.json, pnpm-workspace.yaml, .env, .env.example

Claude Docs:
  claude_docs/STATE.md, CORE.md, ROADMAP.md, SECURITY.md, RECOVERY.md
  claude_docs/STACK.md, OPS.md, DEVELOPMENT.md, SEED_SUMMARY.md
  claude_docs/self_healing_skills.md, session-log.md, next-session-prompt.md
  claude_docs/COMPLETED_PHASES.md (archive)
  claude_docs/research/ (competitor intel, growth channels)
  claude_docs/health-reports/ (scan history)

Backend (packages/backend/):
  src/index.ts (entry point)
  src/controllers/ — auth, item, sale, stripe, stripeStatus, upload, affiliate,
                      favorite, geocode, line, marketingKit, notification, push, user
  src/routes/ — auth, items, sales, stripe, upload, affiliate, favorites,
                geocode, lines, notifications, organizers, push, users, contact
  src/middleware/auth.ts
  src/lib/prisma.ts
  src/jobs/ — auctionJob, emailReminderJob, notificationJob
  src/services/emailReminderService.ts
  src/utils/ — stripe.ts, webpush.ts
  src/__tests__/ — emailReminders.e2e, stripe.e2e, weeklyDigest.e2e
  services/image-tagger/ — app.py, tagger.py, Dockerfile, tests/

Database (packages/database/):
  prisma/schema.prisma, prisma/seed.ts
  prisma/migrations/ (16 migrations)

Frontend (packages/frontend/):
  pages/ — index, login, register, forgot-password, reset-password,
           about, contact, faq, terms, privacy, offline, 404, 500, profile,
           unsubscribe, referral-dashboard
  pages/sales/[id].tsx, pages/sales/zip/[zip].tsx
  pages/items/[id].tsx
  pages/city/[city].tsx
  pages/organizer/ — dashboard, create-sale, add-items, add-items/[saleId],
                      edit-item/[id], edit-sale/[id], settings, send-update/[saleId],
                      line-queue/[id]
  pages/organizers/[id].tsx
  pages/shopper/ — dashboard, purchases
  pages/creator/dashboard.tsx
  pages/affiliate/[id].tsx
  components/ — AuthContext, Layout, SaleCard, SaleMap, SaleMapInner, ItemCard,
                CheckoutModal, BidModal, AuctionCountdown, CSVImportModal,
                BadgeDisplay, InstallPrompt, SaleShareButton, SaleSubscription,
                Skeleton, ToastContext
  hooks/usePushSubscription.ts
  lib/api.ts
  next.config.js, tailwind.config.js, manifest.json

Shared (packages/shared/):
  src/index.ts (cross-boundary types)
```

## Tool & Skill Tree

```
MCP Connectors (check at session start):
├── mcp__github__*          — GitHub push, PR, issues (deseee/findasale)
├── mcp__Claude_in_Chrome__ — Browser automation, screenshots
├── mcp__MCP_DOCKER__       — Playwright browser, code execution
├── mcp__scheduled-tasks__  — Cron scheduling
├── mcp__cowork__           — File access, directory requests
└── mcp__mcp-registry__     — Search/suggest connectors

Skills (loaded on demand):
├── conversation-defaults   — AskUserQuestion workaround + diff-only gate
├── dev-environment         — Docker/DB/Prisma reference
├── context-maintenance     — Session wrap protocol
├── health-scout            — Proactive code scanning
├── findasale-deploy        — Deploy checklist
├── skill-creator           — Create/edit/eval skills
├── docx / xlsx / pptx / pdf — Document creation
└── schedule                — Scheduled tasks

Docker Containers: findasale-backend-1, findasale-frontend-1, findasale-postgres-1, findasale-image-tagger-1
Self-Healing Skills: 20 entries in claude_docs/self_healing_skills.md
```

## On-Demand References
- Schema: `packages/database/prisma/schema.prisma`
- Dependencies: `packages/*/package.json`
- Env vars: `packages/*/.env.example`
- Stack decisions: `claude_docs/STACK.md`
- Security: `claude_docs/SECURITY.md`
- Ops: `claude_docs/OPS.md`

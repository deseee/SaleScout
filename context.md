# Dynamic Project Context
*Generated at 2026-03-10T02:11:51.991Z*
*Run `node scripts/update-context.js` on Windows to refresh.*

## Last Session
### 2026-03-10
**Worked on:** (1) Parallel P1–P4 dispatch: migration rollback plan, beta organizer email sequence, spring content pipeline, beta dry run friction log (15 items catalogued). P5 VAPID confirmed done by Patrick. (2) 13/15 friction items implemented via 5 parallel agents: dashboard wizard auto-launch + add-items sale selector (Dev A), add-items listing type consolidated to single select (Dev B), edit-sale DRAFT/LIVE badge + publish toggle + date TZ normalization (Dev C), checkout ToS/fee display/retry/receipt (Dev D), UX copy spec (UX). Items 7 (bulk edit) and 13 (neighborhood autocomplete) deferred. (3) Vercel build cascade: Dev D hallucinated a full 200-line rewrite of items/[id].tsx replacing 563-line file with non-existent imports (`@findasale/shared`, `@/lib/apiClient`). Restored from local disk, then resolved 6 cascading TypeScript errors across 4 commits (Skeleton height prop, getOptimizedUrl arity, CountdownTimer null guard, ReverseAuctionBadge/ItemShareButton/BuyingPoolCard missing/wrong props, PhotoLightbox startIndex→initialIndex, dashboard user.createdAt non-existent on JWT User). (4) QA P2: sale selector dropdown z-10→z-50, reverse auction validation onBlur per-field.
**Decisions:** Dev agents require explicit "diff-only, no full rewrites" in every dispatch prompt — Dev D violation proved this is mandatory. onboardingComplete flag is the sole wizard gate (dropped 24hr `user.createdAt` check — field not in JWT User). Self-healing entry #53 added.
**Token efficiency:** 5 parallel agent dispatches (friction items) + 7 sequential hotfix commits. High output but 6 Vercel build cycles consumed significant overhead due to agent hallucination. No repair loops after restore.
**Token burn:** ~150k tokens (est.), 2 checkpoints logged.
**Next up:** Patrick `git stash && git pull` to sync local. Deferred friction items 7 (bulk edit) + 13 (neighborhood autocomplete). Beta organizer outreach. Stripe business account setup.
**Blockers:** Patrick git sync needed (local is pre-session, all fixes on GitHub). Stripe business account still pending. Google Search Console still pending.

## Health Status
Last scan: records-audit-sessions-110-118-2026-03-09
3 documentation drift items found. 2 are HIGH priority — features marked as open that

## Environment
- GitHub CLI: ✗ not authenticated (not required when GitHub MCP is active — check MCP tools at session start)
- CLI tools: node
- Dev stack: native (backend/frontend/postgres run natively on Windows — no Docker)

## Signals
⚠ Env drift — in .env.example but missing from .env: MAILERLITE_API_KEY, DEFAULT_CITY, DEFAULT_STATE, DEFAULT_STATE_ABBREV, DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RADIUS_MILES, DEFAULT_COUNTY, DEFAULT_TIMEZONE
✓ TODOs: none found

## Project File Tree
```
├── .checkpoint-manifest.json
├── .env
├── .env.example
├── .gitattributes
├── .githooks/
│   ├── pre-commit
│   └── pre-push
├── .gitignore
├── AGENT_QUICK_REFERENCE.md
├── CLAUDE.md
├── README.md
├── STRIPE_WEBHOOK_HARDENING.md
├── ai-config/
│   └── global-instructions.md
├── claude_docs/
│   ├── .last-wrap
│   ├── CORE.md
│   ├── RECOVERY.md
│   ├── SECURITY.md
│   ├── SESSION_WRAP_PROTOCOL.md
│   ├── STACK.md
│   ├── STATE.md
│   ├── WRAP_PROTOCOL_QUICK_REFERENCE.md
│   ├── beta-launch/ (4 files)
│   ├── brand/ (8 files)
│   ├── competitor-intel/ (1 files)
│   ├── feature-notes/ (6 files)
│   ├── guides/ (0 files)
│   ├── health-reports/ (1 files)
│   ├── improvement-memos/ (0 files)
│   ├── logs/ (2 files)
│   ├── marketing/
│   │   ├── content-pipeline/
│   │   │   └── spring-content-2026-03-09.md
│   │   └── spring-2026-content.md
│   ├── next-session-prompt.md
│   ├── operations/ (13 files)
│   ├── qa/
│   │   └── payment-edge-cases-2026-03-09.md
│   ├── research/ (1 files)
│   ├── security/
│   │   └── oauth-redteam-2026-03-09.md
│   ├── self-healing/ (1 files)
│   ├── skills-package/ (27 files)
│   ├── strategy/ (4 files)
│   └── workflow-retrospectives/ (0 files)
├── docs/
│   └── CD2_PHASE2_TREASURE_HUNT.md
├── next
├── package.json
├── packages/
│   ├── backend/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── CLAUDE.md
│   │   ├── Dockerfile
│   │   ├── Dockerfile.production
│   │   ├── docs/
│   │   │   └── EMAIL_SMS_REMINDERS.md
│   │   ├── nodemon.json
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   ├── emailReminders.e2e.ts
│   │   │   │   ├── stripe.e2e.ts
│   │   │   │   └── weeklyDigest.e2e.ts
│   │   │   ├── _triggerDigest.ts
│   │   │   ├── config/
│   │   │   │   └── regionConfig.ts
│   │   │   ├── controllers/ (52 files)
│   │   │   ├── index.ts
│   │   │   ├── instrument.ts
│   │   │   ├── jobs/ (11 files)
│   │   │   ├── lib/ (3 files)
│   │   │   ├── middleware/ (2 files)
│   │   │   ├── models/ (1 files)
│   │   │   ├── routes/ (54 files)
│   │   │   ├── services/ (19 files)
│   │   │   └── utils/ (2 files)
│   │   └── tsconfig.json
│   ├── database/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── migrations/ (72 migrations)
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── .env.local
│   │   ├── .env.local.example
│   │   ├── .gitignore
│   │   ├── CLAUDE.md
│   │   ├── Dockerfile
│   │   ├── components/ (93 files)
│   │   ├── context/ (1 files)
│   │   ├── contexts/ (1 files)
│   │   ├── hooks/ (8 files)
│   │   ├── lib/ (3 files)
│   │   ├── next-env.d.ts
│   │   ├── next-sitemap.config.js
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── pages/ (48 files)
│   │   ├── postcss.config.js
│   │   ├── public/ (14 files)
│   │   ├── sentry.client.config.ts
│   │   ├── sentry.edge.config.ts
│   │   ├── sentry.server.config.ts
│   │   ├── styles/ (2 files)
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── types/ (3 files)
│   │   └── utils/ (1 files)
│   └── shared/
│       ├── CLAUDE.md
│       ├── package.json
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
├── pnpm
├── pnpm-workspace.yaml
├── push.ps1
├── railway.toml
└── scripts/
    ├── health-check.ts
    ├── session-wrap-check.ps1
    ├── session-wrap-check.sh
    ├── stress-test.js
    └── update-context.js

```

## Tool & Skill Tree
MCP tools are injected at session start — check active tools before assuming availability.
```
MCP Connectors (check at session start):
├── mcp__github__*          — GitHub file push, PR, issues (repo: deseee/findasale)
├── mcp__Claude_in_Chrome__ — Browser automation, screenshots, form filling
├── mcp__scheduled-tasks__  — Cron scheduling for recurring tasks
├── mcp__cowork__           — File access, directory requests, file presentation
├── mcp__afd283e9__*        — Stripe (payments, subscriptions, customers)
└── mcp__mcp-registry__     — Search/suggest additional connectors

Skills (loaded on demand — full fleet in Cowork sidebar):
├── conversation-defaults   — Session behavior rules (always active)
├── dev-environment         — Env/DB/Prisma reference (load before shell commands)
├── context-maintenance     — Session wrap protocol (load at session end)
├── health-scout            — Code scanning (load before deploys)
├── findasale-{dev,architect,qa,ops,deploy,records,workflow} — Core dev fleet
├── findasale-{marketing,cx,support,legal,ux,rd} — Business fleet
├── skill-creator / cowork-power-user — Meta skills
└── docx / xlsx / pptx / pdf / schedule — Document + task skills

Self-Healing Skills: see `claude_docs/self-healing/self_healing_skills.md`
```

## On-Demand References
Read these files only when the task requires them — they are not loaded by default.
- Schema: `packages/database/prisma/schema.prisma`
- Dependencies: `packages/*/package.json` (and root `package.json`)
- Env vars: `packages/*/.env.example`
- Stack decisions: `claude_docs/STACK.md`
- Project state: `claude_docs/STATE.md`
- Security rules: `claude_docs/SECURITY.md`
- Ops procedures: `claude_docs/operations/OPS.md`
- Session history: `claude_docs/logs/session-log.md`
- Self-healing: `claude_docs/self-healing/self_healing_skills.md`

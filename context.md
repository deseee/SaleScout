# Dynamic Project Context
*Generated at 2026-03-04T11:43:43.989Z*

## Git Status
- **Branch:** main
- **Commit:** 74684b9
- **Remote:** https://github.com/deseee/findasale.git

## Last Session
### 2026-03-04
**Worked on:** Implemented Phase 9 (affiliate conversion tracking), Phase 12 (auction cron + frontend), and Phase 11 (PWA push notifications). Phase 9: fixed affiliateController prisma import, added `conversions` + `affiliateLinkId` to schema, wired Stripe metadata attribution, built `affiliate/[id].tsx` redirect page, updated creator dashboard stats, wired sessionStorage ref in CheckoutModal. Phase 12: fixed auctionJob.ts cron (was never scheduled), built AuctionCountdown + BidModal components, wired live countdown on sale detail. Phase 11: PushSubscription schema + migration, pushController/routes/webpush utility, usePushSubscription hook, sw-push.js service worker, PushSubscriber in _app.tsx, push sends in emailReminderService. Fixed Vercel build (pnpm-lock.yaml pushed after extended git conflict resolution). Fixed migration 20260304000001 with IF NOT EXISTS guards. Added self-healing skills 14–16 (MCP+untracked conflict, PowerShell bracket wildcards, git lock files).
**Decisions:** sessionStorage over cookies for affiliate attribution (no cookie-parser). Polling over Socket.io for auction UI (not installed; sufficient for MVP). Lazy require('web-push') so server starts without package.
**Next up:** Run `prisma migrate deploy` in Docker (both migrations 000001 + 000002 pending). Generate VAPID keys, add to .env files. Docker rebuild backend. Then smoke-test push subscriptions.
**Blockers:** Migrations not yet applied — need `docker exec findasale-backend-1 sh -c "cd /app/packages/database && npx prisma migrate deploy"`. VAPID keys not yet generated — `npx web-push generate-vapid-keys`.

## Health Status
Last scan: 2026-03-03
FindA.Sale is in **GREEN** status — no critical blockers found. The codebase has strong fundamentals: all routes use proper auth middleware, CORS is restricted, no hardcoded secrets, all Prisma `findMany` calls are paginated, and SSR-sensitive browser globals are properly guarded in `useEffect`/`onClick` handlers. One high-severity finding (password reset token logged to console) needs fixing before real user traffic arrives. Two medium items are cleanup-grade. This is the healthiest scan to date.

## Docker
```
Docker status unavailable — run update-context.js locally (Windows) to capture container state
```

## Environment
- GitHub: ✗ not authenticated (gh auth login to fix)
- ngrok tunnel: unknown (check Docker Desktop logs for findasale-ngrok-1)
- CLI tools: node

## Signals
⚠ Env drift — in .env.example but missing from .env: HF_TOKEN, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT_EMAIL
✓ TODOs: none found

## Project File Tree
```
├── .env
├── .env.example
├── .gitignore
├── CLAUDE.md
├── README.md
├── Session Wrap — 2026-03-03.txt
├── ai-config/
│   └── global-instructions.md
├── claude_docs/
│   ├── .last-wrap
│   ├── CORE.md
│   ├── DEVELOPMENT.md
│   ├── OPS.md
│   ├── RECOVERY.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   ├── SEED_SUMMARY.md
│   ├── STACK.md
│   ├── STATE.md
│   ├── audit-remaining-areas-2026-03-03.md
│   ├── changelog-tracker/
│   │   └── .gitkeep
│   ├── competitor-intel/
│   │   └── .gitkeep
│   ├── feature-research-2026-03-04.md
│   ├── health-reports/
│   │   ├── .gitkeep
│   │   ├── 2026-03-01.md
│   │   ├── 2026-03-02.md
│   │   └── 2026-03-03.md
│   ├── monthly-digests/
│   │   └── .gitkeep
│   ├── next-session-prompt.md
│   ├── pre-beta-audit-2026-03-03.md
│   ├── rebrand-audit.md
│   ├── self_healing_skills.md
│   ├── session-log.md
│   ├── test_write
│   ├── ux-spotchecks/
│   │   └── .gitkeep
│   ├── workflow-audit-2026-03-03.md
│   └── workflow-retrospectives/
│       └── .gitkeep
├── docker-compose.yml
├── next
├── package.json
├── packages/
│   ├── backend/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── CLAUDE.md
│   │   ├── Dockerfile
│   │   ├── docs/
│   │   │   └── EMAIL_SMS_REMINDERS.md
│   │   ├── nodemon.json
│   │   ├── package.json
│   │   ├── services/
│   │   │   └── image-tagger/
│   │   │       ├── Dockerfile
│   │   │       ├── TESTING_PROGRESS.md
│   │   │       ├── app.py
│   │   │       ├── docs/
│   │   │       │   ├── TAGGER_ACCURACY.md
│   │   │       │   ├── TAGGER_BENCHMARKS.md
│   │   │       │   ├── TAGGER_DESIGN.md
│   │   │       │   └── TAGGER_TROUBLESHOOTING.md
│   │   │       ├── requirements-dev.txt
│   │   │       ├── requirements.txt
│   │   │       ├── setup.sh
│   │   │       ├── tagger.py
│   │   │       ├── templates/
│   │   │       │   └── index.html
│   │   │       └── tests/
│   │   │           ├── __init__.py
│   │   │           ├── conftest.py
│   │   │           ├── test_app.py
│   │   │           ├── test_app_simple.py
│   │   │           ├── test_tagger.py
│   │   │           └── test_tagger_simple.py
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   ├── emailReminders.e2e.ts
│   │   │   │   ├── stripe.e2e.ts
│   │   │   │   └── weeklyDigest.e2e.ts
│   │   │   ├── _triggerDigest.ts
│   │   │   ├── controllers/
│   │   │   │   ├── affiliateController.ts
│   │   │   │   ├── authController.ts
│   │   │   │   ├── favoriteController.ts
│   │   │   │   ├── geocodeController.ts
│   │   │   │   ├── itemController.ts
│   │   │   │   ├── lineController.ts
│   │   │   │   ├── marketingKitController.ts
│   │   │   │   ├── notificationController.ts
│   │   │   │   ├── pushController.ts
│   │   │   │   ├── saleController.ts
│   │   │   │   ├── stripeController.ts
│   │   │   │   ├── stripeStatusController.ts
│   │   │   │   ├── uploadController.ts
│   │   │   │   └── userController.ts
│   │   │   ├── index.ts
│   │   │   ├── jobs/
│   │   │   │   ├── auctionJob.ts
│   │   │   │   ├── emailReminderJob.ts
│   │   │   │   └── notificationJob.ts
│   │   │   ├── lib/
│   │   │   │   └── prisma.ts
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts
│   │   │   ├── models/
│   │   │   │   └── LineEntry.ts
│   │   │   ├── routes/
│   │   │   │   ├── affiliate.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── contact.ts
│   │   │   │   ├── favorites.ts
│   │   │   │   ├── geocode.ts
│   │   │   │   ├── items.ts
│   │   │   │   ├── lines.ts
│   │   │   │   ├── notifications.ts
│   │   │   │   ├── organizers.ts
│   │   │   │   ├── push.ts
│   │   │   │   ├── sales.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   ├── upload.ts
│   │   │   │   └── users.ts
│   │   │   ├── services/
│   │   │   │   └── emailReminderService.ts
│   │   │   └── utils/
│   │   │       ├── stripe.ts
│   │   │       └── webpush.ts
│   │   └── tsconfig.json
│   ├── database/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── migrations/ (16 migrations)
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── .env.local
│   │   ├── .env.local.example
│   │   ├── CLAUDE.md
│   │   ├── Dockerfile
│   │   ├── components/
│   │   │   ├── AuctionCountdown.tsx
│   │   │   ├── AuthContext.tsx
│   │   │   ├── BadgeDisplay.tsx
│   │   │   ├── BidModal.tsx
│   │   │   ├── CSVImportModal.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── InstallPrompt.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── SaleCard.tsx
│   │   │   ├── SaleMap.tsx
│   │   │   ├── SaleMapInner.tsx
│   │   │   ├── SaleShareButton.tsx
│   │   │   ├── SaleSubscription.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── contexts/
│   │   │   └── ToastContext.tsx
│   │   ├── hooks/
│   │   │   └── usePushSubscription.ts
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── next-env.d.ts
│   │   ├── next-sitemap.config.js
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── pages/
│   │   │   ├── 404.tsx
│   │   │   ├── 500.tsx
│   │   │   ├── _app.tsx
│   │   │   ├── _document.tsx
│   │   │   ├── about.tsx
│   │   │   ├── affiliate/
│   │   │   │   └── [id].tsx
│   │   │   ├── api/
│   │   │   │   └── og.tsx
│   │   │   ├── city/
│   │   │   │   └── [city].tsx
│   │   │   ├── contact.tsx
│   │   │   ├── creator/
│   │   │   │   └── dashboard.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── index.tsx
│   │   │   ├── items/
│   │   │   │   └── [id].tsx
│   │   │   ├── login.tsx
│   │   │   ├── offline.tsx
│   │   │   ├── organizer/
│   │   │   │   ├── add-items/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   ├── add-items.tsx
│   │   │   │   ├── create-sale.tsx
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── edit-item/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── edit-sale/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── line-queue/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── send-update/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   └── settings.tsx
│   │   │   ├── organizers/
│   │   │   │   └── [id].tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── referral-dashboard.tsx
│   │   │   ├── register.tsx
│   │   │   ├── reset-password.tsx
│   │   │   ├── sales/
│   │   │   │   ├── [id].tsx
│   │   │   │   └── zip/
│   │   │   │       └── [zip].tsx
│   │   │   ├── server-sitemap.xml.tsx
│   │   │   ├── shopper/
│   │   │   │   ├── dashboard.tsx
│   │   │   │   └── purchases.tsx
│   │   │   ├── terms.tsx
│   │   │   └── unsubscribe.tsx
│   │   ├── postcss.config.js
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   │   ├── apple-touch-icon.png
│   │   │   │   ├── favicon-16x16.png
│   │   │   │   ├── favicon-32x32.png
│   │   │   │   ├── icon-128x128.png
│   │   │   │   ├── icon-144x144.png
│   │   │   │   ├── icon-152x152.png
│   │   │   │   ├── icon-192x192-maskable.png
│   │   │   │   ├── icon-192x192.png
│   │   │   │   ├── icon-384x384.png
│   │   │   │   ├── icon-512x512-maskable.png
│   │   │   │   ├── icon-512x512.png
│   │   │   │   ├── icon-72x72.png
│   │   │   │   └── icon-96x96.png
│   │   │   ├── images/
│   │   │   │   └── placeholder.svg
│   │   │   ├── manifest.json
│   │   │   ├── sw-push.js
│   │   │   ├── sw.js
│   │   │   └── workbox-5d03dacf.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── output.css
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   └── shared/
│       ├── CLAUDE.md
│       ├── package.json
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
├── pnpm
├── pnpm-workspace.yaml
└── scripts/
    └── update-context.js

```

## On-Demand References
Read these files only when the task requires them — they are not loaded by default.
- Schema: `packages/database/prisma/schema.prisma`
- Dependencies: `packages/*/package.json` (and root `package.json`)
- Env vars: `packages/*/.env.example`
- Stack decisions: `claude_docs/STACK.md`
- Project state: `claude_docs/STATE.md`
- Security rules: `claude_docs/SECURITY.md`
- Ops procedures: `claude_docs/OPS.md`
- Session history: `claude_docs/session-log.md`

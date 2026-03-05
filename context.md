# Dynamic Project Context
*Generated at 2026-03-05T17:45:18.913Z*

## Git Status
- **Branch:** main
- **Commit:** 3974bbb
- **Remote:** https://github.com/deseee/findasale.git

## Last Session
### 2026-03-05
**Worked on:** V2 (instant payouts): `payoutController.ts` (balance, payout schedule, on-demand payout), `routes/stripe.ts` (4 new routes), `pages/organizer/payouts.tsx`. V3 (UGC bounties): `MissingListingBounty` schema + migration, `bountyController.ts`, `routes/bounties.ts`, `pages/organizer/bounties.tsx`, `components/BountyModal.tsx`. W1 (shipping): `shippingAvailable`/`shippingPrice` on Item + migration, item CRUD updated, payment intent accepts `shippingRequested`. W2 (label PDF): `labelController.ts` with pdfkit, single-item and all-items endpoints. X1 (Zapier webhooks): `Webhook` model + migration, `webhookService.ts` (HMAC-SHA256 signed), `webhookController.ts`, `routes/webhooks.ts`, `pages/organizer/webhooks.tsx`. Hooks fired on `bid.placed` and `purchase.completed`. All pushed to GitHub.
**Decisions:** Webhook secrets shown once on creation. Instant payout eligibility errors handled gracefully. Shipping cost added to Stripe charge total, stored in payment intent metadata. Label PDF uses pdfkit 4×3" pages (already installed).
**Next up:** Run `prisma migrate deploy` for 3 pending migrations (20260305000006–8) on Neon. Then define Sprint Y or begin real-user beta onboarding.
**Blockers:** 3 Neon migrations pending before deploy. Phase 31 OAuth env vars still needed in Vercel.

## Health Status
Last scan: 2026-03-03
FindA.Sale is in **GREEN** status — no critical blockers found. The codebase has strong fundamentals: all routes use proper auth middleware, CORS is restricted, no hardcoded secrets, all Prisma `findMany` calls are paginated, and SSR-sensitive browser globals are properly guarded in `useEffect`/`onClick` handlers. One high-severity finding (password reset token logged to console) needs fixing before real user traffic arrives. Two medium items are cleanup-grade. This is the healthiest scan to date.

## Docker
```
Docker status unavailable — run update-context.js locally (Windows) to capture container state
```

## Environment
- GitHub CLI: ✗ not authenticated (not required when GitHub MCP is active — check MCP tools at session start)
- ngrok tunnel: unknown (check Docker Desktop logs for findasale-ngrok-1)
- CLI tools: node

## Signals
⚠ Env drift — in .env.example but missing from .env: HF_TOKEN
⚠ 1+ TODO/FIXME markers in source (showing up to 5):
  /sessions/festive-ecstatic-galileo/mnt/FindaSale/packages/backend/src/controllers/userController.ts:210:          // TODO: Implement notification system when ready

## Project File Tree
```
├── .env
├── .env.example
├── .gitattributes
├── .githooks/
│   ├── pre-commit
│   └── pre-push
├── .gitignore
├── CLAUDE.md
├── README.md
├── ai-config/
│   └── global-instructions.md
├── claude_docs/
│   ├── .last-wrap
│   ├── COMPLETED_PHASES.md
│   ├── CORE.md
│   ├── DEVELOPMENT.md
│   ├── OPS.md
│   ├── RECOVERY.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   ├── SEED_SUMMARY.md
│   ├── STACK.md
│   ├── STATE.md
│   ├── archive/
│   │   ├── pre-beta-audit-2026-03-03.md
│   │   ├── rebrand-audit.md
│   │   └── workflow-audit-2026-03-03.md
│   ├── changelog-tracker/
│   │   └── .gitkeep
│   ├── competitor-intel/
│   │   └── .gitkeep
│   ├── health-reports/
│   │   ├── .gitkeep
│   │   ├── 2026-03-01.md
│   │   ├── 2026-03-02.md
│   │   ├── 2026-03-03.md
│   │   └── 2026-03-05-health-check.json
│   ├── model-routing.md
│   ├── monthly-digests/
│   │   └── .gitkeep
│   ├── new 2.txt
│   ├── next-session-prompt.md
│   ├── patrick-language-map.md
│   ├── pre-commit-check.md
│   ├── research/
│   │   ├── competitor-intel-2026-03-04.md
│   │   └── growth-channels-2026-03-04.md
│   ├── self_healing_skills.md
│   ├── session-log.md
│   ├── session-safeguards.md
│   ├── test_write
│   ├── ux-spotchecks/
│   │   └── .gitkeep
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
│   │   ├── Dockerfile.production
│   │   ├── docs/
│   │   │   └── EMAIL_SMS_REMINDERS.md
│   │   ├── nodemon.json
│   │   ├── package.json
│   │   ├── services/
│   │   │   └── image-tagger/
│   │   │       ├── .coverage
│   │   │       ├── .coverage.claude.pid10229.XQC9qibx.H0CrSzLFxgoh
│   │   │       ├── .pytest_cache/
│   │   │       │   ├── .gitignore
│   │   │       │   ├── CACHEDIR.TAG
│   │   │       │   ├── README.md
│   │   │       │   └── v/
│   │   │       │       └── cache/
│   │   │       │           ├── lastfailed
│   │   │       │           └── nodeids
│   │   │       ├── Dockerfile
│   │   │       ├── TESTING_PROGRESS.md
│   │   │       ├── app.py
│   │   │       ├── docs/
│   │   │       │   ├── TAGGER_ACCURACY.md
│   │   │       │   ├── TAGGER_BENCHMARKS.md
│   │   │       │   ├── TAGGER_DESIGN.md
│   │   │       │   └── TAGGER_TROUBLESHOOTING.md
│   │   │       ├── pytest-cache-files-pv4rszl7/
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
│   │   │   │   ├── bountyController.ts
│   │   │   │   ├── favoriteController.ts
│   │   │   │   ├── geocodeController.ts
│   │   │   │   ├── itemController.ts
│   │   │   │   ├── labelController.ts
│   │   │   │   ├── lineController.ts
│   │   │   │   ├── marketingKitController.ts
│   │   │   │   ├── messageController.ts
│   │   │   │   ├── notificationController.ts
│   │   │   │   ├── payoutController.ts
│   │   │   │   ├── pushController.ts
│   │   │   │   ├── referralController.ts
│   │   │   │   ├── reservationController.ts
│   │   │   │   ├── reviewController.ts
│   │   │   │   ├── saleController.ts
│   │   │   │   ├── stripeController.ts
│   │   │   │   ├── stripeStatusController.ts
│   │   │   │   ├── uploadController.ts
│   │   │   │   ├── userController.ts
│   │   │   │   └── webhookController.ts
│   │   │   ├── index.ts
│   │   │   ├── instrument.ts
│   │   │   ├── jobs/
│   │   │   │   ├── auctionJob.ts
│   │   │   │   ├── curatorEmailJob.ts
│   │   │   │   ├── emailReminderJob.ts
│   │   │   │   ├── notificationJob.ts
│   │   │   │   ├── reputationJob.ts
│   │   │   │   └── reservationExpiryJob.ts
│   │   │   ├── lib/
│   │   │   │   ├── prisma.ts
│   │   │   │   └── socket.ts
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts
│   │   │   ├── models/
│   │   │   │   └── LineEntry.ts
│   │   │   ├── routes/
│   │   │   │   ├── affiliate.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── bounties.ts
│   │   │   │   ├── contact.ts
│   │   │   │   ├── favorites.ts
│   │   │   │   ├── feed.ts
│   │   │   │   ├── geocode.ts
│   │   │   │   ├── items.ts
│   │   │   │   ├── lines.ts
│   │   │   │   ├── messages.ts
│   │   │   │   ├── notifications.ts
│   │   │   │   ├── organizers.ts
│   │   │   │   ├── points.ts
│   │   │   │   ├── push.ts
│   │   │   │   ├── referrals.ts
│   │   │   │   ├── reservations.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   ├── sales.ts
│   │   │   │   ├── search.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   ├── upload.ts
│   │   │   │   ├── users.ts
│   │   │   │   └── webhooks.ts
│   │   │   ├── services/
│   │   │   │   ├── emailReminderService.ts
│   │   │   │   ├── followerNotificationService.ts
│   │   │   │   ├── pointsService.ts
│   │   │   │   └── webhookService.ts
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
│   │   │   ├── migrations/ (27 migrations)
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
│   │   │   ├── BottomTabNav.tsx
│   │   │   ├── BountyModal.tsx
│   │   │   ├── CSVImportModal.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   ├── InstallPrompt.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemPhotoManager.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── OnboardingModal.tsx
│   │   │   ├── PhotoLightbox.tsx
│   │   │   ├── PointsBadge.tsx
│   │   │   ├── RapidCapture.tsx
│   │   │   ├── ReputationTier.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── SaleCard.tsx
│   │   │   ├── SaleMap.tsx
│   │   │   ├── SaleMapInner.tsx
│   │   │   ├── SaleShareButton.tsx
│   │   │   ├── SaleSubscription.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── SkeletonCards.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── TierBadge.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── contexts/
│   │   │   └── ToastContext.tsx
│   │   ├── hooks/
│   │   │   ├── usePoints.ts
│   │   │   ├── usePushSubscription.ts
│   │   │   └── useUnreadMessages.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── imageUtils.ts
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
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth].ts
│   │   │   │   └── og.tsx
│   │   │   ├── categories/
│   │   │   │   └── [category].tsx
│   │   │   ├── city/
│   │   │   │   └── [city].tsx
│   │   │   ├── contact.tsx
│   │   │   ├── creator/
│   │   │   │   └── dashboard.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── feed.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── index.tsx
│   │   │   ├── items/
│   │   │   │   └── [id].tsx
│   │   │   ├── login.tsx
│   │   │   ├── messages/
│   │   │   │   ├── [id].tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── new.tsx
│   │   │   ├── neighborhoods/
│   │   │   │   ├── [slug].tsx
│   │   │   │   └── index.tsx
│   │   │   ├── offline.tsx
│   │   │   ├── organizer/
│   │   │   │   ├── add-items/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   ├── add-items.tsx
│   │   │   │   ├── bounties.tsx
│   │   │   │   ├── create-sale.tsx
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── edit-item/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── edit-sale/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── holds.tsx
│   │   │   │   ├── line-queue/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── payouts.tsx
│   │   │   │   ├── send-update/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   ├── settings.tsx
│   │   │   │   └── webhooks.tsx
│   │   │   ├── organizers/
│   │   │   │   └── [id].tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── refer/
│   │   │   │   └── [code].tsx
│   │   │   ├── referral-dashboard.tsx
│   │   │   ├── register.tsx
│   │   │   ├── reset-password.tsx
│   │   │   ├── sales/
│   │   │   │   ├── [id].tsx
│   │   │   │   └── zip/
│   │   │   │       └── [zip].tsx
│   │   │   ├── search.tsx
│   │   │   ├── server-sitemap.xml.tsx
│   │   │   ├── shopper/
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── favorites.tsx
│   │   │   │   └── purchases.tsx
│   │   │   ├── terms.tsx
│   │   │   └── unsubscribe.tsx
│   │   ├── postcss.config.js
│   │   ├── public/
│   │   │   ├── fallback-OI8nXpndPrduP2yucmXrX.js
│   │   │   ├── fallback-UaNjxref6efOge_HGFwCr.js
│   │   │   ├── fallback-WBXriFD53-Yn3WC9tqMWi.js
│   │   │   ├── fallback-er3uCbRza2kFz6gsQte4u.js
│   │   │   ├── fallback-gNeuXxCbTqbTpJfL6SNTp.js
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
│   │   ├── sentry.client.config.ts
│   │   ├── sentry.edge.config.ts
│   │   ├── sentry.server.config.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── output.css
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── tsconfig.tsbuildinfo
│   │   └── types/
│   │       └── next-auth.d.ts
│   └── shared/
│       ├── CLAUDE.md
│       ├── package.json
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
├── pnpm
├── pnpm-workspace.yaml
├── railway.toml
└── scripts/
    ├── health-check.ts
    ├── stress-test.js
    └── update-context.js

```

## Tool & Skill Tree
MCP tools are injected at session start — check active tools before assuming availability.
```
MCP Connectors (check at session start):
├── mcp__github__*          — GitHub file push, PR, issues (repo: deseee/findasale)
├── mcp__Claude_in_Chrome__ — Browser automation, screenshots, form filling
├── mcp__MCP_DOCKER__       — Playwright browser, code execution
├── mcp__scheduled-tasks__  — Cron scheduling for recurring tasks
├── mcp__cowork__           — File access, directory requests, file presentation
└── mcp__mcp-registry__     — Search/suggest additional connectors

Skills (loaded on demand):
├── conversation-defaults   — AskUserQuestion workaround + diff-only gate (ALWAYS ACTIVE)
├── dev-environment         — Docker/DB/Prisma reference (load before shell commands)
├── context-maintenance     — Session wrap protocol (load at session end)
├── health-scout            — Proactive code scanning (load before deploys)
├── findasale-deploy        — Deploy checklist (load before production push)
├── skill-creator           — Create/edit/eval skills
├── docx / xlsx / pptx / pdf — Document creation skills
└── schedule                — Create scheduled tasks

Self-Healing Skills: 19 entries in claude_docs/self_healing_skills.md
Docker Containers: findasale-backend-1, findasale-frontend-1, findasale-postgres-1, findasale-image-tagger-1
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

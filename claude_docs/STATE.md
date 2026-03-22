# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 231 COMPLETE (2026-03-22) — BUG QUEUE COMPLETION + AVATAR DROPDOWN (P0 UX FIX):**
- ✅ BUG #22 verified live: Chrome test confirmed Nina (ADMIN) gets 200 from `GET /api/organizers/me` — fix working
- ✅ BUG #22 sweep: 54 inline `role !== 'ORGANIZER'` checks across 24 backend files (21 controllers + 3 routes) fixed
- ✅ BUG #30 fixed: `sales/[id].tsx` line 379 — `organizerId={sale.organizer.userId}` → `organizerId={sale.organizer.id}`
- ✅ BUG #31 fixed: `FavoriteButton.tsx` — SVG fill via explicit props instead of Tailwind classes
- ✅ BUG #32 fixed: `favoriteController.ts` — toggle checks DB for existing record before add/remove; verified live (bidirectional)
- ✅ BUG #33 fixed: `OnboardingModal.tsx` — handleSkip writes localStorage synchronously before onComplete()
- ✅ AvatarDropdown.tsx built (new): replaces 20+ inline desktop header auth links — Dashboard, Plan a Sale, Insights (PRO), Workspace (TEAMS), Subscription, Settings, Sign Out. P0 UX fix per nav-dashboard-consolidation-2026-03-20 spec.
- ✅ Layout.tsx: Desktop auth nav Feed link (was Explore → `/`); mobile Pro Tools using TierGatedNavLink
- ✅ Sale page UX: "Back to home" label, ~15 dark mode class additions
- ⚠️ PENDING PATRICK PUSH: `sales/[id].tsx` + 24 BUG #22 sweep backend files (see instructions in chat)
- ⚠️ PENDING: `prisma migrate deploy + prisma generate` against Neon (still blocking #73/#74/#75 runtime — NOT YET DONE)
- ⚠️ PENDING Railway env vars: `AI_COST_CEILING_USD=5.00`, `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831`
- Last Updated: 2026-03-22

**Session 230 COMPLETE (2026-03-21) — S227 QA AUDIT COMPLETION + BUG #22 BACKEND FIX:**
- ✅ Full 4-role deep functional QA audit completed (Chrome MCP browser automation, XHR/fetch interception, direct JWT API calls)
- ✅ BUG #22 backend confirmed: `GET /api/organizers/me` → 403 for Nina (ADMIN). Root cause: `requireOrganizer` checked `role === 'ORGANIZER'` (singular); Nina's JWT has `role: "ADMIN"`. Fixed in `auth.ts` (added `requireOrganizer` export) + `organizers.ts` (5 inline checks updated to also check `roles?.includes('ORGANIZER')`).
- ✅ BUG #30 confirmed dead: Follow button fires ZERO network requests (0 XHR, 0 fetch). Endpoint `POST /:id/follow` exists and is correct — bug is in frontend click handler. Flagged for separate frontend dispatch.
- ✅ Audit report written: `claude_docs/audits/s227-qa-audit.md`
- ✅ BUGs resolved since S222: #25 (items load), #29 (Message Organizer), #22 frontend, #20 shopper sort
- ⚠️ Still broken: BUG #22 backend (fix shipped S230, not yet live-verified), BUG #30 (frontend), BUG #31 (heart SVG fill), BUG #32 (favorites toggle always removes), BUG #33 (onboarding tour loops)
- ⚠️ 15 other backend files have same `role !== 'ORGANIZER'` pattern — needs follow-up sweep dispatch to findasale-dev
- ⚠️ PENDING: `prisma migrate deploy + prisma generate` against Neon (still blocking #73/#74/#75 runtime — NOT YET DONE)
- Last Updated: 2026-03-21

**Session 229 COMPLETE (2026-03-21) — RAILWAY/VERCEL BUILD REPAIR + FRONTEND QA AUDIT + #75 LAPSE BANNER FIX:**
- ✅ Railway build unblocked: stripeController.ts — 3x `findUnique`→`findFirst` for non-unique `stripeCustomerId`, null guard on `invoice.customer`, typed `(err: unknown)` catch handlers
- ✅ Vercel build unblocked: `useNotifications.ts` named import → default import for `api`
- ✅ Frontend QA audit: 2 BLOCKERs + 4 WARNs found and fixed same session
- ✅ BLOCKER 1 fixed: #75 lapse banner was permanently invisible — `tierLapsedAt` is on `UserRoleSubscription` not `Organizer`. Switched to `subscriptionStatus === 'canceled'` (IS on Organizer). Added `subscriptionStatus` to all 3 JWT payloads + `AuthContext.tsx` User type + both parsing blocks
- ✅ BLOCKER 2 fixed: Lapse banner CTA pointed to `/organizer/billing` (404) → changed to `/organizer/subscription`
- ✅ WARN fixed: `useNotifications.ts` hook was dead code (no callers) + polled without auth guard → deleted
- ✅ WARN fixed: `notifications.tsx` used `window.location.href` for all links → `router.push` for internal, `window.open` for external
- ⚠️ PENDING: `prisma migrate deploy + prisma generate` against Neon (still blocking #73/#74/#75 runtime — NOT YET DONE)
- Last Updated: 2026-03-21

**Session 228 COMPLETE (2026-03-21) — FEATURES #73/#74/#75 + PRICING PATCH + RAILWAY VERIFICATION:**
- ✅ Railway + Stripe verification: backend UP (health latency 200, /api/sales 200), Stripe checkout tested
- ✅ P1 pricing.tsx bug FIXED: double `/api/` path removed. Committed af096e0, pushed.
- ✅ Feature #73 — Two-Channel Notification System: notificationService.ts (DB + Resend email, fail-open), triggers in message/sale/stripe controllers
- ✅ Feature #74 — Role-Aware Registration Consent Flow: register.tsx inline consent checkboxes (unchecked default, role-conditional), authController RoleConsent records
- ✅ Feature #75 — Tier Lapse State Logic: tierLimits.ts + tierEnforcement.ts, stripeController webhook handlers, itemController 403 guard, dashboard lapse banner
- ✅ S228 11-file push CONFIRMED DONE (Patrick pushed; Vercel was building from it at S229 start)
- Last Updated: 2026-03-21

**Session 227 COMPLETE (2026-03-21) — WORKFLOW CLEANUP SPRINT (Phase 2+3):**
- ✅ Phase 2a: `daily-friction-audit` scheduled task updated with auto-dispatch action loop — HIGH/MEDIUM/LOW findings auto-dispatch findasale-records or findasale-dev; 3+ consecutive appearances → `## Patrick Direct` block
- ✅ Phase 2b: `context-freshness-check` changed from daily to weekly Monday 8am
- ✅ Phase 2c: QA audit on /pricing — 2 WARN findings FIXED in S228: unauthenticated button text, `?upgrade=success/cancelled` handling
- ✅ Phase 3a: `.checkpoint-manifest.json` and `MESSAGE_BOARD.json` deleted from active use
- ✅ Phase 3b: `context-maintenance` and `findasale-push-coordinator` skills archived — source SKILL.md files updated; .skill packages built
- ✅ Phase 3c: CORE.md fully retired — CLAUDE.md v5.0 is now the single authority
- ✅ CLAUDE.md 3-region merge conflict resolved — v5.0 §§7-12 intact
- ✅ Railway Dockerfile cache-bust pushed (commit 57fabb05) — forces fresh Docker build to unblock Stripe checkout 404
- ✅ Stripe checkout verified working in S228
- Last Updated: 2026-03-21

**Session 225 COMPLETE (2026-03-21) — COMPREHENSIVE AUDIT S212–S224 + CHROME VERIFICATION + 3 BUG FIXES:**
- ✅ Prisma migration (#72 Phase 2) confirmed applied by Patrick at session start. #73/#74/#75 now unblocked.
- ✅ All S224 features Chrome-verified: /pricing, /shopper/favorites, /shopper/messages, /organizer/messages, FavoriteButton, leaderboard sort, inspiration page
- ✅ Message Organizer button confirmed working in code (dev agent audit). Earlier test failure was stale auth state.
- ✅ Bug #1 FIXED: PWA banner reappears after "Not now" — added sessionStorage dual-layer to InstallPrompt.tsx
- ✅ Bug #2 FIXED: Shopper onboarding popup fires on wrong pages — added shopperFirstPages allowlist to _app.tsx
- ✅ Bug #3 FIXED: Inspiration page all images broken — added photoUrls fallback + placeholder to InspirationGrid.tsx
- ✅ DEPLOYED: InstallPrompt.tsx, _app.tsx, InspirationGrid.tsx — confirmed live at Vercel + Railway (commit 3c3d765)
- ⚠️ S205–S211 session history irrecoverable (not in session-log.md or archive). No known open bugs from those sessions.
- Health report: `claude_docs/health-reports/2026-03-21-s225-audit.md`
- Last Updated: 2026-03-21

**Session 224 COMPLETE (2026-03-21) — CHROME VERIFICATION + BUG SPRINT + FEATURE BUILD:**
- ✅ Chrome-verified /inspiration page LIVE — masonry grid rendering, items from multiple sales, no app errors
- ✅ Shopper leaderboard sort FIXED — was sorted by streakPoints (arbitrary), now computes display score first then sorts DESC. Frank (750pts) now #1, not #9.
- ✅ #28 PWA install banner FIXED — added session-state `dismissed` flag so banner does not reappear after "Not now" within same session
- ✅ #28 Duplicate Live Activity widget REMOVED — ActivityFeed import + render removed from sales/[id].tsx; LiveFeedTicker retained as sole widget
- ✅ #19 (sale detail 429 → "not found") — ALREADY FIXED in codebase, confirmed
- ✅ #24 (geolocation login stall) — ALREADY FIXED in codebase, confirmed
- ✅ #23 Pricing page BUILT — /pricing with SIMPLE/PRO/TEAMS comparison + Stripe checkout. Stripe prices created: Pro price_1TDUQsLTUdEUnHOTzG6cVDwu ($29/mo), Teams price_1TDUQtLTUdEUnHOTCEoNL6oz ($79/mo)
- ✅ #26 Favorite button BUILT — FavoriteButton.tsx + useFavorite.ts hook, integrated into ItemCard/InspirationGrid/sale detail, /shopper/favorites page enhanced
- ✅ #29 Message Organizer BUILT — MessageComposeModal.tsx + useConversations/useThread/useSendMessage/useReplyInThread hooks + /shopper/messages + /organizer/messages + /messages/[conversationId] thread view
- ⚠️ Architect spec saved: claude_docs/architecture/feature-specs-26-29-favorites-messages.md
- ⚠️ PENDING: prisma migrate deploy + prisma generate against Neon (#72 Phase 2 schema — blocks messaging runtime + #73/#74)
- ⚠️ Minor: Inspiration nav link missing from Layout nav (was added S218, may have been dropped). Low priority.
- Files pushed: 19 files via Patrick .\push.ps1. Leaderboard sort pushed earlier via MCP by subagent (violation noted).
- Last Updated: 2026-03-21

**Session 223 COMPLETE (2026-03-21) — S222 BUG FIX SPRINT + CHROME VERIFICATION + UX FIXES:**
- ✅ **7 of 18 S222 bugs FIXED (S223 early):** #22 (P0 role guards, 46 files), #25 (P1 items empty), #20 (P1 leaderboard sort), #30 (P1 CSRF follow), #15 (P2 reputation crash), #3 (P2 dashboard count), #7 (P2 How It Works)
- ✅ **BUG #25 deep fix:** `PUBLIC_ITEM_FILTER` disabled (set to `{}`) because legacy/seeded items have NULL `draftStatus` and Prisma rejects null on required String fields. Re-enable when Rapidfire Mode launches and NULLs are backfilled.
- ✅ **Chrome-verified deployed:** Sale detail items ✅, trending page ✅, homepage ✅, organizer leaderboard tab ✅, role guards ✅, dashboard count ✅, How It Works ✅, 429 toast ✅
- ✅ **Welcome popup scoped:** OrganizerOnboardingShower now only fires on /organizer, /dashboard, /manage-sales, /create-sale (was showing on all pages including /inspiration)
- ✅ **Install banner hardened:** InstallPrompt.tsx — mount-time state reset, double-check before showing, render-time guard
- ⚠️ **itemController.ts inspiration fix LOCAL ONLY:** `draftStatus: 'PUBLISHED'` → `...PUBLIC_ITEM_FILTER` at line ~1094. File too large for MCP push (40KB). Patrick must push manually.
- **Remaining unfixed bugs from S222:**
  - P1: Shopper leaderboard sort still broken (separate from organizer tab fix)
  - P2: #13 (Inspiration page empty — blocked by itemController push), #23 (subscription page — needs Stripe products), #26 (no favorite button — feature gap), #28 (Hunt Pass + PWA overlap), #29 (no Message Organizer — feature gap)
  - P3: #19 (sale detail "not found" on 429), #24 (login stalls on geolocation)
- Last Updated: 2026-03-21

**Session 221 COMPLETE (2026-03-21) — LIVE PRO FEATURE AUDIT AS OSCAR (USER2) + BUG FIXES:**
- ✅ **#76 Skeleton loaders:** CONFIRMED shipped from S215 (SkeletonCards.tsx exists, referenced in 5 files). Verified.
- ✅ **Chrome audit: 7 secondary routes** — ALL PASS. No P0/P1. Report: `claude_docs/audits/chrome-secondary-routes-s216.md`
- ✅ **#72 Dual-Role Account Phase 1 COMPLETE:** `User.roles` array field + `UserRoleSubscription` table + `RoleConsent` table. Migration SQL: `packages/database/prisma/migrations/20260320204815_add_dual_role_schema/migration.sql`. Backend utility: `packages/backend/src/lib/roleUtils.ts` (backward-compatible role checking). **PENDING PATRICK ACTION:** Run `prisma migrate deploy` + `prisma generate` against Neon before Phase 2 work.
- ✅ **Platform safety #94/#97/#98/#99 COMPLETE:** Coupon rate limiting (Redis, 10/min), admin pagination hard cap (100), request correlation IDs (UUID middleware), coupon collision retry (3 attempts).
- ✅ **P1 fix: Date input on create-sale** — FIXED. Added `min` attribute to both date inputs enabling HTML5 picker. Confirmed by Chrome audit.
- ✅ **Chrome audit: Organizer happy path** — P1 found + fixed same session. P2 notes: sale card click handler, LiveFeedTicker live data verification. Report: `claude_docs/audits/organizer-happy-path-s216.md`
- Last Updated: 2026-03-20

**Session 215 COMPLETE (2026-03-20) — MASSIVE PARALLEL SPRINT + TS ERROR RECOVERY:**
- ✅ **Subscription tier bug fixed:** AuthContext was reading `organizerTier` instead of `subscriptionTier` from JWT
- ✅ **P2 backlog shipped:** Error shape standardization (27 controllers → `{ message }`), holds pagination, hub N+1 fix
- ✅ **Design polish shipped:** #77 PublishCelebration confetti overlay, #81 empty state copy pass (8+ pages)
- ✅ **Platform safety P0 shipped:** #93 account age gate (7-day), #95 Redis bid rate limiter, #96 buyer premium disclosure
- ✅ **Architect ADR filed:** #72 Dual-Role Account Schema → `claude_docs/architecture/adr-072-dual-role-account-schema.md`
- ✅ **Schema pre-wires:** Consignment fields + affiliate payout table migrated to Neon (2 migrations applied)
- ✅ **#92 SEO city pages:** ISR `/city/[city]` with Schema.org JSON-LD, Grand Rapids pre-built
- ✅ **Railway recovery:** Dockerfile truncation recovered, 17 TS errors fixed across 4 files (3 MCP pushes)
- Last Updated: 2026-03-20

**Pricing Model (LOCKED):**
- **SIMPLE (Free):** 10% platform fee, 200 items/sale included, 5 photos/item, 100 AI tags/month
- **PRO ($29/month or $290/year):** 8% platform fee, 500 items/sale, 10 photos/item, 2,000 AI tags/month, unlimited concurrent sales, batch operations, analytics, brand kit, exports
- **TEAMS ($79/month or $790/year):** 8% platform fee, 2,000 items/sale, 15 photos/item, unlimited AI tags, multi-user access, API/webhooks, white-label, priority support
- **Overages:** SIMPLE $0.10/item beyond 200; PRO $0.05/item beyond 500; TEAMS $0.05/item (soft cap)
- **Shopper Monetization:** 5% buyer premium on auction items ONLY; Hunt Pass $4.99/mo (PAUSED); Premium Shopper (DEFERRED to 2027 Q2)
- **Post-Beta:** Featured Placement $29.99/7d, AI Tagging Premium $4.99/mo (SIMPLE), Affiliate 2-3%, B2B Data Products (DEFERRED)
- **Sources:** pricing-and-tiers-overview-2026-03-19.md (complete spec), BUSINESS_PLAN.md (updated), b2b-b2e-b2c-innovation-broad-2026-03-19.md (B2B/B2C strategy)

**DB test accounts (Neon production - current):**
- `user1@example.com` / `password123` → ADMIN role, SIMPLE tier organizer
- `user2@example.com` / `password123` → ORGANIZER, PRO tier ✅
- `user3@example.com` / `password123` → ORGANIZER, TEAMS tier ✅
- `user11@example.com` / `password123` → Shopper

---

**Session 221 COMPLETE (2026-03-21) — LIVE PRO FEATURE AUDIT AS OSCAR (USER2) + BUG FIXES:**
- ✅ **Railway unblocked:** leaderboardController.ts TS errors (TS2322/TS2339/TS7006) fixed — removed `userBadges` from select (not in inferred Docker Prisma type), replaced `nulls: 'last'` orderBy with JS null sort post-query, changed `take: 50` with `.slice(0, 20)` after sort.
- ✅ **Reputation page fully fixed:** Two bugs: (1) route was mounted at `app.use('/api', reputationRoutes)` → changed to `app.use('/api/organizers', reputationRoutes)` to match frontend calls to `/api/organizers/:id/reputation`; (2) page was passing `user.id` (User table cuid) instead of `organizer.id` (Organizer table cuid) — fixed by fetching `/organizers/me` and using returned `.id`.
- ✅ **fraud-signals.tsx:** `res.data.data` → `res.data.sales` (matches actual API response shape)
- ✅ **item-library.tsx:** Removed stray `<Layout>` wrapper
- ✅ **brand-kit.tsx:** Added `!data.id` guard before second API call; PRO fields (font/banner/accent) editable for PRO/TEAMS, disabled with upgrade prompt for SIMPLE
- ✅ **dashboard.tsx:** Welcome name uses `user?.name?.split(' ')[0] || 'there'`; How It Works section gated by `!orgProfile?.onboardingComplete`
- Last Updated: 2026-03-21

**Session 217 COMPLETE (2026-03-21) — PRE-BETA SAFETY AUDIT + #102 PRICE VALIDATION:**
- ✅ **#100–#103 Pre-Beta Safety Audit:** 4 items audited. #100 (password reset rate limit) ✅ already implemented. #101 (sale publish ownership check) ✅ already implemented. #102 (item price >= 0 validation) ⚠️ MISSING → FIXED. Added price validation to itemController.ts createItem() and updateItem() for price, auctionStartPrice, auctionReservePrice. #103 (Stripe webhook signature verification) ✅ already implemented.
- ✅ **File Changed:** packages/backend/src/controllers/itemController.ts (price validation added, ~60 lines)
- ✅ **TypeScript Check:** PASS (0 errors)
- Last Updated: 2026-03-21

**Session 218 COMPLETE (2026-03-20) — SECURITY HARDENING BATCH + #72 PHASE 2 + FEATURES (#78, #79, #104, #105) + CHROME P0 FIX:**
- ✅ **Security Hardening #104–#107:** CSRF double-submit cookie middleware (csrf.ts new), SQL injection fix (Prisma.sql in saleController getCities), account enumeration defense (generic login errors + timing attack dummy bcrypt in authController), requestPasswordReset generic response. Audit doc: security-audit-s218.md
- ✅ **#72 Phase 2 — Dual-Role JWT + Auth Middleware:** JWT payload now includes `roles: string[]` at all 3 generation points (login, register, oauthLogin). Auth middleware attaches `req.user.roles`. AuthContext updated on frontend. Backward-compatible (`role` retained alongside `roles`). Files: auth.ts (middleware), AuthContext.tsx.
- ✅ **#78 Inspiration Page:** Masonry item gallery (`/inspiration`), ISR 300s, items sorted by aiConfidence DESC, limit 48. New backend route `GET /api/items/inspiration`. Nav link added to Layout. Files: inspiration.tsx (new), InspirationGrid.tsx (new), itemController.ts, routes/items.ts, Layout.tsx
- ✅ **#79 Earnings Counter Animation:** Revolut-style count-up on organizer dashboard earnings total. useCountUp hook with requestAnimationFrame + easing. Files: useCountUp.ts (new), organizer/dashboard.tsx
- ✅ **Roadmap #104 AI Cost Ceiling:** Redis-based token tracking, monthly ceiling via `AI_COST_CEILING_USD` env var, auto-alert. Files: aiCostTracker.ts (new), cloudAIService.ts, adminController.ts, batchAnalyzeController.ts
- ✅ **Roadmap #105 Cloudinary Bandwidth Monitoring:** Serve-event tracker, 80% threshold alert. Files: cloudinaryBandwidthTracker.ts (new), uploadController.ts, routes/admin.ts
- ✅ **P0 Chrome fix:** Featured Sales carousel cards — title/location/dates now visible. File: SaleCard.tsx
- Last Updated: 2026-03-20

---

**Session 214 COMPLETE (2026-03-20) - CHROME VERIFICATION + #70 FULLY COMPLETE:**
- Chrome re-verify: 13/15 PASS. LiveFeedTicker placed on sale detail page. #19 Passkey deployed.
- Last Updated: 2026-03-20

---

**Sessions 191-203 COMPLETE (2026-03-17-18):**
- Wave 5 Sprint 1+2, Passkey P0 fix, full docs audit, 50+ routes Chrome-verified.
- Full history: session-log.md + git log.

---

## Active Infrastructure

### Connectors
- **Stripe MCP** - query payment data, manage customers, troubleshoot payment issues. Connected S172.
- **MailerLite MCP** - draft, schedule, and send email campaigns directly from Claude.
- *CRM deferred - Close requires paid trial. Spreadsheet/markdown for organizer tracking until beta scale warrants it.*

### Scheduled Automations (11 active)
Competitor monitoring, context freshness check (weekly Mon), UX spots, health scout (weekly), monthly digest, workflow retrospective, weekly Power User sweep, daily friction audit with action loop (Mon-Fri 8:38am), weekly pipeline briefing (Mon 9am), session warmup (on-demand), session wrap (on-demand). Managed by findasale-records + findasale-workflow + findasale-sales-ops agents.

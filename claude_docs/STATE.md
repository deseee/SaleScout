# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 222 COMPLETE (2026-03-21) — FULL QA AUDIT (4 ROLES) + RATE LIMIT FIX + 18 BUGS IDENTIFIED:**
- ✅ **Rate limit architecture fixed:** 7 files pushed. Polling reduced, global limit raised 200→500, /health/latency exempted.
- ✅ **Leaderboard crash fixed:** badges optional + ?. null safety. Verified deployed — page loads with 20 shoppers.
- ✅ **Re-audit complete:** Tested PRO (Oscar), SIMPLE/ADMIN (Nina), TEAMS (Quincy), Shopper (Ian). Create-sale form verified.
- ✅ **POS fix verified:** BUG #17 was rate-limit related — POS now shows 2 published sales correctly.
- **18 confirmed bugs (unfixed — see `claude_docs/audits/s222-qa-audit.md`):**
  - P0-CRITICAL: #22 (role guard blocks ADMIN users from all organizer pages — 40+ instances of `user.role !== 'ORGANIZER'`)
  - P1-HIGH: #20 (leaderboard sort broken), #25 (sale detail items always empty), #30 (follow button POST never fires)
  - P2-MEDIUM: #3 (dashboard counts DRAFT as active), #7 (How It Works on null), #13 (Inspiration ISR empty), #15 (reputation crash), #23 (subscription page useless without Stripe), #26 (no favorite/save button), #27 (unlabeled counters), #28 (Hunt Pass + PWA overlap), #29 (no Message Organizer button)
  - P3-LOW: #6 (no 429 UI messaging), #8 (false empty state), #19 (sale detail "not found" on 429), #24 (login stalls on geolocation)
- Last Updated: 2026-03-21
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
- **Audit findings NOT bugs:** Item Library "0 items" (correct — Oscar has no library items); Command Center "No active sales" (correct — seed data has stale dates, not a code bug); Brand Kit 429 (temporary rate limit from test session, not a code bug)
- **Known QA gaps remaining:** Patrick flagged comprehensive audit still incomplete — TEAMS tier, shopper flows, sale creation flow, auction flows, many engagement features unverified. Next session: systematic full-platform QA.
- Last Updated: 2026-03-21

**Session 217 COMPLETE (2026-03-21) — PRE-BETA SAFETY AUDIT + #102 PRICE VALIDATION:**
- ✅ **#100–#103 Pre-Beta Safety Audit:** 4 items audited. #100 (password reset rate limit) ✅ already implemented. #101 (sale publish ownership check) ✅ already implemented. #102 (item price >= 0 validation) ⚠️ MISSING → FIXED. Added price validation to itemController.ts createItem() and updateItem() for price, auctionStartPrice, auctionReservePrice. #103 (Stripe webhook signature verification) ✅ already implemented.
- ✅ **File Changed:** packages/backend/src/controllers/itemController.ts (price validation added, ~60 lines)
- ✅ **TypeScript Check:** PASS (0 errors)
- ✅ **MESSAGE_BOARD.json:** Updated with safety audit completion message
- Last Updated: 2026-03-21

**Session 218 COMPLETE (2026-03-20) — SECURITY HARDENING BATCH + #72 PHASE 2 + FEATURES (#78, #79, #104, #105) + CHROME P0 FIX:**
- ✅ **Security Hardening #104–#107:** CSRF double-submit cookie middleware (csrf.ts new), SQL injection fix (Prisma.sql in saleController getCities), account enumeration defense (generic login errors + timing attack dummy bcrypt in authController), requestPasswordReset generic response. Audit doc: security-audit-s218.md
- ✅ **#72 Phase 2 — Dual-Role JWT + Auth Middleware:** JWT payload now includes `roles: string[]` at all 3 generation points (login, register, oauthLogin). Auth middleware attaches `req.user.roles`. AuthContext updated on frontend. Backward-compatible (`role` retained alongside `roles`). Files: auth.ts (middleware), AuthContext.tsx.
- ✅ **#78 Inspiration Page:** Masonry item gallery (`/inspiration`), ISR 300s, items sorted by aiConfidence DESC, limit 48. New backend route `GET /api/items/inspiration`. Nav link added to Layout. Files: inspiration.tsx (new), InspirationGrid.tsx (new), itemController.ts, routes/items.ts, Layout.tsx
- ✅ **#79 Earnings Counter Animation:** Revolut-style count-up on organizer dashboard earnings total. useCountUp hook with requestAnimationFrame + easing. Files: useCountUp.ts (new), organizer/dashboard.tsx
- ✅ **Roadmap #104 AI Cost Ceiling:** Redis-based token tracking, monthly ceiling via `AI_COST_CEILING_USD` env var, auto-alert. Files: aiCostTracker.ts (new), cloudAIService.ts, adminController.ts, batchAnalyzeController.ts
- ✅ **Roadmap #105 Cloudinary Bandwidth Monitoring:** Serve-event tracker, 80% threshold alert. Files: cloudinaryBandwidthTracker.ts (new), uploadController.ts, routes/admin.ts
- ✅ **P0 Chrome fix:** Featured Sales carousel cards — title/location/dates now visible. File: SaleCard.tsx
- ✅ **Chrome audit P2 results:** Sale card navigation PASS. LiveFeedTicker rendering PASS.
- Last Updated: 2026-03-20

**Next up (S219):**
- [ ] QA: #72 Phase 2 auth middleware (flagged — touches JWT + auth)
- [ ] Chrome verify: /inspiration page renders correctly, Earnings Counter animation fires
- [ ] Continue pre-beta safety: #106–#109 (Organizer Reputation Scoring, Chargeback+Collusion Tracking, Winning Bid Velocity Check, Off-Platform Transaction Detection)
- [ ] #73 Two-Channel Notification System (gated by #72 ✅ now unblocked)
- [ ] #74 Role-Aware Registration Consent Flow (gated by #72 ✅)
- [ ] #75 Tier Lapse State Logic (gated by #72 ✅)
- [ ] New env vars needed on Railway: `AI_COST_CEILING_USD` (set to monthly budget), `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831`, verify `RESEND_API_KEY` + `RESEND_FROM_EMAIL`

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

### Scheduled Automations (10 active)
Competitor monitoring, context refresh, context freshness check, UX spots, health scout (weekly), monthly digest, workflow retrospective, weekly Power User sweep, daily friction audit (Mon-Fri 8:30am), weekly pipeline briefing (Mon 9am). Managed by Cowork Power User + findasale-workflow + findasale-sales-ops agents.

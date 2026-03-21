# Session Log — Recent Activity

## Recent Sessions

### 2026-03-20 · Session 215

**Massive Parallel Sprint: 8 Subagent Dispatches + Railway TS Error Recovery**

**Work completed:**
- **Subscription tier bug:** AuthContext.tsx was reading `organizerTier` from JWT (always undefined) instead of `subscriptionTier`. Fixed — PRO/TEAMS users now see correct tier.
- **P2 backlog (3 items):** Error shape standardized across 27 controllers (`{ error }` → `{ message }`), holds pagination added, hub N+1 query fixed.
- **Design polish:** #77 PublishCelebration confetti overlay on sale publish, #81 empty state copy pass across 8+ pages (ItemSearchResults, loot-log, typology, search, calendar, hubs, city, admin).
- **Platform safety P0:** #93 accountAgeGate middleware (7-day), #95 bidRateLimiter (Redis sliding window, 10/min), #96 CheckoutModal buyer premium line item + confirmation checkbox.
- **Architect ADR:** #72 Dual-Role Account Schema — recommends roles[] array + UserRoleSubscription table. Filed at `claude_docs/architecture/adr-072-dual-role-account-schema.md`.
- **Schema pre-wires:** 2 Neon migrations applied — consignment fields (`consignorId`, `consignmentSplitPct`) on Item, affiliate payout table + `affiliateReferralCode` on User.
- **#92 SEO city pages:** `/city/[city]` with ISR (revalidate 3600s), Schema.org JSON-LD, Grand Rapids pre-built via getStaticPaths.
- **Dockerfile.production truncation recovery:** MCP push_files overwrote 43-line Dockerfile with 4 lines. Recovered from git history (fa229fb) via create_or_update_file.
- **17 TypeScript errors fixed (3 MCP pushes):** performanceController (8 duplicate properties), stripeController (1 duplicate), syncController (6 `.error` → `.message` + FailedOperation type mapping), bidRateLimiter (2 Redis v4 method casing).

**Decisions:**
- MCP `push_files` overwrites ENTIRE file content — never pass partial content. Lesson re-learned painfully with Dockerfile truncation.
- Redis v4 uses camelCase methods (`zRangeByScore`, `zAdd`) not snake_case. Also uses `value` not `member` in sorted set entries.
- Error shape standardization: bulk rename creates cascading issues when internal code references the old property name (syncController) or when objects had both old+new keys (performanceController duplicates).

**Blockers resolved:** Railway build green after 3 repair pushes.

**Unverified from dispatches:** #76 skeleton loaders, Chrome audit of 7 routes — dispatched but completion not confirmed before context compaction. Verify S216.

---

### 2026-03-20 · Session 214

**Chrome Re-Verification + #70 LiveFeedTicker Placement**

**Work completed:**
- Chrome re-verify of S212+S213 fixes: 13/15 PASS. 2 "fails" were wrong test URLs (not real bugs).
- LiveFeedTicker placed on sale detail page (`/sales/[id]`) — completes #70 fully.
- Flag: `/organizer/subscription` PRO user sees upgrade CTA — queued for S215 (fixed there).

**Decisions:** #70 is FULLY COMPLETE. #19 Passkey is DEPLOYED.

---

### 2026-03-20 · Session 213

**Redis Infrastructure + P1/P2 Fixes + #70 Socket Dispatch + Secondary Route Audit P0/P1**

**Work completed:**
- Redis env live: `REDIS_URL` on Railway, `NEXT_PUBLIC_SOCKET_URL` on Vercel
- `getCities` controller: `prisma.$queryRaw` (bypassed Prisma groupBy type constraints, bigint→Number)
- P2 fixes: ThemeToggle dedup in Layout.tsx, Layout wrapper dedup in item-library + photo-ops
- #70: Redis socket adapter (graceful degradation), JWT socket auth, `useLiveFeed` hook, `LiveFeedTicker` component
- Secondary route audit: 5 P0/P1 fixed — priceHistory import+visibility, encyclopedia ownership, hub discovery 500-cap
- Merge conflict resolution: 5 files after sync with remote (STATE.md, session-log.md, saleController, insights, typology)

**Decisions:** `$queryRaw` is the correct pattern for grouped aggregates in this Prisma version. `groupBy` with `_count` has version-specific type issues — never use it.

---

### 2026-03-20 · Session 212 (continued)

**P1/P2 Bug Fix Completion + #70 Redis Setup**

**Phase 3 — P1/P2 Fixes Shipped:**
- **messages/index.tsx**: Fixed blank page — added `flex flex-col` to root div, `flex-1` to main element
- **subscription.tsx**: Tier-aware error state — SIMPLE users see upgrade CTA, PRO/TEAMS see support contact
- **webhooks.tsx**: Added `<TierGate requiredTier="TEAMS">` wrapper — SIMPLE/PRO users now see upgrade prompt
- **create-sale.tsx**: Replaced unicode escape with actual em dash character
- **pos.tsx**, **ripples.tsx**: Added `<Head><title>...</title></Head>`

**#70 Redis — Patrick provisioned Railway Redis service**
- REDIS_URL verified in Railway backend Variables tab
- NEXT_PUBLIC_SOCKET_URL added to Vercel

**Files pushed (4 MCP commits):** messages/index.tsx, subscription.tsx, webhooks.tsx, create-sale.tsx, ripples.tsx, pos.tsx, STATE.md, session-log.md

---

### 2026-03-20 · Session 212

**P0 Bug Fix Sprint + P1 Dark Mode Completion**

**Work Completed:**

**Phase 1 — All 7 P0 Bugs Fixed & Shipped:**
1. **Tier display bug** — `subscription.tsx`: replaced `subscription.tier` (Stripe) with `useOrganizerTier()` (JWT). JWT is canonical source of truth.
2. **Workspace 401** — `workspaceController.ts`: replaced `req.user?.organizerId` with `req.user?.organizerProfile?.id` at 6 locations across all workspace routes.
3. **Command-center crash** — `typology.tsx` (same dispatch): moved all `useQuery`/mutation hooks above auth guard conditional return. Eliminates React error #310.
4. **Typology crash** — `typology.tsx`: reordered hook calls, eliminated conditional hooks above return. Auth guard now after hook definitions.
5. **Wishlists redirect** — `wishlists.tsx`: changed redirect from `/auth/login` (404) to `/login`.
6. **/organizer/sales 404** — NEW page created: `pages/organizer/sales.tsx` with sale list, status badges (LIVE/ENDED/DRAFT/ARCHIVED), Edit/Items links per sale, Create button.
7. **Encyclopedia crash** — `EncyclopediaCard.tsx`: `getExcerpt()` now returns `string | null | undefined`, null-safe throughout.

**Phase 2 — P1 Dark Mode Completion (2 of 6):**
- **premium.tsx**: Dark gradient background on hero, dark: variants on tier cards, badge badges, FAQ section, CTA button
- **insights.tsx**: Dark variants on all metric cards, skeleton loaders (dark:bg-gray-800), per-sale section backgrounds, table rows, auth guard moved after hooks

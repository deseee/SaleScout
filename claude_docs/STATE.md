# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 247 COMPLETE (2026-03-23) — ROLE-BASED NAV FIX + ORGANIZER PROFILE + DESTRUCTIVE REMOVAL PATTERN:**
- ✅ **Root cause found:** Organizer profile showing only "Sale Interests + Push Notifications" since S237. The `isOrganizerOnly` gate was added to hide shopper content but no organizer replacement content was ever built. Not a S246 regression.
- ✅ **AvatarDropdown.tsx:** Added admin detection (`isAdmin`), "Admin Panel" link for admins, "My Profile" link for organizers (was missing), "My Dashboard" link for shoppers (was missing). "My Wishlists" preserved — pointed out it targets `/shopper/favorites` which may 404, but NOT removed (surfaced to Patrick instead).
- ✅ **Layout.tsx mobile drawer:** Shopper section relabeled "My Profile" → "My Dashboard" for `/shopper/dashboard`. Added separate "My Profile" → `/profile` for both shoppers and organizers.
- ✅ **profile.tsx:** Added 3 organizer sections inside `isOrganizerOnly` gate: Verification Status card (reads `verificationStatus` from `/users/me` API, not JWT), Your Sales card with link to organizer dashboard, Quick Links grid (Plan a Sale, Settings, Subscription, Workspace if TEAMS).
- ✅ **AuthContext.tsx:** Added `verificationStatus?: string` to User interface. Profile page fetches from `/users/me` since JWT doesn't include this field.
- ✅ **HOTFIX — Vercel build error:** `user.verificationStatus` → local `verificationStatus` variable sourced from API query. Commit fcfa835.
- ⚠️ **IDENTIFIED (not fixed — surfaced to Patrick):** "My Wishlists" in AvatarDropdown points to `/shopper/favorites` but mobile drawer "My Wishlists" points to `/wishlists`. Favorites = flat heart-saves, Wishlists = named shareable collections. Separate features, confusing nav. Patrick deciding next steps.
- ⚠️ **CRITICAL PATTERN — Destructive removal:** Subagent removed "My Wishlists" link without Patrick approval despite feedback memory prohibiting this. Caught and restored immediately. Patrick wants permanent fix via CLAUDE.md and/or skill changes in S248.
- ⚠️ **S248 PRIORITY 1:** Full feature/nav audit against roadmap — every feature should be reachable by every role that needs it
- ⚠️ **S248 PRIORITY 2:** Permanent fix for destructive removal pattern — CLAUDE.md §7 subagent gate changes + skill execution path changes
- ⚠️ **CARRY-FORWARD:** D1 message reply E2E, B3/B4 (Purchases/Pickups), dark mode pass, L-002 mobile, M2 TODO/FIXME, /profile edit buttons (Patrick never answered)
- Last Updated: 2026-03-23

**Session 246 COMPLETE (2026-03-23) — SHOPPER QA SCAN + CRITICAL BUILD HOTFIXES:**
- ✅ QA scan: 14 items tested (9 passed, 1 fixed, 1 inconclusive, 3 unverified)
- ✅ B1 Favorites fix pushed (Array.isArray guard)
- ✅ HOTFIX: profile.tsx stray `>` + auth.ts `requireAdmin`
- Last Updated: 2026-03-23

**Session 245 COMPLETE (2026-03-23) — SHOPPER DASHBOARD FIXES + QA BEHAVIORAL CORRECTION:**
- ✅ S244 post-fix verification confirmed live
- ✅ 4 shopper dashboard fixes pushed
- ✅ QA behavioral correction (Chrome MCP-first methodology)
- Last Updated: 2026-03-23

**Session 244 COMPLETE (2026-03-22) — HEALTH SCOUT FIX + DARK MODE AUDIT + META CLEANUP**
**Session 242 COMPLETE (2026-03-22) — BRAND SWEEP + D-007 + 13 UX BUG FIXES + QA SKILL REWRITE**
**Session 241 COMPLETE (2026-03-22) — LIVE VERIFICATION + D-007 FULLY DEPLOYED**
**Session 240 COMPLETE (2026-03-22) — FULL AUDIT FIX + D-007 LOCKED**
**Session 239 COMPLETE (2026-03-22) — BUG FIXES + WORKFLOW AUTOMATION PLATEAU**
**Session 238 COMPLETE (2026-03-22) — ROLE WALKTHROUGHS + COPY BROADENING**
**Session 236 COMPLETE (2026-03-22) — BETA TESTER READINESS: BUG BLITZ + ROUTE AUDIT + INNOVATION RE-RUN**

---

**Pricing Model (LOCKED):**
- **SIMPLE (Free):** 10% platform fee, 200 items/sale included, 5 photos/item, 100 AI tags/month
- **PRO ($29/month or $290/year):** 8% platform fee, 500 items/sale, 10 photos/item, 2,000 AI tags/month, unlimited concurrent sales, batch operations, analytics, brand kit, exports
- **TEAMS ($79/month or $790/year):** 8% platform fee, 2,000 items/sale, 15 photos/item, unlimited AI tags, multi-user access, API/webhooks, white-label, priority support, **12-member cap (D-007 LOCKED)**
- **ENTERPRISE (Custom, $500–800/mo):** Unlimited members, dedicated support, SLA (D-007 LOCKED)
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

## Active Infrastructure

### Connectors
- **Stripe MCP** - query payment data, manage customers, troubleshoot payment issues. Connected S172.
- **MailerLite MCP** - draft, schedule, and send email campaigns directly from Claude.
- *CRM deferred - Close requires paid trial. Spreadsheet/markdown for organizer tracking until beta scale warrants it.*

### Scheduled Automations (11 active)
Competitor monitoring, context freshness check (weekly Mon), UX spots, health scout (weekly), monthly digest, workflow retrospective, weekly Power User sweep, daily friction audit with action loop (Mon-Fri 8:38am), weekly pipeline briefing (Mon 9am), session warmup (on-demand), session wrap (on-demand). Managed by findasale-records + findasale-workflow + findasale-sales-ops agents.

# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 215 COMPLETE (2026-03-20) — MASSIVE PARALLEL SPRINT + TS ERROR RECOVERY:**
- ✅ **Subscription tier bug fixed:** AuthContext was reading `organizerTier` instead of `subscriptionTier` from JWT
- ✅ **P2 backlog shipped:** Error shape standardization (27 controllers → `{ message }`), holds pagination, hub N+1 fix
- ✅ **Design polish shipped:** #77 PublishCelebration confetti overlay, #81 empty state copy pass (8+ pages)
- ✅ **Platform safety P0 shipped:** #93 account age gate (7-day), #95 Redis bid rate limiter, #96 buyer premium disclosure
- ✅ **Architect ADR filed:** #72 Dual-Role Account Schema → `claude_docs/architecture/adr-072-dual-role-account-schema.md`
- ✅ **Schema pre-wires:** Consignment fields + affiliate payout table migrated to Neon (2 migrations applied)
- ✅ **#92 SEO city pages:** ISR `/city/[city]` with Schema.org JSON-LD, Grand Rapids pre-built
- ⚠️ **#76 Skeleton loaders:** dispatched but not confirmed shipped — verify S216
- ⚠️ **Chrome audit of 7 routes:** dispatched but not confirmed — verify S216
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

**Next up (S216):**
- [ ] Verify #76 skeleton loaders shipped (S215 dispatch - unconfirmed)
- [ ] Verify Chrome audit of 7 secondary routes completed (S215 dispatch - unconfirmed)
- [ ] #51 Sale Ripples: Neon migration + `prisma generate` still pending (Patrick action)
- [ ] #72 implementation: roles[] array + UserRoleSubscription table (ADR approved S215)
- [ ] #73 Two-Channel Notifications (gated by #72)
- [ ] #74 Role-Aware Registration Consent (gated by #72)
- [ ] #75 Tier Lapse State Logic (gated by #72)
- [ ] Platform safety continued: #94-#121 from pre-beta safety list
- [ ] Error shape follow-up: syncController helper functions still use `{ message: { message, retryable } }` pattern - consider flattening for consistency with FailedOperation interface

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

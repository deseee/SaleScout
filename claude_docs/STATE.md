# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 208 COMPLETE (2026-03-20) — DOCUMENTATION + AUDIT + CODE FIXES (DARK MODE + UX + NAV):**
- Updated BUSINESS_PLAN.md to v2 (platform fee correction, Platform Safety section, Section 12 B2B/pipeline analysis)
- Updated roadmap.md to v64 (pre-wire annotations on 9 deferred items)
- Created chrome-audit-2026-03-20.md (code + live inspection; 4 critical dark mode bugs identified)
- Fixed dark mode on shopper nav (13 links in Layout.tsx), favorites.tsx, loyalty.tsx, loot-log pages
- Fixed SaleCard badge explosion (5-badge flex → single-badge priority: SOLD > LIVE > FLASH > AUCTION > TODAY) + dark mode
- Fixed 3 bare error pages (organizers/[id], shoppers/[id], items/[id]) with EmptyState + CTA
- Fixed upsell copy and palette on flip-report, photo-ops, dashboard (blue → amber)
- Nav consolidation (Layout.tsx): static header 8→5 items (Calendar/Cities removed), inline organizer/shopper desktop links moved to avatar dropdown, Neighborhoods removed from drawer, locked PRO items grouped into collapsed "Unlock with PRO" section at drawer bottom, Plan a Sale hidden from shoppers
- Dashboard cleanup (dashboard.tsx): Quick Actions always expanded; Essential Tools/Pro Features/Community collapsed by default on mobile; sales list order confirmed above actions
- UX spec filed: claude_docs/ux-spotchecks/nav-dashboard-consolidation-2026-03-20.md
- All TypeScript clean (zero errors). Fixes staged for Patrick push (see block below)
- Last Updated: 2026-03-20

**Pricing Model (LOCKED — Session 207):**
- **SIMPLE (Free):** 10% platform fee, 200 items/sale included, 5 photos/item, 100 AI tags/month
- **PRO ($29/month or $290/year):** 8% platform fee, 500 items/sale, 10 photos/item, 2,000 AI tags/month, unlimited concurrent sales, batch operations, analytics, brand kit, exports
- **TEAMS ($79/month or $790/year):** 8% platform fee, 2,000 items/sale, 15 photos/item, unlimited AI tags, multi-user access, API/webhooks, white-label, priority support
- **Overages:** SIMPLE $0.10/item beyond 200; PRO $0.05/item beyond 500; TEAMS $0.05/item (soft cap)
- **Shopper Monetization:** 5% buyer premium on auction items ONLY; Hunt Pass $4.99/mo (PAUSED); Premium Shopper (DEFERRED to 2027 Q2)
- **Post-Beta:** Featured Placement $29.99/7d, AI Tagging Premium $4.99/mo (SIMPLE), Affiliate 2–3%, B2B Data Products (DEFERRED)
- **Sources:** pricing-and-tiers-overview-2026-03-19.md (complete spec), BUSINESS_PLAN.md (updated), b2b-b2e-b2c-innovation-broad-2026-03-19.md (B2B/B2E/B2C strategy)

**Pending Patrick push (Session 208 — ALL CHANGES):**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/frontend/components/Layout.tsx
git add packages/frontend/components/SaleCard.tsx
git add "packages/frontend/pages/items/[id].tsx"
git add packages/frontend/pages/organizer/dashboard.tsx
git add "packages/frontend/pages/organizer/flip-report/[saleId].tsx"
git add "packages/frontend/pages/organizer/photo-ops/[saleId].tsx"
git add "packages/frontend/pages/organizers/[id].tsx"
git add packages/frontend/pages/shopper/favorites.tsx
git add "packages/frontend/pages/shopper/loot-log/[purchaseId].tsx"
git add "packages/frontend/pages/shopper/loot-log/public/[userId].tsx"
git add packages/frontend/pages/shopper/loyalty.tsx
git add "packages/frontend/pages/shoppers/[id].tsx"
git add claude_docs/strategy/BUSINESS_PLAN.md
git add claude_docs/strategy/roadmap.md
git add claude_docs/audits/chrome-audit-2026-03-20.md
git add claude_docs/ux-spotchecks/nav-dashboard-consolidation-2026-03-20.md
git add claude_docs/STATE.md
git add claude_docs/session-log.md
git commit -m "S208: dark mode (shopper nav/favorites/loyalty/SaleCard), badge fix, empty states, upsell copy, nav consolidation (5 items), dashboard mobile collapse"
.\push.ps1
```

**DB test accounts (Neon production — current):**
- `user1@example.com` / `password123` → ORGANIZER, SIMPLE tier
- `user2@example.com` / `password123` → ORGANIZER, PRO tier
- `user3@example.com` / `password123` → ORGANIZER, TEAMS tier
- `user11@example.com` / `password123` → Shopper

---

**Next up (S209+) — DARK MODE COMPLETION + NAV DENSITY + DASHBOARD CONSOLIDATION:**
- [ ] Chrome MCP visual verification (deferred — MCP unavailable this session)
- [ ] Dark mode audit remaining pages (Explore, Map, search, etc. — not yet audited)
- [ ] Nav density reduction (currently 17–24 items per nav; requires UX/architect decision)
- [ ] Dashboard button consolidation (25 buttons → grouped actions; requires UX decision)
- [ ] #19 Passkey re-QA — end-to-end after P0 race fix
- [ ] #70 Live Sale Feed — needs live Socket.io testing

---

**Session 202 COMPLETE (2026-03-18) — CHROME VERIFICATION + DB ACCOUNTS + UX + A11Y AUDIT REPORTS:**
- 50+ routes verified across all user types. 1 confirmed 404 fixed: /organizer/neighborhoods → /neighborhoods.
- Neon test accounts established for all 4 user types. JWT + tier payload verified.
- 7 TypeScript errors fixed. Vercel build unblocked. 13 routes now deploy correctly.
- P0 UX restructure: drawer grouping, dashboard sections, Plan a Sale gated to organizers.
- §13 Schema-First Pre-Flight Gate added to CLAUDE.md (permanent, binding on all dev subagents).
- 3 audit reports filed: ux-audit, design-critique, accessibility-audit (claude_docs/audits/).
- Last Updated: 2026-03-18 (sessions 202+203)

---

**Sessions 191–199 COMPLETE (2026-03-17–18):**
- Wave 5 Sprint 1 (6 features) + Sprint 2 frontends shipped. All Neon migrations applied.
- Passkey P0 fix (S196+S197) — QA confirmed READY. Rate limiting added.
- Full docs audit + archive reorganization (134 files re-filed). Roadmap v55.
- Vercel + Railway GREEN throughout.
- Full history: session-log.md + git log.

---

---

## Active Infrastructure

### Connectors
- **Stripe MCP** — query payment data, manage customers, troubleshoot payment issues. Connected S172. Unlocks #6 dashboard real payment data + #65 Tiers subscription billing.
- **MailerLite MCP** — draft, schedule, and send email campaigns directly from Claude.
- *CRM deferred — Close requires paid trial. Spreadsheet/markdown for organizer tracking until beta scale warrants it.*

### Scheduled Automations (10 active)
Competitor monitoring, context refresh, context freshness check, UX spots, health scout (weekly), monthly digest, workflow retrospective, weekly Power User sweep, daily friction audit (Mon-Fri 8:30am), weekly pipeline briefing (Mon 9am). Managed by Cowork Power User + findasale-workflow + findasale-sales-ops agents.

---

**Sessions 186–195 COMPLETE (2026-03-13–17):**
- Wave 2–4 QA sprints, 29 features audited. Vercel build recovered (8 TS errors fixed).
- Bugs: login redirect loop, Google Fonts CSP, dark mode, ThemeToggle visibility, service worker image loading, CityHeatBanner coordinates.
- Full history: session-log.md + git log.

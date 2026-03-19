# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 206 COMPLETE (2026-03-19) — ROADMAP RESTORATION AUDIT:**
- Restored Patrick's Checklist to roadmap.md (business formation, credentials, beta recruitment, pre-beta prep)
- Moved automations + connectors to STATE.md (see Active Infrastructure below)
- Confirmed all Agent Task Queue items done — section retired
- Promoted 9 deferred items to backlog (#84–#92)
- Roadmap now at v61

**Pending Patrick pushes:**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/backend/src/index.ts
git commit -m "S205: register 13 dead backend routes"
.\push.ps1
```
```powershell
git add claude_docs/strategy/roadmap.md claude_docs/STATE.md claude_docs/session-log.md claude_docs/next-session-prompt.md
git commit -m "S206: restore Patrick checklist, promote 9 deferred to backlog, automations to STATE"
.\push.ps1
```

**Also pending — delete 3 junk files:**
```powershell
Remove-Item claude_docs\operations\patrick-checklist.md, claude_docs\operations\automated-checks.md, claude_docs\operations\agent-task-queue.md
```

**DB test accounts (Neon production — current):**
- `user1@example.com` / `password123` → ORGANIZER, SIMPLE tier
- `user2@example.com` / `password123` → ORGANIZER, PRO tier
- `user3@example.com` / `password123` → ORGANIZER, TEAMS tier
- `user11@example.com` / `password123` → Shopper

---

**Next up (S206) — CHROME + NAV + HUMAN PREP:**
- [ ] Chrome column verification — test features in browser via Chrome MCP
- [ ] Nav column audit — verify nav links in Layout.tsx match roadmap
- [ ] Human column prep — organize E2E test flows for Patrick
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

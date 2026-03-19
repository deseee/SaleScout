# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 204 COMPLETE (2026-03-19) — FEATURES + ROADMAP AUDIT + PROGRESSIVE DISCLOSURE:**

**Code shipped:**
- Shopper desktop nav: Layout.tsx — Explore + Map for shoppers. Pushed: f40ba6e
- Encyclopedia seed: 15 entries in seed.ts. TS2448 + P2003 fixes. Pushed: cdf1c60 + P2003 fix
- #65 Progressive Disclosure: TierGatedNav.tsx (new), Layout.tsx nav restructure, dashboard.tsx 4-section tier-gated layout. Spec: `claude_docs/features/65-progressive-disclosure.md`
- Pending Patrick push: progressive disclosure code + roadmap

**Roadmap v56 audit:**
- Formatting rules added to top of roadmap (binding on all agents, Rule 29 in conversation-defaults)
- Chrome/Nav/Human columns restored. Role column added to Deferred + Rejected tables
- Coupons added as shipped feature. Affiliate Program added to Deferred
- N/A markers on non-human-testable features (A/B Testing, Tiers Backend, Sentry scoring)
- 3 junk files to delete: patrick-checklist.md, automated-checks.md, agent-task-queue.md

**Research completed:**
- Affiliate Program: Innovation report at `claude_docs/research/affiliate-program-research-2026-03-19.md`
- Reconciliation report: `claude_docs/operations/roadmap-reconciliation-2026-03-19.md`
- Coupons: fully built (schema + routes + controller). Two-tier approach (SIMPLE w/ limits, PRO advanced)
- Virtual Queue: confirmed SIMPLE tier, no tier gating in code
- Hunt Pass: needs discussion re: placement within Premium tier structure

**Open decisions (deferred to future session):**
- Hunt Pass placement within Premium tier
- Coupon two-tier approach scope (SIMPLE limits vs PRO analytics)
- Affiliate referral badges + loyalty passport integration fleshing out

**DB test accounts (Neon production — current):**
- `user1@example.com` / `password123` → ORGANIZER, SIMPLE tier (Giselle Brown)
- `user2@example.com` / `password123` → ORGANIZER, PRO tier (Lena Freeman)
- `user3@example.com` / `password123` → ORGANIZER, TEAMS tier (Aaron Wells)
- `user11@example.com` / `password123` → Shopper (Zoe Gonzalez)

---

**Next up (S205) — QA BLITZ SESSION:**
- [ ] Push S204 code (progressive disclosure + roadmap) if not already done
- [ ] Delete 3 junk ops files (patrick-checklist, automated-checks, agent-task-queue)
- [ ] Install conversation-defaults v8 (Rule 29)
- [ ] Parallel QA blitz: dispatch agents to test/QA all 📋PEND features, get as many to ✅ as possible
- [ ] Target: move features from 📋PEND → ✅ in QA/Chrome/Nav columns, mark Human-ready where applicable
- [ ] Wave 5 remaining: #70 Live Sale Feed (QA pending), #47 UGC Photo Tags (Chrome pending)
- [ ] Waves 2-4 regression: ~30 features with 📋PEND QA status

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

**Sessions 186–195 COMPLETE (2026-03-13–17):**
- Wave 2–4 QA sprints, 29 features audited. Vercel build recovered (8 TS errors fixed).
- Bugs: login redirect loop, Google Fonts CSP, dark mode, ThemeToggle visibility, service worker image loading, CityHeatBanner coordinates.
- Full history: session-log.md + git log.

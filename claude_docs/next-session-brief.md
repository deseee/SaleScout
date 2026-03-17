# Next Session Brief — S189+

**Date Prepared:** 2026-03-17
**Context:** S188 completed TypeScript + Railway recovery. S187 shipped 12 features. Roadmap v44. DATABASE: 7 Neon migrations pending manual Patrick action. INFRASTRUCTURE: Railway and Vercel both GREEN.

---

## Patrick Pre-Session Checklist

### Critical Path (BLOCKING)
- [ ] Run 7 Neon migrations (see CLAUDE.md §6 for exact PowerShell commands with `$env:DATABASE_URL` override)
- [ ] Verify Vercel + Railway remain GREEN after last push

### Optional But Recommended
- [ ] Open Stripe business account (currently on test keys; blocks monetization)
- [ ] Beta organizer recruitment (5 targets in `claude_docs/beta-launch/organizer-outreach.md`)

---

## Remaining Roadmap

### Phase 4 — In Progress / Planned (15 features)

Grouped by **parallel workstream** for simultaneous subagent dispatch:

#### Workstream A: Analytics & Intelligence Expansion
- **#68: Command Center Dashboard** [PRO] — 2 sprints
  - **Status:** Sprint 1+2 COMPLETE (S183), QA PENDING
  - **What's Left:** findasale-qa pass required before promoting to users
  - **Files:** Backend/Frontend already built; test coverage needed
  - **Dispatch Agent:** `findasale-qa`
  - **Notes:** This is a gate for shipping #68; cannot move to "Shipped" until QA passes

- **#30: AI Item Valuation & Comparables** [PRO] — 2 sprints
  - **What:** Price range suggestions from sold-item data + visual embeddings. Leverages existing AI pipeline.
  - **Prerequisite:** 100+ sold items per category (post-beta validation)
  - **Dispatch Agent:** `findasale-dev` (ML/pricing pipeline)
  - **Estimate:** 2 sprints (Sprint 1: backend valuation service + API; Sprint 2: frontend UI + price recommendations)

- **#41: Flip Report** [PRO] — 1.5 sprints
  - **What:** Post-sale analytics PDF/dashboard. "What sold, what didn't, what to price differently next time."
  - **Dispatch Agent:** `findasale-dev`
  - **Schema:** No new fields; query existing data (sales, items, purchases)
  - **Estimate:** 1.5 sprints

#### Workstream B: Real-Time & Notifications
- **#14: Real-Time Status Updates** [PRO] — 1 sprint (SHIPPED S187 — move to Shipped)
  - Already marked SHIPPED above

- **#70: Live Sale Feed** [SIMPLE] — 1 sprint (SHIPPED S185 — move to Shipped)
  - Already shipped (real-time activity stream)

#### Workstream C: Trust & Safety Infrastructure
- **#13: Premium Organizer Tier** [TEAMS] — 2 sprints
  - **What:** Infrastructure for TEAMS tier — separate from PRO gating (already in #65). New tier-specific features.
  - **Dispatch Agent:** `findasale-architect` (design), `findasale-dev` (implementation)
  - **Estimate:** 2 sprints
  - **Depends On:** #65 (already complete)

- **#16: Verified Organizer Badge** [PRO] — 1–2 sprints
  - **What:** Professional differentiation, trust signal. Email verification + business registration check.
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1–2 sprints

- **#17: Bid Bot Detector + Fraud Confidence Score** [PRO] — 1–1.5 sprints
  - **What:** Flag suspicious bidding patterns. Human review (not auto-ban). Fraud confidence score visible to organizers.
  - **Dispatch Agent:** `findasale-hacker` (security review)
  - **Estimate:** 1–1.5 sprints

- **#71: Organizer Reputation Score** [SIMPLE] — 1.5 sprints (SHIPPED S186 — move to Shipped)
  - Already shipped

#### Workstream D: Accessibility & Mobile-First
- **#19: Passkey / WebAuthn Support** [SIMPLE] — 1–2 sprints
  - **What:** Phishing-resistant auth alongside OAuth.
  - **Dispatch Agent:** `findasale-hacker` (security)
  - **Estimate:** 1–2 sprints

- **#20: Proactive Degradation Mode** [PRO] — 1 sprint
  - **What:** Latency > 2s → auto-drop analytics, reduce image quality, preserve core flow.
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1 sprint
  - **Notes:** Performance-critical; may need profiling

- **#22: Low-Bandwidth Mode (PWA)** [SIMPLE] — 1 sprint
  - **What:** Detect slow connections, auto-reduce photo quality, disable video previews.
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1 sprint

#### Workstream E: Shopper Engagement & Gamification
- **#15: Shopper Referral Rewards expansion** [FREE] — 1 sprint
  - **What:** Viral growth loop (complement to #7 shipped in S187).
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1 sprint

- **#29: Shopper Loyalty Passport** [FREE] — 2 sprints (SHIPPED S187 — move to Shipped)
  - Already marked SHIPPED above

- **#45: Collector Passport** [FREE] — 1.5 sprints
  - **What:** Gamified collection tracker. "I collect depression glass, Fiestaware, mid-century furniture."
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1.5 sprints
  - **Depends On:** Wishlist infrastructure (#32 shipped S187)

- **#46: Treasure Typology Classifier** [PRO] — 2 sprints
  - **What:** ML model classifying items into collector categories from photos.
  - **Dispatch Agent:** `findasale-hacker` (ML pipeline)
  - **Estimate:** 2 sprints
  - **Prerequisite:** Training data from shipped items

#### Workstream F: Offline & Local-First
- **#69: Local-First Offline Mode** [PRO] — 3 sprints
  - **What:** Full offline capability via service worker + IndexedDB. Catalog, price, photo with zero internet. Sync on reconnect.
  - **Dispatch Agent:** `findasale-architect` (design), `findasale-dev` (implementation)
  - **Estimate:** 3 sprints (LARGE)
  - **Notes:** Competitive requirement; high complexity

#### Workstream G: Community & Social
- **#39: Photo Op Stations** [PRO] — 1 sprint
  - **What:** Designated "selfie spot" markers at sales. Branded photo frames, shareable moments.
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1 sprint

- **#40: Sale Hubs** [PRO] — 1.5 sprints
  - **What:** Group nearby sales into a "hub" — shared map, combined route, hub landing page.
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1.5 sprints
  - **Depends On:** #28 (Heatmap, already shipped)

- **#44: Neighborhood Sale Day** [PRO] — 1 sprint
  - **What:** Organizers in a neighborhood coordinate a shared sale date.
  - **Dispatch Agent:** `findasale-dev`
  - **Estimate:** 1 sprint
  - **Depends On:** #40 (Sale Hubs)

---

### Phase 5 — Post-Beta Scale (6 features)

Ranked by business priority. Start AFTER Phase 4 sprint is mature.

| # | Feature | Tier | Est. | Dispatch | Notes |
|---|---------|------|------|----------|-------|
| 47 | UGC Photo Tags | [FREE] | 1.5 sprints | `findasale-dev` | Shoppers tag and share photos. Moderation queue. |
| 48 | Treasure Trail Route Builder | [FREE] | 1.5 sprints | `findasale-dev` | Multi-sale route planning with time estimates. |
| 50 | Loot Log | [FREE] | 1.5 sprints | `findasale-dev` | Personal purchase history + collection gallery. |
| 52 | Estate Sale Encyclopedia | [FREE] | 3 sprints | `findasale-architect` | Crowdsourced knowledge base. Long-tail SEO. |
| 53 | Cross-Platform Aggregator | [TEAMS] | 2 sprints | `findasale-architect` | Pull from EstateSales.NET, Craigslist, etc. |
| 54 | Crowdsourced Appraisal API | [PAID_ADDON] | 2.5 sprints | `findasale-hacker` | Community + AI estimate. Revenue potential. |
| 55 | Seasonal Discovery Challenges | [FREE] | 1 sprint | `findasale-dev` | Themed challenges, badges, leaderboards. |

---

### Vision — Long-Term (56–60)

Deferred until platform maturity. See roadmap.md for details.

---

## Critical Notes for Next Session

### Database: 7 Migrations Pending
Before ANY feature touching the database can be tested in production, Patrick must run:

```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy
npx prisma generate
```

See CLAUDE.md §6 for full context.

### Infrastructure Status
- **Vercel (Frontend):** GREEN ✅ — auto-deploys on main push
- **Railway (Backend):** GREEN ✅ — auto-deploys on main push
- **Neon (Database):** Requires manual migration deploy (Patrick action)

### Subagent Dispatch Protocol (IMPORTANT)
All code implementation dispatches to subagents ONLY. See CLAUDE.md §12 hard gate.

**Main session responsibilities:**
1. Read specs + roadmap
2. Decide what builds next
3. Write dispatch prompts to subagents (include file paths, spec references)
4. Review + coordinate subagent output
5. Batch pushes (MCP ≤3 files or Patrick PS1 block for larger)
6. Report to Patrick

**Never inline:** code features, multi-file edits, new components/controllers/utilities.

---

## Suggested First Dispatch (Next Session)

### High-Impact, Low-Risk Parallel Batch

**Workstream A1: QA #68 Command Center** (GATE-CRITICAL)
- Dispatch: `findasale-qa`
- Task: Full QA pass on 9 files from S183
- Blocker: Cannot ship #68 without passing

**Workstream B1: #30 AI Item Valuation** (Architecture)
- Dispatch: `findasale-architect`
- Task: Design API contract, database queries, valuation algorithm
- Output: ADR + Sprint 1 spec (no code yet)

**Workstream D1: #19 Passkey / WebAuthn** (Security)
- Dispatch: `findasale-hacker`
- Task: OAuth integration review, WebAuthn library selection, threat modeling
- Output: Security ADR + implementation plan

**Workstream E1: #15 Referral Expansion** (Quick Win)
- Dispatch: `findasale-dev`
- Task: Build viral loop on top of #7 (already shipped)
- Estimate: 1 sprint
- Low risk: purely frontend + existing notification infrastructure

---

## Session Goals (Recommended)

1. **BLOCK CLEAR:** QA #68 → ship or fix
2. **ARCHITECTURE:** Plan Phase 4 top 3 features (ADRs, specs)
3. **PARALLEL BUILD:** Start 1–2 quick-win sprints from Workstream A/D/E
4. **CONTEXT:** Update roadmap.md + session-log.md at wrap

---

## Files to Reference

- `claude_docs/strategy/roadmap.md` — Full feature inventory (v44)
- `claude_docs/CLAUDE.md` — Execution rules (hard gates, push protocol, subagent dispatch)
- `claude_docs/CORE.md` — Architecture + behavior rules
- `claude_docs/STATE.md` — Session history + known issues
- `claude_docs/strategy/COMPLETED_PHASES.md` — Build history (context)

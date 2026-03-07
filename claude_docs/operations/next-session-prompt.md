# Next Session Resume Prompt
*Written: 2026-03-07 — Session 91*
*Session ended: normally*

## Resume From — AUTONOMOUS MODE

Session 92 should run autonomously without waiting for Patrick's direction. Pick up all open work items below in priority order. Batch agents in groups of ≤3. Report completion when the queue is exhausted.

---

## Open Work Queue (Priority Order)

### 1. Install improved skill descriptions (Patrick action — remind him)
Patrick has two `.skill` files to install via the Cowork UI (presented at end of session 91):
- `health-scout-improved.skill` — tighter NOT-for exclusions, adds "pre-merge review", "scan for [pattern]", "does X look solid/safe"
- `findasale-dev-improved.skill` — adds "wire up", "write the migration", "add [field] to schema", "update .env.example" triggers
Tell Patrick to install these at session start before proceeding.

### 2. Legal ToS updates — implement in code
Spec: `claude_docs/beta-launch/legal-terms-updates-2026-03-07.md`
Dispatch findasale-dev to apply exact line-level edits to `terms.tsx` / `privacy.tsx`. Scope update: estate sales → yard sales, auctions, flea markets. Plus 4 compliance gap fixes. Estimated $20-60k exposure if unaddressed before beta.

### 3. Health scout findings — route and resolve
Report: `claude_docs/health-reports/health-scout-pre-beta-2026-03-07.md`
2 high findings (missing env vars in .env.example, NEXT_PUBLIC_DEFAULT_CITY undocumented) → findasale-dev.
6 medium findings (coupon rate limiting, audit trail, logging, Stripe ID masking, admin pagination, request correlation IDs) → findasale-qa to triage, then findasale-dev for anything pre-beta critical.

### 4. Sprint 4 — begin implementation
Architecture ADR: `claude_docs/feature-notes/sprint-4-architecture-2026-03-07.md`
UX spec: `claude_docs/feature-notes/sprint-4-ux-spec-2026-03-07.md`
Dispatch findasale-dev for Sprint 4a (PostgreSQL tsvector FTS, schema migration, API endpoint). Consult findasale-architect if schema questions arise.

### 5. MailerLite onboarding automation — spec to Patrick
CX agent produced the automation spec this session. Summarize the spec for Patrick and flag what he needs to build in MailerLite (this is a Patrick manual action — Claude cannot access MailerLite UI directly).

### 6. Marketing — deGR-ified outreach docs
findasale-marketing dispatched in session 91. Review output and present any completed outreach docs to Patrick.

---

## What Was Completed This Session (91)

**Power User sweep:**
- Roadmap updated to v19 (Sprint 3/3.5 removed from queue, migration count 63, task count 8)
- Weekly Power User sweep scheduled task created (Sundays 10pm)
- AskUserQuestion tool confirmed working (was broken since Feb 28 — now fixed)
- conversation-defaults updated: Rule 1 now enables AskUserQuestion
- Zapier deferred (MailerLite native automations sufficient, free)
- Ahrefs deferred (Google Search Console first, free)
- Ecosystem research memo saved: `claude_docs/improvement-memos/ecosystem-research-2026-03-07.md`

**Agent fleet dispatched (6 agents, batched in 3s):**
- Legal: `claude_docs/beta-launch/legal-terms-updates-2026-03-07.md`
- UX: `claude_docs/feature-notes/sprint-4-ux-spec-2026-03-07.md`
- Health Scout: `claude_docs/health-reports/health-scout-pre-beta-2026-03-07.md`
- Architect: `claude_docs/feature-notes/sprint-4-architecture-2026-03-07.md`
- Records: CORE.md §11 added (parallel agent limit), STATE.md "In Progress" compressed
- Marketing, CX, Support dispatched

**Infrastructure improvements:**
- CORE.md §11: Max 3 parallel agents per call (empirically confirmed, session 91)
- CORE.md §18: run_loop.py known incompatible with Cowork — do not retry, use manual analysis
- Pipeline 1 built: competitor-monitor → auto content drafting (3-phase scheduled task)
- Skill evals: manual gap analysis on health-scout + findasale-dev
- Improved skill packages created and presented for install

---

## Sprint Queue
- **Sprint 4** — Search by Item Type (ADR + UX spec complete, ready for dev)
- **Sprint 5** — Seller Performance Dashboard

## Patrick's Manual Beta Items
1. Install health-scout-improved.skill and findasale-dev-improved.skill (Cowork UI)
2. Confirm 5%/7% fee
3. Set up Stripe business account
4. Google Search Console verification
5. Order business cards (files in `claude_docs/brand/`)
6. Start beta organizer outreach
7. Rotate Neon credentials
8. Set up dedicated FindA.Sale Google account (support@finda.sale) for Google Workspace connectors
9. Build MailerLite onboarding automation (spec from CX agent)

## Environment Notes
- **Git sync:** CORE.md edited this session — include in next push.
- **Neon:** 63 migrations applied. No pending.
- **Connectors active:** Stripe MCP, MailerLite MCP, GitHub MCP
- **Skills:** Use `Skill` tool for findasale-* agents — NOT `Agent` tool
- **push.ps1:** Fully hardened. Doc conflicts auto-resolve.
- **Parallel agent limit:** Max 3 per dispatch call. Batch and wait.
- **run_loop.py:** Do not use — exits code 255 in Cowork environment. See CORE.md §18.

# Session Log — FindA.Sale

Cross-session memory for Claude. Updated at every session end.
Read this at session start to understand recent context without loading extra files.
Keep only the 5 most recent sessions. Delete older entries — git history and STATE.md are the durable record.

---

## Recent Sessions

### 2026-03-07 (session 89 — Sprint 3 shipped + workflow hardening)
**Worked on:**
- **Sprint 3 completion:** Fixed P1012 (session env var $env:DATABASE_URL override), P3014 (CREATEDB privilege on native Postgres), P2011 (seed null constraint on embedding — added `embedding: []`). Ran `prisma migrate dev` locally (migration 20260307153530_add_coupon_model), committed Sprint 3 in 3 commits (7eef1a0, 09955b3, b61f394), deployed Neon migration (63 total applied).
- **Workflow audit (sessions 88+89 failure modes):** Dev, QA, workflow, records, and ops agents analyzed wasted turns: session env var override, shadow DB CREATEDB, git status not checked before add, Docker command issued without dev-environment loaded, STATE.md placeholder propagated, stale duplicate next-session-prompt.md. All patterns documented and hardened.
- **System hardening:** CORE.md §2 sprint queue hold rule added. Self-healing entries #46 (CREATEDB), #47 (session env var), #48 (git status discipline), #49 (migration pre-flight) added. Entries #28 and #45 updated with Neon URL commented-out detail. All doc placeholders eradicated (ops-readiness, operations/next-session-prompt, STATE.md). 4 skills rebuilt and installed: conversation-defaults (Rule 5 added), findasale-dev (pre-push verification), findasale-ops (migration runbook clarified), dev-environment (pre-flight checklists). Root next-session-prompt.md stale duplicate deleted.
**Decisions:** Session env var check is now mandatory before any Prisma command (CORE.md + dev-environment skill). Sprint queue hold rule prevents Claude from announcing wrong "next sprint" mid-session.
**Next up:** Sprint 3.5 — code deGR-ification (~10 files, no schema changes, rename Grand Rapids references to generic location references). Then Sprint 4 (Search by Item Type), Sprint 5 (Seller Performance Dashboard).
**Blockers:** None — clean tree, all commits pushed, 63 migrations on Neon. Patrick's 5 manual beta items unchanged.

### 2026-03-07 (session 88 — Sprint 3 + workflow hardening + scope expansion)
**Worked on:**
- **Sprint 3 — Shopper Loyalty Program:** Full Architect → Dev → QA pipeline. Coupon model in schema.prisma, couponController.ts (new), routes/coupons.ts (new), stripeController.ts (coupon validation + idempotency fix + webhook), index.ts, CheckoutModal.tsx, purchases.tsx. 4 QA warnings found and fixed.
- **Workflow hardening:** CORE.md §16 added (Environment Command Hard Gate). 5 .skill packages created (dev-environment, findasale-architect, findasale-dev, findasale-deploy, findasale-marketing). Global CLAUDE.md reviewed by records + workflow — approved final version provided to Patrick.
- **Scope expansion:** FindA.Sale now officially supports yard sales, auctions, flea markets alongside estate sales. Grand Rapids is beta launch location only — no longer drives product scope. BUSINESS_PLAN.md (6 edits), STATE.md Constraints, roadmap.md (2 lines) all updated. Doc naming convention established: authority docs = ALL_CAPS.md, all others = kebab-case.md. Code deGR-ification queued as Sprint 3.5.
- **File naming convention locked:** Stale ROADMAP.MD reference in global CLAUDE.md corrected to roadmap.md. Top-level authority docs (CLAUDE.md, CORE.md, STATE.md, STACK.md, SECURITY.md) use ALL-CAPS; everything else lowercase kebab-case.
**Decisions:** Scope = estate sales, yard sales, auctions, flea markets nationwide. Grand Rapids = beta geography only. Category moat (multi-format) replaces geographic moat in business strategy.
**Next up:** Patrick: install 5 .skill packages, apply final global CLAUDE.md, run Coupon migration, commit/push Sprint 3. Then: Sprint 3.5 (code deGR-ification, ~10 files) → Sprint 4 (Search by Item Type) → Sprint 5 (Seller Performance Dashboard).
**Blockers:** Sprint 3 code not yet committed/pushed. Coupon migration not yet run. .skill packages not yet installed. Global CLAUDE.md not yet applied.

### 2026-03-07 (session 87 — Dockerfile restore + sprints 1+2 shipped)
**Worked on:**
- **Dockerfile.production restored:** `--frozen-lockfile` back in (MCP push, commit b82180d). Lockfile was already clean.
- **Sprint 1 — AI Sale Description Writer:** `generateSaleDescription()` + `isAnthropicAvailable()` added to cloudAIService.ts. `generateSaleDescriptionHandler` in saleController.ts (title required, max 300 chars, Anthropic guard → 503). `POST /api/sales/generate-description` route (before `/:id`). ✨ Generate button on create-sale.tsx + edit-sale/[id].tsx. QA patches: `isAnthropicAvailable()` separates Anthropic-only from Vision+Anthropic check. Commit 7b1b71d.
- **Sprint 2 — Social Post Generator wire-up:** Discovered feature was fully built but route never registered + component never used. Fixed: socialPostController.ts (prisma singleton, AuthRequest type, ANTHROPIC_MODEL env var, API key guard → 503). index.ts: registered `/api/social-post` route. dashboard.tsx: imported SocialPostGenerator, added 📣 Share button + modal. Commit 982dd6e.
- **Session wrap triggered early:** Cowork environment does NOT support custom subagent types (findasale-architect, findasale-dev, etc. all return "agent type not found"). Used general-purpose agents as workaround in previous context window — error discovered before further work.
**Decisions:** Phase 2 features 1+2 complete. Custom subagent skills (findasale-*) must be invoked via the `Skill` tool, NOT the `Agent` tool — they are skills, not agent types.
**Next up:** Phase 2 features 3–5: Shopper Loyalty Program → Search by Item Type → Seller Performance Dashboard. Use `Skill` tool to invoke findasale-architect, findasale-dev, findasale-qa in sequence. Schema: no Coupon model exists yet — migration needed for Loyalty Program.
**Blockers:** Patrick's 5 manual beta items unchanged. No code blockers.

### 2026-03-07 (session 86 — production outage recovery + workflow hardening)
**Worked on:**
- **Production outage recovered:** ERR_REQUIRE_ESM from `uuid@13.0.0` (CJS backend can't require ESM-only package). Fix: replaced with `crypto.randomUUID()` in wishlistController.ts + userController.ts, removed uuid from package.json.
- **Railway lockfile unblocked:** `ERR_PNPM_OUTDATED_LOCKFILE` after uuid removal. Escape hatch: changed Dockerfile.production to `--no-frozen-lockfile` via MCP (commit d77dcbd). Railway rebuilt successfully.
- **Schema drift fixed:** `Organizer.website` P2022 error — field in schema.prisma but no migration. Created `20260307000038_add_organizer_website` manually, applied to Neon (62 total migrations). Pushed via MCP.
- **Workflow audit:** 8 recoverable wasted turns (~30% of incident session) documented. Root causes: speculating on env vars before reading logs, asking Patrick for credentials that exist in .env.
- **5 self-healing entries added (#41–45):** ESM crash, lockfile sync, schema drift P2022, Railway webhook unstick, .env credential reading.
- **CORE.md + session-safeguards.md updated:** lockfile co-commit rule + "Production Startup Failures: ask for logs first" section.
**Decisions:** Never speculate on env vars or startup config — ask for logs first. Always read packages/backend/.env before asking Patrick for credentials. package.json changes always require pnpm-lock.yaml in same commit.
**Next up:** Restore `--frozen-lockfile` in Dockerfile.production (run `pnpm install`, commit clean lockfile, push). Patrick: rotate Neon credentials. Continue beta launch prep (Patrick's 5 manual items unchanged).
**Blockers:** Dockerfile.production still on --no-frozen-lockfile (temporary). Patrick's 5 manual beta items unchanged.

### 2026-03-06 (session 85 — comprehensive session: 4 security fixes, UX audit + 19 fixes, competitive analysis, SCORE business plan, feature R&D, docs restructure)
**Worked on:**
- **4 critical security fixes shipped:** (C1) JWT fallback secret removed + startup guard in index.ts, (C2) forgot-password rate limited (5/hr) via express-rate-limit, (C3) ai-feedback-stats protected with authenticate + requireAdmin, (C4) Stripe webhook rotation plan documented in OPS.md
- **Comprehensive UX audit:** 34 issues identified across organizer dashboard, item photos, checkout, email templates, map CORS, metrics display, loading states. 19 fixes shipped: dashboard sale links, item photo optimization (getOptimizedUrl), Firefox map CORS (crossOrigin:true), email preview links, checkout ToS enforcement, dashboard metrics display, loading state standardization across 6 pages
- **Competitive analysis:** 11+ platforms analyzed (AuctionZip, EstateBazaar, Facebook Marketplace, eBay, Craigslist, Heritage, Bonanza, Ruby Lane, 1stDibs, Invaluable, Catawiki), SCORE business plan created (claude_docs/strategy/BUSINESS_PLAN.md)
- **Feature research:** 7 ideas evaluated (AI sale description writer, branded social templates, Stripe Terminal POS, inventory video import, group buying pools, white-label MaaS, mobile app) — highest-ROI: AI description writer (80% infrastructure exists in cloudAIService.ts)
- **Documentation restructure:** claude_docs/ reorganized into strategy/, operations/, logs/, archive/ subfolders. 28 junk files deleted. STACK.md Docker reference fixed. .gitignore updated for *.skill files
- **Competitive actions shipped:** support@finda.sale prominent in footer/404/contact. Route optimization on sale+search pages. Pricing transparency in checkout
**Decisions:** Beta status upgraded from CONDITIONAL GO to GO — all 4 code criticals resolved. Docs reorganized by tier and purpose. AI sale description writer + branded social templates identified as next sprint work.
**Next up:** Patrick's 5 manual blocking items: confirm 5%/7% fee, Stripe business account, Search Console verification, business cards, beta organizer outreach, Neon credential rotation. Then: AI sale description writer feature (findasale-dev, 1-2 sprints).
**Blockers:** Patrick's manual items only. No code blockers.

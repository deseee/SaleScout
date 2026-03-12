# Session Log — FindA.Sale

Cross-session memory for Claude. Updated at every session end.
Read this at session start to understand recent context without loading extra files.
Keep only the 5 most recent sessions. Delete older entries — git history and STATE.md are the durable record.

**Entry template (all fields required):**
- **Worked on:** (what was done)
- **Decisions:** (choices made)
- **Token efficiency:** (tasks completed ÷ estimated effort — e.g., "10 doc edits, no subagents, low token burn" or "3 features, 2 subagent calls, medium burn" — qualitative until measurement tooling exists)
- **Token burn:** (~Xk tokens used, Y checkpoints logged — see CORE.md §3 for format)
- **Next up:** (what comes next)
- **Blockers:** (what's stuck)

---

## Recent Sessions

## Session 152 — 2026-03-12 — POS v2 Post-Go-Live Fixes

**Worked on:** Four targeted fixes to the Stripe Terminal POS after go-live testing revealed issues: (1) **Duplicate itemId guard** — both `createTerminalPaymentIntent` and `cashPayment` now reject duplicate itemIds (each physical item can only be charged once per transaction). (2) **Error messages humanized** — `terminalController.ts` was surfacing raw DB UUIDs in error strings. Fixed to use `item.title` in both payment flows; required adding `title: true` to the cashPayment `dbItems` select since it previously only fetched `id` and `status`. (3) **POS item search fixed** — `getItemsBySaleId` was ignoring all query params except `saleId`. The frontend was already sending the correct `?q=...&status=AVAILABLE&limit=10` — the backend simply discarded them. Fixed with Prisma `contains` + `insensitive` for title/SKU search, status filter, limit cap, and added `sku: true` to select. (4) **Inline cash numpad** — replaced the cash received button (which opened the shared global numpad at top of page) with an always-visible inline 3×4 numpad inside the cash payment card. Independent `cashNumpadValue` state syncs to `cashReceived` via useEffect. Real-time change/short display. Global numpad simplified to price-only.
**Decisions:** Cash numpad is fully independent from the price numpad — separate state, no mode switching needed. Search bug was entirely backend-side; no frontend changes required. Error humanization required touching both card and cash flows separately since each had its own dbItems select shape.
**Token efficiency:** All inline work — no subagent dispatches for code. Session wrap via findasale-records. Low burn.
**Token burn:** ~35k tokens (est.), 0 checkpoints.
**Next up:** Cash collection mechanism decision — how does FindA.Sale collect 10% platform fee on cash sales? Card sales auto-collected via Stripe Connect; cash sales have no fee collection path today. Needs findasale-investor + advisory board analysis before implementing.
**Blockers:** Business decision on cash fee collection outstanding. Neon migration `20260312000002_add_purchase_pos_fields` still pending deploy.

---

## Sessions 147–148 — 2026-03-12 — Rapidfire P1 Fixes + Phase 5 Wiring

**Worked on:** Diagnosed and fixed two bugs in the Rapidfire camera UI that caused "+" buttons and photo-count badges to be invisible on mobile. Bug 1: Outer thumbnail wrapper in `RapidCarousel.tsx` was a `<button>` — browsers eject inner `<button>` elements during HTML parsing (invalid HTML per spec), destroying absolute positioning context. Fix: changed to `<div>`, all touch/mouse handlers preserved. Bug 2: `add-items/[saleId].tsx` had Phase 5 (add-photo-to-item) wired as a stub — `onAddPhotoToItem={() => {}}` was a no-op, `addingToItemId` hardcoded to `null`. Fix: added state, full toggle logic, and Phase 5 append pipeline using `/upload/sale-photos` → `POST /items/:id/photos` (endpoint already existed as `addItemPhoto` controller). Skip optimistic temp entry in append-mode to prevent flicker. Also diagnosed Railway vs Vercel platform confusion — Railway is backend-only and correctly did not redeploy. Vercel appears to have a broken GitHub App integration (deployment predates latest commits).
**Decisions:** Outer carousel wrapper must be `<div>`, not `<button>` — always check for nested button HTML invalidity when inner buttons don't render. Phase 5 append pipeline uses existing backend endpoint, no backend changes needed. Vercel + Railway use GitHub App integration (under Settings → Applications), not traditional webhooks.
**Token efficiency:** One subagent dispatch (findasale-records for session wrap). File reads + targeted fixes. Low-medium burn.
**Token burn:** ~40k tokens (est.), 0 checkpoints.
**Next up:** Verify Vercel GitHub App reconnect → confirm "+" buttons live on Patrick's phone. Verify migration `20260311000003_add_camera_workflow_v2_fields` deployed to Neon. Fix P0 QA bug in `review.tsx` (draftStatus filter using wrong endpoint).
**Blockers:** Vercel not auto-deploying — GitHub App integration appears disconnected. Migration `20260311000003` deploy status unknown.

---

## Session 141 — 2026-03-11 — Fleet Redesign Proposal v1

**Worked on:** Comprehensive fleet redesign planning session. Drafted, reviewed (2 rounds), and finalized `fleet-redesign-proposal-v1.md` with 22 approved decisions. Round 1 reviewers: architect, qa, hacker, pitchman, power-user, workflow. Round 2 reviewers: architect, hacker, pitchman, power-user. Two open questions resolved mid-session (token budget learning, DA trigger scope).
**Decisions:** Merge CX+Support → Customer Champion. Merge R&D+Pitchman → Innovation. New agents: sales-ops, devils-advocate, steelman, investor, competitor. Board restructured to 12 seats + 6 subcommittees. Escalation channel with guardrails. Handoff protocol with integrity metadata. Red-flag veto gate. Async voting. Trial/rollback protocol. Cross-agent feedback loops. Daily friction audit. Budget-first sessions with outcome-bucketed learning. decisions-log.md. DA/Steelman scoped to direction-only with preflight checklist. Phased rollout approved.
**Token efficiency:** Planning-only session. 10 subagent dispatches across 2 review rounds. No code changes. Medium-high burn for high strategic output.
**Token burn:** ~120k tokens (est.), 0 checkpoints.
**Next up:** Phase 1 rollout — 6 parallel dispatches (2 merges, escalation channel, handoff protocol, veto gate, decisions-log). QA verification. Then Phase 2.
**Blockers:** Patrick git push needed for proposal + session docs. Neon migration still pending. Beta-blocking items unchanged.

---

## Session 138 — 2026-03-11 — Plugin Skill Fleet Audit & Routing Update

**Cowork Power User audit complete.** All 15 findasale-* SKILL.md files updated with Plugin Skill Delegation sections. Two stale data bugs fixed (5%/7% fee → 10% flat in architect + qa; Docker reference removed from architect). plugin-skill-routing.md created at claude_docs/operations/.

**Advisory board** approved for forward strategic lens: added product-management:roadmap-management and data:create-viz.

**Main session** routing documented: plugin-skill-routing.md is now the routing reference for when to use findasale-* vs. plugin skills directly.

**Deferred for planning session:** findasale-sales-ops agent (organizer outreach, pipeline review, trial-to-insight). Proposed stack: sales:call-prep, sales:pipeline-review, sales:daily-briefing, sales:account-research, customer-support:customer-research, data:explore-data. Patrick to evaluate post-beta.

**Files changed:**
- /mnt/.skills/skills/findasale-*/SKILL.md (all 15 — delegation sections added)
- claude_docs/operations/plugin-skill-routing.md (created)
- claude_docs/logs/session-log.md (this entry)

---

### 2026-03-10 (sessions 121–123 — Friction Items 7+13 + AI Upload Pipeline)
**Worked on:** (Session 121) Friction items 7 (bulk edit) + 13 (neighborhood autocomplete): backend `/bulk` endpoint extended for isActive/price ops, `add-items/[saleId].tsx` bulk UI (Select All, per-item checkboxes, amber highlight, Hide/Price toolbar), `create-sale.tsx` + `edit-sale/[id].tsx` neighborhood input+datalist. New schema field `isActive Boolean @default(true)` + migration `20260309000003_add_item_is_active`. Build fixes: template literal + Set spread errors, dashboard.tsx newline corruption (literal `\n` sequences). (Session 122) AI tagging architecture review documented (`claude_docs/feature-notes/ai-tagging-architecture.md`). Webcam capture added to add-items page (MediaDevices API, canvas JPEG, rapid-batch upload). Public item listing now filters `isActive=true` across all search paths (FTS, ILIKE, filtered, counts, getItemById, getItemsBySaleId). Upload pipeline P0/P1 fixes: Cloudinary URL validation, Haiku timeout/parse/rate-limit error capture, `isAiTagged` only set on AI success, feedback endpoint wired (CB4), retry button for failed analysis. **Overwrite incident:** dev agent replaced `itemController.ts` with stub (build broken) — restored via commit `7f6f2ebd`. (Session 123) Two follow-on fixes: `SmartInventoryUpload` isAiTagged Boolean() cast, `embedding: []` added to `createItem` (fixes P2011 null constraint on `Float[]` field).
**Decisions:** `isActive` added to Item schema to support hide/show without deletion. Webcam capture uses canvas JPEG compression before Cloudinary upload. Haiku error types distinguished (timeout vs parse vs rate-limit) for better retry UX. `embedding: []` is the correct default — `scheduleItemEmbedding` fills async after record creation.
**Token efficiency:** Sessions 121–123 used parallel agents. Overwrite incident in session 122 required restore + hotfix cycle. Session wrap docs not pushed — records gap for sessions 121–123.
**Token burn:** ~60k (121) + ~90k (122) + ~20k (123) est. Session wrap logs missing from GitHub.
**Next up:** Session 124 — Chrome audit of AI tagging + add-item flow (continuation). Deploy `20260309000003_add_item_is_active` migration to Neon. Session wrap docs push (STATE.md, session-log.md, next-session-prompt.md for sessions 121–123).
**Blockers:** Neon migration `20260309000003_add_item_is_active` not deployed. Session 122–123 wrap docs not pushed to GitHub.

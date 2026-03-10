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

### 2026-03-09 (session 118 — Context Loss Audit + 5-Fix Implementation)
**Worked on:** Full context-loss audit triggered by Patrick after observing checkpoint inconsistency. (1) 6-agent parallel audit (architect, dev, qa, cowork-power-user, pitchman, workflow) — each wrote independent findings to `claude_docs/operations/context-audit/`. (2) Advisory board synthesized all findings → `claude_docs/operations/context-audit/advisory-board-final.md`. (3) 5 fixes implemented and MCP-pushed (commit 68b25b64): `.checkpoint-manifest.json` NEW at repo root (persistent JSON token state store — survives compressions + session transitions); CORE.md §3 updated (compression events write to manifest IMMEDIATELY, pre-dispatch checkpoint rule, manifest init step); `conversation-defaults` v3 (Rule 3 merged to single unified path — no more branching, Rule 10 manifest reads/writes, Rule 11 pre-dispatch budget gate); `next-session-prompt.md` hard-gate checklist added at top.
**Decisions:** File-based manifest over Anthropic Memory Tool (Windows injection bug #29022 + 200-line limit). Two-branch Rule 3 eliminated — single path for all first messages regardless of type. Pre-dispatch checkpoint now required before 3+ agent batches. Compression events write to manifest immediately (not deferred to wrap). Advisory board dissent noted: adoption requires both persistence AND culture change (enforcement is equally critical to the JSON fix).
**Token efficiency:** Heavy session — 7 subagent dispatches, parallel batch. High output for token spend. Core problem diagnosed and fixed in a single session.
**Token burn:** ~110k tokens (est.), 0 formal checkpoints logged (fix implemented mid-session — manifest wasn't live yet). Session 119 will be first to use manifest properly.
**Next up:** Session 119 — records audit of sessions 108–116 (Patrick's original P1 request, deferred this session). After audit: earningsPdfController fee fix, Feature #10 Serendipity Search, VAPID confirm.
**Blockers:** Patrick must reinstall `conversation-defaults` skill (v3 — source pushed but installed is read-only). Session 117 wrap docs still pending Patrick push. 3 Neon migrations still pending.

### 2026-03-09 (session 117 — Feature #11 + Vercel Build Fix)
**Worked on:** (1) Feature #11 (Organizer Referral Reciprocal): Pushed 3 files that had been completed in the prior session but not pushed before context exhausted. `stripeController.ts` — fee bypass: `hasReferralDiscount = referralDiscountExpiry != null && discountExpiry > new Date()` → 0% fee when active. `routes/organizers.ts` — `GET /organizers/me` exposes `referralDiscountActive` (bool) + `referralDiscountExpiry` (ISO string). `payouts.tsx` — green banner when referralDiscountActive, shows expiry date. MCP batch commit 3243091. Migration `20260312000001_add_organizer_referral_discount` created; Patrick must deploy. (2) Vercel build fix: `pages/items/[id].tsx` line 93 — `Property 'triggerToast' does not exist on type 'ToastContextType'`. Renamed `triggerToast` → `showToast` in 6 places (1 destructure + 5 call sites). MCP commit 949d743. Vercel build now passes.
**Decisions:** Feature #11 design uses DB-level expiry date (not a boolean flag) — makes it easy to let discounts expire naturally without a manual toggle. Referral discount UI is in the payouts page (where fee context is obvious) rather than the dashboard.
**Token efficiency:** Push-continuation + 1 targeted type fix. Low token burn. No subagents. 2 MCP commits. No repair loops.
**Token burn:** ~30k tokens (est.), 0 checkpoints (short session, resumed from context summary).
**Next up:** Session 118 — records audit of sessions 108–116 (Patrick requested "audit the previous 9"). After audit: earningsPdfController fee fix (5%/7% → 10% flat), Feature #10 Serendipity Search, VAPID confirm, A3.6 if Patrick provides logs.
**Blockers:** 3 Neon migrations pending Patrick deploy. A3.6 still needs Railway production logs. Stripe business account + Google Search Console still Patrick actions.

### 2026-03-09 (session 116 — Token Tracking + Features #4/#12/#9)
**Worked on:** (1) Token tracking (P1): CORE.md §3 updated with checkpoint format (`[CHECKPOINT — Turn N] Files: X (Yk) | Tools: Z (Wk) | Session: ~Vk / 200k (P%)`); `operations/token-checkpoint-guide.md` created; conversation-defaults skill v3 packaged (Rule 9: token budget briefing at every session start). (2) Feature #4 Search by Item Type: `packages/frontend/pages/categories/index.tsx` NEW — /categories landing page, category grid sorted by item count, emoji icons, links to existing `[category].tsx` (Phase 29). MCP commit f60066651e. (3) Feature #12 SEO Description Optimization: `cloudAIService.ts` Haiku prompt overhauled in `getHaikuAnalysis()` — titles now "[Type], [Material/Era], [Maker]" format with examples; tags bumped to 5–8 terms biased toward material/era/maker/brand keywords buyers use on Google/eBay. MCP commit b39999145d. (4) Feature #9 Payout Transparency Dashboard: `payoutController.ts` — added `getEarningsBreakdown` handler (`GET /api/stripe/earnings`), returns last 100 PAID purchases with item-level fee math (10% platform fee + est. 2.9%+$0.30 Stripe fee + net payout), totals summary, optional `?saleId` filter. `routes/stripe.ts` — registered route. `payouts.tsx` — added Earnings Breakdown section: 4-number summary grid + responsive item table + PDF download link. MCP commit 7aed203f.
**Decisions:** Feature #4: only `index.tsx` was missing — `[category].tsx` was Phase 29 work and already fully functional. No Architect needed (no schema changes, no new endpoints). Feature #9: Stripe fees estimated at 2.9%+$0.30 (labeled "est."), not pulled from Stripe API — acceptable for MVP transparency. `earningsPdfController.ts` footer still says "5%/7%" (stale) — flagged for next sprint fix.
**Token efficiency:** No subagents used — all 3 features implemented directly. ~12 file reads, 3 MCP commits. Medium token burn. No repair loops.
**Token burn:** ~80k tokens used (est.), 0 checkpoints logged (compression event mid-session, resumed from summary).
**Next up:** Feature #10 (Serendipity Search). Fix stale "5%/7%" in earningsPdfController.ts footer. A3.6 if Patrick provides Railway logs.
**Blockers:** A3.6 still waiting on Railway production logs from Patrick. Neon migrations (2 pending from Session 115) still need Patrick to run `prisma migrate deploy`.

### 2026-03-09 (session 115 — P0 Security + Payment Fixes + Token Research)
**Worked on:** (1) P0 Security (parallel agent): OAuth account-takeover fixed — removed email-based auto-link, returns 400 if email already exists as local account. redirect_uri allowlist added (FRONTEND_URL prefix check, validates `returnTo` param). tokenVersion session invalidation — added `tokenVersion Int @default(0)` to User schema, JWT payload includes tokenVersion, authenticate middleware rejects old tokens after password change, `/change-password` route increments tokenVersion. (2) P0 Payment (parallel agent): `charge.dispute.created` webhook handler added — finds Purchase by charge, sets status to DISPUTED. Webhook idempotency — ProcessedWebhookEvent model + dedup check at handler start. Negative price guards in itemController createItem + updateItem (price ≥ 0 validation). Buyer-own-item guard in createPaymentIntent — `item.sale.organizer.userId === req.user.id` returns 400. (3) Token tracking research: `claude_docs/operations/token-tracking-feasibility.md` — IMPLEMENT YES. Hybrid approach: budget briefing at session start + checkpoint logging at natural pauses + turn-by-turn self-estimates. (4) Migration naming fix: security agent reused `20260309000001` (conflict with add_item_is_ai_tagged). Created correct `20260309000002_add_token_version` and `20260309200001_add_processed_webhook_event` replacements.
**Decisions:** No auto-link for OAuth accounts (security over UX). tokenVersion approach over timestamp approach (simpler, no race conditions). ProcessedWebhookEvent as separate model from existing StripeEvent (more explicit fields). Token tracking recommended to implement — low cost (30 tokens/session), high ROI (avoids 20% token loss from surprise compressions).
**Token efficiency:** 3 parallel subagent dispatches, ~10 file reads + verification. High-output security session. No repair loops.
**Next up:** Deploy 2 new migrations. Delete conflicting old migration dirs. Implement token tracking (CORE.md + conversation-defaults). A3.6 (Railway logs from Patrick). Continue roadmap backlog (D4/D5/H2).
**Blockers:** A3.6 still blocked on Railway production logs. 2 old misnamed migration dirs need deletion (20260309000001_add_token_version, 20260309_p0_payment_edge_cases).

### 2026-03-09 (session 114 — D3/B2/H1 + Agent Fleet)
**Worked on:** (1) Track 3: STATE.md stale entries pruned (CA4/CA6/favicon blocks), roadmap.md → v21 (4 checklist items marked complete, migration count 63→66, Sync Points table updated). (2) D3 Map Route Planning: `routeController.ts` (OSRM POST handler, 2–5 sales, lng,lat coord order, graceful fallback), `routes/routes.ts`, `routeApi.ts` frontend lib, `RouteBuilder.tsx` collapsible component, wired into `map.tsx`. (3) B2 AI Tagging Disclosure: `items/[id].tsx` minimal inline copy, `organizer/add-items/[saleId].tsx` first-use banner, `organizer/settings.tsx` AI Assistance section — schema/migration already deployed. (4) H1 Compact Mobile Header: search bar py-2→py-1.5, main content pt-[100px]→pt-[92px]. (5) Agent fleet (6 parallel `general-purpose` workers): OAuth red-team report (2 P0: account takeover via email-linking, missing redirect_uri validation; 1 P1: no session invalidation), Payment QA (4 P0 blockers: chargebacks unhandled, webhook retry exhaustion, negative prices, buyer-own-item purchase), Migration rollback plan (last 4 migrations with SQL), Support KB (10 FAQs — fee corrected to 10% flat on wrap), RECOVERY.md decision trees, Spring 2026 marketing content. (6) Session wrap: support-kb.md fee corrected from 5%/7% to 10% flat.
**Decisions:** OSRM public API for route planning (no API key needed for MVP). RouteBuilder max 5 selections, min 2. B2 disclosure uses minimal warm copy (not blue alert box). `general-purpose` subagent type confirmed working; `findasale-dev` as subagent type does NOT work; worktree isolation not available in this environment.
**Token efficiency:** 6 parallel subagent dispatches, ~12 file reads, 3 MCP commit batches. High-output session — 3 features shipped + full fleet. No repair loops.
**Next up:** P0 security fixes (OAuth account-takeover path, redirect_uri allowlist, chargeback webhook handler, buyer-own-item guard). A3.6 (Railway logs from Patrick). VAPID keys confirm in prod. Consider D4/D5 from roadmap.
**Blockers:** A3.6 still blocked — needs Railway production logs. P0 OAuth fixes require dev work (schedule next session).

*(session 113 archived — see git history)*



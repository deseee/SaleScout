# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

**Session 168 COMPLETE (2026-03-15) — SPRINT 2 IMPLEMENTED + PUSHED:**
- **Sprint 2 shipped:** Cloudinary watermark utility, export controller (3 formats), promote.tsx UI — all on GitHub main.
- **Files on remote (MCP-pushed):** `cloudinaryWatermark.ts`, `exportController.ts`, `export.ts` (routes), `[saleId].tsx` (promote page)
- **Files on remote (Patrick PS1):** `packages/backend/src/index.ts` (export route registration), context docs
- **Production:** Railway + Vercel should auto-deploy. Verify next session.
- **CORE.md:** v4.1 with MCP truncation gate, full-file rule, complete push blocks, conflict re-staging
- **Sprint 2 QA:** Not yet run. Next session should dispatch findasale-qa.
- **Last Updated:** 2026-03-15 (session 168)

**NEXT SESSION: Strategic Audit + Workflow Overhaul (see next-session-prompt.md)**
- Full multi-agent audit of sessions 164–168
- Workflow friction analysis + CLAUDE.md improvements
- Tool ecosystem research (Ollama, autoresearch, Claude Code Playground)
- Manager subagent pattern design
- Communications/interaction quality assessment

---

**Session 167 COMPLETE (2026-03-15) — PRODUCTION UNBLOCK + CORE.MD v4.1:**
- **Production:** Railway back online (Dockerfile.production pushed; commit bc38ade). Vercel confirmed healthy. Neon at 82 migrations (20260315000001 + 20260315000002 both applied).
- **Diagnosis & Repair:** MCP schema.prisma truncation in S166 confirmed — itemController.ts also truncated (only getDraftItemsBySaleId remained). Full 939-line itemController restored (all 13 exports) and pushed (commit 1409a51).
- **CORE.md v4.1 locked:** 4 new MCP push rules added: full-file read-before-push, truncation gate (size-comparison check), complete push instruction blocks, merge conflict re-staging. Pushed commits 5b1d88d + 1f22506.
- **Production Status:** ✓ Railway green | ✓ Vercel green | ✓ Neon 82/82 migrations applied | ✓ Schema complete + pushed
- **Sprint 2 starting:** Cloudinary watermark, exportController.ts, promote.tsx. No schema changes.
- **Last Updated:** 2026-03-15 (session 167)

---

**Session 165 COMPLETE (2026-03-15) — #36 WEEKLY TREASURE DIGEST: SHIPPED:**
- **Activated existing weeklyEmailJob cron** (Sundays 6pm) — built but never wired. Personalized picks based on purchase/favorite history. 8 items per user, category-matched from upcoming PUBLISHED sales within 14 days.
- **Email delivery:** Resend integration active. Dynamic subject ("8 Estate Sale Finds This Week (New Arrivals)"), category badges (warm yellow), larger fonts for older audience (15px body, 18px prices), relative date labels ("Tomorrow", "In 2 days"), preference management footer (Manage frequency / Update interests / Unsubscribe).
- **MailerLite integration:** New Shoppers group created (ID: 182012431062533831). New shoppers auto-enrolled on registration via `addShopperSubscriber()` in authController.ts (both email + OAuth paths). Fire-and-forget, non-blocking.
- **Files changed:** `packages/backend/src/index.ts`, `packages/backend/src/controllers/authController.ts`, `packages/backend/src/services/mailerliteService.ts`, `packages/backend/src/services/weeklyEmailService.ts`, `CLAUDE.md` (§6 no-pause checkpoint rule).
- **MCP pushes:** 2 total (18e7178 + fc2cdd2). All changes on GitHub main.
- **Last Updated:** 2026-03-15 (session 165)

---

**Session 164 COMPLETE (2026-03-14) — #24 HOLDS-ONLY ITEM VIEW: FULL BUILD + SHIP:**
- **Full Architect→Dev→QA pipeline completed** for #24 Holds-Only Item View.
- **Schema:** Added `holdDurationHours Int @default(48)` to Sale model. Migration `20260315000000_add_hold_duration_to_sale` applied to Neon (migration 78).
- **Backend:** Upgraded `reservationController.ts` — dynamic hold duration from sale config (was hardcoded 24h), sale filter + sort params on organizer holds endpoint, new `getOrganizerHoldCount` lightweight count endpoint, new `batchUpdateHolds` (release/extend/markSold) with 50-item cap + ownership validation.
- **Frontend:** Full rewrite of `holds.tsx` — sale filter dropdown, sort toggle (Expiring Soon / Recently Added), grouped-by-buyer accordion, batch action bar (Release/Extend/Mark Sold) with checkbox selection, item photos + prices + HoldTimer countdown. Dashboard badge wired via `/reservations/organizer/count`.
- **QA passed:** Batch size limit added (50 max), `as any` casts acceptable, pre-existing ownership gap in updateHold noted (not introduced by #24).
- **3 MCP pushes completed:** Push 1 (759eec1b) migration+routes+controller, Push 2 (91252745) holds.tsx+dashboard.tsx, Push 3 (44782d4c) schema.prisma.
- **Files changed:** `packages/frontend/next.config.js`, `packages/frontend/components/ItemOGMeta.tsx`, `packages/frontend/pages/_document.tsx`, `packages/frontend/pages/items/[id].tsx`
- **All changes on GitHub main** (commits 4d06379, 64058eb, 698b4ed, 4d50c15). Vercel auto-deployed.
- **Last Updated:** 2026-03-14 (session 163)

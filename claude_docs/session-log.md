# Session Log — FindA.Sale

Cross-session memory for Claude. Updated at every session end.
Read this at session start to understand recent context without loading extra files.
Keep only the 5 most recent sessions. Delete older entries — git history and STATE.md are the durable record.

---

## Recent Sessions

### 2026-03-05 (session 61 — Sentry live, git crisis resolved, doc audit)
**Worked on:** Completed Sentry deployment: committed updated `pnpm-lock.yaml` (Vercel was failing with frozen lockfile error), fixed Vercel deploy. Resolved multi-session git crisis: `.gitattributes` CRLF rule caused perpetual dirty `roadmap.md`/`ROADMAP.md` (case-sensitivity duplicate index entries on Windows) — resolved via `git reset --hard origin/main`. Restored local `roadmap.md` to v9 (was at v3 — severely stale). Updated STATE.md Sentry entry to "fully deployed". Added self-healing entries 30 (`.gitattributes` CRLF perpetual dirty), 31 (case-sensitivity duplicate index), 32 (pnpm frozen lockfile mismatch). Updated entry 29 with nuclear reset fix.
**Decisions:** `git reset --hard origin/main` is the canonical nuclear fix for any git state that survives stash/restore loops 3+ times. Never attempt case-only renames on Windows. Always commit `pnpm-lock.yaml` after Claude adds packages.
**Next up:** Sprint T — Production Hardening. Session-start self-healing diagnostic first.
**Blockers:** Phase 31 OAuth env vars still needed in Vercel. Sentry test endpoint should be added and removed to verify end-to-end capture.

### 2026-03-05 (session 59 — claude_docs audit + anti-bloat system)
**Worked on:** Full claude_docs audit. Cleaned STACK.md (Cloudinary locked, Vercel/Railway/Neon infra confirmed), DEVELOPMENT.md (removed stale Gradio section), OPS.md (rewrote to 4-line pointer). Archived 3 one-time audit files to `claude_docs/archive/`. Added CORE.md §14 (Tier 1/2/3 doc classification + anti-bloat rules) and §2 step 6 (GitHub sync check). Updated context-maintenance skill with Step 0 (Archive Check). Added self_healing entry #29 (git local/GitHub drift — MCP push + CRLF = perpetual dirty ROADMAP.md). Diagnosed `reservationExpiryJob` TypeError (Prisma client stale, needs Docker rebuild). Diagnosed `next-auth/react` missing (needs `pnpm install` + frontend `--no-cache` rebuild).
**Decisions:** Tier 1/2/3 doc classification locked in CORE.md §14. Archive trigger now enforced at every session wrap via context-maintenance Step 0. Git drift is structurally certain to recur — self-healing entry #29 is the canonical fix.
**Next up:** Patrick must run git fix commands, then Docker rebuilds (backend for Prisma, frontend for next-auth), then Sprint T begins.
**Blockers:** Local git CRLF drift (ROADMAP.md perpetually dirty) — run `git stash; git pull --rebase; git stash pop; git push`. `reservationExpiryJob` TypeError — run `docker-compose up --build -d backend`. `next-auth` missing — run `pnpm install` then `docker compose build --no-cache frontend && docker compose up -d`.

### 2026-03-05 (session 58 — Sprint S complete + post-launch reorganization)
**Worked on:** Pushed Phase 16 (advanced photo pipeline) to GitHub — 5 files: `itemController.ts` (addItemPhoto/removeItemPhoto/reorderItemPhotos), `items.ts` (3 new routes), `ItemPhotoManager.tsx` (new component), `edit-item/[id].tsx`, `add-items/[saleId].tsx`. Fixed Railway production error: `ItemReservation` table missing from Neon — ran `prisma migrate deploy` to apply 4 pending migrations (Phases 19, 22, 20, 21). Railway redeployed clean. Diagnosed homepage console log — all CSP errors from Yoroi browser extension, not the app. Reorganized all project docs: roadmap v9 with post-launch Sprint Track T–X, STATE.md trimmed to post-launch structure, self-healing entry #28 (pre-fill Neon URLs from .env).
**Decisions:** Sprint Track T–X consolidates all deferred features, nice-to-haves, and infrastructure items into buildable sprints. Human-only items (beta onboarding, revenue goals, multi-metro) excluded. Uptime monitoring + Sentry blocked on Patrick creating external accounts. Polling for auctions stays until Sprint V.
**Next up:** Sprint T — Production Hardening: stress test suite, pre-commit validation, favorites categories, virtual line SMS E2E.
**Blockers:** Phase 31 OAuth env vars still needed in Vercel. Uptime/Sentry accounts needed before those items can start.

### 2026-03-05 (session 57 — Sprints O–R: Hold UI + Referral + Curator Email + CSV Export)
**Worked on:** Sprint O (Phase 21): `dashboard.tsx` with Manage Holds button. Sprint P (Phase 23): `referralController.ts` + `/api/referrals/dashboard` + `refer/[code].tsx` + fixed `referral-dashboard.tsx`. Sprint Q (Phase 30): `curatorEmailJob.ts` (Monday 8AM cron, HTML digest). Sprint R (Phase 32): `GET /organizers/me/export/items/:saleId` + Export CSV button.
**Decisions:** Phase 32 export route before `/:id` wildcard to avoid routing collision. Authenticated blob download for CSV (no `Authorization` in `<a download>`).
**Next up:** Sprint S — Phase 16.
**Blockers:** Phase 31 OAuth env vars still needed. Phase 21/23 Neon migrations needed.

### 2026-03-05 (session 56 — Sprint M + N: Reviews system + Shopper messaging)
**Worked on:** Sprint M (Phase 15): `reviewController.ts` + `/api/reviews` + `StarRating.tsx` + `ReviewsSection.tsx` + 5pt award. Sprint N (Phase 20): `Conversation` + `Message` models + migration + `messageController.ts` (5 endpoints) + messages inbox + thread + new conversation + unread badge in BottomTabNav + Message organizer button.
**Decisions:** Conversation `@@unique([shopperUserId, organizerId, saleId])`. `/unread-count` before `/:conversationId` in Express. `prisma.$transaction` for atomic reply + `lastMessageAt`.
**Next up:** Sprint O — Phase 21.
**Blockers:** Phase 20 migration needs `prisma migrate deploy` on Neon.


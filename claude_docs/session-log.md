# Session Log — FindA.Sale

Cross-session memory for Claude. Updated at every session end.
Read this at session start to understand recent context without loading extra files.
Keep only the 5 most recent sessions. Delete older entries — git history and STATE.md are the durable record.

---

## Recent Sessions

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

### 2026-03-05 (session 54 — Production stabilisation: CORS, NextAuth, Railway 502, seed)
**Worked on:** Fixed CORS (`finda.sale` missing from `ALLOWED_ORIGINS`). Fixed NextAuth 500 (`NEXTAUTH_SECRET` + `NEXTAUTH_URL` missing). Fixed Railway 502 (PORT mismatch, set `PORT=5000` in Variables). Created missing Phase 22 migration `20260305000001_phase22_reputation_tier`. Seeded Neon. Set up `.githooks/pre-push` TS check.
**Decisions:** `PORT=5000` locked in Railway Variables permanently.
**Next up:** Sprint M — Phase 15.
**Blockers:** Phase 31 OAuth env vars still needed.

### 2026-03-05 (session 53 — Sprints I–L: Hunt Pass, Creator Tier, Onboarding, Search)
**Worked on:** Sprint I (Phase 19): points system. Sprint J (Phase 22): reputation tier + cron. Sprint K (Phase 27): onboarding modal + empty states. Sprint L (Phase 29): /api/search + /search page + /categories/[category] + fixed CORS regex double-escape bug.
**Decisions:** Points toast at `bottom-20`. `TierBadge` returns null for NEW tier. `OnboardingModal` excluded for ORGANIZER/ADMIN.
**Next up:** Sprint M — Phase 15.
**Blockers:** Phase 19 Neon migration pending.

# Next Session Resume Prompt
*Written: 2026-03-05T00:00:00Z*
*Session ended: normally*

## Resume From

Start Sprint M — Phase 15 (Review + rating system UI). Full spec below.

**Critical blocker first:** Run the Phase 19 Neon migration before testing anything points-related. The `PointsTransaction` table does not exist yet — the points system will throw DB errors until it's applied. Migration name: `phase19_points_transaction`. Requires local env with `DIRECT_URL`.

## What Was In Progress

Nothing — session ended cleanly. Sprints I–L all complete and pushed.

## What Was Completed This Session

- **Sprint I — Phase 19** — Hunt Pass + shopper points: `PointsTransaction` schema, `pointsService.ts`, `/api/points` routes (GET + track-visit idempotent), `PointsBadge.tsx`, `usePoints` hook, profile tier display (Scout 0–99 / Hunter 100–499 / Estate Pro 500+), BottomTabNav badge, visit tracking + amber toast in `sales/[id].tsx`. Commits 723bafe, 114f55c (partial), 89b732f.
- **Sprint J — Phase 22** — Creator Tier Program: `reputationJob.ts` (weekly cron `0 2 * * 1`, `NEW`/`TRUSTED`/`ESTATE_CURATOR`), `TierBadge.tsx` (compact inline badge, no badge for NEW), `GET /api/organizers/me` (progress message), `reputationTier` added to `listSales` response, `SaleCard` TierBadge, organizer dashboard tier card + benefits checklist. Commits 723bafe, 114f55c.
- **Sprint K — Phase 27** — Onboarding + Empty States + Microinteractions: `OnboardingModal.tsx` (3-step, push permission request, localStorage `findasale_onboarded` gate, excluded for ORGANIZER/ADMIN), `_app.tsx` OnboardingShower, `ToastContext` points type (amber `bg-amber-500`, `bottom-20 right-4`), shopper dashboard empty states (purchases, favorites, subscribed). Commit 89b732f.
- **Sprint L — Phase 29** — Discovery + Search: `packages/backend/src/routes/search.ts` (`GET /` unified full-text, `GET /categories/:category`), `/search` page (TanStack Query, tabs all/sales/items, category chips), `/categories/[category]` page (10 categories, item grid, empty state), wired `app.use('/api/search', searchRoutes)` in `index.ts`, fixed CORS regex bug. Commits 89b732f, 991cb40.

## Environment Notes

- **Neon migration REQUIRED before testing points** — `PointsTransaction` table missing. Run `prisma migrate deploy` locally with migration `phase19_points_transaction`.
- **Vercel redeploy still pending** — rate-limited. Frontend may still point at old backend URL.
- **Phase 31 OAuth dormant** — add to Vercel: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_CLIENT_ID/SECRET` + redirect URIs in Google Console + Meta Dev Portal.
- Railway backend: healthy. GitHub MCP active — push via `mcp__github__push_files`.

---

## Sprint M — Phase 15: Review + Rating System UI

### What already exists

- `Review` model in `schema.prisma`: `id`, `userId`, `saleId`, `rating` (Int), `comment` (String?), `createdAt`
- `Organizer.avgRating` + `Organizer.reviewCount` fields exist and are exposed in `GET /api/organizers/:id`
- Phase 17 reputation job references `prisma.review.findMany` — confirms the table is live

### What to build

**Backend (new file + edits):**

1. **`packages/backend/src/routes/reviews.ts`** (new)
   - `POST /api/reviews` — auth required, body: `{ saleId, rating (1–5), comment? }` — validates sale exists + ENDED status (can only review past sales) + user attended (purchased at least one item from sale) — creates `Review`, then recalculates `Organizer.avgRating` + `reviewCount`
   - `GET /api/reviews/sale/:saleId` — public, returns reviews for a sale with `user.name`
   - `GET /api/reviews/organizer/:organizerId` — public, paginated reviews for organizer profile

2. **`packages/backend/src/index.ts`** — add `app.use('/api/reviews', reviewRoutes)`

**Frontend (new files + edits):**

1. **`packages/frontend/components/StarRating.tsx`** (new)
   - Interactive star picker (1–5): filled vs empty stars, hover state, `onChange` callback
   - Also usable in display-only mode (`readonly` prop) — used in review cards

2. **`packages/frontend/components/ReviewCard.tsx`** (new)
   - Displays a single review: `user.name`, `StarRating` (readonly), `comment`, `createdAt` formatted

3. **`packages/frontend/components/ReviewForm.tsx`** (new)
   - `StarRating` picker + optional comment textarea + Submit button
   - Calls `POST /api/reviews`, shows success toast on submit
   - Props: `saleId`, `onSubmitted` callback

4. **`packages/frontend/pages/sales/[id].tsx`** (edit)
   - Below items section: add Reviews section
   - Fetch `GET /api/reviews/sale/:saleId`
   - If user is authenticated + sale ENDED + user purchased item from this sale → show `ReviewForm`
   - List of `ReviewCard` components

5. **`packages/frontend/pages/organizers/[id].tsx`** (edit)
   - Add `avgRating` star display + review count near organizer header (already fetched from `/api/organizers/:id`)
   - Add reviews tab or section: `GET /api/reviews/organizer/:organizerId`, list `ReviewCard`

### Points integration

When `POST /api/reviews` succeeds, fire-and-forget `pointsService.awardPoints(userId, 'REVIEW', 5, saleId, undefined, 'Left a review')` — Phase 19 points rule.

---

## Sprint N — Phase 20: Shopper Messaging

### Scope

- `Message` model (if not already in schema): `id`, `fromUserId`, `toUserId`, `saleId?`, `body`, `read` (bool), `createdAt`
- `GET /api/messages` — auth, returns conversation threads grouped by other user
- `POST /api/messages` — auth, body: `{ toUserId, saleId?, body }`
- `GET /api/messages/:threadId/read` — marks as read
- Frontend: `/messages` page — conversation list + message thread view
- Notification: when new message arrives, send push notification to recipient (reuse VAPID push service)

---

## Sprint O — Phase 21: Reservation / Hold UI

### Scope

- `Reservation` model: `id`, `userId`, `itemId`, `expiresAt` (24hr hold), `status` (ACTIVE/EXPIRED/CANCELLED)
- `POST /api/items/:id/reserve` — auth, creates 24hr hold (one per user per item), marks item `RESERVED`
- `DELETE /api/items/:id/reserve` — auth, cancels hold
- Cron: hourly job expires stale reservations, reverts item to `AVAILABLE`
- Frontend: "Hold for 24h" button on item cards (shoppers only), countdown timer if held by current user

---

## K+ Post-Beta Phases (load spec on demand)

| Sprint | Phase | Focus |
|--------|-------|-------|
| P | 23 | Affiliate + referral program |
| Q | 30 | Weekly curator email |
| R | 32 | Creator tools (CSV export, Zapier) |
| S | 16 | Advanced photo pipeline (video-to-inventory) |

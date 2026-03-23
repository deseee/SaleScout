# Next Session Prompt — S255

**Date:** 2026-03-23 (S254 complete, 2 P1 bugs found in live smoke test)
**Status:** S252 smoke test passed. 2 P1 bugs found — Saved Items API shape mismatch + premium redirect. Fix both before re-verifying.

---

## FIRST TASK — Dispatch findasale-dev to Fix BUG-1 (Saved Items API Shape Mismatch)

**Location:** Backend `/api/favorites` endpoint + frontend `/shopper/wishlist` Saved Items tab + Seed data

**Problem:**
- Backend `/favorites` endpoint (`packages/backend/userController.ts` line 74) returns a **flat array** of Favorite objects: `Favorite[]`
- Frontend `/shopper/wishlist` (`packages/frontend/pages/shopper/wishlist.tsx` line 117) expects a **shaped response**: `{ favorites: FavoriteItem[], categories: string[], total: number }`
- Result: `favoritesData?.favorites` is always `undefined` → Saved Items tab always shows empty state even though user11 has data

**Secondary issue:** Backend `/favorites` query includes `sale` relation but NOT `item` relation. Item-level favorites (where `itemId IS NOT NULL` on the Favorite model) won't have their item data loaded for display.

**Tertiary issue:** Seed data only creates sale-level favorites for user11, not item-level favorites. Need to add 2–3 item-level favorites to user11 in seed.ts for testing.

**Files to fix:**
1. `packages/backend/src/controllers/userController.ts` — Update `/favorites` endpoint to return shaped response `{ favorites: FavoriteItem[], categories: string[], total: number }`. Filter to `itemId IS NOT NULL` for Saved Items. Add `item` relation to query.
2. `packages/database/prisma/schema.prisma` — Verify FavoriteItem type exists in shared types (check if it maps to Favorite model with item/sale relations loaded).
3. `packages/database/prisma/seed.ts` — Add 2–3 item-level favorites for user11 in seed function.
4. `packages/frontend/pages/shopper/wishlist.tsx` — Verify destructuring matches shaped response (no code changes needed if backend fix completes).

**Acceptance criteria:**
- `/shopper/wishlist` Saved Items tab loads with user11's item-level favorites displayed
- `/shopper/dashboard` Favorites tab shows same data
- Backend `/favorites` endpoint returns `{ favorites, categories, total }` shape
- Seed creates at least 2 item-level favorites for user11

---

## SECOND TASK — Dispatch findasale-dev to Fix BUG-2 (/organizer/premium Not Redirecting)

**Location:** `packages/frontend/pages/organizer/premium.tsx`

**Problem:**
- Expected per D-016 CTA consolidation: `/organizer/premium` should redirect to `/organizer/subscription`
- Actual: Full page loads with "Premium Plans for Organizers" title + tier comparison table
- No redirect happening

**Fix:** Add redirect to `premium.tsx`:
```tsx
useEffect(() => { router.replace('/organizer/subscription'); }, []);
```
Alternative: Add redirect in `next.config.js` redirects array.

**Files to fix:**
1. `packages/frontend/pages/organizer/premium.tsx` — Add useEffect redirect to `/organizer/subscription` at top of component

**Acceptance criteria:**
- Navigation to `/organizer/premium` immediately redirects to `/organizer/subscription`
- No "Premium Plans" page visible to users

---

## THIRD TASK — Re-verify Saved Items Tab After Fixes

Once findasale-dev completes both fixes:
1. Run Chrome MCP smoke test on `/shopper/wishlist` Saved Items tab — should display user11's item-level favorites
2. Run Chrome MCP smoke test on `/shopper/dashboard` Favorites tab — should show same data
3. Verify `/organizer/premium` redirects to `/organizer/subscription`
4. Mark S255 complete

---

## Test Accounts (Live on Neon)

All password: `password123`
- `user1@example.com` — ADMIN + SIMPLE organizer
- `user2@example.com` — PRO organizer (Stripe connected)
- `user3@example.com` — TEAMS organizer (Stripe connected)
- `user11@example.com` — Shopper with full activity history (9 bids, 6 purchases, wishlists, follows, notifications)

---

## Context Loading

- Read `claude_docs/STATE.md` — S254 summary + P1 bugs identified
- Reference files: `packages/backend/src/controllers/userController.ts` (line 74), `packages/frontend/pages/shopper/wishlist.tsx` (line 117), `packages/frontend/pages/organizer/premium.tsx`
- Both bugs are blocking user functionality. Fix and re-verify before moving to next work batch.

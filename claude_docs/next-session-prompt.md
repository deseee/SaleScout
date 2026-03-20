# Next Session Resume Prompt — S212
*Written: 2026-03-20*
*Session ended: normally*

---

## Priority: Fix 7 P0 Bugs from Chrome Audit

The S211 comprehensive audit found 7 P0 bugs blocking beta. Fix them in this priority order.
Full audit report: `claude_docs/audits/chrome-audit-comprehensive-S211.md`

### P0-1: Tier Display Bug (Systemic — highest priority)

**Problem:** PRO and TEAMS users see "Current Plan: Free/SIMPLE" on `/organizer/premium`, `/organizer/upgrade`, `/organizer/subscription`, and dashboard "🔒 Unlock Pro Features" card.

**Root cause:** Frontend billing/subscription components fetch tier from `GET /api/billing/subscription` which reads from Stripe. Test users have no Stripe subscription → always shows Free. The JWT already contains the correct `subscriptionTier` claim.

**Fix strategy:** Frontend should read tier from JWT/auth context as source of truth. Stripe billing data should be supplementary (for payment method, invoice history, etc.) but NOT the tier source. The `useOrganizerTier` hook and any billing-dependent tier reads need to be updated.

**Files to investigate:**
- `packages/frontend/hooks/useOrganizerTier.ts` (or similar — grep for `useOrganizerTier`)
- `packages/frontend/pages/organizer/premium.tsx`
- `packages/frontend/pages/organizer/upgrade.tsx`
- `packages/frontend/pages/organizer/subscription.tsx`
- `packages/frontend/pages/organizer/dashboard.tsx` (the "Unlock Pro Features" card)
- Auth context / JWT decode logic

**Dispatch:** `findasale-dev` — this touches 4-6 frontend files, must go through subagent.

### P0-2: Workspace 401 Unauthorized

**Problem:** `/organizer/workspace` returns 401 from backend even with valid TEAMS JWT (`subscriptionTier: "TEAMS"`, `organizerTokenVersion: 1`).

**Investigate:**
- Backend workspace route middleware — is it checking `tokenVersion` against DB and finding a mismatch? (The fix-seed-tiers endpoint incremented tokenVersion to force JWT refresh, but the JWT was freshly issued after the increment.)
- Is there a secondary auth check beyond the standard `authenticate` middleware?
- Is the workspace route checking `req.user.organizer.subscriptionTier` and the user object doesn't include the organizer relation?

**Files:** `packages/backend/src/routes/workspace.ts` (or similar), `packages/backend/src/middleware/auth.ts`

### P0-3: Command Center Crash (React Hook #310)

**Problem:** `/organizer/command-center` crashes with React error #310 — "Rendered more hooks than during the previous render."

**Root cause:** `useCommandCenter` hook has a conditional `useQuery` call. Hooks cannot be called conditionally.

**Fix:** Move the condition inside the `useQuery` `enabled` option, or restructure to avoid conditional hook calls.

**Files:** `packages/frontend/hooks/useCommandCenter.ts`, `packages/frontend/pages/organizer/command-center.tsx`

### P0-4: Typology Crash

**Problem:** `/organizer/typology` shows ErrorBoundary "Something went wrong." No specific error visible in production minified build.

**Fix:** Read the typology page source, check for null safety issues, conditional hooks, or missing data guards.

**Files:** `packages/frontend/pages/organizer/typology.tsx`, `packages/frontend/hooks/useTypology.ts`

### P0-5: Wishlists Redirect to /auth/login

**Problem:** `/wishlists` redirects to `/auth/login` (which is a 404). Should redirect to `/login`.

**Fix:** Find the auth redirect in the wishlists page or its auth guard and change `/auth/login` to `/login`.

**Files:** `packages/frontend/pages/wishlists.tsx` (or routing/auth guard)

### P0-6: /organizer/sales 404

**Problem:** Dashboard "Manage Sales" button navigates to `/organizer/sales` which doesn't exist.

**Fix options:**
1. Create a simple `/organizer/sales` page that lists the organizer's sales (similar to dashboard sales list but full-page)
2. OR change the dashboard button to navigate to an existing page (e.g., `/organizer/dashboard` scroll-to-sales section)

### P0-7: Encyclopedia Crash

**Problem:** `/encyclopedia` crashes with `TypeError: Cannot read properties of undefined (reading 'replace')` in EncyclopediaCard component when data is present. Empty state works fine.

**Fix:** Add null safety check in EncyclopediaCard before calling `.replace()`.

**Files:** `packages/frontend/components/EncyclopediaCard.tsx`

---

## Also Pending: #70 Live Sale Feed

Blocked on Patrick provisioning Railway Redis + setting `NEXT_PUBLIC_SOCKET_URL` in Vercel.

### Patrick steps:
1. Open [railway.app](https://railway.app) → FindaSale project → **+ New** → **Database** → **Add Redis**
2. Verify `REDIS_URL` appears in backend service → Variables tab
3. Open [vercel.com](https://vercel.com) → FindaSale → Settings → Environment Variables → Add `NEXT_PUBLIC_SOCKET_URL=https://backend-production-153c9.up.railway.app` (Production)
4. Add to `packages/frontend/.env.local`: `NEXT_PUBLIC_SOCKET_URL=http://localhost:3001`
5. Tell Claude when done → Dev dispatch fires for Redis adapter + JWT socket auth

Full Architect spec: session-log S210.

---

## Also Pending: #19 Passkey

QA-cleared, clear to deploy when ready. No further code changes needed.

---

## DB Test Accounts
- `user1@example.com` / `password123` → ADMIN role, SIMPLE tier organizer
- `user2@example.com` / `password123` → ORGANIZER, PRO tier ✅
- `user3@example.com` / `password123` → ORGANIZER, TEAMS tier ✅
- `user11@example.com` / `password123` → Shopper

## Session Start Checklist
1. Load STATE.md + this file
2. Check Chrome MCP connectivity (`mcp__Claude_in_Chrome__navigate` to `https://finda.sale`)
3. Dispatch `findasale-dev` for P0-1 (tier display bug) — highest impact, unblocks the most testing
4. While dev works on P0-1, dispatch a second dev for P0-3 through P0-7 (the simpler crashes/redirects)
5. P0-2 (workspace 401) may require backend investigation first — read the workspace route before dispatching

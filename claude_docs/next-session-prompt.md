# Next Session Resume Prompt — S211
*Written: 2026-03-20*
*Session ended: normally*

---

## Step 1 — Check Chrome MCP Connectivity

At session start, attempt a Chrome MCP call to verify it's connected this session.
The tool names are `mcp__Claude_in_Chrome__*`. Try navigating to the live site:

**Test URL:** `https://finda.sale` (or check NEXT_PUBLIC_APP_URL in Railway env)

If Chrome MCP is available:
- Navigate to the live site in dark mode (toggle via top-right ThemeToggle)
- Visually verify the dark mode fixes from S208–S209 are live:
  - Shopper nav drawer links — should be warm-100 text (not invisible black-on-dark)
  - SaleCard — card container, content area should have dark:bg-gray-800
  - pages: map, search, feed, calendar — check for obvious white blocks on dark bg
  - shopper pages: alerts, holds, purchases, receipts — check for white panels
- Screenshot each page and note any remaining issues
- File findings in `claude_docs/audits/chrome-audit-dark-mode-S211.md`

If Chrome MCP is NOT available:
- Note it in session log, defer visual audit again, proceed to Step 2.

---

## Step 2 — Railway Redis Setup (Option A — Patrick must do first)

Patrick approved Railway Redis on 2026-03-20. Before dispatching Dev for #70, Patrick must complete these ops steps:

### 2a. Provision Redis on Railway
1. Open [railway.app](https://railway.app) → FindaSale project
2. Click **+ New** → **Database** → **Add Redis**
3. Railway creates a Redis service and auto-injects `REDIS_URL` into services in the same project
4. Verify: go to your **backend service** → **Variables** tab → confirm `REDIS_URL` appears

### 2b. Add frontend socket URL to Vercel
1. Open [vercel.com](https://vercel.com) → FindaSale project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `NEXT_PUBLIC_SOCKET_URL`
   - **Value:** `https://backend-production-153c9.up.railway.app`
   - **Environment:** Production (and Preview if desired)
3. Click Save. Vercel will use this on next deploy.

### 2c. Add to local dev env
In `packages/frontend/.env.local` (create if missing), add:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 2d. Confirm with Claude
Tell Claude: "Redis is provisioned, REDIS_URL is in Railway, NEXT_PUBLIC_SOCKET_URL is in Vercel."
Claude will then dispatch Dev for the full implementation.

---

## Step 3 — Dev Dispatch: #70 Live Sale Feed (after Step 2 complete)

Dispatch `findasale-dev` with this context:

**Task:** Implement Railway Redis adapter + JWT Socket.io auth for #70 Live Sale Feed.

**Architect decision (2026-03-20, locked):**

### Redis Adapter
- Package: `@socket.io/redis-adapter` + `ioredis` (approved by Patrick)
- File: `packages/backend/src/lib/socket.ts`
- Location: after `new Server()`, before `.on('connection')`
- Conditional: only initialize if `process.env.REDIS_URL` is set
- Fallback: if unset, log warning and continue with in-memory (dev compat)
- Install: `pnpm add @socket.io/redis-adapter ioredis` in `packages/backend`

### JWT Auth on Socket
- Pattern: `io.use()` middleware — runs before any connection handler
- Token source: `socket.handshake.auth.token`
- Verification: reuse the JWT verify function from `packages/backend/src/middleware/auth.ts` — do NOT duplicate logic
- On success: attach `socket.data.user = decodedUser`
- On failure: `next(new Error('Unauthorized'))` — Socket.io client receives connect_error
- Scope: ALL connections (not just room joins)

### Frontend changes
- `packages/frontend/hooks/useLiveFeed.ts` — pass `{ auth: { token: getAccessToken() } }` to `io()` call
- `packages/frontend/hooks/useSaleStatus.ts` — same token pass
- Find how other frontend files get the access token (grep for `getAccessToken` or `useAuth` or cookie read) — do NOT assume, read first

### Constraints
- CORE.md §13 Schema-First Pre-Flight Gate mandatory
- Zero TypeScript errors before returning
- No new files in packages/shared
- pnpm-lock.yaml must be committed alongside package.json changes

---

## Current Status Summary

### Feature #70 Live Sale Feed
- DB ✅ | API ✅ | UI ✅ | QA 📋 (blocked) | Chrome 📋 | Human 📋
- Memory leak fixed (S210) ✅
- Event name mismatch fixed (S210) ✅
- Remaining: Redis adapter, JWT socket auth, NEXT_PUBLIC_SOCKET_URL env var

### Feature #19 Passkey
- CLEAR TO DEPLOY ✅ — no further code changes needed

### Dark Mode
- 27 pages/components fixed across S208–S209
- Chrome visual verification deferred (MCP unavailable S208–S210)

---

## DB Test Accounts
- `user1@example.com` / `password123` → ORGANIZER SIMPLE
- `user2@example.com` / `password123` → ORGANIZER PRO
- `user3@example.com` / `password123` → ORGANIZER TEAMS
- `user11@example.com` / `password123` → Shopper

## Pending Patrick Actions
1. Provision Railway Redis (Step 2a above)
2. Add NEXT_PUBLIC_SOCKET_URL to Vercel (Step 2b)
3. Add NEXT_PUBLIC_SOCKET_URL to .env.local (Step 2c)
4. Tell Claude when done → Dev dispatch fires automatically

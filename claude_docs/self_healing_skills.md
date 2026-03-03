# Self-Healing Skills

Reusable corrections derived from recurring project patterns.
Only add entries here when: pattern observed ≥2 times OR structurally certain to recur.

---

## Skill 1: SSR Window/Document Guard (Next.js Pages Router)

**Name:** SSR Browser Globals Crash
**Trigger:** New Next.js page uses `window`, `document`, `navigator`, `location`, or any browser-only API at module level or outside `useEffect`
**Environment:** Next.js 14 Pages Router, Docker (any OS)

**Pattern:**
Pages Router runs components server-side during SSR. Browser globals don't exist server-side → crash with `ReferenceError: window is not defined`.

**Known instance:** `shopper/dashboard` used `window.location.origin` at render time → SSR crash (fixed Phase 5).

**Steps:**
1. Move any `window.*`, `document.*`, `navigator.*`, `location.*` access into `useEffect` or behind a `typeof window !== 'undefined'` guard.
2. Use `useState` to store the value, initialized in `useEffect`:
   ```tsx
   const [origin, setOrigin] = useState('');
   useEffect(() => { setOrigin(window.location.origin); }, []);
   ```
3. Never pass browser globals as default values to `useState`.
4. Dynamic imports with `{ ssr: false }` for any library that accesses browser globals on import (e.g. Leaflet).

**Edge Cases:**
- Leaflet: always use `dynamic(() => import('../components/SaleMap'), { ssr: false })`
- localStorage/sessionStorage: same rule — `useEffect` only
- `navigator.share`: wrap in `typeof navigator !== 'undefined' && navigator.share`

**Test Command:**
```
docker compose restart frontend && curl -s http://localhost:3000/<new-page> | grep -i "error\|500"
```

**Confidence:** High

---

## Skill 2: JWT Payload Completeness Checklist

**Name:** JWT Payload Staleness
**Trigger:** New field added to `User` model in Prisma schema OR new field referenced from `AuthContext` / `useAuth` hook
**Environment:** Backend (Express + JWT) + Frontend (AuthContext.tsx)

**Pattern:**
JWT is minted at login/register and decoded client-side by `AuthContext`. When new user fields are added (e.g. `name`, `points`, `referralCode`), they must be explicitly included in the JWT payload or they will always be `undefined` on the frontend.

**Known instance:** `user.name`, `user.points`, `user.referralCode` were undefined everywhere on the frontend because they were never added to the token payload (fixed Phase 5).

**Steps:**
When adding a new field to the `User` model:
1. Check `packages/backend/src/controllers/authController.ts` — find all `jwt.sign(...)` calls.
2. Add the new field to the payload object in every `jwt.sign(...)` call (typically login + register + any token refresh).
3. Check `packages/frontend/components/AuthContext.tsx` — find the decoded token type and `setUser(...)` call.
4. Add the field to the decoded user type and ensure it's read from the token.
5. If the field should be fetched fresh (not from token), use `GET /api/users/me` instead and merge into user state.

**Edge Cases:**
- JWT tokens are stateless — existing logged-in users will still have old tokens until re-login. For non-critical fields this is acceptable. For security-sensitive fields (role changes), force re-login.
- Token size: keep payload lean. Don't embed large objects or arrays.

**Test Command:**
After login, check the decoded token in browser devtools → Application → Local Storage → decode the JWT at jwt.io and confirm the field is present.

**Confidence:** High

---

## Skill 3: Frontend Stub Audit (Unwired Endpoints)

**Name:** Console-log Stub Left in Production
**Trigger:** New form or action button built on frontend before backend endpoint exists
**Environment:** Frontend (Next.js), Backend (Express)

**Pattern:**
UI is scaffolded with a `console.log()` or `alert()` placeholder where a real API call should go. Backend endpoint is built later but frontend is never wired up.

**Known instance:** Contact form submitted to `console.log` only — never called `POST /api/contact` (fixed Phase 5).

**Steps:**
Before marking any feature complete, grep the relevant page/component for:
```
console.log
alert(
TODO
// placeholder
// wire up
```
If found, wire to the real endpoint before closing the task.

**Edge Cases:**
- Development-only `console.log` for debugging is fine — but remove before declaring a flow complete.

**Test Command:**
```bash
grep -r "console.log\|alert(" packages/frontend/pages/ --include="*.tsx" | grep -v "//.*console"
```

**Confidence:** Medium

---

## Skill 4: API Response Completeness (Missing Related Fields)

**Name:** Related Entity ID/Field Missing from API Response
**Trigger:** Frontend needs a field from a related Prisma model (e.g. `organizer.id`, `user.name`) but it's `undefined` despite existing in DB
**Environment:** Backend (Express + Prisma)

**Pattern:**
Prisma `findMany`/`findUnique` calls only return fields explicitly selected or included. If a related model's field isn't in the `include` or `select` block, it won't appear in the response.

**Known instance:** `organizer.id` was missing from sale list and sale detail responses — frontend couldn't link to organizer profile (fixed Phase 3).

**Steps:**
1. Identify the missing field and which Prisma query returns the parent object.
2. Add `include: { organizer: { select: { id: true, businessName: true } } }` (or equivalent) to the query.
3. Confirm the field appears in the JSON response before wiring the frontend.

**Edge Cases:**
- Avoid `include: { organizer: true }` (returns all fields including sensitive ones). Always use `select` to scope the included relation.
- If the field is deeply nested (e.g. `organizer.user.email`), chain the includes: `include: { organizer: { include: { user: { select: { email: true } } } } }`.

**Test Command:**
```bash
curl -s http://localhost:3001/api/sales | jq '.[0].organizer'
```

**Confidence:** Medium

---

## Skill 5: Unhandled Promise Rejection in Express Controllers

**Name:** Silent Async Failure
**Trigger:** Express route handler uses `async`/`await` without try/catch, or `.then()` without `.catch()`
**Environment:** Backend (Express/Node.js)

**Pattern:**
An unhandled promise rejection causes the Express server to silently fail on that request — the client hangs or gets a 500 with no useful message. In Node 18+, unhandled rejections can crash the process.

**Known instance:** Not yet observed in SaleScout — added proactively from pattern analysis.

**Steps:**
1. Wrap all async controller code in try/catch:
   ```ts
   export const myHandler = async (req, res) => {
     try {
       const result = await someAsyncOp();
       res.json(result);
     } catch (err) {
       console.error('[myHandler]', err);
       res.status(500).json({ error: 'Internal server error' });
     }
   };
   ```
2. Or use an async wrapper utility that forwards errors to Express error middleware:
   ```ts
   const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
   router.get('/route', asyncHandler(myHandler));
   ```
3. Never leave `.then()` chains without `.catch()`.

**Test Command:**
```bash
grep -rn "\.then(" packages/backend/src/controllers/ --include="*.ts" | grep -v "\.catch\|async\|await"
```

**Confidence:** High

---

## Skill 6: Missing Auth Middleware on Sensitive Routes

**Name:** Unprotected Mutation Route
**Trigger:** New POST/PUT/PATCH/DELETE route added to backend without an `authenticate` middleware call
**Environment:** Backend (Express + JWT)

**Pattern:**
New routes scaffolded quickly often miss the authenticate middleware. The route accepts requests from anyone — no token needed. Only caught when a security audit runs or a user reports unauthorized behavior.

**Known instance:** Not yet observed — added proactively from pattern analysis.

**Steps:**
1. Every mutation route (POST/PUT/PATCH/DELETE) must include `authenticate` as a middleware:
   ```ts
   router.post('/resource', authenticate, myController);
   ```
2. Public GET routes are acceptable without auth (sale listings, organizer profiles).
3. Organizer-only routes must also include a role check after authenticate:
   ```ts
   router.post('/sales', authenticate, requireRole('ORGANIZER'), createSale);
   ```
4. Admin routes must check for ADMIN role.

**Test Command:**
```bash
grep -rn "router\.\(post\|put\|patch\|delete\)(" packages/backend/src/routes/ --include="*.ts" | grep -v "authenticate\|verifyToken"
```

**Confidence:** High

---

## Skill 7: findMany Without Pagination (DoS Risk)

**Name:** Unbounded Database Query
**Trigger:** Prisma `findMany` call with no `take` limit in a route that serves external requests
**Environment:** Backend (Express + Prisma + PostgreSQL)

**Pattern:**
A `findMany` without `take:` will return every row in the table. As data grows, this causes slow responses, high memory usage, and eventual timeouts. An attacker can trigger it repeatedly to degrade service.

**Known instance:** Not yet observed — added proactively from pattern analysis.

**Steps:**
1. All `findMany` calls in routes that serve external requests must have a `take` limit:
   ```ts
   const items = await prisma.item.findMany({
     where: { saleId },
     take: 100,       // hard cap
     skip: offset,    // pagination support
     orderBy: { createdAt: 'desc' },
   });
   ```
2. Expose `?page=` and `?limit=` query params; cap limit at a reasonable max (e.g. 100).
3. Internal admin queries (analytics, exports) may omit `take` — document the intent.

**Test Command:**
```bash
grep -rn "findMany(" packages/backend/src/controllers/ --include="*.ts" | grep -v "take:\|limit"
```

**Confidence:** Medium

---

## Skill 8: Env Var Missing at Runtime

**Name:** Missing Environment Variable
**Trigger:** New service, third-party integration, or feature added that reads from `process.env` — but the var isn't in `.env.example` or `.env`
**Environment:** Backend (Express/Node.js), Docker Compose

**Pattern:**
Code reads `process.env.MY_NEW_VAR` which is `undefined` at runtime. The error surfaces as a confusing downstream failure — e.g. a Stripe call with `undefined` key, or a Resend email with no `FROM` address.

**Known instance:** Not yet observed in SaleScout — added proactively.

**Steps:**
1. Every new `process.env.*` reference must be added to `packages/backend/.env.example` with a descriptive placeholder.
2. Validate required env vars at server startup — fail fast with a clear error:
   ```ts
   const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'RESEND_API_KEY'];
   const missing = required.filter(k => !process.env[k]);
   if (missing.length) {
     console.error('Missing required env vars:', missing.join(', '));
     process.exit(1);
   }
   ```
3. After adding the check, run `docker compose restart backend` and confirm startup succeeds.

**Test Command:**
```bash
diff \
  <(grep -oP "^[A-Z_]+(?==)" packages/backend/.env.example | sort) \
  <(grep -oP "^[A-Z_]+(?==)" packages/backend/.env | sort)
```

**Confidence:** High

---

---

## Skill 9: Docker/pnpm Monorepo Backend Startup Failure

**Name:** Nodemon Not Found in Docker
**Trigger:** `docker compose up` starts but backend container immediately exits or restarts with error `sh: nodemon: not found` or `npx: command not found`
**Environment:** Docker Compose + pnpm workspaces monorepo

**Pattern:**
pnpm does NOT hoist binaries to the workspace root `node_modules/.bin`. If `docker-compose.yml` overrides the Dockerfile CMD with a raw `sh -c "npx nodemon ..."` call from `/app` (the workspace root), npx can't find nodemon — it's only in the package-scoped `node_modules/.bin`, not the root. This looks like a PATH issue but is actually a pnpm workspace scoping issue.

**Known instance:** Phase 9.5 — `docker-compose.yml` was calling `npx nodemon packages/backend/src/index.ts` from `/app`; backend crash-looped on every `docker compose up` (fixed 2026-03-02).

**Steps:**
1. In `docker-compose.yml`, change the backend service command from:
   ```
   sh -c "... && npx nodemon ..."
   ```
   to:
   ```
   sh -c "... && pnpm --filter backend run dev"
   ```
   `pnpm --filter backend run dev` resolves nodemon correctly via workspace scope.

2. Ensure `nodemon` and `tsx` are in `dependencies` (not `devDependencies`) in `packages/backend/package.json` — they must be present in the Docker image at runtime.

3. After any change to `docker-compose.yml` or `package.json`:
   ```powershell
   docker compose down
   docker compose up --build --no-cache
   ```
   `--no-cache` is required — Docker's layer cache will silently skip `pnpm install` otherwise.

**Edge Cases:**
- A plain `docker compose restart backend` does NOT pick up `docker-compose.yml` changes or new dependencies. Always use down + up.
- If the backend `Dockerfile` has `WORKDIR /app/packages/backend`, the compose command override runs from `/app` (workspace root), not the package dir. pnpm `--filter` handles this correctly.

**Test Command:**
```powershell
docker compose logs backend | Select-String "nodemon|Error|started"
```

**Confidence:** High (observed instance, fixed)

---

## Skill 10: Circular Dependency via index.ts Prisma Import

**Name:** TDZ Crash — Controller Imports prisma from index.ts
**Trigger:** Backend crashes on startup or first request with `ReferenceError: Cannot access '<functionName>' before initialization`
**Environment:** Backend (Express + Prisma), any new controller file

**Pattern:**
`index.ts` is the Express entry point — it loads all routes, which import all controllers. If a controller does `import { prisma } from '../index'`, a circular dependency forms: `index.ts` → routes → controller → `index.ts`. This puts named exports from the controller in the Temporal Dead Zone (TDZ) when the routes file first tries to import them, causing an unrecoverable initialization crash.

**Known instance:** `notificationController.ts` line 2 used `import { prisma } from '../index'` — crash: `Cannot access 'subscribeToSale' before initialization` (fixed 2026-03-02).

**Steps:**
1. Replace `import { prisma } from '../index'` at the top of any controller with a local PrismaClient:
   ```ts
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   ```
2. This is the pattern already used in `stripeController.ts` — follow it consistently.
3. After the fix, restart the backend container and confirm no startup errors:
   ```powershell
   docker compose restart backend
   docker compose logs backend | Select-String "Error|started"
   ```

**Edge Cases:**
- Multiple PrismaClient instances are fine in development — Prisma handles connection pooling.
- The pattern applies to any module that `index.ts` transitively loads. When in doubt, use a local `new PrismaClient()` rather than importing from `index.ts`.
- Symptom can also manifest as a hang (no response) if the error is swallowed by a route-level try/catch.

**Test Command:**
```bash
grep -rn "from '../index'" packages/backend/src/controllers/ --include="*.ts"
```
Any hit is a potential circular dependency — audit each one.

**Confidence:** High (observed instance, fixed; structurally certain to recur as new controllers are added)

---

Last Updated: 2026-03-02
Source: Patterns derived from STATE.md (Phases 2–5), RECOVERY.md documented fixes, and health-scout proactive analysis (2026-03-01).

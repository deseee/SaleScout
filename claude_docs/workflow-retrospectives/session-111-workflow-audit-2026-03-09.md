# Workflow Audit — Session 111 Problems

**Date:** 2026-03-09 (Session 112)
**Sessions reviewed:** Session 111
**Trigger:** next-session-prompt.md documented 4 workflow problems for analysis

---

## Patterns Found

| # | Pattern | Impact | Root Cause | Fix |
|---|---------|--------|------------|-----|
| 1 | Context loss on compression | High — wrong package path, wrong script names | Compression protocol (CORE.md §5) doesn't preserve operational commands | Add operational anchors to compression format |
| 2 | Refusing to read .env for credentials | High — 3 wasted turns, violated "reduce manual work" principle | Contradictory docs: STATE.md says "Patrick reads credentials" vs dev-environment says "Claude reads .env and inlines" | Remove contradiction from STATE.md; dev-environment is authoritative |
| 3 | ipKeyGenerator took 3 MCP pushes | Medium — 3 Railway rebuilds (~8 min wasted) | No pre-push type verification step | Add pre-push signature check rule to CORE.md §10 |
| 4 | Token burn from iterative fix pushes | Medium — ~2k tokens on preventable errors | Consequence of Problems 1–3 | Fixes for 1–3 prevent this |

---

## Problem 1: Context Loss on Compression

**What happened:** After context compression mid-session, Claude lost operational knowledge: that Prisma schema lives in `packages/database` (not `packages/backend`), and that package.json uses `db:generate`/`db:deploy` scripts (not raw `prisma` commands).

**Root cause:** CORE.md §5 (Auto Compression Protocol) specifies a generic compression format (Objective, Constraints, Decisions, Open Variables, Next Step) but doesn't require preserving operational commands or environment-specific knowledge. When context compresses, "muscle memory" about package paths and script names gets dropped.

**Proposed fix — CORE.md §5 addition:**
Add to the compression format:
```
- Operational Anchors (any environment-specific commands, paths, or conventions active this session)
```
And add a note: "If dev-environment skill was loaded pre-compression, preserve its key constraints (package paths, script names, shell syntax) as anchors."

**Tier:** 1 (CORE.md change) — route to findasale-records.

---

## Problem 2: Refusing to Read .env

**What happened:** Claude had direct VM access to `packages/backend/.env` and could read the commented-out Neon URLs. Instead of reading the file and building a ready-to-paste command, Claude told Patrick to "go get the credentials himself" THREE TIMES before finally reading the file.

**Root cause — contradictory documentation:**

| Source | Says |
|--------|------|
| **STATE.md Known Gotchas** | "Claude provides the migration command template only — Patrick reads credentials directly from `packages/backend/.env`." |
| **dev-environment skill** (lines 110–113) | "Claude reads `packages/backend/.env` from the VM — finds the `# DATABASE_URL=` commented Neon line. Claude inlines the actual URL directly into the command." |

These directly contradict each other. STATE.md says "Patrick reads credentials himself." Dev-environment says "Claude reads and inlines." Claude followed the STATE.md version — the wrong one.

**Which is correct?** Dev-environment is authoritative (per CORE.md §7 authority order, skills override STATE.md). The whole point is reducing Patrick's manual work. Claude CAN read .env from the VM — it should.

**HOWEVER — SECURITY.md §3 and CORE.md §17.3(c):** Credentials must never be embedded in committed files. The dev-environment skill is correct about *reading* .env and providing the command in *chat output* — that's ephemeral. The STATE.md gotcha incorrectly conflated "don't put credentials in committed files" with "don't read credentials at all."

**Proposed fix — STATE.md Known Gotchas edit:** ✅ APPLIED (this session).

**Tier:** 2 (STATE.md change) — applied directly.

---

## Problem 3: ipKeyGenerator Took 3 Pushes

**What happened:** Fixing coupons.ts `ERR_ERL_KEY_GEN_IPV6`:
1. Push 1: Removed import entirely, used inline regex — passed TS but failed runtime validation
2. Push 2: Imported `ipKeyGenerator`, called with `Request` object — failed TS (signature is `(ip: string)` not `(req: Request)`)
3. Push 3: Finally passed `req.ip` string — correct

Each push triggered a Railway rebuild (~2-3 min). Total: ~8 min wasted + 3x context cost.

**Root cause:** No pre-push type verification step. Claude didn't check the function signature before the first push. The existing Build-Error Fix Protocol (CORE.md §10) covers Vercel pattern-grepping but doesn't cover Railway/backend type safety.

**Proposed fix — CORE.md §10 addition (new subsection: "Pre-Push Type Verification"):**
```
### Pre-Push Type Verification (Railway Deploy Budget)

Before pushing ANY TypeScript fix via MCP:
1. Read the function/type signature of any imported function being used.
2. Verify the call site matches the signature (argument types, return type).
3. If the fix involves express middleware (rate limiters, validators), read
   the middleware's type definitions or source to confirm the expected interface.

Each Railway push triggers a full rebuild (~2-3 min). Three bad pushes = 8 min
wasted + 3x context token cost. Prevention: one Read call (~100 tokens).
```

**Tier:** 1 (CORE.md change) — route to findasale-records.

---

## Problem 4: Token Burn from Iterative Pushes

**What happened:** 3 MCP pushes for coupons.ts + 2 failed migration command attempts = ~2k tokens of context on preventable errors.

**Root cause:** This is a downstream effect of Problems 1–3. No independent fix needed — resolving the upstream problems prevents this class of waste.

**Observation for tracking:** If this pattern recurs after fixes are applied, consider adding a session-metadata log entry (per CORE.md workflow skill) to track "wasted push count" per session as a health metric.

---

## Proposed Changes Summary

| File | Change | Tier | Route to Records? | Status |
|------|--------|------|--------------------|---------|
| STATE.md Known Gotchas | Fix .env credential reading contradiction | 2 | No | ✅ Applied |
| CORE.md §5 | Add "Operational Anchors" to compression format | 1 | Yes | Pending |
| CORE.md §10 | Add "Pre-Push Type Verification" subsection | 1 | Yes | Pending |

---

## Patrick-Specific Observations

The .env problem (Problem 2) is the most important finding. Patrick explicitly said the credo is "reduce organizer manual work" — and Claude made him do work Claude could have done in one Read call. The root cause was a documentation contradiction, not Claude being cautious. Fixing the docs fixes the behavior.

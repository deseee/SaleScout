# Next Session Resume Prompt — S217
*Written: 2026-03-20*
*Session ended: normally*

---

## Resume From

Session 216 complete. Railway + Vercel GREEN. #72 Phase 1 schema committed and on remote. Migration applied to Neon. `prisma generate` clean.

---

## Verify First (Before New Dispatches)

### 1. Organizer Happy Path — Date Input Re-Verify
S216 identified and fixed P1 blocker: Date input fields on `/organizer/create-sale` rejected manual entry and disabled calendar picker. Fixed by adding `min` attribute to both startDate and endDate inputs. Deployed to Vercel. Needs Chrome re-verification of full create-sale → add item → publish flow to confirm fix working end-to-end.

### 2. Items Button on /organizer/sales — Secondary P1
S216 happy path audit flagged Items button clicks as non-responsive. Need Chrome check to verify Link component navigation working.

---

## S217 Primary Work

### 3. Roadmap Batch Planning — Read + Identify Unshipped
Start S217 by reading `claude_docs/strategy/roadmap.md` (v67, 71 features tracked). Identify all unshipped or partially-shipped items by scanning Chrome/Nav/Human columns for 📋 status. Group top 5 unshipped candidates by beta-blocking severity. Do NOT implement — only identify for subagent dispatch planning. This inventory will guide batch dispatch strategy.

### 4. #72 Phase 2 — JWT Generation + Auth Middleware
Phase 1 (schema) complete. Phase 2: Update JWT payload to include roles array. Update auth middleware to check `req.user.roles.includes(ROLE)` instead of `req.user.role ===`. Update all auth guards across backend. Gated by: Phase 1 migration (DONE) + Patrick running `prisma migrate deploy` + `prisma generate` against Neon.

### 5. Platform Safety #100-#121 Batch
S216 completed #94/#97/#98/#99. #217 session completed #100-#103 (price validation + password reset + sale publish + Stripe webhook). Continue with next batch of 4: #104-#107 (CSRF protection, SQL injection, account enumeration, DDoS mitigation). Read full list in roadmap.md or adr files.

### 6. P2: Sale Card Click Handler + LiveFeedTicker
S216 happy path audit noted: (1) Featured sales carousel cards non-responsive to clicks. (2) LiveFeedTicker component mounted but rendering not visually confirmed. Dispatch Chrome verification + fix if needed.

---

## Deferred / Backlog

- **#51 Sale Ripples:** Neon migration + `prisma generate` still pending (Patrick action, lower priority)
- **#73 Two-Channel Notifications:** gated by #72 Phase 2
- **#74 Role-Aware Registration Consent:** gated by #72 Phase 2
- **#75 Tier Lapse State Logic:** gated by #72 Phase 2
- **Chrome re-audit:** Full secondary routes + organizer/shopper flows after Phase 2 ships
- **syncController cleanup:** helper functions use awkward `{ message: { message, retryable } }` nesting. Low priority cosmetic fix.

---

## Lessons Learned (S215 + S216)

### S215
1. **MCP push_files OVERWRITES entire files.** Never pass partial content — it truncates. This crashed Railway when Dockerfile was reduced to 4 lines. Always read full file before pushing.
2. **Error shape bulk renames cascade.** Renaming `error` → `message` across 27 controllers created: duplicate properties (8 in performanceController), broken internal references (6 in syncController), and type mismatches (FailedOperation interface expects `error` not `message`). Always grep for internal usage before bulk rename.
3. **Redis v4 uses camelCase.** `zRangeByScore` not `zrangebyscore`. `zAdd` with `value` not `member`.
4. **Skill tool ≠ Agent tool.** Skill tool loads instructions into context. Agent tool spawns autonomous subagents. Don't confuse them.

### S216
5. **Prisma generate relation naming.** When adding a relation field with a custom name to one side of a Prisma relation, BOTH sides need matching `@relation(name: "...")` annotations. Missing annotation on one side = generate failure. Always add `@relation` to both ends when using named relations.
6. **MCP push_files + untracked local files.** If files are pushed to remote via MCP before the local branch is committed, `push.ps1` merge will fail with "untracked files conflict." Fix: delete the local untracked copies (remote has correct version) then re-run push.ps1.
7. **push.ps1 detects uncommitted changes.** The script will halt if there are uncommitted local changes. Always commit first, then push.ps1.

---

## Environment Notes
- Railway and Vercel GREEN as of S216
- #72 Phase 1 schema migrated to Neon, `prisma generate` clean
- Redis live on Railway (REDIS_URL set), NEXT_PUBLIC_SOCKET_URL set on Vercel
- 4 Neon migrations applied (consignment, affiliate, #72 phase 1, price validation schema)
- `.\push.ps1` for all git pushes (never `git push` directly)
- Patrick manual action pending: Run Prisma migrate deploy + generate for #72 Phase 1 before Phase 2 work
- #51 Ripples: Neon migration + `prisma generate` outstanding (lower priority than #72)

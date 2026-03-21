# Next Session Resume Prompt — S216
*Written: 2026-03-20*
*Session ended: normally*

---

## Resume From

Session 215 complete. Railway + Vercel GREEN. Two S215 dispatches need verification before new work starts.

---

## Verify First (Before New Dispatches)

### 1. #76 Skeleton Loaders — did they ship?
S215 dispatched a dev subagent to replace spinners with ghost card layouts across item/sale grids. The dispatch completed but results were not confirmed before context compaction. Check if skeleton loader components exist in the codebase (`SkeletonCard`, `SkeletonGrid`, or similar). If not shipped, re-dispatch.

### 2. Chrome Audit of 7 Secondary Routes
S215 dispatched Chrome verification of: `/categories`, `/categories/[category]`, `/tags/[slug]`, `/condition-guide`, `/organizers/[id]`, `/items/[id]`, `/sales/[id]` (LiveFeedTicker). Results unconfirmed. Re-run if no audit report exists in `claude_docs/audits/`.

---

## S216 Primary Work

### 3. findasale-dev — #72 Dual-Role Account Implementation (Phase 1)
ADR approved in S215: `claude_docs/architecture/adr-072-dual-role-account-schema.md`. Phase 1 implementation:
- Add `roles String[] @default(["SHOPPER"])` to User model (replaces single `role` enum)
- Create `UserRoleSubscription` table per ADR spec
- Migration SQL + backward-compatible controller updates (check `req.user.role` → `req.user.roles.includes()`)
- This gates #73, #74, #75

### 4. findasale-dev — Platform Safety Continued
Pick 3-4 items from #94-#121 pre-beta safety list. Prioritize by beta-blocking severity.

### 5. Chrome Audit — Full Organizer Flow
Walk through complete organizer flow as user2 (PRO): login → dashboard → create sale → add items → publish → verify sale appears on shopper side as user11. This is the beta-critical happy path.

---

## Deferred / Backlog

- **#51 Sale Ripples:** Neon migration + `prisma generate` still pending (Patrick action)
- **#73 Two-Channel Notifications:** gated by #72
- **#74 Role-Aware Registration Consent:** gated by #72
- **#75 Tier Lapse State Logic:** gated by #72
- **syncController cleanup:** helper functions use `{ message: { message, retryable } }` — awkward nesting from error shape standardization. Low priority cosmetic fix.

---

## Lessons Learned (S215)

1. **MCP push_files OVERWRITES entire files.** Never pass partial content — it truncates. This crashed Railway when Dockerfile was reduced to 4 lines. Always read full file before pushing.
2. **Error shape bulk renames cascade.** Renaming `error` → `message` across 27 controllers created: duplicate properties (8 in performanceController), broken internal references (6 in syncController), and type mismatches (FailedOperation interface expects `error` not `message`). Always grep for internal usage before bulk rename.
3. **Redis v4 uses camelCase.** `zRangeByScore` not `zrangebyscore`. `zAdd` with `value` not `member`.
4. **Skill tool ≠ Agent tool.** Skill tool loads instructions into context. Agent tool spawns autonomous subagents. Don't confuse them.

---

## Environment Notes
- Railway and Vercel GREEN as of S215
- Redis live on Railway (REDIS_URL set), NEXT_PUBLIC_SOCKET_URL set on Vercel
- 2 new Neon migrations applied S215 (consignment + affiliate pre-wire)
- `.\push.ps1` for all git pushes (never `git push` directly)
- #51 Ripples: Neon migration + `prisma generate` outstanding (see schema change protocol)

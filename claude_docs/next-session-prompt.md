# Next Session Prompt — Session 149
*Written: 2026-03-12 · Sessions 147–148 complete*

## Priority 1 — Verify Vercel deployment

Sessions 147–148 fixes are on GitHub (merge commit `a7eb375`) but NOT yet live on Vercel.

**Check:** Does Vercel show a deployment from March 12 or later?
- If no: Vercel dashboard → findasale → Settings → Git → verify/reconnect GitHub App, then trigger redeploy using "Use latest commit from main."
- Once live: Patrick tests on phone — "+" button should appear (gray circle, bottom-right of each thumbnail), tap it, amber glow appears + camera opens, photo capture appends to that item's `photoUrls` (×2 badge shows).

---

## Priority 2 — Verify Neon migration `20260311000003`

Migration `20260311000003_add_camera_workflow_v2_fields` was created in session 147 to add `aiConfidence`, `backgroundRemoved`, `faceDetected`, `autoEnhanced` to `Item` + new `Photo` table. Status unknown — Patrick may or may not have run `prisma migrate deploy`.

**Check:** Run `prisma migrate status` from `packages/database` and confirm 0 pending. If pending, deploy.

---

## Priority 3 — Fix P0 QA bug in review.tsx

**Bug:** `review.tsx` (the publishing page at `/organizer/review-items/[saleId]`) calls:
```
GET /items?saleId=...&draftStatus=DRAFT
```
But backend `GET /items` does NOT support a `draftStatus` filter param. Should use:
```
GET /items/drafts?saleId=...
```
or whatever endpoint surfaces DRAFT items. Confirm the correct endpoint, then fix the frontend call.

---

## Priority 4 — Camera Workflow v2 (from session 146 spec)

When the above are cleared, return to the camera workflow v2 implementation:
1. `claude_docs/feature-notes/camera-workflow-publishing-spec.md` — full feature spec
2. `camera-mode-mockup.jsx` (repo root) — interactive mockup
3. Dispatch `findasale-architect` first (7 open questions in spec §Technical Notes)
4. Then Ship-Ready subcommittee, then `findasale-dev`

Load `dev-environment` skill before any shell/Prisma/database commands.

---

## Context to load at session start

1. `claude_docs/STATE.md`
2. `claude_docs/logs/session-log.md`

---

## Files changed in sessions 147–148 (confirm pushed)

- `packages/frontend/components/camera/RapidCarousel.tsx` — nested button fix (pushed via MCP, SHA: `622195faa8fdd410bb9347231469af8bb4b560c5`)
- `packages/frontend/pages/organizer/add-items/[saleId].tsx` — Phase 5 wiring (pushed by Patrick via push.ps1, merge commit `a7eb375`)

Wrap files written this session — include in next commit:
```powershell
git add claude_docs/STATE.md claude_docs/logs/session-log.md claude_docs/next-session-prompt.md claude_docs/.last-wrap
git commit -m "Session 148 wrap: STATE, session-log, next-session-prompt"
.\push.ps1
```

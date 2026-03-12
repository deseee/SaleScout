# Next Session Prompt — Session 147
*Written: 2026-03-11 · Session 146 complete*

## Priority: Camera Workflow v2 — Architecture Review + Implementation

### Context to load first
1. `claude_docs/STATE.md`
2. `claude_docs/feature-notes/camera-workflow-publishing-spec.md` — full feature spec from session 146
3. `camera-mode-mockup.jsx` (repo root) — interactive React mockup; show Patrick if needed

---

## Step 1 — Confirm session 145 + 146 git push

Patrick may have uncommitted changes from sessions 145 and 146. Confirm before starting new work.

**Session 145 + 146 combined commit block (if not yet pushed):**

```powershell
git add claude_docs/CORE.md
git add claude_docs/STATE.md
git add claude_docs/session-log.md
git add claude_docs/next-session-prompt.md
git add claude_docs/skills-package/findasale-records/SKILL.md
git add claude_docs/skills-package/findasale-records.skill
git add claude_docs/feature-notes/camera-workflow-publishing-spec.md
git add packages/frontend/pages/organizer/add-items/[saleId].tsx
git add camera-mode-mockup.jsx
git commit -m "Sessions 145-146: CORE commit block rule, records skill audit+wrap fix, STATE cleared, select-all bottom, camera mockup v2 + publishing page, feature spec"
.\push.ps1
```

Also confirm: which file did the **desktop nav parity subagent** from session 145 edit? Verify and add to the staging block above if not already included.

---

## Step 2 — Architecture Review (findasale-architect)

Dispatch `findasale-architect` with:
- `claude_docs/feature-notes/camera-workflow-publishing-spec.md`
- Focus: §Technical Notes for Architecture Review (7 open questions)

Architect must produce:
1. Decisions on all 7 open questions (BG removal API, image processing pipeline, face detection, AI confidence schema, photo angle labeling, aspect ratio crop location, draftStatus confirmation)
2. Phased implementation plan
3. Any new risks or blockers

---

## Step 3 — Ship-Ready Subcommittee (findasale-advisory-board)

After architect signs off, dispatch Ship-Ready subcommittee to validate scope, sequencing, and flag any features that should slip to v2.1.

---

## Step 4 — Implementation (findasale-dev)

Key files expected:

**Backend:**
- `uploadController.ts` — image processing endpoints (auto-enhance, BG removal, face detection flag)
- AI response payload — add `confidence` field
- Item schema — `photoCount`, photo angle label anticipation

**Frontend:**
- `add-items/[saleId].tsx` — camera screen enhancements (aspect ratio overlay, enhanced badges, + button, add-mode banner, quality warning, retake toast)
- Publishing page — new or enhanced review page

Load `dev-environment` skill before any shell/Prisma/database commands.

---

## Step 5 — QA (findasale-qa)

Run against user stories in the feature spec after dev completes.

---

## Other Items (if time permits)

- Desktop nav parity — confirm session 145 subagent changes are correct and live
- Beta blockers (Patrick-side): Stripe business account, Google Search Console, business cards, organizer outreach
- Prompt-level audit for `daily-friction-audit` and `weekly-pipeline-briefing` scheduled tasks (in Windows OneDrive — Patrick must open and share)

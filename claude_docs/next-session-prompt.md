# Next Session Resume Prompt
*Written: 2026-03-06*
*Session ended: session 83 — subagent fleet audit, CRLF root cause fix, session wrap protocol*

---

## ⚠️ FIRST ACTION — VERIFY THIS FILE IS CURRENT

**Before doing anything else, check this file's header.**

If it says "session 82" anywhere in the header or Resume From section — STOP. The session wrap protocol failed and work was lost again. Immediately:

1. Spawn `findasale-records` — audit what's on GitHub vs local
2. Spawn `findasale-workflow` — determine how the wrap protocol was bypassed
3. Spawn `findasale-dev` — recover any uncommitted local changes
4. Do NOT proceed with normal work until the drift is diagnosed and resolved

If this file correctly says "session 83" — proceed normally.

---

## Resume From

**Session wrap protocol now active.** CRLF root cause fixed (.gitattributes covers all file types). Session-wrap verification script live at `scripts/session-wrap-check.ps1`. Subagent fleet audit complete. 8 audit work paths defined and ready to execute.

Announce: "Session 84 loaded. Wrap protocol verified. Executing audit work paths."

---

## Verification Test (Run This First)

Run the session wrap check to confirm the fix held:

```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
.\scripts\session-wrap-check.ps1
```

Expected: **PASS — 6/6 checks green.** If it fails, diagnose before doing anything else.

---

## What Was Fixed This Session (83)

- `.gitattributes` expanded from `*.md` only → all text file types — kills 397-file CRLF phantom diffs permanently
- `scripts/session-wrap-check.ps1` + `session-wrap-check.sh` — mandatory session-end gate
- `push.ps1` — safety guard added: blocks `git checkout -- .` if real content changes exist
- `claude_docs/CORE.md` — §15 added: Session Wrap Protocol is mandatory
- `self_healing_skills.md` — entry #37 added: Session Ended Without Committing Work
- Neon credentials scrubbed from STATE.md and self_healing_skills.md (SECURITY fix)
- ROADMAP.md v14 committed (v12 was stale on GitHub)
- Full subagent fleet audit output committed to `claude_docs/archive/`
- Beta-launch content, support KB, incident response guides all committed

---

## Priority Queue for Session 84

### 1. Execute Audit Work Paths (from `claude_docs/archive/subagent-fleet-audit-2026-03-06.md` §6)

These are the 8 agent paths defined by the Opus audit — highest priority before beta:

| Agent | Task | Priority |
|-------|------|----------|
| findasale-qa | Pre-beta code audit: payment flows, auth, data writes | HIGH |
| findasale-ux | Usability audit of top 5 user flows | HIGH |
| findasale-legal | Compliance scan: ToS, Stripe, Michigan regs | HIGH |
| findasale-support | Bootstrap support KB (top 15 beta issues) | HIGH |
| findasale-cx | Beta onboarding toolkit (emails, status dashboard) | HIGH |
| findasale-records | Doc hygiene: orphan files, RECOVERY.md Docker refs | MEDIUM |
| findasale-marketing | Beta launch content calendar + launch-week content | MEDIUM |
| findasale-ops | Production readiness verification | MEDIUM |

Spawn QA, UX, and Legal in parallel first — they're the beta blockers.

### 2. Patrick's Required Actions Before Beta

1. Rotate Neon credentials (were in plaintext in committed history — scrubbed now but credentials should be rotated)
2. Confirm 5% / 7% fee decision
3. Set up Stripe business account
4. Set OAuth env vars in Vercel (GOOGLE_CLIENT_ID/SECRET, FACEBOOK_CLIENT_ID/SECRET)
5. Set up support@finda.sale email forwarding
6. Order business cards
7. Start beta organizer recruitment
8. Run e2e test checklist (`claude_docs/beta-launch/e2e-test-checklist.md`)

---

## Session Wrap Protocol (Mandatory)

Every session ends with:

```powershell
.\scripts\session-wrap-check.ps1
```

Must return PASS before session closes. If it fails — fix the issues, commit, push, re-run.

---

## CRLF Push Rule (Still Active)

Always `git add + git commit` FIRST, then `.\push.ps1` separately. Never chain them.

---

## Continuous Mode Rules

1. Load this file + STATE.md silently at session start
2. Run `.\scripts\session-wrap-check.ps1` — verify PASS before starting work
3. Check the header of this file — if it says session 82, stop and call in Records + Workflow + Dev
4. Announce session loaded + what's being worked on
5. Spawn audit work path agents in parallel
6. Commit work incrementally — not one giant batch at end
7. End every session with `.\scripts\session-wrap-check.ps1` — must PASS

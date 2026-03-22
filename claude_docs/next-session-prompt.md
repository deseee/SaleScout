# Next Session Prompt — S236

**Date:** 2026-03-22
**Status:** S235 COMPLETE — Context docs synced. Skills audit complete. Project hygiene cleaned. Innovation research dispatched. S234 actions still pending from Patrick.

---

## Session Start Checklist

1. Load `STATE.md` — reflects S235 work + S234 carryover
2. Review `INNOVATION_HANDOFF_2026-03-22.md` — 4 research memos, Print Kit + digital assets are most actionable
3. Check Sentry (https://deseee.sentry.io) — verify S234 passkey/timeout deploys continue reducing error volume

---

## Pending Patrick Actions (Prior Sessions)

**1. Install updated skills (S235):**
Navigate to `claude_docs/updated-skills/` and install the 7 .skill packages:
- findasale-innovation
- findasale-ux
- findasale-marketing (fee model now 10% flat)
- findasale-qa
- cowork-power-user
- findasale-advisory-board
- findasale-hacker

After install, delete the `updated-skills/` folder.

**2. Push session changes (S235):**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add CLAUDE.md claude_docs/operations/file-creation-schema.md claude_docs/research/INNOVATION_HANDOFF_2026-03-22.md claude_docs/research/joybird-ux-research-2026-03-22.md claude_docs/audits/records-audit-2026-03-22.md claude_docs/STATE.md
git commit -m "docs: S235 context sync, skills audit, project hygiene, innovation research handoff"
.\push.ps1
```

**3. Prisma + Railway env vars (S234 — STILL PENDING):**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy
npx prisma generate
```

Then in Railway dashboard, set:
- `AI_COST_CEILING_USD=5.00`
- `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831`

---

## Next Work Priority

**Pre-beta bug fixes:** Passkey race condition (P0, already fixed S234), Features #106–#109 pre-beta safety (all code-verified S234).

**Innovation follow-up:** Review Print Kit (POD via Printful) and secondary sales digital assets from research. Gate behind feature flag if implementing.

**Live testing:** Follow system + Edit-sale dates live verification (deferred from S234 QA).

---

## Reference

- Innovation handoff: `claude_docs/research/INNOVATION_HANDOFF_2026-03-22.md`
- Project hygiene audit: `claude_docs/audits/records-audit-2026-03-22.md`
- Skills audit summary: S235 session-log entry
- Previous QA audit: `claude_docs/operations/qa-audit-2026-03-22.md`
- Test accounts: Shopper `user11`, PRO `user2`, SIMPLE+ADMIN `user1`, TEAMS `user3` (all `password123`)

---

**Session Lead:** Patrick installs skills + pushes docs → runs Prisma + sets Railway env vars → next session verifies builds + live tests follow system

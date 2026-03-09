# Next Session Resume Prompt
*Written: 2026-03-11T23:59:00Z*
*Session ended: normally*

## Resume From

Session 107 COMPLETE. B1 implementation shipped (10 files staged). Ready to dispatch **Session 108 — Power User + Workflow Joint Audit**.

## What Was Completed This Session (107)

- **B1 Full Implementation:**
  - 107A (Schema): SaleType + ListingType enums (shared/src/index.ts), FeeStructure model + migration 20260311000001, seed with 10% flat rate
  - 107B (Backend): saleController (saleType accept), itemController (listingType accept), stripeController + auctionJob (FeeStructure lookup)
  - 107C (Frontend): SaleForm (saleType selector), ItemForm (listingType selector + conditional fields)
- **QA**: Found P0 blocker (auctionJob.ts hardcoded 0.07), dev fixed same session
- **Meta**: Cowork Power User diagnosed session-init bug in conversation-defaults Rule 3 (too narrow). Fixed by expanding to ALL first-message types, updated source + installed skill, repackaged
- **All code staged** — 10 files ready for Patrick's push

## Session 108 Objective

**Dispatch BOTH `findasale-cowork-power-user` AND `findasale-workflow` in the SAME session** to conduct a joint comprehensive audit of sessions 95–107 and produce a consolidated fix plan.

### Exact Tasks (give to both agents)

**1. Read & Audit (all agents — parallel):**
   - `claude_docs/logs/session-log.md` (sessions 96–102, 103, 104, 105, 106, 107)
   - `claude_docs/CORE.md` §2 (Session Init protocol)
   - `claude_docs/CORE.md` §17 (Session Wrap protocol)
   - `claude_docs/operations/conversation-defaults/SKILL.md` (current conversation-defaults rules)

**2. Power User Focus (findasale-cowork-power-user):**
   - Identify Cowork feature gaps that cause session-init failures (e.g., Rule 3 scope too narrow → missed status-report/task-assignment first messages; any other init rules that don't fire on expected message types)
   - Research new Cowork features (e.g., batch-task routing, session metadata injection, MCP capability discovery) relevant to fixing these gaps
   - Propose 3–5 specific Cowork feature usage improvements (e.g., "use Cowork batch dispatch to auto-initialize agent skills on startup")
   - Produce: "Power User Findings — Sessions 95–107 Init Analysis" doc

**3. Workflow Focus (findasale-workflow):**
   - Identify the 3–5 highest-friction session workflow anti-patterns:
     - Subagent handoff delays / unclear entry points
     - Context loss between sessions (missing state capture)
     - Wrap protocol bottlenecks (which files always cause conflicts, which always get forgotten)
     - Decision logging gaps (where Patrick's intent is unclear → rework)
     - File staging errors (wrap-only docs MCP-pushed mid-session → merge conflicts)
   - For each pattern, propose a specific process fix (e.g., "enforce context compression at session 50% mark", "wrap-only doc checklist attached to every session prompt")
   - Produce: "Workflow Findings — Sessions 95–107 Anti-Pattern Analysis" doc

**4. Joint Synthesis (both agents — collaborate in MESSAGE_BOARD.json):**
   - Review both findings in MESSAGE_BOARD
   - Produce **single consolidated document: `claude_docs/operations/session-init-wrap-fix-plan-2026-03-11.md`**
   - Content:
     - Executive summary: "13 specific gaps identified across init/wrap. 8 gaps can be closed via conversation-defaults rules + CORE.md. 5 gaps require Cowork feature requests or Patrick workflow change."
     - For EVERY identified gap: (1) description, (2) root cause, (3) proposed fix, (4) owning agent (conversation-defaults / findasale-workflow / findasale-power-user / Patrick manual action), (5) effort estimate (hours)
   - Checklist format (JSON) at end: `gaps: [{ id, description, status: "ready-to-implement" | "requires-patrick" | "requires-cowork-upgrade", owner, effort_hours }]`
   - Example entry:
     ```
     {
       "id": "G1",
       "description": "Session init Rule 3 fires only on ≤5 word openers, missing status-report/task-assignment long messages",
       "status": "ready-to-implement",
       "owner": "conversation-defaults",
       "effort_hours": 0.5,
       "proposed_fix": "Expand Rule 3 to fire unconditionally on first session message regardless of word count"
     }
     ```

**5. Patrick Action Items:**
   - List all items in the fix-plan doc that require Patrick action (e.g., "enable Cowork batch mode", "add MESSAGE_BOARD wiring to 5 agent skills that are missing it")
   - Include exact steps where known

## Critical Context

**10 files staged from Session 107 — Patrick must push before Session 108 wrap:**

```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/shared/src/index.ts
git add packages/database/prisma/schema.prisma
git add packages/database/prisma/migrations/20260311000001_add_sale_type_item_listing_type/migration.sql
git add packages/database/prisma/seed.ts
git add packages/backend/src/controllers/saleController.ts
git add packages/backend/src/controllers/itemController.ts
git add packages/backend/src/controllers/stripeController.ts
git add packages/backend/src/jobs/auctionJob.ts
git add packages/frontend/pages/organizer/create-sale.tsx
git add packages/frontend/pages/organizer/add-items/[saleId].tsx
git commit -m "Session 107: B1 full implementation — schema + FeeStructure + backend + frontend. All controllers read 10% flat fee from DB. Conversation-defaults Rule 3 expanded to all first messages."
.\push.ps1
```

**After push — Patrick must also:**
1. Run: `prisma generate && prisma migrate deploy` for migration `20260311000001_add_sale_type_item_listing_type` on Neon production
2. Reinstall `conversation-defaults` skill from `claude_docs/skill-updates-2026-03-09/conversation-defaults-updated.skill/`

## After Session 108 Audit Completes

Once the fix-plan doc is published and Patrick has reviewed it:

1. Implement all "ready-to-implement" fixes in conversation-defaults SKILL.md + CORE.md edits (next session)
2. Patrick handles all "requires-patrick" items (e.g., Cowork settings, MCP feature requests)
3. Then resume roadmap: **P1 bugs (A1.3, A1.4, A2.2, A5.1/A5.2, A6.1) → B4 (auction reserves)**

---

## Dispatch Instructions (for orchestrator)

**Dispatch both agents in parallel (one call, max 3 agents rule allows):**

```
Skill: findasale-cowork-power-user
Skill: findasale-workflow
```

**Both receive identical briefing** (this section — "Session 108 Objective" and "Exact Tasks"), then split focus as described above. They collaborate via MESSAGE_BOARD.json messages during the session. Final synthesis = single `session-init-wrap-fix-plan-2026-03-11.md` document.

**Session end:** No session wrap from either agent until orchestrator confirms the fix-plan doc is complete and Patrick has reviewed it. Then normal wrap protocol: STATE.md update, session-log entry, final MESSAGE_BOARD post.

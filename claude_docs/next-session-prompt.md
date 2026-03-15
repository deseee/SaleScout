# Next Session Resume Prompt
*Written: 2026-03-15T22:00:00Z*
*Session ended: normally (context compaction occurred mid-session)*

## Resume From

Sprint 2 code is on GitHub main. Push completed via `.\push.ps1` after resolving
untracked file conflicts (PowerShell bracket escaping on `[saleId].tsx`).

**Before any new work:** Verify Railway + Vercel deployed Sprint 2 successfully.
If build fails, fix first (likely index.ts route registration).

---

## PRIMARY OBJECTIVE: Strategic Audit + Workflow Overhaul

Patrick has accumulated friction across sessions 164–168 and wants a deep audit
before more feature work. This session should be mostly research and planning,
not coding. Launch subagents in parallel at session start.

---

## Parallel Agent Dispatch Plan (launch all at once)

### 1. findasale-workflow (PRIORITY)
**Task:** Audit sessions 164–168 for recurring friction patterns. Focus on:
- Errors that repeat session-to-session despite CORE.md rules
- Context docs going stale mid-session (not updated until wrap, then often incomplete)
- Session wraps requiring multiple git push attempts
- Compaction dropping working rulesets (CORE.md §4 push rules, etc.)
- How often the main context window does work that should be delegated
- Propose: what CLAUDE.md / CORE.md changes would prevent the top 5 recurring issues?
- Propose: "overhead budget" — how many extra tokens in CLAUDE.md are worth it to prevent N repair rounds?
- Use GitHub MCP to read recent commits and session-log.md history for evidence

### 2. findasale-innovation
**Task:** Research and evaluate these tools/approaches for FindA.Sale workflow:
- **Ollama** — local AI model hosting. Can we offload repetitive tasks (tag suggestions, description generation) to a local model? Cost/benefit vs Haiku API calls.
- **OpenClaw** and similar open-source AI agent frameworks — what exists, what's relevant
- **Claude Code** (CLI tool, not Cowork) — can Patrick use it for tasks that don't need the full Cowork overhead? What's the handoff pattern?
- **Claude Code Playground** — what is it, how to use it, is it useful for FindA.Sale?
- **https://github.com/karpathy/autoresearch** — what does it do, can we use it for competitive research, market analysis, or documentation generation?
- **Any other AI tools** Innovation discovers that could help a solo non-technical founder manage a PWA project
- Deliverable: ranked evaluation matrix with effort/value/risk for each tool

### 3. cowork-power-user
**Task:** Full ecosystem audit:
- What Cowork features are we underusing? (scheduled tasks, plugins, connectors, Chrome agent, etc.)
- Are there new plugins or connectors since last audit that would help?
- Review our skill roster — are custom findasale-* skills still the right abstraction or should some be merged/split?
- Research: can skills call other skills? Can a manager skill orchestrate subagents?
- Research: what's the current best practice for surviving context compaction in long Cowork sessions?
- Propose any CLAUDE.md or skill changes based on findings

### 4. findasale-advisory-board → Communications Subcommittee
**Task:** Rate our current human/AI interaction quality and propose improvements:
- Review the session-log.md entries for sessions 164–168 as evidence
- What would a communications specialist rate our current interaction patterns? (1-10)
- Where does communication break down? (ambiguous instructions, Patrick having to repeat himself, Claude misinterpreting scope words like "tools/subagents/agents/plugins/skills/connectors", session wrap friction)
- Patrick's terminology mapping: when he says "tools" he means ALL of them — subagents, skills, plugins, connectors, MCP tools, Chrome, scheduled tasks, everything in the kit plus things discovered through research. Document this in patrick-language-map.md.
- Propose: conversation-defaults skill updates for smoother interaction
- Propose: CLAUDE.md additions that would cut Patrick's "reply count" per session by 50%

### 5. findasale-architect
**Task:** Design the "Manager Subagent" pattern Patrick is requesting:
- Current problem: main context window orchestrates all pushes, manages all subagent output, and gets bloated → compaction → loses rules
- Proposed pattern: a manager subagent that:
  - Receives work output from dev/qa/architect subagents
  - Handles all MCP pushes (subagents should NOT push independently)
  - Keeps a running manifest of local vs remote file state
  - Validates subagent output before pushing (truncation gate, etc.)
  - Reports summary to main context window (which stays lean for Patrick interaction)
- Questions to answer: Is this possible in Cowork's current architecture? Can a skill spawn and manage other skills? What are the token implications? What would the handoff protocol look like?
- Reference: CORE.md §4 (push rules), §7 (handoff protocol), §6 (escalation)
- Deliverable: ADR with implementation plan or "not feasible yet" with workaround

### 6. findasale-qa
**Task:** Sprint 2 verification:
- Check that Railway deployed successfully with export routes
- Review exportController.ts for edge cases (empty sale, no published items, malformed data)
- Review cloudinaryWatermark.ts for URLs that don't match expected Cloudinary format
- Review promote.tsx for auth/ownership edge cases
- Deliverable: QA report with any P0/P1 findings

---

## Patrick's Key Pain Points (verbatim, for agent reference)

1. "I'm tired of having to reply multiple times to the same errors session after session. It still seems like entire working rulesets get tossed from memory after auto compactions."
2. "Context docs don't seem to get updated enough during sessions, session wraps often require multiple git pushes or requests for full instructions."
3. "I'm not sure what you think I mean when I say words like tools, subagents, agents, plugins, skills, connectors, etc. Generally it means all of them, every tool in the kit and ones you have identified through research."
4. "It makes sense to me that the main context window should be checking what this manager subagent output instead of doing all the pushes in the main window."
5. "Maybe subagents shouldn't be allowed to do their own pushes and the manager should be trained in how to keep subagents, himself and the main session aligned across local, repos, services, etc."

---

## Environment Notes

- Railway: should have Sprint 2 deployed (verify)
- Vercel: should have Sprint 2 deployed (verify)
- Neon: 82 migrations, no changes needed
- CORE.md: v4.1 (MCP safety rules active)
- GitHub: all Sprint 2 code + context docs pushed to main
- MailerLite MCP: active (from session 165)
- GitHub MCP: active
- Vercel MCP: active

---

## Files Changed in Session 167–168

**MCP-pushed to GitHub:**
- `claude_docs/CORE.md` (v4.1 — MCP rules)
- `packages/backend/Dockerfile.production` (redeploy trigger)
- `packages/backend/src/controllers/itemController.ts` (939-line restore)
- `packages/backend/src/utils/cloudinaryWatermark.ts` (new)
- `packages/backend/src/controllers/exportController.ts` (new)
- `packages/backend/src/routes/export.ts` (new)
- `packages/frontend/pages/organizer/promote/[saleId].tsx` (new)

**Patrick PS1-pushed:**
- `packages/backend/src/index.ts` (export route registration)
- `claude_docs/STATE.md`
- `claude_docs/session-log.md`
- `claude_docs/next-session-prompt.md`
- `context.md`
- `.checkpoint-manifest.json`

## Open Items (Carry Forward)

- **P2:** Item thumbnail images on Review & Publish page break on reload (Cloudinary URLs fail on subsequent navigation)
- **Schema tech debt:** `aiConfidence Float @default(0.5)` should be `Float?`
- **Brand Voice session** — recommended before Listing Factory ships to marketplace
- **QA note from #24:** Pre-existing ownership gap in `updateHold`
- **Sprint 2 QA:** Not yet run — dispatch findasale-qa this session

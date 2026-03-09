# G-Batch: Cowork Platform Research Sweep

Created: Session 96 (2026-03-09)
Status: Complete
Backlog refs: G1, G2, G3, G4, G5, G7, G9, G10, G11, G12, G13

---

## G1: Sentry MCP Connector — EXISTS

Official Sentry MCP server at `https://mcp.sentry.dev/mcp`. Uses remote OAuth —
nothing to install locally. Can pull errors, search across projects, retrieve
root cause analysis. Works with Claude Code and Cowork.

**Recommendation:** Connect this. When Sentry fires on a production error, Claude
can pull the issue details and start debugging immediately.

**Setup:** Add to MCP config, authenticate via OAuth when prompted.

---

## G2: Claude Code GitHub Actions — EXISTS

Official action: `anthropics/claude-code-action`. Triggers on @claude mentions in
PR comments, issue assignments, PR open/update events, or manual dispatch.
Can auto-review PRs, generate code from issues, update docs.

**Recommendation:** High value. Set up auto-PR-review on the findasale repo.
Requires `ANTHROPIC_API_KEY` in GitHub repo secrets.

**Setup:** Run `/install-github-app` in Claude Code, or add workflow YAML manually.

---

## G3: Claude Code Remote Control — EXISTS

Two methods:
1. **Remote Control:** `claude remote-control` — control a local session from
   phone/tablet via session URL or QR code. Requires Pro+ plan.
2. **Headless Mode:** `claude -p "prompt" --format=json` — run programmatically
   for CI/CD, batch processing, scheduled tasks. Returns structured output.

**Recommendation:** Headless mode is the key to scheduled autonomous work.
Could power GitHub Actions and cron-triggered tasks.

---

## G4: /rewind Command

Not specifically researched in this batch. Based on Claude Code docs, `/rewind`
likely rolls back conversation to a previous state. Test in next session.

---

## G5: /context Command

Already verified working in session 91. Shows context window breakdown:
system prompts, tools, memory, messages. Use regularly for health monitoring.

---

## G7: Status Line for Context

Configurable via `/statusline` command. Can show context usage %, session cost,
git status. Custom shell scripts receive JSON session data. See E2 research
for full details.

---

## G9: Visual Explainer — USEFUL

GitHub: nicobailon/visual-explainer. Converts terminal output into interactive
HTML: styled tables, Mermaid diagrams, dashboards. Has commands for generating
web diagrams and project recaps.

**Recommendation:** Could visualize our agent fleet topology, skill connections,
and data flow. Medium priority — nice-to-have for documentation.

---

## G10: Zapier MCP — EXISTS

Available in MCP registry. Can automate workflows across thousands of apps
via conversation. Would enable email notifications, Slack updates, task routing
without custom code.

**Recommendation:** Connect when we have specific automation needs (e.g., new
organizer signup → Slack notification → onboarding email sequence).

---

## G11: Boris Cherney's Workflows — KEY INSIGHTS

Boris Cherney (Head of Claude Code at Anthropic) published practices:

1. **Parallel execution:** 5-10 simultaneous agent threads via iTerm2.
2. **Single CLAUDE.md:** Encode all learned anti-patterns in one file in git.
   "Anytime Claude does something wrong, add it to CLAUDE.md."
3. **Specialized sub-agents:** Code-simplifier agents post-refactor,
   verify-app agents for E2E testing before shipping.
4. **Verification loops:** Use Chrome extension to test every change in
   real UI before commit — improves quality "2-3x".
5. **Model choice:** Exclusively Opus with extended thinking for quality.

**Recommendation:** We're already doing #2 (CLAUDE.md + CORE.md anti-patterns).
Adopt #3 (specialized verify agents) and #4 (Chrome verification) more formally.

---

## G12: Cozempic — RELEVANT

GitHub: Ruya-AI/cozempic. Context management tool for Claude Code sessions.
Identifies and removes bloat from session history (progress messages, stale reads,
thinking blocks). Implements five-layer safeguards against "lead agent amnesia."
Reduces 8-46MB sessions to usable sizes.

**Recommendation:** Evaluate for our long sessions. Could help with E1/E10
(context management during continuous work). Patrick would install locally.

---

## G13: GSD Framework — HIGHLY RELEVANT

GitHub: gsd-build/get-shit-done. Meta-prompting system for autonomous agent work:

1. Idea → Roadmap → Phase Plan → Atomic Execution
2. Each phase = 2-3 sub-tasks consuming ~50% of 200k token budget
3. Fresh context per sub-agent (no context rot)
4. Includes `/gsd:verify-work` for visual confirmation
5. Used at Amazon, Google, Shopify

**Recommendation:** This is exactly what E1/E6 are trying to solve. Evaluate
adopting GSD's phase-plan pattern for our sprint execution. Could replace or
complement our steelman method (E6).

---

## Priority Actions

| Item | Priority | Next Step |
|------|----------|-----------|
| G1 Sentry MCP | P1 | Patrick connects in Cowork MCP settings |
| G2 GitHub Actions | P1 | Patrick sets up API key + workflow YAML |
| G3 Headless mode | P2 | Test with scheduled tasks |
| G13 GSD framework | P1 | Evaluate for sprint execution pattern |
| G12 Cozempic | P2 | Patrick installs, test on next long session |
| G10 Zapier MCP | P3 | Connect when automation needs arise |
| G9 Visual Explainer | P3 | Nice-to-have for fleet visualization |

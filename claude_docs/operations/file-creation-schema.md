# File Creation Schema — Naming & Folder Conventions

Created: Session 96 (2026-03-09)
Status: Active (enforceable via CORE.md + conversation-defaults)
Backlog ref: E17

---

## Naming Conventions

### Authority Documents (Tier 1)

Format: `UPPERCASE_NAME.md`
Location: `claude_docs/`
Examples: `CORE.md`, `STATE.md`, `STACK.md`, `SECURITY.md`, `RECOVERY.md`

Only these files use UPPERCASE. Adding a new Tier 1 doc requires Patrick's approval.

### Living Documents (Tier 2)

Format: `kebab-case-topic.md`
Location: Appropriate subdirectory of `claude_docs/`
Examples: `organizer-guide.md`, `content-calendar.md`, `audit-coverage-checklist.md`

No date suffix — these are updated over time.

### One-Time Artifacts (Tier 3)

Format: `kebab-case-topic-YYYY-MM-DD.md`
Location: `claude_docs/archive/` (or working directory until complete, then archived)
Examples: `competitive-analysis-2026-03-06.md`, `health-scout-pre-beta-2026-03-07.md`

Always include date. Archive on completion.

### Operations Documents

Format: `kebab-case-topic.md`
Location: `claude_docs/operations/`
Examples: `model-routing.md`, `session-safeguards.md`, `heartbeat-protocol.md`

These are living process docs — no date unless they're one-time.

### Research Documents

Format: `backlog-id-topic.md`
Location: `claude_docs/research/`
Examples: `e2-token-budget-monitoring.md`, `e16-worktrees-multi-terminal-research.md`

Include backlog ID prefix for traceability.

### Session Logs

Format: Append to `claude_docs/logs/session-log.md`
Do NOT create individual session files.

## Folder Map

```
claude_docs/
├── CORE.md, STATE.md, STACK.md, SECURITY.md, RECOVERY.md  (Tier 1)
├── BACKLOG_2026-03-08.md  (active backlog — living doc)
├── archive/               (Tier 3 completed artifacts)
│   ├── feature-notes/     (old phase artifacts)
│   ├── health-reports/    (completed scan reports)
│   └── session-retrospectives/
├── beta-launch/           (beta preparation docs)
├── brand/                 (brand assets, guidelines)
├── competitor-intel/      (competitive research)
├── feature-notes/         (active sprint/feature docs)
├── guides/                (user-facing and internal guides)
├── health-reports/        (active/latest scan only — archive old ones)
├── improvement-memos/     (fleet improvement proposals)
├── logs/                  (session-log.md ONLY — no misc files)
├── operations/            (process docs, protocols, tools)
├── research/              (investigation reports, prefixed with backlog ID)
├── self-healing/          (self-healing skills file)
├── skills-package/        (skill documentation)
├── strategy/              (roadmap, business plan, pricing)
└── workflow-retrospectives/ (session efficiency analyses)
```

## Rules

1. **No files in `claude_docs/` root** except Tier 1 authority docs and BACKLOG.
2. **No date-only filenames.** Always include topic.
3. **Research docs always prefixed with backlog ID** (e.g., `e2-`, `e16-`, `g5-`).
4. **Archive on completion.** When a one-time task finishes, move the doc to `archive/`.
5. **logs/ is sacred.** Only `session-log.md` and `.last-wrap` live there. No misc files.
6. **Ask before creating.** See conversation-defaults Rule 7.

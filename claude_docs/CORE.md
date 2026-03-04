# CORE – Behavioral Operating System

Always loaded. Ultra-lean. Authority over behavior.

---

## 1. Primary Directive

Deliver correct results with minimum token usage.
Prevent repair loops by keeping docs, skills, and commands accurate.

These two goals are co-equal. A stale fact that triggers a wasted session
costs more than the tokens saved by not updating it.

Avoid verbosity.
Avoid redundancy.
Avoid architectural drift.
Avoid stale documentation.

---

## 2. Session Init

At the start of every session, before any task work:

1. Check active MCP tools in session context — note GitHub, Slack, Notion, etc. availability
2. Load `claude_docs/CORE.md` — verify behavior rules haven't drifted
3. Load `context.md` — filetree, Docker status, last session summary
4. Load `claude_docs/STATE.md` — current sprint and blockers
5. Skim `claude_docs/session-log.md` — last 1–2 entries for recent decisions

Skip silently if Patrick has already given a task and context was loaded this session.
Do not narrate the load unless asked.

---

## 3. Execution Loop

For non-trivial work:

Survey → Plan → Execute → Verify → Report

During Survey: check `context.md` filetree before using any file-location tool (Glob, find, ls).

Do not skip verification.

---

## 4. Diff-Only Rule

When modifying **any file** (code, docs, config — no exceptions):
- Output only changed sections
- No full rewrites unless Patrick explicitly requests one
- No unchanged context
- Ambiguous phrases like "major rewrite" or "overhaul" do NOT count as requesting a full rewrite — ask first

**Hard gate — announce before every file write:**
Before using the Write or Edit tool on any existing file, state the approach in one line:
- Targeted edit: "Editing [file] lines X–Y"
- Full rewrite: "Rewriting [file] entirely — confirmed by Patrick"

If announcing a full rewrite, Patrick must have explicitly said "rewrite the whole file" or equivalent in that conversation. If unclear, ask: "Should I do targeted edits or a full rewrite?"

This lets Patrick immediately catch unnecessary rewrites. Skipping the announcement is a rule violation.

---

## 5. Auto Compression Protocol

Trigger compression when:
- Response > ~700 tokens
- Multi-step plan emerges
- Context grows across turns

Compression format:
- Current Objective
- Constraints
- Decisions Made
- Open Variables
- Next Step

Replace narrative history with structured summary.

---

## 6. Duplication Guard

If detecting:
- Repeated documentation across layers
- Stack redefinition in packages
- Behavioral rules outside CORE

Flag and recommend consolidation.

No silent duplication.

---

## 7. Authority Order

User
→ CORE.md (operational behavior)
→ Self-Healing Skills (structurally certain patterns, HIGH confidence)
→ conversation-defaults skill (active session rules)
→ Root CLAUDE.md (execution contract)
→ Package CLAUDE.md (scoped constraints)
→ STACK.md (technology decisions)
→ STATE.md (project state snapshot)
→ SECURITY.md / RECOVERY.md (fallback procedures)

Higher layer prevails. Skills override lower layers when pattern confidence ≥ HIGH.

---

## 8. Self-Healing Skills

Before debugging recurring errors, check:
`claude_docs/self_healing_skills.md`

Covers: SSR crashes, JWT payload staleness, unwired frontend stubs, missing Prisma
relation fields, unhandled async failures, unprotected routes, unbounded queries,
missing env vars, Docker/pnpm monorepo startup failures (nodemon not found).

After fixing any bug:
- Check if the pattern exists in `self_healing_skills.md`
- If not, and the pattern has been seen ≥2 times OR is structurally certain to recur,
  add a new entry immediately — do not wait for session wrap

---

## 9. Proactive Health Scanning

Before production deploys or after large sprints, run the health-scout skill.
Recent scan results: `claude_docs/health-reports/` (newest file = latest report).
Weekly scan runs automatically Sunday 11pm via `findasale-health-scout` task.

---

## 10. GitHub Push Batching Rule

When using `mcp__github__push_files`, **never push more than 3 files per call**.
Large batches exceed the output token limit and silently fail or crash the session.

**Rule:** Max 3 files per `push_files` call. If a single file exceeds ~200 lines, push it alone.

**Preferred tool by file size:**
- **Single large file (200+ lines):** Use `mcp__github__create_or_update_file` — isolates token cost to one file per call, more reliable than `push_files` for big files.
- **Small batch (2–3 files, all <200 lines):** Use `mcp__github__push_files` — one commit, clean history.
- **Single small file:** Either tool works. Prefer `create_or_update_file` for simplicity.

**Environment escape hatch:** If medium-large batches consistently fail, `MAX_MCP_OUTPUT_TOKENS` can be raised in `.claude/settings.local.json` (default 25,000). Only increase if chunking alone isn't enough — higher limits consume more context.

**Pattern:**
1. Read all target files in parallel (as many as needed — reads are input tokens, not output)
2. Push in serial batches of ≤3 files, with a descriptive commit message per batch
3. Group small files together; large files (>200 lines) always get their own commit
4. For files >300 lines, always use `create_or_update_file` (requires the file's current SHA)

This applies to every session wrap and any mid-session push. Never revert to a single
giant push to "save commits" — the token limit will kill it.

### MCP vs PowerShell Decision Rule

Use **MCP** (`push_files`) when ALL of the following are true:
- 1–3 files in the batch, AND
- All files were read or edited in the **current turn** (already in context — no re-read cost), AND
- No single file is a large doc (>300 lines) that wasn't actively changed this turn

Tell Patrick **"please run `git push` in PowerShell"** when ANY of the following apply:
- 4+ files need pushing as a group
- Any file is large (>300 lines) and was NOT edited this turn — re-reading it just to push is wasteful
- Session wrap involves >5 changed files total
- A file needs to be re-read from GitHub before pushing (drift scenario — skip MCP, use PowerShell)

### Standing File Rules

- **ROADMAP.md** — Only push in the **same turn** it was edited. Never re-read and re-push across turns.
- **STATE.md** — Push **once**, at session wrap only. Never mid-session.
- **Large docs not touched this turn** — Do not re-read for the sole purpose of pushing. Flag for PowerShell instead.

### Build-Error Fix Protocol (Vercel Deploy Budget)

Vercel free tier = **100 deploys/day**. Every push to `main` burns one.

**Before pushing ANY build fix:**
1. Identify the **pattern** (not just the one file Vercel reported).
2. Grep the entire frontend for that pattern.
3. Fix **every** instance locally or in a single push_files batch.
4. Push once.

Example: Vercel reports `loading` not on `AuthContextType` in `login.tsx`.
Wrong: fix login.tsx, push, wait for build, fix register.tsx, push, wait…
Right: grep for `loading.*useAuth\|useAuth.*loading` across all files,
fix all 6 hits, push one commit.

This rule is enforced by `claude_docs/SECURITY.md` Section 9.

---

Status: Behavioral Authority

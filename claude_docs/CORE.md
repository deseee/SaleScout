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

## 2. Execution Loop

For non-trivial work:

Survey → Plan → Execute → Verify → Report

Do not skip verification.

---

## 3. Diff-Only Rule

When modifying code:
- Output only changed files
- No full rewrites unless requested
- No unchanged context

---

## 4. Auto Compression Protocol

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

## 5. Duplication Guard

If detecting:
- Repeated documentation across layers
- Stack redefinition in packages
- Behavioral rules outside CORE

Flag and recommend consolidation.

No silent duplication.

---

## 6. Authority Order

User  
→ CORE.md  
→ Root CLAUDE.md  
→ Package CLAUDE.md  
→ STACK.md  
→ STATE.md  
→ SECURITY.md / RECOVERY.md  

Higher layer prevails.

---

## 7. Self-Healing Skills

Before debugging recurring errors, check:
`claude_docs/self_healing_skills.md`

Covers: SSR crashes, JWT payload staleness, unwired frontend stubs, missing Prisma
relation fields, unhandled async failures, unprotected routes, unbounded queries,
missing env vars, Docker/pnpm monorepo startup failures (nodemon not found).

---

## 8. Proactive Health Scanning

Before production deploys or after large sprints, run the health-scout skill.
Recent scan results: `claude_docs/health-reports/` (newest file = latest report).
Weekly scan runs automatically Sunday 11pm via `salescout-health-scout` task.

---

Status: Behavioral Authority
# Project Execution Contract – SaleScout

Scope: Entire monorepo

Behavior rules: CORE.md  
Stack authority: STACK.md  
Project memory: STATE.md  
Security: SECURITY.md  
Recovery: RECOVERY.md  

If conflict exists between this file and a package CLAUDE.md,
this file prevails.

Package-level files must not redefine behavior or architecture.

---

## 1. Project Purpose

SaleScout is a PWA for estate sale operators.

Primary goals:
- Reduce manual work
- Simplify sale management
- Improve inventory visibility

---

## 2. Monorepo Structure

packages/
- backend
- frontend
- database
- shared

Each package contains a scoped CLAUDE.md.
They may constrain locally but not redefine architecture.

---

## 3. Cross-Layer Contracts

Database owns schema.
Backend owns business logic and API contract.
Frontend owns UI and presentation.
Shared owns cross-boundary types only.

No logic duplication.
No schema outside database.
No API formatting outside backend.

---

## 4. Operational Rules

- Never use `git add -A` — stage files explicitly by name
- Full safety and backup rules: `claude_docs/SECURITY.md`

---

## 5. Context Discipline

Do not restate:
- Tech stack
- Security rules
- Recovery steps
- Behavioral compression rules

Reference authoritative file instead.

---

Status: Project Authority Layer
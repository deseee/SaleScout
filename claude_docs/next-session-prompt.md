# Next Session Prompt — S241

**Date:** 2026-03-22 (S240 wrap complete)
**Status:** 12 audit findings fixed and pushed. D-007 locked. Site should be clean.

---

## S241 Priority

**1. Live-verify S240 fixes (Chrome MCP — do this first):**
- Item pages: click any item from a sale → should load item detail, not "Item not found"
- `/settings` logged out: should redirect to `/login?redirect=/settings`, not hang
- `/notifications` logged out: should show single layout, no DOM duplication
- `/hubs`, `/categories`, `/calendar`, `/cities`, `/neighborhoods`: should no longer say "estate sales" only

**2. Implement D-007 — Teams tier member cap:**
Schema change required. Dispatch findasale-architect first for schema design, then findasale-dev for implementation.
- Add `isEnterpriseAccount Boolean @default(false)` to Org model in schema.prisma
- Add backend enforcement: reject team member additions > 12 for non-Enterprise orgs
- Update pricing page: Teams tier shows "Up to 12 members" + Enterprise CTA
- Update team management UI: show member count vs cap

Per CLAUDE.md §6, this requires Patrick to run:
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy
npx prisma generate
```

**3. Mobile real-device test (L-002 carry-forward):**
Browser automation cannot simulate mobile viewport. Patrick should spot-check on real iPhone SE or similar:
- Homepage, sale detail, item grid, nav/bottom tab, pricing page

---

## Context Loading

- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)
- Read `claude_docs/brand/DECISIONS.md` at session start (mandatory)
- D-007 now locked — implementation pending, do not re-discuss tier numbers

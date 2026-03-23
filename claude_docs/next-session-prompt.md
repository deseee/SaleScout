# Next Session Prompt — S248

**Date:** 2026-03-23 (S247 wrap complete)
**Status:** Role-based nav and organizer profile fixed. Destructive removal pattern identified — needs permanent fix.

---

## FIRST TASK — Verify S247 Vercel build

S247 pushed 4 commits. Confirm Vercel deployment is GREEN before any new work:
- Commit 1aa1082: role-based nav + organizer profile sections
- Commit c4b40fa: restore "My Wishlists" link
- Commit fcfa835: verificationStatus type fix (was breaking Vercel build)

If Vercel is erroring, fix the build first.

---

## S248 Priority 1 — Full Feature/Nav Audit Against Roadmap

Patrick wants a comprehensive audit of all features vs. what's in the nav. The goal: every feature that exists should be reachable by every role that needs it, and nothing should be ambiguously labeled.

**Scope:**
1. Inventory every page/route in `packages/frontend/pages/` (organized by role: shopper, organizer, admin, public)
2. Cross-reference against every nav link in: AvatarDropdown.tsx, Layout.tsx mobile drawer, Layout.tsx desktop header, BottomTabNav.tsx, footer
3. Flag: pages with no nav link, nav links pointing to 404s, features accessible by the wrong role, ambiguous labels
4. **Specific known issue:** "My Wishlists" in AvatarDropdown → `/shopper/favorites` (favorites page, not wishlists). Mobile drawer "My Wishlists" → `/wishlists` (actual wishlists). These are two different features — favorites (flat heart-saves) vs wishlists (named shareable collections). Patrick needs a recommendation on labels, routes, and whether to unify.

**Output:** A table mapping every route to its nav entry (or "MISSING"), role access, and recommended action. Patrick will review before any changes are made.

---

## S248 Priority 2 — Permanent Fix for Destructive Removal Pattern

This is the #1 recurring problem across sessions. Pattern: something gets flagged in an audit → subagent "fixes" it by removing the thing → nobody asks Patrick whether removal was the right call.

**Examples:**
- S237: Audit said "organizers shouldn't see shopper content" → subagent hid everything instead of building replacement content
- S247: "My Wishlists" flagged as 404 → subagent removed the link instead of asking Patrick whether to fix the route, redirect, or remove
- Multiple prior sessions: nav links, features, and UI elements removed as "fixes" without surfacing the decision

**What needs to change (Patrick and Claude to decide together):**
1. **CLAUDE.md §7 (Subagent Implementation Gate):** Add a "Removal Gate" — any subagent action that removes a feature, nav link, UI element, route, or user-facing content must be flagged to the main session with options (remove / fix / redirect / replace), not executed autonomously.
2. **findasale-dev SKILL.md:** Add a pre-edit check — before any deletion of JSX, routes, or links, dev agent must list what's being removed and why, and return it as a decision point rather than shipping it.
3. **findasale-qa SKILL.md:** QA findings that recommend removal should explicitly say "DECISION NEEDED: remove vs fix vs redirect" — not "remove this."
4. **Possibly a new DECISIONS.md entry** locking the pattern as a permanent rule.

**Process:** Claude drafts the changes → Patrick reviews → changes get applied to CLAUDE.md (git push) and skills (skill-creator + install).

---

## Carry-Forward QA Items

These are lower priority than P1 and P2 above:

| Item | Status | Notes |
|------|--------|-------|
| Message reply E2E (D1) | ❌ UNVERIFIED | Conversation links didn't navigate in Chrome MCP |
| /profile edit buttons (C1) | ⚠️ NEEDS DECISION | Patrick hasn't answered: should profile have edit buttons? |
| Purchases tab (B3) | ⚠️ PARTIAL | Tab present, content not tested |
| Pickups tab (B4) | ⚠️ PARTIAL | Tab present, content not tested |
| Dark mode full pass | ⏸ DEFERRED | Not run in S246 or S247 |
| Mobile 375px (L-002) | ⏸ DEFERRED | Carry-forward from S244 |

---

## Context Loading

- Read `claude_docs/brand/DECISIONS.md` at session start
- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)
- Auth rate limit is 50 failed attempts per 15 min
- S247 files changed: AvatarDropdown.tsx, Layout.tsx, profile.tsx, AuthContext.tsx

---

## S247 Files Changed (for Patrick git tracking)

- `packages/frontend/components/AvatarDropdown.tsx` — admin detection, shopper "My Dashboard", organizer "My Profile", "My Wishlists" preserved
- `packages/frontend/components/Layout.tsx` — mobile drawer: shopper dashboard relabeled, profile links added for both roles
- `packages/frontend/pages/profile.tsx` — 3 organizer sections (Verification Status, Your Sales, Quick Links) + verificationStatus fetched from API
- `packages/frontend/components/AuthContext.tsx` — added verificationStatus to User interface

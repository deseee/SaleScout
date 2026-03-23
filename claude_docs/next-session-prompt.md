# Next Session Prompt — S245

**Date:** 2026-03-22 (S244 wrap complete)
**Status:** M1 fixed (unbounded findMany). Dark mode badge/avatar fixes. Meta descriptions broadened.

---

## S245 Priority

**Priority 1 — POST-FIX VERIFICATION (CLAUDE.md §10):**
Spot-check S244 fixes in Chrome MCP at finda.sale:
- Messages dark mode: profile.tsx badges, messages/index.tsx + [id].tsx avatars render correctly dark mode
- About page: dark background is consistent (dark:bg-gray-900)
- Cities/neighborhoods: meta descriptions now include all sale types

**Priority 2 — MESSAGE REPLY END-TO-END TEST:**
Critical for organizer↔shopper communication flow. Send message as `user2@example.com` (organizer), reply as `user11@example.com` (shopper), verify both sides see reply.

**Priority 3 — PATRICK MANUAL ACTIONS:**
Obtain and add missing environment variables to `packages/backend/.env`:
- `MAILERLITE_API_KEY` — get from MailerLite Integrations → API Keys
- `DEFAULT_REGION`, `DEFAULT_LATITUDE`, `DEFAULT_LONGITUDE` — geographic defaults for sales without coordinates

**Priority 4 — BETA TESTER FEEDBACK TRIAGE:**
Real customers evaluating this week. Respond to any reported issues before starting new feature work.

**Priority 5 — OPTIONAL CLEANUP (if time):**
- L-002: Mobile viewport real-device test (needs real iPhone or skip)
- M2: Review 13 TODO/FIXME markers in backend (informational only)

---

## Context Loading

- Read `claude_docs/brand/DECISIONS.md` at session start (mandatory)
- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)
- Auth rate limit is 50 failed attempts per 15 min
- QA skill v2 installed — Chrome MCP clickthrough-first methodology
- All S243 + S244 fixes deployed to production

---

## S244 Files Changed

- `packages/backend/src/controllers/exportController.ts` — M1 fix (take: 5000 limits)
- `packages/frontend/pages/profile.tsx` — dark mode badge fixes
- `packages/frontend/pages/messages/index.tsx` — dark mode avatar fix
- `packages/frontend/pages/messages/[id].tsx` — dark mode avatar fix
- `packages/frontend/pages/about.tsx` — dark:bg-gray-900 consistency
- `packages/frontend/pages/cities/index.tsx` — meta description broadened
- `packages/frontend/pages/neighborhoods/index.tsx` — meta description broadened
- `packages/frontend/pages/neighborhoods/[slug].tsx` — metaDesc broadened

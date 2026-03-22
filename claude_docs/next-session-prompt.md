# Next Session Prompt — S240

**Date:** 2026-03-22 (S239 wrap complete)
**Status:** Automated audit ran — 4 HIGH findings blocking beta. Fix these first.

---

## S240 Priority — Automated Audit Findings (dispatch dev immediately)

🔴 **H-004 FIRST — Nested `<main>` tags sitewide** — Layout wraps in `<main>` AND page components also use `<main>`. Invalid HTML across every page, accessibility violation, likely root cause of H-003. Fix Layout.tsx to use `<div>` instead of `<main>`, or fix page components.

🔴 **H-001 — Item pages broken for all shoppers** — `/items/[id]` shows "Item not found" for every item. Core shopper flow is broken right now. Beta testers cannot view items.

🔴 **H-002 — `/settings` hangs for logged-out users** — Shows "Redirecting to your settings..." forever. Never redirects to login. Blank page title.

🔴 **H-003 — `/notifications` DOM duplication** — Entire page layout nested inside itself. Likely caused by H-004 (nested main tags).

⚠️ **D-001 drift — 9 pages still use estate-sale-only language** — Dispatch findasale-dev to sweep and fix per brand-voice-guide.

Full audit: `claude_docs/audits/weekly-audit-2026-03-22.md`

---

## Patrick Actions Before S240

1. **Discard 9 stale local files** (already on GitHub from MCP push):
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git checkout -- packages/frontend/components/Layout.tsx packages/frontend/components/NotificationBell.tsx packages/frontend/pages/hubs/[slug].tsx packages/frontend/pages/hubs/index.tsx packages/frontend/pages/items/[id].tsx packages/frontend/pages/organizer/message-templates.tsx packages/frontend/pages/organizer/workspace.tsx packages/frontend/pages/profile.tsx packages/frontend/pages/shopper/dashboard.tsx packages/frontend/pages/shopper/disputes.tsx
```

2. **Push sale detail fix:**
```powershell
git pull
git add packages/frontend/pages/sales/[id].tsx
git commit -m "fix: sale detail layout - remove duplicate photos, move About into left column, reorder Items before UGC/Map"
.\push.ps1
```

3. **Skills already installed** (confirmed in session) — Polish Agent, findasale-dev patch, findasale-qa patch all active.

---

## Carry-Forward Decisions

- D-007: Teams tier member cap — 10 or 15? Enterprise above?
- Resend quota: Brevo (free) or Postmark ($15/mo)?
- Innovation: Reputation + Condition Tags as P0 pre-beta?

---

## Context Loading

- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)
- Read `claude_docs/brand/DECISIONS.md` at session start (mandatory)

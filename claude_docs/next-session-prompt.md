# Next Session Prompt — S238

**Date:** 2026-03-22 (S237 wrap complete)
**Status:** S237 fixes live in production. City/state data fixed. Beta testers evaluating this week.

---

## No Pending Patrick Actions

All S237 work is done. The fix-seed-city.ts script ran successfully (25 sales + 10 organizers updated to Grand Rapids, MI). No blocking manual steps.

---

## Session Start Checklist

1. Load `STATE.md` — reflects S237 completion
2. No mandatory smoke test this session (S237 smoke test passed cleanly)

---

## S238 Priority: Role Walkthrough + Mobile Verification

**1. Full role walkthrough (deferred from S237):**
- Walk through as SHOPPER (`user11@example.com` / `password123`): browse → search → view sale → view items → favorite → message organizer
- Walk through as ORGANIZER (`user2@example.com` / `password123`): dashboard → create sale → add items → AI tagging → publish → view analytics
- Walk through as unauthenticated user: browse → try to interact → login flow → back to where they were

**2. Mobile verification:**
- PWA install prompt working?
- Touch targets large enough?
- No horizontal scroll?
- Navigation usable on small screens?

**3. Resend quota decision (Patrick):**
- Free plan: 100 emails/day. Weekly digest burns ~80/day on Sundays.
- Brevo free: 300/day, no-code switch (1 backend file)
- Postmark: best deliverability, $15/mo
- Decide before beta user count grows enough to risk Sunday quota failure

---

## Pending Patrick Decisions

1. Review `claude_docs/research/INNOVATION_HANDOFF_S236.md` — confirm Reputation + Condition Tags as P0 pre-beta
2. Confirm sale-type-aware discovery as Q3 feature
3. Resend → Brevo or Postmark upgrade (see above)

---

## Context Loading

- `claude_docs/patrick-dashboard.md` — one-pager status
- Test accounts: Shopper `user11@example.com`, PRO Organizer `user2@example.com`, SIMPLE+ADMIN `user1@example.com`, TEAMS `user3@example.com` (all `password123`)

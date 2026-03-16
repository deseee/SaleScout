# Next Session Prompt — Session 176
*Written: 2026-03-15 (S175 wrap)*
*Session ended: normally*

## Resume From

S175 shipped 3 changes: #66 routing fix, P1 CSV injection fix, #31 Brand Kit UI. All features ready for integration. Build green. Railway and Vercel healthy.

## Priority 1 (Must Do First): #65 Feature Tier Matrix Discussion

Before dispatching dev on #65 Organizer Mode Tiers, Patrick and Claude must agree on feature gating:

**Decision Needed:**
- Which existing features belong in SIMPLE (free) vs PRO (paid) vs ENTERPRISE (future)?
- Which new features (#41 Flip Report, etc.) go in which tier?

**Constraints:**
- No organizer has used most features yet (zero "bait and switch" risk)
- Can gate from launch without breaking existing users
- ADR-065 architect recommendation exists (see below)

**Architect Recommendation (ADR-065):**
- **SIMPLE:** Core sale creation, holds, basic reminders, email/SMS
- **PRO:** Auctions, flash deals, Brand Kit, Flip Report, QR codes, bulk CSV, tags, exports, batch operations, performance analytics
- **ENTERPRISE:** Teams, API access, webhooks, white-label, 2.5% fee discount

**Once matrix agreed:**
- Dispatch findasale-dev for #65 implementation (schema + middleware + frontend toggle + admin panel)
- Est. 8–11 hours
- No Stripe integration needed for MVP (just admin toggle, Stripe hooks in Phase 2)

## Priority 2 (Parallel After #65 Dispatch): #41 Flip Report

- Post-sale analytics PDF/dashboard
- ~15–18 hrs implementation
- Dispatch findasale-architect first for spec, then findasale-dev
- Becomes PRO-tier feature once #65 ships

## Priority 3 (Quick Inline Fixes): P2 Bug Fixes

From health-scout S175:
- `reminderController.ts`: Add `reminderType` whitelist validation (should validate `['email', 'push']` before DB write) — <10 lines
- `exportController.ts`: Add `archiver` stream error handler for client disconnect mid-download — <10 lines

Both qualify as inline edits. Can be done before or after #65/#41.

## Session Init Checklist for S176

- [x] Load STATE.md and this next-session-prompt.md
- [ ] Do NOT load production code files (>200 lines) at init — reference by path in dispatch prompts instead
- [ ] Check Railway + Vercel green (fetch root endpoint)
- [ ] Apply statusline reinstall if needed (per CLAUDE.md §4)
- [ ] Log init checkpoint (budget gate: abort if >10k tokens estimated)

## What Completed S175

- #66 routing bug fixed (404 → 401)
- P1 CSV injection fixed (escapeCSV formula injection prevention)
- #31 Brand Kit UI shipped (page + fields + dashboard link)
- T1–T7 token efficiency rules locked in CORE.md
- ADR-065 produced (Organizer Mode Tiers strategic approval)

## Blockers

None. All S175 work integrated and ready.

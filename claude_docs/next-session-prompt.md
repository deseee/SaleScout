# Next Session Resume Prompt
*Written: 2026-03-04 (session 32 — M-series medium findings + push batching rule)*
*Session ended: normally*

## Resume From

Decide: tackle remaining M-series medium audit findings (ST1, ST2, E1, E2, E4, E5, E6, PF1, S1) or move directly to real-user beta. Ask Patrick which path.

## What Was Completed This Session

- **E3** — Shared Prisma singleton (`lib/prisma.ts`); removed `new PrismaClient()` from 10 backend files
- **ST3** — Stripe webhook verifies `on_behalf_of` vs organizer `stripeConnectId` before marking PAID
- **ST4** — Fee math uses integer cents (`Math.round(price * 100)`) to eliminate float rounding
- **DB2** — User + organizer creation wrapped in `prisma.$transaction()` in authController
- **E7** — AuthContext checks JWT `exp` before any API call; clears stale token cleanly
- **EM2/EM3** — `withRetry()` exponential backoff for Resend (2x) + Twilio (4x on 429) in emailReminderService
- **P1** — iCal `generateIcal` returns 400 if `startDate` or `endDate` missing
- **EC1, DB1** — Verified already implemented/clean; no fix needed
- **CORE.md Section 10** — GitHub push batching rule permanently added: max 3 files per `push_files` call
- All 14 changed files pushed to GitHub in 6 batched commits (deseee/findasale, main)

## What Was In Progress

Nothing — session completed cleanly.

## Remaining M-Series Findings

Not yet addressed — from `claude_docs/audit-remaining-areas-2026-03-03.md`:
ST1, ST2, E1, E2, E4, E5, E6, PF1, S1

Read the audit file at session start for accurate descriptions before beginning.

## Environment Notes

- All changes are on GitHub `main`. No pending local-only changes.
- Docker containers may need `docker compose restart backend` to pick up the new shared Prisma singleton.
- No schema changes this session — no migration needed.

## Critical Rule (Read Before Any GitHub Push)

`claude_docs/CORE.md` Section 10 is now active. Summary:
> Max 3 files per `push_files` call. Files >200 lines push alone. Read all files in parallel first, then push in serial batches of ≤3.

This was added after a token-overflow failure when pushing 14 files at once. It must be followed on every future push without exception.

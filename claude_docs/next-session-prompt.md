# Next Session Resume Prompt — S213
*Written: 2026-03-20*
*Session ended: normally*

---

## Resume From

Run a Chrome verification pass on all S212+S213 fixes — none have been live-verified since the S211 audit. Then integrate `LiveFeedTicker` into the sale detail page to complete #70.

---

## Chrome Verification Needed (everything since S211 audit)

**From S212 (all P0 fixes — should no longer crash):**
- `/encyclopedia` — EncyclopediaCard null ref fix
- `/organizer/workspace` — workspace 401 fix (TEAMS user should load)
- `/organizer/command-center` — hooks order fix
- `/organizer/typology` — hooks order fix
- `/wishlists` — redirect fix (`/auth/login` → `/login`)
- `/organizer/sales` — new page should show sale list
- `/organizer/premium` — dark mode variants should render
- `/organizer/insights` — dark mode headings (`dark:text-warm-100` added)
- `/organizer/messages` — blank page fix
- `/organizer/subscription` — PRO/TEAMS user should see support msg (not upgrade CTA)
- `/organizer/webhooks` — SIMPLE/PRO should see TierGate upgrade prompt

**From S213:**
- Cities page shopper UI — `GET /sales/cities` dropdown should now populate
- `/organizer/item-library` — no double headers
- `/organizer/photo-ops/[saleId]` — no double headers
- Layout ThemeToggle — desktop nav should have only one toggle

---

## What Still Needs Doing

**High priority:**
1. **LiveFeedTicker page integration** — `LiveFeedTicker.tsx` and `useLiveFeed.ts` exist but are not imported on any page. Place on sale detail page (`/sales/[slug]` or `/sale/[id]`) or organizer live dashboard. This is the final step for #70.

**P2 backlog (post-beta fine to defer):**
- Inconsistent error shapes: some controllers use `{ message }`, others `{ error }`
- Missing pagination on organizer holds list
- N+1 pattern in hub membership display

**Clear to deploy:**
- #19 Passkey — QA-cleared, no further code changes needed

---

## Environment Notes
- Railway and Vercel both GREEN as of S213 end
- `pnpm-lock.yaml` committed with redis + @socket.io/redis-adapter packages
- Local git synced with remote (merge conflicts resolved)
- `.\.push.ps1` for all git pushes (never `git push` directly)

---

## Key Pattern
**`prisma.sale.groupBy` with `_count` is broken in this Prisma version** — always use `$queryRaw` for grouped aggregates. COUNT(*) returns `bigint` — convert with `Number(item.count)`.

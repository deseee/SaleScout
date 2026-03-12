# Next Session Resume Prompt
*Written: 2026-03-12*
*Session ended: normally*

## Resume From

**Decision needed: How does FindA.Sale collect the 10% platform fee on cash sales?**

Card payments are handled automatically — Stripe Connect captures the full cart total, transfers `amount - 10%` to the organizer's connected account, and FindA.Sale retains the fee. No manual work required.

Cash payments have no equivalent mechanism. The `/stripe/terminal/cash-payment` endpoint records the sale and marks items SOLD, but the 10% platform fee is never collected. FindA.Sale is currently providing cash payment recording as a free feature with no revenue attached.

## The Question

What is the intended collection mechanism for cash sales?

**Option A — Invoice post-sale:** At sale close, generate an invoice to the organizer for 10% of total cash sales. Organizer pays manually (bank transfer, card, etc.).

**Option B — Deduct from next card payout:** When an organizer receives their next Stripe Connect payout, reduce it by the accumulated cash fee balance. Requires tracking `cashFeeOwed` on the Organizer record.

**Option C — Upfront deposit / prepaid balance:** Organizers pre-fund an account balance; cash sale fees are debited in real-time. Blocks sale start until balance is sufficient.

**Option D — Cash sales are free (0% fee):** Platform fee only applies to card transactions. Cash recording is a free feature to drive adoption.

**Option E — Honor system for beta:** Don't build infrastructure now. Collect manually during beta, decide based on real organizer cash-to-card ratio data.

## What Was Completed Last Session (152)

- Duplicate itemId guard in both POS payment flows — commit `3119821`
- Error messages now show item titles, not raw DB UUIDs — commit `3957771`
- POS item search now filters by q/status/limit — sold items no longer appear — commit `e0f4287`
- Inline cash received numpad — live change/short display, independent from price numpad — commit `9b813dc`

## Files Changed (All on GitHub via MCP)

- `packages/backend/src/controllers/terminalController.ts`
- `packages/backend/src/controllers/itemController.ts`
- `packages/frontend/pages/organizer/pos.tsx`

All 4 commits already on GitHub main — no push needed unless local diverged.

## Suggested Session 153 Approach

1. **findasale-investor** — quick ROI/cost-benefit on Options A–E (revenue per option, build cost, expected cash-to-card ratio for estate sales)
2. **findasale-advisory-board** (Ship-Ready subcommittee) — decision recommendation
3. **Patrick decides** — lock the approach
4. If non-trivial (Options B or C): **findasale-architect** → schema + API design, then **findasale-dev** → implement

## Environment Status

**GitHub:** All session 152 commits on main (via MCP).

**Neon:** Migration `20260312000002_add_purchase_pos_fields` **STILL PENDING** — required for POS to work in production. Deploy before real-hardware testing.

**Vercel:** Should be auto-deploying. Session 152 pos.tsx change (inline numpad) pending Vercel deploy confirmation.

**POS:** Code-complete and tested in simulated mode (session 151). Session 152 fixes are incremental improvements on top of working code.

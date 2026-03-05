# Next Session Resume Prompt
*Written: 2026-03-05T00:00:00Z*
*Session ended: normally — Sprint Track T–X fully complete*

## Resume From

Run `prisma migrate deploy` on Neon for 3 pending migrations (see below), then decide what Sprint Y looks like.

---

## What Was In Progress

Nothing mid-task. All sprints complete.

---

## What Was Completed This Session

- **V2** — Instant payouts: `payoutController.ts`, `pages/organizer/payouts.tsx`, 4 new stripe routes
- **V3** — UGC missing-listing bounties: `MissingListingBounty` model + migration, `bountyController.ts`, `routes/bounties.ts`, `pages/organizer/bounties.tsx`, `components/BountyModal.tsx`
- **W1** — Shipping: `shippingAvailable`/`shippingPrice` on Item + migration, item CRUD updated, payment intent accepts `shippingRequested`
- **W2** — Label PDF: `labelController.ts` (pdfkit), single-item `/api/items/:id/label` + all-items `/api/sales/:saleId/labels`
- **X1** — Zapier webhooks: `webhookService.ts` (HMAC-SHA256), `webhookController.ts`, `routes/webhooks.ts`, `pages/organizer/webhooks.tsx`; hooks in `itemController` (`bid.placed`) and `stripeController` (`purchase.completed`)
- Full post-launch Sprint Track T–X now complete

---

## Environment Notes

⚠️ **3 migrations pending on Neon — run before next deploy:**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_6CVGh8YvPSHg@ep-plain-sound-aeefcq1y-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$env:DIRECT_URL="postgresql://neondb_owner:npg_6CVGh8YvPSHg@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
pnpm run db:generate
npx prisma migrate deploy
```
Migrations: `20260305000006_v3_bounties`, `20260305000007_w1_shipping`, `20260305000008_x1_webhooks`

- Phase 31 OAuth env vars still needed in Vercel
- After migration deploy, Docker `docker compose build --no-cache backend && docker compose up -d` to pick up new Prisma client

## Items Built But Not Yet Wired Into UI

- `BountyModal` component exists at `components/BountyModal.tsx` — needs to be imported into `pages/sales/[id].tsx` to be visible to buyers
- Label print buttons not yet added to organizer sale management UI — endpoints exist at `/api/items/:id/label` and `/api/sales/:saleId/labels`

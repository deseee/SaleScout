# Next Session Resume Prompt
*Written: 2026-03-04T05:00:00Z*
*Session ended: normally*

## Resume From

Research-only session. Find open-source code to sample from for the next three roadmap features **before writing any code**. Output a single research doc at `claude_docs/feature-research-2026-03-04.md` with snippets, library picks, and a build-first order recommendation per feature.

## What Was In Progress

Nothing in flight. All bugs and audit findings closed.

## What Was Completed This Session

- Component drift audit + fixes: SaleCard shared type, nested anchor HTML fix, Layout `staticNavLinks` array, homepage and city page `<SaleCard>` replacement
- Bug fixes: password reset token removed from console log (HIGH), 3DS redirect handling in purchases.tsx, staleTime 60s→20s
- Verified M-series ST1/ST2/E1/E2 and Vercel/Stripe rebrand items already closed
- Commits: `72379f9`, `517f843`, `b7d207b` — all on GitHub main

## Research Goals

Three upcoming roadmap features, in priority order:

### 1. Phase 12 — Socket.io Auction Bidding
What to find:
- Open-source Socket.io auction/bidding room implementations (GitHub: `socket.io auction bidding`)
- Race condition handling — two bids arriving simultaneously (DB-level lock or optimistic lock?)
- Room lifecycle: create, join, bid, close, winner notification
- Reconnection handling (shopper drops WiFi mid-auction)
- Load testing patterns for 100+ concurrent bidders
- Whether Pusher Channels is a simpler alternative worth evaluating

Read first: `packages/backend/src/jobs/auctionJob.ts` and `packages/backend/src/routes/auctions.ts` — understand what's already scaffolded before searching externally.

### 2. Phase 9 — Creator Dashboard Analytics
What to find:
- UTM click tracking + aggregation at the DB level (no GA dependency)
- Referral conversion attribution (link visit → signup → purchase — how do you chain the attribution?)
- Open-source affiliate dashboard examples (GitHub: `affiliate tracking nodejs prisma`)
- Simple shortlink generation pattern

Read first: `packages/database/prisma/schema.prisma` (AffiliateLink model), `packages/frontend/pages/creator/dashboard.tsx` (current state of the UI).

### 3. Phase 11 — PWA Push Notifications
What to find:
- `web-push` npm package: VAPID key setup, sending a push from Node.js, subscription storage schema
- Service worker `push` event → show notification → `notificationclick` deep-link to `/sales/[id]`
- Subscription lifecycle management (user revokes → backend cleans up stale endpoints)
- Google Web Push codelab patterns

Read first: `public/sw.js` and `pages/_app.tsx` ServiceWorkerUpdateNotifier — understand what's already hooked up.

## Research Deliverable

`claude_docs/feature-research-2026-03-04.md` containing:
- Per feature: 2-3 code snippets to sample, recommended libraries, "what to build first" order
- Conflicts with existing scaffold code (flag anything that will need rework)
- Rough complexity estimate (LOC, risk areas)

## Environment Notes

- All fixes on GitHub main — no pending pushes
- No Docker restarts or migrations needed (research only)
- GitHub MCP is active — use `mcp__github__get_file_contents` to read existing scaffold before searching externally

# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

Parallel path model active (5 tracks). MVP stable in Grand Rapids. Beta target: 6–8 weeks.

---

## Locked Decisions

- 5% platform fee (regular), 7% platform fee (auction)
- Stripe Connect Express
- Leaflet + OSM maps, backend geocoding cache
- Cloudinary image storage
- PWA enabled
- Socket.io live bidding (Sprint V1 — shipped)
- Stripe Connect Express payouts (instant payout schedule — Sprint V2 — shipped)

---

## Completed Phases (summary)

Phases 1–13 + pre-beta audit + rebrand + Sprints A–X all verified and shipped (21 phases total).

Key milestones: JWT auth, sale management, Stripe payments, push notifications,
creator affiliates, auction UI + cron + 7% item-level fee, QR marketing,
virtual line scaffold, AI item tagging, Schema.org SEO, PWA hardening,
warm design system, bottom tab nav, full palette swap, skeleton components,
follow system + notification delivery, OAuth social login (NextAuth v4),
listing card redesign (LQIP blur-up + square + badges), social proof + activity feed,
photo lightbox, Hunt Pass points, creator tier program, shopper onboarding + empty states,
discovery + full-text search, review + rating system, shopper messaging,
reservation/hold UI, affiliate + referral program, weekly curator email,
CSV export, advanced photo pipeline (add/remove/reorder + ItemPhotoManager).
Post-launch: Ollama semantic search (U1), neighborhood landing pages (U2),
Socket.io live bidding (V1), instant payouts (V2), UGC bounties (V3),
shipping workflow (W1), label PDF (W2), Zapier webhooks (X1).

Full detail: `claude_docs/COMPLETED_PHASES.md`

---

## In Progress

Parallel path model active. Sessions 66–72 batches complete.

- **CA1–CA7** — ✅ ALL COMPLETE. ToS, schema, payments, audits, health, polish, docs. Pushed 2026-03-05.
- **Health H1** — ✅ COMPLETE. SSR violations fixed: refer/[code].tsx localStorage guard, sales/[id].tsx window/document/navigator guards. Pushed 2026-03-05.
- **Health H2** — ✅ COMPLETE. Prisma pagination: 9 unpaginated findMany calls fixed across 6 controllers (take: 50/200/500). Pushed 2026-03-05.
- **Health H3** — ✅ COMPLETE. Contact rate limit (5/15min), alert()→toast in add-items, OAuth placeholder email → @noreply.finda.sale. Pushed 2026-03-05.
- **CB1, CB3, CB4** — ✅ ALL COMPLETE. Cloud AI tagging pipeline + review panel + category prompts. Pushed 2026-03-05.
- **CC1–CC4** — ✅ ALL COMPLETE. Investor materials, marketing content, pricing analysis, scheduled intelligence tasks. Pushed 2026-03-05.
- **CD1** — ✅ COMPLETE. Fraunces serif + sage-green palette. Pushed 2026-03-05.
- **CD2 Phase 1** — ✅ COMPLETE. Scarcity counter + social proof stats bar. Pushed 2026-03-05.
- **CD2 Phase 2: Live Drop Events** — ✅ COMPLETE. CountdownTimer, teaser view, schema migration. Pushed 2026-03-05.
- **CD2 Phase 2: Personalized Weekly Email** — ✅ COMPLETE. weeklyEmailService.ts, cron Sunday 6pm. Pushed 2026-03-05.
- **CD2 Phase 2: Treasure Hunt Mode** — ✅ COMPLETE. TreasureHunt + TreasureHuntFind schema, Haiku-generated daily clues, GET /api/treasure-hunt/today, POST /found, TreasureHuntBanner on home, Mark as Found on item pages, 50 Hunt Pass points reward. Pushed 2026-03-05.
- **CD2 Phase 3: Dynamic Pricing** — ✅ COMPLETE. suggestPrice() in cloudAIService, PriceSuggestion.tsx component in item form. Pushed 2026-03-05.
- **CD4** — ✅ COMPLETE. Bi-weekly workflow review scheduled task. Pushed 2026-03-05.
- **Organizer Onboarding Walkthrough** — ✅ COMPLETE. OrganizerOnboardingModal.tsx 5-step flow. Pushed 2026-03-05.
- **Manual Single-Item Add Form** — ✅ COMPLETE. Manual Entry tab in add-items. Pushed 2026-03-05.
- **creator/dashboard.tsx** — ✅ COMPLETE. Real referral stats, commission tier, Stripe payout status. Pushed 2026-03-05.
- **Global React Error Boundary** — ✅ COMPLETE. ErrorBoundary.tsx wraps _app.tsx. Pushed 2026-03-05.
- **CA7 Part 2: In-app Tooltips** — ✅ COMPLETE. Tooltip.tsx component, tooltips on create-sale (4), add-items (4), settings (2). Organizer-facing help inline. Pushed 2026-03-05.
- **P5** — ✅ Google Vision, Anthropic API, UptimeRobot DONE. Remaining: OAuth credentials, VAPID production confirm.
- **P6** — ✅ Logos, business cards generated. Vistaprint-ready.
- **P1** — Support email, business cards, Google Business Profile (Patrick)
- **P2** — Stripe business account, Google Voice, Search Console (Patrick)
- **favicon.ico** — ✅ COMPLETE.

---

## Pending Manual Action

- **OAuth env vars** — Social login dormant until added to Vercel: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`. Redirect URIs → `https://finda.sale/api/auth/callback/{google,facebook}`.
- **Railway migrations** — Two new migrations pending `prisma migrate deploy`:
  1. `20260305120000_add_live_drop` (isLiveDrop + liveDropAt on Item)
  2. `20260305130000_add_treasure_hunt` (TreasureHunt + TreasureHuntFind tables)
  Run from Windows: `cd packages\database && railway run -- npx prisma migrate deploy`
- **Sentry** — ✅ Fully deployed.
- **Uptime monitoring** — ✅ UptimeRobot done.

---

## Deferred (Long-Term)

- Multi-metro expansion — Grand Rapids first, business decision
- Video-to-inventory — vision models not ready, revisit late 2026
- Real-user beta onboarding — human task
- CD2 Phase 3: AI Discovery Feed, Visual Search, Group Buying (post-beta)
- CD2 Phase 4: Reverse Auction, White-label MaaS (post-beta)

---

## Next Strategic Move

Session 72 complete: health fixes (SSR, pagination, rate limit) + Treasure Hunt Mode + in-app tooltips shipped.
App is now feature-rich and beta-ready. Key remaining Claude tasks: CD2 Phase 3 moat features (AI Discovery Feed, Visual Search) or beta hardening.
**Patrick action needed:** Run `prisma migrate deploy` (2 migrations pending), set OAuth env vars in Vercel, P1 business setup, P2 Stripe/Search Console.
Beta target: 6–8 weeks. Full roadmap: `claude_docs/roadmap.md`.

---

## Known Gotchas (Production)

- **Railway PORT mismatch** — `PORT=5000` locked. Must match `EXPOSE 5000` in Dockerfile.
- **Neon production DB** — 2 migrations pending: Live Drop + Treasure Hunt. Run `railway run -- npx prisma migrate deploy` from `packages\database`.
- **Production seed:**
  ```powershell
  cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
  $env:DATABASE_URL="postgresql://neondb_owner:npg_6CVGh8YvPSHg@ep-plain-sound-aeefcq1y-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  $env:DIRECT_URL="postgresql://neondb_owner:npg_6CVGh8YvPSHg@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  pnpm run db:generate
  npx prisma migrate deploy
  ```
  ⚠️ Seed clears all data — run intentionally.

---

## Constraints

- Token efficiency required — keep Tier 1 docs lean
- Diff-only updates
- Grand Rapids launch first

---

Last Updated: 2026-03-05 (session 72 — health fixes H1/H2/H3 + Treasure Hunt Mode + CA7 tooltips. Pushed.)

# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

Parallel path model active (5 tracks). MVP stable in Grand Rapids. Beta target: 6–8 weeks. CA1 (ToS) is next Claude task.

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

Phases 1–13 + pre-beta audit + rebrand + Sprints A–S all verified and shipped (21 phases total).
Sprints T–X complete 2026-03-05.

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

Parallel path model active. Batches 1 + 2 + CB1 complete.

- **CA1** — ✅ COMPLETE. Full ToS + Privacy Policy + checkout consent checkbox. Pushed 2026-03-05.
- **CA5** — ✅ COMPLETE. Health scout: GREEN. 0 critical, 0 high. 3 medium (message pagination, contact rate limiter). Pushed 2026-03-05.
- **CC3** — ✅ COMPLETE. Pricing analysis: competitors 13–20% vs FindA.Sale 5%. 4 options. Recommends flat 5%/7% for beta. ⚡ Patrick confirms?
- **CC1** — ✅ COMPLETE. Investor materials: exec summary, 12-slide pitch deck outline, 3-year financial model, TAM $150M. Pushed 2026-03-05.
- **CD4** — ✅ COMPLETE. Bi-weekly workflow review scheduled task (1st + 15th, 9AM). First run: March 15.
- **CD2 Phase 1** — ✅ COMPLETE. Scarcity counter + social proof stats bar on sale pages. Pulsing "Only X left!" when <20% remain. "On Hold" / "Sold" item badges. No migration needed. Pushed 2026-03-05.
- **CB1** — ✅ COMPLETE. `cloudAIService.ts` created (Google Vision → Claude Haiku chain). `uploadController.ts` updated — cloud AI primary, Ollama fallback. `.env.example` updated. Pushed 2026-03-05 (commit 104c414).
- **P1** — Support email, business cards, Google Business Profile (Patrick)
- **P6** — Branding direction decision (Patrick)

---

## Pending Manual Action

- **Phase 31 OAuth env vars** — Social login dormant until added to Vercel: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`. Configure redirect URIs → `https://finda.sale/api/auth/callback/{google,facebook}`.
- **Uptime monitoring** — Create UptimeRobot or StatusGator free account, add monitors for `finda.sale` and Railway backend. Share URL with Claude to wire alerts.
- **Sentry** — ✅ Fully deployed. `@sentry/node` (backend) + `@sentry/nextjs` (frontend) wired and running in Docker. Lockfile committed. Vercel deployed. DSNs set in Railway + Vercel. Test: add `/sentry-test` route → verify event in Sentry dashboard → remove route.

---

## Deferred (Long-Term)

- Multi-metro expansion — Grand Rapids first, business decision
- Video-to-inventory — vision models not ready, revisit late 2026
- Real-user beta onboarding — human task

---

## Next Strategic Move

Batches 1 + 2 + CB1 complete. CB3 (AI tagging frontend UI — photo → suggestions flow) is next CB task. CA2 (DB/migration health) and CA3 (payment stress test) are next CA tasks. CA5 medium findings (message pagination, contact rate limiter) need fixes. CD2 Phase 2 (engagement layer) and CC2 (marketing content) queued. CD1 blocked pending P6 branding decision. Beta target: 6–8 weeks. Full roadmap: `claude_docs/roadmap.md`.

---

## Known Gotchas (Production)

- **Railway PORT mismatch** — `PORT=5000` locked in Railway Variables. Must match `EXPOSE 5000` in Dockerfile. Do not remove.
- **Neon production DB** — `prisma migrate deploy` must be run manually after any new migration. All 26 migrations applied to both Neon and local Docker as of 2026-03-05.
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

Last Updated: 2026-03-05 (session 66 — Batches 1+2 complete (CA1/CA5/CC1/CC3/CD2Ph1/CD4). CB1 shipped: cloudAIService.ts + uploadController fallback chain. STATE.md updated.)
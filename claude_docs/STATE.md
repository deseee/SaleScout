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

Parallel path model active. Sessions 66–70 batches complete.

- **CA1** — ✅ COMPLETE. Full ToS + Privacy Policy + checkout consent checkbox. Pushed 2026-03-05.
- **CA2** — ✅ COMPLETE. Schema validated (4 additive migrations pending Railway deploy). Migration runbook created. Pushed 2026-03-05.
- **CA3** — ✅ COMPLETE. Payment stress test map created. 2 bugs fixed: concurrent purchase auto-refund guard + $0.50 minimum check. Pushed 2026-03-05.
- **CA4** — ✅ COMPLETE. User flow audit (shopper/organizer/creator). 10 fixes shipped. Pushed 2026-03-05.
- **CA4b** — ✅ COMPLETE. Remaining audit fixes: profile push notification toggle + error handling (all 4 queries), categories/city error states + retry buttons, create-sale client-side date validation, register.tsx WCAG htmlFor labels. Pushed 2026-03-05.
- **CA5** — ✅ COMPLETE. Health scout: GREEN. Medium fixes shipped. Pushed 2026-03-05.
- **CA6** — ✅ COMPLETE. Feature polish: 5MB photo validation, push notification toggle (organizer), onboarding copy, empty states. Pushed 2026-03-05.
- **CA6b** — ✅ COMPLETE. Profile shopper push toggle, category/city/profile error states. Pushed 2026-03-05.
- **CA7** — ✅ COMPLETE. Human documentation: organizer guide, shopper FAQ, Zapier webhook docs. `claude_docs/guides/`. Pushed 2026-03-05.
- **CA5** — ✅ COMPLETE. Health scout: GREEN. Medium fixes shipped (M1/M2 message pagination take:200/100, M3 contactLimiter 5/15min). Pushed 2026-03-05.
- **CB1** — ✅ COMPLETE. `cloudAIService.ts` (Google Vision → Claude Haiku). `uploadController.ts` cloud AI primary, Ollama fallback. Pushed 2026-03-05.
- **CB3** — ✅ COMPLETE. AI tagging suggestions review panel in add-items. Apply/dismiss/rescan. Pushed 2026-03-05.
- **CB4** — ✅ COMPLETE. Category-specific AI prompts (9 categories), improved title generation (3-7 word format), tag normalization + deduplication (max 10, substring filter). Pushed 2026-03-05.
- **CC1** — ✅ COMPLETE. Investor materials: exec summary, 12-slide pitch deck outline, 3-year financial model, TAM $150M. Pushed 2026-03-05.
- **CC2** — ✅ COMPLETE. Marketing content: 2 blog posts, social templates, 4 email templates, messaging pillars. Pushed 2026-03-05.
- **CC3** — ✅ COMPLETE. Pricing analysis: competitors 13–20% vs FindA.Sale 5%. Recommends flat 5%/7% for beta.
- **CD1** — ✅ COMPLETE. Fraunces serif font, sage-green color palette added to Tailwind + _document. Pushed 2026-03-05.
- **CD2 Phase 1** — ✅ COMPLETE. Scarcity counter + social proof stats bar. Pulsing "Only X left!" + "On Hold" / "Sold" badges. Pushed 2026-03-05.
- **CD2 Phase 2: Live Drop Events** — ✅ COMPLETE. Organizer marks item as Live Drop + reveal datetime. Frontend shows teaser + CountdownTimer. After reveal: normal item page. Schema migration added (isLiveDrop + liveDropAt). Pushed 2026-03-05.
- **CD2 Phase 2: Personalized Weekly Email** — ✅ COMPLETE. `weeklyEmailService.ts` queries user purchase/favorite history → recommends upcoming items → HTML email. Cron: Sunday 6pm. Pushed 2026-03-05.
- **CD4** — ✅ COMPLETE. Bi-weekly workflow review scheduled task (1st + 15th, 9AM). First run: March 15.
- **P5** — ✅ Google Vision, Anthropic API, UptimeRobot DONE. Remaining: OAuth credentials, VAPID production confirm.
- **P6** — ✅ AI-generated SVG + PNG logos created (`claude_docs/brand/`). Vistaprint-ready. Pushed 2026-03-05.
- **P1** — Support email, business cards (use business-card-front/back.png from claude_docs/brand/), Google Business Profile (Patrick)
- **P2** — Stripe business account, Google Voice, Search Console (Patrick)
- **favicon.ico** — ✅ COMPLETE. Multi-size ICO (16/32/48px). Pushed 2026-03-05.

---

## Pending Manual Action

- **Phase 31 OAuth env vars** — Social login dormant until added to Vercel: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`. Configure redirect URIs → `https://finda.sale/api/auth/callback/{google,facebook}`.
- **Live Drop migration** — New migration `20260305120000_add_live_drop` needs `prisma migrate deploy` on Railway/Neon.
- **Uptime monitoring** — ✅ UptimeRobot done (Patrick confirmed 2026-03-05).
- **Sentry** — ✅ Fully deployed. DSNs set in Railway + Vercel.

---

## Deferred (Long-Term)

- Multi-metro expansion — Grand Rapids first, business decision
- Video-to-inventory — vision models not ready, revisit late 2026
- Real-user beta onboarding — human task
- CD2 Phase 2 remaining: Treasure Hunt Mode (complex, post-beta)
- CD2 Phase 3+: AI Discovery Feed, Dynamic Pricing, Visual Search (post-beta)

---

## Next Strategic Move

Session 70 complete: CA7 + CA4b/CA6b + CD2-LiveDrop + CD2-WeeklyEmail + CB4 shipped.
Next: CD2 Phase 2 remaining (Treasure Hunt Mode), CD2 Phase 3 moat features, or beta readiness final check.
Patrick: P1 business cards, P2 Stripe/Search Console, P5 OAuth credentials, run `prisma migrate deploy` on Railway (Live Drop migration pending).
Beta target: 6–8 weeks. Full roadmap: `claude_docs/roadmap.md`.

---

## Known Gotchas (Production)

- **Railway PORT mismatch** — `PORT=5000` locked in Railway Variables. Must match `EXPOSE 5000` in Dockerfile. Do not remove.
- **Neon production DB** — `prisma migrate deploy` must be run manually after any new migration. All 26 migrations + Live Drop migration pending as of 2026-03-05.
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

Last Updated: 2026-03-05 (session 70 — CA7 + CA4b/CA6b + CD2-LiveDrop + CD2-WeeklyEmail + CB4 complete. Pushed.)

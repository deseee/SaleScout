# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

Maintain stable MVP in Grand Rapids. Prepare for scale to additional metros.

---

## Locked Decisions

- 5% platform fee (regular), 7% platform fee (auction)
- Stripe Connect Express
- Leaflet + OSM maps, backend geocoding cache
- Cloudinary image storage
- PWA enabled
- Polling for auctions (Socket.io deferred session 36)

---

## Completed Phases (summary)

Phases 1–13 + pre-beta audit + rebrand all verified and shipped.
Key milestones: JWT auth, sale management, Stripe payments, push notifications,
creator affiliates, auction UI + cron + 7% item-level fee, QR marketing,
virtual line, AI item tagging, Schema.org SEO, PWA hardening.

Full detail: `claude_docs/COMPLETED_PHASES.md`

---

## In Progress

**Sprint B — Phase 24+25: Design System + Bottom Tab Navigation**
- Color palette, typography, spacing tokens in Tailwind config
- Bottom tab navigation (mobile-first)
- Skeleton screens for all list views
- See ROADMAP.md Phase 24/25 specs

---

## Pending Manual Action

- **Backend hosting: ngrok bridge temporary** — Frontend on Vercel (finda.sale). Backend in Docker on Windows via ngrok static domain. Plan: migrate to Railway/Render/Fly.io before real user traffic.
- **Resend domain verification** — ✅ Verified.

---

## Deferred

- Socket.io live bidding — polling sufficient for MVP
- Virtual line SMS — scaffolded, Twilio E2E untested
- Multi-metro expansion (Grand Rapids only)
- Real-user beta onboarding
- Video-to-inventory — vision models not ready, revisit late 2026
- OAuth social login — promoted to Phase 31 (P1)

---

## Next Strategic Move

Five-pillar growth phase. Sprint order:
1. ~~Sprint A: Phase 12 completion~~ ✅ (2026-03-05)
2. **Sprint B: Phase 24+25** — Design system + bottom tab nav (NOW)
3. Sprint C: Phase 14 — Rapid capture carousel + background AI
4. Sprint D: Phase 17 — Organizer reputation + follow system

Full roadmap: `claude_docs/ROADMAP.md`

---

## Constraints

- Token efficiency required
- Modular documentation
- No context drift
- Diff-only updates
- Grand Rapids launch first

---

Last Updated: 2026-03-05 (session 43 — doc compression)

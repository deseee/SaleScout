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

Phases 1–13 + pre-beta audit + rebrand + Sprint A + Sprint B all verified and shipped.
Key milestones: JWT auth, sale management, Stripe payments, push notifications,
creator affiliates, auction UI + cron + 7% item-level fee, QR marketing,
virtual line, AI item tagging, Schema.org SEO, PWA hardening,
warm design system (Phase 24), bottom tab nav (Phase 25), full palette swap (586 refs / 47 files), skeleton components.

Full detail: `claude_docs/COMPLETED_PHASES.md`

---

## In Progress

**Sprint C — Phase 14: Rapid Capture + Background AI**
- ✅ Phase 14a: RapidCapture.tsx — full-screen WebRTC camera overlay, rear-facing, 1920×1440, one-handed 72px shutter, filmstrip carousel, tap-to-preview/delete, flash feedback
- ✅ Phase 14a: Integrated into add-items.tsx — gradient CTA button, batch queue state, tap-to-prefill form from AI results
- ✅ Phase 14b: Backend /upload/rapid-batch endpoint — accepts up to 20 images, Cloudinary upload + Ollama AI analysis in parallel per file, Promise.allSettled for partial failure resilience
- ✅ Phase 14b: Batch Processing Queue UI — status overlays (uploading/analyzing/done/error), AI result preview on cards, sequential fallback if batch endpoint fails
- ✅ Build fix: creator/dashboard.tsx `loading` → `isLoading` (AuthContextType mismatch)
- Phase 14c pending: Cloudinary webhook, auto-crop, thumbnail/optimized/full-res URLs

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
2. ~~Sprint B: Phase 24+25~~ ✅ — Design system + bottom tab nav (2026-03-04)
3. **Sprint C: Phase 14** — Rapid capture + background AI (IN PROGRESS — 14a+14b done, 14c next)
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

Last Updated: 2026-03-04 (session 45 — Sprint C Phase 14a+14b complete, build fix pushed)

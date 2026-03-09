# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Active Objective

Self-improvement loop sessions 96–102 complete (all in single session). 29 backlog items shipped across 7 planned sessions: E4 message board, E5 state machine, heartbeat protocol, E16 worktrees research, E2 token monitoring, E10 session baselines, E12.5 token-per-goal metric, E6 steelman method, E1.5 continuous batch rule, E9.5 syntax pre-filter, E17 file schema, E15 skill roster, F2 Hacker agent, F1 Pitchman agent, F3 Advisory Board, G-batch platform research, E7 PM design, E14 model routing. Sprint queue: Session 103 (Fleet Optimization Evaluation — BACKLOG §K) → then production bugs (A-section). NOTE: Use `Skill` tool to invoke findasale-* agents — NOT the `Agent` tool.

---

## Locked Decisions

- **BUSINESS_PLAN.md** — Tier 1 Strategic Authority Document (created 2026-03-06). All business strategy, market analysis, financial projections, competitive positioning, and go-to-market strategy defined here. Reference for all strategic decisions.
- 5% platform fee (regular), 7% platform fee (auction)
- Stripe Connect Express
- Leaflet + OSM maps, backend geocoding cache
- Cloudinary image storage
- PWA enabled
- Socket.io live bidding (Sprint V1 — shipped)
- Stripe Connect Express payouts (instant payout schedule — Sprint V2 — shipped)

---

## Completed Phases (summary)

Phases 1–13 + pre-beta audit + rebrand + Sprints A–X all verified and shipped (21 phases total). Full detail: `claude_docs/COMPLETED_PHASES.md`

---

## In Progress

Sessions 96–102 complete. Self-improvement loop nearly done — Session 103 (Fleet Optimization Evaluation) remains. Sprint 5 (Seller Performance Dashboard) intentionally deferred until evaluation completes per BACKLOG §K. Neon migration `20260310000001_add_item_fulltext_search_indexes` still needs `prisma migrate deploy` on production. Full completed task history: `claude_docs/COMPLETED_PHASES.md`

---

## Pending Manual Action (Blocks Beta Launch)

- **Phase 31 OAuth env vars** — ✅ DONE (2026-03-06). GOOGLE_CLIENT_ID/SECRET + FACEBOOK_CLIENT_ID/SECRET added to Vercel. Redirect URIs configured.
- **Support email** — ✅ DONE (2026-03-06). support@finda.sale email forwarding configured.
- **Neon migrations** — ✅ 63 migrations applied to Neon production (last: 20260307153530_add_coupon_model). Pending: `20260310000001_add_item_fulltext_search_indexes` (Sprint 4a — run before Sprint 4b end-to-end testing).
- **MAILERLITE_API_KEY** — ⏳ Must be added to Railway env vars (MailerLite → Integrations → MailerLite API) before MailerLite automation triggers on sale publish.
- **Uptime monitoring** — ✅ UptimeRobot done (Patrick confirmed 2026-03-05).
- **Sentry** — ✅ Fully deployed. DSNs set in Railway + Vercel.
- **STRIPE_WEBHOOK_SECRET** — ✅ Set in Railway (2026-03-05).

---

## Deferred (Post-Beta)

- AI Discovery Feed (ML on browse/buy signals — needs real data)
- Buyer-to-Sale Matching (ML — needs real data)
- Treasure Hunt mobile UX improvements
- Visual Search vector embeddings (upgrade from label matching)
- Group Buying Pools, White-label MaaS, Consignment Integration
- Video-to-inventory (vision models not ready)
- Multi-metro expansion

---

## Beta Launch Target

**Status: GO.** All 8 audit work paths complete (session 84). All 4 critical code fixes shipped (session 85).

**4 critical code fixes — ✅ COMPLETE (session 85):**
- C1: ✅ JWT fallback secret removed, env var validation guard added on startup
- C2: ✅ Password reset rate-limited (5/hr) via express-rate-limit on `/auth/forgot-password`
- C3: ✅ `/api/upload/ai-feedback-stats` protected with `authenticate` + `requireAdmin` middleware
- C4: ✅ Stripe webhook secret rotation plan documented in OPS.md

**Patrick's 5 blocking items:**
1. Confirm 5%/7% fee (locked in STACK.md but never verbally confirmed)
2. Set up Stripe business account
3. Google Search Console verification
4. Order business cards (design ready in `claude_docs/brand/`)
5. Start beta organizer outreach (`claude_docs/beta-launch/organizer-outreach.md` + `marketing-calendar-2026-03-06.md`)
6. Rotate Neon credentials (were in committed history — scrubbed but should be rotated)
7. Optional: consult Michigan attorney re estate sale permit (~$300–500)

Full audit reports: `claude_docs/health-reports/qa-pre-beta-audit-2026-03-06.md`, `claude_docs/beta-launch/ops-readiness-2026-03-06.md`
Beta checklist: `claude_docs/BETA_CHECKLIST.md`

---

## Known Gotchas (Production)

- **Railway PORT mismatch** — `PORT=5000` locked in Railway Variables. Must match `EXPOSE 5000` in Dockerfile. Do not remove.
- **Neon production DB** — `prisma migrate deploy` must be run manually after any new migration. 63 migrations applied to Neon as of 2026-03-07. Last: `20260307153530_add_coupon_model` (Sprint 3). No pending migrations.
- **Dockerfile.production** — ✅ Restored to `--frozen-lockfile` (session 87, commit b82180d). Lockfile is clean.
- **Git push workflow** — Patrick uses `.\push.ps1` (repo root) instead of raw `git push`. Self-heals: index.lock, CRLF phantoms (--ignore-cr-at-eol), fetch+merge (never rebase), doc-file merge conflicts (--theirs auto-resolve). See self-healing entries #36, #51, #52.
- **Dev stack is now native** — Docker no longer used at all. `image-tagger/` deleted by Patrick (session 81). Backend/frontend/postgres run natively on Windows. See `claude_docs/DEVELOPMENT.md`.
- **Production migration deploy (Neon):** Before running `migrate deploy`, Claude must read `packages/backend/.env` directly and extract the actual Neon URLs (currently the commented-out `# DATABASE_URL=` and `# DIRECT_URL=` lines pointing to `neon.tech`). Claude provides the complete `$env:DATABASE_URL="..."` command with the real URL — never placeholder text. Never commit credentials to docs.

---

## Constraints

- Token efficiency required — keep Tier 1 docs lean
- Diff-only updates
- Grand Rapids beta first — scope is not geography-limited; yard sales, auctions, and flea markets are in scope

---

- **favicon.ico** — ✅ COMPLETE. Multi-size ICO (16/32/48px) from logo-icon-512.png. `_document.tsx` updated with shortcut/icon links. Pushed 2026-03-05.
- **CA4** — ✅ COMPLETE. User flow audit (shopper/organizer/creator). 10 fixes shipped: search aria-label, purchases error handling, index refetch(), items/[id] retry, referral copy feedback. Open items logged in `claude_docs/ux-spotchecks/ca4-ca6-audit-2026-03-05.md`.
- **CA6** — ✅ COMPLETE. Feature polish: 5MB photo validation + server error surfacing, push notification toggle in organizer settings, onboarding step 3 copy improved, empty referrals state. Pushed 2026-03-05.

Last Updated: 2026-03-09 (sessions 96–102 — Self-improvement loop: 29 items shipped. New infrastructure: message board, task state machine, heartbeat protocol. New agents: Hacker, Pitchman, Advisory Board. Research: worktrees, token monitoring, GSD framework, Sentry MCP, GitHub Actions, model routing. CORE.md §3 strengthened with E1.5/E9.5. conversation-defaults Rules 7-8 added. CLAUDE.md §7 skill roster added. 18 new files created in claude_docs/.)

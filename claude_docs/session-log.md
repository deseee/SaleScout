# Session Log — FindA.Sale

Cross-session memory for Claude. Updated at every session end.
Read this at session start to understand recent context without loading extra files.
Keep only the 5 most recent sessions. Delete older entries — git history and STATE.md are the durable record.

---

## Recent Sessions

### 2026-03-04 (session 41 — 7-Test Workflow Stress Test)
**Worked on:** Ran all 7 stress tests from next-session-prompt.md to validate guardrails added in sessions 39–40. Tests covered: diff-only gate (CORE §4), session init protocol (CORE §2), MCP push batching (CORE §10), authority hierarchy conflict (CORE §7), Docker command safety (dev-environment skill), dead code detection (context.md accuracy), stale fact detection (polling vs Socket.io). All 7 passed. context.md regenerated locally — stale `contexts/` directory entry now removed.
**Decisions:** Sonnet is sufficient for Sprint A (Phase 12 auction completion — mechanical, 3-4 file edits). Opus recommended for Sprint B (Phase 24+25 design system — cross-cutting visual overhaul). Sprint A goes next via Sonnet.
**Next up:** Sprint A — Phase 12 auction completion: organizer auction toggle + Stripe 7% webhook.
**Blockers:** None. Guardrails verified. context.md fresh.

### 2026-03-04 (session 40 — Deep Workflow Audit + Tool Tree + Doc Fixes)
**Worked on:** Deep audit of MCP connectors, doc system logic, power user workflow tips, and tool bugs. Found and fixed 9 issues: CORE.md Section 2 missing MCP check steps (HIGH), CORE.md Section 7 missing Skills in authority hierarchy (MEDIUM), duplicate ToastContext files (HIGH — `contexts/` is dead code, `components/` is canonical), RECOVERY.md stale Socket.io entry replaced with polling note, SECURITY.md timestamp updated post-rebrand, STATE.md stale "In Progress" cleared + backend hosting wording clarified, self_healing_skills.md structural ordering fixed (Skills 17–19 were out of order), context.md GitHub false negative fixed (CLI vs MCP distinction), update-context.js updated with Tool & Skill Tree section. Also completed session 39 context wrap (session-log trim, next-session-prompt, .last-wrap, context.md regen). Research on MCP push_files token limits led to CORE.md Section 10 upgrade (create_or_update_file preference, MAX_MCP_OUTPUT_TOKENS). Diff-only violation root cause diagnosed; added conversation-defaults Rule 3, Self-Healing Skill 19, strengthened CORE.md Section 4.
**Decisions:** conversation-defaults Rule 3 (announce file mod approach) is the active enforcement checkpoint for diff-only rule. Skills now have explicit position in authority hierarchy (between CORE.md and Root CLAUDE.md). Dead code `contexts/ToastContext.tsx` flagged for deletion.
**Next up:** Delete `contexts/ToastContext.tsx` (dead code). Sprint A (Phase 12 auction) + Sprint B (Phase 24+25 design system). Push all doc changes to GitHub.
**Blockers:** `contexts/ToastContext.tsx` deletion needs Patrick confirmation per SECURITY.md rules.

### 2026-03-04 (session 39 — ROADMAP Deep Rewrite + Context Alignment)
**Worked on:** Full ROADMAP.md rewrite (v2) with deep research: competitor sentiment (estatesales.net 1.4★ Trustpilot, opaque fees, broken auctions; Facebook Marketplace flags "estate" as Fair Housing violation), UI/UX design system (warm palette, Montserrat/Inter typography, bottom tab nav, card redesign, onboarding flows), social layer (follow organizer, activity feeds, "Share Your Find" modal, dual-sided referral), growth channels (local partnerships, SEO arbitrage, Google Events, Google Play TWA), cross-industry mechanics (Pokemon GO, Fortnite battle pass, Supreme drops, TikTok Shop affiliates). OAuth promoted from deferred to Phase 31 (P1). Roadmap restructured into 5 pillars with phases 14–32. Context alignment audit: fixed stale facts in STACK.md, STATE.md, trimmed session-log.md.
**Decisions:** Full ROADMAP.md rewrites violated diff-only rule — will use targeted edits going forward. OAuth promoted because social login impacts organizer signup conversion directly.
**Next up:** Sprint A (Phase 12 auction completion) + Sprint B (Phase 24+25 design system) in parallel.
**Blockers:** None. Research-only session — no code changes.

### 2026-03-04 (session 37 — Activation Sprint)
**Worked on:** Activated Phases 9/11/12 in Docker + Vercel. Applied DB migrations 000001 + 000002 (000002 needed `migrate resolve --applied` — table already existed from prior `db push`). Generated VAPID keys, wired into root `.env`, `docker-compose.yml` (backend + frontend services), and Vercel env vars. Fixed `uploadController.ts` — stale version missing `upload` multer export and wrong handler names; backend crash-looped on startup until corrected. Fixed `docker-compose.yml` missing `hooks/` bind mount — frontend container couldn't resolve `usePushSubscription`. Rebuilt backend `--no-cache`. Confirmed push working on Vercel (SW registered, prompt appeared for first user). Fixed Stripe `clover/stripe.js` SW interception bug — workbox NetworkOnly failing in SW fetch context; fix was to remove Stripe from runtimeCaching entirely + exclude `*.stripe.com` from pages catch-all. Fixed Vercel build TypeScript error in `usePushSubscription.ts` (`Uint8Array<ArrayBufferLike>` → `Uint8Array<ArrayBuffer>`).
**Decisions:** One-prompt-per-browser for push is correct design — permission is browser-level, not per-user. Stripe domains must be excluded from SW entirely (not just NetworkOnly) due to CORS fetch restrictions in SW context.
**Next up:** ROADMAP.md audit — Phases 9/11/12 complete, roadmap has stale items. Audit before committing to next feature sprint.
**Blockers:** None. All changes on GitHub main. Vercel redeploying with Stripe SW fix.

### 2026-03-04 (session 36 — Phase 9/11/12 Feature Sprint)
**Worked on:** Implemented Phase 9 (affiliate conversion tracking), Phase 12 (auction cron + frontend), and Phase 11 (PWA push notifications). Phase 9: fixed affiliateController prisma import, added `conversions` + `affiliateLinkId` to schema, wired Stripe metadata attribution, built `affiliate/[id].tsx` redirect page, updated creator dashboard stats, wired sessionStorage ref in CheckoutModal. Phase 12: fixed auctionJob.ts cron (was never scheduled), built AuctionCountdown + BidModal components, wired live countdown on sale detail. Phase 11: PushSubscription schema + migration, pushController/routes/webpush utility, usePushSubscription hook, sw-push.js service worker, PushSubscriber in _app.tsx, push sends in emailReminderService. Fixed Vercel build (pnpm-lock.yaml pushed after extended git conflict resolution). Fixed migration 20260304000001 with IF NOT EXISTS guards. Added self-healing skills 14–16 (MCP+untracked conflict, PowerShell bracket wildcards, git lock files).
**Decisions:** sessionStorage over cookies for affiliate attribution (no cookie-parser). Polling over Socket.io for auction UI (not installed; sufficient for MVP). Lazy require('web-push') so server starts without package.
**Next up:** Run `prisma migrate deploy` in Docker (both migrations 000001 + 000002 pending). Generate VAPID keys, add to .env files. Docker rebuild backend. Then smoke-test push subscriptions.
**Blockers:** Migrations not yet applied — need `docker exec findasale-backend-1 sh -c "cd /app/packages/database && npx prisma migrate deploy"`. VAPID keys not yet generated — `npx web-push generate-vapid-keys`.


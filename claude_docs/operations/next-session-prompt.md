# Next Session Resume Prompt
*Written: 2026-03-09 — Session 105 wrap*
*Session ended: normally*

## Resume From

Start **Session 106 — Architecture Decisions (B1 Linchpin)**.

## What Was Done Last Session (105)

Session 105 was the Bug Blitz. 7 P0 bugs fixed across 6 files, QA verified PASS.

**Fixes shipped:**
- A1.1/A1.2: Map pins invisible → CSP `img-src` added `https://raw.githubusercontent.com` (`next.config.js`)
- A2.1: Install banner covered mobile nav → `InstallPrompt.tsx` repositioned to `bottom-16/bottom-20`
- A3.1/A3.2: Photo upload "Unexpected field" → `ItemPhotoManager.tsx` field name `'image'` → `'photo'`
- A3.6: Bulk item operations 404 → Added `POST /items/bulk` route to `items.ts`
- A3.7: Rapid Capture camera "Unavailable" → `Permissions-Policy: camera=()` → `camera=(self)` in `next.config.js`
- A4.1 (QR codes blank): CSP `img-src`/`connect-src` added `https://api.qrserver.com` (`next.config.js`)
- A4.1 (tier section invisible): `/api/tiers/mine` double-prefix fixed → `/tiers/mine` (`dashboard.tsx`)
- A4.1 (Flash Deal blank dropdown): `getMySales` items select now includes `title` + `price` (`saleController.ts`)

**QA verdict: PASS** — all 6 files reviewed by findasale-qa.

**Patrick must push before testing:**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/frontend/next.config.js
git add packages/frontend/components/InstallPrompt.tsx
git add packages/frontend/components/ItemPhotoManager.tsx
git add packages/backend/src/routes/items.ts
git add packages/frontend/pages/organizer/dashboard.tsx
git add packages/backend/src/controllers/saleController.ts
git commit -m "fix: Session 105 Bug Blitz — 7 P0 fixes (map pins, mobile nav, photo upload, bulk route, camera, QR codes, tier API)"
.\push.ps1
```

## Session 106 Objective

**B1 Linchpin — Sale Type → Item Type architecture decision.**

B1 is the gate for B4 (buyer checkout flow), D1 (quasi-POS mode), and B7 (referral program). Cannot ship those without resolving B1 first.

The question: Should FindA.Sale support multiple sale types (estate sale vs. yard sale vs. auction vs. flea market) with different item behaviors? Or keep a unified model?

**Dispatch findasale-architect first** to analyze the schema and produce an ADR. Then Patrick reviews and decides.

After B1 is decided, proceed to:
1. **B4** — buyer checkout flow improvements
2. **D1** — quasi-POS mode (attorney check first — see STATE.md)
3. Sprint 5 — Seller Performance Dashboard (was deferred from Session 105)

## Still Pending From Previous Sessions

1. **Neon migration** — `20260310000001_add_item_fulltext_search_indexes` — run `npx prisma migrate deploy` against Neon before Sprint 4b end-to-end testing
2. **MAILERLITE_API_KEY** — must be added to Railway env vars
3. **18 skill files** from `claude_docs/skill-updates-2026-03-09/` — Patrick must install all 18

## Remaining P1 Bugs (Not Done in Session 105)

From bug-blitz-scoping-2026-03-09.md:
- A1.3: "My location" button on /map does nothing
- A1.4: Search only queries sales, not items
- A2.2: "Add to Home Screen" banner shows old SaleScout logo
- A5.1: Duplicate header/footer on leaderboard
- A5.2: Leaderboard organizer names not clickable
- A6.1: "Grand Rapids" hardcoded across multiple pages (scope: many files)
- A3.6 single-item server error: root cause unclear — needs production logs from Railway

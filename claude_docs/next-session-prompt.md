# Next Session Resume Prompt
*Written: 2026-03-14 (session 163 wrap)*
*Session ended: normally*

## What Was Completed This Session
Session 163: #33 Share Card Factory fully shipped. Root cause was Node.js 24 ESM/CJS interop crash in `@tanstack/react-query` v5's native ESM build. Fixed with `transpilePackages` in `next.config.js`. OG image fallback fixed for non-Cloudinary photos. `fb:app_id` added. FB Sharing Debugger clean — no warnings.

## Environment Status
- **Vercel** — auto-deploying, all green. #33 live and verified.
- **Railway** — was unstable (session 160 note), may have stabilized. Check logs at session start.
- **Neon migrations** — 72 current, **+1 still pending**: `20260314193440_add_entrance_pin` (Front Door Locator #35)
- **Vercel env var still needed:** `INTERNAL_API_URL` — internal Railway URL for `getServerSideProps` on item pages. Currently falls back to `NEXT_PUBLIC_API_URL` (public URL, works but slower). Set in Vercel project settings → Environment Variables → `INTERNAL_API_URL` = Railway internal URL.
- **Roadmap** — v28, #33 shipped. Next priority: **#24 Holds-Only Item View**.

## Immediate Priority (Single Opus Session — do these in order)

### 1. Quick infra (15 min)
- Apply pending Neon migration: `prisma migrate deploy` for `20260314193440_add_entrance_pin`
  - Load `dev-environment` skill first — confirms correct Neon URL + pnpm commands
- Optionally: add `INTERNAL_API_URL` to Vercel env vars (Patrick does this in dashboard)

### 2. Main feature: #24 Holds-Only Item View (1 sprint)
**Why it matters:** Trust blocker for beta — organizers need to see which items have holds before real users arrive. The "Manage Holds" button was removed from dashboard until this ships.

**What it is:** A dedicated organizer view showing all items with active holds across all their sales. Filter by sale, sort by hold expiry (48h default). Show buyer name, hold created time, expiry countdown, item photo/title/price. Batch actions: release hold, extend hold, mark sold.

**Design decisions already locked (session 155):**
- Holds expiry: 48h default, configurable per-sale
- By-item in schema, grouped-by-buyer in display
- No junction table

**Start with:** `findasale-architect` → `findasale-dev` → `findasale-qa` cycle.

### 3. If #24 is done cleanly with context remaining: start #36 Weekly Treasure Digest (1 sprint)
MailerLite MCP is live and connected. Weekly email: top items, trending sales, new listings. Use `findasale-marketing` + MailerLite MCP to design the automation + draft the first email.

## Open Items (Non-Blocking, Carry Forward)
- **P2:** Item thumbnail images on Review & Publish page break on reload (Cloudinary URLs fail on subsequent navigation). Investigate when convenient.
- **Schema tech debt:** `aiConfidence Float @default(0.5)` should be `Float?` — backfill manual items to null. Not urgent — masked by `isAiTagged` in UI.
- **Brand Voice session** — before Listing Factory (#27) ships. Still on upcoming list.
- **Railway stability** — was flagged in session 160. Check logs at session start.

## Context
- Load STATE.md and CLAUDE.md before starting work
- Load `dev-environment` skill before any shell/Prisma/DB commands
- Load `findasale-deploy` skill before any production deploy

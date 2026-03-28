# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Current Work

**S321 COMPLETE.** Nav full audit (organizer + shopper, desktop + mobile), homepage search tag fix, Sales Near You redesign. All files pushed.

## Blocked/Unverified Queue

| Feature | Reason | What's Needed | Session Added |
|---------|--------|----------------|---------------|
| #143 PreviewModal onError | Code fix pushed (sha: ffa4a83). 📷 fallback on Cloudinary 503 in place. | Defensive fix only — can't trigger 503 in prod (Cloudinary ready by the time images display). ACCEPTABLE UNVERIFIED. | S312 |
| #143 AI confidence — Camera mode | cloudAIService.ts fix is code-correct; processRapidDraft passes aiConfidence through. Can't test without real camera hardware in Chrome MCP. | Real device camera capture → Review & Publish → confirm "Good (X%)" or similar, not "Low (50%)". | S314 |
| Nav menus (organizer + shopper) | All changes pushed but not Chrome-verified this session. | Open desktop dropdown + mobile drawer as Bob Smith (organizer) and Leo Thomas (shopper). Verify collapsible sections, correct items, consistent font/padding. | S321 |
| Homepage search by tags | itemSearchService.ts updated to include item/sale tags. | Search "eames" or "mid century" from homepage — verify results appear. | S321 |
| Sales Near You card redesign | index.tsx updated. | Verify card shows in 2-column layout, displays sale counts by type, links to /map on click. | S321 |

**S321 COMPLETE (2026-03-28):** Nav full audit + homepage fixes. (1) Review Item modal thumbnail fixed: `thumbnailUrl` dropped during ID swap in [saleId].tsx (lines 701, 757) — now preserved so review modal shows captured photo instead of placeholder. (2) Desktop dropdown full nav audit: added Organizer Tools + Pro Tools collapsible sections (were missing entirely); normalized all links to `px-3 py-2 rounded-md`; added `text-sm` to TierGatedNav.tsx both link states. (3) Shopper menu parity: desktop dropdown had only About/Settings/Sign Out for shopper users — added Shopper Dashboard, My Profile, My Saves, Referrals, Host a Sale CTA, My Explorer Profile collapsible (10 links). (4) Dual-role: "My Dashboard" → "Shopper Dashboard" in mobile; both dashboards shown for dual-role users. (5) Homepage search: itemSearchService.ts now queries item tags + sale tags via PostgreSQL `@>` — "eames", "mid century", "rolex" now searchable. (6) Sales Near You card: redesigned as 2-column layout, sale counts by type, full card links to /map. Files: [saleId].tsx, AvatarDropdown.tsx, Layout.tsx, TierGatedNav.tsx, itemSearchService.ts, index.tsx. All pushed.

## Next Session (S322)

**Patrick push action needed: NO** — all S321 files pushed.

**Start with:**
1. **Chrome verify nav menus** — open desktop dropdown as Bob Smith (organizer): confirm Organizer Tools + Pro Tools start collapsed, all links present, consistent sizing. Open mobile drawer: confirm Shopper Dashboard label, My Saves present, Explorer Profile collapsible.
2. **Chrome verify as Leo Thomas (shopper)** — desktop dropdown should show full shopper section; My Explorer Profile collapsed by default.
3. **Chrome verify homepage search** — search "eames" or "mid century" — confirm results appear.
4. **Chrome verify Sales Near You card** — confirm 2-column layout, sale type counts, clicks through to /map.
5. **Continue homepage/product audit** — Patrick flagged sale type filters need tags populated at sale creation time.

**S319 COMPLETE (2026-03-28):** 6 fixes shipped + reseed + shopper walkthrough. (1) "All items sold or reserved" banner fixed: `ACTIVE` → `AVAILABLE` + removed non-existent `PENDING` from soldCount in sales/[id].tsx. (2) Reseeded Railway with 17 real Cloudinary photos — picsum removed from seed.ts entirely. (3) Message compose footer fixed: `_app.tsx` supports `getLayout` pattern; messages/[id].tsx uses `noFooter={true}` (Chrome-verified ss_1731k6do9). (4) Badge loading P1 fixed: `/users/me/points` endpoint was missing — added `getBadges` controller + route (Chrome-verified ss_80947s2pv). (5) Badge empty state fixed: profile.tsx was rendering 3 dashed blank placeholder boxes when badges=[] — replaced with "No badges yet / Start shopping to earn your first badge!" (QA honesty failure caught by Patrick from screenshot). (6) Shopper walkthrough QA: likes ✅, profile ✅, Loot Legend ✅, Hunt Pass ✅, messaging ✅, dark mode ✅, mobile ✅.

**S318 COMPLETE (2026-03-27):** 4 fixes shipped + sale detail P0 resolved. (1) Batch upload preview image scaling fixed: `h-32 object-cover` → `h-40 object-contain bg-gray-100 dark:bg-gray-800` in SmartInventoryUpload — full item photo now visible without cropping. (2) Items list auto-refresh after batch save: wrong query key `['sale-items']` → `['items']` + `onComplete?.()` — no hard refresh needed after saving batch items. (3) Query key audit: orphaned `['draft-items']` invalidation removed from add-items page; clarifying comments on intentional prefix-match patterns in useAppraisal + useBidBot. (4) Sale detail P0 crash fixed: `formatPrice(null)` null guard in sales/[id].tsx — returns `'—'` instead of throwing TypeError. Chrome-verified as Karen Anderson (user11): sale detail loads, 6 items render with prices + photos (ss_1060ufr5m). Full organizer walkthrough: all core flows working (dashboard, create-sale, items, edit, profile, messaging, insights, dark mode). 2 items queued for S319: "All items sold or reserved" wrong banner (P2), pre-S317 thumbnail backfill. All 4 files pushed by Patrick.

**S317 COMPLETE (2026-03-27):** Batch upload AI confidence verified + Cloudinary URL bug fixed. (1) Batch upload AI confidence ✅ — Patrick dropped folding chair photo into Batch Upload drop zone. AI analysis confirmed working: "Folding Chair, Gray Metal Frame, Modern Utility Style", $18, Furniture, Good condition. Item created successfully (13 items total on sale cmn7eptij0045xdmfm5lu9oyc). Batch upload creates PUBLISHED items (not DRAFT), so they appear directly in items list (not Review & Publish). (2) Cloudinary URL bug root cause found and fixed: uploadController.ts was using `result.object` (Cloudinary eager transform results) which returned incomplete transform URLs (e.g., `/v1774657939/` with no filename). Fixed: now uses `result.secure_url` with `insertTransform` helper to generate correct URLs. This explains "preview unavailable" tooltips and missing thumbnails in items list when batch-uploading or using camera. (3) Shared Cloudinary utility created — `packages/shared/src/cloudinaryUtils.ts` with `insertCloudinaryTransform`, `getCloudinaryThumbnailUrl`, `getCloudinaryOptimizedUrl`, `getCloudinaryFullUrl`. Exported from shared/index.ts. Backend keeps inline helper (workspace dependency not wired yet) with TODO pointing to shared. (4) Roadmap #220 added ("Cloudinary URL Utility — Centralized transform helper", P2 housekeeping). Files pending push: uploadController.ts, cloudinaryUtils.ts (NEW), shared/index.ts, roadmap.md.

**S316 COMPLETE (2026-03-27):** AI confidence batch path verification session. All 3 S315 bug fixes code-confirmed on GitHub: (1) batchAnalyzeController error fallback → 0.4 numeric (not 'low' string); (2) SmartInventoryUpload payload includes aiConfidence; (3) createItem handler stores aiConfidence with parseFloat. cloudAIService.ts Haiku prompt confirmed includes confidence field (0.0–1.0, required) + field-completeness fallback (0.4–0.8). Browser test BLOCKED — upload_image requires user-uploaded image IDs (Patrick drags photo into chat), not Claude screenshot IDs; file_upload blocked by VM security. Review & Publish page visited — AI Confidence column confirmed live (ss_1746po7qa). 2 camera draft items show "Low (50%)" — predates S313 fix. No code changes this session; no push needed.

**S315–S284 archived.** See `claude_docs/COMPLETED_PHASES.md` for full history.

**S295 COMPLETE (2026-03-26):** Roadmap corrections, page deletions, Chrome QA, P0 fixes, QA Honesty Gate formalized. (1) roadmap.md v75: applied all 26 Chrome 📋 downgrades, 9 nav corrections, 14 S289-S292 upgrades, added #218 Shopper Trades + #219 Shopper Achievements. (2) Deleted pro-features.tsx + connect-stripe.tsx (git rm). (3) TierGate.tsx: dead link /organizer/pro-features → /pricing. (4) creator/dashboard.tsx: Connect Stripe button → real OAuth at /api/stripe/create-connect-account. (5) CheckoutModal.tsx P0: removed buyer-facing 10% platform fee for regular items — buyer now sees item price = total. Auction items still show 5% buyer premium. (6) shopper/hunt-pass.tsx: new page (was 404) — Hunt Pass marketing, $4.99/month, benefits, FAQ, CTA. (7) workspaceController.ts + workspace/[slug].tsx: built out public workspace page — real publishedSales list (title, dates, city), Message owner button, removed hardcoded boilerplate. (8) CLAUDE.md §9 QA Honesty Gate: hard rule (page loads ≠ verified, full user task = verified, bug→decision conversion prohibited). Memory file created. S295 changeset pushed to GitHub (Patrick pushblock pending for doc files).

---

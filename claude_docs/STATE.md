# PROJECT STATE

Compression anchor. Active state only.
Historical detail: `claude_docs/COMPLETED_PHASES.md`

---

## Current Work

No active work. S331 complete. S332 priorities staged below.

**S330 COMPLETE (2026-03-28):** Desktop nav search + map sale type filter + edit-sale cover photo. (1) **Desktop nav search ✅ VERIFIED** — Layout.tsx updated. Search icon in nav bar expands to input on click, collapses on Escape/blur. Submits form to `/?q=<term>`. Chrome-verified working (ss_62400ab1c, ss_1378f5bto). (2) **Map sale type filter ✅ VERIFIED** — map.tsx updated with filter pills (All Types / Estate / Yard / Auction / Flea Market / Consignment). Chrome-verified: Estate → 15 sales, Auction → 0 sales (ss_1871l57bx → ss_3209bt61b → ss_57862pvhm). (3) **Edit-sale cover photo section ✅ (CODE-VERIFIED, NOT YET BROWSER-TESTED)** — NEW SaleCoverPhotoManager.tsx component + edit-sale/[id].tsx integration. Section visible in form with upload/preview/remove buttons. (4) ⚠️ **Cover photo useState bug found:** Component uses `useState(initialPhotoUrl)` which only reads the value at mount time. When formData loads async from API, the component doesn't update — seeded photo doesn't show. Fix: add `useEffect` hook to sync state when `initialPhotoUrl` changes. P2 for S331. (5) ⚠️ **Cover photo save behavior:** Currently saves immediately on upload (bypasses "Save Changes" button). Decision pending: should hold in formData and commit only on Save Changes. P2 for S331.

**Decisions logged:**
- Sale cover photo: 1 photo only (not a gallery). Index 0 of `photoUrls[]` array.
- Remind Me: email reminders backend is built. "Push reminders coming soon" copy is stale — should say "Remind me by email."

**Resolved this session:**
- ✅ P2 draft counter mismatch — FIXED: backend `getItemsBySaleId` wasn't returning `draftStatus` field. Added to select clause. Frontend `computeDraftStatus` now uses real DB value instead of guessing.
- ✅ QA Test Item cleanup — deleted via live site UI.
- ✅ Single-item Publish button — VERIFIED WORKING via camera capture → AI tag → Review & Publish → Publish.
- ✅ conditionGrade + tags not loading on Edit Item page — FIXED: `getItemById` select clause was missing both fields. Chrome-verified: grade "B" highlighted correctly.
- ✅ Edit Item / Review & Publish parity — Added Condition Grade, Tags, Suggest Price, Publish/Unpublish to Edit Item page.

## Blocked/Unverified Queue

| Feature | Reason | What's Needed | Session Added |
|---------|--------|----------------|---------------|
| #143 PreviewModal onError | Code fix pushed (sha: ffa4a83). 📷 fallback on Cloudinary 503 in place. | Defensive fix only — can't trigger 503 in prod. ACCEPTABLE UNVERIFIED. | S312 |
| #143 AI confidence — Camera mode | cloudAIService.ts fix is code-correct; processRapidDraft passes aiConfidence through. Can't test without real camera hardware in Chrome MCP. | Real device camera capture → Review & Publish → confirm "Good (X%)" or similar. | S314 |
| Single-item publish fix | S326 code fix deployed. S327 confirmed API call fires but no DRAFT items exist to test the button. Manual Entry creates AVAILABLE items, skipping draft pipeline. | Camera-capture an item → go to Review & Publish → click Publish on single item → confirm status changes + toast. | S326/S327 |
| Cover photo doesn't show seed value | useState bug — initialPhotoUrl only read at mount time. When formData loads async, component doesn't re-render. | Fix: useEffect hook in SaleCoverPhotoManager to sync state when initialPhotoUrl changes. | S330 |

**S326 COMPLETE (2026-03-28):** 3 bugs fixed + 1 test item cleanup. (1) **P1 Buyer Preview placeholder — ROOT CAUSE FIXED:** `buildCloudinaryUrl()` in review.tsx was replacing `:` with `_` in aspect ratio transforms (`ar_4_3` → Cloudinary rejects). Removed the `.replace(':', '_')` so it sends correct `ar_4:3`. Chrome-verified: Buyer Preview grid now shows real Cloudinary photos (ss_7201mwej2, ss_6354i4qpv). (2) **Face-detection blob URL fix (secondary):** `handleFaceUploadAnyway` in [saleId].tsx was storing blob URLs instead of Cloudinary URLs returned by API. Now stores `res.data.photoUrl`. (3) **P1 Single-item Publish button — FIXED:** `handlePublishItem` was sending `draftStatus` via generic PUT `/items/:id`, but backend `updateItem` didn't include `draftStatus` in destructured fields — silently dropped. Fix: frontend now uses dedicated `POST /items/:itemId/publish` endpoint for publishing, generic PUT for unpublishing (with `draftStatus` added to backend's accepted fields). Also relaxed publish gate to allow DRAFT + PENDING_REVIEW items (was PENDING_REVIEW-only). NEEDS CHROME VERIFY after deploy. (4) **P2 Nav search — already working:** S322/S323 fixed this. Desktop has no nav search (mobile-only) — logged as P3 gap. (5) **Test item cleanup:** Deleted 2 of 3 test lighters per Patrick, kept 1. Sale now has 14 items. Files: review.tsx, [saleId].tsx, itemController.ts. Pushblock provided.

**S321 COMPLETE (2026-03-28):** Nav full audit + homepage fixes. (1) Review Item modal thumbnail fixed: `thumbnailUrl` dropped during ID swap in [saleId].tsx (lines 701, 757) — now preserved so review modal shows captured photo instead of placeholder. (2) Desktop dropdown full nav audit: added Organizer Tools + Pro Tools collapsible sections (were missing entirely); normalized all links to `px-3 py-2 rounded-md`; added `text-sm` to TierGatedNav.tsx both link states. (3) Shopper menu parity: desktop dropdown had only About/Settings/Sign Out for shopper users — added Shopper Dashboard, My Profile, My Saves, Referrals, Host a Sale CTA, My Explorer Profile collapsible (10 links). (4) Dual-role: "My Dashboard" → "Shopper Dashboard" in mobile; both dashboards shown for dual-role users. (5) Homepage search: itemSearchService.ts now queries item tags + sale tags via PostgreSQL `@>` — "eames", "mid century", "rolex" now searchable. (6) Sales Near You card: redesigned as 2-column layout, sale counts by type, full card links to /map. Files: [saleId].tsx, AvatarDropdown.tsx, Layout.tsx, TierGatedNav.tsx, itemSearchService.ts, index.tsx. All pushed.

**S322 COMPLETE (2026-03-28):** Edit-sale form fixes + bulk publish gate fix. (1) SaleMap restored to Sales Near You card (S321 removed it); collapsed text to single footer line. (2) Homepage search wired to `/api/search?q=...` FTS endpoint — was filtering client-side only; now finds items by name/tags/description. (3) `getSaleType()` fixed to read `sale.saleType` DB field instead of parsing tags. (4) Sale type select dropdown added to edit-sale form. (5) PickupSlotManager dark mode pass. (6) Pro gate on edit-sale fixed: try/catch swallows 403 from markdown-config endpoint so SIMPLE users can save. (7) Save Changes button added at top of form. (8) Form reset bug fixed: `refetchOnWindowFocus: false` + `queryClient.invalidateQueries` on save. (9) Entrance note dark mode fixed in EntrancePinPickerInner.tsx. (10) Root cause of non-saving fields found: `notes`, `treasureHuntEnabled`, `treasureHuntCompletionBadge` were not in `saleCreateSchema` Zod — Zod stripped them silently. Added all 3. (11) `notes` field added to Sale model in schema.prisma + migration `20260328_add_sale_notes`. (12) Review & Publish PRO gate fixed: `POST /items/bulk` was `requireTier('PRO')` — SIMPLE users couldn't publish items. Changed to `requireTier('SIMPLE')`. Files: edit-sale/[id].tsx, EntrancePinPickerInner.tsx, saleController.ts, schema.prisma, migration (NEW), items.ts.

**S323 COMPLETE (2026-03-28):** QA session — S322 verification + 2 bug fixes + Chrome concurrency rule. (1) Edit-sale field persist ✅ — entrance note, approach notes, treasure hunt all saved and reloaded correctly as SIMPLE user (ss_0940ajm6p/ss_2627ysx2a/ss_5529i8hqh). No PRO gate. (2) Review & Publish Publish All — UNVERIFIED (all seeded items are AVAILABLE, Publish All only shows with DRAFT items). (3) Nav menus: Organizer collapsibles ✅, shopper links ✅. P2 bug fixed: duplicate Logout in mobile nav — Layout.tsx had a bare Logout button in `authLinks` AND another in the global footer section; removed the one from `authLinks`. (4) Homepage search ✅ — FTS wired and working: "chair" returns 5 results with item cards, photos, prices, "View Sale →" links. (5) Sales Near You card ✅ — map loads, "View on Map →" links to /map. (6) Search results below-fold UX fixed: index.tsx now auto-scrolls to results heading when query ≥2 chars. (7) Chrome concurrency rule added to CLAUDE.md §10c + findasale-qa.skill packaged. Files: Layout.tsx, index.tsx, CLAUDE.md.

## Next Session (S332) — #13 Hold Button Board Session

### Push Required First
Patrick must run S331 push block (11 files — includes STATE.md) before S332 begins.

### S332 Priority: Hold Button Full Board Review
Dispatch DA + Steelman + Hacker + Advisory Board on #13 with these specific questions:
1. **Abuse/fraud risk** — DA and Hacker weigh in on hold abuse, gaming, and security surface
2. **Business model** — Should holds be free? Require 50% deposit (payment intent)? Tier-gated (Hunt Pass / PRO only)?
3. **Gamification angle** — Is hold a Hunt Pass perk? Part of Explorer Rank perks? Or open to all tiers?
4. **Organizer control** — Can organizers disable holds per sale? Set their own hold duration?
5. After board returns: if green-lit, dispatch dev to wire the item card button with approved safeguards

### QA Queue (After Push — S332)
- Bug 1: Dark mode stats visibility on sale page — Chrome verify
- Bug 4: Buy Now success card persists (no auto-dismiss) — Chrome verify
- Bug 5: Reviews aggregate count matches displayed reviews — Chrome verify
- Decision #9: Remind Me button fires API + correct toast — Chrome verify
- Decision #8: Share button native share sheet on mobile — Chrome verify
- Decision #11: QR code hidden from shopper view — Chrome verify
- Decision #12: Reviews summary in Organized By card — Chrome verify
- Decision #14: Trending page renders via unified ItemCard — Chrome verify
- Cover photo useEffect fix: seeded photo shows on edit-sale form load — Chrome verify

### Decisions Logged This Session
- **#10 Sale Soundtrack:** Move OFF sale page → integrate into existing door QR code flow (organizer prints QR → shopper scans → playlist opens). Social share card embed = roadmap backlog. Dev dispatch needed S332+.
- **#14 ItemCard Unification:** Phase 1 complete (ItemCard.tsx + trending.tsx). Phases 2–5 = roadmap backlog.
- **#15 Save/Wishlist:** UX spec done. Implementation = roadmap backlog.

### Roadmap Items to Add (Records to log next session)
- #10 QR Door Experience (Sale Soundtrack): integrate playlist link into existing sale QR poster
- #14 ItemCard Phases 2–5: migrate dashboard, search, sale detail, gallery surfaces
- #15 Save/Wishlist item card: implement UX spec (heart + three-dot menu)

**S329 COMPLETE (2026-03-28):** Discovery page photo fixes + two P3 fixes. (1) **Trending photos:** `getTrendingItems` backend was missing `photoUrls` in Prisma select; frontend interface referenced `photos[0].url` instead of `photoUrls[0]`. Fixed both — items with photos now render. (2) **Inspiration Gallery:** InspirationGrid.tsx had an `absolute inset-0` "Image unavailable" overlay that was unconditionally rendered on top of every card even when images loaded. Fixed with `imageErrors` Set state — overlay now only shows on `onError`. TS fix: `new Set(prev); next.add(itemId)` to avoid Set spread downlevelIteration error. (3) **Duplicate category filter pills:** Normalized category to `.toLowerCase()` before grouping in `sales/[id].tsx`. (4) **Item detail cart/views counts:** `getItemById` now queries `checkoutAttempts` and returns computed `cartCount`; `views` returns 0 (no view-tracking table yet). (5) `next.config.js`: added `picsum.photos` to image domains + CSP (later confirmed irrelevant — real issue was the overlay bug). Files: trendingController.ts, trending.tsx, sales/[id].tsx, itemController.ts, next.config.js, InspirationGrid.tsx. Chrome-verified: Inspiration ✅ (ss_3444tt102), category pills ✅ (ss_9986zybr4), cart/views counts ✅ (ss_0398yzw9c).

**S328 COMPLETE (2026-03-28):** Full product audit + 2 backend fixes. (1) **P2 draft counter fix:** Added `draftStatus: true` to `getItemsBySaleId` select clause in itemController.ts. Frontend `computeDraftStatus` now uses real DB field. Chrome-verified: "15 items • 14 published" (correct). (2) **conditionGrade + tags fix:** Added `conditionGrade: true` and `tags: true` to `getItemById` select clause. Chrome-verified: Edit Item page loads grade "B" highlighted + 7 tags with remove buttons. (3) **Edit Item / Review & Publish parity:** Dev dispatched to add Condition Grade (S/A/B/C/D), Tags (curated grid + custom), Suggest Price, Publish/Unpublish button to edit-item page. All deployed and working. (4) **Single-item Publish verified:** Camera-captured lighter → AI auto-tagged → Review & Publish → single-item Publish → moved to published. S326 fix confirmed. (5) **QA Test Item deleted** via live site. (6) **Full product audit (organizer + shopper flows):** Feed ✅, Map ✅, Trending Hot Sales ✅, Sale Detail ✅, Organizer Dashboard ✅, Shopper Dashboard ✅, Item Detail ✅. **3 bugs found:** P1 item photos broken on Trending "Most Wanted" + Inspiration Gallery (cardboard box placeholders), P3 duplicate category filter pills, P3 item detail missing view/cart counts. Files: itemController.ts (2 select clause fixes), edit-item/[id].tsx (conditionGrade, tags, publish/unpublish).

**S327 COMPLETE (2026-03-28):** S326 smoke test session. (1) **Buyer Preview Cloudinary photos ✅ VERIFIED** — all item cards on public sale page show real Cloudinary photos with correct aspect ratios. `ar_4:3` fix confirmed working. (2) **Review & Publish hooks fix ✅ VERIFIED** — page correctly handles static export empty `router.query`. Performance API confirms `/api/items/drafts?saleId=...` fires after hydration. Shows "0 items" because all items are AVAILABLE (no DRAFT items). Hooks violation and early-return bugs both fixed. (3) **Single-item Publish button — UNVERIFIED** — no DRAFT items exist to test against. Manual Entry creates items as AVAILABLE, skipping draft pipeline entirely. (4) **New P2 found:** Add Items page subtitle says "14 items • 1 draft" but all items show AVAILABLE in table and `/items/drafts` returns empty — draft counter is wrong. (5) **Review & Publish P1 bug from S327 (now fixed):** React Rules of Hooks violation — early returns before `useQuery`/`useMutation` hooks + static export `router.query = {}`. Fixed by moving all guards after hooks and using `enabled: !!saleId`. Deployed and verified working. No files changed this session — QA only.

**S325 COMPLETE (2026-03-28):** S324 thumbnail fix smoke test — comprehensive live-site QA of photo rendering across 16+ surfaces. (1) Thumbnail fix confirmed working: Cloudinary photos render without hard refresh on sale pages, item detail, search results, map popups, category grids, feed cards, organizer dashboards, add-items table, edit-item. (2) Service Worker fix verified: added Cloudinary `StaleWhileRevalidate` route to runtimeCaching + `connect-src` CSP for SW fetch in next.config.js. Removed stale custom sw.js. (3) Camera (AI) full pipeline tested: Rapidfire capture, Regular multi-angle (1/5, 2/5), mode switching, thumbnail → Review Item modal with AI-generated fields (title, description, price, category, condition, tags), Done Reviewing (save toast), Enhance, camera switch, → Pub button, close. All working end-to-end with real Cloudinary uploads. (4) **P1 bug found:** Buyer Preview card component shows camera placeholder icon instead of actual Cloudinary photo for DRAFT/PENDING items. Photo exists everywhere else. (5) P2 finding: nav search bar doesn't trigger search. (6) Finding: edit-sale missing cover photo section. No code changes this session — QA only. 3 test items created (lighters) need cleanup.

**S324 COMPLETE (2026-03-28):** Sitewide thumbnail first-load fix. SaleCard.tsx `useEffect` resets imgLoaded/imgError on URL change + `key={optimizedUrl}`; [saleId].tsx + review.tsx `key={item.photoUrls[0]}` on thumbnail imgs. Service Worker runtimeCaching updated for Cloudinary `StaleWhileRevalidate`. CSP connect-src added. Stale custom sw.js removed. Smoke tests: mobile nav ✅, homepage search ✅, sale type filters ✅, Publish All SIMPLE ✅. Files: next.config.js, SaleCard.tsx (prior session), [saleId].tsx, review.tsx, sw.js (deleted).

**S319 COMPLETE (2026-03-28):** 6 fixes shipped + reseed + shopper walkthrough. (1) "All items sold or reserved" banner fixed: `ACTIVE` → `AVAILABLE` + removed non-existent `PENDING` from soldCount in sales/[id].tsx. (2) Reseeded Railway with 17 real Cloudinary photos — picsum removed from seed.ts entirely. (3) Message compose footer fixed: `_app.tsx` supports `getLayout` pattern; messages/[id].tsx uses `noFooter={true}` (Chrome-verified ss_1731k6do9). (4) Badge loading P1 fixed: `/users/me/points` endpoint was missing — added `getBadges` controller + route (Chrome-verified ss_80947s2pv). (5) Badge empty state fixed: profile.tsx was rendering 3 dashed blank placeholder boxes when badges=[] — replaced with "No badges yet / Start shopping to earn your first badge!" (QA honesty failure caught by Patrick from screenshot). (6) Shopper walkthrough QA: likes ✅, profile ✅, Loot Legend ✅, Hunt Pass ✅, messaging ✅, dark mode ✅, mobile ✅.

**S318–S284 archived.** See `claude_docs/COMPLETED_PHASES.md` for full history.

---

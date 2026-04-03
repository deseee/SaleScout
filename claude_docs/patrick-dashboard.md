# Patrick's Dashboard — S384 Complete (2026-04-03)

---

## Status

- **Vercel:** ✅ Green (pending S380+S381+S382+S383 pushes)
- **Railway:** ✅ Green
- **DB:** ✅ Migration 20260402_add_charity_donation deployed

---

## What Happened This Session (S384)

**Full orphan audit — research only, no code changes. S385 dispatches everything.**

Scanned 4 layers of the codebase for things built but not surfaced. Found and decided on every item:

- **35 orphaned components:** 25 will be wired (real backends, real features). 3 deleted (approved). LiveFeedWidget deferred. Key finds: ActivityFeed, HypeMeter, FeedbackWidget, DisputeForm all have complete backends and are trivial to wire.
- **Backend routes:** Ripples and SmartFollows were false alarms (working fine). TreasureHuntQR is 70-75% done — ship it next session (one mount line). templates.ts is a dead duplicate — delete it.
- **22 schema fields audited:** holdDurationHours safe to delete (rank system took over). arrivalRank deleted (LineEntry.position replaced it). priceBeforeMarkdown/markdownApplied need frontend display. Review.verifiedPurchase badge missing. OrganizerReputation ignores actual reviews — fix next session.

## What Happened Last Session (S383)

Toast dismiss button on all toasts. Onboarding modal completion stays on dashboard (was navigating away). Install App button in nav (hides when already installed). Pricing audit found FlashDeal and Reverse Auction orphans.

---

## Push Required

### Push 0 — S383 (toast + onboarding + Install App) — PENDING
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/frontend/components/ToastContext.tsx
git add packages/frontend/components/OrganizerOnboardingModal.tsx
git add packages/frontend/components/AvatarDropdown.tsx
git add packages/frontend/components/Layout.tsx
git commit -m "fix: toast dismiss button, onboarding completion stays on dashboard, Install App in nav"
.\push.ps1
```

### Push 1 — S380 (nav cleanup) — STILL PENDING
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/frontend/components/Layout.tsx
git add packages/frontend/components/AvatarDropdown.tsx
git add packages/frontend/pages/organizer/line-queue/index.tsx
git add packages/frontend/pages/organizer/photo-ops/index.tsx
git add packages/frontend/pages/organizer/promote/index.tsx
git add packages/frontend/pages/organizer/send-update/index.tsx
git add packages/frontend/pages/shopper/history.tsx
git add packages/frontend/pages/shopper/dashboard.tsx
git rm packages/frontend/pages/shopper/hauls.tsx
git rm packages/frontend/pages/shopper/alerts.tsx
git rm packages/frontend/pages/organizer/performance.tsx
git commit -m "S380: nav cleanup, dead link fixes, 4 sale-picker pages, gamification nav wiring, disputes tab, orphaned pages removed"
.\push.ps1
```

### Push 2 — S381+S382 (camera fixes + review page)
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/frontend/components/RapidCapture.tsx
git add "packages/frontend/pages/organizer/add-items/[saleId].tsx"
git add packages/frontend/components/ItemPhotoManager.tsx
git add "packages/frontend/pages/organizer/add-items/[saleId]/review.tsx"
git add claude_docs/STATE.md
git add claude_docs/patrick-dashboard.md
git commit -m "S381+S382: camera flow overhaul, regular mode Analyze button, review page bulk/per-item delete, scroll-to-top on expand"
.\push.ps1
```

---

## Next Session (S385)

Start dispatching immediately — no research needed, all decisions made. S384 STATE.md has the full dispatch plan.

**Wave 1 (parallel dispatch):** Cleanup deletions + TreasureHuntQR route mount + FeedbackWidget + ActivityFeed/HypeMeter + DisputeForm create button + BulkPriceModal + emailSentAt 1-liner.
**Wave 2:** Review response feature + shopperRating into reputation score.
**Wave 3:** Wire remaining 24 WIRE components in batches by feature area.

---

## Audit Alerts (Weekly Audit — 2026-04-02)

**1 CRITICAL + 5 HIGH findings detected.** Full report: `claude_docs/audits/weekly-audit-2026-04-02.md`

- **CRITICAL — Sale detail items buried below map (D-006 drift):** Items for Sale section appears BELOW Location/Map/Reviews.
- **HIGH — Trending page images broken:** Hot Sales cards show blank white areas.
- **HIGH — Inspiration Gallery ALL images missing:** Every item card shows grey placeholder.
- **HIGH — Feed page images blurry/low-res:** All sale card images are heavily blurred thumbnails.
- **HIGH — Pricing page says Teams = 5 members, should be 12 (D-007 LOCKED).**
- **HIGH — Seed data quality:** Item categories wrong, descriptions template-generic.

---

## Open Action Items for Patrick

- [ ] **⚠️ Push S383 (block 0 above) — toast/onboarding/Install App**
- [ ] **⚠️ Push S380 (block 1 above)**
- [ ] **⚠️ Push S381+S382 (block 2 above)**
- [ ] **⚠️ eBay Developer App (enables real comps for #229/#244):** Create app at https://developer.ebay.com → get `EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET` → set as Railway env vars.
- [ ] **Trademark decision (#82):** File USPTO trademark for FindA.Sale? ~$250–400/class
- [ ] **Trade secrets (#83):** Document proprietary algorithms + NDA review
- [ ] **Brand Voice Session:** Overdue — real beta users forming impressions without documented voice
- [ ] **⚠️ Set `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831` on Railway**
- [ ] **⚠️ Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on Railway**

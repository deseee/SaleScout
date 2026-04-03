# Patrick's Dashboard — S388 Complete (2026-04-03)

---

## Status

- **Vercel:** ⏳ Push needed (15 frontend files changed)
- **Railway:** ⏳ Push needed (1 backend file changed)
- **DB:** ✅ No migrations this session

---

## What Happened This Session (S388)

**Documentation & Coaching Overhaul — research + implementation across all 5 focus areas.**

Researched pricing, tier matrix, rank matrix, coaching, and FAQ/copy with 5 parallel agents. All 10 key decisions confirmed as already locked from prior sessions (no new decisions needed).

**Fixes shipped:**
- Pricing page corrected: PRO $49→$29, TEAMS $99→$79 (TierComparisonTable was already correct)
- XP rank thresholds aligned to board numbers: Ranger 2000, Sage 5000, Grandmaster 12000
- XP values corrected: visit 10→5, purchase flat 15→$1=1XP
- 13 "AI" branding violations replaced with "smart tagging" / "auto-tagging" / "system" across 9 files
- Sale type language broadened from "estate sales" to include yard/garage/flea/consignment across 4 files
- Camera coaching banner added (regular mode) — progressive 5-shot guidance, replaces dead `showShotGuidance`
- 7 new FAQ entries added (Explorer's Guild, challenges, Passport, Condition Rating, tier differences, Brand Kit, Command Center)

**Research produced:** Full synthesis doc with code-verified file paths for all findings + game design matrix reconciled against S259 source of truth.

---

## What Happened Last Session (S387)

Rapidfire camera polish + site-down fix (CartProvider missing). + button timing, hold/release AI analysis, toast cleanup.

---

## Push Required

---

## Audit Alerts (from S386 weekly audit — still open)

- **CRITICAL — Sale detail items buried below map:** Items for Sale section appears below Location/Map/Reviews.
- **HIGH — Trending page images broken:** Hot Sales cards show blank areas.
- **HIGH — Inspiration Gallery ALL images missing:** Every item card shows grey placeholder.
- **HIGH — Feed page images blurry:** All sale card images are heavily blurred thumbnails.
- **HIGH — Pricing page says Teams = 5 members, should be 12 (D-007 LOCKED).**
- **HIGH — Seed data quality:** Item categories wrong, descriptions template-generic.

Full report: `claude_docs/audits/weekly-audit-2026-04-02.md`

---

## Next Session (S389)

- **Stripe price objects:** Verify stripeController.ts price IDs match $29/$79 — may need recreation
- **SIMPLE concurrent sales gate:** Architect spec needed for maxConcurrentSales in tierLimits.ts + enforcement
- **Gamification Phase 1:** ~45-50% built. Major gaps: seasonal infrastructure, notifications, XP wiring to purchase/visit/auction flows, dynamic Hunt Pass pricing
- **Organizer tier rearrangement:** All features open to reorg except social/viral (stays free). Formal proposal needed.
- **Smoke test S388 changes:** Verify pricing page, FAQ, coaching banner, AI branding fixes live

---

## Open Action Items for Patrick

- [ ] **⚠️ eBay Developer App:** Create app at https://developer.ebay.com → get `EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET` → set as Railway env vars
- [ ] **⚠️ Set `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831` on Railway**
- [ ] **⚠️ Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on Railway**
- [ ] **Trademark decision (#82):** File USPTO trademark for FindA.Sale? ~$250–400/class
- [ ] **Trade secrets (#83):** Document proprietary algorithms + NDA review

# Patrick's Dashboard — S374 Complete (2026-04-01)

---

## Status

- **Vercel:** ✅ Green
- **Railway:** ✅ Green
- **DB:** ✅ Seed data synced

---

## What Happened This Session (S374)

Roadmap planning + feature prep. No code shipped — all doc/spec work.

**Roadmap v90:** Features #240–244 promoted from the informal "Next Up" staging section into the Building — Active Backlog with proper numbering, spec links, and column format. The staging section is now removed from Deferred.

**eBay Quick List (#244) spec written** (`claude_docs/feature-decisions/ebay-quick-list-spec.md`): Full field mapping from AI intake data → eBay Inventory API, 3-phase build plan, confirmed decisions (watermarked photos by default, clean photo export = paid upsell, both Phase 1 CSV and Phase 2 PRO API push prioritized, cross-platform sold sync as Phase 3). Revenue model: EPN affiliate commission + watermark removal fee + Pirate Ship affiliate.

**S375 dispatch prompts prepared** (`claude_docs/feature-notes/s375-batch-dispatch-prompts-2026-04-01.md`): 5 ready-to-fire agent prompts. Session A dispatches Agents 1–4 in parallel (no schema changes, no file conflicts). Session B dispatches Agent 5 alone (Charity Close schema migration).

## What Happened Last Session (S373)

Ripples page fixed, Command Center fully working, ripple event wiring complete, seed data cleaned up.

---

## Next Session (S375)

**Load first:** `claude_docs/feature-notes/s375-batch-dispatch-prompts-2026-04-01.md`

**Session A — dispatch 4 agents in parallel:**
- Agent 1: #240 Print-to-QR Sign Kit + #242 QR Item Labels (extends existing printKitController.ts)
- Agent 2: #241 Brand Kit Expansion (extends existing brand-kit.tsx)
- Agent 3: #229 AI Comp Tool + #244 Phase 1 eBay CSV Export
- Agent 4: #243 Smart Cart (shopper localStorage cart)

**Session B (separate session, after Session A deployed):**
- Agent 5: #235 Charity Close + Tax Receipt PDF (schema migration required)

---

## Open Action Items for Patrick

- [ ] **⚠️ eBay Developer App (blocks #229/#244):** Create app at https://developer.ebay.com → get `EBAY_CLIENT_ID` + `EBAY_CLIENT_SECRET` → set as Railway env vars. Agent 3 builds gracefully without them (mock data) but comps won't be real until set.
- [ ] **Trademark decision (#82):** File USPTO trademark for FindA.Sale? ~$250–400/class
- [ ] **Trade secrets (#83):** Document proprietary algorithms + NDA review
- [ ] **Brand Voice Session:** Overdue — real beta users forming impressions without documented voice
- [ ] **⚠️ Set `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831` on Railway**
- [ ] **⚠️ Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on Railway**

# ROADMAP – FindA.Sale

**Last Updated:** 2026-03-05 (v8 — Sprint S done: Phase 16 complete. All Five Pillars shipped.)
**Status:** Production MVP live at finda.sale. 21 phases shipped. All Five Pillars complete.

---

## Five Pillars

1. **Organizer Photo/Video Workflow** (Phases 14–16) ✅
2. **UI/UX Design Overhaul** (Phases 24–27) ✅
3. **Social & Discovery Layer** (Phases 17, 28–30) ✅
4. **Shopper Engagement Engine** (Phases 18–21) ✅
5. **Creator-Led Growth + Distribution** (Phases 22–23, 31–32) ✅

Research archives: `claude_docs/research/competitor-intel-2026-03-04.md`, `claude_docs/research/growth-channels-2026-03-04.md`

---

## Sprint Priority Order

| Sprint | Phases | Focus | Status |
|--------|--------|-------|--------|
| A | 12 | Auction completion | ✅ Done |
| B | 24+25 | Design system + bottom tab nav | ✅ Done |
| C | 14a+b+c | Rapid capture + background AI + Cloudinary | ✅ Done |
| D | 17 | Reputation + follow system | ✅ Done |
| — | Infra | Railway backend + Neon PostgreSQL migration | ✅ Done (ngrok retired) |
| E | 26 | Listing card redesign + image pipeline | ✅ Done |
| F | 31 | OAuth social login | ✅ Done |
| G | 28 | Social proof + activity feed | ✅ Done |
| H | 18 | Photo preview drops | ✅ Done |
| I | 19 | Hunt Pass + shopper points | ✅ Done |
| J | 22 | Creator tier program | ✅ Done |
| K | 27 | Onboarding + empty states + microinteractions | ✅ Done |
| L | 29 | Discovery + search | ✅ Done |
| M | 15 | Review + rating system UI | ✅ Done |
| N | 20 | Shopper messaging | ✅ Done |
| O | 21 | Reservation / hold UI | ✅ Done |
| P | 23 | Affiliate + referral program | ✅ Done |
| Q | 30 | Weekly curator email | ✅ Done |
| R | 32 | Creator tools — CSV export | ✅ Done |
| S | 16 | Advanced photo pipeline | ✅ Done |

**All Five Pillars complete.** Next phase: Workflow & Infrastructure track or new sprint planning per Patrick.

**Infrastructure:** Backend on Railway (`backend-production-153c9.up.railway.app`), PostgreSQL on Neon, frontend on Vercel (`finda.sale`). ngrok bridge retired.

---

## Deferred Features

| Feature | Reason | Revisit |
|---------|--------|------|
| Socket.io live bidding | Polling sufficient for MVP | Real data shows demand |
| Multi-metro | Grand Rapids first | Post-beta validation |
| Shipping workflow | Not in-person scope | Organizer demand signal |
| Video-to-inventory | Vision models can't segment rooms | Late 2026+ |

---

## Remaining Feature Gaps

**Must-have before scale:** None from original Five Pillars — all shipped.

**Nice-to-have (post-beta):** Neighborhood landing pages, favorites categories, UGC bounties, instant payouts, shipping, label printing, Zapier integration, multi-metro expansion.

---

## Workflow & Infrastructure Track (Parallel — No Sprint Slot)

These run alongside feature sprints. No dedicated sprint needed.

| Task | Priority | Status |
|------|----------|--------|
| Model routing (Opus/Sonnet/Haiku sub-agents) | High | ✅ Implemented — model-routing.md |
| Session safeguards (repair loop circuit breakers) | High | ✅ Implemented — session-safeguards.md, CORE.md §12 |
| Patrick language map | High | ✅ Implemented — patrick-language-map.md, CORE.md §13 |
| Weekly industry intel scheduled task | Medium | ✅ Created — Mondays 9am |
| Daily context freshness check | Medium | ✅ Created — daily 8am |
| Self-healing entries 21–24 | High | ✅ Added |
| Uptime monitoring (external + Cowork investigation) | Medium | Queued — needs StatusGator/UptimeRobot |
| Sentry MCP (production error tracking) | Medium | Queued — needs Sentry account |
| Ollama embeddings for semantic search | Low | Queued — after Phase 29 |
| Stress test suite (schema drift, dead code, stale docs) | Medium | Queued — next Sonnet session |
| Pre-commit validation skill | Medium | Queued — next Sonnet session |

---

*v8 updated 2026-03-05. Sprint S complete — Phase 16 advanced photo pipeline. All 19 roadmap sprints done. Five Pillars fully shipped.*

# ROADMAP – FindA.Sale

**Last Updated:** 2026-03-07 (v19 — sprint 3 + 3.5 completed, migration count corrected)
**Status:** Production MVP live at finda.sale. Beta: GO. Full build history: `claude_docs/strategy/COMPLETED_PHASES.md`.

---

## Patrick's Checklist

### Business Formation + Legal
- [ ] Set up support@finda.sale email forwarding
- [ ] Order business cards (~$25) — files in `claude_docs/brand/`
- [ ] Create Google Business Profile for FindA.Sale
- [ ] Open Stripe business account
- [ ] Google Search Console verification
- [ ] Set up Google Voice for support line

### Credentials + Services
- [ ] Rotate Neon database credentials (exposed in git history — precaution)
- [ ] OAuth credentials (Google, Facebook) → Vercel env vars: GOOGLE_CLIENT_ID/SECRET, FACEBOOK_CLIENT_ID/SECRET
- [ ] VAPID keys confirmed in production
- [ ] ⚡ **Sync: Confirm 5%/7% platform fee (pricing analysis complete — Patrick decision pending)**

### Beta Recruitment
- [ ] Identify 5 target beta organizers (`claude_docs/beta-launch/organizer-outreach.md` ready)
- [ ] Schedule 1-on-1 onboarding sessions
- [ ] Hand-hold first 3 sales
- [ ] Collect structured feedback
- [ ] ⚡ **Sync: feedback → Claude for iteration**

---

## Running Automations

8 scheduled tasks active: competitor monitoring, context refresh, context freshness check, UX spots, health scout (weekly), monthly digest, workflow retrospective, weekly Power User sweep. Managed by Cowork Power User agent.

## Connectors

- [x] **Stripe** — query payment data, manage customers, troubleshoot payment issues directly
- [x] **MailerLite** — draft, schedule, and send email campaigns directly from Claude

*CRM deferred — Close requires paid trial. Use spreadsheet/markdown for organizer tracking until beta scale warrants it.*

---

## Feature Pipeline

### Next Up
| # | Feature | Est. | Notes |
|---|---------|------|-------|
| 4 | Search by Item Type | 2 sprints | Index items, search UI, result optimization. |

*Recently shipped: AI Sale Description Writer (session 87), Branded Social Templates (session 87), Shopper Loyalty Program (session 88), Code deGR-ification (session 89). See COMPLETED_PHASES.md.*

### Phase 3 — Weeks 8–16
| # | Feature | Est. | Notes |
|---|---------|------|-------|
| 5 | Stripe Terminal POS | 2 sprints | In-person checkout. No monthly fees. Works with existing Stripe Connect. |
| 6 | Seller Performance Dashboard | 2 sprints | Analytics, benchmarks, pricing recommendations. |
| 7 | Shopper Referral Rewards | 1–2 sprints | Referral tracking, rewards distribution, email notifications. |
| 8 | Batch Operations Toolkit | 1 sprint | Bulk pricing, status updates, photo uploads. |

### Phase 4 — Post-16 Weeks
| # | Feature | Est. | Notes |
|---|---------|------|-------|
| 9 | Premium Organizer Tier | 2 sprints | Feature gating + billing integration. |
| 10 | Real-Time Status Updates | 1 sprint | Organizer mobile widget, SMS/email alerts. |
| 11 | Shopper Referral Rewards expansion | 1 sprint | Viral growth loop. |
| 12 | Verified Organizer Badge | 1–2 sprints | Professional differentiation, trust signal. |

---

## Sync Points

| Sync | What's Needed | Status |
|------|---------------|--------|
| ⚡ Confirm 5%/7% fee | Pricing analysis done — Patrick decides | Pending Patrick |
| ⚡ Beta readiness | Patrick's checklist above → first real user | Waiting on Patrick items |
| ⚡ Beta feedback loops | Beta feedback → Claude iterates on features | Pending beta launch |

---

## Deferred & Long-Term Hold

| Feature | Reason | Revisit |
|---------|--------|--------|
| White-label MaaS | Business decision — beta validation first | After beta data |
| Consignment Integration | Thrift store POS — post-beta complexity | After beta data |
| QuickBooks Integration | CSV export covers 80% of need | When organizers ask |
| Video-to-inventory | Vision models can't reliably segment rooms yet | Late 2026+ |
| Multi-metro expansion | Beta validation first | After beta data |
| AR Furniture Preview | Hardware not ready | Long-term R&D |

*Deprecated (won't build): Co-Branded Yard Signs, Multi-Format Marketing Kit.*

---

## Infrastructure

All infra complete. Backend: Railway. DB: Neon (63 migrations applied as of 2026-03-07). Frontend: Vercel (`finda.sale`). Git: `.\push.ps1` replaces `git push`. See `claude_docs/CORE.md` and `claude_docs/STACK.md`.

---

## Maintenance Rules

This document is updated at **every session wrap** when:
- A Patrick checklist item is completed
- A feature ships
- Beta status changes
- A deferred item is activated or cancelled

**Enforcement:** `claude_docs/CORE.md` §15(b) and `claude_docs/SESSION_WRAP_PROTOCOL.md` Step 2.
Roadmap and session-log are always updated in the same commit.

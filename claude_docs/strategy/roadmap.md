# ROADMAP – FindA.Sale

**Last Updated:** 2026-03-25 (v71 — S281/S282: #84 approach notes, #85 treasure hunt QR, #91 auto-markdown, #133 hunt pass redesign, #136 QR auto-embed, Platform P3-P5C (#99-121) all shipped and QA'd in S282. All remaining buildable backlog now built.)

**Status:** Production MVP live at finda.sale. Beta: GO. Full build history: `claude_docs/strategy/COMPLETED_PHASES.md`.

---

## Product Summary

FindA.Sale is a PWA for sale organizers and shoppers, reducing manual work and improving inventory visibility across the sale lifecycle.
The platform currently ships **95+ features across 4 tiers** (FREE, SIMPLE, PRO, TEAMS) and
supports organizer-side operations, analytics, marketing, and
shopper-side discovery, engagement, and gamification.
Production MVP launched Q1 2026. Full auction lifecycle (bidding + close flow + Stripe winner checkout) live.

---

## Formatting Rules (Agents Must Read Before Editing)

**STOP. Read this section before making any changes to this file. This is binding on all agents. Violations will be flagged by findasale-records.**

1. **No session-specific notes in this file.** Do not add QA audit results, bug lists, session numbers, or work-session plans to the roadmap. Those belong in:
   - Session-specific findings → `claude_docs/session-log.md` or `claude_docs/audits/`
   - QA results → `claude_docs/health-reports/`
   - Work queues → `claude_docs/STATE.md` or `claude_docs/next-session-prompt.md`
   - Operational tasks → `claude_docs/operations/`

2. **Session numbers must not appear in Notes.** Write "QA confirmed" not "QA re-confirmed S201". Write "P0 race condition fixed" not "P0 FIX S199".

3. **Column format is locked.** Shipped feature tables must use exactly these columns: `# | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes`. Do not add or remove columns without Patrick's approval.

4. **Status markers:** ✅ = confirmed working, 📋 = pending/not tested, 📋PEND = pending QA, ⚠️ = issues found, 🔧 = fix in progress, N/A = not human-testable (infrastructure/internal only).

5. **Deferred section:** Keep all deferred items — even rejected ideas may spark good ones. Use format: `Feature | Tier | Reason | Revisit Trigger`.

6. **When adding a new shipped feature:** Add it to the correct section table with all 11 columns filled. Set Chrome/Nav/Human to 📋 unless already verified.

7. **When updating status:** Only change the specific column that changed. Do not rewrite the Notes column or other feature rows.

---

## Patrick's Checklist

### Business Formation + Legal
- [x] File Michigan LLC with LARA ✅
- [x] Get EIN from IRS.gov ✅
- [x] Open business bank account ✅
- [x] Set up support@finda.sale email forwarding ✅ (2026-03-06)
- [ ] Order business cards (~$25) — files in `claude_docs/brand/`
- [ ] Create Google Business Profile for FindA.Sale
- [ ] Open Stripe business account
- [ ] Google Search Console verification
- [ ] Set up Google Voice for support line

### Credentials + Services
- [x] Google Cloud account + Vision API key ✅ (2026-03-05)
- [x] Anthropic API key (for Claude Haiku) ✅ (2026-03-05)
- [x] UptimeRobot monitoring ✅ (2026-03-05)
- [x] Rotate Neon database credentials ✅ (2026-03-09)
- [x] OAuth credentials (Google, Facebook) → Vercel env vars ✅ (2026-03-06)
- [x] Platform fee locked at 10% flat ✅ (session 106)
- [ ] VAPID keys confirmed in production
- [ ] **⚠️ Set `MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831` on Railway**
- [ ] **⚠️ Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on Railway**

### Beta Recruitment
- [ ] Identify 5 target beta organizers — outreach template ready (`claude_docs/beta-launch/organizer-outreach.md`)
- [ ] Schedule 1-on-1 onboarding sessions
- [ ] Hand-hold first 3 sales
- [ ] Collect structured feedback
- [ ] Sync: feedback → Claude for iteration

### Pre-Beta Prep
- [ ] Brand Voice Session — use brand-voice plugin to establish documented voice, tone, and messaging pillars before beta outreach and email sequences
- [ ] Trademark filing — see backlog item #82

### Human Verification (Patrick must run)
- [ ] **Auction E2E — Stripe test mode:** Set auction end time on a test item → click End Auction button → confirm winner notification sent → open Stripe checkout link → complete checkout → confirm organizer close notification fires. (Documented S279; feature shipped S278.)

### Legal & Business (Patrick Action Items)

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 82 | Trademark — FindA.Sale | BIZ | LEGAL | — | — | — | — | N/A | N/A | 📋 | File USPTO trademark on "FindA.Sale" brand name if not already done. ~$250–400/class + attorney fees (~$1,500–2,500 total). First priority IP action. Attorney required. |
| 83 | Trade Secret Housekeeping | BIZ | LEGAL | — | — | — | — | N/A | N/A | 📋 | Document proprietary algorithms (fraud scoring, Near-Miss Nudge logic, City Heat Index formula, Flip Report scoring, AI condition grading prompts) as trade secrets in internal docs. Ensure all contractors/contributors have signed NDAs or are covered by agreements. No filing required — zero cost. |

---

## Feature Inventory — Shipped

### Organizer — Core Operations [SIMPLE]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 137 | Create / Edit / Publish / Archive Sales | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Core workflow |
| 139 | Sale Map with Geocoding | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | `/api/geocode` |
| 140 | Sale Calendar View | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Organizer + shopper views |
| 141 | Item Add / Edit / Delete / Status | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅S125 | ✅ | 📋 | Core CRUD |
| 144 | AI Tag Suggestions + Health Score | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅S124 | ✅ | 📋 | Haiku-powered, part of intake |
| 151 | Notification Inbox | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | In-app notification center |
| 162 | Stripe Terminal POS (v2) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Multi-item + cash, 10% fee parity |
| 71 | Organizer Reputation Score | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | 1-5 star public score + reputation.tsx frontend |
| 22 | Low-Bandwidth Mode (PWA) | BOTH | SIMPLE | N/A | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | Network API detection, localStorage, LowBandwidthContext |
| 19 | Passkey / WebAuthn Login | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | QA confirmed, clear to deploy |
| 167 | Disputes Management | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Trust & safety |
| 135 | Social Templates Expansion | ORG | SIMPLE | N/A | N/A | ✅ | ✅ | ✅ | 📋 | 📋 | SharePromoteModal + TikTok, Pinterest, Threads, Nextdoor. Shipped S280. |
| 89 | Unified Print Kit | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/organizer/print-kit/[saleId]` — yard sign + item price tags (6/page). Print CSS. Shipped S280. |
| 69 | Local-First Offline Mode | BOTH | PRO | N/A | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Service worker sync queue; offline catalog. |

### Organizer — Analytics & Intelligence [PRO]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 169 | Organizer Insights (Lifetime) | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Cross-sale totals + benchmarking |
| 25 | Organizer Item Library (Consignment Rack) | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | Upload once, reuse; cross-sale search, price history |
| 42 | Voice-to-Tag | ORG | PRO | N/A | ✅ | ✅ | ✅ | ✅S202 | N/A | 📋 | VoiceTagButton.tsx + useVoiceTag.ts complete. Web Speech API integration |
| 41 | Flip Report | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | Item resale potential scoring |
| 17 | Bid Bot Detector + Fraud Score | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | FraudBadge on holds page, fraud-signals.tsx |

### Organizer — Marketing & Brand Amplification [SIMPLE/PRO mixed]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 31 | Brand Kit | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Colors, logo, socials (auto-propagates) |
| 173 | Message Templates | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Saved organizer reply templates |

### Organizer — Sales Tools & Workflow [SIMPLE/PRO mixed]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 174 | Auction Mechanics + Close Flow | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | Countdown timer, bid modal, auto-bid, cron closing, manual end-auction button, auctionEndTime field, winner Stripe checkout link, organizer close notification, admin bid-review queue |
| 14 | Real-Time Status Updates | BOTH | PRO | ✅ | ✅ | ✅ | ✅ | ✅S202 | N/A | 📋 | Organizer widget, SMS/email alerts, SaleStatusWidget |
| 20 | Proactive Degradation Mode | BOTH | PRO | N/A | ✅ | ✅ | ✅ | ✅S202 | N/A | 📋 | DegradationBanner + middleware for offline |
| 30 | AI Item Valuation & Comparables | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | ValuationWidget (PRO-gated) on add-items page |

### Shopper — Discovery & Search [FREE]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 176 | Browse Sales (Homepage + Map) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | `/map`, `/` |
| 177 | Sale Detail Page | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/sales/[slug]` |
| 179 | Full-Text Search | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Advanced filters + location |
| 182 | Surprise Me / Serendipity Search | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | `/surprise-me` random discovery |
| 188 | Neighborhood Pages | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/neighborhoods/[slug]` local discovery |
| 90 | Sale Soundtrack (Ambient Vibes) | SHO | FREE | N/A | N/A | ✅ | ✅ | ✅ | N/A | 📋 | Spotify + Apple Music playlist suggestions per sale type on sale detail page. External links only. Shipped S280. |
| 189 | Trending Items / Sales | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅S194 | 📋 | 📋 | `/trending` page + API |
| 190 | Activity Feed | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅S194 | 📋 | 📋 | `/feed` page + API |
| 49 | City Heat Index | SHO | FREE | ⚠️ | ✅ | ⚠️ | ✅ | ✅S194 | ✅ | 📋 | Weekly "hottest metro" ranking; aggregated sale data |

### Shopper — Engagement & Community [FREE]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 29 | Shopper Loyalty Passport | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Stamps, badges, early-access perks |
| 32 | Shopper Wishlist Alerts + Smart Follow | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | Category/tag/organizer alerts on new items |
| 62 | Digital Receipt + Returns | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅S202 | ✅ | 📋 | Auto-generated receipt post-POS, return window |
| 45 | Collector Passport | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Specialty collection tracking + achievement path |
| 50 | Loot Log | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Personal purchase history with photos + prices |
| 87 | Brand & Designer Tracking | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | BrandFollow table. Follow brands → alerts on matching items. 4 endpoints + notification trigger on item publish |
| 88 | Haul Post Gallery (UGC Social Proof) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | UGCPhoto extended (isHaulPost, linkedItemIds, likeCount) + UGCPhotoReaction model. /hauls page live |
| 51 | Sale Ripples | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Social proof activity tracking. RippleIndicator auto-records. ripples.tsx analytics. |
| 54 | Crowdsourced Appraisal (Base) | BOTH | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Request/submit/vote appraisals; AI Sprint 3 deferred. |

### Shopper — Gamification [FREE + HUNT_PASS]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 126 | Gamification Legacy Cleanup | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | User.points removed, pointsService deleted, points routes deleted. All awardPoints() calls removed. QA confirmed no pts refs live |

### Platform & AI [FREE/SIMPLE]

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|

### Platform Safety & Cost Control

#### Bidding Integrity

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 93 | Bidder Account Age Gate (7-day) | PLATFORM | ALL | N/A | ✅ | N/A | ✅ | N/A | N/A | N/A | accountAgeGate.ts confirmed in code. 7-day minimum, ADMIN bypass. Wired to POST /:id/bids. (S280 verified) |
| 94 | Same-IP Bidder Detection | PLATFORM | ALL | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | BidIpRecord model + IP tracking in itemController. Admin bid-review page built. (S280 verified) |
| 95 | Bidding Velocity Limits | PLATFORM | ALL | N/A | ✅ | N/A | ✅ | N/A | N/A | N/A | bidRateLimiter.ts confirmed — 10 bids/60s via Redis, graceful degradation. (S280 verified) |

#### Buyer Transparency

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 96 | Buyer Premium Disclosure (4-Point Visibility) | PLATFORM | ALL | N/A | ✅ | ✅ | ✅ | N/A | N/A | N/A | Confirmed: stripeController itemized breakdown + CheckoutModal disclosure. (S280 verified) |
| 97 | Post-Purchase Confirmation Email (Premium Breakdown) | PLATFORM | ALL | N/A | ✅ | N/A | ✅ | N/A | N/A | N/A | Confirmed: breakdownHtml in stripeController with buyer premium, item photo, org name, etc. (S280 verified) |
| 98 | Chargeback Defense Documentation | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Confirmed: CheckoutEvidence model in schema + auto-capture in stripeController. (S280 verified) |

#### Account Controls

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 99 | Export Rate Limiting (1/month) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | CSV/JSON exports limited to 1 per month per account; prevents data harvesting. See anti-abuse-system-design-2026-03-19.md §Vector 1 |
| 100 | First-Month Refund Cap (50%) | PLATFORM | ALL | N/A | ✅ | N/A | ✅ | N/A | N/A | N/A | Refunds capped at 50% if requested <30 days post-signup. See anti-abuse-system-design-2026-03-19.md §Vector 1 |
| 101 | Email Verification (Unique per Organizer) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Hard gate: no multi-account signup with same email. See anti-abuse-system-design-2026-03-19.md §Vector 4 |
| 102 | Payment Method Deduplication | PLATFORM | ALL | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | Links organizer accounts sharing Stripe card/PayPal; suggests merge to Pro tier. See anti-abuse-system-design-2026-03-19.md §Vector 4 |

#### Cost Control

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 103 | Photo Retention Policy (90-day archive, 1-year delete) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Auto-archive after 90 days, delete after 1 year; reduces Cloudinary costs indefinitely. See total-cost-of-ownership-2026-03-19.md §Section 3 |

#### Fraud Detection & Account Management

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 106 | Organizer Reputation Scoring System | PLATFORM | ALL | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | OrganizerReputation model + computeReputationScore service confirmed in code. Badge endpoint live. (S280 verified) |
| 107 | Chargeback + Collusion Tracking | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Flags pattern of chargebacks + same-IP bidding; suspension after 3+ incidents. See anti-abuse-system-design-2026-03-19.md §Vector 2 |
| 108 | Winning Bid Velocity Check (low vs. value) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Flags auctions with winning bid <10% of estimated value; holds payment 24h for review. See anti-abuse-system-design-2026-03-19.md §Vector 3 |
| 109 | Off-Platform Transaction Detection (Post-Sale Monitoring) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | 30-day pattern detection: low-price sales with no activity flagged. See anti-abuse-system-design-2026-03-19.md §Vector 3 |
| 110 | IP-Based Soft Linking (Multi-Account Detection) | PLATFORM | ALL | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | Suggests merge for accounts from same IP with >3 concurrent sales in <7 days. See anti-abuse-system-design-2026-03-19.md §Vector 4 |
| 114 | Bid Cancellation Audit Trail | PLATFORM | ALL | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | Tracks bid cancellations; pattern flagged after 5+ cancellations + 3+ chargebacks. See anti-abuse-system-design-2026-03-19.md §Vector 2 |
| 117 | Chargeback Response + Serial Buyer Account Suspension | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Flags buyers at 2+ chargebacks; suspends after 3+ incidents. See anti-abuse-system-design-2026-03-19.md §Vector 6 |

#### Review Integrity & Spam Prevention

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 115 | Verified Purchase Badge on Reviews | PLATFORM | ALL | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | Only non-refunded past purchasers can leave reviews; prevents fake review spam. See anti-abuse-system-design-2026-03-19.md §Novel Vector B |
| 116 | Review Timing Anomaly Detection | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Flags reviews <1 hour post-purchase or from same IP within 24 hours; manual moderation queue. See anti-abuse-system-design-2026-03-19.md §Novel Vector B |

#### Advanced Fraud Monitoring & Data Governance

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 111 | Bot/Scraper Rate Limiting on CDN | PLATFORM | ALL | N/A | ✅ | N/A | ✅ | N/A | N/A | N/A | Rate limits image endpoints; prevents bot harvesting via Cloudinary bandwidth spike. See total-cost-of-ownership-2026-03-19.md §Section 4 |
| 112 | Database Record Archival Policy (Soft-Delete) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Quarterly soft-delete of old sales/items; reduces Neon compute bloat. See total-cost-of-ownership-2026-03-19.md §Section 3 |
| 113 | Async AI Tagging Queue (Prevent Rate-Limit Spikes) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Background worker processes tags; prevents Claude API rate limiting during peak uploads. See total-cost-of-ownership-2026-03-19.md §Risk #4 |
| 118 | Photo Compression at Upload (Reduce Storage Bloat) | PLATFORM | ALL | N/A | ✅ | ✅ | ✅ | N/A | N/A | N/A | Auto-compress photos on-device; reject images <100×100px or >50MB. See anti-abuse-system-design-2026-03-19.md §Novel Vector C |
| 120 | Sale Cancellation Audit (Rapid Cancellation Detection) | PLATFORM | ALL | ✅ | ✅ | N/A | ✅ | N/A | N/A | N/A | Flags sales cancelled <2h post-publication with >100 holds; requires organizer explanation. See anti-abuse-system-design-2026-03-19.md §Novel Vector A |

---

---

## Blocked

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 53 | Cross-Platform Aggregator | ORG | TEAMS | — | — | — | — | N/A | N/A | — | Legal review required — ToS risk with EstateSales.NET/Facebook scraping. ADR written |

---

## Backlog — Prioritized

### Pending Chrome QA

| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 138 | Sale Types (ESTATE/CHARITY/BUSINESS/CORPORATE) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | Enum validation + validation matrix — Chrome ✅ S286 (4 types added by dev fix, push pending) |
| 5 | Listing Type Schema Validation | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Backend validation for FIXED/AUCTION/REVERSE_AUCTION/LIVE_DROP/POS — Needs Chrome QA |
| 35 | Entrance Pin / Front Door Locator | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Shopper convenience, parking + entrance detail — Chrome ✅ S286 |
| 142 | Photo Upload (Single + Multi) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | `/api/upload` with Cloudinary — Chrome ✅ S286 |
| 143 | Rapidfire Camera Mode | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Multi-photo AI draft pipeline — Chrome ✅ S286 |
| 145 | Condition Grading (S/A/B/C/D) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | AI + manual override — Needs Chrome QA |
| 146 | Item Holds / Reservations | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | `/api/reservations` with expiry — Chrome ✅ S286 |
| 147 | Hold Duration Configuration | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Per-sale configurable — Needs Chrome QA |
| 24 | Holds-Only Item View (Batch Ops) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Grouped by buyer — Chrome ✅ S286 |
| 148 | Sale Checklist | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Per-sale custom checklist — Needs Chrome QA |
| 149 | Email Reminders to Shoppers | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | `/api/reminders` — Needs Chrome QA |
| 150 | Push Notification Subscriptions | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | `/api/push` VAPID — Chrome ✅ S286 |
| 152 | Organizer Digest Emails | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Weekly activity summaries — Needs Chrome QA |
| 153 | Basic Organizer Profile | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | businessName, phone, bio, website — Chrome ✅ S286 |
| 154 | Organizer Public Profile Page | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | `/organizers/[slug]` — Chrome ✅ S286 (slug 404 fixed by dev, push pending) |
| 155 | Password Reset Flow | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Email-based password recovery — Chrome PASS S285 |
| 156 | Refund Policy Configuration | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Per-organizer configurable refund window — Needs Chrome QA |
| 157 | Pickup Scheduling | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Organizer slots + shopper booking — Chrome ✅ S286 |
| 158 | Sale Waitlist | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Shopper join + organizer broadcast — Needs Chrome QA |
| 159 | Flash Deals | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Time-limited price drops — Needs Chrome QA |
| 160 | Reviews (Receive + View) | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Shopper → sale + organizer — Needs Chrome QA |
| 161 | Contact Form | PUB | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/api/contact` — Chrome ✅ S286 |
| 163 | Payout Transparency / Earnings Dashboard | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Item-level fee breakdown + PDF — Needs Chrome QA |
| 11 | Organizer Referral (Fee Bypass) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | referralDiscountExpiry — Needs Chrome QA |
| 164 | Tiers Backend Infrastructure | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | N/A | `/api/tiers` — getMyTier, syncTier — Needs Chrome QA |
| 65 | Organizer Mode Tiers (Simple/Pro/Teams) | ORG | PRO | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | 📋 | Full infrastructure: SubscriptionTier enum, tierGate.ts, requireTier, Stripe billing, Progressive Disclosure UI — Needs Chrome QA |
| 165 | A/B Testing Infrastructure | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | N/A | Internal optimization tool — Needs Chrome QA |
| 166 | Invites | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Invite-to-sale / invite-to-platform — Chrome PASS S285 (admin invite flow works; no dedicated DB model, route-based) |
| 72 | Dual-Role Account Schema | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | JWT roles[] array, auth middleware updated. Enables organizer + shopper in same account — Needs Chrome QA |
| 73 | Two-Channel Notification System | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | OPERATIONAL (organizer) + DISCOVERY (shopper) channels. Inbox tabs. Migration applied — Chrome ✅ S286 |
| 74 | Role-Aware Registration Consent | BOTH | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Opt-in checkboxes at signup. Attorney review of consent copy required before launch — Needs Chrome QA |
| 75 | Tier Lapse State Logic | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | 8am warning + 11pm lapse cron. Dashboard banner. Suspends ORG features, retains SHO features — Needs Chrome QA |
| 127 | POS Value Unlock Tiers | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | Dual-gate (tx+revenue). 3 tiers at 5/20/50 tx. /api/organizer/pos-tiers + PosTierGates.tsx — Chrome ✅ S286 |
| 131 | Share & Promote Templates | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | SharePromoteModal: 4 templates (social post, flyer, email invite, neighborhood post) — Needs Chrome QA |
| 76 | Skeleton Loaders | BOTH | FREE | N/A | N/A | ✅ | ✅ | ✅ | N/A | N/A | Ghost card layouts on item/sale grids. SkeletonCards component. Shipped S280. — Chrome ✅ S286 |
| 77 | Sale Published Celebration | ORG | SIMPLE | N/A | N/A | ✅ | ✅ | 📋 | N/A | 📋 | Full-screen confetti overlay on publish. Confetti.tsx + PublishCelebration.tsx. Shipped S280. — Needs Chrome QA |
| 79 | Earnings Counter Animation | ORG | SIMPLE | N/A | N/A | ✅ | ✅ | 📋 | N/A | N/A | AnimatedCounter.tsx — rolls up to value on dashboard load. Shipped S280. — Needs Chrome QA |
| 80 | Purchase Confirmation Redesign | SHO | FREE | N/A | N/A | ✅ | ✅ | ✅ | 📋 | 📋 | /shopper/checkout-success — item photo hero, seller, pickup, CTAs. Shipped S280. — Chrome ✅ S286 |
| 81 | Empty State Audit + Copy Pass | BOTH | FREE | N/A | N/A | ✅ | ✅ | ✅ | N/A | N/A | EmptyState component + human copy across 8 pages (index, feed, hauls, messages, item-library, holds ×2, wishlists). Shipped S280. — Chrome ✅ S286 |
| 132 | À La Carte Single-Sale Fee ($9.99) | ORG | PAID_ADDON | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Sale.purchaseModel + alaCarte + alaCarteFeePaid. Stripe checkout. AlaCartePublishModal for SIMPLE tier — Needs Chrome QA |
| 134 | Plan a Sale Dashboard Card | ORG | SIMPLE | N/A | N/A | ✅ | ✅ | ✅ | ✅ | 📋 | "Coming Soon" card on organizer dashboard overview tab — Chrome ✅ S286 |
| 60 | Premium Tier Bundle | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | 📋 | Tier landing page + comparison matrix + upgrade CTA. — Needs Chrome QA |
| 168 | Seller Performance Dashboard | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Per-sale analytics + insights — Chrome ✅ S286 |
| 8 | Batch Operations Toolkit | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Bulk price/status/category/tag/photo — Chrome ✅ S286 |
| 170 | CSV Listing Import | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Bulk upload item lists from CSV — Chrome ✅ S286 |
| 27 | CSV / JSON / Text Listing Exports | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Multi-format output (Listing Factory) — Needs Chrome QA |
| 66 | Open Data Export (ZIP) | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Items/sales/purchases CSV — Needs Chrome QA |
| 171 | Payout PDF Export | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Financial reporting for tax/accounting — Needs Chrome QA |
| 172 | Stripe Connect Setup | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | ⚠️ | N/A | 📋 | Payout bank account linking + verification — S285 FAIL: seed had fake stripeConnectId; real test IDs patched (Patrick SQL action pending). Re-test after Railway DB update. |
| 18 | Post Performance Analytics | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | UTM tracking on social template downloads — Needs Chrome QA |
| 13 | TEAMS Workspace | ORG | TEAMS | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | 📋 | Multi-user workspace, role management — Needs Chrome QA |
| 68 | Command Center Dashboard | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Per-sale widget dashboard — Chrome PASS S285 |
| 125 | Inventory Syndication CSV Export | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | exportService.ts + csvExportController.ts. PRO/TEAMS gate. eBay/Amazon/Facebook pre-formatted — Needs Chrome QA |
| 136 | QR Code Auto-Embedding in Exports | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | qrEmbedEnabled field, Cloudinary QR overlay via cloudinaryWatermark.ts, exportController wired, organizer toggle in edit-item. — Needs Chrome QA |
| 46 | Treasure Typology Classifier | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | 📋 | AI item classification; useTypology.ts, TypologyBadge.tsx — Needs Chrome QA |
| 27 | Social Templates (3 tones × 2 platforms) | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Instagram/Facebook copy — Needs Chrome QA |
| 27 | Cloudinary Watermark on Photo Exports | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Brand protection — Needs Chrome QA |
| 27 | CSV/JSON Listing Exports (Listing Factory) | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Multi-platform sharing — Needs Chrome QA |
| 33 | Share Card Factory (OG Tags) | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Branded social previews, dynamic OG images — Needs Chrome QA |
| 34 | Hype Meter | ORG | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Real-time social proof — Needs Chrome QA |
| 63 | Dark Mode + Accessibility | BOTH | FREE | N/A | ✅ | ✅ | ✅ | ⚠️ | N/A | 📋 | Tailwind dark variants, WCAG 2.1 AA, high-contrast outdoor mode — Needs Chrome QA |
| 67 | Social Proof Notifications | BOTH | SIMPLE | N/A | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | Engagement aggregation (favorites, bids, holds) — Chrome ✅ S286 |
| 6 | Virtual Queue / Line Management | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Start/call next/join line + SMS; free for all — Needs Chrome QA |
| 37 | Sale Reminders (Calendar + Remind Me) | SHO | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Sale alerts for shoppers — Needs Chrome QA |
| 28 | Neighborhood Heatmap | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | Density-based Leaflet overlay — Chrome ✅ S286 |
| 39 | Photo Op Stations | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | PhotoOpMarker on map, rate-limited — Needs Chrome QA |
| 40 | Sale Hubs | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Hub pages + membership UI — Needs Chrome QA |
| 16 | Verified Organizer Badge | ORG | PRO | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | VerifiedBadge on sales detail + SaleCard — Needs Chrome QA |
| 175 | Coupons (PERCENT/FIXED) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Post-purchase coupon issuance + validation. Rate-limited — Needs Chrome QA |
| 91 | Auto-Markdown (Smart Clearance) | ORG | PRO | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | 📋 | markdownEnabled/markdownFloor on Sale, markdownApplied/priceBeforeMarkdown on Item, markdownCron (every 5min), saleController config endpoints, edit-sale UI toggle + floor input. — Chrome ✅ S286 |
| 178 | Item Detail Page | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/items/[id]` — Chrome PASS S285 |
| 180 | Category Browsing | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | `/categories` index + `/categories/[slug]` — Chrome ✅ S286 |
| 181 | Tag Browsing | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | `/tags/[slug]` ISR pages — Chrome ✅ S286 |
| 183 | Sale Calendar (Upcoming) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/calendar` — Chrome ✅ S286 |
| 184 | iCal / Calendar Export | SHO | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Download .ics file for sales + items — Needs Chrome QA |
| 185 | QR Code Signs (Yard + Item Labels) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Printable QR codes linking to sales/items — Needs Chrome QA |
| 186 | QR Scan Analytics | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Tracking + insights on QR scans — Needs Chrome QA |
| 187 | City Pages | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ⚠️ | 📋 | 📋 | `/cities` + `/city/[slug]` city-level browsing — Needs Chrome QA |
| 92 | City Weekend Landing Pages (Metro Explorer) | SHO | FREE | N/A | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/city/[city].tsx` ISR pages with Schema.org JSON-LD. Grand Rapids pre-generated. Confirmed live in code (S280). — Chrome ✅ S286 |
| 78 | Inspiration Page — Item Gallery | SHO | FREE | N/A | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/inspiration` masonry grid of items from active/upcoming sales. Confirmed live in code (S280). — Chrome ✅ S286 |
| 191 | Route Planning (Multi-Sale) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | `/api/routes` OSRM-based — Needs Chrome QA |
| 192 | Price History Tracking | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | `/api/price-history` price trends — Needs Chrome QA |
| 52 | Estate Sale Encyclopedia | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | 📋 | Wiki-style knowledge base; EncyclopediaCard.tsx — Needs Chrome QA |
| 70 | Live Sale Feed | SHO | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Real-time sale activity feed. Redis adapter + JWT socket auth + LiveFeedTicker on sale detail page. — Needs Chrome QA |
| 193 | Wishlists | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Full CRUD, distinct from favorites — Chrome PASS S285 |
| 194 | Saved Searches with notifyOnNew | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Auto-notify on new matches — Needs Chrome QA |
| 195 | Shopper ↔ Organizer Messaging | BOTH | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Threaded conversations — Chrome PASS S285 (P0-A blank thread reclassified as poll lag; polling reduced 15s→5s, RESOLVED) |
| 196 | Buying Pools | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Group buying on items — Needs Chrome QA |
| 197 | Bounties (Item Requests) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Shopper want-ads — Needs Chrome QA |
| 198 | Reviews (Submit Sale / Organizer) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Via `/api/reviews` — Needs Chrome QA |
| 199 | User Profile Page | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/profile` — Chrome ✅ S286 |
| 200 | Shopper Public Profiles | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | `/shoppers/[slug]` collection showcase — Needs Chrome QA |
| 201 | Favorites | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ⚠️ | 📋 | 📋 | Save items for later — S285 PARTIAL: item-level favorites PASS; seller-follow tab (Follow model #86) deferred post-beta, UX review needed for tab labeling |
| 202 | Notification Center | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/notifications` page — Chrome ✅ S286 |
| 203 | Email + SMS Validation (Twilio) | BOTH | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Phone number verification via SMS — Needs Chrome QA |
| 204 | Unsubscribe / Preferences | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | `/unsubscribe` + `/api/unsubscribe` — Chrome ✅ S286 |
| 36 | Weekly Treasure Digest (Email) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | MailerLite Sunday 6pm — Needs Chrome QA |
| 205 | Contact Organizer | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Via messaging system — Needs Chrome QA |
| 206 | Condition Guide | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | `/condition-guide` educational page — Needs Chrome QA |
| 207 | FAQ / Guide / Terms / Privacy | PUB | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | Legal + help pages — Chrome ✅ S286 |
| 208 | Pickup Booking (Schedule Pickup) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Shopper-side scheduling — Needs Chrome QA |
| 84 | Approach Notes (Arrival Assistant) | SHO | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | PushNotificationLog model, arrivalController (get/update notes + send-approach-notification with 24h dedup), useArrivalAssistant hook, sale detail page section, edit-sale textarea + notify button. — Needs Chrome QA |
| 47 | UGC Photo Tags | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Shopper-submitted item photos + moderation — Needs Chrome QA |
| 7 | Shopper Referral Rewards | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Referral tracking + rewards distribution — Needs Chrome QA |
| 209 | Points System | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | 1 pt/visit/day, tier-based — Needs Chrome QA |
| 210 | Streaks (Visit / Save / Purchase) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Daily streak tracking — Needs Chrome QA |
| 211 | Treasure Hunt (Daily) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Daily clue + category matching — Needs Chrome QA |
| 212 | Leaderboard (Shoppers + Organizers) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Public rankings — Needs Chrome QA |
| 213 | **Hunt Pass ($4.99/30 days)** | SHO | **PAID_ADDON** | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | **2× streak multiplier, recurring Stripe billing** — Needs Chrome QA |
| 61 | Near-Miss Nudges | SHO | FREE | N/A | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Variable-ratio casino psychology; 4 types — Needs Chrome QA |
| 23 | Unsubscribe-to-Snooze (MailerLite) | SHO | SIMPLE | N/A | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Intercept unsubscribe → 30-day snooze via MailerLite custom fields — Needs Chrome QA |
| 59 | Streak Rewards | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Visit/save/purchase streaks wired to Layout — Needs Chrome QA |
| 58 | Achievement Badges | SHO | FREE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | `/shopper/achievements` page — Chrome ✅ S286 |
| 57 | Shiny / Rare Item Badges | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | RarityBadge wired to item cards — Needs Chrome QA |
| 48 | Treasure Trail Route Builder | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | ✅ | 📋 | Trail pages + share token, multi-sale routing — Needs Chrome QA |
| 55 | Seasonal Discovery Challenges | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | Rotating challenges by season/category — Needs Chrome QA |
| 122 | Explorer's Guild Phase 1 (Rebrand + Copy) | SHO | FREE | N/A | N/A | ✅ | ✅ | ✅ | 📋 | 📋 | Collector→Explorer labels, collect→explore language throughout. Rank names updated. No schema changes — Chrome ✅ S286 |
| 123 | Explorer's Guild Phase 2 (XP Economy + Loot Legend) | SHO | FREE/PAID_ADDON | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | User.guildXp + User.explorerRank + RarityBoost table. XP sinks (coupon-gen, rarity boost, Hunt Pass discount). Loot Legend portfolio. Full schema + endpoints — Chrome ✅ S286 |
| 85 | Treasure Hunt QR (In-Sale Scavenger Hunt) | SHO | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | TreasureHuntQRClue + TreasureHuntQRScan schema models, treasureHuntQRController (6 CRUD endpoints), TreasureHuntQRManager.tsx (organizer clue management + QR download), shopper clue detail page (/sales/[id]/treasure-hunt-qr/[clueId]). — Needs Chrome QA |
| 133 | Hunt Pass Subscription Redesign | SHO | PAID_ADDON | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | LEGENDARY 6h early access gate in itemController, 1.5x XP multiplier (applyHuntPassMultiplier in xpService), getLootLegend() + getCollectorLeague() endpoints + routes, loot-legend.tsx + league.tsx pages, loyalty.tsx updated. — Chrome ✅ S286 |
| 214 | AI Sale Planner Chat | PUB | FREE | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | 📋 | `/plan` page, public rate-limited acquisition tool — Needs Chrome QA |
| 215 | AI Tag Suggestions (Haiku) | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | Part of Rapidfire, all tiers — Needs Chrome QA |
| 216 | AI Condition Grade Suggestions | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | S/A/B/C/D from photo — Needs Chrome QA |
| 217 | AI SEO Description Optimization | ORG | SIMPLE | ✅ | ✅ | ✅ | ✅ | 📋 | N/A | 📋 | High-intent search term bias — Needs Chrome QA |
| 21 | User Impact Scoring in Sentry | BOTH | FREE | N/A | ✅ | ✅ | ✅ | 📋 | N/A | N/A | Error prioritization by tier/points/hunt-pass status — Needs Chrome QA |
| 128 | Automated Support Stack (5-Layer) | PLATFORM | ALL | N/A | ✅ | ✅ | ✅ | ✅ | ✅ | 📋 | /support page, fuse.js FAQ (L1), Claude API chat PRO/TEAMS (L2), community forum TEAMS (L3), smart escalation (L4). Zero human support for L1-L3 — Chrome ✅ S286 |



| # | Feature | Role | Tier | DB | API | UI | QA | Chrome | Nav | Human | Notes |
|---|---------|------|------|----|----|----|----|--------|-----|-------|-------|
| 124 | Rarity Boost XP Sink | SHO | FREE/PAID_ADDON | — | ✅ | — | — | N/A | N/A | — | Frontend UI for POST /api/xp/sink/rarity-boost. Backend endpoint confirmed live. Frontend shows 'Coming Soon' placeholder only — full UI not built. |
| 121 | Tiered Photo Storage Migration (Cloudinary → B2/Bunny) | PLATFORM | ALL | ✅ | ✅ | — | — | N/A | N/A | N/A | Implements 3-tier strategy: Active (0–90d on Cloudinary), Warm (90d–2y on B2 + Bunny CDN), Cold (2y+ metadata-only). Saves ~70% storage cost; enables B2B analytics. See photo-storage-strategy-2026-03-19.md |
| 104 | AI Cost Ceiling + Ollama Fallback | PLATFORM | ALL | N/A | ✅ | — | ✅ | N/A | N/A | N/A | Auto-switch to Ollama if Claude API cost exceeds monthly threshold. See total-cost-of-ownership-2026-03-19.md §Section 5 |
| 105 | Cloudinary Bandwidth Monitoring + Alerts | PLATFORM | ALL | N/A | ✅ | — | ✅ | N/A | N/A | N/A | cloudinaryBandwidthTracker.ts confirmed — tracks daily serves, alerts at 80% of 25GB free tier. (S280 verified) |
| 119 | Aggregate Chargeback Monitoring (Stripe Health) | PLATFORM | ALL | ✅ | ✅ | — | ✅ | N/A | N/A | N/A | Tracks monthly chargeback rate; triggers pre-auth + payment hold if >0.8%, account escalation if >1%. See anti-abuse-system-design-2026-03-19.md §Novel Vector D |

## Deferred & Long-Term Hold

### Infrastructure & Platform

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Zero-Downtime Migration Framework | INFRA | TEAMS | Blue-green migrations for large tables (items, purchases). Critical as data grows past 10k rows. Architect designs; Dev builds helpers. | When table sizes warrant it |
| Canary Deploy + Auto-Rollback | INFRA | SIMPLE | Deploy to Vercel preview + Railway staging first; auto-rollback if smoke tests fail. Enables daily deploys without risk. | After beta stabilizes — **trigger effectively met; pre-wire: Vercel preview env + Railway staging slot config can be set up now** |
| Audit Automation Library | INFRA | SIMPLE | Codify 8 pre-beta audit paths as reusable tests; run on every deploy. health-scout creates `audit_baseline.json`. | After beta launch — **trigger effectively met; pre-wire: health-scout baseline JSON and test harness can be scaffolded now** |

### Market Expansion & Positioning

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| #56 Printful Merch Store | BOTH | FREE | No demand signal pre-beta; external API adds complexity. | After beta proves shopper appetite for branded merch |
| #86 Friend Network (social graph) | SHO | FREE | DEFERRED S274 (Patrick+Architect). Social graph infra entangles with notifications, tier logic, and abuse guardrails. Public Shopper Profiles already shipped. | After beta feedback on #87/#88 social features; returns as S2 item |
| Affiliate Program | ORG | TEAMS | Backend 60% built. Referral badges (SIMPLE) + loyalty passport integration worth exploring first. Full payouts deferred. | After referral badges prove demand — **pre-wire: payout calculation engine + referral code table can be added to schema now; activation becomes a config flag** |
| White-label MaaS | ORG | TEAMS | Business decision — beta validation first | After beta data |
| Persistent Inventory (Cross-Sale Item Library) | ORG | PRO | Items that persist across multiple sales — organizer builds a master library, pulls items into each sale, unsold items carry over automatically. Designed for flea market vendors, antique booth operators, and recurring sale organizers. Requires new data model (items not bound to a single sale). `/organizer/inventory` is stubbed as "Coming Soon." | After beta data confirms demand from recurring-sale organizer segment — **pre-wire: add `persistentInventory` boolean + `masterItemLibraryId` FK to Item schema now; activation becomes a filter flag** |
| Consignment Integration | ORG | PRO | Thrift store POS — post-beta complexity | After beta data — **pre-wire: add `consignorId` + `consignmentSplitPct` fields to Item schema now; extends inventory library with zero migration at trigger** |
| QuickBooks Integration | ORG | SIMPLE | CSV export covers 80% of need | When organizers ask — **pre-wire: add QB-compatible column ordering + account codes to existing CSV export; zero-build activation when demand arrives** |
| Multi-metro expansion | ORG | SIMPLE | Beta validation first | After beta data |
| BUSINESS_PLAN.md rewrite | PUB | TEAMS | Reflect national positioning and current fee/feature state | After beta data confirms positioning |

### Hardware & Research

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Video-to-inventory | ORG | TEAMS | Vision models can't reliably segment rooms yet | Late 2026+ |
| AR Furniture Preview | SHO | TEAMS | Hardware not ready | Long-term R&D |

### Brand Spreading & Viral Growth [S2-S3 DEFER]

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Shopper Referral + Affiliate Mechanics | SHO/ORG | FREE | Shoppers earn 5% store credit on referrals; organizers earn 2-3% override. Leaderboard + badges. Needs financial model clarity first. | After pricing + financial model validated |
| Community Challenge / "Hunt Week" Viral Events | SHO | FREE | Weekly themed hunts with prizes, featured placement. Drives virality but needs organizer volume first. | After 50+ concurrent active sales |
| Organizer Brand Kit Expansion | ORG | PRO | Custom fonts, branded email signature, printable business cards, letterhead, social headers, yard sign PDFs with QR codes. | After Brand Kit v1 proves user adoption |
| Organizer Hall of Fame Leaderboard | ORG | SIMPLE | Top organizers by items sold/revenue/ratings. Monthly featured spotlight + badges. Community gamification. | After 100+ organizers + 6 months data |
| Community "Feature Your Sale" Request Form | SHO | FREE | Shoppers nominate sales for featured homepage placement. Moderation queue. Low complexity. | After homepage design stabilizes |
| Print-to-QR Sign Kit | ORG | SIMPLE | Downloadable PDF toolkit: yard signs, directional signs, table tents, hang tags, car magnets with QR codes. | When organizers request print collateral |
| AI Content Generation for Organizers (S3) | ORG | PRO | Claude Haiku auto-writes 10 social post variants per sale. Organizer picks + posts. Defer until templates prove demand. | After Social Templates adoption tracked |
| TikTok / Reels Auto-Generation (S3) | ORG | PRO | 15-second video from photos. Needs video generation, music licensing. Defer until social templates validate demand. | After Social Templates uptake proven |

### Advanced Organizer Features

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Instant Flash Auctions | ORG | PRO | Pre-beta, zero shoppers — no demand signal yet | After beta + 4–6 wks shopper data |
| Live Stream Sale Events | ORG | PRO | Heaviest build (3–4 sprints), requires on-camera organizers | After beta proves organizer appetite |
| Verified Organizer Insurance Badge | ORG | TEAMS | Requires micro-insurance partner — unvalidated market | After beta data + partner conversations |
| Hyper-Local Pop-Up Sale Network | SHO | FREE | Heatmap covers density; marketing layer on top | After Heatmap proves cluster value |

### Gamification Variants (Early Experiments)

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| QR/Barcode Item Labels | ORG | SIMPLE | Print scannable labels during intake → POS scan for instant lookup. High potential from retail experience. Pairs with POS v2. | Strong candidate when POS sees real usage |
| Featured Listings (Feature Boost) | ORG | PAID_ADDON | Paid homepage placement ($50–100/sale). Zero value pre-scale — needs 500+ daily shoppers. | After 500+ organizer accounts + 10+ active sales |
| Crowd-Sourced Corrections (Community Intel) | SHO | FREE | Shoppers report "still available?" status + correct entrance locations. Vote-based ranking. | After 500+ concurrent shoppers exist |
| Fast Pass for Sales (Priority Entry) | SHO | PAID_ADDON | $5–15 per pass, 30-min early access, capped at 20–50 passes. Revenue stream for organizers. | After beta proves high-demand sales |
| Sale Grand Finale Events | ORG | PRO | Last 2 hours: live-streamed event, flash auctions, 5x XP. Requires streaming infra. | After Live Stream Sale Events |
| VIP Behind-the-Scenes Tours | ORG | PAID_ADDON | $99–299 video shoot package with creator. Professional content for organizer marketing. | After creator network develops |
| Buddy System (Paired Shopping) | SHO | FREE | Pair with friend for sale visits. Shared cart, bonus XP, co-collector profile. | After gamification + social features |

### Creator & Community Economy

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Restoration & Upcycling Marketplace | BOTH | FREE | Before/after project gallery. "Studio Pro" tier for restorers. Creator economy play. | After UGC Photo Tags proves community appetite |
| Book Club & Vinyl Community Hubs | SHO | FREE | Moderated collector hubs with feeds, swaps, events, challenges. Niche community retention. | After Collector Passport proves specialty-interest demand |

### Long-Term Platform Vision (R&D Phase)

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| FindA.Sale Network (Tier 3 Services) | PUB | TEAMS | Multi-sided ecosystem: organizers + buyers + restorers + appraisers + shippers + designers. Platform as infrastructure OS. | Transformative — after platform proves all 3 tiers viable |
| AI Buying Agent Scout | SHO | PRO | Personal AI shopping agent. Learns taste, proactively watches sales, auto-notifies. Premium $9.99/mo. | After ML pipeline + personalization data |
| Estate Planning Toolkit | ORG | TEAMS | Heir/executor liquidation assistant: inventory builder, appraisal integration, tax reporting. Upstream demand creation. | After core organizer features stable — **trigger effectively met; pre-wire: add `executorUserId` + `estateId` to Organizer schema; intake fields cost zero to add now** |
| State of Estate Sales Report | ORG | PAID_ADDON | Monthly anonymized data report: pricing trends, category velocity, regional hotspots. B2B intelligence ($199/yr). | After 6+ months transaction data |

### B2B/B2E/B2C Innovation Streams (Future Revenue Moats)

Deferred until 200+ organizers across 5+ metro areas. Requires aggregated anonymized transaction data (pricing, categories, locations, inventory patterns) to be credible. See `claude_docs/strategy/b2b-b2e-b2c-innovation-broad-2026-03-19.md` (full analysis) and `claude_docs/strategy/b2b-b2e-innovation-2026-03-19.md` (estate-focused opportunities).

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Secondhand Market Intelligence Feed (B2B) | B2B | PAID_ADDON | Aggregated data: category pricing trends, regional inventory velocity, seasonal patterns. Target: antique dealers, resellers, retailers. $99–$499/mo. | After 200+ organizers + 12+ months data |
| Home Contents Valuation API (B2B for Appraisers/Insurers) | B2B | PAID_ADDON | Real-transaction valuation models trained on FindA.Sale data (not appraisal comps). License API to estate appraisers, insurance companies, tax professionals. $499–$999/mo. | After 200+ organizers + 6+ months credible data |
| Antiques Dealer Early Access Platform (B2B) | B2B | PAID_ADDON | Dedicated marketplace + curated feeds for professional dealers. First access to high-value estates. Target: antiquarians, gallery owners, auction houses. Premium subscription or commission on referrals. | After 200+ organizers + professional demand validation |
| Valuation Engine API Licensing (B2B) | B2B | PAID_ADDON | White-label API for eBay, Shopify, and marketplace integrations. Real-time pricing suggestions powered by our dataset. Revenue: API fees + per-query pricing. | After API-First Toolkit ships — Q1 2027+ |
| Flea Market Operator White-Label Platform (B2B) | B2B | TEAMS | White-label FindA.Sale for flea market operators (100+ vendors/weekend). Customizable vendor registration, booth lookup, item aggregation. Revenue: $1K–$5K/month per operator. | After core features stable + multi-organizer workflows proven |
| Municipal Economic Intelligence (B2E) | B2E | PAID_ADDON | Sell anonymized estate sale data to city planners, economic development authorities. Insights: household wealth distribution, downsizing trends, real estate health signals. Target: City Planner Associations. $500–$2K/month. | After 200+ organizers across 10+ cities |
| Moving Company Logistics Integration (B2B) | B2B | PAID_ADDON | White-label partnership + data feed. Help moving companies identify estate liquidation opportunities. Revenue: commission on referrals or subscription access. | After 500+ organizers |
| Nonprofit Fundraising Suite (B2C) | B2C | PAID_ADDON | Turnkey platform for nonprofits to run rummage/silent auctions. FindA.Sale handles fulfillment; nonprofit gets 100% of proceeds. Revenue: 10% of non-profit GMV. | After core nonprofit features prove demand |
| Consignment Shop Operations Suite (B2B) | B2B | TEAMS | Full SaaS for independent consignment shops (inventory, multi-vendor, POS, settlement). FindA.Sale becomes fulfillment + marketing layer. Revenue: $99–$199/month per shop. | After core organizer features stable + consignment demand validated |
| Organizer Certification Program (B2C/B2B) | B2C | PAID_ADDON | Accredited training + badge program for professional estate organizers. Courses: valuation, pricing psychology, buyer psychology, legal compliance. Revenue: $99/course, lifetime access, badge marketplace. | After 1,000+ shoppers + 200+ organizers |
| Shopper Behavior API (B2B) | B2B | PAID_ADDON | Anonymized behavioral data: search patterns, purchase intent, seasonal demand, demographic affinities. License to retailers, category managers, B2C marketplaces. $499–$999/mo. | After 10,000+ shoppers + 12+ months behavioral data |
| Circular Economy Data Feed (B2E) | B2E | PAID_ADDON | ESG/sustainability data: avg item lifecycle cost, resale % by category, waste reduction metrics. Target: ESG consultants, corporate sustainability teams, nonprofits. $199–$499/mo. | After 300+ organizers + data cleanup |
| Liquidation Insurance Product (B2B) | B2B | PAID_ADDON | Partner with specialty insurer: FindA.Sale users insure auction liquidations against underperformance. Revenue: 3–5% commission on policies written. | After 200+ organizers + claims data validated |
| Estate Sale Futures Market (Speculative R&D) | B2B | TEAMS | Speculative — bundle future estate sales; institutional buyers bid on portfolios. High-risk, high-reward. Regulatory review required. Legal TBD. | Long-term R&D — post-2027 |
| Full-Service Liquidation Platform (Speculative R&D) | ORG | TEAMS | Speculative — FindA.Sale hires liquidation coordinators; coordinates end-to-end estate liquidation for high-value estates. Revenue: 12–18% of GMV. Operational complexity TBD. | Long-term R&D — post-2027 |

### Gamification Research (Innovation Round 3)

| Feature | Role | Tier | Reason | Revisit Trigger |
|---------|------|------|--------|-----------------|
| Mystery Box Drops | SHO | FREE | Pre-beta, zero shoppers. Needs gamification scaffold + shopper base. MI gambling/sweepstakes law review needed. | After badge/XP system + Legal clears compliance |
| Daily Spin Wheel | SHO | FREE | Requires reward infrastructure + shopper base. Board may flag "too gamey" — position as daily check-in reward. | After badge/XP system + 500+ daily shoppers |
| Boost My Listing ($1-$5 microtx) | ORG | PAID_ADDON | Zero value until 50+ active sales + 500+ daily shoppers. FTC paid placement disclosure required. | After 500+ daily shoppers + Legal reviews disclosure |
| Instant Appraisal Token ($0.99) | SHO | PAID_ADDON | Needs sold-item data to be credible. Overlaps with AI Valuations. Requires 1,000+ sold items per category. | After AI Valuations + 6 months transaction data |
| Priority Checkout Pass ($2.99) | SHO | PAID_ADDON | Requires in-person QR validation + POS integration + organizer opt-in. Only viable at high-traffic sales. | After POS v2 sees real usage |
| Scan-to-Know (NFC Item Tags) | BOTH | SIMPLE | NFC tags add $0.05-$0.15/item cost. Start with QR labels first. Evolution of QR/Barcode Labels. | After QR labels prove demand |
| Smart Cart (Running Total) | SHO | SIMPLE | Only works for items with digital prices. Requires organizer adoption of digital pricing + QR/NFC. | After QR Labels + POS established |
| Agentic AI Assistant ("Scout") | SHO | PRO | Requires Wishlist Alerts + Collector Passport + sold-item data. XL complexity. Overlaps with AI Buying Agent Scout. | After Wishlist + Collector Passport + 6 months data — **pre-wire: add `tasteProfile` JSONB field to User schema now; preference data accrues passively from wishlist/save behavior before feature ships** |
| Voice Search + Navigation | SHO | SIMPLE | Web Speech API browser-native. Nice-to-have, not a retention driver. | After core search polished |
| RaaS for Organizers (Resale-as-a-Service) | ORG | TEAMS | Long-term platform vision: full business management suite. Japan/EU circular economy model. | After individual features prove themselves — 2027+ |
| Multi-Language Support (Spanish First) | PUB | SIMPLE | 42M native Spanish speakers in U.S. i18n framework. Important for national scale, not urgent for GR beta. | Before national expansion — Q1 2027 — **pre-wire: install next-intl now and extract all UI strings to locale files; every future UI addition becomes translation-ready automatically** |
| API-First Organizer Toolkit | ORG | TEAMS | OAuth2 auth, docs, rate limiting, versioning for public API. Behind Premium Tier. Enables Zapier. | After core features stabilize — Q4 2026-Q1 2027 — **pre-wire: add `ApiKey` table to schema + auth middleware stub now; no migration needed at launch** |
| Zapier/Make.com Integration Hub | ORG | TEAMS | Requires API-First Toolkit first. Official Zapier app with triggers + actions. 2.2M businesses use Zapier. | After API-First ships — Q1-Q2 2027 |
| TikTok-Style Item Reveal Feed | SHO | FREE | Vertical swipe feed of item reveals. Only works with high photo quality + item volume (100+/area). | After Rapidfire + Listing Factory drive quality up |
| Organizer AMAs (Reddit-Style Q&A) | BOTH | FREE | Scheduled pre-sale preview + Q&A sessions. Requires chat infrastructure + organizer willingness. | After 10+ active organizers |
| Workflow Automations (Built-in IFTTT) | ORG | PRO | Rule builder: Trigger → Condition → Action. Start with 5-10 hardcoded automations. | Hardcoded Q3 2026; custom rules 2027 |
| Auto-Reprice (Market-Responsive Pricing) | ORG | PRO | AI adjusts prices based on real-time demand signals. Extends Auto-Markdown. Requires transaction data. | After 6+ months transaction data |

*Deprecated (won't build): Co-Branded Yard Signs, Multi-Format Marketing Kit.*

---

## Rejected by Board

### Innovation Session — Brand Spreading [REJECT]

| Idea | Role | Tier | Reason |
|------|------|------|--------|
| Shopper Instagram Sticker Sharing | SHO | FREE | Instagram API too restrictive. Revisit Q3 if partnership emerges. |
| White-Label Resale Platform (B2B) | ORG | TEAMS | Too early. Revisit after 10+ paying organizers + $5K+ MRR proven. |
| Marketplace Watermark Variants | ORG | SIMPLE | Too micro-tactical. Merge into Nextdoor export template work. |

### Historical Rejections

| Idea | Role | Tier | Reason |
|------|------|------|--------|
| Pokéstop-Style Sale Markers | SHO | FREE | Gamification mismatch — estate sale shoppers skew older, Pokémon framing alienates core demo. |
| Trader Network | BOTH | TEAMS | P2P trading adds liability, moderation, and trust complexity. Not core to organizer value prop. |
| Egg Hatching Mechanic | SHO | FREE | Too game-y for audience. Confusing metaphor for non-gamers. |
| Team Rivalries | SHO | FREE | Competitive team mechanics don't match collaborative sale-shopping culture. |
| Raid-Style Group Events | SHO | FREE | Complex coordination + real-time features for uncertain demand. |
| Professional Certifications | ORG | TEAMS | Requires industry partnerships, legal review, ongoing administration. Low ROI for beta stage. |
| Mood Boards | SHO | FREE | Nice-to-have but no clear retention or revenue driver. |
| AR Item Overlay | SHO | TEAMS | Hardware/browser support still spotty. High build cost for novelty feature. |

---

## Design Decisions (Locked — Session 155)

- **Holds expiry:** 48 hours default, configurable per-sale in organizer settings. Nightly cron cleanup.
- **Health score:** Hybrid gate — block publishing below 40% (no photo or title), nudge 40–70%, free above 70%. Progress bar UX, never punitive.
- **Tag vocabulary:** Curated list of 30–50 core tags + 1 free-form custom slot per item. AI suggests from curated list. Quarterly review.
- **Social templates:** Auto-fill v1 with 3 tone options (Casual, Professional, Friendly). Defer WYSIWYG editor to post-beta.
- **Heatmap density:** Radius-based (1–3 mile), pre-computed grid tiles every 6h, 7-day rolling window.
- **Background removal:** On-demand Cloudinary `b_remove` transform only. Primary photo. No batch job.
- **Holds grouping:** By-item in schema, grouped-by-buyer in display. No junction table.
- **Reputation scoring:** Two separate scores — organizer reputation (sale quality, reliability) and shopper reputation (buyer reliability, pickup behavior). Schema must accommodate both; shopper score can be deferred but field must exist from day one. Single-score merge not permitted after schema is locked.
- **Tier lapse state:** Lapsing organizer subscription suspends organizer-only features. Shopper features retained. Full account freeze is not the default behavior. Re-activation on billing resume restores organizer features immediately.
- **Notification defaults:** Both notification channels default to opt-in. Shopper discovery alerts and organizer operational alerts are separate consent items at registration. No "all on" default for either channel.
Roadmap (bottom) — 7 locked UX/product decisions from S155 (holds expiry, health score, tag vocabulary, social templates, heatmap density, background removal, holds grouping)
claude_docs/architecture/ — 13 ADR files covering feature-specific technical specs (#13/#60 Teams Bundle, #17/#19 Bid Bot/Passkey, #30/#46/#69 AI/Offline, #40/#44/#48 Hubs/Trail, #52/#53/#54 Encyclopedia/Aggregator/Appraisal, #65 Tiers, #68 Command Center)
claude_docs/feature-decisions/ — 7 files covering architecture choices (camera workflow, cash fee collection, push coordinator, manager subagent)
decisions-log.md — governance/process decisions (subagent-first gate, file delivery rule, roadmap schema)
FindaSale\claude_docs\feature-notes.md - design decisions based on emotion and animations

---

## Maintenance

This document is the source of truth for product roadmap. Updated at every session wrap when a feature ships, beta status changes, or a deferred item is revisited. Full build history: `claude_docs/strategy/COMPLETED_PHASES.md`.

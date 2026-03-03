# ROADMAP – FindA.Sale Development Workflow

**Last Updated:** 2026-03-02
**Status:** Production-ready MVP. Reorganized for development flow (not timeline-based).
**Approach:** Phases grouped by technical dependencies, parallelizability, and shipping readiness. Not strict milestones — Patrick uses this for PM communication; this structure optimizes for coding velocity.

---

## Overview

This roadmap maps feature gaps and growth opportunities with phases organized for developer workflow:
1. **Quick wins & debt resolution** – unblock testing, build momentum
2. **Creator & discovery platform** – foundational growth lever
3. **Offline & event integration** – discrete feature sets with clear scope
4. **Real-time & complex systems** – major infrastructure investments (auctions, notifications)
5. **Growth mechanics & experimentation** – lower ROI, test with real users first

---

## Infrastructure & Dev Tools (Parallel to Feature Phases)

These are **developer experience, testing, and operational items** that should be integrated throughout development. Not blocking any phase, but essential for local dev, beta prep, and database seeding.

### ngrok for Local Development
- **Purpose:** Expose local development server to internet for testing webhooks (Stripe, Twilio, etc.) and mobile PWA testing
- **Setup:** Install ngrok, create tunnel to `localhost:3000` (frontend) and `localhost:5000` (backend)
- **Use cases:**
  - Test Stripe Connect redirects from mobile
  - Test SMS/email delivery without deploying to staging
  - Share dev environment with teammates for pair programming
- **Status:** Not yet documented; add to `DEVELOPMENT.md`
- **Effort:** 1 hour (documentation + setup guide)

### OAuth Social Login (Google, GitHub, etc.)
- **Priority:** P2 (nice-to-have for beta, not critical for MVP)
- **Scope:** Add OAuth2 login via Google (primary), optionally GitHub for developers
- **Backend:** Extend `authController.ts` with OAuth endpoints; integrate with Passport.js or similar
- **Database:** Add `OAuthProvider` + `oauthId` fields to User model
- **Frontend:** Add "Sign in with Google" button to login page
- **Benefits:** Reduces password reset burden; better UX
- **Status:** Deferred; add to Phase 16 (Post-MVP Polish)
- **Effort:** 2–3 sprints (includes Google API setup, database migration, frontend integration, E2E testing)

### Prisma Studio (Local Database Browser)
- **Purpose:** Visual database editor for local development (view/edit/insert records without SQL)
- **Setup:** `npx prisma studio` command (already in package.json)
- **Use cases:**
  - Inspect data without writing SQL queries
  - Manually create test users, sales, items during development
  - Debug schema relationships
- **Status:** Already available; needs documentation in `DEVELOPMENT.md`
- **Effort:** 30 minutes (add to dev setup guide)

### ~~Test Data Seeding Script~~ ✅ Complete (verified 2026-03-02)
- **Location:** `packages/database/prisma/seed.ts`
- **Run command:** `docker exec findasale-backend-1 sh -c "cd /app && npx tsx packages/database/prisma/seed.ts"`
- **Data:** 100 users, 10 organizers, 25 sales, 300 items, 50 purchases, 60 subscribers + badges, referrals, line entries, affiliate links
- **Note:** Seed does NOT run automatically on `docker compose up` — run manually when needed
- See `claude_docs/SEED_SUMMARY.md` for full details

### GitHub MCP Connector
- **Purpose:** Let Claude read diffs, PR history, commit logs, and open issues directly — without switching to a browser or needing Patrick to copy/paste context
- **Use cases:**
  - Review what changed between sessions without a git log paste
  - Reference open issues during feature planning
  - Check CI/CD status before deploy
  - Link commits to STATE.md updates automatically
- **Install:** Settings → Connectors → search "GitHub" → Connect
- **Status:** Not yet connected — P1 for next infrastructure sprint
- **Effort:** 5 minutes (OAuth connect, no code changes)

### Route Planning & Optimized Shopper Paths
- **Note:** Route planning is **part of Phase 14 (Growth Mechanics)**
- **Details:** Weekend cluster view + route optimizer for shoppers planning multi-sale routes
- **Map libraries:** Consider Mapbox GL JS (better routing) or OSRM (open-source, free)
- **Effort:** Included in Phase 14 (1–2 sprints for route planner + weekend cluster)

---

## Current Feature Inventory

### ✅ Completed (Production, verified 2026-03-02)
- JWT auth with role-based access (USER, ORGANIZER, ADMIN)
- Sale creation, geocoding, Leaflet/OSM maps
- Organizer profiles (public + private settings) with badges
- Photo upload (Cloudinary), bulk CSV import
- Stripe Connect Express onboarding, 5%/7% platform fees
- Email digest (Resend) — wired, needs E2E validation
- PWA hardening, accessibility (aria-labels, skip-to-content, toasts, SR announcements)
- Search + date filters on homepage
- Contact form, FAQ, password reset, referral code
- Creator dashboard (/creator/dashboard) — exists but no UI population yet
- Item categories + condition tagging with filters
- Zip-level landing pages with email reminders (hourly job)

### ⏸️ Deferred (Scoped, Not Shipped)
- **Email digest** – wired, needs E2E test validation (P0)
- **SMS notifications** – Twilio configured, not triggered
- **Virtual line / QR code** – scaffolded, not E2E tested
- **Auctions** – Socket.io bidding, timed lots, schema exists (routes scaffolded)
- **Multi-metro** – currently Grand Rapids only
- **Real-user beta** – onboarding flow not defined
- **Notification system** – intentionally deferred (documented TODO)

---

## Competitive Feature Parity (Quick Reference)

| Gap | Priority | Status | Phase |
|-----|----------|--------|-------|
| Schema.org event markup | P1 | Not started | Phase 8 |
| Email digest E2E test | P0 | Wired, untested | **Phase 8** |
| SMS notifications | P1 | Configured, untested | **Phase 8** |
| Creator dashboard population | P1 | Skeleton exists | Phase 9 |
| Item category filters | P1 | ✅ Done (Phase 7) | — |
| Organizer trust badges | P2 | ✅ Done (Phase 7) | — |
| QR sign generator | P1 | Not started | Phase 10 |
| Auctions / timed lots | P1 (deferred) | Scaffolded | Phase 12 |
| Calendar integration | P3 | Not started | Phase 11 |
| Virtual line / QR check-in | P1 (deferred) | Scaffolded | Phase 10 |

---

## Old Feature Parity Analysis (archive reference)

### A. Search & Discovery (estatesales.net, Yelp, Google Maps)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| Searchable map | ✅ Yes | ✓ All | None | — |
| Keyword search | ✅ Yes (homepage) | ✓ All | None | — |
| Date filters | ✅ Yes (homepage) | ✓ All | None | — |
| **Schema.org event markup** | ❌ No | ✓ High-value | Missing SEO signals | **P1** |
| City/neighborhood landing pages | ⚠️ Partial (/city/[city]) | ✓ All | Not optimized for local SEO | **P1** |
| **Reviews & ratings** | ❌ No | ✓ All (Yelp, Google, 1stdibs) | No social proof | **P2** |
| **Organizer trust badges** | ⚠️ Partial (profile exists) | ✓ All | No badges, verified checks | **P2** |
| Category/item type filters | ❌ No | ✓ Mercari, Chairish | Can't browse by "furniture" etc. | **P2** |

**Action items (P1):**
- [ ] Add schema.org JSON-LD event markup to sale detail page (`schema:Event`, `schema:AggregateOffer`, `location`, `startDate/endDate`)
- [ ] Ensure city landing pages are SEO-optimized (H1, meta description, OG tags)
- [ ] Consider robots.txt + sitemap.xml for indexing (sitemap exists but not validated)

---

### B. Listings & Item Discovery (Mercari, Chairish, 1stdibs, Craigslist)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| Photo galleries | ✅ Yes (Cloudinary) | ✓ All | Competitive | — |
| **Item category tags** | ❌ No | ✓ All | No way to filter "furniture" vs "vintage" | **P1** |
| **Item condition tagging** | ⚠️ Partial (exists in schema but no UI) | ✓ All | Buried in description | **P2** |
| **Quick-list flow** | ❌ No | ✓ Craigslist, OfferUp | Current flow requires CSV or multi-step | **P2** |
| **Messaging/contact to organizer** | ❌ No | ✓ All | No way for shopper to ask questions | **P2** |
| Follow organizer | ⚠️ Possible (not in UI) | ✓ Mercari, Poshmark, Chairish | No persistent "my organizers" list | **P2** |

**Action items (P1):**
- [ ] Add item category UI (furniture, vintage, decor, textiles, etc.)
- [ ] Expose `condition` field in item card & detail view (not just description)
- [ ] Consider category-specific landing pages (/category/furniture)

---

### C. Auctions & Timed Lots (LiveAuctioneers, HiBid, eBay)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| Timed auction lots | ⏸️ Scaffolded | ✓ All | Deferred; no E2E | **P1 (deferred)** |
| Live bidding UI | ❌ No | ✓ All | Real-time bidding missing | **P1 (deferred)** |
| **Optional "Auction" toggle per item** | ❌ No | ✓ All | Can't flag high-value items for auction | **P1 (deferred)** |
| Reservation/hold workflow | ⚠️ Partial (Stripe reservations exist) | ✓ All | Not exposed in UI | **P2** |

**Status:** Auction is a key revenue lever (7% vs 5% fee). Defer to Phase 7 post-beta. Requires Socket.io hardening + test suite.

---

### D. Event & Community Features (Nextdoor, Eventbrite, Meetup)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| Nextdoor share button | ✅ Yes | ✓ Nextdoor-native | Competitive | — |
| Email reminders | ✅ Yes (digest exists) | ✓ All | Not sale-specific; batch digest | **P2** |
| **Calendar integration** (Google/Apple) | ❌ No | ✓ Eventbrite, Meetup | No iCal, no "Add to calendar" | **P3** |
| **Neighborhood/hood landing pages** | ⚠️ Partial (/city/[city]) | ✓ Nextdoor, Craigslist | Not hyperlocal (zip-level) | **P2** |
| **RSVP/watch workflow** | ⚠️ Exists via subscription | ✓ Eventbrite, Meetup | Email only; no push, SMS, or calendar prompt | **P2** |

**Action items (P2):**
- [ ] Add "Add to Google/Apple Calendar" button on sale detail page (iCal feed)
- [ ] Create hood/zip-level landing pages (/sales/49503 for Grand Rapids zips)
- [ ] Trigger event-specific email reminder 1 day before, 2 hours before

---

### E. Creator & Social Features (TikTok, Instagram, YouTube, Poshmark)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| Creator dashboard | ✅ Exists (/creator/dashboard) | ✓ All | UI not populated; no creator tools | **P1** |
| **Short-form content hooks** | ❌ No | ✓ All | No way for creators to link to "best finds" | **P2** |
| **Affiliate-style referral links** | ⚠️ Partial (referral code exists) | ✓ All | Not creator-focused or trackable per creator | **P2** |
| **Creator early-access previews** | ❌ No | ✓ Poshmark Closet Ambassador, TikTok | No pre-launch access for influencers | **P3** |
| **Creator revenue sharing** | ❌ No | ✓ Shopify affiliates, Poshmark, TikTok | No payout for successful referrals | **P3** |

**Action items (P1):**
- [ ] Populate creator dashboard with:
  - List of organizers they follow
  - Recent uploads from those organizers
  - Referral link + copy-to-clipboard
  - Traffic stats (scans, clicks, referral conversions if available)
- [ ] Add "creator shortlink" to sale detail page (trackable)

---

### F. Payments & Logistics (Stripe, Shopify, Square)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| Stripe Connect Express | ✅ Yes | ✓ All | Competitive | — |
| Reservation/hold system | ⚠️ Exists (Stripe) | ✓ All | Not exposed; no shopper hold UI | **P2** |
| **Instant payouts** | ❌ No | ✓ Square, Stripe On-Demand Payouts | Organizers wait for settlement | **P3** |
| **Shipping option** | ❌ No | ✓ Mercari, Poshmark, 1stdibs | No way to enable organizer shipping | **P3** |
| **Multi-currency support** | ❌ No | ✓ Shopify, Stripe | USD only | **P4** |

---

### G. Marketing & Offline Conversion (Yard signs, QR codes, print media)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| **Printable QR sign generator** | ❌ No | ✓ Food trucks, popup retail, yard sales | No way to create offline marketing | **P1** |
| **QR + UTM analytics** | ❌ No | ✓ Scan-to-watch conversion tracking | Can't measure offline→digital | **P2** |
| **Printable email template** | ❌ No | ✓ Eventbrite, Facebook Events | Organizers print event details | **P2** |
| Line management / SMS updates | ⏸️ Scaffolded | ✓ Waitlist Me, event apps | Deferred; Twilio configured | **P1 (deferred)** |

**Action items (P1):**
- [ ] Build QR sign generator: sale ID → printable PDF with sale name, dates, address, QR to sale page
- [ ] Add UTM tracking: `?utm_source=qr_sign&utm_medium=print&utm_campaign=[saleId]`

---

### H. Gamification & Scarcity (Pokemon GO, Supreme, Sneaker drops)

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| **Timed photo drops** | ❌ No | ✓ Supreme, HypeBeast, TikTok | No scarcity mechanic on new listings | **P3** |
| **"Top collector" leaderboard** | ❌ No | ✓ Streetwear communities, eBay PowerSellers | No badges or repeat-buyer recognition | **P3** |
| **Early-access tier** | ❌ No | ✓ Sneaker raffles, Supreme drops | No VIP preview for top shoppers | **P3** |
| **Referral bounties / points** | ⚠️ Partial (referral code exists) | ✓ All | No gamified point system | **P3** |
| **Weekend cluster view** | ❌ No | ✓ Yard Sale Treasure Map, Gsalr | No "weekend sales near me" aggregation | **P2** |

**Action items (P2):**
- [ ] Add weekend sale cluster view: all sales this Sat/Sun in user's zip + nearby zips
- [ ] Show "Route planner" (for shoppers planning Saturday morning circuit)

---

### I. Growth Hacks & Marketplace Mechanics

| Feature | Current | Competitor | Gap | Priority |
|---------|---------|------------|-----|----------|
| CSV import (organizers) | ✅ Yes | ✓ Craigslist, aggregators | Competitive | — |
| **"Missing listing" UGC bounties** | ❌ No | ✓ OpenStreetMap, hyperlocal mappers | Could crowdsource coverage | **P3** |
| **Organizer verification badges** | ❌ No | ✓ Airbnb, eBay, Mercari | No way to signal trustworthiness | **P2** |
| **Email digest to shoppers** | ✅ Yes (exists) | ✓ All | Not yet E2E tested | **P0 (verify)** |
| **Weekly curator email** | ❌ No | ✓ Hipcamp, PopUp Republic | Could send curated "top picks" | **P3** |

---

## AI Tagger Model Upgrade Research (2026-03-02)

**Status:** Research complete. Recommendation: upgrade from WD-ViT to RAM++ post-accuracy audit.

### Background

Phase 8.5 deployed an estate sale tagger using `wd-vit-tagger` (an anime/illustration model). That model is operational but the accuracy audit on real estate sale photos is still pending. This research evaluates whether RAM++ is a better foundation.

### RAM++ vs Current WD-ViT Model

| Dimension | WD-ViT (current) | RAM++ (candidate) |
|---|---|---|
| **Training domain** | Anime/illustration | 14M real-world image-text pairs |
| **Tag vocabulary** | ~14K anime tags | 6,400+ semantic tags (furniture, materials, styles, etc.) |
| **Open-set recognition** | ❌ | ✅ (can tag things not in training vocab via LLM descriptions) |
| **Estate sale fit** | Poor (wrong domain) | Excellent |
| **License** | MIT | MIT |
| **ONNX export** | Not documented | Not documented (PyTorch `.pth`) |
| **CPU inference** | ~1-2s | ~1-2s |
| **Install** | pip | pip + git |
| **HuggingFace hosted** | ✅ | ✅ (free tier API available) |
| **Model size** | ~600MB | ~500MB |

### Recommendation

Replace WD-ViT with **RAM++** after the accuracy audit confirms WD-ViT is underperforming on real estate photos (expected). RAM++ was purpose-built for diverse real-world object recognition — furniture, materials, styles, conditions — which is exactly the estate sale vocabulary.

**Secondary model:** Add **CLIP** embeddings per item for semantic similarity search ("find more items like this"). RAM++ handles tagging; CLIP handles discovery. They complement each other cleanly.

### Deployment Path

- **Phase 1 (MVP):** Use Hugging Face Inference API for RAM++ — zero infra, free tier, ~$0.002-0.01/image beyond that
- **Phase 2 (scale):** Self-host RAM++ on a $40/month VPS running a background queue worker
- **Phase 3 (growth):** Add CLIP embeddings column to Item table for semantic search feature

### Integration Plan

1. Accuracy audit WD-ViT on 50+ real estate photos (already planned in TAGGER_ACCURACY.md)
2. If accuracy < 80%, swap `tagger.py` to call RAM++ HuggingFace endpoint (or local model)
3. Update `TAGGER_CATEGORY_MAP` — RAM++ tags map cleanly to existing Item.category values
4. Add `tags: String[]` column to Item (already on Sale) for freeform AI-suggested tags
5. CLIP integration is Phase 3 — wait for real user data to validate demand

### Key Sources
- GitHub: https://github.com/xinyu1205/recognize-anything
- HuggingFace API: https://huggingface.co/xinyu1205/recognize-anything-plus-model
- Live demo: https://huggingface.co/spaces/xinyu1205/recognize-anything
- Paper (CVPR 2024): arXiv 2306.03514

---

## CRITICAL DEBT: AI Image Tagger (Research & Testing Required)

**Status:** ⚠️ Partially Built, Untested, Blocking Organizer Workflow

The AI Image Tagger is a core organizer feature that was started but remains **completely untested**. It automatically recognizes and tags item photos for SEO and searchability. **Must be researched, tested, and hardened before scaling to multi-metro.**

### Current Implementation

**What Exists:**
- `packages/backend/services/image-tagger/app.py` — FastAPI service with Gradio UI
- `tagger.py` — EstateSaleTagger class using wd-vit model + estate sale specific categories
- Docker Compose integration: `image-tagger` service running on port 5000
- Backend integration: `itemController.ts` calls `/api/tag` on photo upload (5s timeout)
- FastAPI endpoints: `/api/tag` (single image), `/api/batch` (bulk processing)
- API key authentication + health check endpoint
- Estate sale category taxonomy: furniture, styles, materials, jewelry, decor, textiles, paintings, sculptures, etc.
- Requirements.txt specifies: torch, torchvision, transformers, fastapi, gradio, pillow, piexif

**What's Missing (Critical Gaps):**
- ❌ **Zero unit tests** — EstateSaleTagger class untested
- ❌ **Zero integration tests** — FastAPI endpoints untested
- ❌ **Zero E2E tests** — Full upload→tag→save flow untested
- ❌ **Performance unknown** — Does inference stay under 5s? GPU/CPU tradeoff?
- ❌ **Model reliability unknown** — Accuracy? False positive rate? Confidence calibration?
- ❌ **Fallback behavior undefined** — What if tagger service crashes? Photo still uploads?
- ❌ **Frontend integration untested** — Do suggested tags appear in organizer UI?
- ❌ **Error handling incomplete** — Service down, OOM, timeout scenarios not documented
- ❌ **No load testing** — How many concurrent requests can it handle?
- ❌ **Cost/resource analysis missing** — GPU requirements? Scaling strategy?

### Why It's Critical

1. **Core Organizer Workflow** — Photo tagging is primary action when creating items
2. **SEO & Discovery** — Tags enable category filtering; competitor advantage
3. **Data Quality** — Garbage tags = noise in search filters
4. **Production Risk** — Unknown failure modes could break photo uploads

### Pre-Production Research & Testing (Phase 8.5)

**Effort:** 1–2 sprints (can run parallel with Phase 9)
**Owner:** Backend
**Goal:** Validate tagger performance, accuracy, reliability; define fallbacks before beta

#### Required Work
- [ ] **Unit Tests** (`src/__tests__/imageTagger.test.ts`)
  - [ ] Model loads on startup
  - [ ] Generates tags for sample images
  - [ ] Confidence threshold filtering works
  - [ ] Batch processing handles errors gracefully
  - [ ] Estate-specific categories recognized (furniture, jewelry, styles)

- [ ] **Integration Tests** (FastAPI + backend)
  - [ ] `POST /api/tag` returns tags in <5s
  - [ ] API key auth validated
  - [ ] Service-down fallback: photo uploads succeeds even if tagger down
  - [ ] Timeout handling: 5s limit enforced
  - [ ] Error response format matches spec

- [ ] **Performance Benchmarks**
  - [ ] Single image inference time (CPU vs GPU)
  - [ ] Batch processing throughput
  - [ ] Memory usage (peak, average)
  - [ ] Model load time on startup
  - [ ] Concurrent request handling (5, 10, 20+)

- [ ] **Accuracy Audit**
  - [ ] Test with 50+ real estate photos
  - [ ] Measure tag precision/recall
  - [ ] Calibrate confidence threshold (0.35 → optimal value?)
  - [ ] Document false positive patterns
  - [ ] Validate furniture/style/material recognition

- [ ] **Error Handling & Fallbacks**
  - [ ] Log inference time + model confidence for monitoring
  - [ ] Graceful degradation when service unavailable
  - [ ] OOM recovery (fallback to CPU, skip batch, etc.)
  - [ ] Clear error messages for debugging

- [ ] **Frontend Integration**
  - [ ] Suggested tags display in organizer add-items page
  - [ ] Organizer can accept/reject/edit tags
  - [ ] Tags save and appear in item filters
  - [ ] Beta testing with real organizers

- [ ] **Documentation**
  - [ ] `TAGGER_DESIGN.md` — Model choice, architecture, categories, tuning
  - [ ] Scaling guide — GPU requirements, inference cost, multi-instance deployment
  - [ ] Troubleshooting — Common failures and resolutions

#### Success Criteria (Blockers for Beta)
- Unit test coverage ≥ 90% on `tagger.py`
- All integration tests pass
- Inference time < 2s (single) or < 5s (batch)
- Accuracy > 80% on test set of 50 photos
- Service unavailability doesn't break photo upload
- Organizers can see and edit suggested tags

#### Decision Gate
Before Phase 9+ launches: **Do we continue with this model, replace it, or make tagging optional?**
- If accurate & fast → Integrate into organizer workflow
- If slow/inaccurate → Explore CLIP-based alternative or deprecate auto-tagging
- If unreliable → Make tagging optional; users can tag manually

---

## Phase-by-Phase Implementation Plan

### Phase 8 – Email & SMS Validation (1 sprint)
**Owner:** Backend
**Effort:** 1 sprint
**Goal:** Resolve P0/P1 deferred items, unblock event notifications

#### Scope
- [ ] E2E test email digest: send test emails to production server, verify Resend delivery
- [ ] Wire SMS notifications: add Twilio trigger logic to sale lifecycle (creation, reminder, update)
- [ ] Create SMS alert page in organizer settings (opt-in per sale)
- [ ] Write E2E test suite (Jest) covering both email + SMS paths
- [ ] Update docs: SMS + email onboarding (API keys, rate limits, cost)

#### Rationale
- Email is already built but untested — validating it first unblocks Phase 11 (event reminders)
- SMS configuration exists but dormant — wiring triggers is low-effort, high-value
- Both are required for Phase 11 event features; better to know they work now
- Small sprint, clear scope, high confidence before moving to bigger efforts

#### Success Criteria
- Email digest sends daily, no delivery failures in staging + prod
- SMS reminders send 1 day before, 2 hours before, zero failures
- E2E test suite passes; both flows logged and monitored

---

### Phase 9 – Creator Growth Platform (2 sprints)
**Owner:** Frontend + Backend
**Effort:** 2 sprints
**Goal:** Activate micro-creators for viral loop, build creator dashboard

#### Scope
- [ ] Populate creator dashboard (/creator/dashboard):
  - [ ] List of organizers they follow
  - [ ] Recent uploads from those organizers (card grid, sortable by date)
  - [ ] Referral link + copy-to-clipboard
  - [ ] Traffic stats dashboard (referral clicks, scans, conversions if available)
- [ ] Add "creator shortlink" to sale detail page (trackable via UTM: `?utm_source=creator&utm_medium=shortlink&utm_campaign=[creatorId]`)
- [ ] Backend endpoint: GET /api/creators/[id]/stats (clicks, conversions, earnings projection)
- [ ] Creator onboarding page (claim creator account, connect socials — optional for MVP)

#### Rationale
- Creators are P1 growth lever; this activates them for Phase 8 post-launch pilot
- Dashboard UI is pure frontend work (existing data models)
- Shortlinks require minimal backend (just UTM tracking — already done for QR)
- Can pilot with 2–3 creators immediately post-Phase 8

#### Success Criteria
- Creator dashboard loads in <1s, shows organizer feed + referral stats
- Shortlinks trackable via UTM; conversion flow verified end-to-end
- 2–3 creators onboarded, generating trackable traffic

#### Post-Phase Milestone
Track creator-driven conversions during beta; decide whether to expand creator recruitment budget or deprioritize

---

### Phase 10 – Offline Marketing & Line Management (1.5 sprints)
**Owner:** Frontend + Backend
**Effort:** 1.5 sprints
**Goal:** Enable organizer self-service marketing, prepare for virtual line

#### Scope
- [ ] QR sign generator:
  - [ ] Sale detail page: "Download Marketing Kit" button
  - [ ] Backend endpoint: POST /api/sales/[id]/generate-marketing-kit → PDF (sale name, address, dates, QR code, UTM tracking info)
  - [ ] Frontend: trigger download + show success toast
  - [ ] Track downloads in analytics
- [ ] UTM tracking for QR: `?utm_source=qr_sign&utm_medium=print&utm_campaign=[saleId]`
- [ ] Analytics dashboard (organizer view): scan-to-watch conversion rate by sale
- [ ] Virtual line E2E completion:
  - [ ] Test existing QR check-in flow (scaffolded, untested)
  - [ ] Add SMS line status updates: "You're [#X] in line, ETA 15 mins"
  - [ ] Organizer dashboard: simple queue manager (current count, manual status updates)

#### Rationale
- QR sign generator is pure utility, no cross-dependencies
- Uses infrastructure from Phase 8 (email/SMS now proven)
- Virtual line is already scaffolded — completing it unblocks event features
- All 3 items unlock organizer self-service growth (no manual support needed)

#### Success Criteria
- Organizers can generate PDFs in <2s
- QR scans tracked; conversion rate visible in dashboard
- Virtual line tested end-to-end; SMS updates delivered with <2s latency

---

### Phase 11 – Event Integration & Calendar (2 sprints)
**Owner:** Frontend + Backend
**Effort:** 2 sprints
**Goal:** Integrate with calendar apps, trigger reminder system

#### Scope
- [ ] iCal/Google Calendar integration:
  - [ ] Sale detail page: "Add to Calendar" button (generates iCal feed per sale)
  - [ ] Backend endpoint: GET /api/sales/[id]/calendar.ics (standard iCal format)
  - [ ] Test with Google Calendar, Apple Calendar, Outlook
- [ ] Event-specific reminders (reuse email/SMS from Phase 8):
  - [ ] Trigger 1-day-before reminder (via existing emailReminderJob)
  - [ ] Trigger 2-hour-before reminder (via SMS if opted-in)
  - [ ] Include calendar link in reminder emails
- [ ] Push notifications (PWA):
  - [ ] If PWA installed, send push notification 1 day before + 2 hours before
  - [ ] Notification clicks deep-link to sale detail page
- [ ] Organizer reminder settings: opt-in/out per sale, configure channels (email, SMS, push)

#### Rationale
- Reuses infrastructure from Phase 8 (email/SMS proven)
- iCal is standard format; minimal backend effort
- Push notifications require PWA (already hardened Phase 4); just wiring triggers
- All three unlock RSVP + watch workflows (competitive parity vs Eventbrite/Meetup)

#### Success Criteria
- Calendar link works in Google/Apple/Outlook
- Reminders deliver on schedule with zero failures
- Push notifications appear on installed PWA
- Shopper retention uplift measurable post-Phase 8 launch

---

### Phase 12 – Auction Launch (3 sprints)
**Owner:** Backend + Frontend
**Effort:** 3 sprints
**Goal:** Unlock 7% fee tier, launch live bidding for high-value items

#### Scope
- [ ] Socket.io hardening:
  - [ ] Load test with 100+ concurrent bidders per auction
  - [ ] Implement connection pooling, graceful degradation
  - [ ] Add retry logic for bid failures
  - [ ] Create test suite (Jest) covering bidding flow, edge cases (double bid, race condition, timeout)
- [ ] Organizer flow:
  - [ ] Edit item page: "Toggle as auction" + set reserve price, duration
  - [ ] Dashboard: list of active/closed auctions with bid counts
- [ ] Shopper flow:
  - [ ] Sale detail page: auction items show countdown timer + current bid
  - [ ] Bid modal: enter bid amount, see live updates, bid history
  - [ ] Auction close: winner notification via email + SMS
- [ ] Payment capture:
  - [ ] Extend Stripe webhook to handle auction wins (7% fee tier)
  - [ ] Verify winner → payment intent → settlement flow
- [ ] E2E tests: full auction lifecycle (create, bid, close, winner pays, organizer receives)

#### Rationale
- Scaffolded infrastructure is ready; main work is hardening + UI
- 7% fee is significant revenue uplift; worth the 3-sprint investment
- Start this in parallel with Phase 11 (both Frontend + Backend can own separate tracks)
- Load testing is critical before production (large concurrent user spike risk)

#### Success Criteria
- Auction E2E test passes (create → bid → close → payment)
- Load test: 100+ concurrent bidders, zero failed bids
- Auction items launch in beta with <1% payment failure rate

#### Post-Phase Milestone
Monitor auction participation rate in beta; if <5% of items, deprioritize and focus on standard sales

---

### Phase 13 – Schema.org SEO & Local Ranking (1 sprint)
**Owner:** Frontend
**Effort:** 1 sprint
**Goal:** Improve organic search ranking vs estatesales.net

#### Scope
- [ ] Schema.org JSON-LD event markup:
  - [ ] Sale detail page: add schema:Event, schema:AggregateOffer, location, startDate/endDate
  - [ ] Frontend: render hidden JSON in `<head>`, validate with schema.org tool
- [ ] City landing pages SEO audit:
  - [ ] City pages: ensure H1 (sale city name), meta description, OG tags
  - [ ] Robots.txt + sitemap.xml: validate robots.txt excludes admin, includes /sales, /organizers
  - [ ] Sitemap generation: auto-include new sales + cities
- [ ] Breadcrumb navigation:
  - [ ] Homepage → City → Zip → Sale detail (for SEO + UX)
  - [ ] JSON-LD breadcrumb schema

#### Rationale
- Small, high-impact effort (1 sprint)
- No cross-dependencies; can run in parallel with later phases
- Schema markup is measured by SEO tools; directly impacts organic ranking
- City pages already exist (Phase 7); just optimizing them

#### Success Criteria
- Schema.org validator shows zero errors on sale detail page
- Robots.txt + sitemap validated by Google Search Console
- City landing pages rank top 3 for "[city] estate sale" within 6 weeks (measure via analytics)

---

### Phase 14 – Growth Mechanics & Experimentation (Ongoing, varies)
**Owner:** Backend + Product
**Effort:** Varies by feature
**Goal:** Test retention + acquisition multipliers with real users

#### Scope
- [ ] Weekend cluster view + route planner:
  - [ ] Homepage: "Sales this weekend near me" card (all sales Sat/Sun in user's zip + nearby zips)
  - [ ] Route planner: show optimal multi-stop order to visit 3+ sales (minimizes drive time)
    - [ ] Library choice: Mapbox GL JS Directions API (paid, accurate) vs OSRM (open-source, self-hosted)
    - [ ] UI: Interactive map showing route with numbered stops, estimated time, distance, turn-by-turn (optional)
    - [ ] Backend: Calculate optimal route order given list of sale coordinates
    - [ ] Mobile: Deep link to Apple Maps / Google Maps for real-time navigation
  - [ ] Shopper analytics: track route-planner clicks, map interactions, turn-by-turn usage
- [ ] Timed photo drops (nightly batch release):
  - [ ] Organizer setting: allow "Photo drop" (release new photos at specific time daily)
  - [ ] Shopper notification: "New finds!" alert when drops occur
  - [ ] A/B test: does scarcity mechanic increase repeat visitors?
- [ ] Referral bounties (credit-based):
  - [ ] Shopper completes purchase, earns $5 credit for next purchase
  - [ ] Shopper shares referral code, friend signs up → $5 credit for referrer
  - [ ] Verify: is credit redemption rate >30%?
- [ ] "Top collector" leaderboard:
  - [ ] Homepage: show top 10 shoppers by purchase count this month
  - [ ] Early-access tier: top shoppers get 1-hour preview of new sales
  - [ ] Verify: do leaderboard shoppers have higher repeat rate?
- [ ] UGC missing listing bounties (pilot in Grand Rapids):
  - [ ] Shopper can report "missing sale" (address not in system)
  - [ ] Bounty: $5 credit if reported sale becomes active
  - [ ] Measure: does this crowdsource coverage faster than manual?

#### Rationale
- All P2/P3 growth mechanics; should **test with real users first** (beta)
- Each is independent experiment; no cross-dependencies
- Start after Phase 12 (auction proves core platform stability)
- Can disable/pivot quickly based on metrics

#### Success Criteria (per experiment)
- Weekend cluster: 10%+ CTR on route planner
- Photo drops: +15% repeat visit rate
- Referral bounties: 30%+ credit redemption
- Top collector: 2x repeat purchase rate vs baseline
- Missing listings: 20%+ acceptance rate

#### Post-Phase Decision Gate
Validate pilot metrics before rolling out to multi-metro expansion

---

### Phase 15 – SaaS Add-ons & Premium Features (Q3 2026+, 3+ sprints)
**Owner:** Backend + Product
**Effort:** 3+ sprints
**Goal:** Increase organizer LTV, enable retention + upsell

#### Scope
- [ ] Label printing (integrated with item listing):
  - [ ] Organizer dashboard: bulk print labels for all items in a sale
  - [ ] Backend: generate PDF with item photo, price, barcode
  - [ ] Integration: Printful or similar (estimate cost/margin)
- [ ] Email campaign templates + bulk send:
  - [ ] Organizer can create campaign (e.g., "Last day to buy!"), send to all shoppers who watched
  - [ ] Template library: pre-built copy, A/B test variants
  - [ ] Analytics: open rate, click-through, purchase attribution
- [ ] Scheduled exports:
  - [ ] Organizer: "Export sales data every Friday" → CSV to email
  - [ ] Includes: revenue, fees, unsold items, shopper demographics
- [ ] Zapier integration:
  - [ ] Connect FindA.Sale to Mailchimp, QuickBooks, Google Sheets
  - [ ] Trigger: new sale created → add event to Google Calendar
- [ ] SMS line management (capacity, ETA, queue status):
  - [ ] Organizer sets line capacity
  - [ ] SMS: shopper texts "I'm here" → gets position + ETA
  - [ ] Organizer queue dashboard: see all pending check-ins

#### Rationale
- Premium features for **enterprise organizers** (high-volume sellers)
- High-touch implementation; wait for stable beta to understand demand
- Can test willingness-to-pay before building all 5 features
- Start after Phase 14 (need real usage data to prioritize)

#### Success Criteria
- 5%+ of organizers adopt at least 1 premium feature
- ARPU uplift of $50+ per premium organizer per month
- Churn rate <5% for premium tier

---

## Dependency Map

### Critical Path (must unblock others)
1. **Phase 8 (Email/SMS)** → unblocks Phase 11 (event reminders)
2. **Phase 9 (Creator dashboard)** → unblocks creator pilot during beta
3. **Phase 12 (Auctions)** → unblocks 7% fee revenue, Phase 14 (growth mechanics depend on stable bidding)

### Parallel Tracks
- **Phase 10 + Phase 11** can run in parallel (no shared code)
- **Phase 12 can start during Phase 11** (backend work can proceed independently)
- **Phase 13 can run anytime** (no dependencies)
- **Phase 14 should wait for Phase 12** (want stable core before running experiments)

### Deferred (low ROI or post-multi-metro)
- Multi-currency (Phase 20+)
- Shipping fulfillment (partner model first)
- B2B bulk sales (separate product)

---

## Success Metrics (Updated)

| Phase | KPI | Target | Validation |
|-------|-----|--------|------------|
| **Phase 8** | Email delivery rate, SMS opt-in rate | 100% delivery, 20%+ SMS opt-in | E2E test + staging validation |
| **Phase 9** | Creator-driven signups, traffic via shortlinks | 15% of new shopper signups from creator links | UTM analytics |
| **Phase 10** | QR scan-to-watch rate, virtual line latency | 5%+ scan conversion, <2s SMS latency | Analytics dashboard |
| **Phase 11** | Calendar add rate, reminder retention uplift | 10%+ of shoppers add to calendar, +5% DAU on reminder days | A/B test |
| **Phase 12** | Auction participation, 7% fee revenue | 20% of items flagged as auction, $5k+/month auction fees | Revenue dashboard |
| **Phase 13** | Organic search ranking, traffic | Top 3 for "[city] estate sale", 3x organic traffic | Google Search Console |
| **Phase 14** | Experiment-specific metrics | See Phase 14 scope | Real-user metrics in beta |
| **Phase 15** | Premium adoption, LTV uplift | 5%+ org adoption, $50+/mo ARPU uplift | Premium subscription dashboard |

---

## Deferred Decisions

**Not in roadmap (outside scope or low priority):**
- Multi-currency / international expansion (Phase 20+)
- Shipping fulfillment (partner model first)
- Advanced marketplace matching (ML-based discovery)
- B2B bulk sales (corporate liquidation — separate product)
- Social feed (TikTok competitor — too ambitious for 2026)

---

## How to Use This Roadmap

**For Patrick (PM):**
- Use phases as communication tool for stakeholders, investors
- Each phase has effort estimate (sprints), goal, and success metrics
- Phases may slip or reorder based on beta feedback; this is the current best guess
- Post-Phase 8 launch, use real user data to deprioritize low-signal features

**For Claude (Developer):**
- Follow phases in order; parallel tracks noted
- Each phase is time-boxed; use health-scout before shipping each
- Bring forward deferred items if they unblock work (e.g., virtual line in Phase 10)
- Reorganize internally if a different order improves velocity (ping Patrick if major reshuffle)
- Update STATE.md after each phase completion

---

## Last Updated
2026-03-02 – Reorganized for development workflow (phases by technical dependency, not timeline). Phase 7 (Local SEO) verified complete. Added AI Tagger Model Upgrade Research section (RAM++ vs WD-ViT, deployment path, CLIP integration plan).

**Next Review:** Post-Phase 8 launch (early April) — validate email/SMS infrastructure before committing Phase 9–12 resources.

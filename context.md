# Dynamic Project Context
*Generated at 2026-03-07T01:16:16.402Z*

## Git Status
- **Branch:** main
- **Commit:** 2adaf8b
- **Remote:** https://github.com/deseee/findasale.git

## Last Session
### 2026-03-06
**Worked on:** Full subagent fleet audit (15 agents reviewed). Opus fleet audit produced detailed agent-by-agent review. Identified 7 critical gaps: no agent handoff protocol, QA never run, UX never consulted, Legal never consulted, Support+CX have no content, dev-environment still references Docker, no e2e test automation. Expanded .gitattributes from `*.md` only to all text file types (kills 397-file CRLF phantom diff permanently). Scrubbed plaintext Neon credentials from STATE.md entry #28 and self_healing_skills.md (SECURITY violation). Confirmed ROADMAP.md v14 is correct (v12 on GitHub was stale). Diagnosed that push.ps1 reported "Everything up-to-date" because audit work was never committed.
**Decisions:** .gitattributes must cover all text file types, not just *.md. Credentials must never appear in docs — reference .env location instead. Fleet audit recommendations are the new priority queue before beta launch. Neon credentials should be rotated as precaution.
**Next up:** Execute 8 audit work paths (QA, UX, Legal, Support KB, CX onboarding, Records cleanup, Marketing calendar, Ops verification). Create Agent Quick Reference cheat sheet. Patrick: rotate Neon credentials, push pending commits.
**Blockers:** Pending commits must be pushed before any further work. Patrick should rotate Neon credentials.

## Health Status
Last scan: 2026-03-06
Overall codebase health is **GOOD** — no secrets exposed, CORS properly locked down, all write routes are authenticated, JWT has no bypass, and admin endpoints are protected with `requireAdmin`. The app is beta-ready from a security standpoint. Top 3 concerns to resolve before launch: (1) `alert()` dialogs in 4 places breaking UX polish, (2) 8 `<img>` tags missing `alt` text (accessibility/SEO), (3) one unhandled promise in `uploadController` that could silently swallow upload errors. The `buyingPoolController` nested `include: { user: true }` pattern is worth cleaning up but doesn't currently expose user data in API responses.

## Docker
```
Docker status unavailable — run update-context.js locally (Windows) to capture container state
```

## Environment
- GitHub CLI: ✗ not authenticated (not required when GitHub MCP is active — check MCP tools at session start)
- ngrok tunnel: unknown (check Docker Desktop logs for findasale-ngrok-1)
- CLI tools: node

## Signals
✓ Env: no drift detected
✓ TODOs: none found

## Project File Tree
```
├── .env
├── .env.example
├── .gitattributes
├── .githooks/
│   ├── pre-commit
│   └── pre-push
├── .gitignore
├── 2
├── AGENT_QUICK_REFERENCE.md
├── CLAUDE.md
├── README.md
├── STRIPE_WEBHOOK_HARDENING.md
├── ai-config/
│   └── global-instructions.md
├── claude_docs/
│   ├── .last-wrap
│   ├── BETA_CHECKLIST.md
│   ├── COMPLETED_PHASES.md
│   ├── CORE.md
│   ├── DEVELOPMENT.md
│   ├── OPS.md
│   ├── RECOVERY.md
│   ├── SECURITY.md
│   ├── SEED_SUMMARY.md
│   ├── SESSION_WRAP_PROTOCOL.md
│   ├── STACK.md
│   ├── STATE.md
│   ├── WRAP_PROTOCOL_QUICK_REFERENCE.md
│   ├── archive/
│   │   ├── 2026-03-01.md
│   │   ├── 2026-03-02.md
│   │   ├── 2026-03-03.md
│   │   ├── 2026-03-05-health-check.json
│   │   ├── 2026-03-05.md
│   │   ├── SESSION_WRAP_PROTOCOL_INDEX.md
│   │   ├── VERIFICATION_SCRIPT_SPEC.md
│   │   ├── WRAP_PROTOCOL_EXECUTIVE_SUMMARY.md
│   │   ├── WRAP_PROTOCOL_INTEGRATION.md
│   │   ├── beta-readiness-audit-2026-03-05.md
│   │   ├── ca4-ca6-audit-2026-03-05.md
│   │   ├── dev-environment-skill-update.md
│   │   ├── migration-runbook.md
│   │   ├── new 1.txt
│   │   ├── new 2.txt
│   │   ├── payment-stress-test.md
│   │   ├── pre-beta-audit-2026-03-03.md
│   │   ├── pre-commit-check.md
│   │   ├── rebrand-audit.md
│   │   ├── subagent-fleet-audit-2026-03-06.md
│   │   └── workflow-audit-2026-03-03.md
│   ├── beta-launch/
│   │   ├── beta-status.md
│   │   ├── content-calendar.md
│   │   ├── e2e-test-checklist.md
│   │   ├── launch-announcement.md
│   │   ├── onboarding-emails.md
│   │   ├── organizer-outreach.md
│   │   ├── success-criteria.md
│   │   └── success-tracking.md
│   ├── beta-readiness-audit-2026-03-05.md
│   ├── brand/
│   │   ├── README.md
│   │   ├── business-card-back.png
│   │   ├── business-card-front.png
│   │   ├── logo-dark-bg.svg
│   │   ├── logo-icon-512.png
│   │   ├── logo-icon.svg
│   │   ├── logo-oauth-120.png
│   │   ├── logo-primary.png
│   │   └── logo-primary.svg
│   ├── changelog-tracker/
│   │   └── .gitkeep
│   ├── competitor-intel/
│   │   └── .gitkeep
│   ├── feature-notes/
│   │   ├── BETA_INVITE_SYSTEM.md
│   │   ├── EMAIL_TEMPLATE_SYSTEM.md
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   ├── MOBILE_GESTURES_TESTING.md
│   │   ├── PRICE_ALERTS_IMPLEMENTATION.md
│   │   ├── SEO_IMPROVEMENTS_SUMMARY.md
│   │   ├── SHOPPER_PROFILE_IMPLEMENTATION.md
│   │   └── STRIPE_WEBHOOK_HARDENING.md
│   ├── guides/
│   │   ├── feedback-to-feature.md
│   │   ├── incident-response.md
│   │   ├── organizer-guide.md
│   │   ├── shopper-faq.md
│   │   ├── support-kb.md
│   │   └── zapier-webhooks.md
│   ├── health-reports/
│   │   ├── .gitkeep
│   │   ├── 2026-03-05-full-scan.md
│   │   ├── 2026-03-05.md
│   │   └── 2026-03-06.md
│   ├── migration-runbook.md
│   ├── model-routing.md
│   ├── monthly-digests/
│   │   └── .gitkeep
│   ├── new 1.txt
│   ├── new 2.txt
│   ├── next-session-prompt.md
│   ├── patrick-language-map.md
│   ├── payment-stress-test.md
│   ├── pre-commit-check.md
│   ├── research/
│   │   ├── branding-brief-2026-03-05.md
│   │   ├── competitor-intel-2026-03-04.md
│   │   ├── feature-brainstorm-2026-03-05.md
│   │   ├── growth-channels-2026-03-04.md
│   │   ├── investor-materials-2026-03-05.md
│   │   ├── marketing-content-2026-03-05.md
│   │   ├── parallel-roadmap-v2-2026-03-05.md
│   │   ├── pricing-analysis-2026-03-05.md
│   │   └── strategic-review-2026-03-05.md
│   ├── roadmap.md
│   ├── scheduled-task-log.md
│   ├── self_healing_skills.md
│   ├── session-log.md
│   ├── session-safeguards.md
│   ├── skills-package/
│   ├── test_write
│   ├── ux-spotchecks/
│   │   ├── .gitkeep
│   │   └── ca4-ca6-audit-2026-03-05.md
│   └── workflow-retrospectives/
│       ├── .gitkeep
│       └── opus-fleet-audit-2026-03-06.md
├── docker-compose.yml
├── docs/
│   └── CD2_PHASE2_TREASURE_HUNT.md
├── next
├── package.json
├── packages/
│   ├── backend/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── CLAUDE.md
│   │   ├── Dockerfile
│   │   ├── Dockerfile.production
│   │   ├── docs/
│   │   │   └── EMAIL_SMS_REMINDERS.md
│   │   ├── nodemon.json
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   ├── emailReminders.e2e.ts
│   │   │   │   ├── stripe.e2e.ts
│   │   │   │   └── weeklyDigest.e2e.ts
│   │   │   ├── _triggerDigest.ts
│   │   │   ├── controllers/
│   │   │   │   ├── abTestController.ts
│   │   │   │   ├── adminController.ts
│   │   │   │   ├── affiliateController.ts
│   │   │   │   ├── authController.ts
│   │   │   │   ├── batchAnalyzeController.ts
│   │   │   │   ├── betaInviteController.ts
│   │   │   │   ├── bountyController.ts
│   │   │   │   ├── buyingPoolController.ts
│   │   │   │   ├── checklistController.ts
│   │   │   │   ├── disputeController.ts
│   │   │   │   ├── earningsPdfController.ts
│   │   │   │   ├── favoriteController.ts
│   │   │   │   ├── feedbackController.ts
│   │   │   │   ├── flashDealController.ts
│   │   │   │   ├── geocodeController.ts
│   │   │   │   ├── insightsController.ts
│   │   │   │   ├── itemController.ts
│   │   │   │   ├── labelController.ts
│   │   │   │   ├── leaderboardController.ts
│   │   │   │   ├── lineController.ts
│   │   │   │   ├── marketingKitController.ts
│   │   │   │   ├── messageController.ts
│   │   │   │   ├── notificationController.ts
│   │   │   │   ├── notificationInboxController.ts
│   │   │   │   ├── payoutController.ts
│   │   │   │   ├── pickupController.ts
│   │   │   │   ├── plannerController.ts
│   │   │   │   ├── priceHistoryController.ts
│   │   │   │   ├── pushController.ts
│   │   │   │   ├── referralController.ts
│   │   │   │   ├── reservationController.ts
│   │   │   │   ├── reviewController.ts
│   │   │   │   ├── rsvpController.ts
│   │   │   │   ├── saleController.ts
│   │   │   │   ├── saleWaitlistController.ts
│   │   │   │   ├── savedSearchController.ts
│   │   │   │   ├── shopperReferralController.ts
│   │   │   │   ├── socialPostController.ts
│   │   │   │   ├── stripeController.ts
│   │   │   │   ├── stripeStatusController.ts
│   │   │   │   ├── templateController.ts
│   │   │   │   ├── tierController.ts
│   │   │   │   ├── trendingController.ts
│   │   │   │   ├── unsubscribeController.ts
│   │   │   │   ├── uploadController.ts
│   │   │   │   ├── userController.ts
│   │   │   │   ├── waitlistController.ts
│   │   │   │   ├── webhookController.ts
│   │   │   │   └── wishlistController.ts
│   │   │   ├── index.ts
│   │   │   ├── instrument.ts
│   │   │   ├── jobs/
│   │   │   │   ├── abandonedCheckoutJob.ts
│   │   │   │   ├── auctionJob.ts
│   │   │   │   ├── curatorEmailJob.ts
│   │   │   │   ├── emailReminderJob.ts
│   │   │   │   ├── notificationJob.ts
│   │   │   │   ├── organizerWeeklyDigestJob.ts
│   │   │   │   ├── reputationJob.ts
│   │   │   │   ├── reservationExpiryJob.ts
│   │   │   │   ├── reverseAuctionJob.ts
│   │   │   │   ├── saleEndingSoonJob.ts
│   │   │   │   └── weeklyEmailJob.ts
│   │   │   ├── lib/
│   │   │   │   ├── prisma.ts
│   │   │   │   ├── sanitize.ts
│   │   │   │   └── socket.ts
│   │   │   ├── middleware/
│   │   │   │   ├── adminAuth.ts
│   │   │   │   └── auth.ts
│   │   │   ├── models/
│   │   │   │   └── LineEntry.ts
│   │   │   ├── routes/
│   │   │   │   ├── abTest.ts
│   │   │   │   ├── admin.ts
│   │   │   │   ├── affiliate.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── bounties.ts
│   │   │   │   ├── buyingPools.ts
│   │   │   │   ├── checklist.ts
│   │   │   │   ├── contact.ts
│   │   │   │   ├── disputes.ts
│   │   │   │   ├── earningsPdf.ts
│   │   │   │   ├── favorites.ts
│   │   │   │   ├── feed.ts
│   │   │   │   ├── feedback.ts
│   │   │   │   ├── flashDeals.ts
│   │   │   │   ├── geocode.ts
│   │   │   │   ├── insights.ts
│   │   │   │   ├── invites.ts
│   │   │   │   ├── items.ts
│   │   │   │   ├── leaderboard.ts
│   │   │   │   ├── lines.ts
│   │   │   │   ├── messageTemplates.ts
│   │   │   │   ├── messages.ts
│   │   │   │   ├── notificationInbox.ts
│   │   │   │   ├── notifications.ts
│   │   │   │   ├── organizerDigest.ts
│   │   │   │   ├── organizers.ts
│   │   │   │   ├── pickup.ts
│   │   │   │   ├── planner.ts
│   │   │   │   ├── points.ts
│   │   │   │   ├── priceHistory.ts
│   │   │   │   ├── push.ts
│   │   │   │   ├── referrals.ts
│   │   │   │   ├── reservations.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   ├── saleWaitlist.ts
│   │   │   │   ├── sales.ts
│   │   │   │   ├── savedSearches.ts
│   │   │   │   ├── search.ts
│   │   │   │   ├── shopperReferral.ts
│   │   │   │   ├── socialPost.ts
│   │   │   │   ├── streaks.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   ├── templates.ts
│   │   │   │   ├── tiers.ts
│   │   │   │   ├── treasureHunt.ts
│   │   │   │   ├── trending.ts
│   │   │   │   ├── unsubscribe.ts
│   │   │   │   ├── upload.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── waitlist.ts
│   │   │   │   ├── webhooks.ts
│   │   │   │   └── wishlists.ts
│   │   │   ├── services/
│   │   │   │   ├── buyerMatchService.ts
│   │   │   │   ├── cloudAIService.ts
│   │   │   │   ├── discoveryService.ts
│   │   │   │   ├── emailReminderService.ts
│   │   │   │   ├── emailTemplateService.ts
│   │   │   │   ├── followerNotificationService.ts
│   │   │   │   ├── messageEmailService.ts
│   │   │   │   ├── notificationService.ts
│   │   │   │   ├── organizerAnalyticsService.ts
│   │   │   │   ├── pointsService.ts
│   │   │   │   ├── priceDropService.ts
│   │   │   │   ├── streakService.ts
│   │   │   │   ├── tierService.ts
│   │   │   │   ├── treasureHuntService.ts
│   │   │   │   ├── webhookService.ts
│   │   │   │   ├── weeklyEmailService.ts
│   │   │   │   └── wishlistMatchEmailService.ts
│   │   │   └── utils/
│   │   │       ├── stripe.ts
│   │   │       └── webpush.ts
│   │   └── tsconfig.json
│   ├── database/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── migrations/ (63 migrations)
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── .env.local
│   │   ├── .env.local.example
│   │   ├── CLAUDE.md
│   │   ├── Dockerfile
│   │   ├── components/
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── ActivitySummary.tsx
│   │   │   ├── AddToCalendarButton.tsx
│   │   │   ├── AddressAutocomplete.tsx
│   │   │   ├── AuctionCountdown.tsx
│   │   │   ├── AuthContext.tsx
│   │   │   ├── BadgeDisplay.tsx
│   │   │   ├── BidModal.tsx
│   │   │   ├── BottomTabNav.tsx
│   │   │   ├── BountyModal.tsx
│   │   │   ├── BulkItemToolbar.tsx
│   │   │   ├── BulkPriceModal.tsx
│   │   │   ├── BuyingPoolCard.tsx
│   │   │   ├── CSVImportModal.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartIcon.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── ConditionBadge.tsx
│   │   │   ├── Confetti.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── DisputeForm.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── FeedbackWidget.tsx
│   │   │   ├── FlashDealBanner.tsx
│   │   │   ├── FlashDealForm.tsx
│   │   │   ├── FlashDealsBanner.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   ├── FollowOrganizerButton.tsx
│   │   │   ├── HoldTimer.tsx
│   │   │   ├── HuntPassModal.tsx
│   │   │   ├── InstallPrompt.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemListWithBulkSelection.tsx
│   │   │   ├── ItemPhotoManager.tsx
│   │   │   ├── ItemPriceHistoryChart.tsx
│   │   │   ├── ItemShareButton.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LocationMap.tsx
│   │   │   ├── MyPickupAppointments.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationPreferences.tsx
│   │   │   ├── OnboardingModal.tsx
│   │   │   ├── OnboardingWizard.tsx
│   │   │   ├── OrganizerOnboardingModal.tsx
│   │   │   ├── OrganizerSaleCard.tsx
│   │   │   ├── OrganizerTierBadge.tsx
│   │   │   ├── PhotoLightbox.tsx
│   │   │   ├── PickupBookingCard.tsx
│   │   │   ├── PickupSlotManager.tsx
│   │   │   ├── PointsBadge.tsx
│   │   │   ├── PriceSuggestion.tsx
│   │   │   ├── QuickReplyPicker.tsx
│   │   │   ├── RSVPAttendeesModal.tsx
│   │   │   ├── RSVPBadge.tsx
│   │   │   ├── RapidCapture.tsx
│   │   │   ├── RecentlyViewed.tsx
│   │   │   ├── ReputationTier.tsx
│   │   │   ├── ReverseAuctionBadge.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── SaleCard.tsx
│   │   │   ├── SaleChecklist.tsx
│   │   │   ├── SaleMap.tsx
│   │   │   ├── SaleMapInner.tsx
│   │   │   ├── SalePerformanceBadge.tsx
│   │   │   ├── SaleQRCode.tsx
│   │   │   ├── SaleRSVPButton.tsx
│   │   │   ├── SaleShareButton.tsx
│   │   │   ├── SaleSubscription.tsx
│   │   │   ├── SaleTourGallery.tsx
│   │   │   ├── SaleWaitlistButton.tsx
│   │   │   ├── SalesNearYou.tsx
│   │   │   ├── SearchFilterPanel.tsx
│   │   │   ├── SearchSuggestions.tsx
│   │   │   ├── ShopperReferralCard.tsx
│   │   │   ├── SimilarItems.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── SkeletonCards.tsx
│   │   │   ├── SmartInventoryUpload.tsx
│   │   │   ├── SocialPostGenerator.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── StreakWidget.tsx
│   │   │   ├── TierBadge.tsx
│   │   │   ├── ToastContext.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── TreasureHuntBanner.tsx
│   │   │   ├── VisualSearchButton.tsx
│   │   │   ├── WishlistShareButton.tsx
│   │   │   └── YourWishlists.tsx
│   │   ├── context/
│   │   │   └── CartContext.tsx
│   │   ├── contexts/
│   │   │   └── ToastContext.tsx
│   │   ├── hooks/
│   │   │   ├── useABTest.ts
│   │   │   ├── useHaptics.ts
│   │   │   ├── useHeartAnimation.ts
│   │   │   ├── usePoints.ts
│   │   │   ├── usePullToRefresh.ts
│   │   │   ├── usePushSubscription.ts
│   │   │   └── useUnreadMessages.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── imageUtils.ts
│   │   ├── next-env.d.ts
│   │   ├── next-sitemap.config.js
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── pages/
│   │   │   ├── 404.tsx
│   │   │   ├── 500.tsx
│   │   │   ├── _app.tsx
│   │   │   ├── _document.tsx
│   │   │   ├── about.tsx
│   │   │   ├── admin/
│   │   │   │   ├── ab-tests.tsx
│   │   │   │   ├── disputes.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── invites.tsx
│   │   │   │   ├── sales.tsx
│   │   │   │   └── users.tsx
│   │   │   ├── affiliate/
│   │   │   │   └── [id].tsx
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth].ts
│   │   │   │   └── og.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── categories/
│   │   │   │   └── [category].tsx
│   │   │   ├── cities/
│   │   │   │   └── index.tsx
│   │   │   ├── city/
│   │   │   │   └── [city].tsx
│   │   │   ├── condition-guide.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── creator/
│   │   │   │   └── dashboard.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── feed.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── guide.tsx
│   │   │   ├── index.tsx
│   │   │   ├── items/
│   │   │   │   └── [id].tsx
│   │   │   ├── leaderboard.tsx
│   │   │   ├── login.tsx
│   │   │   ├── map.tsx
│   │   │   ├── messages/
│   │   │   │   ├── [id].tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── new.tsx
│   │   │   ├── neighborhoods/
│   │   │   │   ├── [slug].tsx
│   │   │   │   └── index.tsx
│   │   │   ├── notifications.tsx
│   │   │   ├── offline.tsx
│   │   │   ├── organizer/
│   │   │   │   ├── add-items/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   ├── add-items.tsx
│   │   │   │   ├── bounties.tsx
│   │   │   │   ├── checklist/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   ├── create-sale.tsx
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── edit-item/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── edit-sale/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── email-digest-preview.tsx
│   │   │   │   ├── holds.tsx
│   │   │   │   ├── insights.tsx
│   │   │   │   ├── line-queue/
│   │   │   │   │   └── [id].tsx
│   │   │   │   ├── message-templates.tsx
│   │   │   │   ├── payouts.tsx
│   │   │   │   ├── print-inventory.tsx
│   │   │   │   ├── sales/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── analytics.tsx
│   │   │   │   ├── send-update/
│   │   │   │   │   └── [saleId].tsx
│   │   │   │   ├── settings.tsx
│   │   │   │   └── webhooks.tsx
│   │   │   ├── organizers/
│   │   │   │   └── [id].tsx
│   │   │   ├── plan.tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── refer/
│   │   │   │   └── [code].tsx
│   │   │   ├── referral-dashboard.tsx
│   │   │   ├── register.tsx
│   │   │   ├── reset-password.tsx
│   │   │   ├── sales/
│   │   │   │   ├── [id].tsx
│   │   │   │   └── zip/
│   │   │   │       └── [zip].tsx
│   │   │   ├── search.tsx
│   │   │   ├── server-sitemap.xml.tsx
│   │   │   ├── shopper/
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── disputes.tsx
│   │   │   │   ├── favorites.tsx
│   │   │   │   ├── holds.tsx
│   │   │   │   └── purchases.tsx
│   │   │   ├── shoppers/
│   │   │   │   └── [id].tsx
│   │   │   ├── terms.tsx
│   │   │   ├── trending.tsx
│   │   │   ├── unsubscribe.tsx
│   │   │   ├── wishlists/
│   │   │   │   └── shared/
│   │   │   │       └── [slug].tsx
│   │   │   └── wishlists.tsx
│   │   ├── postcss.config.js
│   │   ├── public/
│   │   │   ├── fallback-OI8nXpndPrduP2yucmXrX.js
│   │   │   ├── fallback-UaNjxref6efOge_HGFwCr.js
│   │   │   ├── fallback-WBXriFD53-Yn3WC9tqMWi.js
│   │   │   ├── fallback-er3uCbRza2kFz6gsQte4u.js
│   │   │   ├── fallback-gNeuXxCbTqbTpJfL6SNTp.js
│   │   │   ├── favicon.ico
│   │   │   ├── icons/
│   │   │   │   ├── apple-touch-icon.png
│   │   │   │   ├── favicon-16x16.png
│   │   │   │   ├── favicon-32x32.png
│   │   │   │   ├── icon-128x128.png
│   │   │   │   ├── icon-144x144.png
│   │   │   │   ├── icon-152x152.png
│   │   │   │   ├── icon-192x192-maskable.png
│   │   │   │   ├── icon-192x192.png
│   │   │   │   ├── icon-384x384.png
│   │   │   │   ├── icon-512x512-maskable.png
│   │   │   │   ├── icon-512x512.png
│   │   │   │   ├── icon-72x72.png
│   │   │   │   └── icon-96x96.png
│   │   │   ├── images/
│   │   │   │   └── placeholder.svg
│   │   │   ├── manifest.json
│   │   │   ├── robots.txt
│   │   │   ├── sw-cache.js
│   │   │   ├── sw-push.js
│   │   │   ├── sw.js
│   │   │   └── workbox-5d03dacf.js
│   │   ├── sentry.client.config.ts
│   │   ├── sentry.edge.config.ts
│   │   ├── sentry.server.config.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── output.css
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── tsconfig.tsbuildinfo
│   │   ├── types/
│   │   │   ├── bulk-items.ts
│   │   │   ├── next-auth.d.ts
│   │   │   └── recharts.d.ts
│   │   └── utils/
│   │       └── csvExport.ts
│   └── shared/
│       ├── CLAUDE.md
│       ├── package.json
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
├── pnpm
├── pnpm-workspace.yaml
├── push.ps1
├── railway.toml
└── scripts/
    ├── health-check.ts
    ├── session-wrap-check.ps1
    ├── session-wrap-check.sh
    ├── stress-test.js
    └── update-context.js

```

## Tool & Skill Tree
MCP tools are injected at session start — check active tools before assuming availability.
```
MCP Connectors (check at session start):
├── mcp__github__*          — GitHub file push, PR, issues (repo: deseee/findasale)
├── mcp__Claude_in_Chrome__ — Browser automation, screenshots, form filling
├── mcp__MCP_DOCKER__       — Playwright browser, code execution
├── mcp__scheduled-tasks__  — Cron scheduling for recurring tasks
├── mcp__cowork__           — File access, directory requests, file presentation
└── mcp__mcp-registry__     — Search/suggest additional connectors

Skills (loaded on demand):
├── conversation-defaults   — AskUserQuestion workaround + diff-only gate (ALWAYS ACTIVE)
├── dev-environment         — Docker/DB/Prisma reference (load before shell commands)
├── context-maintenance     — Session wrap protocol (load at session end)
├── health-scout            — Proactive code scanning (load before deploys)
├── findasale-deploy        — Deploy checklist (load before production push)
├── skill-creator           — Create/edit/eval skills
├── docx / xlsx / pptx / pdf — Document creation skills
└── schedule                — Create scheduled tasks

Self-Healing Skills: 19 entries in claude_docs/self_healing_skills.md
Docker Containers: findasale-backend-1, findasale-frontend-1, findasale-postgres-1, findasale-image-tagger-1
```

## On-Demand References
Read these files only when the task requires them — they are not loaded by default.
- Schema: `packages/database/prisma/schema.prisma`
- Dependencies: `packages/*/package.json` (and root `package.json`)
- Env vars: `packages/*/.env.example`
- Stack decisions: `claude_docs/STACK.md`
- Project state: `claude_docs/STATE.md`
- Security rules: `claude_docs/SECURITY.md`
- Ops procedures: `claude_docs/OPS.md`
- Session history: `claude_docs/session-log.md`

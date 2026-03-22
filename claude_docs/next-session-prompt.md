# Next Session Prompt — S232

**Date:** 2026-03-22
**Status:** S231 COMPLETE — Bug queue done, AvatarDropdown shipped. Patrick manual push still required.

---

## First: Complete the Manual Push

Run this in PowerShell to push all S231 locally-changed files:

```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale

# Step 1 — Commit local copies of MCP-pushed files to sync git
git add packages/frontend/components/AvatarDropdown.tsx
git add packages/frontend/components/Layout.tsx
git add packages/frontend/components/FavoriteButton.tsx
git add packages/frontend/components/OnboardingModal.tsx
git add packages/backend/src/controllers/favoriteController.ts
git commit -m "S231: Local sync for MCP-pushed files (AvatarDropdown, Layout, BUG #31/#32/#33)"

# Step 2 — Add remaining locally-changed files not yet on GitHub
git add packages/frontend/pages/sales/[id].tsx
git add packages/backend/src/controllers/authController.ts
git add packages/backend/src/controllers/eventController.ts
git add packages/backend/src/controllers/holdController.ts
git add packages/backend/src/controllers/itemController.ts
git add packages/backend/src/controllers/notificationController.ts
git add packages/backend/src/controllers/organizerController.ts
git add packages/backend/src/controllers/paymentController.ts
git add packages/backend/src/controllers/pointsController.ts
git add packages/backend/src/controllers/saleController.ts
git add packages/backend/src/controllers/searchController.ts
git add packages/backend/src/controllers/subscriptionController.ts
git add packages/backend/src/controllers/userController.ts
git add packages/backend/src/controllers/webhookController.ts
git add packages/backend/src/routes/items.ts
git add packages/backend/src/routes/organizers.ts
git add packages/backend/src/routes/users.ts
git commit -m "S231: BUG #30 (Follow button organizer.id) + BUG #22 sweep (54 inline role checks, 24 files) + sale page dark mode fixes"

# Step 3
.\push.ps1
```

---

## Still-Pending Patrick Actions

**Prisma (CRITICAL — blocking #73/#74/#75 runtime):**
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy
npx prisma generate
```

**Railway Environment Variables (still missing):**
```
AI_COST_CEILING_USD=5.00
MAILERLITE_SHOPPERS_GROUP_ID=182012431062533831
```

---

## 1. Chrome Verify AvatarDropdown

After push completes + Vercel deploys:
- Log in as Nina (ADMIN user1@example.com / password123)
- Desktop header should show amber initials circle + name, clicking opens dropdown with Dashboard, Plan a Sale, Subscription, Settings, Sign Out
- Confirm old inline auth links (Hi, [name] text, inline Logout button) are gone

---

## 2. Next Features: #106–#109 Pre-Beta Safety Batch

After Prisma actions confirmed run:

| # | Feature | Scope | Estimate |
|---|---------|-------|----------|
| #106 | Rate limit burst capacity | Redis, 429 fallback | M |
| #107 | Database connection pooling | Railway, Neon | M |
| #108 | API timeout guards | Backend, all routes | S |
| #109 | Graceful degradation on outages | Notification, email, AI | M |

---

## Reference

- Vercel URL: https://findasale-git-main-patricks-projects-f27190f8.vercel.app
- Backend: https://backend-production-153c9.up.railway.app
- Test accounts: Shopper user11, PRO user2, SIMPLE+ADMIN user1, TEAMS user3 (all password123)
- Nav consolidation spec: `claude_docs/ux-spotchecks/nav-dashboard-consolidation-2026-03-20.md`
- CLAUDE.md v5.0 is single authority

---

**Next Session Lead:** Verify push went through → Chrome verify AvatarDropdown → confirm Prisma done → dispatch #106–#109

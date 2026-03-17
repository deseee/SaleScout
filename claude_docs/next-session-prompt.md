# Next Session Resume Prompt
*Written: 2026-03-17T00:00:00Z*
*Session ended: normally*

## ⚠️ Patrick Must Do Before Any Dev Work

### 1. Push S189 code (40+ files)
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale
git add packages/backend/src/index.ts
git add packages/backend/src/services/flipReportService.ts
git add packages/backend/src/controllers/flipReportController.ts
git add packages/backend/src/routes/flipReport.ts
git add packages/frontend/hooks/useFlipReport.ts
git add packages/frontend/pages/organizer/flip-report/[saleId].tsx
git add packages/backend/src/controllers/verificationController.ts
git add packages/backend/src/routes/verification.ts
git add packages/frontend/components/VerifiedBadge.tsx
git add packages/frontend/pages/organizer/settings.tsx
git add packages/backend/src/controllers/lootLogController.ts
git add packages/backend/src/routes/lootLog.ts
git add packages/frontend/hooks/useLootLog.ts
git add packages/frontend/pages/shopper/loot-log.tsx
git add packages/frontend/pages/shopper/loot-log/[purchaseId].tsx
git add packages/frontend/pages/shopper/loot-log/public/[userId].tsx
git add packages/frontend/components/UGCPhotoGallery.tsx
git add packages/frontend/components/UGCPhotoSubmitButton.tsx
git add packages/frontend/pages/organizer/ugc-moderation.tsx
git add packages/backend/src/controllers/ugcPhotoController.ts
git add packages/backend/src/routes/ugcPhotos.ts
git add packages/frontend/hooks/useUGCPhotos.ts
git add packages/backend/src/controllers/collectorPassportController.ts
git add packages/backend/src/routes/collectorPassport.ts
git add packages/backend/src/services/collectorPassportService.ts
git add packages/frontend/hooks/useCollectorPassport.ts
git add packages/frontend/pages/shopper/collector-passport.tsx
git add packages/backend/src/controllers/challengeController.ts
git add packages/backend/src/routes/challenges.ts
git add packages/backend/src/services/challengeService.ts
git add packages/frontend/hooks/useChallenges.ts
git add packages/frontend/components/ChallengeCard.tsx
git add packages/frontend/pages/shopper/challenges.tsx
git add packages/database/prisma/schema.prisma
git add packages/database/prisma/migrations/20260317000900_add_seasonal_challenges/
git add packages/database/prisma/migrations/20260317000950_add_collector_passport/
git add packages/database/prisma/migrations/20260317001100_add_organizer_verification/
git add packages/database/prisma/migrations/20260317001200_add_ugc_photos/
git add claude_docs/STATE.md
git add claude_docs/logs/session-log.md
git add claude_docs/next-session-prompt.md
git add claude_docs/strategy/roadmap.md
git commit -m "S189: Wave 3 — #41 Flip Report, #45 Collector Passport, #50 Loot Log, #16 Verified Badge, #55 Seasonal Challenges, #47 UGC Photos"
.\push.ps1
```

### 2. Run 4 new Neon migrations
```powershell
cd C:\Users\desee\ClaudeProjects\FindaSale\packages\database
$env:DATABASE_URL="postgresql://neondb_owner:npg_VYBnJs8Gt3bf@ep-plain-sound-aeefcq1y.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma migrate deploy
npx prisma generate
```

Migrations being applied:
- `20260317000900_add_seasonal_challenges` — ChallengeBadge, ChallengeProgress, ShopperStamp models
- `20260317000950_add_collector_passport` — CollectorPassport model
- `20260317001100_add_organizer_verification` — verificationStatus/Notes/verifiedAt on Organizer
- `20260317001200_add_ugc_photos` — UGCPhoto + UGCPhotoLike models

---

## What Was Completed This Session (S189)

Wave 3 — 6 features built:

| # | Feature | Tier | Status |
|---|---------|------|--------|
| #41 | Flip Report | PRO | SHIPPED — QA pending |
| #45 | Collector Passport | FREE | SHIPPED — QA pending |
| #50 | Loot Log | FREE | SHIPPED — QA pending |
| #16 | Verified Organizer Badge | PRO | SHIPPED — QA pending |
| #55 | Seasonal Challenges | FREE | SHIPPED — QA pending |
| #47 | UGC Photo Submissions | FREE | SHIPPED — QA pending |

Total QA pending across all sessions: ~18 features. Patrick deferred QA — can be run in batch.

---

## Next Session Priority Order

Patrick reordered the roadmap. At session start, read `claude_docs/strategy/roadmap.md` for the current priority order. Build from the top of the unbuilt items.

**Likely next build candidates (verify against roadmap before dispatching):**
- Phase 4 items not yet built: #25 Organizer Item Library, #29 Shopper Loyalty Passport, #31 Organizer Brand Kit, #32 Shopper Wishlist Alerts
- Phase 5 items not yet built: #49 City Heat Index, #51 Sale Ripples, and others

**Session start dispatch pattern:** Fire all dev subagents simultaneously in the opening message. Each feature is independent. Return all file changes to main context — do NOT push from subagents.

---

## Environment Notes

- Frontend on Vercel, backend on Railway — both auto-deploy on push to main
- Neon migrations run by Patrick manually (schema changes don't auto-deploy)
- No pending Patrick actions blocking dev work once push + migrations above are done
- QA deferred by Patrick — skip QA passes unless Patrick requests

---

## Dispatch Template

Use for each dev subagent:

> "You are the FindA.Sale Senior Developer. Project root: `/sessions/[SESSION]/mnt/FindaSale`. Read `claude_docs/STATE.md` and `claude_docs/strategy/roadmap.md` before starting. Implement feature #[N] — [name]. [Tier: X]. [1-line scope]. Return all new/modified file paths + content. Do NOT push to GitHub — main context will coordinate pushes."

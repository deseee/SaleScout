# TROUBLESHOOTING & RECOVERY

Minimal procedural reference.
Recovery procedures are operational only.
Do not modify architecture during recovery unless explicitly instructed.

---

## 1. Context Overflow

Symptom:
- "Prompt too long"
- Execution stops mid-task

Fix:
- Restart Claude Desktop
- Compress state
- Break into smaller steps
- Disable unused skills/connectors

Prevention:
- Auto-compression at 55% context
- Process files in small batches

---

## 2. Cowork Tab Missing

Fix:
- Update Claude Desktop (v1.8+)
- Confirm Pro/Max plan
- Restart app
- Install Windows updates

---

## 3. Slow Performance

Fix:
- Close heavy apps
- Ensure SSD
- Reduce folder file count (<500 ideal)
- Check RAM usage

---

## 4. Task Stops Mid-Execution

Cause:
Large dataset or long-running process.

Fix:
- Wait 2–3 minutes
- If stalled → cancel
- Restart in smaller batches

---

## 5. File Permission Errors

Fix:
1. Verify correct folder selected.
2. Check Windows file permissions.
3. Run Claude Desktop as normal user.
4. Avoid symlinked paths.

---

## 6. Stripe Issues

Symptom:
- Fee not deducted
- Webhook failure

Check:
- application_fee_amount set
- Webhook secret correct
- Stripe dashboard logs

---

## 7. Geocoding Rate Limit

Symptom:
- Nominatim blocking requests

Fix:
- Ensure backend cache active
- Respect 1 req/sec
- Add fallback provider if needed

---

## 8. Socket.io Not Updating

Check:
- Server running
- CORS config
- Room join logic
- Fallback to polling enabled

---

## 9. Service Worker Problems

Symptom:
- Offline not loading
- Old assets cached

Fix:
- Increment version
- Clear site data
- Hard refresh
- Verify offline.html exists

---

## 10. Docker Backend Crash Loop

Symptom:
- `docker compose ps` shows backend `Restarting`

Common causes and fixes:

**A. Wrong backend startup command in docker-compose.yml**
- Root cause: pnpm does NOT hoist binaries to workspace root `node_modules/.bin`. Calling `npx nodemon` from `/app` fails because npx can't find it.
- Fix: use `pnpm --filter backend run dev` in docker-compose.yml — resolves nodemon via pnpm workspace scope.
- Also ensure `nodemon` and `tsx` are in `dependencies` (not `devDependencies`) in `packages/backend/package.json`.
- After changing docker-compose.yml: `docker compose down && docker compose up --build --no-cache`

**B. Prisma ENUM vs TEXT mismatch (P2032)**
- Symptom: `Error converting field "status"/"role" of expected non-nullable type "String"`
- Cause: init migration created PostgreSQL ENUM types; Prisma schema uses String
- Fix: create migration to ALTER COLUMN TYPE TEXT USING col::TEXT, then DROP TYPE
- Applied migrations: `convert_role_to_text`, `convert_status_enums_to_text`

**C. Migration not applied after file change**
- `docker compose up -d --no-deps backend` does NOT restart a Running container
- Use `docker compose restart backend` to force restart and re-run migrate deploy

---

## 11. Docker Hot Reload Not Working (Windows 10)

Symptom:
- Editing source files on host; container doesn't detect changes

Fix:
- Backend: nodemon requires `--legacy-watch` flag (polling mode)
  Command: `npx nodemon --legacy-watch --exec 'tsx src/index.ts'`
- Frontend: Next.js requires polling env vars in docker-compose.yml:
  `WATCHPACK_POLLING: "true"` and `CHOKIDAR_USEPOLLING: "true"`
- After adding these, run `docker compose restart frontend` once

---

## 12. Migration Drift (DB out of sync with migration files)

Symptom:
- `prisma db push` says "Added the required column X" for a column that already exists in migration files
- `prisma migrate deploy` applies 0 migrations but DB is missing columns

Cause: DB was created or modified via `db push` or manual SQL at some point, bypassing the migration history. The `_prisma_migrations` table may show migrations as "applied" that never actually ran, or columns exist in migration files but not in the DB.

Fix (local dev only — wipes all data):
```powershell
docker exec findasale-backend-1 sh -c "cd /app/packages/database && npx prisma migrate reset --force"
docker exec findasale-backend-1 sh -c "cd /app && npx tsx packages/database/prisma/seed.ts"
```

Prevention: Never use `db push` on the running dev DB. Always use `migrate dev` (interactive) or `migrate deploy` (CI/startup).

---

## 13. PowerShell quoting with docker exec + psql

Symptom:
- `\"` inside a double-quoted string → Docker receives literal backslash: `DELETE FROM " AffiliateLink\;"`
- `'DELETE FROM "AffiliateLink";'` single-quoted → PowerShell strips inner double quotes → psql sees `DELETE FROM AffiliateLink;` → relation not found (case mismatch)

Fix — assign SQL to a variable first:
```powershell
$sql = 'DELETE FROM "AffiliateLink";'
docker exec findasale-postgres-1 psql -U findasale -d findasale -c $sql
```

Or use PowerShell backtick escaping inside double quotes:
```powershell
docker exec findasale-postgres-1 psql -U findasale -d findasale -c "DELETE FROM `"AffiliateLink`";"
```

---

## 14. npx prisma picks up wrong version (v7 instead of project's v5)

Symptom:
- `npx --yes prisma migrate dev` → `Error: The datasource property 'url' is no longer supported`
- Prisma CLI Version shows 7.x but project uses 5.x

Cause: `npx --yes prisma` fetches the latest published version from npm, ignoring the project's lockfile.

Fix: Prisma only lives inside Docker on this machine. Never run `npx prisma` from Windows for this project. All Prisma commands must go through Docker:
```powershell
docker exec findasale-backend-1 sh -c "cd /app/packages/database && npx prisma <command>"
```
The container has the correct version (5.22.0) locked in its node_modules.

---

## Recovery Principle

Never panic.
Restore from backup.
Reduce scope.
Proceed incrementally.

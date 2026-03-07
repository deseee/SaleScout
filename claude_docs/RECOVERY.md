# TROUBLESHOOTING & RECOVERY

Operational procedures only. For pattern-based fixes, see `self_healing_skills.md`.

---

## 1. Context Overflow
Symptom: "Prompt too long" or mid-task execution stops.
Fix: Restart Claude Desktop, compress state, break into smaller steps, disable unused skills/connectors.

## 2. Cowork Tab Missing
Fix: Update Claude Desktop (v1.8+), confirm Pro/Max plan, restart app.

## 3. Slow Performance
Fix: Close heavy apps, ensure SSD, reduce folder file count (<500), check RAM.

## 4. Task Stops Mid-Execution
Fix: Wait 2–3 min. If stalled → cancel, restart in smaller batches.

## 5. File Permission Errors
Fix: Verify correct folder selected. Check Windows permissions. Avoid symlinked paths.

## 6. Stripe Issues
Check: application_fee_amount set, webhook secret correct, Stripe dashboard logs.

## 7. Geocoding Rate Limit
Fix: Ensure backend cache active, respect 1 req/sec, add fallback provider if needed.

## 8. Auction Polling (Socket.io Deferred)
Current: Polling via React Query (5-second intervals). Revisit when data shows >2s bid delays.

## 9. Service Worker Problems
Fix: Increment version, clear site data, hard refresh, verify offline.html exists.
For Stripe/third-party script blocking, see self_healing_skills.md #17.

## 10. Backend Crash Loop
Fix: Check nodemon error logs. Ensure `pnpm --filter backend run dev` is running (not `npx nodemon`).
See self_healing_skills.md #9 (pnpm/nodemon), #10 (circular deps).

## 11. Migration Drift (Local Dev)
Quick fix (wipes data):
```powershell
cd packages/database
npx prisma migrate reset --force
```

## 12. Native Dev Environment Issues

### 12a. Backend Won't Start (Node.js Error)
Check: Node.js 18+ installed, pnpm 8+, PostgreSQL running on port 5432.
```powershell
node --version  # Should be v18+
pnpm --version  # Should be 8+
psql -U postgres -c "SELECT version();"  # Verify PostgreSQL
```
If PostgreSQL offline: Open Windows Services → PostgreSQL → Restart.

### 12b. Frontend Hot Reload Not Working
Windows 10 native: Set polling environment variables before running:
```powershell
$env:WATCHPACK_POLLING = "true"
$env:CHOKIDAR_USEPOLLING = "true"
pnpm --filter frontend dev
```

### 12c. Prisma Client Mismatch After Schema Change
Regenerate after modifying schema:
```powershell
cd packages/database
npx prisma generate
```

### 12d. Port Already in Use
Check what's using port 3000 (frontend) or 5000 (backend):
```powershell
netstat -ano | findstr ":3000\|:5000"
# Kill by PID: taskkill /PID [PID] /F
```

---

## Recovery Principle

Restore from backup. Reduce scope. Proceed incrementally.

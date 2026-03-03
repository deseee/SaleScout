# Next Session Resume Prompt
*Written: 2026-03-03T23:35:00Z*
*Session ended: normally*

## Resume From

Two parallel tracks — pick one based on priority:

**Track A (feature work):** Start fixing H1-H11 from `claude_docs/pre-beta-audit-2026-03-03.md`. Read the Combined Recommended Fix Order table in that file, H findings first.

**Track B (workflow improvement — Patrick requested):** Investigate workarounds for the "can't run Docker from VM" gap. Claude currently can't execute `docker compose` or `docker exec` commands — Patrick must copy-paste every Docker command into PowerShell. Explore solutions below.

## Docker-from-VM Investigation (Track B)

Patrick wants to reduce the copy-paste loop on Docker commands. Research and prototype the best option:

### Option 1 — Docker MCP Server
Search `mcp__mcp-registry__search_mcp_registry` for ["docker", "container", "compose"]. If a Docker MCP connector exists, suggest Patrick install it. This would let Claude call Docker commands directly via MCP tools.

### Option 2 — Docker TCP Socket
Docker Desktop on Windows can expose a TCP socket on `tcp://localhost:2375` (unauthenticated) or `tcp://localhost:2376` (TLS). If enabled, the VM could potentially reach it via `DOCKER_HOST=tcp://host.docker.internal:2375`. Check if this is feasible:
```bash
# Test from VM — does Docker Desktop expose TCP?
curl -s http://host.docker.internal:2375/version 2>&1 | head -5
```

### Option 3 — SSH into Windows Host
If SSH server is running on the Windows host, the VM could ssh to `host.docker.internal` and run PowerShell commands directly. Unlikely to be configured but worth a quick check.

### Option 4 — Wrapper Script via Bind Mount
Create a PowerShell `.ps1` script in the FindaSale project folder that Patrick runs once per session as a "command listener" — reads a command file written by Claude, executes it, writes output back to a response file. Low-tech but zero-dependency.

### Option 5 — Accept the Gap + Optimize Workflow
If none of the above work, document the permanent workaround pattern and bake it into `dev-environment` skill:
- Claude writes the exact PowerShell command (batched where possible)
- Patrick pastes it
- Patrick pastes output back
- Claude in Chrome handles all JSON API tests (no more curl through docker exec)

Recommended: Try Option 1 (MCP registry) first, then Option 2 (TCP socket test from VM). Document findings in `claude_docs/RECOVERY.md` entry 17 regardless of outcome.

## What Was Completed This Session
- C1: Role whitelist (authController.ts)
- C2: referralCode in JWT payload + AuthContext decode
- C3: category + condition in getSale items select
- C4: AffiliateLink userId field + composite unique + schema corrected
- C5: Stripe idempotency key on paymentIntents.create
- C6/C7: Verified already clean/implemented
- Schema drift fixed: SaleSubscriber PK (@@id→@id, userId nullable), Favorite.updatedAt removed
- DB reset + seed working cleanly (migrate reset --force, Prisma client regenerated)
- Smoke tests: C1/C2/C3 verified via Claude in Chrome browser fetch
- RECOVERY.md entries 12–16 pushed to GitHub

## Environment Notes
- All C1-C7 changes on GitHub main
- DB seeded and healthy — no migration needed at session start
- Chrome extension was connected — keep it connected for future API smoke tests
- schema.prisma on disk and GitHub is the full correct schema (all models present)
- `docker compose restart backend` was run — Prisma client is current

## Known Drift to Fix Later
- Bid model in schema.prisma has `status String` and `updatedAt DateTime @updatedAt` but neither column exists in the DB migrations. Safe for now (seed doesn't create Bids, no Bid-creation routes tested), but will cause P2022 when Bid writes are tested. Flag before next Bid feature work.

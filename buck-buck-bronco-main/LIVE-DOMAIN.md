# Live domain: buckbuckbronco.com

## Status (emergency go-live 2026-09-08)

| Piece | Status |
|--------|--------|
| Apex `https://buckbuckbronco.com` | **NO** — `DEPLOYMENT_NOT_FOUND` (DNS hits Vercel; no READY deploy bound) |
| www | Same |
| DNS | Already on Vercel (`*.vercel-dns-017.com`) |
| Melissa GitHub `bbb-website` | Agent **cannot** push (404) |
| Damien staging | **YES** READY — https://buck-buck-bronco-staging.vercel.app |
| Domain attach API from this agent | **Blocked** (no `VERCEL_TOKEN` / CLI login; MCP cannot add domains) |

## Emergency unblock (Damien)

Attach the apex to the project that already has a READY deploy:

**https://vercel.com/d-s-projects-prim/buck-buck-bronco-staging/settings/domains**

Add:

- `buckbuckbronco.com`
- `www.buckbuckbronco.com`

Production hosts are **not** password-gated (see `src/lib/staging.ts` `isProductionHost`). Staging host keeps the gate.

If the domain is locked on Melissa’s Vercel team with an empty/broken project: remove it there, then add it on Damien staging above.

## Ownership note

Long-term home remains Melissa. Emergency Damien attach is interim so the public URL works. Details: [OWNERSHIP.md](./OWNERSHIP.md).

## Staging vs production hosts

| Environment | Host | Gate |
|-------------|------|------|
| Interim staging | `buck-buck-bronco-staging.vercel.app` | Password when staging host / `STAGING_LOCK` |
| Production (target) | `buckbuckbronco.com` / `www` | **Never** gated |

## GoDaddy

See [GODADDY-DNS.md](./GODADDY-DNS.md). Usually no DNS change after domain is attached to a READY Vercel project.

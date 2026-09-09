# Live domain: buckbuckbronco.com

## Status (verified 2026-09-09)

| Piece | Status |
|--------|--------|
| Apex `https://buckbuckbronco.com` | **YES** — HTTP 200, Next.js, title `Buck Buck Bronco \| Share a Smile.` |
| www | **YES** — same |
| `/bucked` | **YES** — 200 |
| `/play` | **YES** — 308 → `/#how` |
| `/join` | **YES** — 308 → `/#community` |
| DNS | On Vercel |
| Melissa GitHub `bbb-website` | Agent **cannot** see (404) |
| Writable GitHub for this agent | `buck-buck-bronco/bbb-website-2` |
| Damien staging | **YES** — https://buck-buck-bronco-staging.vercel.app (gate on) |
| Domain on Damien staging project? | **NO** — not in that project’s domain list |

Production hosts are **not** password-gated (see `src/lib/staging.ts` `isProductionHost`). Staging host keeps the gate.

## Ownership note

Long-term home remains Melissa. Apex is already serving the site from a Vercel project this agent cannot list (not on team `d-s-projects-prim`). Details: [OWNERSHIP.md](./OWNERSHIP.md).

## Staging vs production hosts

| Environment | Host | Gate |
|-------------|------|------|
| Interim staging | `buck-buck-bronco-staging.vercel.app` | Password when staging host / `STAGING_LOCK` |
| Production | `buckbuckbronco.com` / `www` | **Never** gated |

## GoDaddy

See [GODADDY-DNS.md](./GODADDY-DNS.md). No DNS change needed while apex already resolves to Vercel.

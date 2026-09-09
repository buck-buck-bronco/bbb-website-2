# Ownership — Melissa vs interim Damien

**Required long-term home is Melissa’s accounts.** Damien paths below are interim so the site can stay online.

## Verdict (emergency go-live 2026-09-08 ~23:40 UTC)

| Question | Answer |
|----------|--------|
| `https://buckbuckbronco.com` serving the site? | **NO** — DNS → Vercel, response `DEPLOYMENT_NOT_FOUND` |
| This Cloud Agent push to Melissa `bbb-website`? | **NO** — still 404 / `Repository not found` |
| Damien interim GitHub writable? | **YES** — `drich-22/buck-buck-bronco` |
| Damien Vercel (team `d-s-projects-prim`) reachable? | **YES** — MCP sees **D's projects** only |
| Melissa Vercel team visible here? | **NO** |
| Staging live? | **YES** — https://buck-buck-bronco-staging.vercel.app (password gate) |
| Ready site SHA (authenticity + polish) | `4ee7d8394cee3cb40b5096e807ff7db69b2af3e3` (+ emergency gate fix on this branch) |
| Vercel CLI / `VERCEL_TOKEN` for domain add? | **NO** — CLI logged out; no token in env; MCP has **no** domain-attach tool |
| Downloadable site zip | https://github.com/drich-22/buck-buck-bronco/releases/tag/emergency-go-live-4ee7d83 |

## Why Melissa push still fails

Agent identity is `cursor[bot]` installation token scoped to **only** `drich-22/buck-buck-bronco` (`/installation/repositories` → `total_count: 1`). Collaborator invites and a separate Cursor install on Melissa’s user do **not** enlarge this token.

```text
gh api /repos/buck-buck-bronco/bbb-website → 404
git push melissa … → remote: Repository not found (exit 128)
```

## Emergency live path (Damien domain attach) — UNBLOCKS APEX NOW

Domain DNS already points at Vercel (`291c8ca694e81f1a.vercel-dns-017.com`). Apex fails because **no project this agent can see has the domain attached to a READY production deployment**.

**Single human action (Damien, signed into Vercel on team “D's projects”):**

1. Open: https://vercel.com/d-s-projects-prim/buck-buck-bronco-staging/settings/domains  
2. Add `buckbuckbronco.com` and `www.buckbuckbronco.com`  
3. If Vercel says the domain is on another team (Melissa), remove it there first, then re-add here — or stay on Melissa’s project **only if** that project has a READY deploy of this site (it currently does not from this agent’s view).

Code on this emergency branch **exempts** `buckbuckbronco.com` / `www` from the staging password gate even if `STAGING_LOCK=1` remains on the interim project.

### After apex works

- Public review site without gate: custom domain.  
- Staging review with gate: keep https://buck-buck-bronco-staging.vercel.app  
- Later: move Git + Vercel ownership to Melissa; detach domain from Damien when Melissa project is READY.

## Melissa long-term (still required eventually)

1. Damien accepts collaborator invite: https://github.com/notifications  
2. Local Damien shell (not this agent): `./scripts/push-to-melissa.sh` with tip SHA  
3. Melissa Vercel: import `bbb-website`, deploy READY, move domains off Damien to her project  

## Artifact / interim remotes

| Asset | Location |
|-------|----------|
| Interim GitHub | https://github.com/drich-22/buck-buck-bronco |
| Interim staging Vercel | https://buck-buck-bronco-staging.vercel.app |
| Release zip | https://github.com/drich-22/buck-buck-bronco/releases/tag/emergency-go-live-4ee7d83 |
| Melissa remote (configured, unusable here) | `melissa` → `buck-buck-bronco/bbb-website` |

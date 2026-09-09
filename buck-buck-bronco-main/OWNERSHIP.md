# Ownership — Melissa vs interim Damien

**Required long-term home is Melissa’s accounts.** Damien paths below are interim so the site can stay online.

## Verdict (access verification 2026-09-09)

| Question | Answer |
|----------|--------|
| Cloud Agent GitHub install | **YES** — scoped to `buck-buck-bronco/bbb-website-2` (`/installation/repositories` → `total_count: 1`) |
| Push / edit this repo? | **YES** — this branch proves write access |
| Melissa GitHub `bbb-website` | **NO** — still 404 / `Repository not found` |
| `https://buckbuckbronco.com` serving the site? | **YES** — HTTP 200, title `Buck Buck Bronco \| Share a Smile.` (Vercel). `/bucked` 200; `/play` → `/#how`; `/join` → `/#community` |
| Which Vercel team owns the apex? | **Not visible here** — none of Damien’s listed projects have `buckbuckbronco.com` attached |
| Damien Vercel (team `d-s-projects-prim`) reachable? | **YES** — MCP sees **D's projects** only |
| Melissa Vercel team visible here? | **NO** |
| Staging live? | **YES** — https://buck-buck-bronco-staging.vercel.app (password gate, 307 → `/staging-gate`) |
| Vercel CLI / domain-attach from this agent? | **NO** — MCP has no domain-attach tool; apex is already live on an unseen project |

## Repo shape (fixed on this branch)

`bbb-website-2` was a zip dump (`buck-buck-bronco-main.zip` + nested folder). Next.js now lives at the **repo root** (`package.json`, `src/`, `vercel.json`) so Vercel can build without a Root Directory workaround. The zip is no longer tracked.

## Why `bbb-website` still 404s

This install is **only** `buck-buck-bronco/bbb-website-2`. Collaborator invites on other repos do not enlarge the token.

```text
gh api /repos/buck-buck-bronco/bbb-website → 404
```

Treat `bbb-website-2` as the writable Melissa-org repo for this agent.

## Live domain

Apex and www already return the Next.js site. DNS is on Vercel. Custom domain is **not** on Damien staging (`buck-buck-bronco-staging` domains are `*.vercel.app` only), so production is almost certainly Melissa’s Vercel project.

Code still exempts `buckbuckbronco.com` / `www` from the staging password gate (`src/lib/staging.ts` `isProductionHost`).

### After ownership is unified

- Public site: custom domain (already live).
- Staging review with gate: keep https://buck-buck-bronco-staging.vercel.app
- Later: import `buck-buck-bronco/bbb-website-2` on Melissa Vercel if that is not already the live project; detach any Damien interim domain.

## Artifact / remotes

| Asset | Location |
|-------|----------|
| Writable Melissa-org GitHub | https://github.com/buck-buck-bronco/bbb-website-2 |
| Interim Damien GitHub | https://github.com/drich-22/buck-buck-bronco |
| Interim staging Vercel | https://buck-buck-bronco-staging.vercel.app (linked to `drich-22/buck-buck-bronco`) |
| Production | https://buckbuckbronco.com (Vercel; project not listed on Damien team) |
| Unusable from this agent | `buck-buck-bronco/bbb-website` |

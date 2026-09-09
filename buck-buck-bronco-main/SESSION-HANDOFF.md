# SESSION-HANDOFF — Buck Buck Bronco

## Done
- Scaffolded Next.js 16 + Tailwind 4 site in `github.com/drich-22/buck-buck-bronco`
- Branch: `cursor/buck-buck-bronco-site-b076`
- PR: https://github.com/drich-22/buck-buck-bronco/pull/1
- Routes: `/`, `/play`, `/bucked` (tag maker), `/join`
- Production build passes

## Blockers / gaps
- Prior “no workspace” agent conversation was **not recoverable** from this environment (list-cloud-agents only sees this repo’s environment).
- Higgsfield MCP session expired (401) — re-auth needed if prior work lived there.
- Domain `buckbuckbronco.com` is GoDaddy parking; needs DNS → Vercel.
- Vercel MCP `list_projects` failed for team; git push should still trigger linked project if connected.

## Next
1. User: re-auth Higgsfield + paste prior agent URL if exact prior assets/copy should be merged.
2. Connect custom domain + set `NEXT_PUBLIC_SITE_URL=https://buckbuckbronco.com`.
3. Confirm Facebook group URL is the intended community link.
4. Merge PR / promote Vercel production.

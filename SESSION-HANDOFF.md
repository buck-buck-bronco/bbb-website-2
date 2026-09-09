# SESSION-HANDOFF — Buck Buck Bronco (`bbb-website-2`)

## Done this run
- Confirmed Cursor GitHub App can read **and push** `buck-buck-bronco/bbb-website-2`
- Flattened Next.js from `buck-buck-bronco-main/` to repo root; removed tracked zip
- `npm run build` passes (Next.js 16.2.10)
- Live apex already serving the site

## Verified live
- https://buckbuckbronco.com — 200
- https://www.buckbuckbronco.com — 200
- Staging still gated: https://buck-buck-bronco-staging.vercel.app

## Still true
- This install cannot see `buck-buck-bronco/bbb-website` (404)
- Vercel MCP only sees Damien team `d-s-projects-prim`; apex is not attached there
- Higgsfield not required for this verification

## Next
1. Merge this flatten PR so `main` is a deployable Next.js app
2. On Melissa Vercel: confirm the live project is (or gets) linked to `bbb-website-2`
3. Set `NEXT_PUBLIC_SITE_URL=https://buckbuckbronco.com` on that project if missing
4. Confirm Facebook group URL with Melissa (`siteConfig.community`)

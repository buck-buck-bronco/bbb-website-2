# Buck Buck Bronco

Community site for the Ford Bronco kindness tradition: leave a Buck, share a smile, and keep the Facebook community growing. Founded by Melissa Patterson.

The Next.js app lives in `buck-buck-bronco-main/` (Vercel Root Directory for the live `bbb-website` project).

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4

## Develop

```bash
npm install --prefix buck-buck-bronco-main
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | One-page marketing site (hero → contact) |
| `/bucked` | Printable “You’ve been bucked” tag maker |
| `/play` | Redirects to `/#how` |
| `/join` | Redirects to `/#community` |
| `/review` | Staging-only edits inbox (not on the live domain) |
| `/staging-gate` | Password gate for the staging host |

## Staging review

See [buck-buck-bronco-main/STAGING.md](./buck-buck-bronco-main/STAGING.md). Set `STAGING_PASSWORD` on the staging host. The review dock is **off** on `buckbuckbronco.com`.

## Deploy

The connected Vercel project (`buck-buck-bronco/bbb-website`) uses Root Directory `buck-buck-bronco-main`. Set `NEXT_PUBLIC_SITE_URL=https://buckbuckbronco.com` on that project.

Not affiliated with Ford Motor Company.

# Buck Buck Bronco

Community site for the Ford Bronco kindness tradition: leave a Buck, share a smile, and keep the Facebook community growing. Founded by Melissa Patterson.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4

## Develop

```bash
npm install
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

See [STAGING.md](./STAGING.md). Set `STAGING_PASSWORD` on the staging host. The review dock is **off** on `buckbuckbronco.com`.

## GoDaddy DNS

See [GODADDY-DNS.md](./GODADDY-DNS.md) to point `buckbuckbronco.com` at Vercel.

## Deploy

Set `NEXT_PUBLIC_SITE_URL` for absolute canonicals and schema URLs.

Staging env:

- `STAGING_PASSWORD` (required on the staging host)
- `STAGING_LOCK=1` (optional if the host already matches staging)
- Optional review sync: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Not affiliated with Ford Motor Company.

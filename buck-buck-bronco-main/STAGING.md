# Staging review site

Share this with your reviewer so she can pick elements, leave comments, toggle keep/hide, and swap pictures. She (and Damien) can open **Your edits** anytime.

The review dock and **Your edits** links are **staging / localhost / preview only**. They never render on `buckbuckbronco.com`.

## Staging lock

The password is not stored in this repo. On the staging host, and on generated previews, the gate stays shut until both of these environment variables are set:

- `STAGING_PASSWORD`
- `STAGING_SESSION_SECRET` (at least 16 characters; signs the session cookie)

The gate also locks every `*.vercel.app` hostname and any deployment with `VERCEL_ENV=preview`. `buckbuckbronco.com` stays open. `STAGING_LOCK=1` also locks any other non-production host, including local.

Set `STAGING_LOCK=1` for the staging `next build`, on both the stable and preview build environments. That build serves original image files and does not use `/_next/image`. Start from a fresh build cache. Do not reuse `.next` or a build cache produced without `STAGING_LOCK=1`. The customer site build leaves `STAGING_LOCK` unset, so its images stay optimized.

- Cookie name: `bbb_staging_auth` (HttpOnly, Secure, SameSite=Lax, 14 days). The value is a signed session, not the password. Secure is always set.
- Gate page: `/staging-gate`
- Review storage stays off unless `REVIEW_STORAGE_ENABLED` is exactly `1`. Older `REVIEW_SUPABASE_URL` or `REVIEW_SUPABASE_ANON_KEY` values do not turn it back on. There is no built-in database fallback.

Do not commit the values.

## Share links (live)

Send her this (picker turns on automatically; enter the staging password first):

**https://buck-buck-bronco-staging.vercel.app/?review=1**

**Your edits** inbox (also linked from the header button and bottom review dock):

**https://buck-buck-bronco-staging.vercel.app/review**

Stable staging host: `https://buck-buck-bronco-staging.vercel.app`

## How she uses it

1. Open the staging link and enter the staging password.
2. Confirm the bottom-right dock shows **Review on** / **Picking…**, plus a highlighted **Your edits** button.
3. Click any dashed outline (hero, copy, photos, sections).
4. Enter her name once.
5. **Save comment** — notes for Damien.
6. **Keep or hide** — mark whether that block should stay on the site.
7. On photo blocks — paste a URL or upload a picture, then **Save picture change**.
8. Open **Your edits** in the header, footer, or dock (or `/review`) to see every change she submitted.

Picture swaps and hide states also preview live on the staging pages.

## Local staging

```bash
npm install
npm run dev
```

Open [http://localhost:3000/?review=1](http://localhost:3000/?review=1).

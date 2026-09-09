# Staging review site

Share this with your reviewer so she can pick elements, leave comments, toggle keep/hide, and swap pictures. She (and Damien) can open **Your edits** anytime.

## Staging password (Damien)

**Password:** `SmileBucked13`

Set on the staging Vercel project as:

```bash
STAGING_PASSWORD=SmileBucked13
STAGING_LOCK=1
```

- Gate activates when `STAGING_LOCK=1` **or** the host looks like the staging app (`buck-buck-bronco-staging.vercel.app`).
- Cookie name: `bbb_staging_auth` (httpOnly, 14 days).
- Gate page: `/staging-gate`

Locally, add the same vars to `.env.local` if you want to test the lock.

## Share links (live)

Send her this (picker turns on automatically; enter the staging password first):

**https://buck-buck-bronco-staging.vercel.app/?review=1**

**Your edits** inbox (also linked from the header button and bottom review dock):

**https://buck-buck-bronco-staging.vercel.app/review**

Stable staging host: `https://buck-buck-bronco-staging.vercel.app`

## How she uses it

1. Open the staging link and enter the password from Damien.
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

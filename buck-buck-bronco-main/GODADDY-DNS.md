# GoDaddy DNS → Vercel (buckbuckbronco.com)

Domain is registered at **GoDaddy**. Point it at the Vercel project so `https://buckbuckbronco.com` serves this site.

## Vercel project (live)

- Team: **D's projects** (`d-s-projects-prim`)
- Project: **buck-buck-bronco-staging** (git-linked to `drich-22/buck-buck-bronco`)
- Staging URL (password gate): https://buck-buck-bronco-staging.vercel.app  
  Password: `SmileBucked13`
- **Add domains here (required click):**  
  https://vercel.com/d-s-projects-prim/buck-buck-bronco-staging/settings/domains

Add both:

1. `buckbuckbronco.com`
2. `www.buckbuckbronco.com`

If Vercel says the domain is already in use on another project, choose **Move** / force reassignment to this project. Until the domain is attached here, the hostname hits Vercel with `DEPLOYMENT_NOT_FOUND`.

Staging lock only applies when the hostname includes `buck-buck-bronco-staging` or starts with `staging.` — apex/www production hosts stay unlocked.

## Option A — Apex + www (recommended)

In GoDaddy → **My Products** → domain **buckbuckbronco.com** → **DNS** → **Manage DNS**.

### 1. Remove conflicting records

Delete any existing **A**, **AAAA**, **CNAME**, or **Forwarding** records for:

- `@` (apex / root)
- `www`

Leave unrelated records alone (email MX, TXT for Google/Microsoft, etc.).

### 2. Apex (`buckbuckbronco.com`)

Add an **A** record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `76.76.21.21` | 600 (or 1 Hour) |

Vercel may also resolve via other anycast IPs (e.g. `216.198.79.1`). Prefer the record Vercel shows after you add the domain.

### 3. www

Add a **CNAME** record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `cname.vercel-dns.com.` | 600 (or 1 Hour) |

> Some GoDaddy UIs omit the trailing dot — `cname.vercel-dns.com` is fine.  
> After attaching the domain in Vercel, the UI may show a project-specific target like `*.vercel-dns-017.com` — use that if prompted.

### 4. Save and wait

DNS can take from a few minutes up to ~48 hours. In Vercel Domains, status should move to **Valid**.

## Option B — Forward apex to www (GoDaddy forwarding)

If GoDaddy won’t let you set an A record cleanly:

1. Set **www** CNAME → `cname.vercel-dns.com`
2. In GoDaddy, enable **Domain Forwarding**: `buckbuckbronco.com` → `https://www.buckbuckbronco.com` (permanent / 301)
3. In Vercel, keep both domains attached and set **www** as primary if you prefer.

## Staging vs production

- **Staging / review link:** https://buck-buck-bronco-staging.vercel.app (password gate; see `STAGING.md`)
- **Production domain:** attach apex + www on the same Vercel project; middleware will not password-lock those hosts

## Checklist

- [ ] Added domains in Vercel (settings URL above)
- [ ] Apex A → `76.76.21.21` (or Vercel-shown value)
- [ ] www CNAME → `cname.vercel-dns.com` (or Vercel-shown value)
- [ ] Removed old parking / lander records
- [ ] Vercel shows domain Valid / SSL issued
- [ ] Open `https://buckbuckbronco.com` and confirm the Buck Buck Bronco site (not GoDaddy parking / not `DEPLOYMENT_NOT_FOUND`)

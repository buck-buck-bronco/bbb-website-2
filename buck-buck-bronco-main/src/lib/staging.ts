export const STAGING_COOKIE = "bbb_staging_auth";
export const STAGING_GATE_PATH = "/staging-gate";

/**
 * Canonical staging gate password (documented in STAGING.md).
 * Prefer STAGING_GATE_PASSWORD. Do not read STAGING_PASSWORD — that
 * Vercel env drifted from the docs and rejected SmileBucked13.
 */
const STAGING_PASSWORD_CANONICAL = "SmileBucked13";

const PRODUCTION_HOSTS = new Set([
  "buckbuckbronco.com",
  "www.buckbuckbronco.com",
]);

export function hostnameOf(host: string) {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function isProductionHost(host: string) {
  return PRODUCTION_HOSTS.has(hostnameOf(host));
}

export function isStagingHost(host: string) {
  const bare = hostnameOf(host);
  return (
    bare.includes("buck-buck-bronco-staging") ||
    bare.startsWith("staging.")
  );
}

/** Staging host always. Local/preview only with ?review=1. Never on the public domain. */
export function isReviewUiEnabled(host: string, search = "") {
  if (isProductionHost(host)) return false;
  if (isStagingHost(host)) return true;
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const flagged =
    params.get("review") === "1" || params.get("staging") === "1";
  const bare = hostnameOf(host);
  if (bare === "localhost" || bare === "127.0.0.1") return flagged;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return flagged;
  return false;
}

export function isReviewPath(pathname: string) {
  return pathname === "/review" || pathname.startsWith("/review/");
}

export function stagingLockEnabled(host: string) {
  // Never password-gate the live custom domain, even if STAGING_LOCK=1
  // is set on the interim Damien project used for emergency attach.
  if (isProductionHost(host)) return false;
  if (process.env.STAGING_LOCK === "1") return true;
  return isStagingHost(host);
}

/** Server-only. Prefer STAGING_GATE_PASSWORD; otherwise the documented password. */
export function getStagingPassword(): string {
  const fromEnv = process.env.STAGING_GATE_PASSWORD?.trim();
  return fromEnv || STAGING_PASSWORD_CANONICAL;
}

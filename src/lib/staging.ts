export const STAGING_COOKIE = "bbb_staging_auth";
export const STAGING_GATE_PATH = "/staging-gate";

/** Fallback only when env is missing; also documented in STAGING.md */
const STAGING_PASSWORD_FALLBACK = "SmileBucked13";

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

/** Staging / local / preview only. Never on the public domain. */
export function isReviewUiEnabled(host: string) {
  if (isProductionHost(host)) return false;
  if (isStagingHost(host)) return true;
  const bare = hostnameOf(host);
  if (bare === "localhost" || bare === "127.0.0.1") return true;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return true;
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

/** Server-only. Prefer STAGING_PASSWORD env; fallback keeps staging usable. */
export function getStagingPassword(): string {
  return process.env.STAGING_PASSWORD || STAGING_PASSWORD_FALLBACK;
}

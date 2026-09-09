export const STAGING_COOKIE = "bbb_staging_auth";
export const STAGING_GATE_PATH = "/staging-gate";

/** Fallback only when env is missing; also documented in STAGING.md */
const STAGING_PASSWORD_FALLBACK = "SmileBucked13";

const PRODUCTION_HOSTS = new Set([
  "buckbuckbronco.com",
  "www.buckbuckbronco.com",
]);

export function isProductionHost(host: string) {
  const bare = host.split(":")[0]?.toLowerCase() ?? "";
  return PRODUCTION_HOSTS.has(bare);
}

export function isStagingHost(host: string) {
  return (
    host.includes("buck-buck-bronco-staging") ||
    host.startsWith("staging.")
  );
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

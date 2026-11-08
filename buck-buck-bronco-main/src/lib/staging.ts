export const STAGING_COOKIE = "bbb_staging_auth";
export const STAGING_GATE_PATH = "/staging-gate";

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

/** Vercel preview deployments. The customer production domain is never included. */
export function isPreviewDeployment() {
  return process.env.VERCEL_ENV === "preview";
}

/** Any Vercel-generated hostname, including preview and deployment URLs. */
export function isGeneratedDeploymentHost(host: string) {
  return hostnameOf(host).endsWith(".vercel.app");
}

export function shouldNoindex(host: string) {
  if (isProductionHost(host)) return false;
  return isStagingHost(host) || isPreviewDeployment() || isGeneratedDeploymentHost(host);
}

/**
 * Same-origin path only. Rejects protocol-relative and backslash targets.
 * Returns "/" when the value is not a safe in-app path.
 */
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 300) {
    return "/";
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  if (value.includes("\\") || value.includes("://") || value.includes("\0")) {
    return "/";
  }
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "/";
  }
  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    decoded.includes("://")
  ) {
    return "/";
  }
  return value;
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
  if (isStagingHost(host) || isPreviewDeployment() || isGeneratedDeploymentHost(host)) return true;
  return process.env.STAGING_LOCK === "1";
}

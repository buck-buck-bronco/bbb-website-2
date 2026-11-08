/**
 * Logged-out paths that may skip the staging password.
 * Exact paths, or one segment boundary for Next static chunks.
 * Application routes, sitemap, and llms.txt are not in this set.
 */
const EXACT = new Set([
  "/staging-gate",
  "/api/staging-auth",
  "/favicon.ico",
  "/robots.txt",
  "/brand/buck-buck-bronco-mark.webp",
]);

export function isStagingGateExempt(pathname) {
  if (EXACT.has(pathname)) return true;
  return pathname === "/_next/static" || pathname.startsWith("/_next/static/");
}

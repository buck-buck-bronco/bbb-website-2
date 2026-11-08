/** Fixed origin used only to normalize a relative return path. Not a redirect target. */
const TRUSTED_ORIGIN = "https://buckbuckbronco.com";
const CONTROLS = /[\u0000-\u001F\u007F\s]/;

/**
 * Returns a canonical same-origin pathname, search, and hash.
 * Control characters, whitespace, and non-relative targets become "/".
 */
export function safeNextPath(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 300) return "/";
  if (CONTROLS.test(value)) return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (value.includes("\\") || value.includes("://")) return "/";

  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "/";
  }
  if (CONTROLS.test(decoded)) return "/";
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\") || decoded.includes("://")) {
    return "/";
  }

  let url;
  try {
    url = new URL(decoded, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== TRUSTED_ORIGIN) return "/";
  return `${url.pathname}${url.search}${url.hash}`;
}

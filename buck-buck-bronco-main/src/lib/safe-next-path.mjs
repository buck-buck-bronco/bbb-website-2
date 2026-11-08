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
  return finalRelative(`${url.pathname}${url.search}${url.hash}`);
}

/** Reject a serialized path that canonicalization turned into // or slash-backslash. */
function finalRelative(serialized) {
  if (typeof serialized !== "string" || serialized.length === 0 || serialized.length > 300) return "/";
  if (CONTROLS.test(serialized)) return "/";
  if (!serialized.startsWith("/") || serialized.startsWith("//") || serialized.startsWith("/\\")) return "/";
  if (serialized.includes("\\") || serialized.includes("//") || serialized.includes("://")) return "/";

  let again;
  try {
    again = new URL(serialized, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (again.origin !== TRUSTED_ORIGIN) return "/";
  const stable = `${again.pathname}${again.search}${again.hash}`;
  if (stable !== serialized) return "/";
  if (!stable.startsWith("/") || stable.startsWith("//") || stable.startsWith("/\\")) return "/";
  if (stable.includes("\\") || stable.includes("//") || stable.includes("://")) return "/";
  return stable;
}

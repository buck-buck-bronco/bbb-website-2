/** Fixed origin used only to normalize a relative return path. Not a redirect target. */
const TRUSTED_ORIGIN = "https://buckbuckbronco.com";
const CONTROLS = /[\u0000-\u001F\u007F\s]/;
const ENCODED_SLASH = /%(?:2f|5c)/i;

function pathnamePart(value) {
  const noHash = value.split("#", 1)[0];
  return noHash.split("?", 1)[0];
}

function structurallyRelative(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 300) return false;
  if (CONTROLS.test(value)) return false;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return false;
  if (value.includes("\\") || value.includes("://")) return false;
  return true;
}

function pathnameHasEncodedSlash(value) {
  return ENCODED_SLASH.test(pathnamePart(value));
}

/**
 * Returns a canonical same-origin pathname, search, and hash.
 * Percent-decoding runs once, and only to reject an unsafe pathname.
 * Query encoding is left to the URL serializer so a repeated call does not
 * peel another layer off an ordinary query.
 */
export function safeNextPath(value) {
  if (!structurallyRelative(value) || pathnameHasEncodedSlash(value)) return "/";

  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "/";
  }
  if (!structurallyRelative(decoded) || pathnameHasEncodedSlash(decoded)) return "/";

  let url;
  try {
    url = new URL(value, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== TRUSTED_ORIGIN) return "/";
  if (pathnameHasEncodedSlash(url.pathname)) return "/";
  return finalRelative(`${url.pathname}${url.search}${url.hash}`);
}

/** Reject a serialized path that canonicalization turned into //, slash-backslash, or an encoded slash. */
function finalRelative(serialized) {
  if (!structurallyRelative(serialized) || pathnameHasEncodedSlash(serialized)) return "/";
  if (pathnamePart(serialized).includes("//")) return "/";

  let again;
  try {
    again = new URL(serialized, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (again.origin !== TRUSTED_ORIGIN) return "/";
  if (pathnameHasEncodedSlash(again.pathname) || again.pathname.includes("\\")) return "/";
  if (again.pathname.startsWith("//") || again.pathname.startsWith("/\\")) return "/";
  const stable = `${again.pathname}${again.search}${again.hash}`;
  if (stable !== serialized) return "/";
  if (!structurallyRelative(stable) || pathnameHasEncodedSlash(stable)) return "/";
  if (pathnamePart(stable).includes("//")) return "/";
  return stable;
}

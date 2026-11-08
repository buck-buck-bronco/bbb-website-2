/** Fixed origin used only to normalize a relative return path. Not a redirect target. */
const TRUSTED_ORIGIN = "https://buckbuckbronco.com";
const CONTROLS = /[\u0000-\u001F\u007F\s]/;
const PATH_DELIM = /%(?:25|2f|5c)/i;

/** Pathname boundary from the original string. Do not re-split a decoded pathname. */
function rawPathname(value) {
  const hash = value.indexOf("#");
  const noHash = hash === -1 ? value : value.slice(0, hash);
  const query = noHash.indexOf("?");
  return query === -1 ? noHash : noHash.slice(0, query);
}

function structurallyRelative(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 300) return false;
  if (CONTROLS.test(value)) return false;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return false;
  if (value.includes("\\") || value.includes("://")) return false;
  return true;
}

function pathnameHasDelim(pathname) {
  return PATH_DELIM.test(pathname);
}

function onceDecodedPathname(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (pathnameHasDelim(decoded)) return null;
  return decoded;
}

/**
 * Returns a canonical same-origin pathname, search, and hash.
 * The pathname is taken from the original string, then scanned raw and after
 * one decode, without treating a decoded ? or # as a new query boundary.
 * Query encoding is left to the URL serializer.
 */
export function safeNextPath(value) {
  if (!structurallyRelative(value) || pathnameHasDelim(rawPathname(value))) return "/";

  let decodedPath;
  let decodedAll;
  try {
    decodedPath = onceDecodedPathname(rawPathname(value));
    decodedAll = decodeURIComponent(value);
  } catch {
    return "/";
  }
  if (decodedPath === null || !structurallyRelative(decodedAll)) return "/";

  let url;
  try {
    url = new URL(value, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== TRUSTED_ORIGIN || pathnameHasDelim(url.pathname)) return "/";
  try {
    if (onceDecodedPathname(url.pathname) === null) return "/";
  } catch {
    return "/";
  }
  return finalRelative(`${url.pathname}${url.search}${url.hash}`);
}

/** Reject a serialized path that canonicalization turned into //, slash-backslash, or an encoded delimiter. */
function finalRelative(serialized) {
  const path = rawPathname(serialized);
  if (!structurallyRelative(serialized) || pathnameHasDelim(path)) return "/";
  try {
    if (onceDecodedPathname(path) === null) return "/";
  } catch {
    return "/";
  }
  if (path.includes("//")) return "/";

  let again;
  try {
    again = new URL(serialized, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (again.origin !== TRUSTED_ORIGIN) return "/";
  if (pathnameHasDelim(again.pathname) || again.pathname.includes("\\")) return "/";
  try {
    if (onceDecodedPathname(again.pathname) === null) return "/";
  } catch {
    return "/";
  }
  if (again.pathname.startsWith("//") || again.pathname.startsWith("/\\")) return "/";
  const stable = `${again.pathname}${again.search}${again.hash}`;
  if (stable !== serialized) return "/";
  if (!structurallyRelative(stable) || pathnameHasDelim(rawPathname(stable))) return "/";
  if (rawPathname(stable).includes("//")) return "/";
  return stable;
}

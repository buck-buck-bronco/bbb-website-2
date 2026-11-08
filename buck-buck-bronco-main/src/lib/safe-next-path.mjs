/** Fixed origin used only to normalize a relative return path. Not a redirect target. */
const TRUSTED_ORIGIN = "https://buckbuckbronco.com";
const CONTROLS = /[\u0000-\u001F\u007F\s]/;

function structurallyRelative(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 300) return false;
  if (CONTROLS.test(value)) return false;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return false;
  if (value.includes("\\") || value.includes("://")) return false;
  return true;
}

/**
 * Returns a canonical same-origin pathname, search, and hash.
 * The input is percent-decoded at most once, and only to reject unsafe forms.
 * The returned string is the URL serialization of the original input, so a
 * second call does not peel another encoding layer off the query.
 */
export function safeNextPath(value) {
  if (!structurallyRelative(value)) return "/";

  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return "/";
  }
  if (!structurallyRelative(decoded)) return "/";

  let url;
  try {
    url = new URL(value, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== TRUSTED_ORIGIN) return "/";
  return finalRelative(`${url.pathname}${url.search}${url.hash}`);
}

/** Reject a serialized path that canonicalization turned into // or slash-backslash. */
function finalRelative(serialized) {
  if (!structurallyRelative(serialized)) return "/";
  if (serialized.includes("//")) return "/";

  let again;
  try {
    again = new URL(serialized, TRUSTED_ORIGIN);
  } catch {
    return "/";
  }
  if (again.origin !== TRUSTED_ORIGIN) return "/";
  const stable = `${again.pathname}${again.search}${again.hash}`;
  if (stable !== serialized) return "/";
  if (!structurallyRelative(stable) || stable.includes("//")) return "/";
  return stable;
}

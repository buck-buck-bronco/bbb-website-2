/**
 * Review storage is off unless both values are set on the staging host.
 * There is no built-in project fallback.
 */
export function reviewBackend(): { url: string; anonKey: string } | null {
  const rawUrl = process.env.REVIEW_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.REVIEW_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!rawUrl || !anonKey) return null;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;
    if (!parsed.hostname) return null;
    return { url: parsed.origin, anonKey };
  } catch {
    return null;
  }
}

export const REVIEW_TABLE = "bbb_review_edits";

/**
 * Review storage stays off unless this exact opt-in is "1".
 * Older REVIEW_SUPABASE_URL / REVIEW_SUPABASE_ANON_KEY values, if still
 * present on a host, do not turn storage back on by themselves.
 */
export function reviewStorageExplicitlyEnabled(): boolean {
  return process.env.REVIEW_STORAGE_ENABLED === "1";
}

export function reviewBackend(): { url: string; anonKey: string } | null {
  if (!reviewStorageExplicitlyEnabled()) return null;
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

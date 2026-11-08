/**
 * Best-effort fixed window for ONE server instance.
 * This is weaker than a WAF. It is not shared across Vercel instances,
 * and it resets when the process cold-starts. It is not platform rate limiting.
 */
export const WINDOW_MS = 60_000;
export const AUTH_LIMIT = 10;
export const REVIEW_LIMIT = 30;
export const MAX_BUCKETS = 4096;

const IP = /^(?:\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/;

export function createFixedWindowLimiter(maxBuckets = MAX_BUCKETS) {
  const buckets = new Map();

  function evictOldest() {
    let oldestKey = "";
    let oldestStart = Infinity;
    for (const [key, bucket] of buckets) {
      if (bucket.start < oldestStart) {
        oldestStart = bucket.start;
        oldestKey = key;
      }
    }
    if (oldestKey) buckets.delete(oldestKey);
  }

  return {
    size() {
      return buckets.size;
    },
    take(key, limit, now = Date.now()) {
      const start = now - (now % WINDOW_MS);
      let bucket = buckets.get(key);
      if (!bucket || bucket.start !== start) {
        if (!bucket && buckets.size >= maxBuckets) evictOldest();
        bucket = { start, count: 0 };
        buckets.set(key, bucket);
      }
      bucket.count += 1;
      if (bucket.count > limit) {
        const retryAfter = Math.max(1, Math.ceil((start + WINDOW_MS - now) / 1000));
        return { ok: false, retryAfter };
      }
      return { ok: true, retryAfter: 0 };
    },
  };
}

export const instanceLimiter = createFixedWindowLimiter();

/**
 * First hop of x-forwarded-for only when this process is a Vercel deployment
 * (VERCEL=1 and VERCEL_ENV is preview or production). Vercel sets that header
 * at its edge. Off that context the header is ignored, because a local or
 * client-supplied chain is not treated as the caller identity. The fallback
 * key is shared by every request in that process.
 */
export function rateLimitIdentity(headers, env = process.env) {
  const onVercel =
    env.VERCEL === "1" && (env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "production");
  if (!onVercel) return "instance-default";
  const first = (headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ?? "";
  if (!first || first.includes(" ") || !IP.test(first)) return "vercel-unknown";
  return first;
}

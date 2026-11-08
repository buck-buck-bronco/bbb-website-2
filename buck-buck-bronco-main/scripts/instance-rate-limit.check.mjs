import assert from "node:assert/strict";
import {
  AUTH_LIMIT,
  REVIEW_LIMIT,
  WINDOW_MS,
  createFixedWindowLimiter,
  rateLimitIdentity,
} from "../src/lib/instance-rate-limit.mjs";

const limiter = createFixedWindowLimiter(3);
const now = 1_700_000_000_000;
for (let i = 0; i < AUTH_LIMIT; i += 1) {
  assert.equal(limiter.take("auth:synthetic", AUTH_LIMIT, now).ok, true);
}
const blocked = limiter.take("auth:synthetic", AUTH_LIMIT, now);
assert.equal(blocked.ok, false);
assert.ok(blocked.retryAfter >= 1 && blocked.retryAfter <= WINDOW_MS / 1000);
assert.equal(limiter.take("auth:synthetic", AUTH_LIMIT, now + WINDOW_MS).ok, true);

const review = createFixedWindowLimiter();
for (let i = 0; i < REVIEW_LIMIT; i += 1) {
  assert.equal(review.take("review:synthetic", REVIEW_LIMIT, now).ok, true);
}
assert.equal(review.take("review:synthetic", REVIEW_LIMIT, now).ok, false);

const capped = createFixedWindowLimiter(2);
assert.equal(capped.take("a", 10, now).ok, true);
assert.equal(capped.take("b", 10, now).ok, true);
assert.equal(capped.take("c", 10, now + 5).ok, true);
assert.equal(capped.size(), 2);

const forwarded = new Headers({ "x-forwarded-for": "192.0.2.10, 203.0.113.5" });
assert.equal(rateLimitIdentity(forwarded, {}), "instance-default");
assert.equal(
  rateLimitIdentity(forwarded, { VERCEL: "1", VERCEL_ENV: "preview" }),
  "192.0.2.10",
);
assert.equal(
  rateLimitIdentity(forwarded, { VERCEL: "1", VERCEL_ENV: "production" }),
  "192.0.2.10",
);
assert.equal(
  rateLimitIdentity(new Headers({ "x-forwarded-for": "not an ip" }), {
    VERCEL: "1",
    VERCEL_ENV: "preview",
  }),
  "vercel-unknown",
);

console.log("instance-rate-limit checks ok");

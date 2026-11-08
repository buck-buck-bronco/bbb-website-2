import { NextRequest, NextResponse } from "next/server";
import { AUTH_LIMIT, instanceLimiter, rateLimitIdentity } from "@/lib/instance-rate-limit.mjs";
import { bodyRejectionStatus, readBoundedBody } from "@/lib/read-bounded-body.mjs";
import { STAGING_COOKIE, hostnameOf, safeNextPath } from "@/lib/staging";
import {
  issueStagingSession,
  readStagingPassword,
  secretsMatch,
  stagingSecretsReady,
  stagingSessionMaxAge,
} from "@/lib/staging-session";

export const runtime = "nodejs";

const MAX_BODY = 4_000;

function privateNoStore(res: NextResponse) {
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

function tooMany(retryAfter: number) {
  const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
  res.headers.set("Retry-After", String(retryAfter));
  return privateNoStore(res);
}

function unauthorized() {
  return privateNoStore(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
}

function sameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  if (!host || !origin) return false;
  try {
    return new URL(origin).host === host && hostnameOf(host).length > 0;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const limit = instanceLimiter.take(
    `auth:${rateLimitIdentity(req.headers)}`,
    AUTH_LIMIT,
  );
  if (!limit.ok) return tooMany(limit.retryAfter);

  if (!sameOrigin(req)) return unauthorized();
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return privateNoStore(NextResponse.json({ error: "Invalid body" }, { status: 400 }));
  }

  const bounded = await readBoundedBody(req, MAX_BODY);
  if (!bounded.ok) {
    const status = bodyRejectionStatus(bounded.reason);
    const error = status === 413 ? "Payload too large" : "Invalid body";
    return privateNoStore(NextResponse.json({ error }, { status }));
  }
  const raw = bounded.text;
  if (typeof raw !== "string" || raw.length === 0) {
    return privateNoStore(NextResponse.json({ error: "Invalid body" }, { status: 400 }));
  }

  let body: { password?: unknown; next?: unknown };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return privateNoStore(NextResponse.json({ error: "Invalid body" }, { status: 400 }));
    }
    body = parsed as { password?: unknown; next?: unknown };
  } catch {
    return privateNoStore(NextResponse.json({ error: "Invalid body" }, { status: 400 }));
  }

  if (typeof body.password !== "string" || body.password.length === 0 || body.password.length > 200) {
    return unauthorized();
  }

  if (!stagingSecretsReady()) return unauthorized();

  const expected = readStagingPassword();
  if (!expected || !(await secretsMatch(body.password, expected))) {
    return unauthorized();
  }

  const token = await issueStagingSession();
  if (!token) return unauthorized();

  const next = safeNextPath(body.next);
  const res = NextResponse.json({ ok: true, next });
  res.cookies.set(STAGING_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: stagingSessionMaxAge,
  });
  return privateNoStore(res);
}

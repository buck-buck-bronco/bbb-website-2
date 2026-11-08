import { NextRequest, NextResponse } from "next/server";
import { STAGING_COOKIE, hostnameOf, safeNextPath } from "@/lib/staging";
import {
  issueStagingSession,
  readStagingPassword,
  secretsMatch,
  stagingSecretsReady,
  stagingSessionMaxAge,
} from "@/lib/staging-session";

const MAX_BODY = 4_000;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (!sameOrigin(req)) return unauthorized();
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let body: { password?: unknown; next?: unknown };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    body = parsed as { password?: unknown; next?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: stagingSessionMaxAge,
  });
  return res;
}

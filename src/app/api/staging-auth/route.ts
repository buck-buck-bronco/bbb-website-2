import { NextRequest, NextResponse } from "next/server";
import { STAGING_COOKIE, getStagingPassword } from "@/lib/staging";

const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export async function POST(req: NextRequest) {
  const expected = getStagingPassword();

  let body: { password?: string; next?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (body.password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const next =
    typeof body.next === "string" && body.next.startsWith("/")
      ? body.next
      : "/";

  const res = NextResponse.json({ ok: true, next });
  res.cookies.set(STAGING_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

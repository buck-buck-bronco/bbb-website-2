import { NextRequest, NextResponse } from "next/server";
import {
  STAGING_COOKIE,
  STAGING_GATE_PATH,
  getStagingPassword,
  stagingLockEnabled,
} from "@/lib/staging";

function isAuthed(req: NextRequest): boolean {
  const expected = getStagingPassword();
  return req.cookies.get(STAGING_COOKIE)?.value === expected;
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (!stagingLockEnabled(host)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (
    pathname === STAGING_GATE_PATH ||
    pathname.startsWith(`${STAGING_GATE_PATH}/`) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/api/staging-auth"
  ) {
    return NextResponse.next();
  }

  if (isAuthed(req)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = STAGING_GATE_PATH;
  url.searchParams.set("next", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

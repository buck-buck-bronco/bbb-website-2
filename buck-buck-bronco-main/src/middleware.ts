import { NextRequest, NextResponse } from "next/server";
import {
  STAGING_COOKIE,
  STAGING_GATE_PATH,
  getStagingPassword,
  isProductionHost,
  isReviewPath,
  stagingLockEnabled,
} from "@/lib/staging";

function isAuthed(req: NextRequest): boolean {
  const expected = getStagingPassword();
  return req.cookies.get(STAGING_COOKIE)?.value === expected;
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  if (isProductionHost(host)) {
    if (isReviewPath(pathname)) {
      const home = req.nextUrl.clone();
      home.pathname = "/";
      home.search = "";
      return NextResponse.redirect(home, 308);
    }
    if (pathname.startsWith("/api/review")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  if (!stagingLockEnabled(host)) {
    return NextResponse.next();
  }

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

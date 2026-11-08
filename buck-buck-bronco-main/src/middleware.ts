import { NextRequest, NextResponse } from "next/server";
import {
  STAGING_COOKIE,
  STAGING_GATE_PATH,
  hostnameOf,
  isProductionHost,
  isReviewPath,
  shouldNoindex,
  stagingLockEnabled,
} from "@/lib/staging";
import { stagingSessionValid } from "@/lib/staging-session";
import { isStagingGateExempt } from "@/lib/staging-gate-exempt.mjs";

/** Next 16.4.5 runs middleware on Edge unless this is set. Node is required for crypto.timingSafeEqual. */
export const runtime = "nodejs";

function withRobots(res: NextResponse, host: string) {
  if (shouldNoindex(host) || stagingLockEnabled(host)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
  }
  return res;
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  if (hostnameOf(host) === "www.buckbuckbronco.com") {
    const url = req.nextUrl.clone();
    url.hostname = "buckbuckbronco.com";
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

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
    return withRobots(NextResponse.next(), host);
  }

  if (isStagingGateExempt(pathname)) {
    return withRobots(NextResponse.next(), host);
  }

  const cookie = req.cookies.get(STAGING_COOKIE)?.value;
  if (await stagingSessionValid(cookie)) {
    return withRobots(NextResponse.next(), host);
  }

  const url = req.nextUrl.clone();
  url.pathname = STAGING_GATE_PATH;
  url.searchParams.set("next", pathname + req.nextUrl.search);
  return withRobots(NextResponse.redirect(url), host);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

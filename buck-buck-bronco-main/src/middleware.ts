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

/** Optimizer responses stay off a locked host, including a warm image cache. */
function lockedOptimizerDenied(host: string, pathname: string) {
  if (!stagingLockEnabled(host)) return null;
  if (pathname !== "/_next/image" && !pathname.startsWith("/_next/image/")) return null;
  const denied = new NextResponse(null, { status: 404 });
  denied.headers.set("Cache-Control", "private, no-store");
  denied.headers.set("X-Robots-Tag", "noindex, nofollow");
  denied.headers.set("Content-Type", "text/plain; charset=utf-8");
  return denied;
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

  const optimizerDenied = lockedOptimizerDenied(host, pathname);
  if (optimizerDenied) return optimizerDenied;

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
  matcher: ["/((?!_next/static).*)"],
};

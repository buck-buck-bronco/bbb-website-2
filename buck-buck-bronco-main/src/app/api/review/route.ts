import { NextRequest, NextResponse } from "next/server";
import { REVIEW_LIMIT, instanceLimiter, rateLimitIdentity } from "@/lib/instance-rate-limit.mjs";
import { reviewBackend } from "@/lib/review/config";
import { ReviewNotConfigured, createReviewEdit, listReviewEdits, updateReviewStatus } from "@/lib/review/store";
import { STAGING_COOKIE, isProductionHost } from "@/lib/staging";
import { stagingSessionValid } from "@/lib/staging-session";
import type { ReviewEditInput, ReviewKind, ReviewStatus } from "@/lib/review/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = new Set<ReviewKind>(["comment", "toggle", "image"]);
const STATUSES = new Set<ReviewStatus>(["open", "done", "dismissed"]);

function withPrivate(res: NextResponse) {
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

function notFound() {
  return withPrivate(NextResponse.json({ error: "Not found" }, { status: 404 }));
}

function tooMany(retryAfter: number) {
  const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
  res.headers.set("Retry-After", String(retryAfter));
  return withPrivate(res);
}

function withinReviewLimit(req: NextRequest) {
  const limit = instanceLimiter.take(
    `review:${rateLimitIdentity(req.headers)}`,
    REVIEW_LIMIT,
  );
  return limit.ok ? null : tooMany(limit.retryAfter);
}

function unavailable() {
  return withPrivate(NextResponse.json({ error: "Not available" }, { status: 503 }));
}

async function reviewAllowed(req: NextRequest): Promise<boolean> {
  const host = req.headers.get("host") ?? "";
  if (isProductionHost(host)) return false;
  if (!reviewBackend()) return false;
  return stagingSessionValid(req.cookies.get(STAGING_COOKIE)?.value);
}

function storeFailure(error: unknown) {
  if (error instanceof ReviewNotConfigured) return notFound();
  return unavailable();
}

export async function GET(req: NextRequest) {
  const limited = withinReviewLimit(req);
  if (limited) return limited;
  if (!(await reviewAllowed(req))) return notFound();
  try {
    const edits = await listReviewEdits();
    return NextResponse.json({ edits });
  } catch (error) {
    return storeFailure(error);
  }
}

export async function POST(req: NextRequest) {
  const limited = withinReviewLimit(req);
  if (limited) return limited;
  if (!(await reviewAllowed(req))) return notFound();
  let body: Partial<ReviewEditInput>;
  try {
    body = (await req.json()) as Partial<ReviewEditInput>;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  try {
    if (!body.author_name?.trim() || !body.page_path || !body.element_id || !body.kind) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!KINDS.has(body.kind)) {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }
    if (body.kind === "comment" && !body.comment_text?.trim()) {
      return NextResponse.json({ error: "Comment text required" }, { status: 400 });
    }
    if (body.kind === "image" && !body.image_url?.trim()) {
      return NextResponse.json({ error: "Image URL or upload required" }, { status: 400 });
    }

    const edit = await createReviewEdit({
      author_name: body.author_name,
      page_path: body.page_path,
      element_id: body.element_id,
      element_label: body.element_label ?? body.element_id,
      kind: body.kind,
      comment_text: body.comment_text,
      enabled: body.enabled,
      image_url: body.image_url,
      meta: body.meta,
    });

    return NextResponse.json({ edit }, { status: 201 });
  } catch (error) {
    return storeFailure(error);
  }
}

export async function PATCH(req: NextRequest) {
  const limited = withinReviewLimit(req);
  if (limited) return limited;
  if (!(await reviewAllowed(req))) return notFound();
  let body: { id?: string; status?: ReviewStatus };
  try {
    body = (await req.json()) as { id?: string; status?: ReviewStatus };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  try {
    if (!body.id || !body.status || !STATUSES.has(body.status)) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    const edit = await updateReviewStatus(body.id, body.status);
    return NextResponse.json({ edit });
  } catch (error) {
    return storeFailure(error);
  }
}

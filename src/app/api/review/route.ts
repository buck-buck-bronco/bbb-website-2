import { NextResponse } from "next/server";
import {
  createReviewEdit,
  listReviewEdits,
  updateReviewStatus,
} from "@/lib/review/store";
import type { ReviewEditInput, ReviewKind, ReviewStatus } from "@/lib/review/types";

export const dynamic = "force-dynamic";

const KINDS = new Set<ReviewKind>(["comment", "toggle", "image"]);
const STATUSES = new Set<ReviewStatus>(["open", "done", "dismissed"]);

export async function GET() {
  try {
    const edits = await listReviewEdits();
    return NextResponse.json({ edits });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Load failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ReviewEditInput>;
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; status?: ReviewStatus };
    if (!body.id || !body.status || !STATUSES.has(body.status)) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    const edit = await updateReviewStatus(body.id, body.status);
    return NextResponse.json({ edit });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
}

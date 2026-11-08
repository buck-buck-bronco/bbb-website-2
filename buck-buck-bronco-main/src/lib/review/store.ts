import { REVIEW_TABLE, reviewBackend } from "@/lib/review/config";
import type { ReviewEdit, ReviewEditInput, ReviewStatus } from "@/lib/review/types";

export class ReviewNotConfigured extends Error {
  constructor() {
    super("Review storage is not configured");
  }
}

function backendOrThrow() {
  const backend = reviewBackend();
  if (!backend) throw new ReviewNotConfigured();
  return backend;
}

function headersFor(anonKey: string) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export async function listReviewEdits(): Promise<ReviewEdit[]> {
  const backend = backendOrThrow();
  const res = await fetch(
    `${backend.url}/rest/v1/${REVIEW_TABLE}?select=*&order=created_at.desc`,
    { headers: headersFor(backend.anonKey), cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to load review edits");
  return (await res.json()) as ReviewEdit[];
}

export async function createReviewEdit(input: ReviewEditInput): Promise<ReviewEdit> {
  const backend = backendOrThrow();
  const payload = {
    author_name: input.author_name.trim(),
    page_path: input.page_path,
    element_id: input.element_id,
    element_label: input.element_label,
    kind: input.kind,
    comment_text: input.comment_text?.trim() ?? "",
    enabled: input.enabled ?? null,
    image_url: input.image_url ?? null,
    meta: input.meta ?? {},
  };

  const res = await fetch(`${backend.url}/rest/v1/${REVIEW_TABLE}`, {
    method: "POST",
    headers: headersFor(backend.anonKey),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save edit");
  const rows = (await res.json()) as ReviewEdit[];
  return rows[0];
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<ReviewEdit> {
  const backend = backendOrThrow();
  const res = await fetch(
    `${backend.url}/rest/v1/${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: headersFor(backend.anonKey),
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) throw new Error("Failed to update status");
  const rows = (await res.json()) as ReviewEdit[];
  return rows[0];
}

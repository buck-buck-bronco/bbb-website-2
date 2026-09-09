import { REVIEW_TABLE, reviewSupabase } from "@/lib/review/config";
import type { ReviewEdit, ReviewEditInput, ReviewStatus } from "@/lib/review/types";

const headers = {
  apikey: reviewSupabase.anonKey,
  Authorization: `Bearer ${reviewSupabase.anonKey}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

export async function listReviewEdits(): Promise<ReviewEdit[]> {
  const res = await fetch(
    `${reviewSupabase.url}/rest/v1/${REVIEW_TABLE}?select=*&order=created_at.desc`,
    {
      headers,
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to load review edits (${res.status})`);
  }
  return (await res.json()) as ReviewEdit[];
}

export async function createReviewEdit(
  input: ReviewEditInput,
): Promise<ReviewEdit> {
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

  const res = await fetch(`${reviewSupabase.url}/rest/v1/${REVIEW_TABLE}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Failed to save edit (${res.status})`);
  }

  const rows = (await res.json()) as ReviewEdit[];
  return rows[0];
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<ReviewEdit> {
  const res = await fetch(
    `${reviewSupabase.url}/rest/v1/${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to update status (${res.status})`);
  }
  const rows = (await res.json()) as ReviewEdit[];
  return rows[0];
}

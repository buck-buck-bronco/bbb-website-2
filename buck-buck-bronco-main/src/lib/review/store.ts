import { REVIEW_TABLE, reviewSupabase } from "@/lib/review/config";
import type { ReviewEdit, ReviewEditInput, ReviewStatus } from "@/lib/review/types";

const headers = {
  apikey: reviewSupabase.anonKey,
  Authorization: `Bearer ${reviewSupabase.anonKey}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

function explainFetchFailure(error: unknown): string {
  if (error instanceof Error && error.message) {
    if (/fetch failed|Failed to fetch|NetworkError|ENOTFOUND|ECONNREFUSED/i.test(error.message)) {
      return "Review database is unreachable right now. Your edit was kept on this device and will retry.";
    }
    return error.message;
  }
  return "Review database request failed";
}

async function supabaseFetch(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${reviewSupabase.url}/rest/v1/${path}`, {
      ...init,
      headers: {
        ...headers,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch (error) {
    throw new Error(explainFetchFailure(error));
  }
}

export async function listReviewEdits(): Promise<ReviewEdit[]> {
  const res = await supabaseFetch(
    `${REVIEW_TABLE}?select=*&order=created_at.desc`,
  );
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Failed to load review edits (${res.status})`);
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

  const res = await supabaseFetch(REVIEW_TABLE, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Failed to save edit (${res.status})`);
  }

  const rows = (await res.json()) as ReviewEdit[];
  const created = rows[0];
  if (!created?.id) {
    throw new Error("Save did not return a confirmed edit id");
  }

  // Confirm the row is actually readable before telling the reviewer it stuck.
  const confirm = await supabaseFetch(
    `${REVIEW_TABLE}?id=eq.${encodeURIComponent(created.id)}&select=*`,
  );
  if (!confirm.ok) {
    throw new Error(`Saved edit could not be confirmed (${confirm.status})`);
  }
  const confirmed = (await confirm.json()) as ReviewEdit[];
  if (!confirmed[0]?.id) {
    throw new Error("Saved edit could not be confirmed in the inbox");
  }
  return confirmed[0];
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<ReviewEdit> {
  const res = await supabaseFetch(
    `${REVIEW_TABLE}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to update status (${res.status})`);
  }
  const rows = (await res.json()) as ReviewEdit[];
  if (!rows[0]?.id) {
    throw new Error("Status update did not return the edit");
  }
  return rows[0];
}

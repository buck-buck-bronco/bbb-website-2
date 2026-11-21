import type { ReviewEdit, ReviewEditInput } from "@/lib/review/types";

const QUEUE_KEY = "bbb-review-pending-edits";
const MIRROR_KEY = "bbb-review-confirmed-edits";

export type PendingReviewEdit = ReviewEditInput & {
  local_id: string;
  queued_at: string;
  attempts: number;
  last_error?: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listPendingReviewEdits(): PendingReviewEdit[] {
  return readJson<PendingReviewEdit[]>(QUEUE_KEY, []);
}

export function enqueuePendingReviewEdit(
  input: ReviewEditInput,
  lastError?: string,
): PendingReviewEdit {
  const pending: PendingReviewEdit = {
    ...input,
    local_id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    queued_at: new Date().toISOString(),
    attempts: 0,
    last_error: lastError,
  };
  const next = [...listPendingReviewEdits(), pending];
  writeJson(QUEUE_KEY, next);
  return pending;
}

export function updatePendingReviewEdit(
  localId: string,
  patch: Partial<Pick<PendingReviewEdit, "attempts" | "last_error">>,
) {
  const next = listPendingReviewEdits().map((item) =>
    item.local_id === localId ? { ...item, ...patch } : item,
  );
  writeJson(QUEUE_KEY, next);
}

export function removePendingReviewEdit(localId: string) {
  writeJson(
    QUEUE_KEY,
    listPendingReviewEdits().filter((item) => item.local_id !== localId),
  );
}

export function mirrorConfirmedEdit(edit: ReviewEdit) {
  const existing = listMirroredEdits().filter((item) => item.id !== edit.id);
  writeJson(MIRROR_KEY, [edit, ...existing].slice(0, 200));
}

export function listMirroredEdits(): ReviewEdit[] {
  return readJson<ReviewEdit[]>(MIRROR_KEY, []);
}

export function pendingAsReviewEdit(pending: PendingReviewEdit): ReviewEdit {
  return {
    id: `pending:${pending.local_id}`,
    created_at: pending.queued_at,
    author_name: pending.author_name,
    page_path: pending.page_path,
    element_id: pending.element_id,
    element_label: pending.element_label,
    kind: pending.kind,
    comment_text: pending.comment_text ?? "",
    enabled: pending.enabled ?? null,
    image_url: pending.image_url ?? null,
    status: "open",
    meta: {
      ...(pending.meta ?? {}),
      pending_sync: true,
      last_error: pending.last_error ?? null,
    },
  };
}

export function mergeEditsForDisplay(
  serverEdits: ReviewEdit[],
  pending: PendingReviewEdit[],
): ReviewEdit[] {
  const mirrored = listMirroredEdits();
  const byId = new Map<string, ReviewEdit>();
  for (const edit of mirrored) byId.set(edit.id, edit);
  for (const edit of serverEdits) byId.set(edit.id, edit);
  const pendingRows = pending.map(pendingAsReviewEdit);
  return [...pendingRows, ...Array.from(byId.values())].sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1,
  );
}

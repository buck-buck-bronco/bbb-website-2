import {
  enqueuePendingReviewEdit,
  listMirroredEdits,
  listPendingReviewEdits,
  mergeEditsForDisplay,
  mirrorConfirmedEdit,
  removePendingReviewEdit,
  updatePendingReviewEdit,
  type PendingReviewEdit,
} from "@/lib/review/local-queue";
import type { ReviewEdit, ReviewEditInput, ReviewStatus } from "@/lib/review/types";

async function readError(res: Response): Promise<string> {
  const err = (await res.json().catch(() => null)) as { error?: string } | null;
  return err?.error || `Request failed (${res.status})`;
}

export async function fetchReviewEdits(): Promise<ReviewEdit[]> {
  let serverEdits: ReviewEdit[] = [];
  try {
    const res = await fetch("/api/review", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(await readError(res));
    }
    const data = (await res.json()) as { edits: ReviewEdit[] };
    serverEdits = data.edits ?? [];
    for (const edit of serverEdits) mirrorConfirmedEdit(edit);
  } catch (error) {
    // Fall back to the on-device mirror so the inbox never looks empty after a outage.
    serverEdits = listMirroredEdits();
    if (!serverEdits.length) {
      throw error instanceof Error ? error : new Error("Could not load review edits");
    }
  }

  await flushPendingReviewEdits();
  return mergeEditsForDisplay(serverEdits, listPendingReviewEdits());
}

export async function postReviewEdit(
  input: ReviewEditInput,
): Promise<{ edit: ReviewEdit; synced: boolean }> {
  try {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(await readError(res));
    }
    const data = (await res.json()) as { edit: ReviewEdit };
    if (!data.edit?.id) {
      throw new Error("Server did not confirm the saved edit");
    }
    mirrorConfirmedEdit(data.edit);
    return { edit: data.edit, synced: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save edit";
    const pending = enqueuePendingReviewEdit(input, message);
    // Keep the reviewer's work even when the network/DB is down.
    return {
      edit: {
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
          pending_sync: true,
          last_error: message,
        },
      },
      synced: false,
    };
  }
}

export async function flushPendingReviewEdits(): Promise<{
  synced: number;
  remaining: number;
}> {
  const pending = listPendingReviewEdits();
  let synced = 0;
  for (const item of pending) {
    const ok = await flushOnePending(item);
    if (ok) synced += 1;
  }
  return { synced, remaining: listPendingReviewEdits().length };
}

async function flushOnePending(item: PendingReviewEdit): Promise<boolean> {
  try {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author_name: item.author_name,
        page_path: item.page_path,
        element_id: item.element_id,
        element_label: item.element_label,
        kind: item.kind,
        comment_text: item.comment_text,
        enabled: item.enabled,
        image_url: item.image_url,
        meta: {
          ...(item.meta ?? {}),
          queued_at: item.queued_at,
          local_id: item.local_id,
        },
      } satisfies ReviewEditInput),
    });
    if (!res.ok) {
      updatePendingReviewEdit(item.local_id, {
        attempts: item.attempts + 1,
        last_error: await readError(res),
      });
      return false;
    }
    const data = (await res.json()) as { edit: ReviewEdit };
    if (!data.edit?.id) {
      updatePendingReviewEdit(item.local_id, {
        attempts: item.attempts + 1,
        last_error: "Server did not confirm the saved edit",
      });
      return false;
    }
    mirrorConfirmedEdit(data.edit);
    removePendingReviewEdit(item.local_id);
    return true;
  } catch (error) {
    updatePendingReviewEdit(item.local_id, {
      attempts: item.attempts + 1,
      last_error: error instanceof Error ? error.message : "Sync failed",
    });
    return false;
  }
}

export async function patchReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<ReviewEdit> {
  if (id.startsWith("pending:")) {
    throw new Error("This edit is still syncing. Wait for it to reach the shared inbox first.");
  }
  const res = await fetch("/api/review", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) {
    throw new Error(await readError(res));
  }
  const data = (await res.json()) as { edit: ReviewEdit };
  if (!data.edit?.id) {
    throw new Error("Status update was not confirmed");
  }
  mirrorConfirmedEdit(data.edit);
  return data.edit;
}

const AUTHOR_KEY = "bbb-review-author";

export function getSavedAuthor(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTHOR_KEY) ?? "";
}

export function saveAuthor(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTHOR_KEY, name.trim());
}

/** Compress image file to a JPEG data URL under ~900KB. */
export function fileToReviewDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        let quality = 0.82;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > 900_000 && quality > 0.4) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        if (dataUrl.length > 1_800_000) {
          reject(new Error("Image is still too large after compress. Try a smaller photo."));
          return;
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Invalid image"));
    };
    reader.readAsDataURL(file);
  });
}

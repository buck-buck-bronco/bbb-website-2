import type { ReviewEdit, ReviewEditInput, ReviewStatus } from "@/lib/review/types";

export async function fetchReviewEdits(): Promise<ReviewEdit[]> {
  const res = await fetch("/api/review", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not load review edits");
  }
  const data = (await res.json()) as { edits: ReviewEdit[] };
  return data.edits;
}

export async function postReviewEdit(
  input: ReviewEditInput,
): Promise<ReviewEdit> {
  const res = await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error || "Could not save edit");
  }
  const data = (await res.json()) as { edit: ReviewEdit };
  return data.edit;
}

export async function patchReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<ReviewEdit> {
  const res = await fetch("/api/review", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) {
    throw new Error("Could not update status");
  }
  const data = (await res.json()) as { edit: ReviewEdit };
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
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

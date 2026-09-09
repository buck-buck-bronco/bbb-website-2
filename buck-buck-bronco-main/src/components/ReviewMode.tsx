"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  fetchReviewEdits,
  fileToReviewDataUrl,
  getSavedAuthor,
  postReviewEdit,
  saveAuthor,
} from "@/lib/review/client";
import type { ReviewEdit } from "@/lib/review/types";

type TargetInfo = {
  id: string;
  label: string;
  el: HTMLElement;
  isImage: boolean;
};

function findReviewTarget(node: EventTarget | null): TargetInfo | null {
  if (!(node instanceof Element)) return null;
  const host = node.closest<HTMLElement>("[data-review-id]");
  if (!host) return null;
  const id = host.dataset.reviewId;
  if (!id) return null;
  return {
    id,
    label: host.dataset.reviewLabel || id,
    el: host,
    isImage: host.dataset.reviewKind === "image",
  };
}

function applyLiveOverlays(edits: ReviewEdit[], pagePath: string) {
  const pageEdits = edits.filter(
    (e) => e.page_path === pagePath && e.status === "open",
  );

  document.querySelectorAll<HTMLElement>("[data-review-id]").forEach((el) => {
    el.classList.remove("review-target--off");
    el.style.removeProperty("--review-image-override");
    const img = el.querySelector("img");
    if (img && img.dataset.reviewOriginalSrc) {
      img.src = img.dataset.reviewOriginalSrc;
      delete img.dataset.reviewOriginalSrc;
    }
  });

  const toggles = new Map<string, boolean>();
  const images = new Map<string, string>();

  for (const edit of pageEdits) {
    if (edit.kind === "toggle" && typeof edit.enabled === "boolean") {
      toggles.set(edit.element_id, edit.enabled);
    }
    if (edit.kind === "image" && edit.image_url) {
      images.set(edit.element_id, edit.image_url);
    }
  }

  for (const [id, enabled] of toggles) {
    const el = document.querySelector<HTMLElement>(`[data-review-id="${CSS.escape(id)}"]`);
    if (!el) continue;
    el.classList.toggle("review-target--off", !enabled);
  }

  for (const [id, url] of images) {
    const el = document.querySelector<HTMLElement>(`[data-review-id="${CSS.escape(id)}"]`);
    if (!el) continue;
    const img = el.querySelector("img");
    if (img) {
      if (!img.dataset.reviewOriginalSrc) {
        img.dataset.reviewOriginalSrc = img.currentSrc || img.src;
      }
      img.src = url;
    } else {
      el.style.setProperty("--review-image-override", `url("${url.replace(/"/g, '\\"')}")`);
      el.classList.add("review-target--image-override");
    }
  }
}

export function ReviewMode() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [picking, setPicking] = useState(false);
  const [author, setAuthor] = useState("");
  const [selected, setSelected] = useState<TargetInfo | null>(null);
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keepEnabled, setKeepEnabled] = useState(true);
  const [edits, setEdits] = useState<ReviewEdit[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isReviewPage = pathname === "/review";

  const openCount = useMemo(
    () => edits.filter((e) => e.status === "open").length,
    [edits],
  );

  const refresh = useEffectEvent(async () => {
    try {
      const next = await fetchReviewEdits();
      setEdits(next);
      applyLiveOverlays(next, pathname);
    } catch {
      /* staging still usable offline for picking UI */
    }
  });

  useEffect(() => {
    setAuthor(getSavedAuthor());
    const params = new URLSearchParams(window.location.search);
    if (params.get("review") === "1" || params.get("staging") === "1") {
      setEnabled(true);
      setPicking(true);
    }
    void refresh();
  }, [pathname]);

  useEffect(() => {
    if (!picking || !enabled || isReviewPage) return;

    const onClick = (event: MouseEvent) => {
      const target = findReviewTarget(event.target);
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      setSelected(target);
      setComment("");
      setImageUrl("");
      setKeepEnabled(!target.el.classList.contains("review-target--off"));
      setMessage(null);
      setError(null);
    };

    const onMove = (event: MouseEvent) => {
      document.querySelectorAll(".review-target--hover").forEach((n) => {
        n.classList.remove("review-target--hover");
      });
      const target = findReviewTarget(event.target);
      target?.el.classList.add("review-target--hover");
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mousemove", onMove, true);
    document.body.classList.add("review-picking");

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mousemove", onMove, true);
      document.body.classList.remove("review-picking");
      document.querySelectorAll(".review-target--hover").forEach((n) => {
        n.classList.remove("review-target--hover");
      });
    };
  }, [picking, enabled, isReviewPage]);

  const submit = useCallback(
    (kind: "comment" | "toggle" | "image") => {
      if (!selected) return;
      const name = author.trim();
      if (!name) {
        setError("Add your name so Damien knows who left the note.");
        return;
      }
      saveAuthor(name);
      setError(null);

      startTransition(async () => {
        try {
          await postReviewEdit({
            author_name: name,
            page_path: pathname,
            element_id: selected.id,
            element_label: selected.label,
            kind,
            comment_text:
              kind === "comment"
                ? comment
                : kind === "toggle"
                  ? keepEnabled
                    ? "Keep this"
                    : "Remove / hide this"
                  : comment || "Image update",
            enabled: kind === "toggle" ? keepEnabled : null,
            image_url: kind === "image" ? imageUrl.trim() : null,
          });
          setMessage(
            kind === "comment"
              ? "Comment saved. Open Your edits anytime to see everything you submitted."
              : kind === "toggle"
                ? "Preference saved."
                : "Picture update saved.",
          );
          setSelected(null);
          await refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Save failed");
        }
      });
    },
    [author, comment, imageUrl, keepEnabled, pathname, selected],
  );

  const onFile = async (file: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await fileToReviewDataUrl(file);
      setImageUrl(dataUrl);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  if (isReviewPage) return null;

  return (
    <>
      <div className="review-dock" role="region" aria-label="Staging review tools">
        <button
          type="button"
          className={`review-dock__toggle ${enabled ? "is-on" : ""}`}
          onClick={() => {
            setEnabled((v) => !v);
            setPicking(true);
          }}
        >
          {enabled ? "Review on" : "Review off"}
        </button>
        {enabled ? (
          <button
            type="button"
            className={`review-dock__btn ${picking ? "is-active" : ""}`}
            onClick={() => setPicking((v) => !v)}
          >
            {picking ? "Picking…" : "Pick element"}
          </button>
        ) : null}
        <Link href="/review" className="review-dock__link review-dock__link--edits">
          Your edits{openCount ? ` (${openCount})` : ""}
        </Link>
      </div>

      {enabled && picking ? (
        <p className="review-hint">
          Click a highlighted block to comment, turn it on/off, or change its picture.
        </p>
      ) : null}

      {selected ? (
        <div className="review-panel" role="dialog" aria-label="Leave feedback">
          <div className="review-panel__head">
            <div>
              <p className="review-panel__kicker">Selected</p>
              <h2 className="review-panel__title">{selected.label}</h2>
            </div>
            <button
              type="button"
              className="review-panel__close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>

          <label className="review-field">
            <span>Your name</span>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Sam"
              autoComplete="name"
            />
          </label>

          <label className="review-field">
            <span>Comment for Damien</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="What should change here?"
            />
          </label>

          <div className="review-panel__actions">
            <button
              type="button"
              className="btn-cta btn-cta--sm"
              disabled={pending}
              onClick={() => submit("comment")}
            >
              Save comment
            </button>
          </div>

          <div className="review-panel__block">
            <p className="review-panel__kicker">Keep or hide</p>
            <label className="review-check">
              <input
                type="checkbox"
                checked={keepEnabled}
                onChange={(e) => setKeepEnabled(e.target.checked)}
              />
              <span>Keep this on the site</span>
            </label>
            <button
              type="button"
              className="review-dock__btn"
              disabled={pending}
              onClick={() => submit("toggle")}
            >
              Save keep/hide
            </button>
          </div>

          {selected.isImage ? (
            <div className="review-panel__block">
              <p className="review-panel__kicker">Change picture</p>
              <label className="review-field">
                <span>Paste image URL</span>
                <input
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              <label className="review-field">
                <span>Or upload a photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Preview" className="review-preview" />
              ) : null}
              <button
                type="button"
                className="btn-cta btn-cta--sm"
                disabled={pending || !imageUrl.trim()}
                onClick={() => submit("image")}
              >
                Save picture change
              </button>
            </div>
          ) : null}

          {message ? <p className="review-ok">{message}</p> : null}
          {error ? <p className="review-err">{error}</p> : null}
        </div>
      ) : null}
    </>
  );
}

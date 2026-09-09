"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { fetchReviewEdits, patchReviewStatus } from "@/lib/review/client";
import type { ReviewEdit, ReviewStatus } from "@/lib/review/types";

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function kindLabel(kind: ReviewEdit["kind"]) {
  if (kind === "comment") return "Comment";
  if (kind === "toggle") return "Keep / hide";
  return "Picture";
}

export function ReviewInbox() {
  const [edits, setEdits] = useState<ReviewEdit[]>([]);
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      try {
        setError(null);
        setEdits(await fetchReviewEdits());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Load failed");
      }
    });
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return edits;
    return edits.filter((e) => e.status === "open");
  }, [edits, filter]);

  const setStatus = (id: string, status: ReviewStatus) => {
    startTransition(async () => {
      try {
        const updated = await patchReviewStatus(id, status);
        setEdits((prev) => prev.map((e) => (e.id === id ? updated : e)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Update failed");
      }
    });
  };

  return (
    <div className="review-inbox">
      <header className="review-inbox__hero">
        <p className="section__kicker">Staging review</p>
        <h1 className="section__title">Your edits</h1>
        <p className="section__lede">
          Everything you submitted while reviewing: comments, keep/hide choices,
          and picture swaps. Damien uses this same inbox to apply changes to the
          live staging site.
        </p>
        <p className="review-inbox__hint">
          Tip: open any page with <code>?review=1</code> to turn the picker on,
          then use <strong>Your edits</strong> in the header or bottom dock to
          come back here.
        </p>
        <div className="review-inbox__toolbar">
          <button
            type="button"
            className={filter === "open" ? "review-dock__btn is-active" : "review-dock__btn"}
            onClick={() => setFilter("open")}
          >
            Open ({edits.filter((e) => e.status === "open").length})
          </button>
          <button
            type="button"
            className={filter === "all" ? "review-dock__btn is-active" : "review-dock__btn"}
            onClick={() => setFilter("all")}
          >
            All ({edits.length})
          </button>
          <button type="button" className="review-dock__btn" onClick={load} disabled={pending}>
            Refresh
          </button>
          <Link href="/?review=1" className="btn-cta btn-cta--sm">
            Back to site picker
          </Link>
        </div>
      </header>

      {error ? <p className="review-err">{error}</p> : null}

      {visible.length === 0 ? (
        <p className="review-inbox__empty">
          No edits yet. Open any page, turn Review on, and click a highlighted block.
        </p>
      ) : (
        <ul className="review-inbox__list">
          {visible.map((edit) => (
            <li key={edit.id} className="review-inbox__item">
              <div className="review-inbox__meta">
                <span className="review-pill">{kindLabel(edit.kind)}</span>
                <span className="review-pill review-pill--muted">{edit.status}</span>
                <span>{formatWhen(edit.created_at)}</span>
              </div>
              <h2>{edit.element_label}</h2>
              <p className="review-inbox__by">
                {edit.author_name} · {edit.page_path} ·{" "}
                <code>{edit.element_id}</code>
              </p>
              {edit.comment_text ? <p className="review-inbox__body">{edit.comment_text}</p> : null}
              {edit.kind === "toggle" ? (
                <p className="review-inbox__body">
                  Preference: {edit.enabled ? "Keep on site" : "Hide / remove"}
                </p>
              ) : null}
              {edit.kind === "image" && edit.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={edit.image_url} alt="Suggested replacement" className="review-preview" />
              ) : null}
              {edit.status === "open" ? (
                <div className="review-inbox__actions">
                  <button
                    type="button"
                    className="btn-cta btn-cta--sm"
                    disabled={pending}
                    onClick={() => setStatus(edit.id, "done")}
                  >
                    Mark done
                  </button>
                  <button
                    type="button"
                    className="review-dock__btn"
                    disabled={pending}
                    onClick={() => setStatus(edit.id, "dismissed")}
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

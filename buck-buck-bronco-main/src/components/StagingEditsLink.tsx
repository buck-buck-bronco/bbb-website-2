"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isReviewUiEnabled } from "@/lib/staging";

function subscribeNoop() {
  return () => {};
}

function getShowEdits() {
  return isReviewUiEnabled(window.location.host, window.location.search);
}

/** Staging-only chrome so Melissa can open her feedback inbox. Hidden on the live site. */
export function StagingEditsLink({
  className = "site-nav__edits",
  label = "See all reviews",
}: {
  className?: string;
  label?: string;
}) {
  const show = useSyncExternalStore(subscribeNoop, getShowEdits, () => false);

  if (!show) return null;

  return (
    <Link href="/review" className={className} aria-label="Open your staging edits inbox">
      {label}
    </Link>
  );
}

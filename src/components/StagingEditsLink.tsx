"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isStagingHost } from "@/lib/staging";

function subscribeNoop() {
  return () => {};
}

function getShowEdits() {
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const forced =
    params.get("review") === "1" ||
    params.get("staging") === "1" ||
    process.env.NEXT_PUBLIC_STAGING_LOCK === "1";
  return forced || isStagingHost(host) || host === "localhost";
}

/** Always-visible staging chrome so Melissa can open her feedback inbox. */
export function StagingEditsLink({
  className = "site-nav__edits",
  label = "Your edits",
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

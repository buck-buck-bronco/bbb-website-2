"use client";

import { useEffect, useState, type ComponentType } from "react";
import { isReviewUiEnabled } from "@/lib/staging";

/** Loads the staging editor only off the public domain — no dock JS on production. */
export function ReviewGate() {
  const [Editor, setEditor] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!isReviewUiEnabled(window.location.host)) return;
    let cancelled = false;
    void import("./ReviewMode").then((mod) => {
      if (!cancelled) setEditor(() => mod.ReviewMode);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Editor) return null;
  return <Editor />;
}

"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

/**
 * The optimizer fetches a local image with empty headers, so the staging
 * gate redirects that callback. A non-secret lock cookie, set only while
 * the gate is on, tells the browser to request the original path instead.
 * That request carries the session cookie. Customer hosts never get the
 * cookie, so they keep the optimizer. Image paths stay behind the gate.
 */
const LOCK_COOKIE = "bbb_staging_lock=1";

export function SiteImage({ alt = "", ...props }: ImageProps) {
  const [direct, setDirect] = useState(false);

  useEffect(() => {
    const locked = document.cookie.split("; ").includes(LOCK_COOKIE);
    setDirect(locked);
  }, []);

  return <Image {...props} alt={alt} unoptimized={direct} />;
}

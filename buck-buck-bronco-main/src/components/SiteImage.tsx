import Image, { type ImageProps } from "next/image";
import { headers } from "next/headers";
import { stagingLockEnabled } from "@/lib/staging";

/**
 * The image optimizer loads a local file by calling back into this server
 * with an empty header set, so it does not send the staging session cookie.
 * While the lock is on, that callback is redirected and the photo fails.
 * Unoptimized delivery lets the browser request the same path with the cookie.
 * Customer hosts stay on the optimizer. Image paths are not added to the gate allowlist.
 */
export async function SiteImage(props: ImageProps) {
  const host = (await headers()).get("host") ?? "";
  return <Image {...props} unoptimized={stagingLockEnabled(host)} />;
}

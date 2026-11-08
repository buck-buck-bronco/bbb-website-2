import { Suspense } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { GateClient } from "./GateClient";

export const metadata: Metadata = pageMetadata({
  title: "Staging gate",
  description:
    "Password gate for the private Buck Buck Bronco staging site. This page is not part of the public site.",
  path: "/staging-gate",
  index: false,
});

export default function StagingGatePage() {
  return (
    <Suspense
      fallback={
        <div className="gate">
          <p className="gate__lede">Loading…</p>
        </div>
      }
    >
      <GateClient />
    </Suspense>
  );
}

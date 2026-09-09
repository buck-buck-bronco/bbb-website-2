import { Suspense } from "react";
import type { Metadata } from "next";
import { GateClient } from "./GateClient";

export const metadata: Metadata = {
  title: "Staging gate",
  robots: { index: false, follow: false },
};

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

import type { Metadata } from "next";
import { ReviewInbox } from "@/components/ReviewInbox";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Your edits",
  description:
    "Staging inbox for Buck Buck Bronco review notes. This page is not part of the public site.",
  path: "/review",
  index: false,
});

export default function ReviewPage() {
  return <ReviewInbox />;
}

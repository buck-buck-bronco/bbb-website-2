import type { Metadata } from "next";
import { ReviewInbox } from "@/components/ReviewInbox";

export const metadata: Metadata = {
  title: "Your edits",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewInbox />;
}

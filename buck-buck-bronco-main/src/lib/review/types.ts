export type ReviewKind = "comment" | "toggle" | "image";
export type ReviewStatus = "open" | "done" | "dismissed";

export type ReviewEdit = {
  id: string;
  created_at: string;
  author_name: string;
  page_path: string;
  element_id: string;
  element_label: string;
  kind: ReviewKind;
  comment_text: string;
  enabled: boolean | null;
  image_url: string | null;
  status: ReviewStatus;
  meta: Record<string, unknown>;
};

export type ReviewEditInput = {
  author_name: string;
  page_path: string;
  element_id: string;
  element_label: string;
  kind: ReviewKind;
  comment_text?: string;
  enabled?: boolean | null;
  image_url?: string | null;
  meta?: Record<string, unknown>;
};

export type ReviewTarget = {
  id: string;
  label: string;
  kind: "copy" | "section" | "image" | "cta";
};

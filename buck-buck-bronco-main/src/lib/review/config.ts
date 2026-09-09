/** Publishable Supabase project for staging review sync (anon key is public by design). */
export const reviewSupabase = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://pwhzlwhbyssnuwrjsand.supabase.co",
  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aHpsd2hieXNzbnV3cmpzYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MzU5MjIsImV4cCI6MjEwMzAxMTkyMn0.gY2smjXXoLbSJkIxY46Vdm7Uxvm7i29zMTiptGnwubE",
} as const;

export const REVIEW_TABLE = "bbb_review_edits";

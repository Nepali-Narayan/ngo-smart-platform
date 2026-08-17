import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).single();
  return data;
}

export async function getPublished(table: "programs" | "projects" | "posts", limit = 50) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("status", "published").order("created_at", { ascending: false }).limit(limit);
  return data ?? [];
}

export async function getPublishedBySlug(table: "pages" | "programs" | "projects" | "posts", slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("slug", slug).eq("status", "published").single();
  return data;
}

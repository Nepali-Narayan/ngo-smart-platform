 "use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedTables = new Set([
  "pages", "programs", "projects", "posts", "media", "volunteers", "donations"
]);

const tablePaths: Record<string, string> = {
  pages: "/admin/pages",
  programs: "/admin/programs",
  projects: "/admin/projects",
  posts: "/admin/news",
  media: "/admin/gallery",
  volunteers: "/admin/volunteers",
  donations: "/admin/donations",
};

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function slugify(value: string) {
  return value.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireEditor(table: string) {
  if (!allowedTables.has(table)) throw new Error("Invalid table.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["super_admin", "admin", "editor"].includes(profile.role)) {
    throw new Error("You do not have permission.");
  }
  return { supabase, user };
}

export async function upsertContent(formData: FormData) {
  const table = String(formData.get("table"));
  const id = clean(formData.get("id"));
  const { supabase, user } = await requireEditor(table);

  const title = clean(formData.get("title"));
  const name = clean(formData.get("name"));
  const source = title || name;
  const slugValue = clean(formData.get("slug"));
  const slug = slugValue || (source ? slugify(source) : null);

  const common = {
    title: title ?? undefined,
    slug: slug ?? undefined,
    summary: clean(formData.get("summary")),
    description: clean(formData.get("description")),
    content: clean(formData.get("content")),
    excerpt: clean(formData.get("excerpt")),
    featured_image: clean(formData.get("featured_image")),
    image_url: clean(formData.get("image_url")),
    category: clean(formData.get("category")),
    status: clean(formData.get("status")) || "draft",
  };

  let payload: Record<string, unknown> = common;

  if (table === "pages") {
    payload = {
      title, slug, excerpt: common.excerpt, content: common.content,
      featured_image: common.featured_image, status: common.status,
      seo_title: clean(formData.get("seo_title")),
      seo_description: clean(formData.get("seo_description")),
      created_by: user.id
    };
  } else if (table === "programs") {
    payload = { title, slug, summary: common.summary, description: common.description, image_url: common.image_url, status: common.status };
  } else if (table === "projects") {
    payload = {
      title, slug, category: common.category, summary: common.summary, description: common.description,
      location: clean(formData.get("location")),
      start_date: clean(formData.get("start_date")),
      end_date: clean(formData.get("end_date")),
      budget: clean(formData.get("budget")) ? Number(formData.get("budget")) : null,
      featured_image: common.featured_image, status: common.status,
      impact_summary: clean(formData.get("impact_summary"))
    };
  } else if (table === "posts") {
    payload = {
      title, slug, excerpt: common.excerpt, content: common.content,
      featured_image: common.featured_image, status: common.status,
      published_at: common.status === "published" ? new Date().toISOString() : null,
      author_id: user.id
    };
  } else if (table === "volunteers") {
    payload = {
      full_name: name ?? title,
      email: clean(formData.get("email")),
      phone: clean(formData.get("phone")),
      interests: clean(formData.get("interests")),
      message: clean(formData.get("message")),
      status: clean(formData.get("status")) || "new"
    };
  } else if (table === "donations") {
    payload = {
      donor_name: name ?? title,
      donor_email: clean(formData.get("donor_email")),
      amount: Number(formData.get("amount") || 0),
      currency: clean(formData.get("currency")) || "NPR",
      payment_method: clean(formData.get("payment_method")),
      transaction_reference: clean(formData.get("transaction_reference")),
      campaign: clean(formData.get("campaign")),
      status: clean(formData.get("status")) || "pending"
    };
  }

  const result = id
    ? await supabase.from(table).update(payload).eq("id", id)
    : await supabase.from(table).insert(payload);

  if (result.error) {
    redirect(`${tablePaths[table]}?error=${encodeURIComponent(result.error.message)}`);
  }

  revalidatePath(tablePaths[table]);
  redirect(tablePaths[table]);
}

export async function deleteRecord(formData: FormData) {
  const table = String(formData.get("table"));
  const id = String(formData.get("id"));
  const redirectTo = String(formData.get("redirectTo") || tablePaths[table]);

  const { supabase } = await requireEditor(table);
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) redirect(`${redirectTo}?error=${encodeURIComponent(error.message)}`);

  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function updateSiteSettings(formData: FormData) {
  const { supabase, user } = await requireEditor("pages");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["super_admin", "admin"].includes(profile.role)) throw new Error("You do not have permission.");

  const payload = {
    site_name: clean(formData.get("site_name")) || "NGO Smart Platform",
    tagline: clean(formData.get("tagline")),
    logo_url: clean(formData.get("logo_url")),
    primary_color: clean(formData.get("primary_color")) || "#155EEF",
    secondary_color: clean(formData.get("secondary_color")) || "#0B4DBB",
    accent_color: clean(formData.get("accent_color")) || "#F59E0B",
    default_language: clean(formData.get("default_language")) || "en",
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("site_settings").upsert({ id: true, ...payload });
  if (error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

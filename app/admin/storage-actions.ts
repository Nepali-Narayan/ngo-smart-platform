 "use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"
]);

export async function uploadMedia(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  if (!profile || !["super_admin", "admin", "editor"].includes(profile.role)) {
    throw new Error("You do not have permission to upload media.");
  }

  const file = formData.get("file");
  const altText = String(formData.get("alt_text") || "").trim();

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/gallery?error=Please%20choose%20an%20image");
  }
  if (file.size > MAX_FILE_SIZE) {
    redirect("/admin/gallery?error=Image%20must%20be%208MB%20or%20smaller");
  }
  if (!ALLOWED.has(file.type)) {
    redirect("/admin/gallery?error=Only%20JPG%2C%20PNG%2C%20WebP%2C%20GIF%20and%20SVG%20images%20are%20allowed");
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  const path = `${user.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("ngo-media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    redirect(`/admin/gallery?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: publicUrl } = supabase.storage
    .from("ngo-media")
    .getPublicUrl(path);

  const { error: dbError } = await supabase.from("media").insert({
    file_name: file.name,
    file_url: publicUrl.publicUrl,
    mime_type: file.type,
    alt_text: altText || null,
    uploaded_by: user.id,
  });

  if (dbError) {
    await supabase.storage.from("ngo-media").remove([path]);
    redirect(`/admin/gallery?error=${encodeURIComponent(dbError.message)}`);
  }

  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?uploaded=1");
}

export async function deleteMedia(formData: FormData) {
  const id = String(formData.get("id") || "");
  const fileUrl = String(formData.get("file_url") || "");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  if (!profile || !["super_admin", "admin", "editor"].includes(profile.role)) {
    throw new Error("You do not have permission.");
  }

  // Extract storage object path from our public URL.
  const marker = "/storage/v1/object/public/ngo-media/";
  const index = fileUrl.indexOf(marker);
  if (index >= 0) {
    const objectPath = decodeURIComponent(fileUrl.slice(index + marker.length));
    await supabase.storage.from("ngo-media").remove([objectPath]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) redirect(`/admin/gallery?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?deleted=1");
}

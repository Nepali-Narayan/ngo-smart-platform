 "use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function upsertMedia(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["super_admin","admin","editor"].includes(profile.role)) throw new Error("Not authorized.");

  const id = String(formData.get("id") || "");
  const payload = {
    file_name: String(formData.get("file_name") || ""),
    file_url: String(formData.get("file_url") || ""),
    mime_type: String(formData.get("mime_type") || "") || null,
    alt_text: String(formData.get("alt_text") || "") || null,
    uploaded_by: user.id
  };
  const result = id ? await supabase.from("media").update(payload).eq("id", id) : await supabase.from("media").insert(payload);
  if (result.error) redirect(`/admin/gallery?error=${encodeURIComponent(result.error.message)}`);
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

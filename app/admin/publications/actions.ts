
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function deletePublication(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Publication ID is required.");
  }

  const { error } = await supabase
    .from("publications")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete publication: ${error.message}`
    );
  }

  // Return to Publications after successful deletion
  redirect("/admin/publications");
}


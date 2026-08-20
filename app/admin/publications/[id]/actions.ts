"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createPublicationUploadUrl(
  id: string,
  fileType: "pdf" | "cover",
  fileName: string
) {
  const supabase = await createClient();

  if (!id) {
    throw new Error("Publication ID is missing.");
  }

  if (!fileName) {
    throw new Error("File name is missing.");
  }

  const {
    data: publication,
    error: publicationError,
  } = await supabase
    .from("publications")
    .select("id, title, slug")
    .eq("id", id)
    .single();

  if (
    publicationError ||
    !publication
  ) {
    throw new Error(
      "Publication not found."
    );
  }

  const extension =
    fileName
      .split(".")
      .pop()
      ?.toLowerCase() || "bin";

  const safeSlug =
    publication.slug ||
    publication.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const timestamp = Date.now();

  let path: string;

  if (fileType === "pdf") {
    path =
      `pdfs/${safeSlug}-${timestamp}.pdf`;
  } else {
    path =
      `covers/${safeSlug}-${timestamp}.${extension}`;
  }

  const {
    data,
    error,
  } = await supabase.storage
    .from("publications")
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(
      `Unable to create upload URL: ${
        error?.message || "Unknown error"
      }`
    );
  }

  return {
    path,
    token: data.token,
  };
}

export async function savePublicationFile(
  id: string,
  fileType: "pdf" | "cover",
  path: string
) {
  const supabase = await createClient();

  if (!id) {
    throw new Error(
      "Publication ID is missing."
    );
  }

  if (!path) {
    throw new Error(
      "Uploaded file path is missing."
    );
  }

  const {
    data: publication,
    error: publicationError,
  } = await supabase
    .from("publications")
    .select("id")
    .eq("id", id)
    .single();

  if (
    publicationError ||
    !publication
  ) {
    throw new Error(
      "Publication not found."
    );
  }

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from("publications")
      .getPublicUrl(path);

  const publicUrl =
    publicUrlData.publicUrl;

  const updateData =
    fileType === "pdf"
      ? { file_url: publicUrl }
      : { cover_image: publicUrl };

  const {
    error: updateError,
  } = await supabase
    .from("publications")
    .update(updateData)
    .eq("id", id);

  if (updateError) {
    throw new Error(
      `Database update failed: ${updateError.message}`
    );
  }

  return {
    success: true,
    url: publicUrl,
  };
}

export async function updatePublicationDetails(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  if (!id) {
    throw new Error(
      "Publication ID is missing."
    );
  }

  const title = String(
    formData.get("title") || ""
  ).trim();

  const type = String(
    formData.get("type") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const publishedDate = String(
    formData.get("published_date") || ""
  ).trim();

  const status = String(
    formData.get("status") || "draft"
  ).trim();

  if (!title) {
    throw new Error(
      "Title is required."
    );
  }

  if (!type) {
    throw new Error(
      "Publication type is required."
    );
  }

  const newSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!newSlug) {
    throw new Error(
      "Unable to create a valid slug."
    );
  }

  const {
    data: currentPublication,
    error: currentError,
  } = await supabase
    .from("publications")
    .select("id, title, slug")
    .eq("id", id)
    .single();

  if (
    currentError ||
    !currentPublication
  ) {
    throw new Error(
      "Publication not found."
    );
  }

  let finalSlug =
    currentPublication.slug;

  if (
    currentPublication.title !== title
  ) {
    finalSlug = newSlug;

    const {
      data: slugOwner,
      error: slugError,
    } = await supabase
      .from("publications")
      .select("id")
      .eq("slug", finalSlug)
      .neq("id", id)
      .maybeSingle();

    if (slugError) {
      throw new Error(
        `Unable to check slug: ${slugError.message}`
      );
    }

    if (slugOwner) {
      throw new Error(
        `Another publication already uses the slug "${finalSlug}".`
      );
    }
  }

  const {
    error: updateError,
  } = await supabase
    .from("publications")
    .update({
      title,
      slug: finalSlug || newSlug,
      type,
      description:
        description || null,
      published_date:
        publishedDate || null,
      status,
    })
    .eq("id", id);

  if (updateError) {
    throw new Error(
      `Failed to update publication: ${updateError.message}`
    );
  }

  redirect(
    "/admin/publications"
  );
}
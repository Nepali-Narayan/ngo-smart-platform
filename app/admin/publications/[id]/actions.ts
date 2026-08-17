"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updatePublication(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  console.log("UPDATE PUBLICATION ID:", id);

  if (!id) {
    throw new Error("Publication ID is missing.");
  }

  /* --------------------------------
     GET CURRENT PUBLICATION
  -------------------------------- */

  const { data: currentPublication, error: currentError } =
    await supabase
      .from("publications")
      .select(`
        id,
        title,
        slug,
        type,
        description,
        cover_image,
        file_url,
        published_date,
        status
      `)
      .eq("id", id)
      .single();

  if (currentError || !currentPublication) {
    throw new Error(
      `Publication not found. ID: ${id}`
    );
  }

  /* --------------------------------
     FORM VALUES
  -------------------------------- */

  const title = String(
    formData.get("title") || ""
  ).trim();

  const type = String(
    formData.get("type") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const published_date = String(
    formData.get("published_date") || ""
  ).trim();

  const status = String(
    formData.get("status") || "draft"
  ).trim();

  const coverFile =
    formData.get("cover") as File | null;

  const pdfFile =
    formData.get("pdf") as File | null;

  /* --------------------------------
     VALIDATION
  -------------------------------- */

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!type) {
    throw new Error("Publication type is required.");
  }

  /* --------------------------------
     CREATE SLUG
  -------------------------------- */

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

  /* --------------------------------
     SLUG CHECK
     
     If title has not changed,
     keep the existing slug.
  -------------------------------- */

  let finalSlug = currentPublication.slug;

  if (currentPublication.title !== title) {
    finalSlug = newSlug;

    const { data: slugOwner, error: slugError } =
      await supabase
        .from("publications")
        .select("id, title, slug")
        .eq("slug", finalSlug)
        .maybeSingle();

    if (slugError) {
      throw new Error(
        `Unable to check slug: ${slugError.message}`
      );
    }

    if (
      slugOwner &&
      slugOwner.id !== currentPublication.id
    ) {
      throw new Error(
        `Another publication already uses the slug "${finalSlug}". Please choose a different title.`
      );
    }
  }

  /* --------------------------------
     UPDATE DATA
  -------------------------------- */

  const updateData: {
    title: string;
    slug: string;
    type: string;
    description: string | null;
    published_date: string | null;
    status: string;
    cover_image?: string;
    file_url?: string;
  } = {
    title,
    slug: finalSlug,
    type,
    description: description || null,
    published_date:
      published_date || null,
    status,
  };

  /* --------------------------------
     REPLACE COVER
  -------------------------------- */

  if (
    coverFile &&
    coverFile instanceof File &&
    coverFile.size > 0
  ) {
    if (!coverFile.type.startsWith("image/")) {
      throw new Error(
        "Please select a valid cover image."
      );
    }

    if (
      coverFile.size >
      10 * 1024 * 1024
    ) {
      throw new Error(
        "Cover image must be smaller than 10 MB."
      );
    }

    const extension =
      coverFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const filePath =
      `covers/${finalSlug}-${Date.now()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("publications")
        .upload(
          filePath,
          coverFile,
          {
            contentType: coverFile.type,
            upsert: false,
          }
        );

    if (uploadError) {
      throw new Error(
        `Cover image upload failed: ${uploadError.message}`
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("publications")
        .getPublicUrl(filePath);

    updateData.cover_image =
      publicUrlData.publicUrl;
  }

  /* --------------------------------
     REPLACE PDF
  -------------------------------- */

  if (
    pdfFile &&
    pdfFile instanceof File &&
    pdfFile.size > 0
  ) {
    if (
      pdfFile.type !==
      "application/pdf"
    ) {
      throw new Error(
        "Please select a PDF file."
      );
    }

    if (
      pdfFile.size >
      20 * 1024 * 1024
    ) {
      throw new Error(
        "PDF must be smaller than 20 MB."
      );
    }

    const filePath =
      `pdfs/${finalSlug}-${Date.now()}.pdf`;

    const { error: uploadError } =
      await supabase.storage
        .from("publications")
        .upload(
          filePath,
          pdfFile,
          {
            contentType:
              "application/pdf",
            upsert: false,
          }
        );

    if (uploadError) {
      throw new Error(
        `PDF upload failed: ${uploadError.message}`
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("publications")
        .getPublicUrl(filePath);

    updateData.file_url =
      publicUrlData.publicUrl;
  }

  /* --------------------------------
     UPDATE DATABASE
  -------------------------------- */

  const { error: updateError } =
    await supabase
      .from("publications")
      .update(updateData)
      .eq("id", currentPublication.id);

  if (updateError) {
    throw new Error(
      `Failed to update publication: ${updateError.message}`
    );
  }

  /* --------------------------------
     SUCCESS
  -------------------------------- */

  redirect("/admin/publications");
}
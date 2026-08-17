"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updatePublication(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

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

  const publishedDate = String(
    formData.get("published_date") || ""
  ).trim();

  const status = String(
    formData.get("status") || "draft"
  ).trim();

  const coverFile = formData.get("cover");
  const pdfFile = formData.get("pdf");

  /* --------------------------------
     VALIDATION
  -------------------------------- */

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!type) {
    throw new Error(
      "Publication type is required."
    );
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

  let finalSlug = currentPublication.slug;

  if (currentPublication.title !== title) {
    finalSlug = newSlug;

    const { data: slugOwner, error: slugError } =
      await supabase
        .from("publications")
        .select("id")
        .eq("slug", finalSlug)
        .neq("id", currentPublication.id)
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
    slug: finalSlug || newSlug,
    type,
    description: description || null,
    published_date: publishedDate || null,
    status,
  };

  /* --------------------------------
     COVER IMAGE
     Maximum: 50 MB
  -------------------------------- */

  if (
    coverFile instanceof File &&
    coverFile.size > 0
  ) {
    if (!coverFile.type.startsWith("image/")) {
      throw new Error(
        "Please select a valid image file."
      );
    }

    if (coverFile.size > 50 * 1024 * 1024) {
      throw new Error(
        "Cover image must be smaller than 50 MB."
      );
    }

    const extension =
      coverFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const coverPath =
      `covers/${finalSlug}-${Date.now()}.${extension}`;

    const { error: coverUploadError } =
      await supabase.storage
        .from("publications")
        .upload(
          coverPath,
          coverFile,
          {
            contentType: coverFile.type,
            upsert: false,
          }
        );

    if (coverUploadError) {
      throw new Error(
        `Cover image upload failed: ${coverUploadError.message}`
      );
    }

    const {
      data: coverPublicUrl,
    } =
      supabase.storage
        .from("publications")
        .getPublicUrl(coverPath);

    updateData.cover_image =
      coverPublicUrl.publicUrl;
  }

  /* --------------------------------
     PDF
     Maximum: 50 MB
  -------------------------------- */

  if (
    pdfFile instanceof File &&
    pdfFile.size > 0
  ) {
    if (
      pdfFile.type !==
      "application/pdf"
    ) {
      throw new Error(
        "Please select a valid PDF file."
      );
    }

    if (pdfFile.size > 50 * 1024 * 1024) {
      throw new Error(
        "PDF must be smaller than 50 MB."
      );
    }

    const pdfPath =
      `pdfs/${finalSlug}-${Date.now()}.pdf`;

    const { error: pdfUploadError } =
      await supabase.storage
        .from("publications")
        .upload(
          pdfPath,
          pdfFile,
          {
            contentType:
              "application/pdf",
            upsert: false,
          }
        );

    if (pdfUploadError) {
      throw new Error(
        `PDF upload failed: ${pdfUploadError.message}`
      );
    }

    const {
      data: pdfPublicUrl,
    } =
      supabase.storage
        .from("publications")
        .getPublicUrl(pdfPath);

    updateData.file_url =
      pdfPublicUrl.publicUrl;
  }

  /* --------------------------------
     UPDATE DATABASE
  -------------------------------- */

  const { error: updateError } =
    await supabase
      .from("publications")
      .update(updateData)
      .eq(
        "id",
        currentPublication.id
      );

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
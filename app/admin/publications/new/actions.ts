"use server";

import { createClient } from "@/lib/supabase/server";

type CreatePublicationInput = {
  title: string;
  slug: string;
  type: string;
  description: string;
  publishedDate: string;
  status: string;
  coverImage?: File | null;
  pdfFile?: File | null;
};

export async function createPublication(
  input: CreatePublicationInput
) {
  const supabase = await createClient();

  const title = input.title.trim();
  const slug = input.slug.trim();
  const type = input.type.trim();
  const description = input.description.trim();
  const publishedDate = input.publishedDate.trim();
  const status = input.status.trim();

  if (!title) {
    return {
      success: false,
      error: "Publication title is required.",
    };
  }

  if (!slug) {
    return {
      success: false,
      error: "Publication slug is required.",
    };
  }

  if (!type) {
    return {
      success: false,
      error: "Publication type is required.",
    };
  }

  let coverUrl: string | null = null;
  let pdfUrl: string | null = null;

  /* =========================================================
     COVER IMAGE
  ========================================================= */

  if (input.coverImage && input.coverImage.size > 0) {
    const file = input.coverImage;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Cover image must be JPG, PNG or WebP.",
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "Cover image must be smaller than 5 MB.",
      };
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `covers/${slug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("publications")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Cover image upload failed: ${uploadError.message}`,
      };
    }

    const { data } = supabase.storage
      .from("publications")
      .getPublicUrl(filePath);

    coverUrl = data.publicUrl;
  }

  /* =========================================================
     PDF
  ========================================================= */

  if (input.pdfFile && input.pdfFile.size > 0) {
    const file = input.pdfFile;

    if (file.type !== "application/pdf") {
      return {
        success: false,
        error: "Publication file must be a PDF.",
      };
    }

    if (file.size > 50 * 1024 * 1024) {
      return {
        success: false,
        error: "PDF must be smaller than 50 MB.",
      };
    }

    const filePath = `pdfs/${slug}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("publications")
      .upload(filePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: `PDF upload failed: ${uploadError.message}`,
      };
    }

    const { data } = supabase.storage
      .from("publications")
      .getPublicUrl(filePath);

    pdfUrl = data.publicUrl;
  }

  /* =========================================================
     DATABASE
  ========================================================= */

  const { error } = await supabase
    .from("publications")
    .insert({
      title,
      slug,
      type,
      description: description || null,
      published_date: publishedDate || null,
      status,
      cover_image: coverUrl,
      file_url: pdfUrl,
    });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}
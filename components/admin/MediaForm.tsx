"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export function MediaForm() {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please select an image or video.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("This file type is not supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be 50 MB or less.");
      return;
    }

    try {
      setUploading(true);

      const supabase = createClient();
            const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You are not logged in. Please log in to the admin panel first.");
        setUploading(false);
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "file";

      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const filePath = `${Date.now()}-${safeName}.${extension}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      // Save media information to database
      const { error: insertError } = await supabase
        .from("media")
        .insert({
          file_name: file.name,
          file_url: fileUrl,
          mime_type: file.type,
          alt_text: altText.trim() || null,
        });

      if (insertError) {
        // If database insert fails, remove the uploaded file
        await supabase.storage
          .from("media")
          .remove([filePath]);

        throw new Error(insertError.message);
      }

      setFile(null);
      setAltText("");
      setMessage("Media uploaded successfully.");

      const input = document.getElementById(
        "media-file"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
    >
      <div>
        <label
          htmlFor="media-file"
          className="block text-sm font-bold text-slate-900"
        >
          Picture or Video
        </label>

        <input
          id="media-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-xs text-slate-500">
          Images: JPG, PNG, WEBP, GIF. Videos: MP4, WEBM, MOV.
          Maximum size: 50 MB.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="alt-text"
          className="block text-sm font-bold text-slate-900"
        >
          Alt Text
        </label>

        <input
          id="alt-text"
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image or video"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

        <p className="mt-2 text-xs text-slate-500">
          Useful for accessibility and search engines.
        </p>
      </div>

      {file && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">
            Selected file
          </p>

          <p className="mt-1 break-all text-sm text-slate-600">
            {file.name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={uploading}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload Media"}
        </button>

        <a
          href="/admin/gallery"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
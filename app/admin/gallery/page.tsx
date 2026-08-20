"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminGalleryPage() {
  const supabase = createClient();

  const [type, setType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [publishedDate, setPublishedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"draft" | "published">("published");

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setStatus("published");
    setMediaFile(null);
    setThumbnailFile(null);

    const inputs = document.querySelectorAll<HTMLInputElement>(
      'input[type="file"]'
    );

    inputs.forEach((input) => {
      input.value = "";
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!mediaFile) {
      setError(
        type === "image"
          ? "Please select an image."
          : "Please select a video."
      );
      return;
    }

    if (type === "image" && !mediaFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (type === "video" && !mediaFile.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (type === "video" && thumbnailFile) {
      if (!thumbnailFile.type.startsWith("image/")) {
        setError("Video thumbnail must be an image.");
        return;
      }
    }

    try {
      setUploading(true);

      const extension =
        mediaFile.name.split(".").pop()?.toLowerCase() || "file";

      const safeTitle =
        title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "gallery";

      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const folder = type === "image" ? "images" : "videos";

      const mediaPath = `${folder}/${safeTitle}-${uniqueId}.${extension}`;

      // Upload image or video
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(mediaPath, mediaFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: mediaFile.type,
        });

      if (uploadError) {
        throw new Error(`Media upload failed: ${uploadError.message}`);
      }

      const { data: mediaUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(mediaPath);

      const mediaPublicUrl = mediaUrlData.publicUrl;

      // Upload thumbnail for video
      let thumbnailPublicUrl: string | null = null;

      if (type === "video" && thumbnailFile) {
        const thumbnailExtension =
          thumbnailFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const thumbnailPath = `thumbnails/${safeTitle}-${uniqueId}.${thumbnailExtension}`;

        const { error: thumbnailError } = await supabase.storage
          .from("gallery")
          .upload(thumbnailPath, thumbnailFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: thumbnailFile.type,
          });

        if (thumbnailError) {
          await supabase.storage.from("gallery").remove([mediaPath]);

          throw new Error(
            `Thumbnail upload failed: ${thumbnailError.message}`
          );
        }

        const { data: thumbnailUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(thumbnailPath);

        thumbnailPublicUrl = thumbnailUrlData.publicUrl;
      }

      // Insert database record
      const { error: databaseError } = await supabase
        .from("gallery_items")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          type,
          file_url: mediaPublicUrl,
          thumbnail_url: thumbnailPublicUrl,
          category: category.trim() || null,
          location: location.trim() || null,
          published_date: publishedDate,
          status,
        });

      if (databaseError) {
        await supabase.storage.from("gallery").remove([mediaPath]);

        throw new Error(
          `Database error: ${databaseError.message}`
        );
      }

      setMessage(
        type === "image"
          ? "Image uploaded successfully."
          : "Video uploaded successfully."
      );

      resetForm();
    } catch (err) {
      console.error("Gallery upload error:", err);

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
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="bg-slate-950 px-6 py-14 text-white">
        <div className="container-custom">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Gallery Management
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Upload and manage images and videos for the public gallery.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="container-custom px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-6 md:px-8">
              <h2 className="text-2xl font-black text-slate-900">
                Add Gallery Item
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Upload an image or video to your gallery.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-6 md:p-8"
            >
              {/* MEDIA TYPE */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700">
                  Media Type
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setType("image");
                      setMediaFile(null);
                      setThumbnailFile(null);
                    }}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      type === "image"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-3xl">🖼️</div>

                    <div className="mt-3 font-bold text-slate-900">
                      Image
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Upload a picture.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType("video");
                      setMediaFile(null);
                      setThumbnailFile(null);
                    }}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      type === "video"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-3xl">🎥</div>

                    <div className="mt-3 font-bold text-slate-900">
                      Video
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Upload a video and thumbnail.
                    </p>
                  </button>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter gallery title"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this gallery item"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* CATEGORY + LOCATION */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Category
                  </label>

                  <input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Events, Community, Education..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Kathmandu, Nepal"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* DATE + STATUS */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="publishedDate"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Published Date
                  </label>

                  <input
                    id="publishedDate"
                    type="date"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "draft" | "published"
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* MAIN FILE */}
              <div>
                <label
                  htmlFor="mediaFile"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {type === "image" ? "Image File" : "Video File"}
                </label>

                <input
                  id="mediaFile"
                  type="file"
                  accept={type === "image" ? "image/*" : "video/*"}
                  onChange={(e) =>
                    setMediaFile(e.target.files?.[0] || null)
                  }
                  required
                  className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm"
                />
              </div>

              {/* VIDEO THUMBNAIL */}
              {type === "video" && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <label
                    htmlFor="thumbnailFile"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Video Thumbnail
                  </label>

                  <input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] || null)
                    }
                    className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-3 text-sm"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Optional thumbnail for the video.
                  </p>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* SUCCESS */}
              {message && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  <strong>Success:</strong> {message}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading
                  ? "Uploading..."
                  : type === "image"
                    ? "Upload Image"
                    : "Upload Video"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
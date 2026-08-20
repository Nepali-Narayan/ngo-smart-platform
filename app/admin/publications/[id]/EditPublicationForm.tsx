"use client";

import Link from "next/link";
import { useState } from "react";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  createPublicationUploadUrl,
  savePublicationFile,
  updatePublicationDetails,
} from "./actions";

type Publication = {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string | null;
  cover_image: string | null;
  file_url: string | null;
  published_date: string | null;
  status: string;
};

type Props = {
  publication: Publication;
};

const MAX_PDF_SIZE =
  50 * 1024 * 1024;

const MAX_COVER_SIZE =
  10 * 1024 * 1024;

export default function EditPublicationForm({
  publication,
}: Props) {
  const [uploading, setUploading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function uploadFile(
    file: File,
    type: "pdf" | "cover"
  ) {
    setError("");
    setMessage("");

    const maxSize =
      type === "pdf"
        ? MAX_PDF_SIZE
        : MAX_COVER_SIZE;

    if (file.size > maxSize) {
      throw new Error(
        type === "pdf"
          ? "PDF must be 50 MB or smaller."
          : "Cover image must be 10 MB or smaller."
      );
    }

    if (
      type === "pdf" &&
      file.type !== "application/pdf"
    ) {
      throw new Error(
        "Please select a valid PDF file."
      );
    }

    if (
      type === "cover" &&
      !file.type.startsWith("image/")
    ) {
      throw new Error(
        "Please select a valid image file."
      );
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const {
        path,
        token,
      } =
        await createPublicationUploadUrl(
          publication.id,
          type,
          file.name
        );

      const supabase =
        createClient();

      /*
       * Direct browser → Supabase upload.
       *
       * The PDF does NOT pass through
       * the Next.js Server Action.
       */

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("publications")
          .uploadToSignedUrl(
            path,
            token,
            file,
            {
              contentType:
                file.type ||
                "application/octet-stream",
            }
          );

      if (uploadError) {
        throw new Error(
          uploadError.message
        );
      }

      setUploadProgress(100);

      await savePublicationFile(
        publication.id,
        type,
        path
      );

      return path;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const form =
      event.currentTarget;

    const pdfInput =
      form.elements.namedItem(
        "pdf"
      ) as HTMLInputElement;

    const coverInput =
      form.elements.namedItem(
        "cover"
      ) as HTMLInputElement;

    const pdfFile =
      pdfInput?.files?.[0];

    const coverFile =
      coverInput?.files?.[0];

    try {
      setUploading(true);

      /*
       * 1. Update normal publication fields
       */

      const formData =
        new FormData(form);

      formData.delete("pdf");
      formData.delete("cover");

      await updatePublicationDetails(
        publication.id,
        formData
      );

      /*
       * The Server Action above normally redirects.
       *
       * If your Next.js version does not redirect
       * immediately, continue with file uploads.
       */

      /*
       * 2. Upload cover
       */

      if (coverFile) {
        await uploadFile(
          coverFile,
          "cover"
        );
      }

      /*
       * 3. Upload PDF
       */

      if (pdfFile) {
        await uploadFile(
          pdfFile,
          "pdf"
        );
      }

      setMessage(
        "Publication updated successfully."
      );

    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">

          <Link
            href="/admin/publications"
            className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            ← Back to Publications
          </Link>

          <div className="mt-5">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Edit Publication
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Update publication information,
              replace files, and manage
              publication status.
            </p>

          </div>

        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {uploading && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

            <div className="flex items-center justify-between">

              <span className="font-semibold text-blue-900">
                Uploading...
              </span>

              <span className="text-sm font-bold text-blue-700">
                {uploadProgress}%
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${uploadProgress}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-blue-700">
              Please keep this page open
              until the upload finishes.
            </p>

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >

          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 sm:px-8">

            <h2 className="text-xl font-bold text-slate-900">
              Publication Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Make your changes and save
              the publication.
            </p>

          </div>

          <div className="space-y-8 p-6 sm:p-8">

            {/* TITLE */}

            <div>

              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-700"
              >
                Publication Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                defaultValue={
                  publication.title
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* TYPE + STATUS */}

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Publication Type
                </label>

                <select
                  id="type"
                  name="type"
                  defaultValue={
                    publication.type
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >

                  <option value="Report">
                    Report
                  </option>

                  <option value="Research">
                    Research
                  </option>

                  <option value="Book">
                    Book
                  </option>

                  <option value="Guideline">
                    Guideline
                  </option>

                  <option value="Newsletter">
                    Newsletter
                  </option>

                  <option value="Publication">
                    Publication
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div>

                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Publication Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={
                    publication.status
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >

                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>

                </select>

              </div>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                defaultValue={
                  publication.description ||
                  ""
                }
                rows={7}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* DATE */}

            <div>

              <label
                htmlFor="published_date"
                className="block text-sm font-semibold text-slate-700"
              >
                Published Date
              </label>

              <input
                id="published_date"
                name="published_date"
                type="date"
                defaultValue={
                  publication.published_date ||
                  ""
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* COVER */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="font-bold text-slate-900">
                Cover Image
              </h3>

              {publication.cover_image && (
                <div className="mt-5">

                  <img
                    src={
                      publication.cover_image
                    }
                    alt={
                      publication.title
                    }
                    className="h-64 w-48 rounded-2xl object-cover shadow-sm"
                  />

                  <a
                    href={
                      publication.cover_image
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block font-semibold text-blue-600"
                  >
                    Open current cover →
                  </a>

                </div>
              )}

              <label
                htmlFor="cover"
                className="mt-6 block text-sm font-semibold text-slate-700"
              >
                Replace Cover Image
              </label>

              <input
                id="cover"
                name="cover"
                type="file"
                accept="image/*"
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
              />

              <p className="mt-2 text-xs text-slate-500">
                Maximum 10 MB.
              </p>

            </div>

            {/* PDF */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="font-bold text-slate-900">
                Publication PDF
              </h3>

              {publication.file_url && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">

                  <p className="font-semibold text-slate-900">
                    Current PDF available
                  </p>

                  <a
                    href={
                      publication.file_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
                  >
                    📄 View PDF
                  </a>

                </div>
              )}

              <label
                htmlFor="pdf"
                className="mt-6 block text-sm font-semibold text-slate-700"
              >
                Replace PDF
              </label>

              <input
                id="pdf"
                name="pdf"
                type="file"
                accept="application/pdf,.pdf"
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
              />

              <p className="mt-2 text-xs text-slate-500">
                Maximum PDF size:{" "}
                <strong>50 MB</strong>.
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/publications"
                className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={uploading}
                className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </form>

      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { createPublication } from "./actions";

export default function NewPublicationPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [status, setStatus] = useState("draft");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const result = await createPublication({
        title,
        slug,
        type,
        description,
        publishedDate,
        status,
        coverImage,
        pdfFile: pdf,
      });

      if (!result.success) {
        setMessage(`Error: ${result.error}`);
        setSaving(false);
        return;
      }

      setMessage("Publication saved successfully.");

      setTitle("");
      setSlug("");
      setType("");
      setDescription("");
      setPublishedDate("");
      setStatus("draft");
      setCoverImage(null);
      setPdf(null);

      const coverInput = document.getElementById(
        "coverImage"
      ) as HTMLInputElement | null;

      const pdfInput = document.getElementById(
        "pdf"
      ) as HTMLInputElement | null;

      if (coverInput) {
        coverInput.value = "";
      }

      if (pdfInput) {
        pdfInput.value = "";
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Something went wrong."
      );
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Knowledge & Resources
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Add New Publication
          </h1>

          <p className="mt-2 text-slate-600">
            Create a new publication with cover image and PDF.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mb-6 rounded-xl border p-4 ${
              message.startsWith("Error:")
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            <p className="font-semibold">{message}</p>
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {/* TITLE */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Title *
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                const value = e.target.value;

                setTitle(value);

                if (!slug) {
                  setSlug(makeSlug(value));
                }
              }}
              required
              placeholder="Enter publication title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SLUG */}

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Slug *
            </label>

            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(makeSlug(e.target.value))
              }
              required
              placeholder="publication-title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Example: my-life-my-choice
            </p>
          </div>

          {/* TYPE */}

          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Publication Type *
            </label>

            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select publication type
              </option>

              <option value="Report">Report</option>
              <option value="Research">Research</option>
              <option value="Book">Book</option>
              <option value="Guideline">Guideline</option>
              <option value="Newsletter">Newsletter</option>
              <option value="Publication">Publication</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={6}
              placeholder="Write a short description..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="publishedDate"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Published Date
            </label>

            <input
              id="publishedDate"
              type="date"
              value={publishedDate}
              onChange={(e) =>
                setPublishedDate(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="draft">Draft</option>
              <option value="published">
                Published
              </option>
            </select>
          </div>

          {/* COVER IMAGE */}

          <div>
            <label
              htmlFor="coverImage"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Cover Image
            </label>

            <input
              id="coverImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setCoverImage(
                  e.target.files?.[0] || null
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <p className="mt-2 text-sm text-slate-500">
              JPG, PNG or WebP. Maximum 5 MB.
            </p>

            {coverImage && (
              <p className="mt-2 text-sm font-medium text-blue-600">
                Selected: {coverImage.name}
              </p>
            )}
          </div>

          {/* PDF */}

          <div>
            <label
              htmlFor="pdf"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              PDF File
            </label>

            <input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setPdf(e.target.files?.[0] || null)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <p className="mt-2 text-sm text-slate-500">
              PDF only. Maximum 50 MB.
            </p>

            {pdf && (
              <p className="mt-2 text-sm font-medium text-blue-600">
                Selected: {pdf.name}
              </p>
            )}
          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Publication"}
            </button>

            <a
              href="/admin/publications"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </a>

          </div>
        </form>
      </div>
    </main>
  );
}
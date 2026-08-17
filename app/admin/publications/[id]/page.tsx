import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePublication } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPublicationPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: publication,
    error,
  } = await supabase
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

  if (error || !publication) {
    notFound();
  }

  const updatePublicationWithId =
    updatePublication.bind(null, id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

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
              replace files, and manage publication
              status.
            </p>

          </div>

        </div>

        {/* MAIN FORM */}

        <form
          action={updatePublicationWithId}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >

          {/* FORM HEADER */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 sm:px-8">

            <h2 className="text-xl font-bold text-slate-900">
              Publication Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Make your changes and save the
              publication.
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
                type="text"
                name="title"
                defaultValue={publication.title}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter publication title"
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
                  defaultValue={publication.type}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                  defaultValue={publication.status}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                  publication.description || ""
                }
                rows={7}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Write a short description of this publication..."
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
                type="date"
                name="published_date"
                defaultValue={
                  publication.published_date || ""
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* CURRENT COVER */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-bold text-slate-900">
                    Cover Image
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Current publication cover
                  </p>

                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  IMAGE
                </span>

              </div>

              {publication.cover_image ? (

                <div className="mt-5 flex flex-col gap-5 sm:flex-row">

                  <div className="h-64 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <img
                      src={publication.cover_image}
                      alt={publication.title}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  <div className="flex flex-col justify-center">

                    <p className="text-sm text-slate-600">
                      A cover image is currently
                      attached to this publication.
                    </p>

                    <a
                      href={publication.cover_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Open current cover →
                    </a>

                  </div>

                </div>

              ) : (

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">

                  <div className="text-3xl">
                    🖼️
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    No cover image uploaded.
                  </p>

                </div>

              )}

              {/* REPLACE COVER */}

              <div className="mt-6">

                <label
                  htmlFor="cover"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Replace Cover Image
                </label>

                <input
                  id="cover"
                  type="file"
                  name="cover"
                  accept="image/*"
                  className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Leave empty to keep the existing
                  cover image. Maximum 50 MB.
                </p>

              </div>

            </div>

            {/* PDF */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h3 className="font-bold text-slate-900">
                    Publication PDF
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload or replace the downloadable
                    PDF.
                  </p>

                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  PDF
                </span>

              </div>

              {/* CURRENT PDF */}

              {publication.file_url ? (

                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="font-semibold text-slate-900">
                        Current PDF available
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        You can open the existing
                        document before replacing it.
                      </p>

                    </div>

                    <a
                      href={publication.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      📄 View PDF
                    </a>

                  </div>

                </div>

              ) : (

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">

                  <div className="text-3xl">
                    📄
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    No PDF has been uploaded yet.
                  </p>

                </div>

              )}

              {/* REPLACE PDF */}

              <div className="mt-6">

                <label
                  htmlFor="pdf"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Replace PDF
                </label>

                <input
                  id="pdf"
                  type="file"
                  name="pdf"
                  accept="application/pdf,.pdf"
                  className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2 file:font-semibold file:text-red-700 hover:file:bg-red-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Leave empty to keep the current PDF.
                  Maximum file size: <strong>50 MB</strong>.
                </p>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/publications"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Save Changes
              </button>

            </div>

          </div>

        </form>

      </div>

    </main>
  );
}
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

  const { data: publication, error } = await supabase
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <Link
            href="/admin/publications"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Publications
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Edit Publication
          </h1>

          <p className="mt-2 text-slate-600">
            Update publication information, cover image,
            PDF and publication status.
          </p>
        </div>

        <form
          action={updatePublicationWithId}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {/* TITLE */}

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              defaultValue={publication.title}
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Publication Type
            </label>

            <select
              name="type"
              defaultValue={publication.type}
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            >
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
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              defaultValue={publication.description || ""}
              rows={7}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          {/* DATE */}

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Published Date
            </label>

            <input
              type="date"
              name="published_date"
              defaultValue={
                publication.published_date || ""
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          {/* STATUS */}

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              name="status"
              defaultValue={publication.status}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </div>

          {/* CURRENT COVER */}

          {publication.cover_image && (
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Current Cover Image
              </p>

              <img
                src={publication.cover_image}
                alt={publication.title}
                className="mt-3 h-64 w-48 rounded-xl border object-cover"
              />
            </div>
          )}

          {/* NEW COVER */}

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Replace Cover Image
            </label>

            <input
              type="file"
              name="cover"
              accept="image/*"
              className="mt-2 block w-full rounded-xl border border-slate-300 p-3"
            />

            <p className="mt-2 text-xs text-slate-500">
              Leave empty to keep the current cover image.
            </p>
          </div>

          {/* CURRENT PDF */}

          {publication.file_url && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Current PDF
              </p>

              <a
                href={publication.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-blue-600 hover:text-blue-700"
              >
                View Current PDF →
              </a>
            </div>
          )}

          {/* NEW PDF */}

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Replace PDF
            </label>

            <input
              type="file"
              name="pdf"
              accept="application/pdf"
              className="mt-2 block w-full rounded-xl border border-slate-300 p-3"
            />

            <p className="mt-2 text-xs text-slate-500">
              Leave empty to keep the current PDF.
            </p>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Changes
            </button>

            <Link
              href="/admin/publications"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>
    </main>
  );
}
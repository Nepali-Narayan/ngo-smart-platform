import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublicationFilters from "./PublicationFilters";

type Publication = {
  id: string;
  title: string;
  slug: string | null;
  type: string;
  description: string | null;
  cover_image: string | null;
  file_url: string | null;
  published_date: string | null;
  status: string;
};

export default async function AdminPublicationsPage() {
  const supabase = await createClient();

  const {
    data: publications,
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
    .order("published_date", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <h1 className="text-xl font-bold text-red-800">
              Unable to load publications
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error.message}
            </p>

          </div>

        </div>

      </main>
    );
  }

  const publicationList: Publication[] =
    publications || [];

  const total = publicationList.length;

  const published = publicationList.filter(
    (publication) =>
      publication.status === "published"
  ).length;

  const drafts = publicationList.filter(
    (publication) =>
      publication.status !== "published"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Publications
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Manage reports, research, books, guidelines,
              newsletters and other publications.
            </p>

          </div>

          <Link
            href="/admin/publications/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Publication
          </Link>

        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Publications
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {total}
            </p>

          </div>

          {/* PUBLISHED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {published}
            </p>

          </div>

          {/* DRAFTS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {drafts}
            </p>

          </div>

        </div>

        {/* =====================================================
            PUBLICATIONS
        ===================================================== */}

        {publicationList.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              📚
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No publications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-600">
              Create your first publication to get started.
            </p>

            <Link
              href="/admin/publications/new"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Publication
            </Link>

          </div>

        ) : (

          <PublicationFilters
            publications={publicationList}
          />

        )}

      </div>

    </main>
  );
}
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
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                !
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Unable to load publications
                </h1>

                <p className="mt-1 text-sm text-slate-600">
                  Something went wrong while loading your publications.
                </p>

                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const publicationList: Publication[] = publications || [];

  const total = publicationList.length;

  const published = publicationList.filter(
    (publication) => publication.status === "published"
  ).length;

  const drafts = publicationList.filter(
    (publication) => publication.status !== "published"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

              <div className="max-w-3xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Knowledge & Resources
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Publications
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Manage your organization&apos;s reports, research,
                  books, guidelines, newsletters, and downloadable
                  resources from one central library.
                </p>

              </div>

              <Link
                href="/admin/publications/new"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              >
                <span className="text-lg leading-none transition-transform group-hover:rotate-90">
                  +
                </span>

                Add Publication
              </Link>

            </div>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* TOTAL */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Publications
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  {total}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                📚
              </div>

            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              All publication records
            </p>

          </div>

          {/* PUBLISHED */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Published
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-emerald-600">
                  {published}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                ✓
              </div>

            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              Visible to website visitors
            </p>

          </div>

          {/* DRAFTS */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Drafts
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-amber-600">
                  {drafts}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                ✎
              </div>

            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
              Not publicly visible
            </p>

          </div>

        </section>

        {/* PUBLICATION CONTENT */}
        <section className="mt-6">

          {publicationList.length === 0 ? (

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-3xl">
                📚
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-950">
                Your publication library is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Start building your organization&apos;s knowledge
                library by adding your first publication.
              </p>

              <Link
                href="/admin/publications/new"
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <span className="text-lg">+</span>
                Add First Publication
              </Link>

            </div>

          ) : (

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Publication Library
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Search, filter, and manage your resources.
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-400">
                  {total} {total === 1 ? "publication" : "publications"}
                </div>

              </div>

              <PublicationFilters
                publications={publicationList}
              />

            </div>

          )}

        </section>

      </div>
    </main>
  );
}
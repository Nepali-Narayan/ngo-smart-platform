import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicationDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

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
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("PUBLICATION ERROR:", error);

    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-800">
            Publication Error
          </h1>

          <p className="mt-4 text-red-700">
            {error.message}
          </p>

          <p className="mt-2 text-sm text-red-600">
            Slug: {slug}
          </p>
        </div>
      </main>
    );
  }

  if (!publication) {
    notFound();
  }

  const formattedDate = publication.published_date
    ? new Date(
        publication.published_date
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        {/* Background decoration */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.18),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-10">

          {/* BACK BUTTON */}

          <Link
            href="/publications"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <span>←</span>
            Back to Publications
          </Link>

          {/* HERO CONTENT */}

          <div className="mt-12 max-w-5xl">

            <div className="flex flex-wrap items-center gap-3">

              <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                {publication.type}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Published
              </span>

            </div>

            <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {publication.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">

              <span className="flex items-center gap-2">
                <span className="text-base">📅</span>
                Published {formattedDate}
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />

              <span className="flex items-center gap-2">
                <span className="text-base">📚</span>
                {publication.type}
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">

        <div className="grid gap-10 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">

          {/* =================================================
              LEFT - COVER
          ================================================= */}

          <aside>

            <div className="sticky top-8">

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">

                <div className="overflow-hidden rounded-2xl bg-slate-100">

                  {publication.cover_image ? (

                    <img
                      src={publication.cover_image}
                      alt={publication.title}
                      className="block aspect-[3/4] w-full object-cover"
                    />

                  ) : (

                    <div className="flex aspect-[3/4] flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">

                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-5xl shadow-lg">
                        📄
                      </div>

                      <p className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                        {publication.type}
                      </p>

                    </div>

                  )}

                </div>

              </div>

              {/* FILE ACTIONS */}

              {publication.file_url && (

                <div className="mt-5 space-y-3">

                  <a
                    href={publication.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    <span className="text-lg">📖</span>
                    Read Publication
                  </a>

                  <a
                    href={publication.file_url}
                    download
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    <span className="text-lg">↓</span>
                    Download PDF
                  </a>

                </div>

              )}

              {!publication.file_url && (

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-center">

                  <p className="text-sm font-semibold text-slate-600">
                    PDF not available
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    The publication file has not been uploaded yet.
                  </p>

                </div>

              )}

            </div>

          </aside>

          {/* =================================================
              RIGHT - INFORMATION
          ================================================= */}

          <div className="space-y-7">

            {/* ABOUT */}

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                  📖
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Publication
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                    About this publication
                  </h2>
                </div>

              </div>

              <div className="mt-7">

                {publication.description ? (

                  <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                    {publication.description}
                  </p>

                ) : (

                  <p className="text-base leading-7 text-slate-500">
                    No description is available for this publication.
                  </p>

                )}

              </div>

            </article>

            {/* INFORMATION */}

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                  ℹ️
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Details
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                    Publication Information
                  </h2>
                </div>

              </div>

              <div className="mt-8 divide-y divide-slate-100">

                {/* TYPE */}

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Publication Type
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                    {publication.type}
                  </span>

                </div>

                {/* DATE */}

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm font-medium text-slate-500">
                    Publication Date
                  </p>

                  <p className="font-semibold text-slate-900">
                    {formattedDate}
                  </p>

                </div>

                {/* STATUS */}

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm font-medium text-slate-500">
                    Status
                  </p>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    Published

                  </span>

                </div>

                {/* FILE */}

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm font-medium text-slate-500">
                    Publication File
                  </p>

                  <p className="font-semibold text-slate-900">
                    {publication.file_url
                      ? "PDF Available"
                      : "Not Available"}
                  </p>

                </div>

              </div>

            </article>

            {/* PDF CTA */}

            {publication.file_url && (

              <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 text-white shadow-xl shadow-blue-900/15 sm:p-9">

                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />

                <div className="relative">

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
                    Full Publication
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    Ready to read?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                    Open the complete publication or download the PDF
                    for offline reading.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <a
                      href={publication.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                    >
                      Open PDF →
                    </a>

                    <a
                      href={publication.file_url}
                      download
                      className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      Download PDF
                    </a>

                  </div>

                </div>

              </article>

            )}

            {/* BACK */}

            <div className="pt-2">

              <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
              >
                <span>←</span>
                Browse all publications
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
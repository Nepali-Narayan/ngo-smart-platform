import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Project = {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  summary: string | null;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  featured_image: string | null;
  status: string;
  impact_summary: string | null;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      slug,
      category,
      summary,
      description,
      location,
      start_date,
      end_date,
      budget,
      featured_image,
      status,
      impact_summary
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("PROJECT ERROR:", error);

    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-800">
            Project Error
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

  if (!project) {
    notFound();
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (budget: number | null) => {
    if (budget === null || budget === undefined) {
      return "Not specified";
    }

    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.18),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-10">

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <span>←</span>
            Back to Projects
          </Link>

          <div className="mt-12 max-w-5xl">

            <div className="flex flex-wrap items-center gap-3">

              {project.category && (
                <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                  {project.category}
                </span>
              )}

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Published
              </span>

            </div>

            <h1 className="mt-7 max-w-5xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            {project.summary && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {project.summary}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">

              {project.location && (
                <span className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  {project.location}
                </span>
              )}

              {project.start_date && (
                <span className="flex items-center gap-2">
                  <span className="text-base">📅</span>
                  {formatDate(project.start_date)}
                </span>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">

        <div className="grid gap-10 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">

          {/* LEFT */}

          <aside>

            <div className="sticky top-8">

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">

                <div className="overflow-hidden rounded-2xl bg-slate-100">

                  {project.featured_image ? (

                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="block aspect-[4/3] w-full object-cover"
                    />

                  ) : (

                    <div className="flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">

                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-5xl shadow-lg">
                        🌍
                      </div>

                      <p className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                        Project
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </aside>

          {/* RIGHT */}

          <div className="space-y-7">

            {/* ABOUT */}

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                  🌍
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Project
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                    About this project
                  </h2>
                </div>

              </div>

              <div className="mt-7">

                {project.description ? (

                  <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                    {project.description}
                  </p>

                ) : (

                  <p className="text-base leading-7 text-slate-500">
                    No description is available for this project.
                  </p>

                )}

              </div>

            </article>

            {/* PROJECT INFORMATION */}

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
                    Project Information
                  </h2>
                </div>

              </div>

              <div className="mt-8 divide-y divide-slate-100">

                {project.category && (
                  <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      Category
                    </p>

                    <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                      {project.category}
                    </span>
                  </div>
                )}

                {project.location && (
                  <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      Location
                    </p>

                    <p className="font-semibold text-slate-900">
                      {project.location}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Start Date
                  </p>

                  <p className="font-semibold text-slate-900">
                    {formatDate(project.start_date)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    End Date
                  </p>

                  <p className="font-semibold text-slate-900">
                    {formatDate(project.end_date)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Budget
                  </p>

                  <p className="font-semibold text-slate-900">
                    {formatBudget(project.budget)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Status
                  </p>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Published
                  </span>
                </div>

              </div>

            </article>

            {/* IMPACT */}

            {project.impact_summary && (
              <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 text-white shadow-xl shadow-blue-900/15 sm:p-9">

                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />

                <div className="relative">

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
                    Impact
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    Project Impact
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-blue-100">
                    {project.impact_summary}
                  </p>

                </div>

              </article>
            )}

            {/* BACK */}

            <div className="pt-2">

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
              >
                <span>←</span>
                Browse all projects
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

export default async function PublicationsPage() {
  const supabase = await createClient();

  const { data: publications, error } = await supabase
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
    .eq("status", "published")
    .order("published_date", {
      ascending: false,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-2xl font-bold text-red-800">
              Publications
            </h1>

            <p className="mt-3 text-red-700">
              Unable to load publications.
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">

          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Knowledge & Resources
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Publications
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Explore our reports, research, books, guidelines,
              newsletters and other publications.
            </p>

          </div>

        </div>
      </section>

      {/* Publications */}

      <section className="mx-auto max-w-6xl px-6 py-12">

        {!publications || publications.length === 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              📚
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No publications available
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              Published publications will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {publications.map(
              (publication: Publication) => (

                <Link
                  key={publication.id}
                 href={`/publications/${publication.slug}`}
                  className="group block"
                >

                  <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                    {/* Cover */}

                    <div className="relative h-64 overflow-hidden bg-slate-100">

                      {publication.cover_image ? (

                        <img
                          src={publication.cover_image}
                          alt={publication.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">

                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                            📄
                          </div>

                          <span className="mt-4 text-sm font-semibold text-slate-500">
                            Publication
                          </span>

                        </div>

                      )}

                      {/* Type */}

                      <div className="absolute left-4 top-4">

                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                          {publication.type}
                        </span>

                      </div>

                    </div>

                    {/* Content */}

                    <div className="flex min-h-[250px] flex-col p-6">

                      <h2 className="line-clamp-2 text-xl font-bold leading-7 text-slate-900 transition group-hover:text-blue-700">
                        {publication.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {publication.description ||
                          "Explore this publication and learn more about its contents."}
                      </p>

                      {publication.published_date && (
                        <p className="mt-4 text-xs font-medium text-slate-400">
                          Published{" "}
                          {new Date(
                            publication.published_date
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {/* Bottom */}

                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">

                        <span className="text-sm font-semibold text-blue-600">
                          View Publication
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                          →
                        </span>

                      </div>

                    </div>

                  </article>

                </Link>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}
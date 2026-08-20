import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

type GalleryPageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function GalleryPage({
  searchParams,
}: GalleryPageProps) {
  const { type } = await searchParams;

  const supabase = await createClient();

  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select(
      "id,title,description,type,file_url,thumbnail_url,category,location,published_date,status"
    )
    .eq("status", "published")
    .order("published_date", { ascending: false });

  const filter =
    type === "video"
      ? "video"
      : type === "image"
        ? "image"
        : "all";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="container-custom relative">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">
            Media & Stories
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
            Our Gallery
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore moments, stories, and memories from our work with
            communities.
          </p>

          {!error &&
            galleryItems &&
            galleryItems.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">

                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  {galleryItems.length} Media Items
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Photos & Videos
                </span>

              </div>
            )}

        </div>
      </section>

      {/* ERROR */}
      {error && (
        <section className="container-custom px-6 py-16">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">

            <strong>Gallery Error:</strong>{" "}
            {error.message}

          </div>

        </section>
      )}

      {/* GALLERY */}
      {!error && (
        <>
          {!galleryItems || galleryItems.length === 0 ? (

            <section className="container-custom px-6 py-16">

              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="text-5xl">
                  🖼️
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  No gallery items available
                </h2>

                <p className="mt-2 text-slate-500">
                  Images and videos will appear here once they are
                  published.
                </p>

              </div>

            </section>

          ) : (

            <GalleryClient
              key={filter}
              items={galleryItems}
              initialFilter={filter}
            />

          )}
        </>
      )}

    </main>
  );
}
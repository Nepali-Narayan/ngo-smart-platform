import { getPublishedBySlug } from "@/lib/site-data";

export const dynamic = "force-dynamic";

type AboutPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function AboutPage({
  searchParams,
}: AboutPageProps) {
  const { lang } = await searchParams;

  const language = lang === "ne" ? "ne" : "en";
  const isNepali = language === "ne";

  const page = await getPublishedBySlug(
    "pages",
    "about"
  );

  return (
    <main className="min-h-screen bg-white">

      {/* =====================================
          HERO
      ====================================== */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="container-custom relative">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
            {isNepali
              ? "हामी को हौं"
              : "Who we are"}
          </p>

          <h1 className="mt-3 text-5xl font-black">
            {page?.title ||
              (isNepali
                ? "हाम्रो बारेमा"
                : "About us")}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {isNepali
              ? "हाम्रो संस्था, उद्देश्य र समुदायप्रतिको हाम्रो प्रतिबद्धताबारे जान्नुहोस्।"
              : "Learn more about our organization, mission, and commitment to the community."}
          </p>

        </div>

      </section>

      {/* =====================================
          CONTENT
      ====================================== */}
      <article className="container-custom max-w-4xl py-14">

        {/* FEATURED IMAGE */}
        {page?.featured_image && (
          <img
            src={page.featured_image}
            alt={
              page.title ||
              (isNepali
                ? "हाम्रो बारेमा"
                : "About us")
            }
            className="mb-10 max-h-[500px] w-full rounded-2xl object-cover shadow-lg"
          />
        )}

        {/* CONTENT */}
        <div className="whitespace-pre-wrap text-lg leading-8 text-slate-700">

          {page?.content ? (
            page.content
          ) : (
            isNepali ? (
              <>
                प्रशासन प्यानलबाट{" "}
                <strong>Pages</strong> मा गएर{" "}
                <strong>about</strong> slug भएको
                Page सिर्जना गरी प्रकाशित गर्नुहोस्।
              </>
            ) : (
              <>
                Create and publish a Page with slug{" "}
                <strong>“about”</strong> from{" "}
                <strong>Admin → Pages</strong> to
                customize this page.
              </>
            )
          )}

        </div>

      </article>

    </main>
  );
}
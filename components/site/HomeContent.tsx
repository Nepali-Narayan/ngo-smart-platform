import Link from "next/link";

type Props = {
  settings: any;
  programs: any[];
  projects: any[];
  posts: any[];
  language: "en" | "ne";
};

export function HomeContent({
  settings,
  programs,
  projects,
  posts,
  language,
}: Props) {
  const primary =
    settings?.primary_color || "#155EEF";

  const isNepali = language === "ne";

  return (
    <main
      style={
        {
          "--brand-primary": primary,
        } as React.CSSProperties
      }
    >

      {/* =====================================
          HERO
      ====================================== */}
      <section className="bg-slate-950 px-6 py-24 text-white">

        <div className="container-custom grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">

          <div>

            <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              {settings?.site_name ||
                "NGO Smart Platform"}
            </span>

            <h1 className="mt-7 text-5xl font-black leading-tight md:text-6xl">
              {isNepali
                ? "सँगै दिगो परिवर्तन सिर्जना गरौं।"
                : settings?.tagline ||
                  "Creating sustainable change together."}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {isNepali
                ? "समुदायमा सकारात्मक परिवर्तन ल्याउन कार्यक्रम, परियोजना, कथा र अवसरहरू साझा गर्ने पारदर्शी र आधुनिक प्लेटफर्म।"
                : "A transparent, modern platform for sharing programs, projects, stories and opportunities to make a difference."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                href="/projects"
                className="btn-primary"
              >
                {isNepali
                  ? "हाम्रा परियोजनाहरू हेर्नुहोस्"
                  : "Explore our projects"}
              </Link>

              <Link
                href="/volunteer"
                className="rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10"
              >
                {isNepali
                  ? "स्वयंसेवक बन्नुहोस्"
                  : "Volunteer"}
              </Link>

            </div>

          </div>

          {/* =====================================
              STATISTICS
          ====================================== */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <p className="text-sm font-bold text-slate-300">
              {isNepali
                ? "हाम्रो काम"
                : "Our work"}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white/10 p-5">
                <b className="text-3xl">
                  {programs.length}
                </b>

                <p className="mt-1 text-sm text-slate-300">
                  {isNepali
                    ? "कार्यक्रमहरू"
                    : "Programs"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <b className="text-3xl">
                  {projects.length}
                </b>

                <p className="mt-1 text-sm text-slate-300">
                  {isNepali
                    ? "परियोजनाहरू"
                    : "Projects"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <b className="text-3xl">
                  {posts.length}
                </b>

                <p className="mt-1 text-sm text-slate-300">
                  {isNepali
                    ? "कथाहरू"
                    : "Stories"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <b className="text-3xl">
                  100%
                </b>

                <p className="mt-1 text-sm text-slate-300">
                  {isNepali
                    ? "समुदाय केन्द्रित"
                    : "Community-focused"}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          PROGRAMS
      ====================================== */}
      <section className="container-custom py-20">

        <div className="flex items-end justify-between gap-5">

          <div>

            <p className="section-label">
              {isNepali
                ? "हामी के गर्छौं"
                : "What we do"}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {isNepali
                ? "हाम्रा कार्यक्रमहरू"
                : "Our programs"}
            </h2>

          </div>

          <Link
            href="/programs"
            className="text-sm font-bold text-[var(--brand-primary)]"
          >
            {isNepali
              ? "सबै हेर्नुहोस् →"
              : "View all →"}
          </Link>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {programs.map((p) => (
            <article
              key={p.id}
              className="card overflow-hidden"
            >

              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.title || ""}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-6">

                <h3 className="text-xl font-black">
                  {p.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {p.summary}
                </p>

              </div>

            </article>
          ))}

        </div>

      </section>

      {/* =====================================
          PROJECTS
      ====================================== */}
      <section className="bg-slate-50 py-20">

        <div className="container-custom">

          <p className="section-label">
            {isNepali
              ? "प्रभाव"
              : "Impact"}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {isNepali
              ? "प्रमुख परियोजनाहरू"
              : "Featured projects"}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {projects.map((p) => (
              <article
                key={p.id}
                className="card overflow-hidden"
              >

                {p.featured_image && (
                  <img
                    src={p.featured_image}
                    alt={p.title || ""}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-6">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {p.category ||
                      (isNepali
                        ? "परियोजना"
                        : "Project")}
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600">
                    {p.summary}
                  </p>

                </div>

              </article>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================
          NEWS
      ====================================== */}
      <section className="container-custom py-20">

        <p className="section-label">
          {isNepali
            ? "पछिल्ला समाचार"
            : "Latest"}
        </p>

        <h2 className="mt-2 text-3xl font-black">
          {isNepali
            ? "समाचार तथा कथाहरू"
            : "News & stories"}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {posts.map((p) => (
            <article
              key={p.id}
              className="card overflow-hidden"
            >

              {p.featured_image && (
                <img
                  src={p.featured_image}
                  alt={p.title || ""}
                  className="h-44 w-full object-cover"
                />
              )}

              <div className="p-6">

                <h3 className="font-black">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {p.excerpt}
                </p>

              </div>

            </article>
          ))}

        </div>

      </section>

    </main>
  );
}
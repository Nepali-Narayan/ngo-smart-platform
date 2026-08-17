import Link from "next/link";

type Props = {
  settings: any;
  programs: any[];
  projects: any[];
  posts: any[];
};

export function HomeContent({ settings, programs, projects, posts }: Props) {
  const primary = settings?.primary_color || "#155EEF";

  return (
    <main style={{ "--brand-primary": primary } as React.CSSProperties}>
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="container-custom grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              {settings?.site_name || "NGO Smart Platform"}
            </span>
            <h1 className="mt-7 text-5xl font-black leading-tight md:text-6xl">
              {settings?.tagline || "Creating sustainable change together."}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A transparent, modern platform for sharing programs, projects, stories and opportunities to make a difference.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">Explore our projects</Link>
              <Link href="/volunteer" className="rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10">Volunteer</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-bold text-slate-300">Our work</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-5"><b className="text-3xl">{programs.length}</b><p className="mt-1 text-sm text-slate-300">Programs</p></div>
              <div className="rounded-2xl bg-white/10 p-5"><b className="text-3xl">{projects.length}</b><p className="mt-1 text-sm text-slate-300">Projects</p></div>
              <div className="rounded-2xl bg-white/10 p-5"><b className="text-3xl">{posts.length}</b><p className="mt-1 text-sm text-slate-300">Stories</p></div>
              <div className="rounded-2xl bg-white/10 p-5"><b className="text-3xl">100%</b><p className="mt-1 text-sm text-slate-300">Community-focused</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom py-20">
        <div className="flex items-end justify-between gap-5">
          <div><p className="section-label">What we do</p><h2 className="mt-2 text-3xl font-black">Our programs</h2></div>
          <Link href="/programs" className="text-sm font-bold text-[var(--brand-primary)]">View all →</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <article key={p.id} className="card overflow-hidden">
              {p.image_url && <img src={p.image_url} alt="" className="h-48 w-full object-cover" />}
              <div className="p-6"><h3 className="text-xl font-black">{p.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{p.summary}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-custom">
          <p className="section-label">Impact</p>
          <h2 className="mt-2 text-3xl font-black">Featured projects</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="card overflow-hidden">
                {p.featured_image && <img src={p.featured_image} alt="" className="h-48 w-full object-cover" />}
                <div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{p.category || "Project"}</p><h3 className="mt-2 text-xl font-black">{p.title}</h3><p className="mt-3 text-sm text-slate-600">{p.summary}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-20">
        <p className="section-label">Latest</p>
        <h2 className="mt-2 text-3xl font-black">News & stories</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <article key={p.id} className="card overflow-hidden">
              {p.featured_image && <img src={p.featured_image} alt="" className="h-44 w-full object-cover" />}
              <div className="p-6"><h3 className="font-black">{p.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{p.excerpt}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

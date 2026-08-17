import Link from "next/link";

export function DetailPage({ item, type }: { item: any; type: "program"|"project"|"post" }) {
  const image = item.featured_image || item.image_url;
  return (
    <main>
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="container-custom max-w-4xl">
          {item.category && <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{item.category}</p>}
          <h1 className="mt-3 text-4xl font-black md:text-5xl">{item.title}</h1>
          {(item.summary || item.excerpt) && <p className="mt-5 text-lg leading-8 text-slate-300">{item.summary || item.excerpt}</p>}
        </div>
      </section>
      <article className="container-custom max-w-4xl py-14">
        {image && <img src={image} alt="" className="mb-10 max-h-[520px] w-full rounded-2xl object-cover" />}
        {type === "project" && <div className="mb-8 grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3 text-sm">
          <div><b>Location</b><p className="mt-1 text-slate-600">{item.location || "—"}</p></div>
          <div><b>Start</b><p className="mt-1 text-slate-600">{item.start_date || "—"}</p></div>
          <div><b>End</b><p className="mt-1 text-slate-600">{item.end_date || "—"}</p></div>
        </div>}
        <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
          {item.content || item.description || item.impact_summary || "More information will be published soon."}
        </div>
        <Link href={`/${type === "post" ? "news" : `${type}s`}`} className="mt-10 inline-block font-bold text-[var(--brand-primary)]">← Back</Link>
      </article>
    </main>
  );
}

import Link from "next/link";

export function ContentCard({ item, type }: { item: any; type: "program" | "project" | "post" }) {
  const href = `/${type === "post" ? "news" : `${type}s`}/${item.slug}`;
  const image = item.featured_image || item.image_url;
  return (
    <article className="card overflow-hidden">
      {image && <img src={image} alt="" className="h-52 w-full object-cover" />}
      <div className="p-6">
        {item.category && <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.category}</p>}
        <h2 className="mt-2 text-xl font-black">{item.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.summary || item.excerpt || item.description}</p>
        <Link href={href} className="mt-5 inline-block text-sm font-bold text-[var(--brand-primary)]">Read more →</Link>
      </div>
    </article>
  );
}

import { ContentCard } from "./ContentCard";

export function ListingPage({ eyebrow, title, description, items, type }: { eyebrow: string; title: string; description: string; items: any[]; type: "program"|"project"|"post" }) {
  return (
    <main>
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="container-custom">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
        </div>
      </section>
      <section className="container-custom py-16">
        {items.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map(x => <ContentCard key={x.id} item={x} type={type} />)}</div> :
          <div className="rounded-2xl border border-dashed p-12 text-center text-slate-500">No published content yet.</div>}
      </section>
    </main>
  );
}

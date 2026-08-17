import { getPublishedBySlug } from "@/lib/site-data";
export const revalidate = 60;
export default async function AboutPage() {
  const page = await getPublishedBySlug("pages", "about");
  return <main>
    <section className="bg-slate-950 px-6 py-20 text-white"><div className="container-custom"><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Who we are</p><h1 className="mt-3 text-5xl font-black">{page?.title || "About us"}</h1></div></section>
    <article className="container-custom max-w-4xl py-14">
      {page?.featured_image && <img src={page.featured_image} alt="" className="mb-10 max-h-[500px] w-full rounded-2xl object-cover" />}
      <div className="whitespace-pre-wrap text-lg leading-8 text-slate-700">{page?.content || "Create and publish a Page with slug “about” from Admin → Pages to customize this page."}</div>
    </article>
  </main>;
}

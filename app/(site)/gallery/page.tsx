import { createClient } from "@/lib/supabase/server";
export const revalidate = 60;
export default async function GalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("id,file_name,file_url,alt_text").order("created_at", { ascending: false });
  return <main>
    <section className="bg-slate-950 px-6 py-20 text-white"><div className="container-custom"><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Media</p><h1 className="mt-3 text-5xl font-black">Gallery</h1><p className="mt-5 max-w-2xl text-lg text-slate-300">A visual record of our work and community.</p></div></section>
    <section className="container-custom py-16"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {(data ?? []).map(item => <figure key={item.id} className="overflow-hidden rounded-2xl bg-slate-100"><img src={item.file_url} alt={item.alt_text || item.file_name} className="aspect-[4/3] w-full object-cover" /><figcaption className="p-3 text-sm font-semibold">{item.alt_text || item.file_name}</figcaption></figure>)}
    </div></section>
  </main>;
}

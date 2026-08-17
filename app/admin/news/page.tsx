import { createClient } from "@/lib/supabase/server";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">News & Blog</h1>
      <p className="mt-2 text-slate-600">Create, edit and delete news & blog records.</p>
      {(params.error || error) && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error || error?.message}</div>}
      <div className="mt-8">
        <CrudTable table="posts" rows={data ?? []} createHref="/admin/news/new" createLabel="Add News & Blog" columns=["title","status","published_at"] />
      </div>
    </>
  );
}

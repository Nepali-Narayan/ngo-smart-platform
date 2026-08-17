import { createClient } from "@/lib/supabase/server";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Projects</h1>
      <p className="mt-2 text-slate-600">Create, edit and delete projects records.</p>
      {(params.error || error) && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error || error?.message}</div>}
      <div className="mt-8">
       <CrudTable
  table="projects"
  rows={data ?? []}
  createHref="/admin/projects/new"
  editBaseHref="/admin/projects"
  createLabel="Add Project"
  columns={["title", "category", "location", "status", "created_at"]}
/>
      </div>
    </>
  );
}

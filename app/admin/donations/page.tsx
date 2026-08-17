import { createClient } from "@/lib/supabase/server";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });

  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Donations</h1>
      <p className="mt-2 text-slate-600">Create, edit and delete donations records.</p>
      {(params.error || error) && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error || error?.message}</div>}
      <div className="mt-8">
        <CrudTable table="donations" rows={data ?? []} createHref="/admin/donations/new" createLabel="Add Donation" columns=["donor_name","amount","status","created_at"] />
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContentForm } from "@/components/admin/ContentForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("donations").select("*").eq("id", id).single();
  if (!data) notFound();
  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Edit Donation</h1>
      <p className="mt-2 text-slate-600">Update the record and save your changes.</p>
      <div className="mt-8"><ContentForm table="donations" record={data} title="Donation" /></div>
    </>
  );
}

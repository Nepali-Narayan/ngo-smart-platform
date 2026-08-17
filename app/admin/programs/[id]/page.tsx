import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContentForm } from "@/components/admin/ContentForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [recordResult, mediaResult] = await Promise.all([
    supabase.from("programs").select("*").eq("id", id).single(),
    supabase.from("media").select("id,file_name,file_url,alt_text").order("created_at", { ascending: false }),
  ]);
  if (!recordResult.data) notFound();

  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Edit Program</h1>
      <p className="mt-2 text-slate-600">Update the record and select an image from your media library.</p>
      <div className="mt-8"><ContentForm table="programs" record={recordResult.data} media={mediaResult.data ?? []} title="Program" /></div>
    </>
  );
}

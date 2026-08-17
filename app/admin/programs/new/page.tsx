import { createClient } from "@/lib/supabase/server";
import { ContentForm } from "@/components/admin/ContentForm";

export default async function NewPage() {
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("media")
    .select("id,file_name,file_url,alt_text")
    .order("created_at", { ascending: false });

  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Create Program</h1>
      <p className="mt-2 text-slate-600">Add content and select an image from your media library.</p>
      <div className="mt-8"><ContentForm table="programs" media={media ?? []} title="Program" /></div>
    </>
  );
}

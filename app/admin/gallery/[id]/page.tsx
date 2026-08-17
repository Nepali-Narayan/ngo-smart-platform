import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MediaForm } from "@/components/admin/MediaForm";
export default async function EditMedia({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").eq("id", id).single();
  if (!data) notFound();
  return <><p className="section-label">Media</p><h1 className="mt-2 text-3xl font-black">Edit media</h1><div className="mt-8"><MediaForm record={data} /></div></>;
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditPublicationForm from "./EditPublicationForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPublicationPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: publication,
    error,
  } = await supabase
    .from("publications")
    .select(`
      id,
      title,
      slug,
      type,
      description,
      cover_image,
      file_url,
      published_date,
      status
    `)
    .eq("id", id)
    .single();

  if (error || !publication) {
    notFound();
  }

  return (
    <EditPublicationForm
      publication={publication}
    />
  );
}
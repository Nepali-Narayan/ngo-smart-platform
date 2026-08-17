import { notFound } from "next/navigation";
import { getPublishedBySlug } from "@/lib/site-data";
import { DetailPage } from "@/components/site/DetailPage";

export const revalidate = 60;

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublishedBySlug("programs", slug);
  if (!item) notFound();
  return <DetailPage item={item} type="program" />;
}

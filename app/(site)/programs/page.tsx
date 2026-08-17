import { getPublished } from "@/lib/site-data";
import { ListingPage } from "@/components/site/ListingPage";

export const revalidate = 60;

export default async function Page() {
  const items = await getPublished("programs", 50);
  return <ListingPage eyebrow="Programs" title="Programs" description="Our programs turn community needs into practical, sustainable action." items={items} type="program" />;
}

import { getPublished } from "@/lib/site-data";
import { ListingPage } from "@/components/site/ListingPage";

export const revalidate = 60;

export default async function Page() {
  const items = await getPublished("projects", 50);
  return <ListingPage eyebrow="Projects" title="Projects" description="Explore our projects, locations, timelines and impact." items={items} type="project" />;
}

import { getPublished } from "@/lib/site-data";
import { ListingPage } from "@/components/site/ListingPage";

export const revalidate = 60;

export default async function Page() {
  const items = await getPublished("posts", 50);
  return <ListingPage eyebrow="News & Stories" title="News & Stories" description="Updates, stories and announcements from our organization." items={items} type="post" />;
}

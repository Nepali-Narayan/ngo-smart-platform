import { getPublished, getSiteSettings } from "@/lib/site-data";
import { HomeContent } from "@/components/site/HomeContent";
export const revalidate = 60;
export default async function HomePage() {
  const [settings, programs, projects, posts] = await Promise.all([
    getSiteSettings(), getPublished("programs", 6), getPublished("projects", 6), getPublished("posts", 6)
  ]);
  return <HomeContent settings={settings} programs={programs} projects={projects} posts={posts} />;
}

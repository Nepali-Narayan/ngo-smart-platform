import { getPublished, getSiteSettings } from "@/lib/site-data";
import { HomeContent } from "@/components/site/HomeContent";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const { lang } = await searchParams;

  const language = lang === "ne" ? "ne" : "en";

  const [settings, programs, projects, posts] =
    await Promise.all([
      getSiteSettings(),
      getPublished("programs", 6),
      getPublished("projects", 6),
      getPublished("posts", 6),
    ]);

  return (
    <HomeContent
      settings={settings}
      programs={programs}
      projects={projects}
      posts={posts}
      language={language}
    />
  );
}
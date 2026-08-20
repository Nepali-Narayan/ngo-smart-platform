import { getPublished } from "@/lib/site-data";
import { ListingPage } from "@/components/site/ListingPage";

export const dynamic = "force-dynamic";

type ProjectsPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { lang } = await searchParams;

  const language = lang === "ne" ? "ne" : "en";

  const items = await getPublished("projects", 50);

  const translatedItems = items.map((item: any) => ({
    ...item,

    title:
      language === "ne" && item.title_ne
        ? item.title_ne
        : item.title,

    summary:
      language === "ne" && item.summary_ne
        ? item.summary_ne
        : item.summary,
  }));

  return (
    <ListingPage
      eyebrow={
        language === "ne"
          ? "परियोजनाहरू"
          : "Projects"
      }
      title={
        language === "ne"
          ? "हाम्रा परियोजनाहरू"
          : "Projects"
      }
      description={
        language === "ne"
          ? "हाम्रा परियोजनाहरू, स्थान, समयरेखा र प्रभावबारे जानकारी लिनुहोस्।"
          : "Explore our projects, locations, timelines and impact."
      }
      items={translatedItems}
      type="project"
      language={language}
    />
  );
}
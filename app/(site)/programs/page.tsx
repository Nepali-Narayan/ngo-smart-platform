import { getPublished } from "@/lib/site-data";
import { ListingPage } from "@/components/site/ListingPage";

export const dynamic = "force-dynamic";

type ProgramsPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function ProgramsPage({
  searchParams,
}: ProgramsPageProps) {
  const { lang } = await searchParams;

  const language = lang === "ne" ? "ne" : "en";

  const items = await getPublished("programs", 50);

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
      eyebrow={language === "ne" ? "कार्यक्रमहरू" : "Programs"}
      title={language === "ne" ? "हाम्रा कार्यक्रमहरू" : "Programs"}
      description={
        language === "ne"
          ? "हाम्रा कार्यक्रमहरूले समुदायका आवश्यकताहरूलाई व्यावहारिक र दिगो कार्यमा रूपान्तरण गर्छन्।"
          : "Our programs turn community needs into practical, sustainable action."
      }
      items={translatedItems}
      type="program"
      language={language}
    />
  );
}
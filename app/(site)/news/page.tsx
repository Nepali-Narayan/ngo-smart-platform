import { getPublished } from "@/lib/site-data";
import { ListingPage } from "@/components/site/ListingPage";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function Page({
  searchParams,
}: PageProps) {
  const { lang } = await searchParams;

  const language = lang === "ne" ? "ne" : "en";

  const items = await getPublished("posts", 50);

  return (
    <ListingPage
      eyebrow={
        language === "ne"
          ? "समाचार तथा कथाहरू"
          : "News & Stories"
      }
      title={
        language === "ne"
          ? "समाचार तथा कथाहरू"
          : "News & Stories"
      }
      description={
        language === "ne"
          ? "हाम्रो संस्थाका समाचार, कथा र महत्वपूर्ण अपडेटहरू।"
          : "Updates, stories and announcements from our organization."
      }
      items={items}
      type="post"
      language={language}
    />
  );
}

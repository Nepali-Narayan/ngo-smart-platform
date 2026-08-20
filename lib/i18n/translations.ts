export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      programs: "Programs",
      projects: "Projects",
      news: "News",
      publications: "Publications",
      gallery: "Gallery",
      volunteer: "Volunteer",
      donate: "Donate",
      admin: "Admin",
    },

    gallery: {
      allMedia: "All Media",
      pictures: "Pictures",
      videos: "Videos",
      title: "Our Gallery",
      subtitle:
        "Explore moments, stories, and memories from our work with communities.",
      mediaStories: "Media & Stories",
      noItems: "No gallery items available",
      noItemsDescription:
        "Images and videos will appear here once they are published.",
    },
  },

  ne: {
    nav: {
      home: "गृहपृष्ठ",
      about: "हाम्रो बारेमा",
      programs: "कार्यक्रमहरू",
      projects: "परियोजनाहरू",
      news: "समाचार",
      publications: "प्रकाशनहरू",
      gallery: "ग्यालरी",
      volunteer: "स्वयंसेवक",
      donate: "सहयोग गर्नुहोस्",
      admin: "प्रशासन",
    },

    gallery: {
      allMedia: "सबै सामग्री",
      pictures: "तस्बिरहरू",
      videos: "भिडियोहरू",
      title: "हाम्रो ग्यालरी",
      subtitle:
        "समुदायसँगको हाम्रो कामका तस्बिर, कथा र सम्झनाहरू हेर्नुहोस्।",
      mediaStories: "मिडिया तथा कथाहरू",
      noItems: "कुनै ग्यालरी सामग्री उपलब्ध छैन",
      noItemsDescription:
        "प्रकाशित भएपछि तस्बिर र भिडियोहरू यहाँ देखिनेछन्।",
    },
  },
} as const;

export type Language = keyof typeof translations;
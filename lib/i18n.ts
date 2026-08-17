export type Locale = "en" | "ne";

export const translations = {
  en: {
    home: "Home", about: "About", programs: "Programs", projects: "Projects",
    news: "News", gallery: "Gallery", volunteer: "Volunteer", donate: "Donate",
    contact: "Contact", readMore: "Read more →", submit: "Submit",
  },
  ne: {
    home: "गृहपृष्ठ", about: "हाम्रो बारेमा", programs: "कार्यक्रमहरू", projects: "परियोजनाहरू",
    news: "समाचार", gallery: "ग्यालरी", volunteer: "स्वयंसेवक", donate: "दान गर्नुहोस्",
    contact: "सम्पर्क", readMore: "थप पढ्नुहोस् →", submit: "पेश गर्नुहोस्",
  },
} as const;

export function getLocale(value?: string): Locale {
  return value === "ne" ? "ne" : "en";
}

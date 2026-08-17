export const siteConfig = {
  name: "NGO Smart Platform",
  shortName: "NGO Smart",
  description:
    "A reusable, modern NGO website platform for education, community development, humanitarian action and social impact.",
  tagline: "Building stronger communities, together.",
  logoText: "NGO",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Projects", href: "#projects" },
    { label: "Stories", href: "#stories" },
    { label: "Contact", href: "#contact" }
  ],
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#"
  },
  contact: {
    email: "hello@example.org",
    phone: "+977 01 0000000",
    address: "Kathmandu, Nepal"
  }
} as const;

export const theme = {
  colors: {
    primary: "#155EEF",
    secondary: "#0B4DBB",
    accent: "#F59E0B",
    dark: "#0F172A",
    muted: "#64748B",
    light: "#F8FAFC"
  }
} as const;
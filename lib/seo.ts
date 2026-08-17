export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function buildMetadata(settings: any, title?: string, description?: string) {
  const siteName = settings?.site_name || "NGO Smart Platform";
  return {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || settings?.meta_description || settings?.tagline || "",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      title: title || siteName,
      description: description || settings?.meta_description || settings?.tagline || "",
      siteName,
      type: "website",
      images: settings?.logo_url ? [{ url: settings.logo_url }] : undefined,
    },
  };
}

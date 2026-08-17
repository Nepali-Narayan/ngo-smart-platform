import { getSiteSettings } from "@/lib/site-data";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const primary = settings?.primary_color || "#155EEF";
  return <div style={{ "--brand-primary": primary } as React.CSSProperties} className="min-h-screen">
    <SiteHeader settings={settings} />{children}<SiteFooter settings={settings} />
  </div>;
}

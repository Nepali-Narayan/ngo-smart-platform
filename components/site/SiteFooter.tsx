import Link from "next/link";

export function SiteFooter({ settings }: { settings: any }) {
  const name = settings?.site_name || "NGO Smart Platform";
  return (
    <footer className="bg-slate-950 px-6 py-14 text-slate-300">
      <div className="container-custom grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-black text-white">{name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6">{settings?.tagline || "Creating sustainable change together."}</p>
        </div>
        <div>
          <h4 className="font-bold text-white">Explore</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/about">About</Link><Link href="/programs">Programs</Link><Link href="/projects">Projects</Link><Link href="/news">News</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white">Get involved</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/volunteer">Volunteer</Link><Link href="/donate">Donate</Link><Link href="/gallery">Gallery</Link><Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="container-custom mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </footer>
  );
}

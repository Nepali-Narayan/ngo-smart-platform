import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader({ settings }: { settings: any }) {
  const name = settings?.site_name || "NGO Smart Platform";
  const logo = settings?.logo_url;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-custom flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {logo ? <img src={logo} alt={name} className="h-11 w-11 rounded-xl object-cover" /> :
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)] text-lg font-black text-white">N</span>}
          <span className="truncate text-lg font-black">{name}</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/programs" className="nav-link">Programs</Link>
          <Link href="/projects" className="nav-link">Projects</Link>
          <Link href="/news" className="nav-link">News</Link>
          <Link href="/publications" className="nav-link"> Publications </Link>aa
          <Link href="/gallery" className="nav-link">Gallery</Link>
          <Link href="/volunteer" className="nav-link">Volunteer</Link>
        </nav>
        <div className="flex items-center gap-2"><LanguageSwitcher />
          <Link href="/donate" className="btn-primary">Donate</Link>
          <Link href="/admin/login" className="hidden rounded-xl border px-4 py-2 text-sm font-bold md:inline-flex">Admin</Link>
        </div>
      </div>
    </header>
  );
}

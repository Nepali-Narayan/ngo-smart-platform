import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="container-custom grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm leading-7 text-slate-400">{siteConfig.description}</p>
        </div>
        <div>
          <h3 className="font-bold text-white">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm">
            {siteConfig.nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">{item.label}</Link>
            ))}
          </div>
        </div>
        <div id="contact">
          <h3 className="font-bold text-white">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>{siteConfig.contact.address}</p>
            <p>{siteConfig.contact.email}</p>
            <p>{siteConfig.contact.phone}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col gap-2 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Built as a reusable NGO platform.</p>
        </div>
      </div>
    </footer>
  );
}
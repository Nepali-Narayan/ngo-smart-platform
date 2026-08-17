 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, FolderKanban, Newspaper, Images, Users,
  HeartHandshake, Settings, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/admin/login/actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/programs", label: "Programs", icon: FolderKanban },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/news", label: "News & Blog", icon: Newspaper },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/volunteers", label: "Volunteers", icon: Users },
  { href: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-18 items-center justify-between border-b border-slate-100 px-5">
        <Link href="/admin" className="font-black text-slate-950">
          NGO <span className="text-[var(--brand-primary)]">Smart</span>
        </Link>
        <button className="md:hidden" onClick={() => setMobileOpen(false)}><X /></button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                active ? "bg-blue-50 text-[var(--brand-primary)]" : "text-slate-600 hover:bg-slate-50"
              }`}>
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
      ><Menu /></button>
      {mobileOpen && <div className="fixed inset-0 z-50 flex md:hidden">{nav}</div>}
      <div className="hidden h-screen md:block">{nav}</div>
    </>
  );
}

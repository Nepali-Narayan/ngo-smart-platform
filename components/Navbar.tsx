"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container-custom flex h-18 items-center justify-between gap-6 py-3">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-[var(--brand-primary)]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="#donate" className="btn-primary">
            <Heart size={17} fill="currentColor" />
            Donate
          </Link>
        </nav>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="container-custom flex flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link href="#donate" onClick={() => setOpen(false)} className="btn-primary mt-2">
              <Heart size={17} fill="currentColor" />
              Donate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
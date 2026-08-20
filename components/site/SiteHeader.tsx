"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader({
  settings,
}: {
  settings: any;
}) {
  const name =
    settings?.site_name ||
    "NGO Smart Platform";

  const logo = settings?.logo_url;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * KEEP CURRENT LANGUAGE
   */
  const language =
    searchParams.get("lang") === "ne"
      ? "ne"
      : "en";

  /*
   * CREATE NAVIGATION URL
   */
  function navUrl(path: string) {
    return `${path}?lang=${language}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="container-custom flex h-20 items-center justify-between gap-6">

        {/* =================================
            LOGO
        ================================= */}
        <Link
          href={navUrl("/")}
          className="flex min-w-0 items-center gap-3"
        >

          {logo ? (
            <img
              src={logo}
              alt={name}
              className="h-11 w-11 rounded-xl object-cover"
            />
          ) : (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)] text-lg font-black text-white">
              N
            </span>
          )}

          <span className="truncate text-lg font-black">
            {name}
          </span>

        </Link>

        {/* =================================
            DESKTOP NAVIGATION
        ================================= */}
        <nav className="hidden items-center gap-6 lg:flex">

          {/* HOME */}
          <Link
            href={navUrl("/")}
            className="nav-link"
          >
            {language === "ne"
              ? "गृहपृष्ठ"
              : "Home"}
          </Link>

          {/* ABOUT */}
          <Link
            href={navUrl("/about")}
            className="nav-link"
          >
            {language === "ne"
              ? "हाम्रो बारेमा"
              : "About"}
          </Link>

          {/* PROGRAMS */}
          <Link
            href={navUrl("/programs")}
            className="nav-link"
          >
            {language === "ne"
              ? "कार्यक्रमहरू"
              : "Programs"}
          </Link>

          {/* PROJECTS */}
          <Link
            href={navUrl("/projects")}
            className="nav-link"
          >
            {language === "ne"
              ? "परियोजनाहरू"
              : "Projects"}
          </Link>

          {/* NEWS */}
          <Link
            href={navUrl("/news")}
            className="nav-link"
          >
            {language === "ne"
              ? "समाचार"
              : "News"}
          </Link>

          {/* PUBLICATIONS */}
          <Link
            href={navUrl("/publications")}
            className="nav-link"
          >
            {language === "ne"
              ? "प्रकाशनहरू"
              : "Publications"}
          </Link>

          {/* =================================
              GALLERY
          ================================= */}
          <div className="group relative">

            <button
              type="button"
              className="nav-link flex items-center gap-1"
            >
              {language === "ne"
                ? "ग्यालरी"
                : "Gallery"}

              <span className="text-xs">
                ▼
              </span>
            </button>

            {/* DROPDOWN */}
            <div
              className="
                absolute left-0 top-full z-[9999]
                w-52 pt-3
                opacity-0 invisible
                translate-y-1
                pointer-events-none
                transition-all duration-200
                group-hover:visible
                group-hover:opacity-100
                group-hover:translate-y-0
                group-hover:pointer-events-auto
              "
            >

              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">

                {/* ALL MEDIA */}
                <Link
                  href={navUrl("/gallery")}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <span>🖼️</span>

                  <span>
                    {language === "ne"
                      ? "सबै सामग्री"
                      : "All Media"}
                  </span>
                </Link>

                {/* PICTURES */}
                <Link
                  href={`${navUrl(
                    "/gallery"
                  )}&type=image`}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <span>📷</span>

                  <span>
                    {language === "ne"
                      ? "तस्बिरहरू"
                      : "Pictures"}
                  </span>
                </Link>

                {/* VIDEOS */}
                <Link
                  href={`${navUrl(
                    "/gallery"
                  )}&type=video`}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <span>🎥</span>

                  <span>
                    {language === "ne"
                      ? "भिडियोहरू"
                      : "Videos"}
                  </span>
                </Link>

              </div>

            </div>

          </div>

          {/* VOLUNTEER */}
          <Link
            href={navUrl("/volunteer")}
            className="nav-link"
          >
            {language === "ne"
              ? "स्वयंसेवा"
              : "Volunteer"}
          </Link>

        </nav>

        {/* =================================
            RIGHT SIDE
        ================================= */}
        <div className="flex items-center gap-2">

          <LanguageSwitcher />

          {/* DONATE */}
          <Link
            href={navUrl("/donate")}
            className="btn-primary"
          >
            {language === "ne"
              ? "दान गर्नुहोस्"
              : "Donate"}
          </Link>

          {/* ADMIN */}
          <Link
            href="/admin/login"
            className="hidden rounded-xl border px-4 py-2 text-sm font-bold md:inline-flex"
          >
            Admin
          </Link>

        </div>

      </div>

    </header>
  );
}
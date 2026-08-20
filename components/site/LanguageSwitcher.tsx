"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const current =
    searchParams.get("lang") === "ne"
      ? "ne"
      : "en";

  function setLanguage(lang: "en" | "ne") {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("lang", lang);

    const query = params.toString();

    router.push(
      query
        ? `${pathname}?${query}`
        : pathname
    );

    router.refresh();
  }

  return (
    <div className="flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-bold shadow-sm">

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-md px-3 py-1.5 transition ${
          current === "en"
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("ne")}
        className={`rounded-md px-3 py-1.5 transition ${
          current === "ne"
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        ने
      </button>

    </div>
  );
}
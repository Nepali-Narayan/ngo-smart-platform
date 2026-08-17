 "use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const current = search.get("lang") === "ne" ? "ne" : "en";

  function setLanguage(lang: "en" | "ne") {
    const params = new URLSearchParams(search.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex rounded-lg border bg-white p-1 text-xs font-bold">
      <button onClick={() => setLanguage("en")} className={`rounded-md px-2 py-1 ${current === "en" ? "bg-slate-900 text-white" : ""}`}>EN</button>
      <button onClick={() => setLanguage("ne")} className={`rounded-md px-2 py-1 ${current === "ne" ? "bg-slate-900 text-white" : ""}`}>ने</button>
    </div>
  );
}

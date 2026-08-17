import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 font-extrabold" aria-label={siteConfig.name}>
      <span
        className="grid h-10 w-10 place-items-center rounded-xl text-sm text-white shadow-sm"
        style={{ background: "var(--brand-primary)" }}
      >
        {siteConfig.logoText}
      </span>
      <span className="hidden text-lg sm:block">{siteConfig.shortName}</span>
    </Link>
  );
}
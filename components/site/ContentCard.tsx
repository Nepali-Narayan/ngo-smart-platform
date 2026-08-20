import Link from "next/link";

type ContentCardProps = {
  item: any;
  type: "program" | "project" | "post";
  language?: "en" | "ne";
};

export function ContentCard({
  item,
  type,
  language = "en",
}: ContentCardProps) {
  const isNepali = language === "ne";

  const title =
    isNepali && item.title_ne
      ? item.title_ne
      : item.title || "";

  const summary =
    isNepali && item.summary_ne
      ? item.summary_ne
      : type === "post"
        ? item.excerpt || ""
        : item.summary || "";

  const image =
    item.image_url ||
    item.featured_image ||
    item.cover_image ||
    null;

  let typeLabel = "";

  if (type === "program") {
    typeLabel = isNepali ? "कार्यक्रम" : "Program";
  } else if (type === "project") {
    typeLabel = isNepali ? "परियोजना" : "Project";
  } else {
    typeLabel = isNepali ? "समाचार" : "News";
  }

  let href = "#";

  if (type === "program") {
    href = `/programs/${item.slug || item.id}?lang=${language}`;
  } else if (type === "project") {
    href = `/projects/${item.slug || item.id}?lang=${language}`;
  } else if (type === "post") {
    href = `/news/${item.slug || item.id}?lang=${language}`;
  }

  const publishedDate =
    item.published_date ||
    item.published_at ||
    item.created_at ||
    null;

  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
        {/* IMAGE */}
        {image ? (
          <div className="relative h-52 overflow-hidden bg-slate-100">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-lg backdrop-blur">
                {typeLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200">
            <div className="text-6xl">
              {type === "program"
                ? "🎯"
                : type === "project"
                  ? "🌍"
                  : "📰"}
            </div>

            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-lg">
                {typeLabel}
              </span>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-6">
          <h2 className="line-clamp-2 text-xl font-black leading-7 text-slate-900 transition group-hover:text-blue-600">
            {title}
          </h2>

          {summary && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
              {summary}
            </p>
          )}

          {/* CATEGORY */}
          {item.category && (
            <div className="mt-4">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {item.category}
              </span>
            </div>
          )}

          {/* DATE */}
          {publishedDate && (
            <p className="mt-4 text-xs font-medium text-slate-400">
              {new Date(publishedDate).toLocaleDateString(
                isNepali ? "ne-NP" : "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </p>
          )}

          {/* FOOTER */}
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-sm font-bold text-blue-600">
              {isNepali ? "थप विवरण हेर्नुहोस्" : "View details"}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
import { ContentCard } from "./ContentCard";

type Language = "en" | "ne";

type ListingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: any[];
  type: "program" | "project" | "post";
  language?: Language;
};

export function ListingPage({
  eyebrow,
  title,
  description,
  items,
  type,
  language = "en",
}: ListingPageProps) {
  const isNepali = language === "ne";

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="container-custom">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {description}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-custom py-16">
        {items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                type={type}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <div className="text-5xl">
              {type === "post"
                ? "📰"
                : type === "program"
                  ? "🎯"
                  : "🌍"}
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {isNepali
                ? "हाल कुनै प्रकाशित सामग्री छैन।"
                : "No published content yet."}
            </h2>

            <p className="mt-2 text-slate-500">
              {isNepali
                ? "प्रकाशित सामग्री यहाँ देखिनेछ।"
                : "Published content will appear here."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
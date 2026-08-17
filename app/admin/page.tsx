import Link from "next/link";
import { ArrowRight, FileText, FolderKanban, HeartHandshake, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const tables = ["pages", "programs", "projects", "posts", "volunteers", "donations"];
  const counts: Record<string, number> = {};

  await Promise.all(
    tables.map(async (table) => {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      counts[table] = count ?? 0;
    })
  );

  const cards = [
    ["Pages", "pages", FileText],
    ["Programs", "programs", FolderKanban],
    ["Projects", "projects", FolderKanban],
    ["News", "posts", FileText],
    ["Volunteers", "volunteers", Users],
    ["Donations", "donations", HeartHandshake],
  ] as const;

  return (
    <>
      <div>
        <p className="section-label">Control center</p>
        <h1 className="mt-2 text-3xl font-black">Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage the content and operations of your NGO website.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, table, Icon]) => (
          <div key={table} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[var(--brand-primary)]"><Icon size={19} /></div>
              <span className="text-3xl font-black">{counts[table] ?? 0}</span>
            </div>
            <p className="mt-5 font-bold">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-black">Quick actions</h2>
          <div className="mt-5 grid gap-3">
            <Link href="/admin/projects" className="flex items-center justify-between rounded-xl border p-4 font-semibold hover:bg-slate-50">
              Manage projects <ArrowRight size={18} />
            </Link>
            <Link href="/admin/news" className="flex items-center justify-between rounded-xl border p-4 font-semibold hover:bg-slate-50">
              Publish news <ArrowRight size={18} />
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between rounded-xl border p-4 font-semibold hover:bg-slate-50">
              Configure website <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-black">Next modules</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li>• Add CRUD forms for programs, projects and pages.</li>
            <li>• Connect the media library to Supabase Storage.</li>
            <li>• Add English/Nepali content fields.</li>
            <li>• Add donation payment integrations.</li>
            <li>• Add AI content and chatbot tools.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";
import { updateSiteSettings } from "@/app/admin/actions";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).single();
  return (
    <>
      <p className="section-label">Platform</p>
      <h1 className="mt-2 text-3xl font-black">Website settings</h1>
      <p className="mt-2 text-slate-600">Control reusable branding and language defaults.</p>
      {params.saved && <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">Settings saved.</div>}
      {params.error && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error}</div>}
      <form action={updateSiteSettings} className="card mt-8 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="label">Site name</span><input name="site_name" required defaultValue={data?.site_name ?? ""} className="input" /></label>
          <label className="block md:col-span-2"><span className="label">Tagline</span><input name="tagline" defaultValue={data?.tagline ?? ""} className="input" /></label>
          <label className="block md:col-span-2"><span className="label">Logo URL</span><input name="logo_url" type="url" defaultValue={data?.logo_url ?? ""} className="input" /></label>
          <label className="block"><span className="label">Primary color</span><input name="primary_color" type="text" defaultValue={data?.primary_color ?? "#155EEF"} className="input" /></label>
          <label className="block"><span className="label">Secondary color</span><input name="secondary_color" type="text" defaultValue={data?.secondary_color ?? "#0B4DBB"} className="input" /></label>
          <label className="block"><span className="label">Accent color</span><input name="accent_color" type="text" defaultValue={data?.accent_color ?? "#F59E0B"} className="input" /></label>
          <label className="block"><span className="label">Default language</span><select name="default_language" defaultValue={data?.default_language ?? "en"} className="input"><option value="en">English</option><option value="ne">Nepali</option></select></label>
        </div>
        <div className="mt-6 flex justify-end"><button className="btn-primary">Save settings</button></div>
      </form>
    </>
  );
}

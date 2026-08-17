import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function submitVolunteer(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("volunteers").insert({
    full_name: String(formData.get("full_name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    interests: String(formData.get("interests") || "") || null,
    message: String(formData.get("message") || "") || null,
    status: "new"
  });
  redirect(error ? "/volunteer?error=1" : "/volunteer?sent=1");
}

export default async function VolunteerPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const q = await searchParams;
  return <main>
    <section className="bg-slate-950 px-6 py-20 text-white"><div className="container-custom"><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Get involved</p><h1 className="mt-3 text-5xl font-black">Volunteer</h1><p className="mt-5 max-w-2xl text-lg text-slate-300">Share your skills, time and ideas with our community.</p></div></section>
    <section className="container-custom max-w-3xl py-14">
      {q.sent && <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">Thank you. Your volunteer application has been received.</div>}
      {q.error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">We could not submit your application. Please try again.</div>}
      <form action={submitVolunteer} className="card grid gap-5 p-6 md:grid-cols-2">
        <label><span className="label">Full name</span><input required name="full_name" className="input" /></label>
        <label><span className="label">Email</span><input required type="email" name="email" className="input" /></label>
        <label><span className="label">Phone</span><input name="phone" className="input" /></label>
        <label><span className="label">Interests / skills</span><input name="interests" className="input" /></label>
        <label className="md:col-span-2"><span className="label">Message</span><textarea name="message" className="input min-h-36" /></label>
        <div className="md:col-span-2 flex justify-end"><button className="btn-primary">Submit application</button></div>
      </form>
    </section>
  </main>;
}

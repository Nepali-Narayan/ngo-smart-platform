import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function submitContact(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    subject: String(formData.get("subject") || "") || null,
    message: String(formData.get("message") || ""),
    status: "new",
  });
  redirect(error ? "/contact?error=1" : "/contact?sent=1");
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const q = await searchParams;
  return <main>
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="container-custom">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Get in touch</p>
        <h1 className="mt-3 text-5xl font-black">Contact us</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-300">Have a question, partnership idea or community request? Send us a message.</p>
      </div>
    </section>
    <section className="container-custom max-w-3xl py-14">
      {q.sent && <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">Thank you. Your message has been received.</div>}
      {q.error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">We could not submit your message. Check the database setup and try again.</div>}
      <form action={submitContact} className="card grid gap-5 p-6 md:grid-cols-2">
        <label><span className="label">Name</span><input required name="name" className="input" /></label>
        <label><span className="label">Email</span><input required type="email" name="email" className="input" /></label>
        <label><span className="label">Phone</span><input name="phone" className="input" /></label>
        <label><span className="label">Subject</span><input name="subject" className="input" /></label>
        <label className="md:col-span-2"><span className="label">Message</span><textarea required name="message" className="input min-h-40" /></label>
        <div className="md:col-span-2 flex justify-end"><button className="btn-primary">Send message</button></div>
      </form>
    </section>
  </main>;
}

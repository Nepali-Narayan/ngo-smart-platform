import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function submitDonation(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("donations").insert({
    donor_name: String(formData.get("donor_name") || ""),
    donor_email: String(formData.get("donor_email") || "") || null,
    amount: Number(formData.get("amount") || 0),
    currency: String(formData.get("currency") || "NPR"),
    payment_method: String(formData.get("payment_method") || "") || null,
    campaign: String(formData.get("campaign") || "") || null,
    status: "pending"
  });
  redirect(error ? "/donate?error=1" : "/donate?submitted=1");
}

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ submitted?: string; error?: string }> }) {
  const q = await searchParams;
  return <main>
    <section className="bg-slate-950 px-6 py-20 text-white"><div className="container-custom"><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Support our work</p><h1 className="mt-3 text-5xl font-black">Donate</h1><p className="mt-5 max-w-2xl text-lg text-slate-300">Your support helps turn community needs into sustainable action.</p></div></section>
    <section className="container-custom max-w-2xl py-14">
      {q.submitted && <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">Thank you. Your donation pledge has been recorded.</div>}
      {q.error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">We could not record your donation. Please try again.</div>}
      <form action={submitDonation} className="card grid gap-5 p-6 md:grid-cols-2">
        <label><span className="label">Name</span><input required name="donor_name" className="input" /></label>
        <label><span className="label">Email</span><input type="email" name="donor_email" className="input" /></label>
        <label><span className="label">Amount</span><input required min="1" step="0.01" type="number" name="amount" className="input" /></label>
        <label><span className="label">Currency</span><select name="currency" className="input"><option>NPR</option><option>USD</option><option>EUR</option></select></label>
        <label><span className="label">Payment method</span><input name="payment_method" placeholder="eSewa / Khalti / Bank / Other" className="input" /></label>
        <label><span className="label">Campaign</span><input name="campaign" className="input" /></label>
        <div className="md:col-span-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">This records a donation pledge. Connect a payment gateway before accepting online payments.</div>
        <div className="md:col-span-2 flex justify-end"><button className="btn-primary">Submit donation</button></div>
      </form>
    </section>
  </main>;
}

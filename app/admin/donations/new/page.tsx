import { ContentForm } from "@/components/admin/ContentForm";

export default function NewPage() {
  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Create Donation</h1>
      <p className="mt-2 text-slate-600">Add a new record to your NGO website.</p>
      <div className="mt-8"><ContentForm table="donations" title="Donation" /></div>
    </>
  );
}

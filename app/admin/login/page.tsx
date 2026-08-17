import Link from "next/link";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
          <ArrowLeft size={16} /> Back to website
        </Link>

        <div className="card p-8">
          <div className="mb-7 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[var(--brand-primary)]">
            <LockKeyhole />
          </div>
          <p className="section-label">Secure area</p>
          <h1 className="mt-2 text-3xl font-black">Admin login</h1>
          <p className="mt-3 text-slate-600">Sign in to manage your NGO website.</p>

          {params.error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {params.error}
            </div>
          )}

          <form action={login} className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email</span>
              <input name="email" type="email" required autoComplete="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[var(--brand-primary)]"
                placeholder="admin@example.org" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <input name="password" type="password" required autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[var(--brand-primary)]"
                placeholder="••••••••" />
            </label>
            <button className="btn-primary w-full" type="submit">Sign in</button>
          </form>

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Create your first administrator in Supabase Authentication, then assign the
            <strong> admin </strong> role in the database profile table.
          </p>
        </div>
      </div>
    </main>
  );
}

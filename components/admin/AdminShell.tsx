import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="border-b border-slate-200 bg-white">
          <div className="container-custom flex min-h-18 items-center justify-end py-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Admin</span>
          </div>
        </header>
        <main className="container-custom py-8">{children}</main>
      </div>
    </div>
  );
}

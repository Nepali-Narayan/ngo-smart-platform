 "use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteRecord } from "@/app/admin/actions";

type Row = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  status?: string;
  created_at?: string;
  email?: string;
  amount?: number;
  currency?: string;
};

export function CrudTable({
  table,
  rows,
  createHref,
  createLabel = "Add new",
  columns = ["title", "status", "created_at"],
   editBaseHref,
}: {
  table: string;
  rows: Row[];
  createHref: string;
  createLabel?: string;
  columns?: string[];
  editBaseHref?: string;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <h2 className="font-black">Records</h2>
          <p className="mt-1 text-sm text-slate-500">{rows.length} record(s)</p>
        </div>
        <Link href={createHref} className="btn-primary">
          <Plus size={17} /> {createLabel}
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="p-10 text-center text-slate-500">No records yet. Create the first one.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((column) => <th key={column} className="px-5 py-4">{column.replaceAll("_", " ")}</th>)}
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  {columns.map((column) => (
                    <td key={column} className="max-w-sm px-5 py-4">
                      {column === "status" ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">
                          {String(row[column as keyof Row] ?? "—")}
                        </span>
                      ) : column === "amount" ? (
                        `${row.currency ?? "NPR"} ${Number(row.amount ?? 0).toLocaleString()}`
                      ) : (
                        <span className="line-clamp-2">{String(row[column as keyof Row] ?? "—")}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`${editBaseHref ?? createHref}/${row.id}`} className="rounded-lg border p-2 hover:bg-white" aria-label="Edit">
                        <Pencil size={16} />
                      </Link>
                      <form action={deleteRecord}>
                        <input type="hidden" name="table" value={table} />
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="redirectTo" value={createHref} />
                        <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { deleteMedia } from "@/app/admin/storage-actions";
import { Trash2 } from "lucide-react";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; uploaded?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <p className="section-label">Content management</p>
      <h1 className="mt-2 text-3xl font-black">Gallery & Media</h1>
      <p className="mt-2 text-slate-600">Upload, preview and remove your NGO images.</p>

      {params.error && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error}</div>}
      {params.uploaded && <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">Image uploaded successfully.</div>}
      {params.deleted && <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">Image deleted successfully.</div>}
      {error && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error.message}</div>}

      <div className="mt-8">
        <MediaUpload />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(data ?? []).map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <div className="aspect-[4/3] bg-slate-100">
              <img
                src={item.file_url}
                alt={item.alt_text || item.file_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="truncate text-sm font-bold" title={item.file_name}>{item.file_name}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{item.mime_type || "image"}</p>
              <div className="mt-4 flex justify-end">
                <form action={deleteMedia}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="file_url" value={item.file_url} />
                  <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!data?.length && !error && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          Your media library is empty. Upload your first image above.
        </div>
      )}
    </>
  );
}

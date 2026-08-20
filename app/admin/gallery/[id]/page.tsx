import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMediaPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .select(
      "id,file_name,file_url,mime_type,alt_text"
    )
    .eq("id", id)
    .single();

  if (error || !media) {
    notFound();
  }

  const isVideo = media.mime_type?.startsWith("video/");

  async function updateMedia(formData: FormData) {
    "use server";

    const altText = String(formData.get("alt_text") || "").trim();

    const supabase = await createClient();

    const { error } = await supabase
      .from("media")
      .update({
        alt_text: altText || null,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/gallery");
  }

  async function deleteMedia() {
    "use server";

    const supabase = await createClient();

    /*
     * Delete the database record.
     *
     * The Storage file can be deleted separately if needed.
     */
    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/gallery");
  }

  return (
    <main>
      <p className="section-label">Media management</p>

      <h1 className="mt-2 text-3xl font-black">
        Edit Media
      </h1>

      <p className="mt-2 text-slate-600">
        Update the information for this media file.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Preview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Preview
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
            {isVideo ? (
              <video
                src={media.file_url}
                controls
                className="max-h-[600px] w-full object-contain"
              />
            ) : (
              <img
                src={media.file_url}
                alt={media.alt_text || media.file_name}
                className="max-h-[600px] w-full object-contain"
              />
            )}
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-slate-900">
              File name
            </p>

            <p className="mt-1 break-all text-sm text-slate-500">
              {media.file_name}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-bold text-slate-900">
              File type
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {media.mime_type || "Unknown"}
            </p>
          </div>
        </div>

        {/* Edit */}
        <div className="space-y-6">
          <form
            action={updateMedia}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-black">
              Media Information
            </h2>

            <label className="mt-6 block">
              <span className="label">
                Alt Text
              </span>

              <input
                name="alt_text"
                defaultValue={media.alt_text || ""}
                placeholder="Describe this image or video"
                className="input"
              />
            </label>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Alt text improves accessibility and helps describe
              the image to users who cannot see it.
            </p>

            <button
              type="submit"
              className="btn-primary mt-6 w-full"
            >
              Save Changes
            </button>

            <a
              href="/admin/gallery"
              className="btn-outline mt-3 block w-full text-center"
            >
              Cancel
            </a>
          </form>

          {/* Delete */}
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-black text-red-800">
              Delete Media
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              This removes the media record from your gallery.
            </p>

            <form action={deleteMedia}>
              <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Delete Media
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
import { MediaForm } from "@/components/admin/MediaForm";

export default function NewMediaPage() {
  return (
    <>
      <p className="section-label">Media</p>

      <h1 className="mt-2 text-3xl font-black">
        Add Media
      </h1>

      <p className="mt-2 text-slate-600">
        Upload a picture or video to your gallery.
      </p>

      <div className="mt-8">
        <MediaForm />
      </div>
    </>
  );
}
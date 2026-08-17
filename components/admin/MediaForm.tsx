 "use client";
import { useFormStatus } from "react-dom";
import { upsertMedia } from "@/app/admin/media-actions";

function Submit() { const { pending } = useFormStatus(); return <button className="btn-primary" disabled={pending}>{pending ? "Saving..." : "Save media"}</button>; }

export function MediaForm({ record }: { record?: any }) {
  return (
    <form action={upsertMedia} className="card p-6">
      <input type="hidden" name="id" value={record?.id ?? ""} />
      <label className="block"><span className="label">File name</span><input required name="file_name" defaultValue={record?.file_name ?? ""} className="input" /></label>
      <label className="mt-5 block"><span className="label">File URL</span><input required name="file_url" type="url" defaultValue={record?.file_url ?? ""} className="input" placeholder="https://..." /></label>
      <label className="mt-5 block"><span className="label">MIME type</span><input name="mime_type" defaultValue={record?.mime_type ?? ""} className="input" placeholder="image/jpeg" /></label>
      <label className="mt-5 block"><span className="label">Alt text</span><input name="alt_text" defaultValue={record?.alt_text ?? ""} className="input" /></label>
      <div className="mt-6 flex justify-end"><Submit /></div>
    </form>
  );
}

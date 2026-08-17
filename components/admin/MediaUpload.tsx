 "use client";

import { useFormStatus } from "react-dom";
import { UploadCloud } from "lucide-react";
import { uploadMedia } from "@/app/admin/storage-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-primary disabled:opacity-50">
      <UploadCloud size={17} />
      {pending ? "Uploading..." : "Upload image"}
    </button>
  );
}

export function MediaUpload() {
  return (
    <form action={uploadMedia} encType="multipart/form-data" className="card p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="block">
          <span className="label">Image</span>
          <input
            required
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="input file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2"
          />
          <span className="mt-1 block text-xs text-slate-500">JPG, PNG, WebP, GIF or SVG · max 8MB</span>
        </label>
        <label className="block">
          <span className="label">Alt text</span>
          <input name="alt_text" className="input" placeholder="Describe the image" />
        </label>
        <SubmitButton />
      </div>
    </form>
  );
}

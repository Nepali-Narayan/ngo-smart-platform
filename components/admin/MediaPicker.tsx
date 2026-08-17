 "use client";

import { useState } from "react";
import { Check, Image as ImageIcon, X } from "lucide-react";

type Media = {
  id: string;
  file_name: string;
  file_url: string;
  alt_text?: string | null;
};

export function MediaPicker({
  media,
  name = "featured_image",
  initialUrl = "",
}: {
  media: Media[];
  name?: string;
  initialUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialUrl);

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      <div className="flex gap-3">
        <button type="button" onClick={() => setOpen(true)} className="btn-outline">
          <ImageIcon size={17} /> {selected ? "Change image" : "Select image"}
        </button>
        {selected && (
          <button type="button" onClick={() => setSelected("")} className="btn-outline text-red-600">
            <X size={17} /> Remove
          </button>
        )}
      </div>

      {selected && (
        <div className="mt-4 flex items-center gap-4 rounded-xl border p-3">
          <img src={selected} alt="" className="h-20 w-28 rounded-lg object-cover" />
          <span className="max-w-xl truncate text-xs text-slate-500">{selected}</span>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="font-black">Select from Media Library</h3>
                <p className="mt-1 text-xs text-slate-500">{media.length} image(s) available</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100"><X /></button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-5">
              {media.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center text-slate-500">
                  No media available. Upload images from Admin → Gallery first.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {media.map((item) => {
                    const active = selected === item.file_url;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => { setSelected(item.file_url); setOpen(false); }}
                        className={`group overflow-hidden rounded-xl border-2 text-left ${active ? "border-[var(--brand-primary)]" : "border-slate-200"}`}
                      >
                        <div className="relative aspect-[4/3] bg-slate-100">
                          <img src={item.file_url} alt={item.alt_text || item.file_name} className="h-full w-full object-cover" />
                          {active && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[var(--brand-primary)] text-white"><Check size={15} /></span>}
                        </div>
                        <p className="truncate p-3 text-xs font-bold">{item.file_name}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

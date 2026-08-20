"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  category: string | null;
  location: string | null;
  published_date: string | null;
  status: string;
};

type FilterType = "all" | "image" | "video";

type Props = {
  items: GalleryItem[];
  initialFilter?: FilterType;
};

export default function GalleryClient({
  items,
  initialFilter = "all",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] =
    useState<FilterType>(initialFilter);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  /*
   * KEEP FILTER SYNCHRONIZED WITH URL
   */
  useEffect(() => {
    const type = searchParams.get("type");

    if (type === "image") {
      setFilter("image");
    } else if (type === "video") {
      setFilter("video");
    } else {
      setFilter("all");
    }

    setSelectedIndex(null);
  }, [searchParams]);

  /*
   * CHANGE FILTER
   * Keeps lang=en / lang=ne
   */
  const changeFilter = (newFilter: FilterType) => {
    setSelectedIndex(null);
    setFilter(newFilter);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newFilter === "all") {
      params.delete("type");
    } else {
      params.set("type", newFilter);
    }

    const query = params.toString();

    router.push(
      query
        ? `/gallery?${query}`
        : "/gallery"
    );
  };

  /*
   * FILTER MEDIA
   */
  const filteredItems = items.filter((item) => {
    if (filter === "all") {
      return true;
    }

    if (filter === "video") {
      return item.type === "video";
    }

    return item.type !== "video";
  });

  /*
   * SELECTED MEDIA
   */
  const selectedItem =
    selectedIndex !== null
      ? filteredItems[selectedIndex]
      : null;

  /*
   * KEYBOARD CONTROLS
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (
        event.key === "ArrowRight" &&
        filteredItems.length > 1
      ) {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current + 1) %
              filteredItems.length
        );
      }

      if (
        event.key === "ArrowLeft" &&
        filteredItems.length > 1
      ) {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current - 1 + filteredItems.length) %
              filteredItems.length
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedIndex,
    filteredItems.length,
  ]);

  /*
   * PREVIOUS
   */
  const previousItem = () => {
    if (
      selectedIndex === null ||
      filteredItems.length === 0
    ) {
      return;
    }

    setSelectedIndex(
      (selectedIndex -
        1 +
        filteredItems.length) %
        filteredItems.length
    );
  };

  /*
   * NEXT
   */
  const nextItem = () => {
    if (
      selectedIndex === null ||
      filteredItems.length === 0
    ) {
      return;
    }

    setSelectedIndex(
      (selectedIndex + 1) %
        filteredItems.length
    );
  };

  return (
    <>
      <section className="container-custom px-6 py-16">

        {/* =================================
            FILTER BUTTONS
        ================================= */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">

          {/* ALL MEDIA */}
          <button
            type="button"
            onClick={() =>
              changeFilter("all")
            }
            className={`rounded-full px-6 py-3 text-sm font-bold transition ${
              filter === "all"
                ? "bg-slate-950 text-white shadow-lg"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            }`}
          >
            🖼️ All Media
          </button>

          {/* PICTURES */}
          <button
            type="button"
            onClick={() =>
              changeFilter("image")
            }
            className={`rounded-full px-6 py-3 text-sm font-bold transition ${
              filter === "image"
                ? "bg-slate-950 text-white shadow-lg"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            }`}
          >
            📷 Pictures
          </button>

          {/* VIDEOS */}
          <button
            type="button"
            onClick={() =>
              changeFilter("video")
            }
            className={`rounded-full px-6 py-3 text-sm font-bold transition ${
              filter === "video"
                ? "bg-slate-950 text-white shadow-lg"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            }`}
          >
            🎥 Videos
          </button>

        </div>

        {/* =================================
            RESULT COUNT
        ================================= */}
        <div className="mb-8 text-center text-sm font-semibold text-slate-500">
          {filteredItems.length}{" "}
          {filteredItems.length === 1
            ? "media item"
            : "media items"}
        </div>

        {/* =================================
            NO MEDIA
        ================================= */}
        {filteredItems.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="text-5xl">
              🖼️
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No media available
            </h2>

            <p className="mt-2 text-slate-500">
              There are no published items in
              this category.
            </p>

          </div>

        ) : (

          /* =================================
             GALLERY GRID
          ================================= */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredItems.map(
              (item, index) => {
                const isVideo =
                  item.type === "video";

                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >

                    {/* MEDIA */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedIndex(index)
                      }
                      className="relative block w-full cursor-pointer text-left"
                      aria-label={`Open ${item.title}`}
                    >

                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                        {isVideo ? (
                          <>
                            <video
                              src={item.file_url}
                              poster={
                                item.thumbnail_url ||
                                undefined
                              }
                              preload="metadata"
                              muted
                              playsInline
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            />

                            {/* PLAY BUTTON */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-950 shadow-2xl backdrop-blur transition duration-300 group-hover:scale-110">
                                ▶
                              </div>
                            </div>

                            {/* VIDEO BADGE */}
                            <div className="absolute left-4 top-4">
                              <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                                🎥 Video
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={item.file_url}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            />

                            {/* IMAGE ICON */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-xl shadow-2xl backdrop-blur">
                                🔍
                              </div>
                            </div>

                            {/* IMAGE BADGE */}
                            <div className="absolute left-4 top-4">
                              <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                                🖼️ Picture
                              </span>
                            </div>
                          </>
                        )}

                        {/* GRADIENT */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

                      </div>

                    </button>

                    {/* INFORMATION */}
                    <div className="p-5">

                      <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
                        {item.title}
                      </h2>

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      )}

                      {(item.category ||
                        item.location) && (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {item.category && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {item.category}
                            </span>
                          )}

                          {item.location && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              📍 {item.location}
                            </span>
                          )}

                        </div>
                      )}

                      {item.published_date && (
                        <p className="mt-4 text-xs font-medium text-slate-400">
                          {new Date(
                            item.published_date
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* =================================
          FULLSCREEN PREVIEW
      ================================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedIndex(null)
          }
        >

          {/* CLOSE */}
          <button
            type="button"
            onClick={() =>
              setSelectedIndex(null)
            }
            className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close preview"
          >
            ✕
          </button>

          {/* PREVIOUS */}
          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousItem();
              }}
              className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur transition hover:bg-white/20"
              aria-label="Previous item"
            >
              ‹
            </button>
          )}

          {/* NEXT */}
          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextItem();
              }}
              className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur transition hover:bg-white/20"
              aria-label="Next item"
            >
              ›
            </button>
          )}

          {/* CONTENT */}
          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {selectedItem.type ===
            "video" ? (
              <video
                src={selectedItem.file_url}
                poster={
                  selectedItem.thumbnail_url ||
                  undefined
                }
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={selectedItem.file_url}
                alt={selectedItem.title}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            )}

            {/* TITLE */}
            <div className="mt-4 text-center">

              <h2 className="text-xl font-bold text-white">
                {selectedItem.title}
              </h2>

              {selectedItem.location && (
                <p className="mt-1 text-sm text-slate-300">
                  📍 {selectedItem.location}
                </p>
              )}

            </div>

          </div>

        </div>
      )}
    </>
  );
}
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

type Publication = {
  id: string;
  title: string;
  slug: string | null;
  type: string;
  description: string | null;
  cover_image: string | null;
  file_url: string | null;
  published_date: string | null;
  status: string;
};

type Props = {
  publications: Publication[];
};

export default function PublicationFilters({
  publications,
}: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const types = useMemo(() => {
    return Array.from(
      new Set(
        publications
          .map((publication) => publication.type)
          .filter(Boolean)
      )
    ).sort();
  }, [publications]);

  const filteredPublications = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const filtered = publications.filter((publication) => {
      const matchesSearch =
        !searchText ||
        publication.title
          .toLowerCase()
          .includes(searchText) ||
        publication.type
          .toLowerCase()
          .includes(searchText) ||
        (publication.description || "")
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        type === "all" || publication.type === type;

      const matchesStatus =
        status === "all" ||
        publication.status === status;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });

    return [...filtered].sort((a, b) => {
      const dateA = a.published_date
        ? new Date(a.published_date).getTime()
        : 0;

      const dateB = b.published_date
        ? new Date(b.published_date).getTime()
        : 0;

      if (sort === "oldest") {
        return dateA - dateB;
      }

      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }

      return dateB - dateA;
    });
  }, [
    publications,
    search,
    type,
    status,
    sort,
  ]);

  const hasFilters =
    search ||
    type !== "all" ||
    status !== "all";

  return (
    <div>

      {/* =====================================================
          FILTER TOOLBAR
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">

        <div className="grid gap-3 lg:grid-cols-12">

          {/* SEARCH */}

          <div className="lg:col-span-5">

            <label
              htmlFor="publication-search"
              className="sr-only"
            >
              Search publications
            </label>

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                ⌕
              </span>

              <input
                id="publication-search"
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search publications, reports, research..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* TYPE */}

          <div className="lg:col-span-2">

            <label
              htmlFor="publication-type"
              className="sr-only"
            >
              Publication type
            </label>

            <select
              id="publication-type"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">
                All Types
              </option>

              {types.map((publicationType) => (
                <option
                  key={publicationType}
                  value={publicationType}
                >
                  {publicationType}
                </option>
              ))}
            </select>

          </div>

          {/* STATUS */}

          <div className="lg:col-span-2">

            <label
              htmlFor="publication-status"
              className="sr-only"
            >
              Publication status
            </label>

            <select
              id="publication-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">
                All Status
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>
            </select>

          </div>

          {/* SORT */}

          <div className="lg:col-span-3">

            <label
              htmlFor="publication-sort"
              className="sr-only"
            >
              Sort publications
            </label>

            <select
              id="publication-sort"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>

              <option value="title">
                Title A–Z
              </option>
            </select>

          </div>

        </div>

        {/* FILTER SUMMARY */}

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

            <span>
              Showing
            </span>

            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
              {filteredPublications.length}
            </span>

            <span>
              of {publications.length} publications
            </span>

          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setType("all");
                setStatus("all");
                setSort("newest");
              }}
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
            >
              Reset filters
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          NO RESULTS
      ===================================================== */}

      {filteredPublications.length === 0 ? (

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            🔍
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            No publications found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            We couldn't find anything matching your
            current search or filters.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setType("all");
                setStatus("all");
                setSort("newest");
              }}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Clear filters
            </button>
          )}

        </div>

      ) : (

        /* =====================================================
           PUBLICATION GRID
        ===================================================== */

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {filteredPublications.map(
            (publication) => (

              <article
                key={publication.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >

                {/* COVER */}

                <div className="relative h-56 overflow-hidden bg-slate-100">

                  {publication.cover_image ? (

                    <img
                      src={publication.cover_image}
                      alt={publication.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  ) : (

                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                        📄
                      </div>

                      <span className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Publication
                      </span>

                    </div>

                  )}

                  {/* TOP BADGES */}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">

                    <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-blue-700 shadow-sm backdrop-blur">
                      {publication.type}
                    </span>

                  </div>

                  {/* STATUS */}

                  <div className="absolute right-4 top-4">

                    {publication.status ===
                    "published" ? (

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-emerald-500/95 px-3 py-1.5 text-[11px] font-black text-white shadow-sm backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Published
                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-amber-500/95 px-3 py-1.5 text-[11px] font-black text-white shadow-sm backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Draft
                      </span>

                    )}

                  </div>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-black leading-7 text-slate-950">
                    {publication.title}
                  </h3>

                  {publication.description && (

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {publication.description}
                    </p>

                  )}

                  {/* META */}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                        📅
                      </span>

                      {publication.published_date
                        ? new Date(
                            publication.published_date
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "No date"}

                    </div>

                    {publication.file_url && (

                      <span className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-red-600">
                        PDF
                      </span>

                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    {publication.slug ? (

                      <Link
                        href={`/publications/${publication.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        👁 View
                      </Link>

                    ) : (

                      <span className="inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-300">
                        No URL
                      </span>

                    )}

                    <Link
                      href={`/admin/publications/${publication.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      ✏️ Edit
                    </Link>

                  </div>

                  {/* DELETE */}

                  <div className="mt-2">

                    <DeleteButton
                      id={publication.id}
                      title={publication.title}
                    />

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      )}

    </div>
  );
}
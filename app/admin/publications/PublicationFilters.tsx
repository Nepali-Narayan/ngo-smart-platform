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

  const types = useMemo(() => {
    return Array.from(
      new Set(
        publications
          .map((publication) => publication.type)
          .filter(Boolean)
      )
    );
  }, [publications]);

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      const searchText = search.toLowerCase().trim();

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
  }, [publications, search, type, status]);

  return (
    <div>

      {/* FILTER BAR */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-3">

          {/* SEARCH */}

          <div className="md:col-span-1">

            <label
              htmlFor="publication-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search
            </label>

            <input
              id="publication-search"
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search publications..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* TYPE */}

          <div>

            <label
              htmlFor="publication-type"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Type
            </label>

            <select
              id="publication-type"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          <div>

            <label
              htmlFor="publication-status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>

            <select
              id="publication-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

        </div>

        {/* RESULT COUNT */}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-sm text-slate-500">

            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredPublications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {publications.length}
            </span>{" "}
            publications

          </p>

          {(search ||
            type !== "all" ||
            status !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setType("all");
                setStatus("all");
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* EMPTY FILTER RESULT */}

      {filteredPublications.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
            🔍
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No publications found
          </h2>

          <p className="mt-2 text-slate-500">
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        /* PUBLICATION LIST */

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="text-lg font-bold text-slate-900">
              Publications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View, edit, replace files, or delete publications.
            </p>

          </div>

          <div className="divide-y divide-slate-100">

            {filteredPublications.map(
              (publication) => (

                <div
                  key={publication.id}
                  className="flex flex-col gap-5 p-6 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                >

                  {/* LEFT SIDE */}

                  <div className="flex min-w-0 items-center gap-5">

                    {/* COVER */}

                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                      {publication.cover_image ? (

                        <img
                          src={publication.cover_image}
                          alt={publication.title}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center text-2xl">
                          📄
                        </div>

                      )}

                    </div>

                    {/* INFORMATION */}

                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-bold text-slate-900">
                        {publication.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {publication.type}
                        </span>

                        {publication.status ===
                        "published" ? (

                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Published
                          </span>

                        ) : (

                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Draft
                          </span>

                        )}

                      </div>

                      {publication.published_date && (

                        <p className="mt-2 text-sm text-slate-500">

                          Published{" "}

                          {new Date(
                            publication.published_date
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

                      {publication.slug && (

                        <p className="mt-1 truncate text-xs text-slate-400">
                          /publications/
                          {publication.slug}
                        </p>

                      )}

                    </div>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">

                    {/* VIEW */}

                    {publication.slug && (
                      <Link
                        href={`/publications/${publication.slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        👁 View
                      </Link>
                    )}

                    {/* EDIT */}

                    <Link
                      href={`/admin/publications/${publication.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      ✏️ Edit
                    </Link>

                    {/* DELETE */}

                    <DeleteButton
                      id={publication.id}
                      title={publication.title}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}
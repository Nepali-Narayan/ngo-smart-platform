"use client";

import { useState } from "react";
import { deletePublication } from "./actions";

type DeleteButtonProps = {
  id: string;
  title: string;
};

export default function DeleteButton({
  id,
  title,
}: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis publication will be permanently deleted.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const formData = new FormData();

      formData.append("id", id);

      await deletePublication(formData);
    } catch (error) {
      console.error("Delete publication error:", error);

      setDeleting(false);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete publication."
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "🗑 Delete"}
    </button>
  );
}
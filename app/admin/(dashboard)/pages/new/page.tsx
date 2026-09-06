"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "../actions";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewPagePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const id = await createPage({ title, slug: slug || slugify(title) });
      router.push(`/admin/pages/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl text-ink">New Page</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-black/5 bg-surface p-6">
        {error && <p className="rounded-lg bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-ink">Title</label>
          <input
            required
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Slug</label>
          <input
            required
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugTouched(true);
            }}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Page"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePage, updatePageMeta, type PageStatus } from "../actions";
import type { Database } from "@/lib/supabase/types";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];

export function PageMetaForm({ page }: { page: PageRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: page.title,
    slug: page.slug,
    seo_title: page.seo_title ?? "",
    seo_description: page.seo_description ?? "",
    status: page.status as PageStatus,
    no_index: page.no_index,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputClass = "mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updatePageMeta(page.id, {
      title: form.title,
      slug: form.slug,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      no_index: form.no_index,
      status: form.status,
    });
    setSaving(false);
    setSaved(true);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;
    await deletePage(page.id);
    router.push("/admin/pages");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-surface p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Title</label>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Slug</label>
          <input
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">SEO Title</label>
          <input
            value={form.seo_title}
            onChange={(event) => setForm({ ...form, seo_title: event.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Status</label>
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as PageStatus })}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink">SEO Description</label>
          <textarea
            value={form.seo_description}
            onChange={(event) => setForm({ ...form, seo_description: event.target.value })}
            rows={2}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            checked={form.no_index}
            onChange={(event) => setForm({ ...form, no_index: event.target.checked })}
          />
          Hide from search engines (no-index)
        </label>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-xs text-ink/50">Saved.</span>}
        <button onClick={handleDelete} className="ml-auto text-sm text-red hover:underline">
          Delete Page
        </button>
      </div>
    </div>
  );
}

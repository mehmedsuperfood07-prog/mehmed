"use client";

import { useState } from "react";
import { createCategory, deleteCategory, updateCategory } from "../actions";
import type { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["product_categories"]["Row"];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function CategoryRow({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateCategory(category.id, { name, slug, sort_order: category.sort_order });
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${category.name}"? Products in this category will be uncategorized.`)) return;
    await deleteCategory(category.id);
  }

  const inputClass = "rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-surface p-4">
      <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
      <input value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} />
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
      <button onClick={handleDelete} className="ml-auto text-sm text-red hover:underline">
        Delete
      </button>
    </div>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setAdding(true);
    await createCategory({
      name,
      slug: slug || slugify(name),
      sort_order: categories.length,
    });
    setName("");
    setSlug("");
    setSlugTouched(false);
    setAdding(false);
  }

  const inputClass = "rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-surface p-4">
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          placeholder="New category name"
          className={inputClass}
        />
        <input
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          placeholder="slug"
          className={inputClass}
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
        >
          + Add Category
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

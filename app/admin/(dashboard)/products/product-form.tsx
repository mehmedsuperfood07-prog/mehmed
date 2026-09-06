"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, deleteProduct, updateProduct, type ProductInput, type ProductStatus } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["product_categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category_id: product?.category_id ?? categories[0]?.id ?? "",
    short_description: product?.short_description ?? "",
    description: product?.description ?? "",
    image_url: product?.image_url ?? "",
    pack_sizes: (product?.pack_sizes ?? []).join("\n"),
    is_featured: product?.is_featured ?? false,
    status: (product?.status as ProductStatus) ?? "draft",
    sort_order: product?.sort_order ?? 0,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const inputClass = "mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  async function handleSubmit() {
    setSaving(true);
    setError(null);

    const input: ProductInput = {
      category_id: form.category_id || null,
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description,
      description: form.description,
      image_url: form.image_url || null,
      pack_sizes: form.pack_sizes
        .split("\n")
        .map((size) => size.trim())
        .filter(Boolean),
      is_featured: form.is_featured,
      sort_order: form.sort_order,
      status: form.status,
    };

    try {
      if (product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteProduct(product.id);
    router.push("/admin/products");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-surface p-6">
      {error && <p className="rounded-lg bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Name</label>
          <input
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Slug</label>
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: event.target.value }));
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Category</label>
          <select
            value={form.category_id}
            onChange={(event) => setForm((f) => ({ ...f, category_id: event.target.value }))}
            className={inputClass}
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Status</label>
          <select
            value={form.status}
            onChange={(event) => setForm((f) => ({ ...f, status: event.target.value as ProductStatus }))}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink">Short description</label>
          <input
            value={form.short_description}
            onChange={(event) => setForm((f) => ({ ...f, short_description: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((f) => ({ ...f, description: event.target.value }))}
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Image"
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Pack sizes (one per line)</label>
          <textarea
            value={form.pack_sizes}
            onChange={(event) => setForm((f) => ({ ...f, pack_sizes: event.target.value }))}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Sort order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(event) => setForm((f) => ({ ...f, sort_order: Number(event.target.value) }))}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(event) => setForm((f) => ({ ...f, is_featured: event.target.checked }))}
          />
          Featured (shown in &quot;featured only&quot; product grids, e.g. the homepage)
        </label>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </button>
        {product && (
          <button onClick={handleDelete} className="ml-auto text-sm text-red hover:underline">
            Delete Product
          </button>
        )}
      </div>
    </div>
  );
}

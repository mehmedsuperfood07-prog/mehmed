"use client";

import { useState } from "react";
import { createTestimonial, deleteTestimonial, updateTestimonial, type TestimonialInput, type TestimonialStatus } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Database } from "@/lib/supabase/types";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

const emptyForm: TestimonialInput = {
  author_name: "",
  author_role: "",
  area: "",
  rating: 5,
  quote: "",
  avatar_url: "",
  sort_order: 0,
  status: "draft",
};

export function TestimonialForm({
  testimonial,
  onDone,
}: {
  testimonial?: Testimonial;
  onDone?: () => void;
}) {
  const [form, setForm] = useState<TestimonialInput>(
    testimonial
      ? {
          author_name: testimonial.author_name,
          author_role: testimonial.author_role,
          area: testimonial.area,
          rating: testimonial.rating,
          quote: testimonial.quote,
          avatar_url: testimonial.avatar_url,
          sort_order: testimonial.sort_order,
          status: testimonial.status as TestimonialStatus,
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = "mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (testimonial) {
        await updateTestimonial(testimonial.id, form);
      } else {
        await createTestimonial(form);
        setForm(emptyForm);
      }
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!testimonial) return;
    if (!confirm(`Delete this testimonial from ${testimonial.author_name}?`)) return;
    await deleteTestimonial(testimonial.id);
    onDone?.();
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red/10 px-3 py-2 text-sm text-red">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Author name</label>
          <input
            value={form.author_name}
            onChange={(event) => setForm((f) => ({ ...f, author_name: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Role / business</label>
          <input
            value={form.author_role ?? ""}
            onChange={(event) => setForm((f) => ({ ...f, author_role: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Area</label>
          <input
            value={form.area ?? ""}
            onChange={(event) => setForm((f) => ({ ...f, area: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Rating</label>
          <select
            value={form.rating}
            onChange={(event) => setForm((f) => ({ ...f, rating: Number(event.target.value) }))}
            className={inputClass}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink">Quote</label>
          <textarea
            value={form.quote}
            onChange={(event) => setForm((f) => ({ ...f, quote: event.target.value }))}
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Avatar (optional)"
            value={form.avatar_url ?? ""}
            onChange={(url) => setForm((f) => ({ ...f, avatar_url: url }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Status</label>
          <select
            value={form.status}
            onChange={(event) => setForm((f) => ({ ...f, status: event.target.value as TestimonialStatus }))}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
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
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : testimonial ? "Save Changes" : "Add Testimonial"}
        </button>
        {testimonial && (
          <button onClick={handleDelete} className="ml-auto text-sm text-red hover:underline">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

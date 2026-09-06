"use client";

import { useState } from "react";
import { updateSiteSettings } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Database } from "@/lib/supabase/types";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export function SettingsForm({ settings }: { settings: Settings }) {
  const socialLinks = (settings.social_links as { facebook?: string; instagram?: string }) ?? {};

  const [form, setForm] = useState({
    logo_url: settings.logo_url ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    opening_hours: settings.opening_hours ?? "",
    facebook: socialLinks.facebook ?? "",
    instagram: socialLinks.instagram ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputClass = "mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateSiteSettings({
      logo_url: form.logo_url || null,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      email: form.email || null,
      address: form.address || null,
      opening_hours: form.opening_hours || null,
      social_links: {
        ...(form.facebook && { facebook: form.facebook }),
        ...(form.instagram && { instagram: form.instagram }),
      },
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-surface p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Logo"
            value={form.logo_url}
            onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Phone</label>
          <input
            value={form.phone}
            onChange={(event) => setForm((f) => ({ ...f, phone: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">WhatsApp</label>
          <input
            value={form.whatsapp}
            onChange={(event) => setForm((f) => ({ ...f, whatsapp: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Email</label>
          <input
            value={form.email}
            onChange={(event) => setForm((f) => ({ ...f, email: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Opening hours</label>
          <input
            value={form.opening_hours}
            onChange={(event) => setForm((f) => ({ ...f, opening_hours: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink">Address</label>
          <input
            value={form.address}
            onChange={(event) => setForm((f) => ({ ...f, address: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Facebook URL</label>
          <input
            value={form.facebook}
            onChange={(event) => setForm((f) => ({ ...f, facebook: event.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Instagram URL</label>
          <input
            value={form.instagram}
            onChange={(event) => setForm((f) => ({ ...f, instagram: event.target.value }))}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-xs text-ink/50">Saved.</span>}
      </div>
    </div>
  );
}

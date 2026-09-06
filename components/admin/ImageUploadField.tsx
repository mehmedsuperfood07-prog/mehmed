"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions/media";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(formData);
    setUploading(false);

    if (result.success) {
      onChange(result.url);
    } else {
      setError(result.error);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      <div className="mt-1 flex items-start gap-3">
        {value && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-cream">
            <Image src={value} alt="" fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Image URL, or upload a file"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink"
          />
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-ink/60"
            />
            {uploading && <span className="text-xs text-ink/50">Uploading...</span>}
          </div>
          {error && <p className="text-xs text-red">{error}</p>}
        </div>
      </div>
    </div>
  );
}

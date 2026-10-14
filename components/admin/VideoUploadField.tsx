"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = ["video/mp4", "video/webm"];

// Uploads straight from the browser to Storage with the admin's session.
// The image uploader goes through a server action, which has a small
// request-body limit that a video would blow past.
export function VideoUploadField({
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

    if (!ALLOWED.includes(file.type)) {
      setError("Use an MP4 or WebM video.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`That file is ${(file.size / 1048576).toFixed(1)} MB. Compress it to under 15 MB (aim for 1-3 MB).`);
      return;
    }

    setUploading(true);
    setError(null);
    const supabase = createClient();
    const extension = file.type === "video/webm" ? "webm" : "mp4";
    const path = `video/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
    } else {
      onChange(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      <div className="mt-1 space-y-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Video URL (.mp4 / .webm), or upload a file"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink"
        />
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleFileChange}
            className="text-xs text-ink/60"
          />
          {uploading && <span className="text-xs text-ink/50">Uploading...</span>}
          {value && !uploading && (
            <button type="button" onClick={() => onChange("")} className="text-xs text-red">
              Remove video
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
      </div>
    </div>
  );
}

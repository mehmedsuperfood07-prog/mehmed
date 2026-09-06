"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

// Uses the session-aware client (not the service-role admin one) so this
// only works for a signed-in admin, matching the "media" bucket's storage
// policies (see the storage migration) rather than bypassing them.
export async function uploadImage(
  formData: FormData,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "File is too large (max 5MB)." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Unsupported file type." };
  }

  const supabase = await createClient();
  const extension = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}

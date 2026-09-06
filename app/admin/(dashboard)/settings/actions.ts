"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SiteSettingsInput = {
  logo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  opening_hours: string | null;
  social_links: { facebook?: string; instagram?: string };
};

export async function updateSiteSettings(input: SiteSettingsInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  // Footer/section data is fetched fresh on every request (no static
  // caching on these routes), so no further revalidation is needed for
  // the public site to pick this up.
}

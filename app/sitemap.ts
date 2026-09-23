import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("status", "published")
    .eq("no_index", false);

  return (pages ?? []).map((page) => ({
    url: page.slug === "home" ? SITE_URL : `${SITE_URL}/${page.slug}`,
    lastModified: page.updated_at,
    changeFrequency: "weekly",
    priority: page.slug === "home" ? 1 : 0.8,
  }));
}

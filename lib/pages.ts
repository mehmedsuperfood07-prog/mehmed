import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type SectionRow = Database["public"]["Tables"]["page_sections"]["Row"];

export async function getPageBySlug(slug: string): Promise<{ page: PageRow; sections: SectionRow[] } | null> {
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();

  if (!page) return null;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  return { page, sections: sections ?? [] };
}

export function pageMetadata(page: PageRow): Metadata {
  return {
    title: page.seo_title || page.title,
    description: page.seo_description ?? undefined,
    alternates: page.canonical_url ? { canonical: page.canonical_url } : undefined,
    robots: page.no_index ? { index: false, follow: false } : undefined,
    openGraph: page.og_image_url ? { images: [page.og_image_url] } : undefined,
  };
}

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { SITE_NAME } from "@/lib/site";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type SectionRow = Database["public"]["Tables"]["page_sections"]["Row"];

export async function getPageBySlug(slug: string): Promise<{ page: PageRow; sections: SectionRow[] } | null> {
  const supabase = await createClient();
  // "published" only -- a draft page (the default status for a newly
  // created page) must not be publicly reachable at its slug just because
  // no admin UI links to it yet.
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!page) return null;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  return { page, sections: sections ?? [] };
}

// `path` is the page's own public URL path ("/" for home, "/about" etc.) --
// used to build a self-referencing canonical and og:url by default. A
// page's `canonical_url` column remains a rare, explicit override (e.g. if
// a page should point elsewhere), not the only way to get a canonical tag.
export async function pageMetadata(page: PageRow, path: string): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("logo_url").eq("id", 1).maybeSingle();

  const title = page.seo_title || page.title;
  const description = page.seo_description ?? undefined;
  const canonicalPath = page.canonical_url || path;
  const images = page.og_image_url ? [page.og_image_url] : settings?.logo_url ? [settings.logo_url] : undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: page.no_index ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

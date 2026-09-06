"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SECTION_DEFAULT_CONTENT } from "@/components/sections/schemas";
import type { SectionType } from "@/components/sections/types";
import type { Json } from "@/lib/supabase/types";

// Not a generated DB enum -- see the same note in the leads actions.
export type PageStatus = "draft" | "published";

export async function createPage(input: { title: string; slug: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .insert({ title: input.title, slug: input.slug, status: "draft" })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
  return data.id as string;
}

export async function updatePageMeta(
  id: string,
  input: {
    title: string;
    slug: string;
    seo_title: string | null;
    seo_description: string | null;
    no_index: boolean;
    status: PageStatus;
  },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("pages").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
}

export async function deletePage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
}

export async function addSection(pageId: string, type: SectionType) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("page_sections")
    .select("id", { count: "exact", head: true })
    .eq("page_id", pageId);

  const { error } = await supabase.from("page_sections").insert({
    page_id: pageId,
    type,
    position: count ?? 0,
    content: SECTION_DEFAULT_CONTENT[type] as Json,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function updateSectionContent(
  pageId: string,
  sectionId: string,
  content: Record<string, unknown>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("page_sections")
    .update({ content: content as Json })
    .eq("id", sectionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function deleteSection(pageId: string, sectionId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("page_sections").delete().eq("id", sectionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function moveSection(pageId: string, sectionId: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: sections, error } = await supabase
    .from("page_sections")
    .select("id, position")
    .eq("page_id", pageId)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  if (!sections) return;

  const index = sections.findIndex((section) => section.id === sectionId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sections.length) return;

  const current = sections[index];
  const target = sections[swapWith];

  await supabase.from("page_sections").update({ position: target.position }).eq("id", current.id);
  await supabase.from("page_sections").update({ position: current.position }).eq("id", target.id);

  revalidatePath(`/admin/pages/${pageId}`);
}

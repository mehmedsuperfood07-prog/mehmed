import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageMetaForm } from "./page-meta-form";
import { SectionManager } from "./section-manager";

export default async function AdminPageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();

  if (!page) notFound();

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", id)
    .order("position", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-ink">Edit Page</h1>
        <p className="mt-1 text-sm text-ink/60">/{page.slug}</p>
      </div>
      <PageMetaForm page={page} />
      <SectionManager pageId={page.id} sections={sections ?? []} />
    </div>
  );
}

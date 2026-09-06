import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, pageMetadata } from "@/lib/pages";
import { PageSections } from "@/components/sections/PageSections";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPageBySlug(slug);
  if (!result) return {};
  return pageMetadata(result.page);
}

export default async function DynamicPage({ params }: Params) {
  const { slug } = await params;
  const result = await getPageBySlug(slug);
  if (!result) notFound();

  return <PageSections sections={result.sections} />;
}

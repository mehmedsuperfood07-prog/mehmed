import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, pageMetadata } from "@/lib/pages";
import { PageSections } from "@/components/sections/PageSections";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageBySlug("home");
  if (!result) return {};
  return pageMetadata(result.page);
}

export default async function HomePage() {
  const result = await getPageBySlug("home");
  if (!result) notFound();

  return <PageSections sections={result.sections} />;
}

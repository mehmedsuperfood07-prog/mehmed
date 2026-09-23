import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("logo_url").eq("id", 1).maybeSingle();

  return (
    <>
      <Header logoUrl={settings?.logo_url} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

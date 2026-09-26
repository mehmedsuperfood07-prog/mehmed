import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { SocialLinks } from "@/lib/social";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("logo_url, phone, email, address, social_links")
    .eq("id", 1)
    .maybeSingle();

  return (
    <>
      <OrganizationSchema
        logoUrl={settings?.logo_url}
        phone={settings?.phone}
        email={settings?.email}
        address={settings?.address}
        socialLinks={settings?.social_links as SocialLinks | null}
      />
      <Header logoUrl={settings?.logo_url} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

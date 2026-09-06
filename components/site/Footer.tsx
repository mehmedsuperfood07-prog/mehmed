import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/become-a-distributor", label: "Distributors" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const socialLinks = (settings?.social_links as { facebook?: string; instagram?: string } | null) ?? {};

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm uppercase tracking-wide text-white/80">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mx-auto mt-8 max-w-lg text-white/70">
          Mehmed Super Foods — whole wheat flour, rice, and Rizqan sugarcane juice, supplied
          fresh across Lahore.
          {settings?.phone && <> Call us at {settings.phone}.</>}
        </p>

        {(socialLinks.facebook || socialLinks.instagram) && (
          <div className="mt-4 flex justify-center gap-4 text-sm text-white/70">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
                Facebook
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                Instagram
              </a>
            )}
          </div>
        )}

        <p className="mt-10 text-5xl font-normal tracking-tight sm:text-7xl">
          Mehmed<span className="text-lime">SuperFoods</span>
        </p>
      </div>
      <div className="bg-lime py-3 text-center text-xs text-lime-text">
        © {new Date().getFullYear()} Mehmed Super Foods. All rights reserved.
      </div>
    </footer>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const socialLinks = (settings?.social_links as { facebook?: string; instagram?: string } | null) ?? {};

  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg text-white">Mehmed Super Foods</p>
            <p className="mt-2 text-sm">
              Whole wheat flour, Mehmed Rice, and Rizqan sugarcane juice — supplied fresh across
              Lahore.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Quick Links</p>
            <div className="mt-2 flex flex-col gap-1.5 text-sm">
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/become-a-distributor" className="hover:text-white">
                Become a Distributor
              </Link>
              <Link href="/reviews" className="hover:text-white">
                Reviews
              </Link>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Contact</p>
            <div className="mt-2 flex flex-col gap-1.5 text-sm">
              {settings?.address && <span>{settings.address}</span>}
              {settings?.phone && <span>{settings.phone}</span>}
              {settings?.email && <span>{settings.email}</span>}
              {settings?.opening_hours && <span>{settings.opening_hours}</span>}
              {(socialLinks.facebook || socialLinks.instagram) && (
                <div className="mt-2 flex gap-3">
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} className="hover:text-white" target="_blank" rel="noreferrer">
                      Facebook
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} className="hover:text-white" target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs">
          © {new Date().getFullYear()} Mehmed Super Foods. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

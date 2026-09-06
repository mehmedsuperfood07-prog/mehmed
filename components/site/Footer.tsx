import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

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
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Contact</p>
            <div className="mt-2 flex flex-col gap-1.5 text-sm">
              {settings?.address && <span>{settings.address}</span>}
              {settings?.phone && <span>{settings.phone}</span>}
              {settings?.email && <span>{settings.email}</span>}
              {settings?.opening_hours && <span>{settings.opening_hours}</span>}
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

import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SOCIAL_PLATFORMS, type SocialLinks } from "@/lib/social";
import { SITE_NAME } from "@/lib/site";
import { SocialIcon } from "./SocialIcon";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/private-label", label: "Private Label" },
  { href: "/become-a-distributor", label: "Retail Partners" },
  { href: "/quality", label: "Quality" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const COMPANY_NAME = "Mehmed Super Food Private Limited";

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const socialLinks = (settings?.social_links as SocialLinks | null) ?? {};
  const socials = SOCIAL_PLATFORMS.filter((p) => socialLinks[p.key]);
  const phoneHref = settings?.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : undefined;

  const contactRows = [
    settings?.address && { Icon: MapPin, label: "Address", value: settings.address },
    settings?.phone && { Icon: Phone, label: "Phone", value: settings.phone, href: phoneHref },
    settings?.email && { Icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings?.opening_hours && { Icon: Clock, label: "Hours", value: settings.opening_hours },
  ].filter(Boolean) as { Icon: typeof MapPin; label: string; value: string; href?: string }[];

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

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 rounded-[2rem] bg-white/10 p-8 text-left sm:p-10 md:grid-cols-[1.1fr_1.4fr_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-lime">About</p>
            <h3 className="mt-3 text-2xl leading-tight tracking-tight">{COMPANY_NAME}</h3>
            <p className="mt-3 text-sm text-white/70">
              Quality Food for a Healthier Tomorrow — whole wheat flour, rice, and Rizqan sugarcane
              juice, supplied fresh across Punjab.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-lime">Contact</p>
            <ul className="mt-3 space-y-3.5">
              {contactRows.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-sm text-white/85">
                    <span className="block text-xs text-white/50">{label}</span>
                    {href ? (
                      <a href={href} className="whitespace-nowrap hover:text-lime">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {socials.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-lime">Follow Us</p>
              <ul className="mt-3 flex flex-wrap gap-3 md:flex-col md:gap-3.5">
                {socials.map((platform) => (
                  <li key={platform.key}>
                    <a
                      href={socialLinks[platform.key]}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${SITE_NAME} on ${platform.label}`}
                      className="group flex items-center gap-3 text-sm text-white/85 hover:text-lime"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-primary transition-transform group-hover:scale-110">
                        <SocialIcon name={platform.key} className="h-4 w-4" />
                      </span>
                      <span className="hidden md:inline">{platform.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {settings?.logo_url ? (
          <Image
            src={settings.logo_url}
            alt="Mehmed Super Foods"
            width={243}
            height={154}
            className="mx-auto mt-12 h-32 w-auto object-contain sm:h-40"
          />
        ) : (
          <p className="mt-12 text-5xl font-normal tracking-tight sm:text-7xl">
            Mehmed<span className="text-lime">SuperFoods</span>
          </p>
        )}
      </div>
      <div className="bg-lime py-3 text-center text-xs text-lime-text">
        © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

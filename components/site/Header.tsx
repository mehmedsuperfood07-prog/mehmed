"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Hardcoded until site_settings.header_nav has a dashboard editor -- see
// CLAUDE.md "Current state". Keep in sync with the pages actually seeded.
const PRIMARY_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/private-label", label: "Private Label" },
  { href: "/become-a-distributor", label: "Retail Partners" },
  { href: "/quality", label: "Quality" },
];

// Remaining pages tucked into a "More" dropdown so the pill nav doesn't
// grow past what the template's header was ever designed to hold.
const MORE_NAV_ITEMS = [
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const MOBILE_NAV_ITEMS = [...PRIMARY_NAV_ITEMS, ...MORE_NAV_ITEMS];

export function Header({ logoUrl }: { logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white px-4 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.06)] sm:px-6">
        <Link href="/" className="flex items-center text-lg font-medium text-ink">
          {logoUrl ? (
            <Image src={logoUrl} alt="Mehmed Super Foods" width={243} height={154} className="h-12 w-auto object-contain sm:h-16" priority />
          ) : (
            <>
              Mehmed<span className="text-primary">SuperFoods</span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-5 lg:gap-6 sm:flex">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button
              type="button"
              className="flex items-center gap-1 text-[15px] text-ink-soft transition-colors hover:text-ink"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((value) => !value)}
            >
              More
              <span className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full pt-3">
                <div className="flex w-52 flex-col gap-1 rounded-2xl bg-white p-2 shadow-[0_2px_20px_rgba(0,0,0,0.1)]">
                  {MORE_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-[15px] text-ink-soft hover:bg-cream hover:text-ink"
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full bg-primary px-6 py-2.5 text-[15px] text-white transition-colors hover:bg-primary-dark sm:inline-block"
        >
          Get a Quote
        </Link>

        <button
          className="sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl bg-white p-4 shadow-[0_2px_20px_rgba(0,0,0,0.06)] sm:hidden">
          {MOBILE_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-[15px] text-ink-soft hover:bg-cream hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

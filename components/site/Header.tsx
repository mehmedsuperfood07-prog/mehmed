"use client";

import { useState } from "react";
import Link from "next/link";

// Hardcoded until site_settings.header_nav has a dashboard editor -- see
// CLAUDE.md "Current state". Keep in sync with the pages actually seeded.
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white px-4 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.06)] sm:px-6">
        <Link href="/" className="text-lg font-medium text-ink">
          Mehmed<span className="text-primary">SuperFoods</span>
        </Link>

        <nav className="hidden gap-8 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
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
          {NAV_ITEMS.map((item) => (
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

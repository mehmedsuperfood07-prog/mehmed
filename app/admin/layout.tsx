import type { Metadata } from "next";
import type { ReactNode } from "react";

// Covers the whole /admin tree (login included -- it's a client component
// and can't export metadata itself). robots.ts also disallows /admin, but
// a noindex tag here is the belt-and-braces part: it still applies even if
// a crawler reaches the page some other way (an external link, etc.)
// without ever reading robots.txt.
export const metadata: Metadata = {
  title: "Admin — Mehmed Super Foods",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}

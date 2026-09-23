import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Italic accent font -- matches the template's emphasis treatment
// ("Every Bite", "Seriously Delicious"). Only ever used italicized via the
// .accent class, never for full headings or body copy.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

const DEFAULT_DESCRIPTION =
  "Mehmed Super Foods — whole wheat flour, Mehmed Rice, and Rizqan sugarcane juice, supplied across Lahore to general stores, departmental stores, and bulk buyers.";

export const metadata: Metadata = {
  // Not using a title.template here: every page's seo_title is stored as
  // the full, final string (e.g. "About Us — Mehmed Super Foods") already,
  // so a template would double the suffix. This default only ever
  // surfaces for a route with no page row (a genuine 404).
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        {children}
      </body>
    </html>
  );
}

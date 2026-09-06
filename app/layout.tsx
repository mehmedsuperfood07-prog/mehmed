import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Mehmed Super Foods",
  description:
    "Mehmed Super Foods — whole wheat flour, Mehmed Rice, and Rizqan sugarcane juice, supplied across Lahore to general stores, departmental stores, and bulk buyers.",
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

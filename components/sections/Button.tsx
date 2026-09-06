import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "lime" | "outline" | "outline-dark";

const VARIANT_CLASSES: Record<Variant, string> = {
  solid: "bg-primary text-white hover:bg-primary-dark",
  lime: "bg-lime text-lime-text hover:brightness-95",
  outline: "border border-white/50 text-white hover:bg-white/10",
  "outline-dark": "border border-ink/20 text-ink hover:bg-ink/5",
};

// Fully pill-shaped everywhere -- the template's one consistent button
// shape (rounded-full, generous horizontal padding) regardless of color.
export function Button({
  href,
  variant = "solid",
  children,
  className = "",
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-8 py-3 text-base font-normal transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

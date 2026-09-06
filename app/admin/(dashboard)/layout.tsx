import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

// Only sections that actually exist so far. Add to this list as each
// dashboard area (Pages, Products, Blog, Testimonials, Settings) gets built
// -- see PLAN.md section 7 and CLAUDE.md "Current state".
const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/leads", label: "Leads" },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already redirects unauthenticated requests before they reach
  // this layout; this is defense in depth, not the primary gate.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-64 shrink-0 flex-col border-r border-black/5 bg-surface">
        <div className="border-b border-black/5 px-6 py-5">
          <p className="font-display text-lg text-ink">Mehmed Super Foods</p>
          <p className="mt-0.5 text-xs text-ink/50">Admin dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-cream hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-black/5 px-3 py-4">
          <p className="truncate px-3 text-xs text-ink/50">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();

  const [newLeads, totalProducts, publishedPages] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("pages").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);

  return {
    newLeads: newLeads.count ?? 0,
    totalProducts: totalProducts.count ?? 0,
    publishedPages: publishedPages.count ?? 0,
  };
}

export default async function AdminOverviewPage() {
  const counts = await getCounts();

  const stats = [
    { label: "New leads", value: counts.newLeads, href: "/admin/leads" },
    { label: "Products", value: counts.totalProducts, href: null },
    { label: "Published pages", value: counts.publishedPages, href: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Overview</h1>
        <p className="mt-1 text-sm text-ink/60">
          A quick look at what&apos;s happening on the site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-black/5 bg-surface p-6"
          >
            <p className="text-sm text-ink/60">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-black/5 bg-surface p-6 text-sm text-ink/60">
        Pages, Products, Blog, Testimonials, and Settings management are
        coming in the next phases of the build (see PLAN.md section 7). For
        now this dashboard covers sign-in and the Leads inbox.
      </div>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPagesListPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase.from("pages").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Pages</h1>
          <p className="mt-1 text-sm text-ink/60">Manage the site&apos;s pages and their sections.</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          New Page
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pages?.map((page) => (
              <tr key={page.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink">{page.title}</td>
                <td className="px-4 py-3 text-ink/60">/{page.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      page.status === "published"
                        ? "bg-primary/10 text-primary-dark"
                        : "bg-gold/15 text-ink/70"
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/60">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

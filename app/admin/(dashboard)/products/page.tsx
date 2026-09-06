import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsListPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_categories(name)")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink/60">Manage the products shown on the site.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/categories" className="text-sm font-medium text-primary hover:text-primary-dark">
            Manage Categories
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            New Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink">{product.name}</td>
                <td className="px-4 py-3 text-ink/60">
                  {(product.product_categories as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-ink/60">{product.is_featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.status === "published"
                        ? "bg-primary/10 text-primary-dark"
                        : "bg-gold/15 text-ink/70"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="p-6 text-sm text-ink/60">No products yet.</p>
        )}
      </div>
    </div>
  );
}

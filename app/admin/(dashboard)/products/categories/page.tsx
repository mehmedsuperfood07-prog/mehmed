import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "./category-manager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-primary hover:text-primary-dark">
          ← Back to Products
        </Link>
        <h1 className="mt-2 font-display text-2xl text-ink">Product Categories</h1>
      </div>
      <CategoryManager categories={categories ?? []} />
    </div>
  );
}

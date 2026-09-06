import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl text-ink">New Product</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProductStatus = "draft" | "published";

export type ProductInput = {
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string | null;
  pack_sizes: string[];
  is_featured: boolean;
  sort_order: number;
  status: ProductStatus;
};

export async function createProduct(input: ProductInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").insert(input).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  return data.id as string;
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function createCategory(input: { name: string; slug: string; sort_order: number }) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_categories").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products/categories");
  revalidatePath("/admin/products");
}

export async function updateCategory(
  id: string,
  input: { name: string; slug: string; sort_order: number },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_categories").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products/categories");
  revalidatePath("/admin/products");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products/categories");
  revalidatePath("/admin/products");
}

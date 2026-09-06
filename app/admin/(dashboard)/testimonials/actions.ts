"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TestimonialStatus = "draft" | "published";

export type TestimonialInput = {
  author_name: string;
  author_role: string | null;
  area: string | null;
  rating: number;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
  status: TestimonialStatus;
};

export async function createTestimonial(input: TestimonialInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
}

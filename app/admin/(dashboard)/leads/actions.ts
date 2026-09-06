"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Not a generated DB enum -- the `status` column is a plain CHECK
// constraint (see supabase/migrations), so Supabase's type generator can't
// narrow it. This union is hand-kept in sync with that constraint.
export type LeadStatus = "new" | "contacted" | "closed";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/leads");
}

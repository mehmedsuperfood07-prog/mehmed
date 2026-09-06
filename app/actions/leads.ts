"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { leadInputSchema, type LeadInput } from "@/lib/validations/leads";

// Every lead form (general contact, bulk quote, and future distributor
// signup) goes through this one action -- see CLAUDE.md "Working
// conventions". Uses the service-role client because these submissions
// come from anonymous site visitors with no Supabase session; the `leads`
// table has no anon RLS policy at all, so this is the only write path.
export async function submitLead(
  input: LeadInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = leadInputSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Please check the form and try again." };
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  const { error } = await supabase.from("leads").insert({
    type: data.type,
    name: data.name,
    email: data.email || null,
    message: data.message || null,
    phone: "phone" in data ? data.phone || null : null,
    business_name: "business_name" in data ? data.business_name : null,
    city: "city" in data ? data.city : null,
    business_type: "business_type" in data ? data.business_type : null,
    products_interested: "products_interested" in data ? data.products_interested : [],
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  // TODO: Resend email notification once RESEND_API_KEY is set -- see
  // CLAUDE.md "Known open items". Leads are already visible in
  // /admin/leads regardless.

  return { success: true };
}

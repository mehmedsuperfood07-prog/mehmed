import "server-only";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

// No-ops until RESEND_API_KEY is set (see CLAUDE.md "Known open items") --
// callers should treat this as best-effort and never let it block a lead
// from being saved. Sender uses Resend's shared onboarding@resend.dev
// address, which only delivers to the Resend account's own verified email
// until mehmedsuperfood.pk is verified as a sending domain -- switch the
// `from` address once that's done.
const DETAIL_LABELS: Record<string, string> = {
  packs_per_month: "Packs per month",
  frequency: "Frequency",
  delivery_location: "Delivery location",
};

function detailLines(details: Lead["details"]) {
  if (!details || typeof details !== "object" || Array.isArray(details)) return [];
  return Object.entries(details).map(([key, value]) => `${DETAIL_LABELS[key] ?? key}: ${String(value)}`);
}

export async function sendLeadNotification(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const supabase = createAdminClient();
    const { data: settings } = await supabase
      .from("site_settings")
      .select("email")
      .eq("id", 1)
      .maybeSingle();

    const to = settings?.email;
    if (!to) return;

    const resend = new Resend(apiKey);
    const typeLabel = { general: "General inquiry", quote: "Bulk quote request", distributor: "Distributor inquiry", ration_pack: "Ration pack request" }[
      lead.type
    ] ?? lead.type;

    await resend.emails.send({
      from: "Mehmed Super Foods <onboarding@resend.dev>",
      to,
      subject: `${typeLabel} from ${lead.name}${lead.business_name ? ` (${lead.business_name})` : ""}`,
      text: [
        `Type: ${typeLabel}`,
        `Name: ${lead.name}`,
        lead.business_name && `Business: ${lead.business_name}`,
        lead.phone && `Phone: ${lead.phone}`,
        lead.email && `Email: ${lead.email}`,
        lead.city && `City: ${lead.city}`,
        lead.business_type && `Business type: ${lead.business_type}`,
        ...detailLines(lead.details),
        lead.products_interested.length > 0 && `Products: ${lead.products_interested.join(", ")}`,
        lead.message && `Message: ${lead.message}`,
        "",
        "View and manage this lead in the dashboard at /admin/leads.",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch {
    // Best-effort only -- the lead is already saved regardless of whether
    // the notification email succeeds.
  }
}

import "server-only";
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

const TYPE_LABELS: Record<string, string> = {
  general: "General inquiry",
  quote: "Bulk quote request",
  distributor: "Distributor inquiry",
  ration_pack: "Ration pack request",
};

const DETAIL_LABELS: Record<string, string> = {
  packs_per_month: "Packs per month",
  frequency: "Frequency",
  delivery_location: "Delivery location",
};

function detailLines(details: Lead["details"]) {
  if (!details || typeof details !== "object" || Array.isArray(details)) return [];
  return Object.entries(details).map(([key, value]) => `${DETAIL_LABELS[key] ?? key}: ${String(value)}`);
}

// Sends through the business mailbox's SMTP (Hostinger by default). No-ops
// until SMTP_USER and SMTP_PASSWORD are set, and never throws -- callers
// rely on the lead already being saved, so a mail failure must not surface
// to the visitor. Timeouts are short so a slow mail server can't hang the
// form submission.
export async function sendLeadNotification(lead: Lead) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return;

  try {
    const supabase = createAdminClient();
    const { data: settings } = await supabase
      .from("site_settings")
      .select("email")
      .eq("id", 1)
      .maybeSingle();

    const to = process.env.LEAD_NOTIFY_TO || settings?.email || user;
    const port = Number(process.env.SMTP_PORT ?? 465);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });

    const typeLabel = TYPE_LABELS[lead.type] ?? lead.type;

    await transporter.sendMail({
      from: `"Mehmed Super Foods Website" <${user}>`,
      to,
      replyTo: lead.email || undefined,
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
        "View and manage this lead in the dashboard: https://www.mehmedsuperfood.pk/admin/leads",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch {
    // Best-effort only -- the lead is already saved.
  }
}

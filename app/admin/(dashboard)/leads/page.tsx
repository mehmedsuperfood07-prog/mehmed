import { createClient } from "@/lib/supabase/server";
import { LeadStatusSelect } from "./lead-status-select";
import type { LeadStatus } from "./actions";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-ink">Leads</h1>
        <p className="mt-1 text-sm text-ink/60">
          Submissions from the contact, quote, and distributor forms.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red/10 px-3 py-2 text-sm text-red">{error.message}</p>
      )}

      {!error && (!leads || leads.length === 0) && (
        <div className="rounded-2xl border border-black/5 bg-surface p-6 text-sm text-ink/60">
          No leads yet. Submissions from the public site&apos;s forms will show up here once those
          forms are built (PLAN.md section 3.4).
        </div>
      )}

      {!error && leads && leads.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Name / Business</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-black/5 last:border-0 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-ink/60">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink/80">{lead.type}</td>
                  <td className="px-4 py-3 text-ink">
                    <div>{lead.name}</div>
                    {lead.business_name && (
                      <div className="text-xs text-ink/50">{lead.business_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/80">
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div className="text-xs text-ink/50">{lead.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink/80">{lead.city ?? "—"}</td>
                  <td className="max-w-xs px-4 py-3 text-ink/70">{lead.message ?? "—"}</td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect id={lead.id} status={lead.status as LeadStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

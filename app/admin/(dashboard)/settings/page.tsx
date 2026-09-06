import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  if (!settings) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink/60">Contact details shown in the footer and elsewhere on the site.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { ContactInfoContent } from "./types";

export async function ContactInfo({ content }: { content: ContactInfoContent }) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  const rows = [
    { label: "Head Office", value: settings?.address },
    { label: "Phone", value: settings?.phone },
    { label: "WhatsApp", value: settings?.whatsapp },
    { label: "Email", value: settings?.email },
    { label: "Opening Hours", value: settings?.opening_hours },
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          {content.eyebrow && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
              {content.eyebrow}
            </p>
          )}
          <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>
          <div className="mt-8 divide-y divide-black/10 border-t border-black/10">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-center justify-between gap-2 py-4"
              >
                <span className="text-ink">{row.label}</span>
                <span className="accent text-xl text-primary">{row.value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

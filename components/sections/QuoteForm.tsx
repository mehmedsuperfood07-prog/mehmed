import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { QuoteFormFields } from "./QuoteFormFields";
import type { QuoteFormContent } from "./types";

export async function QuoteForm({ content }: { content: QuoteFormContent }) {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("name")
    .order("sort_order", { ascending: true });

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
              Get a Quote
            </p>
            {content.heading && <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>}
            {content.body && <p className="mt-4 max-w-md text-ink-soft">{content.body}</p>}

            {content.info_items && content.info_items.length > 0 && (
              <div className="relative mt-8 max-w-sm rounded-2xl bg-primary p-6 text-white">
                <div className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-lime text-lime-text">
                  i
                </div>
                <p className="text-lg font-medium">{content.info_heading ?? "We Supply To:"}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/85">
                  {content.info_items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-lime">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <QuoteFormFields categories={categories?.map((c) => c.name) ?? []} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

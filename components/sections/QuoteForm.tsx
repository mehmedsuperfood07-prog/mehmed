import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { QuoteFormFields } from "./QuoteFormFields";
import type { QuoteFormContent } from "./types";

export async function QuoteForm({ content }: { content: QuoteFormContent }) {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("product_categories")
    .select("name")
    .order("sort_order", { ascending: true });

  return (
    <section className="bg-cream py-16">
      <Container className="max-w-2xl">
        <Reveal>
          {content.heading && (
            <h2 className="text-center font-display text-3xl text-ink">{content.heading}</h2>
          )}
          {content.body && <p className="mt-3 text-center text-ink/70">{content.body}</p>}
          <QuoteFormFields categories={categories?.map((c) => c.name) ?? []} />
        </Reveal>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { ProductListContent } from "./types";

export async function ProductList({ content }: { content: ProductListContent }) {
  const supabase = await createClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("product_categories").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
  ]);

  const groups = (categories ?? [])
    .map((category) => ({
      category,
      items: (products ?? []).filter((product) => product.category_id === category.id),
    }))
    .filter((group) => group.items.length > 0);

  const uncategorized = (products ?? []).filter((product) => !product.category_id);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        {content.heading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
              Signature Range
            </p>
            <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>
            {content.subheading && <p className="mt-4 text-ink-soft">{content.subheading}</p>}
          </Reveal>
        )}

        <div className="mt-14 space-y-16">
          {groups.map(({ category, items }) => (
            <Reveal key={category.id} className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream md:aspect-auto">
                {items[0]?.image_url ? (
                  <Image src={items[0].image_url} alt={category.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full min-h-[240px] items-center justify-center text-sm text-primary/40">
                    Photo coming soon
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl text-ink">{category.name}</h3>
                <div className="mt-5 space-y-3">
                  {items.map((product) => (
                    <div key={product.id} className="rounded-2xl bg-lime p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-lime-text">{product.name}</span>
                        {product.pack_sizes[0] && (
                          <span className="accent text-lg text-primary">{product.pack_sizes[0]}</span>
                        )}
                      </div>
                      {product.short_description && (
                        <p className="mt-1 text-sm text-lime-text/70">{product.short_description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          {uncategorized.length > 0 && (
            <div className="space-y-3">
              {uncategorized.map((product) => (
                <div key={product.id} className="rounded-2xl bg-lime p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium text-lime-text">{product.name}</span>
                    {product.pack_sizes[0] && (
                      <span className="accent text-lg text-primary">{product.pack_sizes[0]}</span>
                    )}
                  </div>
                  {product.short_description && (
                    <p className="mt-1 text-sm text-lime-text/70">{product.short_description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {groups.length === 0 && uncategorized.length === 0 && (
            <p className="text-center text-sm text-ink-soft">
              Products will appear here once added from the dashboard.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

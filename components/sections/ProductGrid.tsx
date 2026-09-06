import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { ProductGridContent } from "./types";

export async function ProductGrid({ content }: { content: ProductGridContent }) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (content.featured_only) {
    query = query.eq("is_featured", true);
  }

  const { data: products } = await query;

  return (
    <section className="py-16">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-ink">{content.heading}</h2>
          {content.subheading && <p className="mt-3 text-ink/70">{content.subheading}</p>}
        </Reveal>

        {(!products || products.length === 0) && (
          <p className="mt-10 text-center text-sm text-ink/50">
            Products will appear here once added from the dashboard.
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products?.map((product, index) => (
            <Reveal
              key={product.id}
              delay={index * 0.08}
              className="overflow-hidden rounded-2xl border border-black/5 bg-surface transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-square bg-cream">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-contain p-4" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-primary/40">
                    Photo coming soon
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg text-ink">{product.name}</h3>
                {product.short_description && (
                  <p className="mt-2 text-sm text-ink/70">{product.short_description}</p>
                )}
                {product.pack_sizes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.pack_sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-ink/80"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Inquire for bulk pricing →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

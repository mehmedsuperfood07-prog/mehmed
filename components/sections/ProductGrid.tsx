import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
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
    <section className="bg-primary py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-lime">
            Best Sellers
          </p>
          <h2 className="h2 text-white">{renderHeading(content.heading, "text-lime")}</h2>
          {content.subheading && <p className="mt-4 text-white/75">{content.subheading}</p>}
        </Reveal>

        <div className="mt-12 rounded-[2rem] bg-white p-6 sm:p-10">
          {(!products || products.length === 0) && (
            <p className="py-10 text-center text-sm text-ink-soft">
              Products will appear here once added from the dashboard.
            </p>
          )}

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {products?.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.08}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-primary/40">
                      Photo coming soon
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium text-ink">{product.name}</h3>
                {product.short_description && (
                  <p className="mt-1.5 text-sm text-ink-soft">{product.short_description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {product.pack_sizes.length > 0 ? (
                    <span className="accent text-xl text-primary">{product.pack_sizes[0]}</span>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Inquire →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button href="/products" variant="lime">
              See Full Range
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import type { ProductListContent } from "./types";

type Product = Database["public"]["Tables"]["products"]["Row"];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex w-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-lime/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/5] bg-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-primary/40">Photo coming soon</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-lg font-medium text-lime-text">{product.name}</h4>
          {product.pack_sizes[0] && (
            <span className="accent text-xl text-primary">{product.pack_sizes[0]}</span>
          )}
        </div>
        {product.short_description && (
          <p className="mt-2 text-sm leading-relaxed text-lime-text/70">{product.short_description}</p>
        )}
        <Link
          href={`/contact?product=${encodeURIComponent(product.name)}`}
          className="mt-auto pt-5 text-sm font-medium text-primary hover:text-primary-dark"
        >
          Inquire →
        </Link>
      </div>
    </div>
  );
}

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

        <div className="mt-14 space-y-20">
          {groups.map(({ category, items }) => (
            <div key={category.id}>
              <Reveal className="mb-8 flex items-center gap-4">
                <h3 className="text-3xl tracking-tight text-ink">{category.name}</h3>
                <span className="h-px flex-1 bg-primary/20" />
              </Reveal>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product, index) => (
                  <Reveal key={product.id} delay={index * 0.08} className="flex">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uncategorized.map((product) => (
                <ProductCard key={product.id} product={product} />
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

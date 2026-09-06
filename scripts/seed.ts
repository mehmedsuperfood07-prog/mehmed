// One-off content seed. Run with: node --env-file=.env.local -r tsx/cjs scripts/seed.ts
// (or `npm run seed`, which wires that up). Uses the service-role client, so
// it bypasses RLS -- see lib/supabase/admin.ts.
//
// Deliberately does NOT invent specific numeric business claims (years in
// business, retail partner counts, etc.) -- only the client can supply real
// figures, and publishing fabricated stats to a live domain is a different
// risk than generic placeholder marketing copy. See PLAN.md section 8.

// Not importing lib/supabase/admin.ts here: it imports the `server-only`
// package, which throws unconditionally outside Next's build (Next aliases
// it to a no-op only for server bundles). A standalone script needs its own
// client construction instead.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const LAHORE_AREAS = [
  "Gulberg",
  "Model Town",
  "Johar Town",
  "DHA",
  "Township",
  "Shahdara",
  "Allama Iqbal Town",
  "Faisal Town",
];

async function upsertCategory(name: string, slug: string, sortOrder: number) {
  const { data: existing } = await supabase
    .from("product_categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("product_categories")
    .insert({ name, slug, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertProduct(product: {
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  pack_sizes: string[];
  is_featured: boolean;
  sort_order: number;
}) {
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("slug", product.slug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("products").update(product).eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("products").insert({ ...product, status: "published" });
  if (error) throw error;
}

async function upsertTestimonial(testimonial: {
  author_name: string;
  author_role: string;
  area: string;
  rating: number;
  quote: string;
  sort_order: number;
}) {
  const { data: existing } = await supabase
    .from("testimonials")
    .select("id")
    .eq("author_name", testimonial.author_name)
    .eq("quote", testimonial.quote)
    .maybeSingle();

  if (existing) return;

  const { error } = await supabase.from("testimonials").insert({ ...testimonial, status: "published" });
  if (error) throw error;
}

async function upsertPage(page: {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: { type: string; content: any }[];
}) {
  const { data: existingPage } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", page.slug)
    .maybeSingle();

  let pageId: string;

  if (existingPage) {
    pageId = existingPage.id;
    const { error } = await supabase
      .from("pages")
      .update({
        title: page.title,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        status: "published",
      })
      .eq("id", pageId);
    if (error) throw error;

    // Replace sections wholesale -- simplest way to keep the seed script
    // idempotent without diffing content.
    const { error: deleteError } = await supabase.from("page_sections").delete().eq("page_id", pageId);
    if (deleteError) throw deleteError;
  } else {
    const { data, error } = await supabase
      .from("pages")
      .insert({
        slug: page.slug,
        title: page.title,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        status: "published",
      })
      .select("id")
      .single();
    if (error) throw error;
    pageId = data.id;
  }

  const rows = page.sections.map((section, index) => ({
    page_id: pageId,
    type: section.type,
    position: index,
    content: section.content,
  }));

  const { error } = await supabase.from("page_sections").insert(rows);
  if (error) throw error;

  console.log(`Seeded page: ${page.slug}`);
}

async function main() {
  console.log("Seeding product categories...");
  const flourCategoryId = await upsertCategory("Whole Wheat Flour", "whole-wheat-flour", 1);
  const riceCategoryId = await upsertCategory("Mehmed Rice", "mehmed-rice", 2);
  const juiceCategoryId = await upsertCategory("Rizqan Sugarcane Juice", "rizqan-sugarcane-juice", 3);

  console.log("Seeding products...");
  await upsertProduct({
    category_id: flourCategoryId,
    name: "Mehmed Chakki Atta",
    slug: "mehmed-chakki-atta",
    short_description: "Soft roti for 7 hours — stone-ground whole wheat flour, freshly packed.",
    description:
      "Mehmed Chakki Atta is stone-ground from quality wheat for a soft, fluffy roti that stays fresh for hours. Packed hygienically and supplied fresh to shops across Lahore.",
    pack_sizes: ["5kg"],
    is_featured: true,
    sort_order: 1,
  });

  await upsertProduct({
    category_id: riceCategoryId,
    name: "Mehmed Rice",
    slug: "mehmed-rice",
    short_description: "Quality rice for everyday meals, carefully sourced and packed by Mehmed.",
    description:
      "Mehmed Rice is sourced and packed with the same quality standards as our other staples. Full variety and pack-size details coming soon.",
    pack_sizes: [],
    is_featured: true,
    sort_order: 1,
  });

  await upsertProduct({
    category_id: juiceCategoryId,
    name: "Rizqan Sugarcane Juice — Lemon",
    slug: "rizqan-sugarcane-juice-lemon",
    short_description: "100% natural sugarcane juice with a refreshing lemon twist. Fresh, hygienic, nothing added.",
    description:
      "Rizqan Sugarcane Juice (Lemon) is made fresh and hygienically bottled with no artificial additives — a refreshing, naturally sweet drink for any season.",
    pack_sizes: ["1L bottle"],
    is_featured: true,
    sort_order: 2,
  });

  await upsertProduct({
    category_id: juiceCategoryId,
    name: "Rizqan Sugarcane Juice — Lemon + Mint",
    slug: "rizqan-sugarcane-juice-lemon-mint",
    short_description: "Sugarcane juice with lemon and mint for an extra-refreshing finish. Fresh, hygienic, nothing added.",
    description:
      "Rizqan Sugarcane Juice (Lemon + Mint) blends fresh sugarcane, lemon, and mint into a naturally refreshing, hygienically bottled drink with nothing artificial added.",
    pack_sizes: ["1L bottle"],
    is_featured: true,
    sort_order: 3,
  });

  console.log("Seeding testimonials (dummy — replace with real quotes before launch)...");
  await upsertTestimonial({
    author_name: "Imran",
    author_role: "Shopkeeper",
    area: "Model Town, Lahore",
    rating: 5,
    quote: "Mehmed's atta has become one of our best sellers — customers keep asking for it by name.",
    sort_order: 1,
  });
  await upsertTestimonial({
    author_name: "Bilal",
    author_role: "Store Owner",
    area: "Gulberg, Lahore",
    rating: 5,
    quote: "Rizqan juice is a hit with customers, and deliveries are always on time.",
    sort_order: 2,
  });
  await upsertTestimonial({
    author_name: "Ayesha",
    author_role: "Bakery Owner",
    area: "Township, Lahore",
    rating: 5,
    quote: "Reliable bulk supply for our bakery, every single week — exactly what we needed.",
    sort_order: 3,
  });

  console.log("Seeding site settings...");
  await supabase
    .from("site_settings")
    .update({
      address: "Lahore, Punjab, Pakistan",
      phone: "+92 300 0000000",
      email: "info@mehmedsuperfood.pk",
      opening_hours: "Mon–Sat: 9:00 AM – 7:00 PM",
      coverage_areas: LAHORE_AREAS,
    })
    .eq("id", 1);

  console.log("Seeding pages...");

  await upsertPage({
    slug: "home",
    title: "Home",
    seo_title: "Mehmed Super Foods — Whole Wheat Flour, Rice & Rizqan Sugarcane Juice",
    seo_description:
      "Mehmed Super Foods supplies whole wheat flour, rice, and Rizqan sugarcane juice to general stores, departmental stores, bakeries, and factories across Lahore.",
    sections: [
      {
        type: "hero",
        content: {
          eyebrow: "Quality Staples, Delivered Fresh",
          headline: "Quality You Can Taste, Trust You Can Rely On",
          subheadline:
            "Whole wheat flour, rice, and Rizqan sugarcane juice — freshly packed and delivered across Lahore.",
          primary_cta_label: "View Products",
          primary_cta_href: "/products",
          secondary_cta_label: "Request Bulk Quote",
          secondary_cta_href: "/contact",
        },
      },
      {
        type: "image_with_text",
        content: {
          heading: "A Household Name in Quality Staples",
          body: "Mehmed Super Foods packs and supplies whole wheat flour, rice, and Rizqan sugarcane juice to shops, bakeries, and factories across Lahore — with a focus on quality sourcing and hygienic packing at every step.",
          image_on_right: true,
        },
      },
      {
        type: "product_grid",
        content: {
          heading: "Our Products",
          subheading: "Quality staples for your shop, bakery, or factory.",
          featured_only: true,
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "Why Choose Mehmed",
          subheading: "Here's what shops and bulk buyers can count on.",
          features: [
            {
              title: "Hygienically Packed",
              description: "Every product is packed with hygiene and quality control in mind.",
            },
            {
              title: "Quality-Checked Sourcing",
              description: "Wheat and rice are sourced and checked for consistent quality.",
            },
            {
              title: "Reliable Bulk Delivery",
              description: "Timely delivery across Lahore for both retail and bulk orders.",
            },
            {
              title: "Fresh, Additive-Free Juice",
              description: "Rizqan sugarcane juice is bottled fresh with nothing artificial added.",
            },
          ],
        },
      },
      {
        type: "coverage_area",
        content: {
          heading: "Where We Deliver",
          body: "We currently supply general stores, departmental stores, bakeries, and factories across these areas of Lahore — with more added as we grow.",
          areas: LAHORE_AREAS,
        },
      },
      {
        type: "testimonial_slider",
        content: { heading: "What Our Customers Say" },
      },
      {
        type: "quote_form",
        content: {
          heading: "Become a Stockist or Request a Bulk Quote",
          body: "Running a store, bakery, or factory canteen? Tell us what you need and we'll get back to you with pricing and availability.",
        },
      },
      {
        type: "cta_banner",
        content: {
          heading: "Ready to Stock Mehmed?",
          body: "Get in touch and let's talk about your store or facility's needs.",
          buttons: [
            { label: "View Products", href: "/products" },
            { label: "Read Our Story", href: "/about" },
            { label: "Contact Us", href: "/contact" },
          ],
        },
      },
    ],
  });

  await upsertPage({
    slug: "products",
    title: "Products",
    seo_title: "Products — Mehmed Super Foods",
    seo_description:
      "Explore Mehmed Super Foods' full product line: whole wheat flour, rice, and Rizqan sugarcane juice.",
    sections: [
      {
        type: "hero",
        content: {
          headline: "Our Products",
          subheadline:
            "Whole wheat flour, rice, and Rizqan sugarcane juice — packed fresh for shops, bakeries, and factories across Lahore.",
        },
      },
      {
        type: "product_grid",
        content: { heading: "All Products", featured_only: false },
      },
      {
        type: "quote_form",
        content: {
          heading: "Need a Custom Quote?",
          body: "Tell us what you're looking for and we'll get back to you with pricing and availability.",
        },
      },
    ],
  });

  await upsertPage({
    slug: "about",
    title: "About Us",
    seo_title: "About Us — Mehmed Super Foods",
    seo_description: "Learn about Mehmed Super Foods' commitment to quality staples, from sourcing to your shop shelf.",
    sections: [
      {
        type: "hero",
        content: {
          headline: "About Mehmed Super Foods",
          subheadline: "A commitment to quality staples, from sourcing to your shop shelf.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Our Story",
          body: "Mehmed Super Foods started with a simple goal: bring consistently good whole wheat flour, rice, and refreshing sugarcane juice to shops and businesses across Lahore.\n\nToday, we supply general stores, departmental stores, and bulk buyers like bakeries and factories, with a focus on quality and reliable delivery.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Our Philosophy",
          body: "We believe staples shouldn't be an afterthought. Every batch is packed with attention to hygiene and quality, whether it's headed to a corner store or a factory kitchen.",
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "Our Process",
          features: [
            { title: "Sourcing", description: "Wheat and rice sourced with quality in mind." },
            { title: "Milling & Processing", description: "Processed and packed under hygienic conditions." },
            { title: "Packing", description: "Sealed and labelled for freshness and consistency." },
            { title: "Distribution", description: "Delivered across Lahore to retail and bulk customers." },
          ],
        },
      },
      {
        type: "coverage_area",
        content: { heading: "Where We Deliver", areas: LAHORE_AREAS },
      },
      {
        type: "cta_banner",
        content: {
          heading: "Want to Partner with Us?",
          buttons: [
            { label: "View Products", href: "/products" },
            { label: "Contact Us", href: "/contact" },
          ],
        },
      },
    ],
  });

  await upsertPage({
    slug: "contact",
    title: "Contact",
    seo_title: "Contact Us — Mehmed Super Foods",
    seo_description: "Get in touch with Mehmed Super Foods for product inquiries, pricing, or bulk orders.",
    sections: [
      {
        type: "hero",
        content: {
          headline: "Get in Touch",
          subheadline: "Questions about our products, pricing, or delivery? We're here to help.",
        },
      },
      {
        type: "contact_form",
        content: {
          heading: "Send Us a Message",
          body: "Fill out the form and we'll get back to you as soon as we can.",
        },
      },
      {
        type: "coverage_area",
        content: { heading: "Where We Deliver", areas: LAHORE_AREAS },
      },
    ],
  });

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

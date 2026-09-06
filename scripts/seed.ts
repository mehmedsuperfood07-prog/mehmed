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
          headline: "Quality You Can Taste, **Trust You Can Rely On**",
          subheadline:
            "Whole wheat flour, rice, and Rizqan sugarcane juice — freshly packed and delivered across Lahore.",
          primary_cta_label: "View Products",
          primary_cta_href: "/products",
          secondary_cta_label: "Request Bulk Quote",
          secondary_cta_href: "/contact",
        },
      },
      {
        type: "logo_carousel",
        content: {
          heading: "Trusted By",
          logos: [
            { label: "General Stores" },
            { label: "Departmental Stores" },
            { label: "Bakeries" },
            { label: "Factories & Canteens" },
            { label: "Distributors" },
          ],
        },
      },
      {
        type: "image_with_text",
        content: {
          heading: "A Household Name in **Quality Staples**",
          body: "Mehmed Super Foods packs and supplies whole wheat flour, rice, and Rizqan sugarcane juice to shops, bakeries, and factories across Lahore — with a focus on quality sourcing and hygienic packing at every step.",
          image_on_right: true,
          cta_label: "More About Us",
          cta_href: "/about",
        },
      },
      {
        type: "product_grid",
        content: {
          heading: "Our Menu is **Rolling with Quality**",
          subheading: "Quality staples for your shop, bakery, or factory.",
          featured_only: true,
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "Because Your Shelves Deserve **Seriously Reliable** Staples",
          subheading: "Here's what shops and bulk buyers can count on.",
          style: "light",
          features: [
            {
              icon: "🧼",
              title: "Hygienically Packed",
              description: "Every product is packed with hygiene and quality control in mind.",
            },
            {
              icon: "🌾",
              title: "Quality-Checked Sourcing",
              description: "Wheat and rice are sourced and checked for consistent quality.",
            },
            {
              icon: "🚚",
              title: "Reliable Bulk Delivery",
              description: "Timely delivery across Lahore for both retail and bulk orders.",
            },
            {
              icon: "🥤",
              title: "Fresh, Additive-Free Juice",
              description: "Rizqan sugarcane juice is bottled fresh with nothing artificial added.",
            },
          ],
        },
      },
      {
        type: "coverage_area",
        content: {
          heading: "We **Move with the Flavor** – Where We Deliver",
          body: "We currently supply general stores, departmental stores, bakeries, and factories across these areas of Lahore — with more added as we grow.",
          areas: LAHORE_AREAS,
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "More Than Staples – It's a **Supply You Can Count On**",
          subheading: "Mehmed is built for consistency, hygiene, and reliable bulk service.",
          style: "dark",
          features: [
            { icon: "🏭", title: "Hygienic packing facility" },
            { icon: "📦", title: "Consistent pack sizes" },
            { icon: "🕒", title: "On-time delivery" },
            { icon: "🤝", title: "Dedicated bulk support" },
          ],
        },
      },
      {
        type: "testimonial_slider",
        content: { heading: "**Bite-Sized Words** from Our Happy Customers" },
      },
      {
        type: "quote_form",
        content: {
          heading: "Become a Stockist or **Request a Bulk Quote**",
          body: "Running a store, bakery, or factory canteen? Tell us what you need and we'll get back to you with pricing and availability.",
          info_heading: "We Supply To:",
          info_items: ["General Stores", "Departmental Stores", "Bakeries", "Factories & Staff Canteens"],
        },
      },
      {
        type: "cta_banner",
        content: {
          heading: "One Step Away from Your **New Favorite Staple**",
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
        type: "page_header",
        content: {
          title: "Our Products",
          heading: "Staples Worth **Stocking**",
          body: "Whole wheat flour, rice, and Rizqan sugarcane juice — packed fresh for shops, bakeries, and factories across Lahore.",
        },
      },
      {
        type: "product_list",
        content: { heading: "All of Our **Products**" },
      },
      {
        type: "quote_form",
        content: {
          heading: "Need a **Custom Quote**?",
          body: "Tell us what you're looking for and we'll get back to you with pricing and availability.",
          info_heading: "We Supply To:",
          info_items: ["General Stores", "Departmental Stores", "Bakeries", "Factories & Staff Canteens"],
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
        type: "page_header",
        content: {
          title: "About Us",
          heading: "A Household Name in **Quality Staples**",
          body: "A commitment to quality staples, from sourcing to your shop shelf.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Our **Story**",
          body: "Mehmed Super Foods started with a simple goal: bring consistently good whole wheat flour, rice, and refreshing sugarcane juice to shops and businesses across Lahore.\n\nToday, we supply general stores, departmental stores, and bulk buyers like bakeries and factories, with a focus on quality and reliable delivery.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Our **Philosophy**",
          body: "We believe staples shouldn't be an afterthought. Every batch is packed with attention to hygiene and quality, whether it's headed to a corner store or a factory kitchen.",
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "From Sourcing to Your **Shop Shelf**",
          style: "light",
          features: [
            { icon: "🌾", title: "Sourcing", description: "Wheat and rice sourced with quality in mind." },
            { icon: "⚙️", title: "Milling & Processing", description: "Processed and packed under hygienic conditions." },
            { icon: "📦", title: "Packing", description: "Sealed and labelled for freshness and consistency." },
            { icon: "🚚", title: "Distribution", description: "Delivered across Lahore to retail and bulk customers." },
          ],
        },
      },
      {
        type: "coverage_area",
        content: { heading: "Where We **Deliver**", areas: LAHORE_AREAS },
      },
      {
        type: "cta_banner",
        content: {
          heading: "Want to **Partner** with Us?",
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
        type: "page_header",
        content: {
          title: "Contact Us",
          heading: "Let's **Get in Touch**",
          body: "Questions about our products, pricing, or delivery? We're here to help.",
        },
      },
      {
        type: "contact_info",
        content: {
          eyebrow: "Let's Connect",
          heading: "We're here to help with **product, pricing, or delivery questions**",
        },
      },
      {
        type: "contact_form",
        content: {
          heading: "Send Us a **Message**",
          body: "Fill out the form and we'll get back to you as soon as we can.",
        },
      },
      {
        type: "coverage_area",
        content: { heading: "Where We **Deliver**", areas: LAHORE_AREAS },
      },
    ],
  });

  await upsertPage({
    slug: "faq",
    title: "FAQ",
    seo_title: "Frequently Asked Questions — Mehmed Super Foods",
    seo_description: "Common questions about Mehmed Super Foods' products, delivery, and bulk ordering.",
    sections: [
      {
        type: "page_header",
        content: {
          title: "FAQ",
          heading: "Frequently **Asked Questions**",
          body: "Common questions about our products, delivery, and bulk ordering.",
        },
      },
      {
        type: "faq_accordion",
        content: {
          items: [
            {
              question: "What areas do you deliver to?",
              answer:
                "We currently deliver across several areas of Lahore, including Gulberg, Model Town, Johar Town, DHA, Township, Shahdara, Allama Iqbal Town, and Faisal Town. Contact us to confirm delivery to your specific location.",
            },
            {
              question: "Do you supply in bulk to bakeries and factories?",
              answer:
                "Yes — alongside retail supply to general and departmental stores, we supply bulk quantities to bakeries, food chains, and factories with staff meal programs. Use the quote form to tell us what you need.",
            },
            {
              question: "What is the minimum order quantity for bulk orders?",
              answer:
                "Minimum order quantities vary by product and business type. Request a quote and we'll get back to you with details tailored to your needs.",
            },
            {
              question: "What pack sizes are available?",
              answer:
                "Mehmed Chakki Atta is available in 5kg bags, and Rizqan Sugarcane Juice comes in 1L bottles (Lemon and Lemon + Mint). See the Products page for the full line-up, or ask us about other sizes for bulk orders.",
            },
            {
              question: "How do I become a stockist?",
              answer:
                "Fill out the bulk quote form on the homepage or Products page with your business details, and our team will get in touch to discuss stocking Mehmed products at your store.",
            },
          ],
        },
      },
    ],
  });

  await upsertPage({
    slug: "reviews",
    title: "Reviews",
    seo_title: "Customer Reviews — Mehmed Super Foods",
    seo_description: "What shopkeepers, bakeries, and factories across Lahore say about Mehmed Super Foods.",
    sections: [
      {
        type: "page_header",
        content: {
          title: "Reviews",
          heading: "What Our **Customers Say**",
          body: "Feedback from shopkeepers, bakeries, and factories we supply across Lahore.",
        },
      },
      {
        type: "testimonial_slider",
        content: {},
      },
      {
        type: "cta_banner",
        content: {
          heading: "Join Our Growing List of **Happy Customers**",
          buttons: [{ label: "Request a Quote", href: "/contact" }],
        },
      },
    ],
  });

  await upsertPage({
    slug: "become-a-distributor",
    title: "Become a Distributor",
    seo_title: "Become a Distributor — Mehmed Super Foods",
    seo_description:
      "Become a Mehmed Super Foods stockist or bulk distributor — general stores, departmental stores, bakeries, and factories across Lahore.",
    sections: [
      {
        type: "page_header",
        content: {
          title: "Become a Distributor",
          heading: "Bring Mehmed to **Your Shelves**",
          body: "Partner with Mehmed Super Foods to stock quality whole wheat flour, rice, and Rizqan sugarcane juice at your store or facility.",
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "Why Partner With **Mehmed**",
          style: "light",
          features: [
            { icon: "🧼", title: "Hygienically Packed", description: "Every product is packed with hygiene and quality control in mind." },
            { icon: "🚚", title: "Reliable Delivery", description: "Timely delivery across Lahore for both retail and bulk orders." },
            { icon: "🤝", title: "Responsive Support", description: "A dedicated point of contact for bulk and stockist accounts." },
          ],
        },
      },
      {
        type: "quote_form",
        content: {
          heading: "Request **Distributor** Information",
          body: "Tell us about your business and we'll get back to you with next steps.",
          info_heading: "Great Fit For:",
          info_items: ["General Stores", "Departmental Stores", "Bakeries", "Factories & Staff Canteens"],
        },
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

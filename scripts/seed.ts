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
import type { Database, Json } from "../lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

// Shown on every page (below the hero on home, near the bottom elsewhere --
// see withClientCarousel). Not for blog pages.
const CLIENT_CAROUSEL = {
  type: "logo_carousel",
  content: {
    heading: "Our Corporate Clients",
    // Real client logos, uploaded to Storage's media bucket once (see
    // git history for the one-off upload script) -- re-running seed
    // keeps these URLs rather than reverting to generic placeholders.
    logos: [
      { label: "Kitchen Cuisine", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/f962e271-5349-431c-8165-6afeec10e7ce.webp" },
      { label: "Nishat Mills", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/2dfeeb21-60b7-49df-b45c-24897c90bbb9.svg" },
      { label: "Sapphire", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/8f2b4e0d-daa3-45cd-8551-c198e46bdbcf.svg" },
      { label: "Fatima Memorial Hospital", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/c6641546-510c-4e20-9c38-7ccbedf012b6.png" },
      { label: "Manan Shahid Forging", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/0a45d110-e335-4590-89fa-12b4a189d20d.png" },
      { label: "Leathertex Group", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/189f92d6-0605-4edb-b0eb-ec8a9112e9f1.png" },
      { label: "Netsol Technologies", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/b4b20e3a-403e-4730-82cc-23b03a4f86f5.svg" },
      { label: "Usman Trader", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/05271b88-1432-4578-b4b3-0880e22d6c84.png" },
      { label: "Blue World City", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/436ea095-f441-40ae-a8cd-0038ed6b49a7.png" },
      { label: "Master Sanatory", image_url: "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/client-logos/48f0883f-7014-4903-8efe-88728c3199ef.png" },
    ],
    second_heading: "Trusted By:",
    second_items: ["General Stores", "Departmental Stores", "Bakeries", "Factories", "Supermarkets", "Wholesalers", "Distributors", "Hotels & Restaurants", "Institutions", "Corporate Canteens"],
  },
};

const CAROUSEL_AT_END = new Set(["contact", "faq"]);

function withClientCarousel<T extends { slug: string; sections: { type: string; content: Json }[] }>(page: T) {
  if (page.slug === "home" || page.sections.some((s) => s.type === "logo_carousel")) return page.sections;
  const at = CAROUSEL_AT_END.has(page.slug) ? page.sections.length : page.sections.length - 1;
  return [...page.sections.slice(0, at), CLIENT_CAROUSEL, ...page.sections.slice(at)];
}

// Product line-up photo (Storage `media` bucket), CTA banner background.
const PRODUCT_BANNER_URL =
  "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/brand/e9b47d34-0eac-4ed4-a7c4-f740a2089c60.webp";

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

  const rows = withClientCarousel(page).map((section, index) => ({
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
      "Mehmed Chakki Atta is stone-ground from quality wheat for a soft, fluffy roti that stays fresh for hours. Packed hygienically and supplied fresh to shops across Punjab.",
    pack_sizes: ["5kg"],
    is_featured: true,
    sort_order: 1,
  });

  await upsertProduct({
    category_id: flourCategoryId,
    name: "Mehmed Super White Flour",
    slug: "mehmed-super-white-flour",
    short_description: "Finely milled super white flour for soft rotis and everyday cooking.",
    description:
      "Mehmed Super White Flour is freshly milled for a smooth texture and everyday nutrition, packed hygienically and supplied fresh to shops across Punjab.",
    pack_sizes: ["5 Kg"],
    is_featured: true,
    sort_order: 2,
  });

  await upsertProduct({
    category_id: riceCategoryId,
    name: "Mehmed Kainat 1121 Rice",
    slug: "mehmed-kainat-1121-rice",
    short_description: "Premium long-grain Kainat 1121 rice, valued for its length and aroma after cooking.",
    description:
      "Mehmed Kainat 1121 Rice is sourced and packed with the same quality standards as our other staples — a premium long-grain variety popular with households and trade buyers alike.",
    pack_sizes: ["25 Kg"],
    is_featured: true,
    sort_order: 1,
  });

  await upsertProduct({
    category_id: riceCategoryId,
    name: "Mehmed Super Kernel Basmati Rice",
    slug: "mehmed-super-kernel-basmati-rice",
    short_description: "Classic aromatic Super Kernel Basmati rice with a fluffy texture, packed by Mehmed.",
    description:
      "Mehmed Super Kernel Basmati Rice offers the aroma and grain quality basmati is known for — sourced and packed for everyday households and bulk buyers.",
    pack_sizes: [],
    is_featured: false,
    sort_order: 2,
  });

  await upsertProduct({
    category_id: riceCategoryId,
    name: "Mehmed Sella Rice",
    slug: "mehmed-sella-rice",
    short_description: "Parboiled Sella rice with firm, non-sticky grains for everyday cooking.",
    description:
      "Mehmed Sella Rice is parboiled for firm, separate grains — a reliable everyday choice for households, restaurants and bulk kitchens.",
    pack_sizes: [],
    is_featured: false,
    sort_order: 3,
  });

  // Note: the plain "Lemon" variant was removed via the admin dashboard at
  // some point (live DB only has Lemon + Mint) -- not re-added here so a
  // reseed doesn't resurrect a deliberately-deleted product.
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
    area: "",
    rating: 5,
    quote: "Mehmed's atta has become one of our best sellers — customers keep asking for it by name.",
    sort_order: 1,
  });
  await upsertTestimonial({
    author_name: "Bilal",
    author_role: "Store Owner",
    area: "",
    rating: 5,
    quote: "Rizqan juice is a hit with customers, and deliveries are always on time.",
    sort_order: 2,
  });
  await upsertTestimonial({
    author_name: "Ayesha",
    author_role: "Bakery Owner",
    area: "",
    rating: 5,
    quote: "Reliable bulk supply for our bakery, every single week — exactly what we needed.",
    sort_order: 3,
  });

  console.log("Seeding site settings...");
  await supabase
    .from("site_settings")
    .update({
      address: "KB Colony, Airport Road, Lahore",
      phone: "+92 318 6327908",
      email: "info@mehmedsuperfood.pk",
      opening_hours: "Mon–Sat: 9:00 AM – 7:00 PM",
      coverage_areas: [],
    })
    .eq("id", 1);

  console.log("Seeding pages...");

  await upsertPage({
    slug: "home",
    title: "Home",
    seo_title: "Mehmed Super Foods — Whole Wheat Flour, Rice & Rizqan Sugarcane Juice",
    seo_description:
      "Mehmed Super Foods supplies whole wheat flour, rice, and Rizqan sugarcane juice to general stores, departmental stores, bakeries, and factories across Punjab.",
    sections: [
      {
        type: "hero",
        content: {
          eyebrow: "Quality Food for a Healthier Tomorrow",
          headline: "Pure Food. **Trusted Quality.** Better Living.",
          subheadline:
            "Discover Mehmed food products created for everyday households, retailers and business partners with a focus on quality, purity and dependable service.",
          primary_cta_label: "Explore Our Products",
          primary_cta_href: "/products",
          secondary_cta_label: "Become a Retail Partner",
          secondary_cta_href: "/become-a-distributor",
        },
      },
      CLIENT_CAROUSEL,
      {
        type: "image_with_text",
        content: {
          heading: "A Household Name in **Quality Staples**",
          body: "Mehmed Super Foods packs and supplies whole wheat flour, rice, and Rizqan sugarcane juice to shops, bakeries, and factories across Punjab — with a focus on quality sourcing and hygienic packing at every step.",
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
              description: "Timely delivery across Punjab for both retail and bulk orders.",
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
        type: "feature_grid",
        content: {
          heading: "How **We Serve** Our Customers",
          subheading: "A simple path from browsing to enjoying quality food.",
          style: "light",
          features: [
            { icon: "1️⃣", title: "Select Your Product", description: "Browse the available flour, rice and beverage products." },
            { icon: "2️⃣", title: "Place Your Order", description: "Contact us, order through the website, or purchase through an authorized retail partner." },
            { icon: "3️⃣", title: "Fast Delivery", description: "Receive your order through the applicable delivery channel or purchase from a nearby retail outlet." },
            { icon: "4️⃣", title: "Enjoy With Confidence", description: "Use products prepared and packed with a focus on quality, hygiene and consistency." },
          ],
        },
      },
      {
        type: "coverage_area",
        content: {
          heading: "Delivering **Across Punjab**",
          body: "We supply general stores, departmental stores, bakeries, and factories across Punjab. Tell us where you are and we'll confirm delivery to your location.",
          cta_label: "Confirm Delivery to Your Area",
          cta_href: "/contact",
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
          image_url: PRODUCT_BANNER_URL,
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
          body: "Whole wheat flour, rice, and Rizqan sugarcane juice — packed fresh for shops, bakeries, and factories across Punjab.",
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
          body: "Mehmed Super Food Private Limited is committed to delivering quality food products that combine purity, nutrition and trust. We aim to serve families, retailers and business partners with premium everyday essentials backed by consistent quality and customer-focused service.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Our **Vision**",
          body: "To become a trusted household name in Pakistan by offering pure, nutritious and high-quality food products that enrich everyday life.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Our **Mission**",
          body: "To provide safe, fresh and premium food products through responsible sourcing, hygienic processing, attractive packaging and dependable service while building lasting relationships with our customers and trade partners.",
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
          heading: "Our **Core Values**",
          style: "light",
          features: [
            { icon: "🌟", title: "Quality", description: "We focus on consistent standards in sourcing, processing and finished products." },
            { icon: "🤝", title: "Trust", description: "We aim to build long-term relationships through reliability and transparency." },
            { icon: "💧", title: "Purity", description: "We strive to offer clean, wholesome food products made with carefully selected ingredients." },
            { icon: "❤️", title: "Customer Care", description: "We listen to our customers and work to provide responsive service and dependable support." },
            { icon: "💡", title: "Innovation", description: "We continue improving our products, packaging, service and distribution methods." },
            { icon: "🛡️", title: "Integrity", description: "We conduct our business responsibly and value honest dealing with customers and partners." },
          ],
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
            { icon: "🚚", title: "Distribution", description: "Delivered across Punjab to retail and bulk customers." },
          ],
        },
      },
      {
        type: "coverage_area",
        content: {
          heading: "Delivering **Across Punjab**",
          body: "We supply general stores, departmental stores, bakeries, and factories across Punjab. Tell us where you are and we'll confirm delivery to your location.",
          cta_label: "Confirm Delivery to Your Area",
          cta_href: "/contact",
        },
      },
      {
        type: "cta_banner",
        content: {
          image_url: PRODUCT_BANNER_URL,
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
          side_heading: "How Can We **Help You**?",
          side_body: "Whether you run a store, bakery or factory canteen, or want your own brand on our flour, our team is happy to help.",
          side_items: ["Product and pricing enquiries", "Bulk supply for bakeries, factories and canteens", "Private-label flour packing", "Retail and distributor partnerships", "Delivery across Punjab"],
          side_cta_label: "Become a Retail Partner",
          side_cta_href: "/become-a-distributor",
        },
      },
      {
        type: "coverage_area",
        content: {
          heading: "Delivering **Across Punjab**",
          body: "We supply general stores, departmental stores, bakeries, and factories across Punjab. Tell us where you are and we'll confirm delivery to your location.",
          cta_label: "Confirm Delivery to Your Area",
          cta_href: "/contact",
        },
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
              question: "Which areas do you deliver to?",
              answer:
                "We supply retail and bulk customers across Punjab. Contact us to confirm delivery to your specific location.",
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
            {
              question: "Do you offer private-label / white-label flour packing?",
              answer:
                "Yes — we offer private-label flour solutions for retailers, distributors, supermarket chains and institutions who want to sell flour under their own brand. Visit our Private Label page or contact us to discuss your requirements.",
            },
            {
              question: "What quality standards do you follow?",
              answer:
                "We focus on careful sourcing, hygienic processing, consistent product standards, and packaging that protects freshness. See our Quality page for details, including certifications as they become available.",
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
    seo_description: "What shopkeepers, bakeries, and factories across Punjab say about Mehmed Super Foods.",
    sections: [
      {
        type: "page_header",
        content: {
          title: "Reviews",
          heading: "What Our **Customers Say**",
          body: "Feedback from shopkeepers, bakeries, and factories we supply across Punjab.",
        },
      },
      {
        type: "testimonial_slider",
        content: {},
      },
      {
        type: "cta_banner",
        content: {
          image_url: PRODUCT_BANNER_URL,
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
      "Become a Mehmed Super Foods stockist or bulk distributor — general stores, departmental stores, bakeries, and factories across Punjab.",
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
            { icon: "🚚", title: "Reliable Delivery", description: "Timely delivery across Punjab for both retail and bulk orders." },
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

  await upsertPage({
    slug: "quality",
    title: "Quality",
    seo_title: "Quality & Assurance — Mehmed Super Foods",
    seo_description:
      "Mehmed Super Foods' approach to sourcing, hygienic processing, quality control and packaging standards.",
    sections: [
      {
        type: "page_header",
        content: {
          title: "Quality",
          heading: "Quality & **Assurance** You Can Trust",
          body: "We focus on careful sourcing, hygienic handling, consistent product standards and packaging that protects freshness and quality.",
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "Our **Quality** Commitment",
          style: "light",
          features: [
            { icon: "🌾", title: "Sourcing Standards", description: "Raw materials are sourced with consistent quality and food-safety in mind." },
            { icon: "⚙️", title: "Hygienic Processing", description: "Milling, packing and bottling are carried out under hygienic, controlled conditions." },
            { icon: "🔍", title: "Quality Control", description: "Products are checked at multiple stages to maintain consistent standards batch to batch." },
            { icon: "📦", title: "Packaging Standards", description: "Packaging is designed to protect freshness and quality from our facility to your shelf." },
          ],
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "Certifications & **Lab Reports**",
          body: "We're working towards formal food-safety and regulatory certifications for our facility and products. Verified certification marks and laboratory reports will be published here as they become available — we only publish credentials that are current and verified.",
        },
      },
      {
        type: "cta_banner",
        content: {
          image_url: PRODUCT_BANNER_URL,
          heading: "Questions About Our **Quality Process**?",
          buttons: [
            { label: "View Products", href: "/products" },
            { label: "Contact Us", href: "/contact" },
          ],
        },
      },
    ],
  });

  await upsertPage({
    slug: "private-label",
    title: "Private Label",
    seo_title: "Private Label Flour Solutions — Mehmed Super Foods",
    seo_description:
      "Private-label flour solutions for retailers, supermarket chains, distributors, institutions and companies.",
    sections: [
      {
        type: "page_header",
        content: {
          title: "Private Label",
          heading: "Private-Label **Flour Solutions**",
          body: "Mehmed Super Food Private Limited offers private-label flour solutions for retailers, supermarket chains, distributors, institutions and companies that want to sell flour under their own brand name.",
        },
      },
      {
        type: "rich_text",
        content: {
          heading: "How It **Works**",
          body: "We work with business customers to develop and pack flour according to mutually agreed product, quality and packaging requirements, subject to technical feasibility, minimum order quantities and applicable regulatory requirements.",
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "What We Can **Offer**",
          style: "light",
          features: [
            { icon: "📋", title: "Product Specification", description: "Flour type and agreed product specification based on your target market and requirements." },
            { icon: "📦", title: "Pack Sizes & Formats", description: "Pack sizes and packaging formats suitable for retail, wholesale or institutional supply." },
            { icon: "🎨", title: "Custom Branding", description: "Your brand name, logo, colors and packaging artwork." },
            { icon: "✅", title: "Compliant Labeling", description: "Product labeling and information aligned with applicable food-labeling and regulatory requirements." },
            { icon: "📝", title: "Agreed Terms", description: "Agreed quality parameters, production quantity and supply schedule." },
            { icon: "🤝", title: "Ongoing Support", description: "Ongoing supply support for retailers, distributors and corporate customers." },
          ],
        },
      },
      {
        type: "feature_grid",
        content: {
          heading: "Our **Process**",
          style: "light",
          features: [
            { icon: "1️⃣", title: "Requirement Discussion", description: "You share your flour specification, target market, pack size, branding and expected volume." },
            { icon: "2️⃣", title: "Product & Commercial Proposal", description: "Specifications, packaging options, minimum order quantity, pricing and supply terms are agreed." },
            { icon: "3️⃣", title: "Sample / Spec Approval", description: "You review and approve the agreed product standard before commercial production." },
            { icon: "4️⃣", title: "Packaging & Label Approval", description: "Artwork and mandatory product information are finalized before printing and packing." },
            { icon: "5️⃣", title: "Production & Supply", description: "Flour is produced, packed and supplied according to the approved specification and agreed schedule." },
          ],
        },
      },
      {
        type: "quote_form",
        content: {
          heading: "Start a **Private-Label** Conversation",
          body: "Tell us about your flour requirements and we'll get back to you to discuss specifications, packaging and pricing.",
          info_heading: "Private Label Is Available For:",
          info_items: ["Retailers & Supermarket Chains", "Distributors", "Institutions", "Companies & Bulk Buyers"],
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

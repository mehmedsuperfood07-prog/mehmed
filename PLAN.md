# Mehmed Super Foods — Website Project Plan

**Type:** Brand/marketing website (no e-commerce, no cart, no checkout)
**Goal:** Build brand awareness, showcase products, and generate B2B/retail leads (general stores, departmental stores, bakeries, food-chain/factory bulk buyers) across Lahore.
**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, Supabase (Postgres + Auth + Storage) for a fully custom admin dashboard, deployed on Vercel.
**Design source:** [templatekit.selaraswp.com/restaurant](https://templatekit.selaraswp.com/restaurant/?storefront=envato-elements) ("RollingBites") — layout, section rhythm, and animation style are carried over 1:1; copy, imagery, and content model are rebuilt for Mehmed.

Decisions locked in with the client before this plan was finalized:
- **Admin dashboard:** fully custom-built (not a third-party headless CMS like Sanity/Payload). See [Architecture](#3-architecture) for how we keep this from becoming a maintenance burden.
- **Language:** English only at launch. Content model should not block adding a language later, but no bilingual UI is built now.
- **Color palette:** confirmed. Derived directly from the client's actual Mehmed Whole Wheat Flour and Rizqan Sugarcane Juice packaging photos — see [Section 5.1](#51-color-palette--confirmed-from-packaging).

---

## 1. Business Context

Mehmed Super Foods produces and distributes:
- **Whole wheat flour (atta)** — chakki-style, packed. Confirmed from real packaging: sold as "Mehmed Chakki Atta," 5kg bags confirmed, headline claim **"Soft Roti for 7 Hours"**
- **Mehmed Rice**
- **Rizqan** — a sugarcane-juice product line (note corrected spelling — the client's original message said "Rizaqan," but the actual bottle branding reads **Rizqan**). Confirmed flavors from packaging: **Lemon** and **Lemon + Mint**. Headline claims: "Fresh • Hygienic • Refreshing," "100% Natural, Nothing Added," "The National Drink of Pakistan"

Distribution model (this is what the site needs to communicate, since there's no cart):
- Retail supply across Lahore to general stores and departmental/grocery stores
- Bulk/wholesale supply to bakeries, food chains, and factories that run staff meal programs

The website's job is to make Mehmed look established and trustworthy to two audiences at once — a shopkeeper deciding on a new supplier, and a bakery/factory procurement contact evaluating a bulk vendor — and to turn either one into an inbound inquiry.

All contact details, addresses, and figures used below are **placeholders** (marked `[PLACEHOLDER]`) until the client supplies real ones. Flour and Rizqan juice product facts are now real (taken from packaging photos); **Mehmed Rice** product details remain placeholder since no rice packaging has been shared yet.

---

## 2. Site Map & Page-by-Page Content Plan

Mapped from the template's actual sections (confirmed by crawling the live demo), reinterpreted for a food-distribution B2B/B2C brand instead of a food truck.

### 2.1 Home (`/`)
| Template section | Mehmed adaptation |
|---|---|
| Hero (full-bleed image, live "next destination" badge) | Hero with rotating product imagery, headline on quality/trust, primary CTA "View Products" + secondary "Request Bulk Quote" |
| About Us teaser + stats counter + award badge | Short brand story teaser + animated counters ("Years in business", "Retail partners served", "Tons supplied monthly") + "Quality Checked" badge |
| Best Seller Menu (3-card grid + slider) | Featured Products: Whole Wheat Flour, Mehmed Rice, Rizqan Sugarcane Juice — image, one-line description, "View Details" |
| Why Choose Us (4 icon features) | Hygienic packaging, quality-checked grain sourcing, reliable bulk delivery, freshly processed sugarcane juice (no artificial preservatives) |
| Find Us (map/schedule widget) | **Reinterpreted as "Where We Deliver"** — Lahore coverage map + list/chips of served areas (a live-truck-tracker doesn't map to a fixed distributor, so we swap the interaction, not just the copy) |
| Features (4 icon grid) | Doorstep bulk delivery, trusted by X+ retailers, timely dispatch, dedicated account support for bulk clients |
| Testimonials (star-rated slider) | Quotes from shopkeepers / bakery owners / factory procurement leads, with area/city tag |
| Book Us (event booking form) | **Reinterpreted as "Become a Stockist / Request a Bulk Quote"** form — business name, contact person, business type, city/area, products interested in, estimated monthly quantity, message |
| Final CTA banner (3 buttons) | "View Products" / "Read Our Story" / "Get a Quote" |
| Footer | Nav columns, contact block, social links |

### 2.2 Products (`/products`)
Showcase only — **no prices, no cart, no checkout.** Grouped by category exactly like the template's Menu page groups burgers/tacos/wings:
- **Whole Wheat Flour** — Mehmed Chakki Atta. Confirmed: 5kg pack, "Soft Roti for 7 Hours" as the lead claim on the card. Other pack sizes (e.g. 10kg/20kg) shown as pack-size chips but marked for client confirmation until more packaging is shared
- **Mehmed Rice** — variant cards (e.g., Sella, Basmati) — still placeholder; no rice packaging supplied yet, flagged in [Section 8](#8-open-items--assumptions)
- **Rizqan Sugarcane Juice** — confirmed flavors: **Lemon** and **Lemon + Mint**, each carrying the "100% Natural, Nothing Added" and "Fresh • Hygienic • Refreshing" badges pulled straight from the bottle label

Each card: image, name, short description, pack-size chips, "Inquire for Bulk Pricing" button → links to the quote form pre-filled with the product name via query param.

### 2.3 About Us (`/about`)
- Our Story (founding narrative — placeholder copy)
- Our Philosophy (quality & hygiene commitment)
- Our Process — sourcing → milling/processing → packing → distribution, as a 4-step visual timeline (replaces the template's plain narrative block with something that actually explains a food-production business)
- Stats/achievements (same counters as home, fuller context)
- Certifications/quality badges — placeholder marks (e.g., FSSAI/Halal/PSQCA-style) explicitly labeled placeholder until the client confirms real certifications
- Coverage area repeat

### 2.4 Contact (`/contact`)
- Contact info block: address, phone, WhatsApp, email, opening hours (all placeholder)
- General inquiry form (name, email, phone, message)
- Embedded map (Lahore)
- Secondary CTA to the bulk-quote form for business buyers

### 2.5 Become a Distributor / Bulk Order (`/become-a-distributor`)
Standalone version of the home page's quote form, for direct-link sharing (business cards, WhatsApp, ads). Same field set as described in 2.1.

### 2.6 Blog (`/blog`, `/blog/[slug]`)
Fully manageable from the dashboard. Content-marketing angle: recipes using Mehmed rice/flour, "how to judge quality atta", sugarcane juice health/seasonal content, wholesale buying tips. Drives organic SEO traffic that the product pages alone won't get.

### 2.7 Supporting pages (from the template's "Pages" dropdown, adapted)
- **Gallery** (`/gallery`) — replaces "Events": packing facility, delivery fleet, product photography
- **Reviews** (`/reviews`) — expanded testimonials wall
- **FAQ** (`/faq`) — accordion, e.g. minimum order quantity, delivery areas, packaging sizes, payment terms
- **Our Team** (`/our-team`) — optional, only if client wants faces attached to the brand

### 2.8 System pages
- Custom 404
- `/sitemap.xml`, `/robots.txt` (generated from DB content — see [SEO](#6-seo-strategy))
- `/admin/*` — the dashboard (not indexed, `noindex` + auth-gated)

---

## 3. Architecture

The client chose a **fully custom admin** over a headless CMS product. To keep that from turning into months of bespoke plumbing, we build it *on top of* Supabase rather than from bare metal:

- **Supabase Postgres** — content database (see schema below)
- **Supabase Auth** — email/password login for admin users, no custom session/password code to write or secure ourselves
- **Supabase Storage** — image uploads (hero images, product photos, blog covers), served via public URLs + `next/image`
- **Supabase-generated TypeScript types** — DB schema stays the single source of truth for types across the app

This is "custom-built" in the sense that matters to the client: the dashboard UI, the content model, and the page/section structure are bespoke and shaped exactly around Mehmed's pages — not a generic CMS UI they have to bend their content into. It just doesn't mean hand-rolling auth or file storage, which would only add risk without adding any capability the client asked for.

### 3.1 The "add a new page easily" problem

This is the hard part of any bespoke system — WordPress makes it trivial because every page is built from the same generic block model. We replicate that narrowly:

- A fixed **library of section types** is built once, matching the sections actually used across the template: `Hero`, `RichText`, `ImageWithText`, `StatsCounter`, `FeatureGrid`, `ProductGrid`, `CoverageArea`, `TestimonialSlider`, `CTABanner`, `FAQAccordion`, `Gallery`, `ContactForm`, `QuoteForm`.
- A **page** in the dashboard = title + slug + SEO fields + an ordered list of section instances, each picked from that library and filled in via a form (text fields, image upload, repeatable items like feature cards).
- The admin can create a new page, add/reorder/remove sections, and publish — without a developer — but cannot invent a brand-new section type from the dashboard (that still requires a dev to add to the library). This is the right scope: infinite drag-and-drop page-building is overkill for a ~10-page brand site and would cost far more to build than it returns.

### 3.2 Proposed folder structure

```
/app
  /(site)                      # public site, shared header/footer layout
    page.tsx                   # home
    about/page.tsx
    products/page.tsx
    contact/page.tsx
    become-a-distributor/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    gallery/page.tsx
    reviews/page.tsx
    faq/page.tsx
    [slug]/page.tsx            # catch-all for dashboard-created pages
  /admin
    login/page.tsx
    (dashboard)/layout.tsx     # auth-guarded via middleware
    (dashboard)/page.tsx       # overview + latest leads
    (dashboard)/pages/...      # page + section-block manager
    (dashboard)/products/...
    (dashboard)/blog/...
    (dashboard)/testimonials/...
    (dashboard)/leads/...      # inbox for form submissions
    (dashboard)/settings/...   # site-wide settings, nav, contact info, palette
  sitemap.xml/route.ts
  robots.txt/route.ts
/components
  /sections                    # one component per library section type
  /admin                       # dashboard-only components, block editors
  /ui                          # shadcn/ui primitives (button, dialog, accordion, etc.)
/lib
  /supabase                    # server + browser clients, generated types
  /validations                 # zod schemas for forms
  /email                       # Resend client + templates
/middleware.ts                 # protects /admin/*
```

### 3.3 Database schema (Supabase Postgres)

| Table | Purpose |
|---|---|
| `pages` | id, slug, title, seo_title, seo_description, og_image_url, canonical_url, no_index, status (draft/published), timestamps |
| `page_sections` | id, page_id (FK), type (enum matching the section library), position, content (`jsonb`) |
| `product_categories` | id, name, slug, sort_order |
| `products` | id, category_id (FK), name, slug, short_description, description, image_url, pack_sizes (text[]), is_featured, sort_order, status |
| `blog_posts` | id, title, slug, excerpt, content (rich text JSON/HTML), cover_image_url, author, seo_title, seo_description, status, published_at |
| `testimonials` | id, author_name, author_role, area, rating, quote, avatar_url, sort_order, status |
| `leads` | id, type (general/quote/distributor), name, business_name, phone, email, city, business_type, products_interested (text[]), message, status (new/contacted/closed), created_at |
| `site_settings` | singleton row — logo_url, phone, whatsapp, email, address, opening_hours, social_links (jsonb), coverage_areas (text[]), header_nav (jsonb), footer_nav (jsonb), brand colors (jsonb) |

Row Level Security: public read on published content; all writes require an authenticated admin session.

### 3.4 Lead-generation flow

Every form on the site (general contact, bulk-quote, distributor) — regardless of which page it's on — writes to `leads` via a server action, then:
1. Shows an in-page success state (no page reload)
2. Sends an email notification to the business inbox via **Resend**
3. Appears immediately in `/admin/leads` with a status the client can update (New → Contacted → Closed)

This gives the client both an inbox they check on their phone (email) and a persistent CRM-lite record (dashboard), without needing a third-party CRM.

---

## 4. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript | SSR/SSG for SEO, file-based routing fits the site map directly |
| Styling | Tailwind CSS | Requested by client; fast to theme once real brand colors arrive |
| Animation | Framer Motion | Reproduces the template's scroll-reveal, staggered, and hover-scale animations |
| Carousel/slider | Embla Carousel | Lightweight, React-first, used for testimonials + featured-product sliders |
| UI primitives | shadcn/ui (Radix + Tailwind) | Accessible dialog/accordion/toast/form primitives without imposing a visual style |
| Forms | react-hook-form + zod | Type-safe validation for all lead-gen forms |
| Database | Supabase Postgres | Already available in this environment; pairs Auth + Storage + DB in one place |
| Auth | Supabase Auth | Admin login only, no public accounts needed (not an e-commerce site) |
| File storage | Supabase Storage | Product/blog/gallery image uploads from the dashboard |
| Rich text editor | Tiptap | Blog post editor and any long-form section content |
| Email | Resend | Lead notification emails |
| Hosting | Vercel | Client's stated choice |

---

### 4.1 Account ownership & environment separation

GitHub, Vercel, and Supabase for this project run under a **separate business Gmail account** — not the personal Gmail connected to this Claude Code environment (which is what the Supabase/Vercel integrations available in this session are authenticated as).

Practical implications:
- **This session's connected Supabase/Vercel tools are not used to create or manage this project's resources.** They're tied to the personal account; using them here would provision the database/deployment under the wrong account entirely.
- Project setup instead goes through each service's **CLI**, authenticated separately: `gh auth login`, `vercel login`, `supabase login`. Each opens a browser-based sign-in that the client completes themselves under the business Gmail — Claude can run the command and walk through the prompts, but the actual sign-in step is the client's to do (this holds regardless of which account is involved, not specific to this being a business account).
- Once logged in via CLI under the business account, ordinary project commands (`vercel deploy`, `supabase db push`, `gh repo create`, `gh pr create`, etc.) run correctly against that account for the rest of the engagement.
- Order of operations: before Phase 1 setup work starts, the client creates (or authorizes creation of) the GitHub repo, Supabase project, and Vercel project under the business Gmail. The resulting API keys/connection strings then go into `.env.local` and Vercel's project environment variables — never committed to the repo.

## 5. Design System

### 5.1 Color palette — **confirmed, from packaging**

Derived directly from the two packaging photos the client provided (Mehmed Whole Wheat Flour bag, Rizqan Sugarcane Juice bottles — Lemon and Lemon+Mint). Both packs independently converge on green as the "natural/agricultural" signal (the wheat-leaf mark on the flour logo, the dominant green on every Rizqan bottle), so green is the site's primary brand color, with the flour bag's maroon/red and gold supplying the warmer accent and premium-badge colors, and its cream background supplying the site's neutral base instead of stark white.

```
--color-primary:       #1B7A3E   /* brand green — Rizqan bottle cap/logo + Mehmed wheat-leaf mark */
--color-primary-dark:  #145C2F   /* hover/pressed state */
--color-maroon:        #7A1F1F   /* deep red from the "Mehmed" / "FLOUR" wordmark — headings, quote accents */
--color-red:           #D42A1E   /* vivid red from the flour bag's top/bottom bands + ribbon — CTA buttons, badges */
--color-gold:          #C9A227   /* ribbon/laurel-badge gold — dividers, premium accents, star ratings */
--color-lime:          #8BC53F   /* Rizqan "JUICE" wordmark + lemon accent — juice-line highlights, chips */
--color-cream:         #F6EEDA   /* flour bag's warm off-white — site background base, replaces stark white */
--color-ink:           #2B2420   /* warm dark brown-charcoal body text */
--color-surface:       #FFFFFF   /* card backgrounds, contrast surfaces */
```

Usage guidance:
- **Primary green** carries the header, primary nav states, section backgrounds that need a "fresh/natural" read, and Rizqan-specific product cards.
- **Maroon + vivid red** are the flour line's colors and double as the site's CTA/action color (buttons like "Request a Quote," "Inquire Now") — red reads as appetite/urgency and is a deliberate choice for conversion elements, not just a flour-page accent.
- **Gold** is used sparingly — badges (e.g. "Soft Roti for 7 Hours," "100% Natural"), star ratings, dividers — never as a large fill.
- **Lime** is scoped to Rizqan-related UI (product cards, juice-flavor chips) so it doesn't compete with the primary green everywhere else.
- **Cream**, not white, is the default page background; white is reserved for cards/surfaces that need to pop off that cream base.

These are wired up as Tailwind theme tokens (not hardcoded utility colors), so if the client's actual **Mehmed Rice** packaging (not yet shared) turns out to use a noticeably different color story, adjusting is a one-file change rather than a codebase-wide find-and-replace.

### 5.2 Typography
- Display/headline font: a warm, chunky serif with sturdy strokes (placeholder: **Fraunces**) — chosen to echo the bold serif lettering of the actual "Mehmed" wordmark on the flour packaging, while still reading as a clean web font rather than a literal logo copy
- Body/UI font: a clean grotesque sans (placeholder: **Inter** or **Plus Jakarta Sans**) — contrasts with the display serif the same way the packaging pairs its bold logotype with simple sans-serif label text ("Fresh • Hygienic • Refreshing," "Net Weight")
- The client's actual logo files (vector/high-res) should replace the text-based placeholder wordmark before launch; see [Section 8](#8-open-items--assumptions)

### 5.3 Animation & interaction patterns (copied from the template)
Reproduced with Framer Motion + Embla:
- **Scroll reveal:** section headings and cards fade + slide up (~20px) on scroll into view, staggered ~80–120ms per item within a group (matches the About/Features/Why-Choose-Us grids)
- **Counters:** stat numbers count up from 0 when the About/stats section enters the viewport
- **Hover states:** product/feature cards scale slightly (1.02–1.03) and lift with a soft shadow on hover
- **Slider/carousel:** testimonials and featured-products use a drag/swipe-enabled carousel with autoplay + pause-on-hover, matching the template's testimonial slider behavior
- **Sticky header:** header condenses/adds background on scroll (present in the template's nav)
- **CTA banner:** full-bleed colored band with 3 buttons at page bottom, same as the template's "One Bite Away" closing section

### 5.4 Imagery
- **Whole Wheat Flour and Rizqan Sugarcane Juice** now have real product packshots (the photos the client supplied) — these are used directly as the actual product images on the Products page and homepage featured-products grid, not placeholders.
- **Mehmed Rice** has no packaging photo yet — its product card uses a clearly-labeled stock placeholder (rice grains) until real packaging is supplied.
- **Hero/lifestyle imagery** (people, stores, delivery, facility) is still stock placeholder — the client only supplied product packshots, not lifestyle/facility photography.
- Every placeholder image gets descriptive `alt` text so swapping in real photos later doesn't require touching markup.
- A `/gallery` and facility/delivery photo shoot is flagged as a pre-launch dependency in [Section 8](#8-open-items--assumptions).

---

## 6. SEO Strategy

Custom equivalent of RankMath/Yoast, since we're not using WordPress:

- Every `page`, `product`, and `blog_post` row carries: SEO title, meta description, OG image, canonical URL, `no_index` toggle, and slug — all editable from the dashboard, rendered via Next.js `generateMetadata`
- `/sitemap.xml` and `/robots.txt` are route handlers generated from published DB content (no manual sitemap maintenance)
- JSON-LD structured data: `Organization`/`LocalBusiness` sitewide, `Product` on product pages, `BlogPosting` on posts, `BreadcrumbList` on all inner pages
- Dashboard shows a simple SEO checklist per page (title length, description length, image present) — a lightweight analog to RankMath's on-page score, not a full clone
- Core Web Vitals: `next/image` everywhere, font subsetting, no unnecessary client components on the public site

---

## 7. Delivery Phases

1. **Foundations** — repo scaffold, Tailwind theme tokens (with placeholder palette), Supabase project + schema + RLS policies, admin auth
2. **Admin shell** — dashboard layout, page/section CRUD, product & category CRUD, image upload pipeline
3. **Public site — static structure** — header/footer, all section components from the library, wired to real DB data (with placeholder content)
4. **Public site — content pages** — Home, Products, About, Contact, Become a Distributor, Gallery, Reviews, FAQ
5. **Blog** — Tiptap editor in dashboard, public listing/detail pages
6. **Lead generation** — forms wired to `leads` table + Resend notifications + dashboard inbox
7. **SEO pass** — metadata wiring, sitemap/robots routes, JSON-LD, per-page SEO fields in dashboard
8. **Content population** — dummy copy replaced with client-approved copy; placeholder images swapped where real ones are supplied
9. **QA** — responsive pass (mobile/tablet/desktop), animation performance, form validation edge cases, Lighthouse pass
10. **Deploy & handover** — Vercel production deploy, custom domain, analytics, short admin-dashboard walkthrough for the client

---

## 8. Open Items / Assumptions

Flagged explicitly rather than silently guessed:

- **Color palette:** ✅ resolved — confirmed from the flour and Rizqan packaging photos (Section 5.1)
- **Flour and Rizqan product facts:** ✅ resolved — pack size, tagline, and flavor names taken from real packaging (Section 2.2)
- **Mehmed Rice packaging/branding:** not yet supplied. Rice product cards use placeholder variants (Sella/Basmati) and inherit the site-wide palette; revisit if the client's real rice packaging suggests a different color story
- **Real logo files:** the packaging shows the "Mehmed" and "Rizqan" wordmarks, but we don't yet have vector/high-res logo files (for favicon, header, print-quality use) — request these directly rather than recreating the logo from the packaging photo
- **Real contact details** (address, phone, WhatsApp, email, hours): all placeholder, must be replaced before launch
- **Other flour pack sizes** (10kg/20kg, etc.) beyond the confirmed 5kg bag: placeholder until confirmed
- **Certifications:** the flour packaging's "Soft Roti for 7 Hours" and Rizqan's "100% Natural, Nothing Added" are marketing claims already on-package and safe to reuse; any *regulatory* certification marks (FSSAI/Halal/PSQCA-equivalent) should still be confirmed before adding separate certification badges
- **Product/facility photography:** the packaging photos cover product shots, but we still need facility/delivery/team photography for Gallery and About pages — stock placeholders used until then
- **Domain name:** ✅ resolved — [mehmedsuperfood.pk](https://mehmedsuperfood.pk/), owned by the client. Attach to the Vercel project during deploy (Phase 10)
- **Resend account:** not yet created — needed before the lead-generation phase (Phase 6), not blocking earlier phases
- **Testimonials:** need real (or at least client-approved) quotes before launch; placeholders are clearly fictional in the meantime

---

## 9. Explicitly Out of Scope

- Online ordering, cart, checkout, or payment of any kind
- Customer accounts / login (only the admin dashboard has auth)
- Inventory management beyond simple show/hide of products
- Multi-language UI (English only; see decision at top)

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

**This section was rewritten after a direct visual/structural audit of the template** (computed styles + section-by-section screenshots), because the first pass at this plan described the template's design in prose without actually matching it in the built components — a real gap that was called out directly and corrected. Everything below reflects what's actually implemented, not intentions.

### 5.1 Color palette — confirmed, from packaging, applied the way the template applies its two colors

The template itself uses almost no color: a white base, exactly **two** brand colors (a dark teal and a light lime), used consistently — dark teal for full-bleed sections and primary buttons, lime for card backgrounds, accent text, and secondary buttons. We map Mehmed's confirmed palette onto that same two-color discipline rather than spreading four+ colors around:

```
--color-primary:       #1B7A3E   /* the "teal" role -- full-bleed sections, header CTA, primary pill buttons */
--color-primary-dark:  #145C2F   /* hover/pressed state */
--color-lime:          #D7F0A2   /* the "lime" role -- card backgrounds, accent headline color, secondary buttons */
--color-lime-text:     #1B3A12   /* body text sitting on the lime card background */
--color-maroon:        #7A1F1F   /* flour-line red, used sparingly (not a section color) */
--color-red:           #D42A1E
--color-gold:          #C9A227
--color-cream:         #F6EEDA   /* form input fill, alternate light surface -- not the page background */
--color-ink:           #171717   /* body text on white */
--color-ink-soft:      #6B6B6B   /* secondary/muted text -- matches the template's gray body copy */
--background:          #FFFFFF   /* the page is white by default, like the template -- NOT cream */
```

The first version of this palette (documented in an earlier revision of this section) used cream as the page background and spread maroon/gold/red across the UI as if they were section colors. That doesn't match the template, which is white-based with disciplined two-color use — corrected here. Maroon/red/gold still exist as tokens (there's real packaging basis for them) but are held in reserve for a future use that needs them, not forced into the current section set.

### 5.2 Typography — matches the template's actual computed styles, not a guess

Measured directly from the live template rather than assumed:
- **Inter** for everything — headings and body both. There is no separate "display font."
- Headings are huge, tight-tracked, and **weight 400** (not bold): see `.h1` / `.h2` utility classes in `app/globals.css` (h1 ~72–96px depending on breakpoint, h2 ~56–64px, both at roughly `-0.03em` letter-spacing).
- **Instrument Serif (italic)** is the accent font for emphasis phrases inside headings — e.g. "Every Bite", "Seriously Delicious" in the template become "**Trust You Can Rely On**", "**Rolling with Quality**" for Mehmed. Content authors mark the accented phrase by wrapping it in `**double asterisks**` in any heading field; `components/sections/Accent.tsx`'s `renderHeading()` splits on that and renders the marked phrase in italic serif. The accent's color must be passed explicitly per call site (`text-primary` on white backgrounds, `text-lime` on dark/photo backgrounds) since there's no single default that works on both — get this wrong and the accent text becomes invisible (this happened once during the rebuild and was caught by visual QA, not the type system).
- The client's actual logo files (vector/high-res) should replace the text wordmark before launch; see [Section 8](#8-open-items--assumptions).

### 5.3 Layout patterns cloned from the template (not just "inspired by")

- **Buttons are fully pill-shaped** (`rounded-full`) everywhere, no exceptions — solid primary, solid lime, or outline variants, all via `components/sections/Button.tsx`.
- **Header** floats as a white rounded pill bar inset from the page edges (not a full-width bar), positioned `absolute` over the hero so it scrolls away with the page rather than staying sticky — matches the template's actual behavior (confirmed by screenshot: the header does not reappear once scrolled past). Critically, the header overlaps the **top of the hero photo itself** — the hero section has no top padding reserving space for the header; the photo runs full-bleed from y=0 and the header floats transparently on top of it. Clearance for the hero's own content (the floating widget cards, headline) comes from padding on that content wrapper, not from pushing the photo down. Getting this backwards (padding the photo down to "make room" for the header) was a real bug caught by the client comparing directly against the template — it left a visible blank gap above the photo instead of the header sitting on it. This coupling means every page's first section needs to be visually compatible with a transparent absolute-positioned header on top of it; currently only `Hero` is built with that in mind, so don't put a non-Hero section first on a page without checking it still reads correctly under the header.
- **Hero** is a full-bleed photo with a dark gradient scrim, two floating white "widget" cards near the top (adapted from the template's live avatar-count/map widgets into static, honestly-sourced badges — "Soft Roti for 7 Hours" and "Delivering To: Lahore & Nearby Areas" — see [Section 8](#8-open-items--assumptions) for why these aren't literal clones of the original widgets), and the headline/CTAs anchored to the bottom of the photo. On mobile this collapses from absolute-positioned corners into a single stacked flex column — the first version of this didn't, and the floating cards and CTA buttons overlapped the headline text illegibly on narrow screens until caught in mobile QA and fixed.
- **Product/menu section**: full-bleed primary-green background with a white rounded card "floating" on top of it, containing the actual product grid — not a plain grid on a plain background.
- **Feature sections** come in the template's two variants, both implemented as one `feature_grid` section type with a `style: "light" | "dark"` field: "light" is centered heading above a 4-card lime grid on white ("Why Choose Us"); "dark" is a heading beside a 2×2 lime icon grid on a full-bleed primary-green background ("Features").
- **Stats** render as a single compact lime pill with multiple big numbers side by side (matching the template's "50+ cities visited / 100K+ happy tummies" widget nested under the About section's CTA), not a full-width band of separate cards.
- **Forms** use a shared borderless, cream-filled input style; the quote/booking form specifically clones the template's two-column "Book Us" layout, including the dark info card with a small circular badge overlapping its top-right corner.
- **Footer** is a full-bleed primary-green band: a simple centered nav-link row, a short paragraph, a huge two-tone brand wordmark, and a lime bottom bar with the copyright line — not a conventional multi-column contact-info footer.

### 5.4 Animation & interaction patterns
Reproduced with Framer Motion + Embla:
- **Scroll reveal:** section headings and cards fade + slide up (~20px) on scroll into view, staggered ~80ms per item within a group (`components/sections/Reveal.tsx`, used by nearly every renderer)
- **Counters:** stat numbers count up from 0 when the stats card enters the viewport
- **Hover states:** buttons and cards get subtle color/lift transitions
- **Slider/carousel:** testimonials use an Embla carousel with autoplay + pause-on-hover + dot navigation

### 5.5 Imagery
- **Whole Wheat Flour and Rizqan Sugarcane Juice** product cards use the real packshots once uploaded via the dashboard (upload pipeline works — see PLAN.md §2 Admin shell); until then, a "Photo coming soon" placeholder shows rather than a broken image.
- **Mehmed Rice** has no packaging photo yet — same placeholder treatment.
- **Hero and CTA-banner photography** uses real, freely-licensed Unsplash stock (wheat field, rice paddy, grocery shelves — specific URLs in each section's renderer) as an honest stand-in for real facility/lifestyle photography, which doesn't exist yet. These are swapped for real photos the same way product images are — via the `image_url` field in each section's content, editable from the Pages dashboard.
- Every image gets descriptive `alt` text.
- A `/gallery` page and a real facility/delivery photo shoot remain a pre-launch dependency; see [Section 8](#8-open-items--assumptions).

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

1. **Foundations** — ✅ done. Repo scaffold, Tailwind theme tokens (real confirmed palette, not placeholder), Supabase project + schema + RLS policies, admin auth.
2. **Admin shell** — ✅ done. Dashboard layout, auth, Leads inbox, Pages/section CRUD (generic schema-driven section editor), Products + Categories CRUD, Testimonials management, a Settings screen (contact info, logo, social links), and an image upload pipeline (Supabase Storage `media` bucket, reused across every image field) are all built. **Not yet built:** a nav editor — `header_nav`/`footer_nav` exist as schema columns but `Header.tsx`/`Footer.tsx` still hardcode their nav.
3. **Public site — static structure** — ✅ done. Header/footer and all 13 section-library components exist, wired to real DB data.
4. **Public site — content pages** — mostly done. Home, Products, About, Contact, FAQ, Reviews, and Become a Distributor all exist as real seeded pages. **Not yet built:** Gallery — deliberately deferred since it exists only to show photos and none exist yet (see the imagery open item below); build it once real photography is available.
5. **Blog** — not started. Still planned as Tiptap in the dashboard + public listing/detail pages.
6. **Lead generation** — done except email. Contact form and the bulk-quote form (used on Home, Products, and Become a Distributor) are fully wired end-to-end and show up in the dashboard inbox; Resend notification code is written and wired into `submitLead` but no-ops until the client has a Resend account and sets `RESEND_API_KEY`. Note: quote-form submissions always record as lead type `"quote"` regardless of hosting page — the schema's separate `"distributor"` type isn't used, a deliberate scope cut (see CLAUDE.md).
7. **SEO pass** — partially done. Per-page SEO fields (title/description/no-index) exist in the schema and the Pages CRUD form, and `generateMetadata` wires them through. **Not yet built:** sitemap.xml/robots.txt routes, JSON-LD structured data.
8. **Content population** — in progress. Home/Products/About/Contact/FAQ/Reviews/Become-a-Distributor carry real seeded copy (grounded in confirmed product facts, no fabricated stats — see section 8's note on this). Still placeholder: all imagery, Mehmed Rice specifics, real contact details, testimonials.
9. **QA** — not started.
10. **Deploy & handover** — mostly done. The site is live and verified at https://mehmed.vercel.app (Deployment Protection disabled by the client; a Vercel project misconfiguration — Framework Preset was "Other" instead of "Next.js" — was found and fixed via `vercel.json`; see CLAUDE.md "Deployment status" for both). Production env vars set, GitHub auto-deploy confirmed working, a real lead submission verified end-to-end against the live database. **Not yet done:** attaching the `mehmedsuperfood.pk` custom domain, and no formal handover walkthrough with the client.

---

## 8. Open Items / Assumptions

Flagged explicitly rather than silently guessed:

- **Color palette:** ✅ resolved — confirmed from the flour and Rizqan packaging photos (Section 5.1)
- **Flour and Rizqan product facts:** ✅ resolved — pack size, tagline, and flavor names taken from real packaging (Section 2.2)
- **Mehmed Rice packaging/branding:** not yet supplied. The seeded product card deliberately avoids naming a specific variety (no invented "Sella"/"Basmati" claims) and has no pack-size chips, since none of that is confirmed — it inherits the site-wide palette; revisit if the client's real rice packaging suggests a different color story
- **No fabricated numeric business claims:** seeded copy (stats, "why choose us" feature descriptions) is intentionally qualitative, not specific invented figures like "10+ years" or "500+ retail partners" — those would be misleading if published to a real domain even as placeholder. The `stats_counter` section component exists and works but isn't used on the seeded pages for this reason; add it once the client supplies real numbers
- **Real logo files:** the packaging shows the "Mehmed" and "Rizqan" wordmarks, but we don't yet have vector/high-res logo files (for favicon, header, print-quality use) — request these directly rather than recreating the logo from the packaging photo
- **Real contact details** (address, phone, WhatsApp, email, hours): all placeholder, must be replaced before launch
- **Other flour pack sizes** (10kg/20kg, etc.) beyond the confirmed 5kg bag: placeholder until confirmed
- **Certifications:** the flour packaging's "Soft Roti for 7 Hours" and Rizqan's "100% Natural, Nothing Added" are marketing claims already on-package and safe to reuse; any *regulatory* certification marks (FSSAI/Halal/PSQCA-equivalent) should still be confirmed before adding separate certification badges
- **Product/facility photography:** the packaging photos cover product shots, but we still need facility/delivery/team photography for Gallery and About pages — stock placeholders used until then
- **Getting the flour/Rizqan packaging photos onto the actual site:** those photos were shared inline in chat, which doesn't give Claude a file to upload — every product's `image_url` is currently null. The dashboard's image upload (Products, Testimonials, any page section) now works end-to-end, so this just needs the client to upload the real files through `/admin/products/[id]` whenever convenient
- **Domain name:** ✅ resolved — [mehmedsuperfood.pk](https://mehmedsuperfood.pk/), owned by the client. Attach to the Vercel project during deploy (Phase 10)
- **Resend account:** not yet created. The integration code is done and wired in (`lib/email/resend.ts`) — it no-ops safely until `RESEND_API_KEY` is set, so this isn't blocking anything, but real lead notifications won't email anyone until the client creates an account. Once created, also verify `mehmedsuperfood.pk` as a sending domain (Resend's shared address only delivers to the account's own email otherwise)
- **Testimonials:** need real (or at least client-approved) quotes before launch; placeholders are clearly fictional in the meantime

---

## 9. Explicitly Out of Scope

- Online ordering, cart, checkout, or payment of any kind
- Customer accounts / login (only the admin dashboard has auth)
- Inventory management beyond simple show/hide of products
- Multi-language UI (English only; see decision at top)

# CLAUDE.md — Mehmed Super Foods Website

Guidance for Claude Code sessions working in this repo. Read [PLAN.md](PLAN.md) first — it's the source of truth for scope, site map, schema, and phasing. This file is about *how* to work in this codebase, not *what* to build.

## Project summary

Brand/marketing website for Mehmed Super Foods (whole wheat flour, Mehmed Rice, Rizqan sugarcane juice — distributed across Lahore to general stores, departmental stores, and bulk buyers like bakeries/factories). **Not an e-commerce site** — no cart, no checkout, no prices as transactions. The site exists to build brand credibility and generate inbound leads via forms.

Design is adapted 1:1 (layout, section rhythm, animation style) from the RollingBites template at `templatekit.selaraswp.com/restaurant` — see PLAN.md §2 for the section-by-section mapping. Don't re-derive that mapping from scratch; it's already decided.

## Accounts — read this before touching GitHub/Vercel/Supabase

This project's GitHub repo, Vercel project, and Supabase project live under a **separate business Gmail account** — not the personal Gmail that this Claude Code environment's Supabase/Vercel MCP integrations are connected to. Full rationale in PLAN.md §4.1.

**Do not use this session's connected Supabase/Vercel tools to provision or manage this project's actual cloud resources.** They authenticate as the personal account and would create/read the wrong project entirely. Use the CLIs instead (`gh`, `vercel`, `supabase`), authenticated separately by the user under the business account via `gh auth login` / `vercel login` / `supabase login` — those are login steps for the user to complete in their own browser, not something to do on their behalf. Once that login has happened, ordinary CLI commands in this repo (deploys, migrations, repo operations) are safe to run normally.

If you're ever unsure which account a tool call would hit, ask rather than assume — the cost of provisioning a database or deployment under the wrong Google account is real cleanup work.

**Gotcha discovered the hard way:** `vercel link` (and `vercel env pull`) overwrite `.env.local` with whatever env vars are currently set in the Vercel project — if the project has none set yet, this silently wipes out real local secrets. Before running either command, make sure Vercel's project env vars are already correct, or be ready to restore `.env.local` from a known-good copy immediately after. This is also why the Vercel project's env vars must be set (`vercel env add <NAME> production` — value piped in via `printf "%s" "value" | vercel env add ...` to avoid a trailing newline) before trusting any deployment that already happened.

**Also discovered:** Vercel's GitHub integration auto-deploys to production on every push to `main` as soon as a project is linked/imported — even before anyone runs `vercel deploy`. If a project already has deployments you didn't expect, check `vercel ls` before assuming nothing is live.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres/Auth/Storage) + Framer Motion + Embla Carousel + react-hook-form/zod. Deployed on Vercel. Full rationale in PLAN.md §4.

Two items from the original plan are deliberately deferred, not forgotten: **shadcn/ui** was skipped so far because plain Tailwind markup covered every form/dialog/accordion built to date without the extra dependency — reconsider it if a real need shows up (e.g. a genuinely complex dialog). **Tiptap** is still the right call for the Blog editor (Phase 5, not built yet); page-section rich text uses a plain textarea split on blank lines instead, which is enough for section copy but not a real editor.

**Resend is wired up** (`lib/email/resend.ts`, called from `submitLead`) but no-ops until `RESEND_API_KEY` is set — leads always save regardless of whether the email sends, and a Resend failure is swallowed (never surfaces to the visitor or blocks the lead). Once the client has a Resend account: set the key, and note the `from` address is still Resend's shared `onboarding@resend.dev`, which only delivers to the Resend account's own verified email until `mehmedsuperfood.pk` is verified as a sending domain — swap the `from` address at that point.

Image uploads go through Supabase **Storage**, not a third-party service: a public `media` bucket (see `supabase/migrations/20260906180000_storage_media_bucket.sql`) with RLS-equivalent storage policies (public read, authenticated write) — same admin-only-write model as everything else.

## Where things live

- `/app/(site)/*` — public pages. `page.tsx` (home, fetches slug `"home"`) and `[slug]/page.tsx` (every other page) both go through `lib/pages.ts`'s `getPageBySlug`/`pageMetadata` and render via `components/sections/PageSections.tsx`. `layout.tsx` here wraps with `components/site/Header.tsx` + `Footer.tsx` — the admin routes deliberately don't get this layout.
- `/app/admin/*` — the custom dashboard, auth-gated via `proxy.ts` (Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` — the exported function is `proxy`, not `middleware`; don't recreate a `middleware.ts` file out of habit)
- `/app/actions/leads.ts` — the one shared `submitLead` server action every lead form calls (general contact + bulk quote). Note: the `quote_form` section always submits `type: "quote"` regardless of which page hosts it, even on `/become-a-distributor` — the DB's `distributor` lead type exists but isn't wired up separately; this was a deliberate scope cut (identical fields, marginal value) rather than an oversight. Revisit only if the client actually wants to filter distributor vs. quote leads separately in `/admin/leads`.
- `/components/sections/*` — the closed section library (PLAN.md §3.1): `types.ts` (content shape + `FieldSchema` per type), `schemas.ts` (admin field schema + default content per type), `registry.tsx` (type → public renderer, used by `PageSections.tsx`), then one renderer file per type (`Hero.tsx`, `RichText.tsx`, `ProductGrid.tsx`, `TestimonialSlider.tsx` + its client-side `TestimonialCarousel.tsx`, `ContactForm.tsx`, `QuoteForm.tsx` + `QuoteFormFields.tsx`, etc.). `Reveal.tsx` is the shared scroll-reveal wrapper nearly every renderer uses.
- `/components/admin/SectionEditorFields.tsx` — the one generic, recursive form that edits ANY section's JSON content by reading its `FieldSchema[]` from `schemas.ts`. This is why there's no per-type admin editor component — don't add one; extend the field schema instead. Its `image` field type renders `ImageUploadField.tsx` (upload-to-Storage + manual URL entry + thumbnail preview) — reuse that component directly wherever else a form needs an image, don't rebuild it (Products and Testimonials forms already do this).
- `/app/actions/media.ts` — `uploadImage(formData)`, the one upload path every image field goes through (Storage `media` bucket, via the session-aware server client so it's gated by the same "authenticated" storage policies as everything else).
- `/lib/email/resend.ts` — `sendLeadNotification`, called from `submitLead`. `server-only`-guarded and uses the admin client internally (to read `site_settings.email` as the notification recipient), so don't import it from a standalone script either — same caveat as `lib/supabase/admin.ts`.
- `/components/site/*` — `Header.tsx` (nav is hardcoded to match the pages actually seeded — see its own comment) and `Footer.tsx` (reads `site_settings`).
- `/lib/supabase/*` — `client.ts`/`server.ts` (session-aware, RLS-respecting) and `admin.ts` (service-role, bypasses RLS, `server-only`-guarded — **do not import `admin.ts` from a standalone Node script**; `server-only` throws unconditionally outside Next's build, which only aliases it to a no-op for server bundles. `scripts/seed.ts` constructs its own `createClient` from `@supabase/supabase-js` instead — copy that pattern for future one-off scripts). `types.ts` is real CLI-generated output.
- `/lib/pages.ts` — `getPageBySlug` + `pageMetadata`, shared by every public page route.
- `/lib/validations/leads.ts` — zod schemas (`generalLeadSchema`, `quoteLeadSchema`) shared between the client forms and `submitLead`.
- `/scripts/seed.ts` — idempotent content seed (run via `npm run seed`). Deliberately does NOT invent specific numeric business claims (years in business, partner counts) — see its own header comment and PLAN.md §8. Re-run it any time to reset seeded pages/products/testimonials/site_settings back to this baseline; it replaces a page's sections wholesale rather than diffing, so don't run it against a page an admin has hand-edited unless you mean to overwrite those edits.

## Working conventions

- **Section library is closed by design.** Adding a new page from the dashboard means composing existing section types, not writing new markup per page. Only add a new section type to `/components/sections` when a real page genuinely needs a layout none of the existing types cover — check PLAN.md §3.1's list first.
- **Colors are theme tokens, not literals.** The palette in PLAN.md §5.1 is confirmed (derived from real Mehmed flour and Rizqan juice packaging), but Mehmed Rice packaging hasn't been supplied yet — every color must still go through Tailwind theme tokens (`bg-primary`, `text-maroon`, `text-ink`, etc.) defined in one place, never a hardcoded hex in a component, so if rice packaging later suggests a tweak it's a config change, not a codebase-wide find-and-replace.
- **All content is DB-driven, not hardcoded.** Copy, images, nav items, contact info, and section content live in Supabase tables (PLAN.md §3.3), edited via the dashboard. Placeholder content still goes through the DB/seed data, not inline JSX strings — that's the difference between "temporary copy" and "the dashboard actually works."
- **Every lead form behaves the same way**: react-hook-form + zod validation → the shared `submitLead` server action (`app/actions/leads.ts`) → insert into `leads` via the service-role client → inline success state (no redirect). Resend notification is a `TODO` in that same action, not yet wired — don't build a one-off flow per form; extend the shared pattern and its zod schema in `lib/validations/leads.ts`.
- **SEO fields are mandatory on every content model** that renders a public page (`pages`, `products`, `blog_posts`): seo_title, seo_description, og_image, canonical, no_index. Wire through `generateMetadata`, never skip it "for now."
- **Images:** always through `next/image`, always with real `alt` text. Placeholder images must be visually plausible stock (wheat/rice/sugarcane categories) — never invented "product photos" implying they're real Mehmed products.
- **No comments explaining what code does.** Only comment on non-obvious *why* (e.g., a Supabase RLS quirk, a Vercel/serverless constraint). This matches the general Claude Code house style, not something specific to this repo.
- **Don't build ahead of the current phase.** PLAN.md §7 defines the phase order (foundations → admin shell → public structure → content pages → blog → lead-gen → SEO → content population → QA → deploy). If you're mid-phase and notice work that belongs to a later phase, note it rather than doing it early — e.g., don't wire real analytics before the SEO phase.

## Environment variables (expected once scaffolded)

Values come from the Supabase/Vercel projects created under the business Gmail account (see "Accounts" above) — never from any project connected to this session's personal-account integrations.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-only, never exposed to client
RESEND_API_KEY=
ADMIN_ALLOWED_EMAILS=            # comma-separated allow-list for dashboard login
```

## Known open items (don't silently resolve these — flag back to the user)

See PLAN.md §8 in full. Color palette, the flour/Rizqan product facts, and the domain (mehmedsuperfood.pk) are now resolved. Still outstanding: Resend account, Mehmed Rice packaging/branding, vector logo files, real contact details, unconfirmed flour pack sizes beyond 5kg, regulatory certification marks, facility/lifestyle photography, real testimonial quotes. Until these arrive, placeholders must stay obviously placeholder (not fabricated as if real) and easy to find/replace.

## Accounts status

GitHub repo (`mehmedsuperfood07-prog/mehmed`), Vercel project (`mehmed`, under the `mehmed2` team scope), and Supabase project have all been created under the business Gmail. This machine's `gh`/`vercel` CLIs are logged in and the local repo is linked to the Vercel project (`.vercel/project.json`, git-ignored).

## Deployment status

- Vercel's GitHub integration auto-deploys `main` to production on every push — has been doing so since the project was linked, so check `vercel ls` before assuming a deployment doesn't exist yet.
- Production and Preview env vars are set in the Vercel project: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ALLOWED_EMAILS`. `RESEND_API_KEY` is intentionally not set yet, matching `.env.local`.
- **Known blocker:** Vercel's Deployment Protection ("Vercel Authentication") is currently ON for this project, which gates the production URL behind a Vercel login (`vercel.com/sso-api` redirect) — meaning the live site isn't actually publicly visible yet. There's no CLI command for this; it's a dashboard-only setting (Project → Settings → Deployment Protection) and a call for the client to make, not something to silently change. Confirm with the client before/instead of touching it.
- Production aliases: `https://mehmed.vercel.app` and `https://mehmed-mehmed2.vercel.app` (both currently gated by the issue above). Custom domain `mehmedsuperfood.pk` is not yet attached to the Vercel project.

## Commands

```
npm run dev      # local dev server (Turbopack), http://localhost:3000
npm run build    # production build
npm run start    # run a production build locally
npm run lint     # eslint
npm run seed     # idempotent content seed -- see scripts/seed.ts
```

```
npx supabase migration list                              # compare local vs. remote migrations
npx supabase db push                                      # apply new migrations to the linked project
npx supabase gen types typescript --linked > lib/supabase/types.ts   # regenerate types after any schema change
```

## Current state

- Next.js 16 (App Router) + TypeScript + Tailwind v4 scaffolded, brand palette wired into `app/globals.css` as theme tokens, fonts set to Fraunces (display) + Inter (body)
- `.env.local` holds real Supabase project credentials plus `ADMIN_ALLOWED_EMAILS=mehmedsuperfood07@gmail.com`; `RESEND_API_KEY` still blank (email notifications no-op until it's set, but everything else works without it)
- Database schema applied to the live Supabase project (`supabase/migrations/20260906120000_init_schema.sql`, all 8 tables, RLS policies). CLI is logged in and linked. Future schema changes: new migration file → `npx supabase db push` → regenerate types — don't hand-edit the live schema from the dashboard
- `proxy.ts` gates `/admin/*` on an authenticated session matching `ADMIN_ALLOWED_EMAILS`; the only admin account is `mehmedsuperfood07@gmail.com`, created manually in Supabase Auth (no public sign-up anywhere — PLAN.md §3.1)
- **Admin dashboard**, verified as far as possible without the admin password (build, lint, real-browser auth-redirect checks on every route, and direct DB queries to confirm joins/data shapes) — actual sign-in and clicking through the forms still needs the client to test:
  - `/admin/login`, `/admin` (overview with live counts), `/admin/leads` (real inbox, status dropdown via server action)
  - `/admin/pages`, `/admin/pages/new`, `/admin/pages/[id]` — full Pages CRUD: metadata form (title/slug/SEO/status/no-index), and a section manager (add/reorder/remove/edit) built on the generic `SectionEditorFields` form
  - `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/products/categories` — full Products + Categories CRUD, sharing one `ProductForm` component for both create and edit
  - `/admin/testimonials` — add/edit/delete testimonials (expand-to-edit list, same interaction pattern as the Pages section manager)
  - Image fields everywhere (`SectionEditorFields`, `ProductForm`, `TestimonialForm`, `SettingsForm`) use the same `ImageUploadField` → `uploadImage` server action → Supabase Storage `media` bucket
  - `/admin/settings` — edits the `site_settings` singleton row (phone, WhatsApp, email, address, opening hours, logo, Facebook/Instagram URLs). `header_nav`/`footer_nav` columns exist in the schema but aren't wired to this form or to `Header.tsx`/`Footer.tsx` (both still hardcode their nav) — don't assume editing settings changes navigation.
  - Sidebar nav (`app/admin/(dashboard)/layout.tsx`) lists Overview/Pages/Products/Testimonials/Leads/Settings — extend `NAV_ITEMS` as the Blog screen gets built; don't add dead links ahead of the page existing
- **All 13 section-library types have real renderers** (`components/sections/`): Hero, RichText, ImageWithText, StatsCounter (count-up on scroll), FeatureGrid, ProductGrid (live DB query), CoverageArea, TestimonialSlider (live DB query + Embla carousel), CTABanner, FAQAccordion, Gallery, ContactForm, QuoteForm — the last two fully wired to `submitLead`, not just visual.
- **Public site is real and seeded**, not the create-next-app starter: `/`, `/products`, `/about`, `/contact`, `/faq`, `/reviews`, `/become-a-distributor` all exist as `pages` rows built from these sections, seeded via `npm run seed` (idempotent, safe to re-run — replaces a page's sections wholesale, so don't re-run it against a page an admin has hand-edited unless overwriting is intended). Verified in a real browser: every page renders correct content/SEO titles and correct interactive behavior (FAQ accordion, testimonial carousel), a live contact-form submission was confirmed to land in the `leads` table (then deleted as a test row), and every `/admin/*` route correctly redirects an unauthenticated visitor to `/admin/login`.
- **Gallery page (PLAN.md §2.7) deliberately not built yet** — it exists only to show photos, and there are none yet (see the known image gap below), so an empty Gallery page isn't worth shipping. Build it once real facility/product photography exists.
- **Known gap**: no real images anywhere, even though upload now works. The client shared product-packaging *photos* in chat, which gives Claude something to look at but not a file to upload — every `image_url` is still null, and renderers show a "photo coming soon" placeholder rather than a broken image. Fixing this now just needs the client to actually use the working upload button in `/admin/products/[id]` (or send the image files directly some other way).
- **Not built yet**: Blog (Tiptap editor + public listing/detail), Gallery page (see above), a nav editor (header_nav/footer_nav are schema-only), sitemap.xml/robots.txt/JSON-LD (PLAN.md §6).
- Screenshot caveat for future sessions: this session's Browser-pane preview showed a cosmetic sticky-header artifact when scrolling programmatically and screenshotting (header appears to "float" mid-frame). Direct DOM inspection (`getBoundingClientRect`) confirmed the actual page is correct (`position: sticky` computing `top: 0` as expected) — treat it as a preview-tool rendering quirk, not a site bug, unless a real browser confirms otherwise.

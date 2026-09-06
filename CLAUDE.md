# CLAUDE.md — Mehmed Super Foods Website

Guidance for Claude Code sessions working in this repo. Read [PLAN.md](PLAN.md) first — it's the source of truth for scope, site map, schema, and phasing. This file is about *how* to work in this codebase, not *what* to build.

## Project summary

Brand/marketing website for Mehmed Super Foods (whole wheat flour, Mehmed Rice, Rizqan sugarcane juice — distributed across Lahore to general stores, departmental stores, and bulk buyers like bakeries/factories). **Not an e-commerce site** — no cart, no checkout, no prices as transactions. The site exists to build brand credibility and generate inbound leads via forms.

Design is adapted 1:1 (layout, section rhythm, animation style) from the RollingBites template at `templatekit.selaraswp.com/restaurant` — see PLAN.md §2 for the section-by-section mapping. Don't re-derive that mapping from scratch; it's already decided.

## Accounts — read this before touching GitHub/Vercel/Supabase

This project's GitHub repo, Vercel project, and Supabase project live under a **separate business Gmail account** — not the personal Gmail that this Claude Code environment's Supabase/Vercel MCP integrations are connected to. Full rationale in PLAN.md §4.1.

**Do not use this session's connected Supabase/Vercel tools to provision or manage this project's actual cloud resources.** They authenticate as the personal account and would create/read the wrong project entirely. Use the CLIs instead (`gh`, `vercel`, `supabase`), authenticated separately by the user under the business account via `gh auth login` / `vercel login` / `supabase login` — those are login steps for the user to complete in their own browser, not something to do on their behalf. Once that login has happened, ordinary CLI commands in this repo (deploys, migrations, repo operations) are safe to run normally.

If you're ever unsure which account a tool call would hit, ask rather than assume — the cost of provisioning a database or deployment under the wrong Google account is real cleanup work.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres/Auth/Storage) + Framer Motion + Embla Carousel + react-hook-form/zod. Deployed on Vercel. Full rationale in PLAN.md §4.

Two items from the original plan are deliberately deferred, not forgotten: **shadcn/ui** was skipped so far because plain Tailwind markup covered every form/dialog/accordion built to date without the extra dependency — reconsider it if a real need shows up (e.g. a genuinely complex dialog). **Tiptap** is still the right call for the Blog editor (Phase 5, not built yet); page-section rich text uses a plain textarea split on blank lines instead, which is enough for section copy but not a real editor. **Resend** is not wired in yet (no account/API key) — the `submitLead` action has a `TODO` where that call goes; leads still work end-to-end without it (see below).

## Where things live

- `/app/(site)/*` — public pages. `page.tsx` (home, fetches slug `"home"`) and `[slug]/page.tsx` (every other page) both go through `lib/pages.ts`'s `getPageBySlug`/`pageMetadata` and render via `components/sections/PageSections.tsx`. `layout.tsx` here wraps with `components/site/Header.tsx` + `Footer.tsx` — the admin routes deliberately don't get this layout.
- `/app/admin/*` — the custom dashboard, auth-gated via `proxy.ts` (Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` — the exported function is `proxy`, not `middleware`; don't recreate a `middleware.ts` file out of habit)
- `/app/actions/leads.ts` — the one shared `submitLead` server action every lead form calls (general contact + bulk quote so far; a future distributor page reuses it too)
- `/components/sections/*` — the closed section library (PLAN.md §3.1): `types.ts` (content shape + `FieldSchema` per type), `schemas.ts` (admin field schema + default content per type), `registry.tsx` (type → public renderer, used by `PageSections.tsx`), then one renderer file per type (`Hero.tsx`, `RichText.tsx`, `ProductGrid.tsx`, `TestimonialSlider.tsx` + its client-side `TestimonialCarousel.tsx`, `ContactForm.tsx`, `QuoteForm.tsx` + `QuoteFormFields.tsx`, etc.). `Reveal.tsx` is the shared scroll-reveal wrapper nearly every renderer uses.
- `/components/admin/SectionEditorFields.tsx` — the one generic, recursive form that edits ANY section's JSON content by reading its `FieldSchema[]` from `schemas.ts`. This is why there's no per-type admin editor component — don't add one; extend the field schema instead.
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

GitHub repo (`mehmedsuperfoods07-prog/mehmed`), Vercel project, and Supabase project have been created by the client under the business Gmail. This machine's `gh`/`vercel` CLIs still need their own login (see "Accounts" above) before any CLI-driven deploy or repo operation will authenticate correctly — check with `gh auth status` / `vercel whoami` before assuming either is logged in.

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
- `.env.local` holds real Supabase project credentials plus `ADMIN_ALLOWED_EMAILS=mehmedsuperfood07@gmail.com`; `RESEND_API_KEY` still blank
- Database schema applied to the live Supabase project (`supabase/migrations/20260906120000_init_schema.sql`, all 8 tables, RLS policies). CLI is logged in and linked. Future schema changes: new migration file → `npx supabase db push` → regenerate types — don't hand-edit the live schema from the dashboard
- `proxy.ts` gates `/admin/*` on an authenticated session matching `ADMIN_ALLOWED_EMAILS`; the only admin account is `mehmedsuperfood07@gmail.com`, created manually in Supabase Auth (no public sign-up anywhere — PLAN.md §3.1)
- **Admin dashboard**, verified end-to-end (build, lint, and a real browser session — though actual sign-in couldn't be tested from here since I don't hold the admin password):
  - `/admin/login`, `/admin` (overview with live counts), `/admin/leads` (real inbox, status dropdown via server action)
  - `/admin/pages`, `/admin/pages/new`, `/admin/pages/[id]` — full Pages CRUD: metadata form (title/slug/SEO/status/no-index), and a section manager (add/reorder/remove/edit) built on the generic `SectionEditorFields` form
  - Sidebar nav (`app/admin/(dashboard)/layout.tsx`) lists Overview/Pages/Leads — extend `NAV_ITEMS` as Products/Blog/Testimonials/Settings screens get built; don't add dead links ahead of the page existing
- **All 13 section-library types have real renderers** (`components/sections/`): Hero, RichText, ImageWithText, StatsCounter (count-up on scroll), FeatureGrid, ProductGrid (live DB query), CoverageArea, TestimonialSlider (live DB query + Embla carousel), CTABanner, FAQAccordion, Gallery, ContactForm, QuoteForm — the last two fully wired to `submitLead`, not just visual.
- **Public site is real and seeded**, not the create-next-app starter: `/`, `/products`, `/about`, `/contact` all exist as `pages` rows built from these sections, seeded via `npm run seed` (idempotent, safe to re-run). Verified in a real browser: all four pages render correct content/SEO titles, the contact form was submitted live and confirmed to land in the `leads` table (then deleted as a test row), and `/admin/pages` correctly redirects an unauthenticated visitor to `/admin/login`.
- **Known gap**: no real images anywhere. The client shared product-packaging *photos* (used to derive the confirmed palette) but not image *files* I can upload — every `image_url` is currently null, and renderers show a "photo coming soon" placeholder rather than a broken image. Getting real photos in requires either the client sending actual files (not pasted inline in chat) or building the Supabase Storage upload flow in the dashboard (not started).
- **Not built yet**: Products/Blog/Testimonials/Settings CRUD screens (products/testimonials are seeded directly via the script for now, not editable in the dashboard), Resend email notifications, image upload, and the remaining pages from PLAN.md §2 (Gallery, Reviews, FAQ, Become-a-Distributor, blog).
- Screenshot caveat for future sessions: this session's Browser-pane preview showed a cosmetic sticky-header artifact when scrolling programmatically and screenshotting (header appears to "float" mid-frame). Direct DOM inspection (`getBoundingClientRect`) confirmed the actual page is correct (`position: sticky` computing `top: 0` as expected) — treat it as a preview-tool rendering quirk, not a site bug, unless a real browser confirms otherwise.

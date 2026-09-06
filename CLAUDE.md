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

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres/Auth/Storage) + Framer Motion + Embla Carousel + shadcn/ui + react-hook-form/zod + Tiptap + Resend. Deployed on Vercel. Full rationale in PLAN.md §4.

## Where things live

- `/app/(site)/*` — public pages, shared header/footer via the `(site)` layout
- `/app/admin/*` — the custom dashboard, auth-gated via `proxy.ts` (Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` — the exported function is `proxy`, not `middleware`; don't recreate a `middleware.ts` file out of habit)
- `/components/sections/*` — one component per section-library type (Hero, RichText, ProductGrid, TestimonialSlider, etc. — see PLAN.md §3.1). Public pages are assembled by rendering a page's `page_sections` rows through this library, not by hand-writing bespoke page markup.
- `/components/admin/*` — dashboard-only UI (block editors, forms)
- `/components/ui/*` — shadcn/ui primitives
- `/lib/supabase/*` — Supabase clients + generated types (regenerate types after any schema change — the Supabase MCP tools in this environment can do this directly)
- `/lib/validations/*` — zod schemas shared between client forms and server actions
- `/lib/email/*` — Resend client/templates

## Working conventions

- **Section library is closed by design.** Adding a new page from the dashboard means composing existing section types, not writing new markup per page. Only add a new section type to `/components/sections` when a real page genuinely needs a layout none of the existing types cover — check PLAN.md §3.1's list first.
- **Colors are theme tokens, not literals.** The palette in PLAN.md §5.1 is confirmed (derived from real Mehmed flour and Rizqan juice packaging), but Mehmed Rice packaging hasn't been supplied yet — every color must still go through Tailwind theme tokens (`bg-primary`, `text-maroon`, `text-ink`, etc.) defined in one place, never a hardcoded hex in a component, so if rice packaging later suggests a tweak it's a config change, not a codebase-wide find-and-replace.
- **All content is DB-driven, not hardcoded.** Copy, images, nav items, contact info, and section content live in Supabase tables (PLAN.md §3.3), edited via the dashboard. Placeholder content still goes through the DB/seed data, not inline JSX strings — that's the difference between "temporary copy" and "the dashboard actually works."
- **Every lead form behaves the same way**: react-hook-form + zod validation → server action → insert into `leads` → Resend notification → inline success state (no redirect). Don't build a one-off flow per form; extend the shared pattern.
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
```

```
npx supabase migration list                              # compare local vs. remote migrations
npx supabase db push                                      # apply new migrations to the linked project
npx supabase gen types typescript --linked > lib/supabase/types.ts   # regenerate types after any schema change
```

## Current state

- Next.js 16 (App Router) + TypeScript + Tailwind v4 scaffolded, brand palette wired into `app/globals.css` as theme tokens (`bg-primary`, `text-maroon`, `bg-cream`, etc.), fonts set to Fraunces (display) + Inter (body)
- `.env.local` holds real Supabase project credentials (URL, anon key, service role key) — already git-ignored and verified not tracked; `RESEND_API_KEY` and `ADMIN_ALLOWED_EMAILS` still blank pending the Resend account
- Database schema written as `supabase/migrations/20260906120000_init_schema.sql` (all 8 tables from PLAN.md §3.3, RLS policies, singleton `site_settings` row seeded) and **applied to the live Supabase project** — CLI is logged in and linked (`npx supabase login` / `npx supabase link --project-ref afyliettjdyjcavbaqgg`; the ref lives in `supabase/.temp/`, which is git-ignored and regenerates from a re-link if ever missing). Future schema changes: add a new migration file, run `npx supabase db push`, then regenerate types (next bullet) — don't hand-edit the live schema from the dashboard and let it drift from the migration files
- `lib/supabase/{client,server,admin}.ts` set up (browser client, session-aware server client, service-role admin client). `lib/supabase/types.ts` is now real CLI-generated output (`npx supabase gen types typescript --linked > lib/supabase/types.ts`) — regenerate it the same way after every migration, don't hand-edit it. Note the CHECK-constraint columns (`status`, `type`, etc.) come through as plain `string`, not narrowed unions — Supabase's generator only reflects real Postgres `enum` types, not `check` constraints
- `proxy.ts` (not `middleware.ts` — see above) gates `/admin/*` on an authenticated session matching `ADMIN_ALLOWED_EMAILS`; no admin UI or login page exists yet, so this currently just redirects every `/admin/*` request to a `/admin/login` page that doesn't exist yet
- No admin dashboard, section-library components, or real public pages built yet — the homepage is still the default create-next-app starter page. Next unit of work: apply the migration, then build the admin login + dashboard shell (PLAN.md §7 Phase 2)

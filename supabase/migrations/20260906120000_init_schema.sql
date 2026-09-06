-- Mehmed Super Foods — initial schema (PLAN.md section 3.3)
--
-- Admin auth model: there is no public sign-up flow anywhere in the app.
-- The only rows that can ever exist in auth.users are admins created
-- manually (Supabase dashboard or CLI), so "authenticated" == "admin"
-- for every policy below. ADMIN_ALLOWED_EMAILS (app env var) is an
-- additional app-level allow-list check, not a substitute for this.

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- pages ----------------------------------------------------------------

create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  seo_title text,
  seo_description text,
  og_image_url text,
  canonical_url text,
  no_index boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pages_set_updated_at
  before update on pages
  for each row execute function set_updated_at();

alter table pages enable row level security;

create policy "public reads published pages"
  on pages for select to anon using (status = 'published');

create policy "authenticated reads all pages"
  on pages for select to authenticated using (true);

create policy "authenticated manages pages"
  on pages for all to authenticated using (true) with check (true);

-- page_sections ----------------------------------------------------------

create table page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  type text not null check (type in (
    'hero', 'rich_text', 'image_with_text', 'stats_counter', 'feature_grid',
    'product_grid', 'coverage_area', 'testimonial_slider', 'cta_banner',
    'faq_accordion', 'gallery', 'contact_form', 'quote_form'
  )),
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index page_sections_page_id_position_idx on page_sections (page_id, position);

create trigger page_sections_set_updated_at
  before update on page_sections
  for each row execute function set_updated_at();

alter table page_sections enable row level security;

create policy "public reads sections of published pages"
  on page_sections for select to anon
  using (exists (
    select 1 from pages p where p.id = page_sections.page_id and p.status = 'published'
  ));

create policy "authenticated reads all sections"
  on page_sections for select to authenticated using (true);

create policy "authenticated manages sections"
  on page_sections for all to authenticated using (true) with check (true);

-- product_categories -------------------------------------------------------

create table product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order integer not null default 0
);

alter table product_categories enable row level security;

create policy "public reads categories"
  on product_categories for select to anon, authenticated using (true);

create policy "authenticated manages categories"
  on product_categories for all to authenticated using (true) with check (true);

-- products ---------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references product_categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  image_url text,
  pack_sizes text[] not null default '{}',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products (category_id);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

create policy "public reads published products"
  on products for select to anon using (status = 'published');

create policy "authenticated reads all products"
  on products for select to authenticated using (true);

create policy "authenticated manages products"
  on products for all to authenticated using (true) with check (true);

-- blog_posts ---------------------------------------------------------------

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb,
  cover_image_url text,
  author text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_published_at_idx on blog_posts (status, published_at desc);

create trigger blog_posts_set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

alter table blog_posts enable row level security;

create policy "public reads published posts"
  on blog_posts for select to anon using (status = 'published');

create policy "authenticated reads all posts"
  on blog_posts for select to authenticated using (true);

create policy "authenticated manages posts"
  on blog_posts for all to authenticated using (true) with check (true);

-- testimonials ---------------------------------------------------------------

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  area text,
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null,
  avatar_url text,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "public reads published testimonials"
  on testimonials for select to anon using (status = 'published');

create policy "authenticated reads all testimonials"
  on testimonials for select to authenticated using (true);

create policy "authenticated manages testimonials"
  on testimonials for all to authenticated using (true) with check (true);

-- leads ---------------------------------------------------------------------
-- No anon policies at all: lead form submissions are written server-side
-- with the service-role key (bypasses RLS), never directly from the browser.

create table leads (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('general', 'quote', 'distributor')),
  name text not null,
  business_name text,
  phone text,
  email text,
  city text,
  business_type text,
  products_interested text[] not null default '{}',
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index leads_status_created_at_idx on leads (status, created_at desc);

alter table leads enable row level security;

create policy "authenticated reads leads"
  on leads for select to authenticated using (true);

create policy "authenticated updates leads"
  on leads for update to authenticated using (true) with check (true);

-- site_settings --------------------------------------------------------------
-- Singleton row (id is always 1). Seeded below; never inserted from the app.

create table site_settings (
  id integer primary key default 1 check (id = 1),
  logo_url text,
  phone text,
  whatsapp text,
  email text,
  address text,
  opening_hours text,
  social_links jsonb not null default '{}'::jsonb,
  coverage_areas text[] not null default '{}',
  header_nav jsonb not null default '[]'::jsonb,
  footer_nav jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "public reads site settings"
  on site_settings for select to anon, authenticated using (true);

create policy "authenticated updates site settings"
  on site_settings for update to authenticated using (true) with check (true);

insert into site_settings (id) values (1) on conflict (id) do nothing;

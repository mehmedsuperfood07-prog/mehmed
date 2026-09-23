// The closed section library -- see PLAN.md section 3.1. Adding a new type
// here means updating: this file, schemas.ts (admin field schema + default
// content), the matching renderer in components/sections/, and the
// registry in registry.tsx. Don't add a 14th type for a one-off page need;
// compose existing types first.

export type SectionType =
  | "hero"
  | "rich_text"
  | "image_with_text"
  | "stats_counter"
  | "feature_grid"
  | "product_grid"
  | "coverage_area"
  | "testimonial_slider"
  | "cta_banner"
  | "faq_accordion"
  | "gallery"
  | "contact_form"
  | "quote_form"
  | "logo_carousel"
  | "page_header"
  | "contact_info"
  | "product_list";

export type HeroContent = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  body?: string;
  image_url?: string;
  primary_cta_label?: string;
  primary_cta_href?: string;
  secondary_cta_label?: string;
  secondary_cta_href?: string;
};

export type RichTextContent = {
  heading?: string;
  body: string;
};

export type ImageWithTextContent = {
  heading: string;
  body: string;
  image_url?: string;
  image_on_right: boolean;
  cta_label?: string;
  cta_href?: string;
};

export type StatsCounterContent = {
  heading?: string;
  stats: { label: string; value: string; suffix?: string }[];
};

export type FeatureGridContent = {
  heading: string;
  subheading?: string;
  style?: "light" | "dark";
  features: { title: string; description: string; icon?: string }[];
};

export type ProductGridContent = {
  heading: string;
  subheading?: string;
  featured_only: boolean;
};

export type CoverageAreaContent = {
  heading: string;
  body?: string;
  areas?: string[];
  cta_label?: string;
  cta_href?: string;
};

export type TestimonialSliderContent = {
  heading?: string;
  subheading?: string;
};

export type CTABannerContent = {
  heading: string;
  body?: string;
  buttons: { label: string; href: string }[];
};

export type FAQAccordionContent = {
  heading?: string;
  items: { question: string; answer: string }[];
};

export type GalleryContent = {
  heading?: string;
  images: { url: string; alt: string }[];
};

export type ContactFormContent = {
  heading?: string;
  body?: string;
  side_heading?: string;
  side_body?: string;
  side_items?: string[];
  side_cta_label?: string;
  side_cta_href?: string;
};

export type QuoteFormContent = {
  heading?: string;
  body?: string;
  info_heading?: string;
  info_items?: string[];
};

// A missed section from the template's homepage -- a "trusted by" band of
// partner/client logos right below the Hero. `image_url` set means the
// carousel renders the logo only (no visible name, per client request);
// `label` alone (no image_url) falls back to a generic checkmark badge --
// used for entries where a verified official logo couldn't be sourced.
export type LogoCarouselContent = {
  heading?: string;
  logos: { label: string; image_url?: string }[];
};

// The template's actual inner-page hero -- About/Menu/Contact all use this
// split photo+title / info-panel layout, NOT the homepage's Hero (no
// floating widget cards, no CTAs). Was conflated with `hero` until a
// page-by-page audit caught it -- see PLAN.md section 5.
export type PageHeaderContent = {
  title: string;
  heading: string;
  body?: string;
  image_url?: string;
};

// The template's Contact page has a distinct divided-row info list (Head
// Office / Phone / Email / Hours, values in the italic accent font) that
// was missing entirely. Values are read live from site_settings, not
// duplicated into section content -- same single-source-of-truth pattern
// as Footer.tsx.
export type ContactInfoContent = {
  eyebrow?: string;
  heading: string;
};

// The template's Menu page groups products by category (image beside a
// list of lime row-cards), a different pattern from ProductGrid's flat
// grid (which matches the homepage's "Best Sellers" section, not this).
export type ProductListContent = {
  heading?: string;
  subheading?: string;
};

export type SectionContentMap = {
  hero: HeroContent;
  rich_text: RichTextContent;
  image_with_text: ImageWithTextContent;
  stats_counter: StatsCounterContent;
  feature_grid: FeatureGridContent;
  product_grid: ProductGridContent;
  coverage_area: CoverageAreaContent;
  testimonial_slider: TestimonialSliderContent;
  cta_banner: CTABannerContent;
  faq_accordion: FAQAccordionContent;
  gallery: GalleryContent;
  contact_form: ContactFormContent;
  quote_form: QuoteFormContent;
  logo_carousel: LogoCarouselContent;
  page_header: PageHeaderContent;
  contact_info: ContactInfoContent;
  product_list: ProductListContent;
};

// Field schema for the generic admin editor (components/admin/section-editor).
export type FieldSchema =
  | { key: string; label: string; type: "text"; optional?: boolean }
  | { key: string; label: string; type: "textarea"; optional?: boolean }
  | { key: string; label: string; type: "image"; optional?: boolean }
  | { key: string; label: string; type: "boolean" }
  | { key: string; label: string; type: "select"; options: string[] }
  | { key: string; label: string; type: "list"; itemLabel: string }
  | { key: string; label: string; type: "repeater"; itemLabel: string; fields: FieldSchema[] };

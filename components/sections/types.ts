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
  | "quote_form";

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
  areas: string[];
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
};

export type QuoteFormContent = {
  heading?: string;
  body?: string;
  info_heading?: string;
  info_items?: string[];
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

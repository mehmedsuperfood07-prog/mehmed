-- Adds "logo_carousel" to page_sections.type -- a section missed in the
-- original template audit (a "trusted by" partner-logo band directly below
-- the Hero). See components/sections/types.ts for the content shape.

alter table page_sections drop constraint page_sections_type_check;

alter table page_sections add constraint page_sections_type_check check (type in (
  'hero', 'rich_text', 'image_with_text', 'stats_counter', 'feature_grid',
  'product_grid', 'coverage_area', 'testimonial_slider', 'cta_banner',
  'faq_accordion', 'gallery', 'contact_form', 'quote_form', 'logo_carousel'
));

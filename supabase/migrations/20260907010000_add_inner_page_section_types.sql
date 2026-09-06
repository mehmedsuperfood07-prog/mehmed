-- Adds three more section types found during a page-by-page audit against
-- the template (About/Menu/Contact use a different hero than the homepage,
-- Contact has a divided-row info list, and the Menu page groups products
-- by category rather than a flat grid). See components/sections/types.ts.

alter table page_sections drop constraint page_sections_type_check;

alter table page_sections add constraint page_sections_type_check check (type in (
  'hero', 'rich_text', 'image_with_text', 'stats_counter', 'feature_grid',
  'product_grid', 'coverage_area', 'testimonial_slider', 'cta_banner',
  'faq_accordion', 'gallery', 'contact_form', 'quote_form', 'logo_carousel',
  'page_header', 'contact_info', 'product_list'
));

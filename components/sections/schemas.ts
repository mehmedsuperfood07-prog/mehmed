import type { FieldSchema, SectionContentMap, SectionType } from "./types";

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  rich_text: "Rich Text",
  image_with_text: "Image with Text",
  stats_counter: "Stats Counter",
  feature_grid: "Feature Grid",
  product_grid: "Product Grid",
  coverage_area: "Coverage Area",
  testimonial_slider: "Testimonial Slider",
  cta_banner: "CTA Banner",
  faq_accordion: "FAQ Accordion",
  gallery: "Gallery",
  contact_form: "Contact Form",
  quote_form: "Quote Form",
};

export const SECTION_FIELD_SCHEMAS: Record<SectionType, FieldSchema[]> = {
  hero: [
    { key: "eyebrow", label: "Eyebrow", type: "text", optional: true },
    { key: "headline", label: "Headline", type: "text" },
    { key: "subheadline", label: "Subheadline", type: "text", optional: true },
    { key: "body", label: "Body", type: "textarea", optional: true },
    { key: "image_url", label: "Background image", type: "image", optional: true },
    { key: "primary_cta_label", label: "Primary button label", type: "text", optional: true },
    { key: "primary_cta_href", label: "Primary button link", type: "text", optional: true },
    { key: "secondary_cta_label", label: "Secondary button label", type: "text", optional: true },
    { key: "secondary_cta_href", label: "Secondary button link", type: "text", optional: true },
  ],
  rich_text: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    { key: "body", label: "Body", type: "textarea" },
  ],
  image_with_text: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "image_url", label: "Image", type: "image", optional: true },
    { key: "image_on_right", label: "Image on the right", type: "boolean" },
  ],
  stats_counter: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    {
      key: "stats",
      label: "Stats",
      type: "repeater",
      itemLabel: "Stat",
      fields: [
        { key: "value", label: "Value (e.g. 12, 500+)", type: "text" },
        { key: "label", label: "Label", type: "text" },
        { key: "suffix", label: "Suffix (e.g. +, %)", type: "text", optional: true },
      ],
    },
  ],
  feature_grid: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea", optional: true },
    {
      key: "features",
      label: "Features",
      type: "repeater",
      itemLabel: "Feature",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  product_grid: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea", optional: true },
    { key: "featured_only", label: "Featured products only", type: "boolean" },
  ],
  coverage_area: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea", optional: true },
    { key: "areas", label: "Areas (one per line)", type: "list", itemLabel: "Area" },
  ],
  testimonial_slider: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    { key: "subheading", label: "Subheading", type: "textarea", optional: true },
  ],
  cta_banner: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea", optional: true },
    {
      key: "buttons",
      label: "Buttons",
      type: "repeater",
      itemLabel: "Button",
      fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "href", label: "Link", type: "text" },
      ],
    },
  ],
  faq_accordion: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    {
      key: "items",
      label: "Questions",
      type: "repeater",
      itemLabel: "Question",
      fields: [
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea" },
      ],
    },
  ],
  gallery: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    {
      key: "images",
      label: "Images",
      type: "repeater",
      itemLabel: "Image",
      fields: [
        { key: "url", label: "Image", type: "image" },
        { key: "alt", label: "Alt text", type: "text" },
      ],
    },
  ],
  contact_form: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    { key: "body", label: "Body", type: "textarea", optional: true },
  ],
  quote_form: [
    { key: "heading", label: "Heading", type: "text", optional: true },
    { key: "body", label: "Body", type: "textarea", optional: true },
  ],
};

export const SECTION_DEFAULT_CONTENT: SectionContentMap = {
  hero: { headline: "New Hero Section" },
  rich_text: { body: "Write something here." },
  image_with_text: { heading: "Heading", body: "Body text.", image_on_right: true },
  stats_counter: { stats: [] },
  feature_grid: { heading: "Why Choose Us", features: [] },
  product_grid: { heading: "Our Products", featured_only: true },
  coverage_area: { heading: "Where We Deliver", areas: [] },
  testimonial_slider: { heading: "What Our Customers Say" },
  cta_banner: { heading: "Get in touch", buttons: [] },
  faq_accordion: { items: [] },
  gallery: { images: [] },
  contact_form: { heading: "Send us a message" },
  quote_form: { heading: "Request a Bulk Quote" },
};

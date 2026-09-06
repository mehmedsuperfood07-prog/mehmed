import { Hero } from "./Hero";
import { RichText } from "./RichText";
import { ImageWithText } from "./ImageWithText";
import { StatsCounter } from "./StatsCounter";
import { FeatureGrid } from "./FeatureGrid";
import { ProductGrid } from "./ProductGrid";
import { CoverageArea } from "./CoverageArea";
import { TestimonialSlider } from "./TestimonialSlider";
import { CTABanner } from "./CTABanner";
import { FAQAccordion } from "./FAQAccordion";
import { Gallery } from "./Gallery";
import { ContactForm } from "./ContactForm";
import { QuoteForm } from "./QuoteForm";
import { LogoCarousel } from "./LogoCarousel";
import { PageHeader } from "./PageHeader";
import { ContactInfo } from "./ContactInfo";
import { ProductList } from "./ProductList";
import type { SectionContentMap, SectionType } from "./types";

type SectionRendererProps<T extends SectionType> = { content: SectionContentMap[T] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_RENDERERS: { [K in SectionType]: (props: SectionRendererProps<K>) => any } = {
  hero: Hero,
  rich_text: RichText,
  image_with_text: ImageWithText,
  stats_counter: StatsCounter,
  feature_grid: FeatureGrid,
  product_grid: ProductGrid,
  coverage_area: CoverageArea,
  testimonial_slider: TestimonialSlider,
  cta_banner: CTABanner,
  faq_accordion: FAQAccordion,
  gallery: Gallery,
  contact_form: ContactForm,
  quote_form: QuoteForm,
  logo_carousel: LogoCarousel,
  page_header: PageHeader,
  contact_info: ContactInfo,
  product_list: ProductList,
};

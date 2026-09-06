// Hand-written to match supabase/migrations/20260906120000_init_schema.sql.
// TODO: replace with `supabase gen types typescript` output once the CLI is
// linked to the live project (see CLAUDE.md "Accounts") — keep this file's
// shape in sync with any migration changes until then.

export type PageStatus = "draft" | "published";
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
export type LeadType = "general" | "quote" | "distributor";
export type LeadStatus = "new" | "contacted" | "closed";

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          seo_title: string | null;
          seo_description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          no_index: boolean;
          status: PageStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Pick<
            Database["public"]["Tables"]["pages"]["Row"],
            | "id"
            | "seo_title"
            | "seo_description"
            | "og_image_url"
            | "canonical_url"
            | "no_index"
            | "status"
            | "created_at"
            | "updated_at"
          >
        > &
          Pick<Database["public"]["Tables"]["pages"]["Row"], "slug" | "title">;
        Update: Partial<Database["public"]["Tables"]["pages"]["Row"]>;
      };
      page_sections: {
        Row: {
          id: string;
          page_id: string;
          type: SectionType;
          position: number;
          content: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Pick<
            Database["public"]["Tables"]["page_sections"]["Row"],
            "id" | "position" | "content" | "created_at" | "updated_at"
          >
        > &
          Pick<Database["public"]["Tables"]["page_sections"]["Row"], "page_id" | "type">;
        Update: Partial<Database["public"]["Tables"]["page_sections"]["Row"]>;
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
        };
        Insert: Partial<Pick<Database["public"]["Tables"]["product_categories"]["Row"], "id" | "sort_order">> &
          Pick<Database["public"]["Tables"]["product_categories"]["Row"], "name" | "slug">;
        Update: Partial<Database["public"]["Tables"]["product_categories"]["Row"]>;
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          image_url: string | null;
          pack_sizes: string[];
          is_featured: boolean;
          sort_order: number;
          status: PageStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["products"]["Row"], "name" | "slug">
        > &
          Pick<Database["public"]["Tables"]["products"]["Row"], "name" | "slug">;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: Record<string, unknown> | null;
          cover_image_url: string | null;
          author: string | null;
          seo_title: string | null;
          seo_description: string | null;
          status: PageStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "title" | "slug">
        > &
          Pick<Database["public"]["Tables"]["blog_posts"]["Row"], "title" | "slug">;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]>;
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          area: string | null;
          rating: number;
          quote: string;
          avatar_url: string | null;
          sort_order: number;
          status: PageStatus;
          created_at: string;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["testimonials"]["Row"], "author_name" | "quote">
        > &
          Pick<Database["public"]["Tables"]["testimonials"]["Row"], "author_name" | "quote">;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
      };
      leads: {
        Row: {
          id: string;
          type: LeadType;
          name: string;
          business_name: string | null;
          phone: string | null;
          email: string | null;
          city: string | null;
          business_type: string | null;
          products_interested: string[];
          message: string | null;
          status: LeadStatus;
          created_at: string;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["leads"]["Row"], "type" | "name">
        > &
          Pick<Database["public"]["Tables"]["leads"]["Row"], "type" | "name">;
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
      };
      site_settings: {
        Row: {
          id: number;
          logo_url: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          address: string | null;
          opening_hours: string | null;
          social_links: Record<string, string>;
          coverage_areas: string[];
          header_nav: unknown[];
          footer_nav: unknown[];
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
    };
  };
};

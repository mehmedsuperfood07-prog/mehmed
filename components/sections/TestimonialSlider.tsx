import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { TestimonialCarousel } from "./TestimonialCarousel";
import type { TestimonialSliderContent } from "./types";

export async function TestimonialSlider({ content }: { content: TestimonialSliderContent }) {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            Testimonials
          </p>
          {content.heading && <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>}
          {content.subheading && <p className="mt-4 text-ink-soft">{content.subheading}</p>}
        </Reveal>
        <div className="mt-12">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </Container>
    </section>
  );
}

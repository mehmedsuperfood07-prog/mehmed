import { createClient } from "@/lib/supabase/server";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
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
    <section className="bg-cream py-16">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          {content.heading && <h2 className="font-display text-3xl text-ink">{content.heading}</h2>}
          {content.subheading && <p className="mt-3 text-ink/70">{content.subheading}</p>}
        </Reveal>
        <div className="mt-10">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Database } from "@/lib/supabase/types";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-gold" aria-label={`Rated ${rating} out of 5`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  // Re-render on Embla's own events rather than mirroring its state into a
  // separate useState set synchronously inside the effect (flagged by
  // react-hooks/set-state-in-effect) -- selectedScrollSnap() is read fresh
  // from emblaApi each render instead.
  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const rerender = () => forceRerender((n) => n + 1);
    emblaApi.on("select", rerender).on("reInit", rerender);
    return () => {
      emblaApi.off("select", rerender).off("reInit", rerender);
    };
  }, [emblaApi]);

  const selectedIndex = emblaApi?.selectedScrollSnap() ?? 0;

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="min-w-0 flex-[0_0_100%] px-2 sm:flex-[0_0_50%]">
              <div className="h-full rounded-2xl border border-black/5 bg-surface p-6">
                <Stars rating={testimonial.rating} />
                <p className="mt-3 text-ink/80">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-ink">
                  {testimonial.author_name}
                  {testimonial.area && <span className="text-ink/50">, {testimonial.area}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex ? "w-6 bg-primary" : "w-2 bg-primary/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

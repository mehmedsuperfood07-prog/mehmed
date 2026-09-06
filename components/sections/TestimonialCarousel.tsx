"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Database } from "@/lib/supabase/types";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-primary" aria-label={`Rated ${rating} out of 5`}>
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
              <div className="relative h-full rounded-3xl bg-lime p-7">
                <span className="absolute right-6 top-6 font-serif text-4xl text-primary/40">
                  &rdquo;
                </span>
                <Stars rating={testimonial.rating} />
                <p className="accent mt-4 text-xl leading-snug text-lime-text">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-5 text-sm font-medium text-primary">
                  — {testimonial.author_name}
                  {testimonial.area && `, ${testimonial.area}`}
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

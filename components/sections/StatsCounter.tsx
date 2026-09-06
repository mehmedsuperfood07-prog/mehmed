"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { StatsCounterContent } from "./types";

function Counter({ value, suffix }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const isNumeric = !Number.isNaN(numeric);
  const [display, setDisplay] = useState(isNumeric ? "0" : value);

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    const controls = animate(0, numeric, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (current) => setDisplay(Math.round(current).toString()),
    });
    return () => controls.stop();
  }, [isInView, isNumeric, numeric]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// Mirrors the template's compact stat card nested under the About section's
// CTA button -- a shared lime pill containing several numbers side by side,
// not a full-bleed band. Compose it directly after an ImageWithText section
// to approximate that combined layout.
export function StatsCounter({ content }: { content: StatsCounterContent }) {
  if (content.stats.length === 0) return null;

  return (
    <div className="py-2">
      <Container>
        {content.heading && (
          <Reveal>
            <p className="mb-4 text-sm font-medium text-ink-soft">{content.heading}</p>
          </Reveal>
        )}
        <Reveal className="inline-flex flex-wrap gap-8 rounded-2xl bg-lime px-8 py-6 sm:gap-12">
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <p className="h2 text-lime-text">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-lime-text/70">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </div>
  );
}

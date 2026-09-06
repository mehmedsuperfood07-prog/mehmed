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

export function StatsCounter({ content }: { content: StatsCounterContent }) {
  return (
    <section className="bg-primary py-16 text-white">
      <Container>
        {content.heading && (
          <Reveal>
            <h2 className="text-center font-display text-3xl">{content.heading}</h2>
          </Reveal>
        )}
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {content.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="text-center">
              <p className="font-display text-4xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/80">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

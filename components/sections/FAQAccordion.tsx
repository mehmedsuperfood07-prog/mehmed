"use client";

import { useState } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { FAQAccordionContent } from "./types";

export function FAQAccordion({ content }: { content: FAQAccordionContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        {content.heading && (
          <Reveal>
            <h2 className="h2 text-center text-ink">{renderHeading(content.heading)}</h2>
          </Reveal>
        )}
        <div className="mt-10 divide-y divide-black/5 rounded-3xl bg-cream">
          {content.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink">{item.question}</span>
                  <span className="shrink-0 text-xl text-primary">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="px-7 pb-5 text-sm text-ink-soft">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

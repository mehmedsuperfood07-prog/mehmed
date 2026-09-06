"use client";

import { useState } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { FAQAccordionContent } from "./types";

export function FAQAccordion({ content }: { content: FAQAccordionContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        {content.heading && (
          <Reveal>
            <h2 className="text-center font-display text-3xl text-ink">{content.heading}</h2>
          </Reveal>
        )}
        <div className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface">
          {content.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink">{item.question}</span>
                  <span className="shrink-0 text-xl text-primary">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="px-6 pb-4 text-sm text-ink/70">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

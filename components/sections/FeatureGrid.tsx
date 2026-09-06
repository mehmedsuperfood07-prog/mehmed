import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { FeatureGridContent } from "./types";

export function FeatureGrid({ content }: { content: FeatureGridContent }) {
  return (
    <section className="py-16">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-ink">{content.heading}</h2>
          {content.subheading && <p className="mt-3 text-ink/70">{content.subheading}</p>}
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.features.map((feature, index) => (
            <Reveal
              key={feature.title}
              delay={index * 0.08}
              className="rounded-2xl border border-black/5 bg-surface p-6 transition-transform hover:-translate-y-1"
            >
              <h3 className="font-display text-lg text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{feature.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

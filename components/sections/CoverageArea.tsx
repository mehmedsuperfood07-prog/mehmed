import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { CoverageAreaContent } from "./types";

export function CoverageArea({ content }: { content: CoverageAreaContent }) {
  return (
    <section className="bg-cream py-16">
      <Container className="max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl text-ink">{content.heading}</h2>
          {content.body && <p className="mt-3 text-ink/70">{content.body}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {content.areas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-primary/20 bg-surface px-4 py-1.5 text-sm text-primary-dark"
              >
                {area}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

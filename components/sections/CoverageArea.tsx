import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { CoverageAreaContent } from "./types";

export function CoverageArea({ content }: { content: CoverageAreaContent }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            Find Us
          </p>
          <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>
          {content.body && <p className="mt-4 text-ink-soft">{content.body}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {content.areas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-lime px-4 py-2 text-sm font-medium text-lime-text"
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

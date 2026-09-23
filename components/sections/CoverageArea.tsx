import { MapPin } from "lucide-react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
import type { CoverageAreaContent } from "./types";

export function CoverageArea({ content }: { content: CoverageAreaContent }) {
  const areas = content.areas ?? [];

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <Reveal>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <MapPin className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            Find Us
          </p>
          <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>
          {content.body && <p className="mt-4 text-ink-soft">{content.body}</p>}
          {areas.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-lime px-4 py-2 text-sm font-medium text-lime-text"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
          {content.cta_label && content.cta_href && (
            <div className="mt-8">
              <Button href={content.cta_href} variant="solid">
                {content.cta_label}
              </Button>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

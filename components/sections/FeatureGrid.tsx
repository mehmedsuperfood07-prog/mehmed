import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { FeatureGridContent } from "./types";

// Two visual treatments from the template: "light" mirrors the centered
// "Why Choose Us" section (white bg, centered heading above the grid),
// "dark" mirrors the "Features" section (teal bg, heading beside the
// grid instead of above it). Same content shape either way.
export function FeatureGrid({ content }: { content: FeatureGridContent }) {
  const isDark = content.style === "dark";

  if (isDark) {
    return (
      <section className="overflow-hidden rounded-[2.5rem] bg-primary py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-lime">
                Features
              </p>
              <h2 className="h2 text-white">{renderHeading(content.heading, "text-lime")}</h2>
              {content.subheading && <p className="mt-4 max-w-md text-white/75">{content.subheading}</p>}
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 0.08} className="rounded-2xl bg-lime p-6">
                  {feature.icon && <span className="text-2xl">{feature.icon}</span>}
                  <h3 className="mt-4 font-medium text-lime-text">{feature.title}</h3>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            Why Choose Us
          </p>
          <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>
          {content.subheading && <p className="mt-4 text-ink-soft">{content.subheading}</p>}
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08} className="rounded-2xl bg-lime p-6">
              {feature.icon && <span className="text-2xl">{feature.icon}</span>}
              <h3 className="mt-4 text-lg font-medium text-lime-text">{feature.title}</h3>
              <p className="mt-2 text-sm text-lime-text/70">{feature.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

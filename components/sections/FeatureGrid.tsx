import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { FeatureIcon, isNumberIcon } from "./FeatureIcon";
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
                <Reveal key={feature.title} delay={index * 0.08} className="flex">
                  <div className="w-full rounded-2xl bg-lime p-6 transition-transform duration-300 hover:-translate-y-1">
                    {feature.icon && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                        <FeatureIcon icon={feature.icon} className="h-6 w-6" />
                      </div>
                    )}
                    <h3 className="mt-4 font-medium text-lime-text">{feature.title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Cards wrap and center, so a last row with fewer cards (5 or 7 items)
  // sits in the middle instead of leaving a hole on the right.
  const count = content.features.length;
  const widthClass =
    count === 4
      ? "w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.95rem)]"
      : count === 2
        ? "w-full sm:w-[calc(50%-0.625rem)]"
        : "w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.85rem)]";

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
        <div className="mt-14 flex flex-wrap justify-center gap-5">
          {content.features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08} className={`flex ${widthClass}`}>
              <div className="group relative w-full overflow-hidden rounded-3xl border border-primary/10 bg-lime/40 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:bg-primary hover:shadow-xl hover:shadow-primary/20">
                {!isNumberIcon(feature.icon) && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -top-3 select-none text-[5.5rem] font-medium leading-none text-primary/10 transition-colors duration-300 group-hover:text-white/10"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                {feature.icon && (
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white transition-colors duration-300 group-hover:bg-lime group-hover:text-primary">
                    <FeatureIcon icon={feature.icon} className="h-7 w-7" />
                  </div>
                )}
                <h3 className="relative mt-6 text-lg font-medium text-lime-text transition-colors duration-300 group-hover:text-white">
                  {feature.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-lime-text/70 transition-colors duration-300 group-hover:text-white/80">
                  {feature.description}
                </p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-lime transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { LogoCarouselContent } from "./types";

export function LogoCarousel({ content }: { content: LogoCarouselContent }) {
  if (content.logos.length === 0) return null;

  // Rendered twice back to back so the marquee animation (translateX to
  // -50%) loops seamlessly -- see the .animate-marquee keyframes.
  const track = [...content.logos, ...content.logos];

  return (
    <section className="bg-primary py-14">
      {content.heading && (
        <Container className="mb-8 text-center">
          <Reveal>
            <h2 className="text-lg text-white/80">{renderHeading(content.heading, "text-lime")}</h2>
          </Reveal>
        </Container>
      )}
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee items-center">
          {track.map((logo, index) => (
            <div key={`${logo.label}-${index}`} className="flex shrink-0 items-center gap-3 px-10">
              {logo.image_url ? (
                <div className="relative h-9 w-28 shrink-0">
                  <Image src={logo.image_url} alt={logo.label} fill className="object-contain object-left" />
                </div>
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
                  ✓
                </span>
              )}
              <span className="whitespace-nowrap text-lg font-medium text-white">{logo.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

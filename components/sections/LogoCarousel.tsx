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
  const secondItems = content.second_items ?? [];
  const secondTrack = [...secondItems, ...secondItems];

  return (
    <section className="overflow-hidden rounded-[2.5rem] bg-primary py-5 sm:py-6">
      {content.heading && (
        <Container className="mb-2 text-center">
          <Reveal>
            <h2 className="text-sm text-white/80">{renderHeading(content.heading, "text-lime")}</h2>
          </Reveal>
        </Container>
      )}
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee items-center">
          {track.map((logo, index) => (
            <div key={`${logo.label}-${index}`} className="flex shrink-0 items-center gap-3 px-8">
              {logo.image_url ? (
                <div className="relative h-10 w-28 shrink-0">
                  <Image src={logo.image_url} alt={logo.label} fill className="object-contain object-left" />
                </div>
              ) : (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
                    ✓
                  </span>
                  <span className="whitespace-nowrap text-lg font-medium text-white">{logo.label}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {secondItems.length > 0 && (
        <div className="mt-3 border-t border-white/15 pt-3">
          {content.second_heading && (
            <Container className="mb-2 text-center">
              <h2 className="text-sm text-white/80">{content.second_heading}</h2>
            </Container>
          )}
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee-reverse items-center">
              {secondTrack.map((item, index) => (
                <div key={`${item}-${index}`} className="flex shrink-0 items-center gap-2 px-6">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-primary">
                    ✓
                  </span>
                  <span className="whitespace-nowrap text-sm font-medium text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

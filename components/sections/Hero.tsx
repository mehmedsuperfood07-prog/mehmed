import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
import type { HeroContent } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1562956509-4e2fbef3afcc?auto=format&fit=crop&w=1800&q=80";

export function Hero({ content }: { content: HeroContent }) {
  const {
    eyebrow,
    headline,
    subheadline,
    body,
    image_url,
    primary_cta_label,
    primary_cta_href,
    secondary_cta_label,
    secondary_cta_href,
  } = content;

  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem]">
      <div className="relative min-h-[760px] sm:h-[680px] sm:min-h-0">
        <Image
          src={image_url || FALLBACK_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Photo fills the section all the way to the top -- the header
            (rendered by the (site) layout, position: absolute) floats
            transparently over it. Clearance from the header is padding on
            this content wrapper, not a gap in the section/photo itself. */}
        <Container className="relative flex h-full min-h-[760px] flex-col justify-between gap-8 pt-28 pb-6 sm:min-h-0 sm:gap-0 sm:pt-36 sm:pb-10">
          {/* Floating widget cards -- see CLAUDE.md for why these replace
              the template's live avatar/map widgets with static badges. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <Reveal className="flex items-center gap-3 self-start rounded-2xl bg-white px-5 py-4 shadow-xl">
              <span className="text-2xl">🌾</span>
              <div>
                <p className="text-sm font-medium text-ink">Soft Roti for 7 Hours</p>
                <p className="text-xs text-ink-soft">Mehmed Chakki Atta</p>
              </div>
            </Reveal>

            <Reveal
              delay={0.1}
              className="self-start rounded-2xl bg-white px-5 py-4 shadow-xl"
            >
              <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span>📍</span> Delivering To
              </p>
              <p className="mt-1 text-sm font-medium text-ink">Lahore &amp; Nearby Areas</p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal className="max-w-xl">
              {eyebrow && (
                <p className="mb-3 text-sm font-medium uppercase tracking-wide text-white/80">
                  {eyebrow}
                </p>
              )}
              <h1 className="h1 text-white">{renderHeading(headline, "text-lime")}</h1>
              {subheadline && <p className="mt-4 max-w-md text-lg text-white/85">{subheadline}</p>}
              {body && <p className="mt-3 max-w-md text-white/70">{body}</p>}
            </Reveal>

            {(primary_cta_label || secondary_cta_label) && (
              <Reveal delay={0.15} className="flex flex-wrap gap-3">
                {secondary_cta_label && secondary_cta_href && (
                  <Button href={secondary_cta_href} variant="outline">
                    {secondary_cta_label}
                  </Button>
                )}
                {primary_cta_label && primary_cta_href && (
                  <Button href={primary_cta_href} variant="lime">
                    {primary_cta_label}
                  </Button>
                )}
              </Reveal>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}

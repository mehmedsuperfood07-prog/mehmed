import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { HeroContent } from "./types";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-maroon text-white">
      {image_url && (
        <Image
          src={image_url}
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
      )}
      <Container className="relative py-24 sm:py-32">
        <Reveal className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-lime">{eyebrow}</p>
          )}
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{headline}</h1>
          {subheadline && <p className="mt-4 text-xl text-white/90">{subheadline}</p>}
          {body && <p className="mt-4 text-base text-white/75">{body}</p>}
          <div className="mt-8 flex flex-wrap gap-4">
            {primary_cta_label && primary_cta_href && (
              <Link
                href={primary_cta_href}
                className="rounded-lg bg-white px-6 py-3 font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                {primary_cta_label}
              </Link>
            )}
            {secondary_cta_label && secondary_cta_href && (
              <Link
                href={secondary_cta_href}
                className="rounded-lg border border-white/40 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                {secondary_cta_label}
              </Link>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

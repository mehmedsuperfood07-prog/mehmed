import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { CTABannerContent } from "./types";

export function CTABanner({ content }: { content: CTABannerContent }) {
  return (
    <section className="bg-maroon py-16 text-white">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-display text-3xl">{content.heading}</h2>
          {content.body && <p className="mx-auto mt-3 max-w-xl text-white/80">{content.body}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {content.buttons.map((button) => (
              <Link
                key={button.label}
                href={button.href}
                className="rounded-lg bg-white px-6 py-3 font-medium text-maroon transition-transform hover:scale-[1.03]"
              >
                {button.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

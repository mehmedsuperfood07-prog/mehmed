import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
import type { CTABannerContent } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?auto=format&fit=crop&w=1800&q=80";

export function CTABanner({ content }: { content: CTABannerContent }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] py-20 sm:py-28">
      <Image src={FALLBACK_IMAGE} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="h2 text-white">{renderHeading(content.heading, "text-lime")}</h2>
          {content.body && (
            <p className="mx-auto mt-4 max-w-xl text-white/80">{content.body}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {content.buttons.map((button, index) => (
              <Button
                key={button.label}
                href={button.href}
                variant={index === content.buttons.length - 1 ? "lime" : "outline"}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

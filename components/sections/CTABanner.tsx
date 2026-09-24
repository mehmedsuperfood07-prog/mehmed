import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
import type { CTABannerContent } from "./types";

// Background photo (content.image_url, the product line-up) under a dark
// overlay with the text on top; solid brand green when no image is set.
export function CTABanner({ content }: { content: CTABannerContent }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-primary py-20 sm:py-28">
      {content.image_url && (
        <>
          <Image src={content.image_url} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </>
      )}
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

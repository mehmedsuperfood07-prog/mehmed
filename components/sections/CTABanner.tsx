import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
import type { CTABannerContent } from "./types";

// Solid brand-green band with the text on top; if an image is set (the
// product line-up), it sits underneath the text at full visibility with its
// top edge fading into the green -- text is never laid over the products.
export function CTABanner({ content }: { content: CTABannerContent }) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-primary pt-20 sm:pt-28">
      <Container className={`relative text-center ${content.image_url ? "pb-10 sm:pb-14" : "pb-20 sm:pb-28"}`}>
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
      {content.image_url && (
        <div className="relative h-56 sm:h-auto sm:aspect-[1200/407]">
          <Image
            src={content.image_url}
            alt="Mehmed product range: Kainat 1121 rice, Rizqan sugarcane juice, Chakki Atta and Super White Atta"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-primary to-transparent" />
        </div>
      )}
    </section>
  );
}

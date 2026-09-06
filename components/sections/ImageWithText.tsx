import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
import type { ImageWithTextContent } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80";

export function ImageWithText({ content }: { content: ImageWithTextContent }) {
  const { heading, body, image_url, image_on_right, cta_label, cta_href } = content;

  const imageBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
      <Image src={image_url || FALLBACK_IMAGE} alt={heading} fill className="object-cover" />
    </div>
  );

  const textBlock = (
    <div>
      <h2 className="h2 text-ink">{renderHeading(heading)}</h2>
      <p className="mt-5 max-w-md whitespace-pre-line text-ink-soft">{body}</p>
      {cta_label && cta_href && (
        <Button href={cta_href} className="mt-7">
          {cta_label}
        </Button>
      )}
    </div>
  );

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {image_on_right ? (
            <>
              {textBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {textBlock}
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

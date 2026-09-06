import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { ImageWithTextContent } from "./types";

export function ImageWithText({ content }: { content: ImageWithTextContent }) {
  const { heading, body, image_url, image_on_right } = content;

  const imageBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-primary/10">
      {image_url ? (
        <Image src={image_url} alt={heading} fill className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-primary/50">
          Image coming soon
        </div>
      )}
    </div>
  );

  const textBlock = (
    <div>
      <h2 className="font-display text-3xl text-ink">{heading}</h2>
      <p className="mt-4 whitespace-pre-line text-ink/75">{body}</p>
    </div>
  );

  return (
    <section className="py-16">
      <Container>
        <Reveal className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
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

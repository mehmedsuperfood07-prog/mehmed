import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { GalleryContent } from "./types";

export function Gallery({ content }: { content: GalleryContent }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        {content.heading && (
          <Reveal>
            <h2 className="h2 text-center text-ink">{renderHeading(content.heading)}</h2>
          </Reveal>
        )}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {content.images.map((image, index) => (
            <Reveal
              key={image.url}
              delay={index * 0.05}
              className="relative aspect-square overflow-hidden rounded-2xl bg-cream"
            >
              <Image src={image.url} alt={image.alt} fill className="object-cover" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

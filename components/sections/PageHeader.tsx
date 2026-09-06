import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { PageHeaderContent } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1562956509-4e2fbef3afcc?auto=format&fit=crop&w=1200&q=80";

// The template's actual inner-page hero (About/Menu/Contact) -- a split
// photo+title / info-panel banner, not the homepage's Hero. See
// components/sections/types.ts for why this is a separate section type.
export function PageHeader({ content }: { content: PageHeaderContent }) {
  const { title, heading, body, image_url } = content;

  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem]">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[320px] pt-24 sm:h-[400px] sm:pt-32">
          <Image src={image_url || FALLBACK_IMAGE} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <Container className="relative flex h-full items-end pb-8">
            <Reveal>
              <h1 className="h1 text-white">{title}</h1>
            </Reveal>
          </Container>
        </div>
        <div className="flex min-h-[280px] items-center bg-cream pt-8 sm:min-h-0 sm:pt-0">
          <Container className="md:pl-10">
            <Reveal>
              <h2 className="text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                {renderHeading(heading)}
              </h2>
              {body && <p className="mt-4 max-w-md text-ink-soft">{body}</p>}
            </Reveal>
          </Container>
        </div>
      </div>
    </section>
  );
}

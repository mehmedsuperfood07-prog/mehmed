import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { RichTextContent } from "./types";

export function RichText({ content }: { content: RichTextContent }) {
  const paragraphs = content.body.split(/\n{2,}/).filter(Boolean);

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          {content.heading && <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>}
          <div className="mt-5 space-y-4 text-ink-soft">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

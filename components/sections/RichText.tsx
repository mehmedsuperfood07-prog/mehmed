import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { RichTextContent } from "./types";

export function RichText({ content }: { content: RichTextContent }) {
  const paragraphs = content.body.split(/\n{2,}/).filter(Boolean);

  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <Reveal>
          {content.heading && (
            <h2 className="font-display text-3xl text-ink">{content.heading}</h2>
          )}
          <div className="mt-4 space-y-4 text-ink/80">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

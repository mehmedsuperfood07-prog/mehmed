import type { ReactNode } from "react";

// The italic-serif-emphasis pattern used inside headings throughout the
// template ("Every Bite", "Seriously Delicious", "Flavor Machine").
// Content authors mark the accented phrase with **double asterisks** in a
// heading field; renderHeading below splits on that. `color` must be
// passed explicitly by the caller to match its own background -- there is
// no sensible single default, since this renders on both light and dark
// section backgrounds.
export function Accent({ children, color }: { children: ReactNode; color: string }) {
  return <span className={`accent ${color}`}>{children}</span>;
}

export function renderHeading(text: string, color: string = "text-primary") {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <Accent key={index} color={color}>
        {part}
      </Accent>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

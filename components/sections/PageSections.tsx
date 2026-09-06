import { SECTION_RENDERERS } from "./registry";
import type { SectionType } from "./types";
import type { Database } from "@/lib/supabase/types";

type SectionRow = Database["public"]["Tables"]["page_sections"]["Row"];

export function PageSections({ sections }: { sections: SectionRow[] }) {
  return (
    <>
      {sections.map((section) => {
        const Renderer = SECTION_RENDERERS[section.type as SectionType];
        if (!Renderer) return null;
        // Section content is stored as jsonb and only shaped at the app
        // layer (components/sections/types.ts) -- see PLAN.md 3.1.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Renderer key={section.id} content={section.content as any} />;
      })}
    </>
  );
}

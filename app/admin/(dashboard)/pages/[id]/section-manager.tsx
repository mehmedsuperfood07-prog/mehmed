"use client";

import { useState } from "react";
import { addSection, deleteSection, moveSection, updateSectionContent } from "../actions";
import { SECTION_FIELD_SCHEMAS, SECTION_LABELS } from "@/components/sections/schemas";
import type { SectionType } from "@/components/sections/types";
import { SectionEditorFields } from "@/components/admin/SectionEditorFields";
import type { Database } from "@/lib/supabase/types";

type SectionRow = Database["public"]["Tables"]["page_sections"]["Row"];

const SECTION_TYPES = Object.keys(SECTION_LABELS) as SectionType[];

function SectionEditorPanel({ pageId, section }: { pageId: string; section: SectionRow }) {
  const [content, setContent] = useState<Record<string, unknown>>(
    section.content as Record<string, unknown>,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateSectionContent(pageId, section.id, content);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
      <SectionEditorFields
        fields={SECTION_FIELD_SCHEMAS[section.type as SectionType] ?? []}
        content={content}
        onChange={setContent}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Section"}
        </button>
        {saved && <span className="text-xs text-ink/50">Saved.</span>}
      </div>
    </div>
  );
}

export function SectionManager({ pageId, sections }: { pageId: string; sections: SectionRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addType, setAddType] = useState<SectionType>("rich_text");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    await addSection(pageId, addType);
    setAdding(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl text-ink">Sections</h2>
        <div className="flex items-center gap-2">
          <select
            value={addType}
            onChange={(event) => setAddType(event.target.value as SectionType)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-ink"
          >
            {SECTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {SECTION_LABELS[type]}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            + Add Section
          </button>
        </div>
      </div>

      {sections.length === 0 && (
        <p className="rounded-2xl border border-black/5 bg-surface p-6 text-sm text-ink/60">
          No sections yet. Add one above.
        </p>
      )}

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded-2xl border border-black/5 bg-surface p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                className="text-left font-medium text-ink"
              >
                {SECTION_LABELS[section.type as SectionType] ?? section.type}
              </button>
              <div className="flex items-center gap-3 text-sm">
                <button
                  disabled={index === 0}
                  onClick={() => moveSection(pageId, section.id, "up")}
                  className="text-ink/50 hover:text-ink disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(pageId, section.id, "down")}
                  className="text-ink/50 hover:text-ink disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => {
                    if (confirm("Remove this section?")) deleteSection(pageId, section.id);
                  }}
                  className="text-red hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            {expandedId === section.id && <SectionEditorPanel pageId={pageId} section={section} />}
          </div>
        ))}
      </div>
    </div>
  );
}

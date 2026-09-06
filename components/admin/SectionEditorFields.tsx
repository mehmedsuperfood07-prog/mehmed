"use client";

import type { FieldSchema } from "@/components/sections/types";
import { ImageUploadField } from "./ImageUploadField";

type ContentValue = Record<string, unknown>;

// Generic, schema-driven form for editing one section's JSON content -- see
// PLAN.md 3.1. One recursive component covers all 13 section types instead
// of a bespoke editor per type; each type just declares its FieldSchema[]
// in components/sections/schemas.ts.
export function SectionEditorFields({
  fields,
  content,
  onChange,
}: {
  fields: FieldSchema[];
  content: ContentValue;
  onChange: (next: ContentValue) => void;
}) {
  function setField(key: string, value: unknown) {
    onChange({ ...content, [key]: value });
  }

  const inputClass = "mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink";

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const value = content[field.key];

        if (field.type === "image") {
          return (
            <ImageUploadField
              key={field.key}
              label={field.label}
              value={(value as string) ?? ""}
              onChange={(url) => setField(field.key, url)}
            />
          );
        }

        if (field.type === "text") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-ink">{field.label}</label>
              <input
                type="text"
                value={(value as string) ?? ""}
                onChange={(event) => setField(field.key, event.target.value)}
                className={inputClass}
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-ink">{field.label}</label>
              <textarea
                value={(value as string) ?? ""}
                onChange={(event) => setField(field.key, event.target.value)}
                rows={4}
                className={inputClass}
              />
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-ink">{field.label}</label>
              <select
                value={(value as string) ?? field.options[0]}
                onChange={(event) => setField(field.key, event.target.value)}
                className={inputClass}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "boolean") {
          return (
            <label key={field.key} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(event) => setField(field.key, event.target.checked)}
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "list") {
          const items = Array.isArray(value) ? (value as string[]) : [];
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-ink">{field.label}</label>
              <textarea
                value={items.join("\n")}
                onChange={(event) =>
                  setField(
                    field.key,
                    event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  )
                }
                rows={4}
                className={inputClass}
                placeholder="One per line"
              />
            </div>
          );
        }

        if (field.type === "repeater") {
          const items = Array.isArray(value) ? (value as ContentValue[]) : [];
          return (
            <div key={field.key}>
              <label className="block text-sm font-medium text-ink">{field.label}</label>
              <div className="mt-2 space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="rounded-lg border border-black/10 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
                        {field.itemLabel} {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => setField(field.key, items.filter((_, i) => i !== index))}
                        className="text-xs text-red hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2">
                      <SectionEditorFields
                        fields={field.fields}
                        content={item}
                        onChange={(nextItem) =>
                          setField(
                            field.key,
                            items.map((existing, i) => (i === index ? nextItem : existing)),
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setField(field.key, [...items, {}])}
                className="mt-2 text-sm font-medium text-primary hover:text-primary-dark"
              >
                + Add {field.itemLabel}
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

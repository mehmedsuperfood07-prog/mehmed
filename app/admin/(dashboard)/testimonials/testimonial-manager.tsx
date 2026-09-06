"use client";

import { useState } from "react";
import { TestimonialForm } from "./testimonial-form";
import type { Database } from "@/lib/supabase/types";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export function TestimonialManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-surface p-6">
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          {showAdd ? "− Cancel" : "+ Add Testimonial"}
        </button>
        {showAdd && (
          <div className="mt-4">
            <TestimonialForm onDone={() => setShowAdd(false)} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="rounded-2xl border border-black/5 bg-surface p-4">
            <button
              onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <p className="font-medium text-ink">{testimonial.author_name}</p>
                <p className="text-xs text-ink/50">
                  {testimonial.area} · {testimonial.status}
                </p>
              </div>
              <span className="text-ink/40">{expandedId === testimonial.id ? "−" : "+"}</span>
            </button>
            {expandedId === testimonial.id && (
              <div className="mt-4 border-t border-black/5 pt-4">
                <TestimonialForm testimonial={testimonial} onDone={() => setExpandedId(null)} />
              </div>
            )}
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="rounded-2xl border border-black/5 bg-surface p-6 text-sm text-ink/60">
            No testimonials yet.
          </p>
        )}
      </div>
    </div>
  );
}

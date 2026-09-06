"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "@/app/actions/leads";
import { generalLeadSchema, type GeneralLeadInput } from "@/lib/validations/leads";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import type { ContactFormContent } from "./types";

export function ContactForm({ content }: { content: ContactFormContent }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GeneralLeadInput>({
    resolver: zodResolver(generalLeadSchema),
    defaultValues: { type: "general", name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: GeneralLeadInput) {
    setStatus("idle");
    const result = await submitLead(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="py-16">
      <Container className="max-w-xl">
        <Reveal>
          {content.heading && (
            <h2 className="text-center font-display text-3xl text-ink">{content.heading}</h2>
          )}
          {content.body && <p className="mt-3 text-center text-ink/70">{content.body}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <input
                {...register("name")}
                placeholder="Full name"
                className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && <p className="mt-1 text-xs text-red">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder="Phone (optional)"
                className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <textarea
                {...register("message")}
                placeholder="Message"
                rows={4}
                className="w-full rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.message && <p className="mt-1 text-xs text-red">{errors.message.message}</p>}
            </div>

            {status === "success" && (
              <p className="rounded-lg bg-primary/10 px-4 py-2.5 text-sm text-primary-dark">
                Thanks — we&apos;ve received your message and will get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-lg bg-red/10 px-4 py-2.5 text-sm text-red">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "@/app/actions/leads";
import { generalLeadSchema, type GeneralLeadInput } from "@/lib/validations/leads";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import type { ContactFormContent } from "./types";

const inputClass =
  "w-full rounded-xl bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-primary";

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
    <section className="py-20 sm:py-28">
      <Container className="max-w-xl">
        <Reveal>
          {content.heading && (
            <div className="text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
                Contact
              </p>
              <h2 className="h2 text-ink">{renderHeading(content.heading)}</h2>
            </div>
          )}
          {content.body && <p className="mt-4 text-center text-ink-soft">{content.body}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <input {...register("name")} placeholder="Full name" className={inputClass} />
              {errors.name && <p className="mt-1 text-xs text-red">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register("email")} placeholder="Email" className={inputClass} />
              {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register("phone")} placeholder="Phone (optional)" className={inputClass} />
            </div>
            <div>
              <textarea {...register("message")} placeholder="Message" rows={4} className={inputClass} />
              {errors.message && <p className="mt-1 text-xs text-red">{errors.message.message}</p>}
            </div>

            {status === "success" && (
              <p className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm text-primary-dark">
                Thanks — we&apos;ve received your message and will get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-xl bg-red/10 px-4 py-2.5 text-sm text-red">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary py-3.5 font-normal text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}

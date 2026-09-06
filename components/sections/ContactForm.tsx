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
  "w-full border-b border-white/30 bg-transparent px-1 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-lime";

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
    <section className="bg-primary py-20 sm:py-28">
      <Container>
        <Reveal>
          {content.heading && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-lime">
              Send Us a Message
            </p>
          )}
          {content.heading && <h2 className="h2 max-w-xl text-white">{renderHeading(content.heading, "text-lime")}</h2>}
          {content.body && <p className="mt-4 max-w-xl text-white/75">{content.body}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <input {...register("name")} placeholder="Full Name" className={inputClass} />
                {errors.name && <p className="mt-1 text-xs text-lime">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register("email")} placeholder="Email" className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-lime">{errors.email.message}</p>}
              </div>
              <div>
                <input {...register("phone")} placeholder="Phone" className={inputClass} />
              </div>
            </div>
            <div>
              <textarea {...register("message")} placeholder="Message" rows={3} className={inputClass} />
              {errors.message && <p className="mt-1 text-xs text-lime">{errors.message.message}</p>}
            </div>

            {status === "success" && (
              <p className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-lime">
                Thanks — we&apos;ve received your message and will get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-red">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-lime px-8 py-3 font-normal text-lime-text transition-colors hover:brightness-95 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}

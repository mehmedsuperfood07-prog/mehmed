"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "@/app/actions/leads";
import { generalLeadSchema, type GeneralLeadInput } from "@/lib/validations/leads";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { renderHeading } from "./Accent";
import { Button } from "./Button";
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

  const hasSide =
    content.side_heading || content.side_body || (content.side_items && content.side_items.length > 0);

  return (
    <section className="overflow-hidden rounded-[2.5rem] bg-primary py-20 sm:py-28">
      <Container>
        <div className={hasSide ? "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16" : ""}>
          <Reveal>
            {content.heading && (
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-lime">Send Us a Message</p>
            )}
            {content.heading && <h2 className="h2 max-w-xl text-white">{renderHeading(content.heading, "text-lime")}</h2>}
            {content.body && <p className="mt-4 max-w-xl text-white/75">{content.body}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <input {...register("name")} placeholder="Full Name" className={inputClass} />
                  {errors.name && <p className="mt-1 text-xs text-lime">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register("email")} placeholder="Email" className={inputClass} />
                  {errors.email && <p className="mt-1 text-xs text-lime">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <input {...register("phone")} placeholder="Phone" className={inputClass} />
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

          {hasSide && (
            <Reveal delay={0.1} className="flex">
              <div className="flex w-full flex-col justify-center rounded-[2rem] bg-lime p-8 text-lime-text sm:p-10">
                {content.side_heading && (
                  <h3 className="text-3xl leading-tight tracking-tight sm:text-4xl">
                    {renderHeading(content.side_heading, "text-primary")}
                  </h3>
                )}
                {content.side_body && <p className="mt-4 text-lime-text/80">{content.side_body}</p>}
                {content.side_items && content.side_items.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {content.side_items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-white">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {content.side_cta_label && content.side_cta_href && (
                  <div className="mt-8">
                    <Button href={content.side_cta_href} variant="solid">
                      {content.side_cta_label}
                    </Button>
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

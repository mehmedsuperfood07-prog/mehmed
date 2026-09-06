"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "@/app/actions/leads";
import { quoteLeadSchema, BUSINESS_TYPES, type QuoteLeadInput } from "@/lib/validations/leads";

const inputClass =
  "w-full rounded-xl bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-primary";

export function QuoteFormFields({ categories }: { categories: string[] }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteLeadInput>({
    resolver: zodResolver(quoteLeadSchema),
    defaultValues: {
      type: "quote",
      name: "",
      business_name: "",
      phone: "",
      email: "",
      city: "",
      business_type: "",
      products_interested: [],
      message: "",
    },
  });

  async function onSubmit(values: QuoteLeadInput) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input {...register("business_name")} placeholder="Business name" className={inputClass} />
          {errors.business_name && (
            <p className="mt-1 text-xs text-red">{errors.business_name.message}</p>
          )}
        </div>
        <div>
          <input {...register("name")} placeholder="Contact person" className={inputClass} />
          {errors.name && <p className="mt-1 text-xs text-red">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register("phone")} placeholder="Phone" className={inputClass} />
          {errors.phone && <p className="mt-1 text-xs text-red">{errors.phone.message}</p>}
        </div>
        <div>
          <input {...register("email")} placeholder="Email (optional)" className={inputClass} />
          {errors.email && <p className="mt-1 text-xs text-red">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register("city")} placeholder="City / area" className={inputClass} />
          {errors.city && <p className="mt-1 text-xs text-red">{errors.city.message}</p>}
        </div>
        <div>
          <select {...register("business_type")} className={inputClass} defaultValue="">
            <option value="" disabled>
              Business type
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.business_type && (
            <p className="mt-1 text-xs text-red">{errors.business_type.message}</p>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Products interested in</p>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-ink-soft">
                <input type="checkbox" value={category} {...register("products_interested")} />
                {category}
              </label>
            ))}
          </div>
        </div>
      )}

      <textarea
        {...register("message")}
        placeholder="Estimated monthly quantity, delivery notes, or anything else"
        rows={3}
        className={inputClass}
      />

      {status === "success" && (
        <p className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm text-primary-dark">
          Thanks — your quote request has been received. We&apos;ll be in touch soon.
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
        className="rounded-full bg-primary px-8 py-3 font-normal text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Request A Quote"}
      </button>
    </form>
  );
}

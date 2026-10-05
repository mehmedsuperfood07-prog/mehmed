"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "@/app/actions/leads";
import {
  rationPackLeadSchema,
  RATION_FREQUENCIES,
  RATION_ITEMS,
  RATION_ORG_TYPES,
  type RationPackLeadInput,
} from "@/lib/validations/leads";

const inputClass =
  "w-full rounded-xl bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-primary";

export function RationPackFormFields() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RationPackLeadInput>({
    resolver: zodResolver(rationPackLeadSchema),
    defaultValues: {
      type: "ration_pack",
      business_name: "",
      name: "",
      phone: "",
      email: "",
      city: "",
      business_type: "",
      packs_per_month: "",
      frequency: RATION_FREQUENCIES[0],
      delivery_location: "",
      products_interested: [],
      message: "",
    },
  });

  async function onSubmit(values: RationPackLeadInput) {
    setStatus("idle");
    const result = await submitLead(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  const error = (message?: string) => message && <p className="mt-1 text-xs text-red">{message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input {...register("business_name")} placeholder="Organization name" className={inputClass} />
          {error(errors.business_name?.message)}
        </div>
        <div>
          <select {...register("business_type")} className={inputClass} defaultValue="">
            <option value="" disabled>
              Organization type
            </option>
            {RATION_ORG_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {error(errors.business_type?.message)}
        </div>
        <div>
          <input {...register("name")} placeholder="Contact person" className={inputClass} />
          {error(errors.name?.message)}
        </div>
        <div>
          <input {...register("phone")} placeholder="Phone" className={inputClass} />
          {error(errors.phone?.message)}
        </div>
        <div>
          <input {...register("email")} placeholder="Email (optional)" className={inputClass} />
          {error(errors.email?.message)}
        </div>
        <div>
          <input {...register("city")} placeholder="City" className={inputClass} />
          {error(errors.city?.message)}
        </div>
        <div>
          <input
            {...register("packs_per_month")}
            inputMode="numeric"
            placeholder="Number of packs needed"
            className={inputClass}
          />
          {error(errors.packs_per_month?.message)}
        </div>
        <div>
          <select {...register("frequency")} className={inputClass}>
            {RATION_FREQUENCIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error(errors.frequency?.message)}
        </div>
      </div>

      <div>
        <input
          {...register("delivery_location")}
          placeholder="Delivery location (warehouse or distribution site, city)"
          className={inputClass}
        />
        {error(errors.delivery_location?.message)}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Items you want in each pack</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {RATION_ITEMS.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" value={item} {...register("products_interested")} />
              {item}
            </label>
          ))}
        </div>
      </div>

      <textarea
        {...register("message")}
        placeholder="Quantity of each item per pack, special requirements, or anything else"
        rows={3}
        className={inputClass}
      />

      {status === "success" && (
        <p className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm text-primary-dark">
          Thank you — your ration pack request has been received. Our team will contact you to confirm the
          pack list and quotation.
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
        {isSubmitting ? "Sending..." : "Request Ration Packs"}
      </button>
    </form>
  );
}

import { z } from "zod";

export const generalLeadSchema = z.object({
  type: z.literal("general"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const quoteLeadSchema = z.object({
  type: z.literal("quote"),
  name: z.string().min(1, "Contact person is required"),
  business_name: z.string().min(1, "Business name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().min(1, "City / area is required"),
  business_type: z.string().min(1, "Select a business type"),
  products_interested: z.array(z.string()),
  message: z.string().optional(),
});

export const leadInputSchema = z.discriminatedUnion("type", [generalLeadSchema, quoteLeadSchema]);

export type GeneralLeadInput = z.infer<typeof generalLeadSchema>;
export type QuoteLeadInput = z.infer<typeof quoteLeadSchema>;
export type LeadInput = z.infer<typeof leadInputSchema>;

export const BUSINESS_TYPES = [
  "General Store",
  "Departmental Store",
  "Bakery",
  "Factory / Staff Meal Program",
  "Other",
];

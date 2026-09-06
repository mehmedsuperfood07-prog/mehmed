import { createClient } from "@/lib/supabase/server";
import { TestimonialManager } from "./testimonial-manager";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Testimonials</h1>
        <p className="mt-1 text-sm text-ink/60">Manage the quotes shown in the testimonial slider.</p>
      </div>
      <TestimonialManager testimonials={testimonials ?? []} />
    </div>
  );
}

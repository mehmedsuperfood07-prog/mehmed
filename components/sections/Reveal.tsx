"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Shared scroll-reveal used by every section renderer -- see PLAN.md 5.3
// ("section headings and cards fade + slide up on scroll into view").
// Bespoke motion (counters, carousels) lives in the individual sections;
// this just gives every section the same baseline entrance for free.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

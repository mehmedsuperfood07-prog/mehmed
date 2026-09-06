"use client";

import { useTransition } from "react";
import { updateLeadStatus, type LeadStatus } from "./actions";

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(event) => {
        const next = event.target.value as LeadStatus;
        startTransition(() => updateLeadStatus(id, next));
      }}
      className="rounded-lg border border-black/10 bg-surface px-2 py-1 text-xs capitalize text-ink disabled:opacity-60"
    >
      {STATUSES.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

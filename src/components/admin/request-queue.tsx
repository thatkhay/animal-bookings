"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Inbox, X } from "lucide-react";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { findService, findZone, petVaccineStatus } from "@/lib/api";
import { formatDate, formatTime, weekdayOf } from "@/lib/schedule";
import type { Booking, Client, Pet } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RequestQueue({
  bookings,
  clients,
  pets,
  compact,
}: {
  bookings: Booking[];
  clients: Client[];
  pets: Pet[];
  compact?: boolean;
}) {
  const [queue, setQueue] = useState(bookings);
  const [resolved, setResolved] = useState<{ id: string; action: "approved" | "declined" }[]>([]);

  const resolve = (id: string, action: "approved" | "declined") => {
    setQueue((q) => q.filter((b) => b.id !== id));
    setResolved((r) => [{ id, action }, ...r]);
  };

  return (
    <div>
      {queue.length === 0 && (
        <div className="grid place-items-center rounded-2xl bg-ink-100/60 py-10 text-center">
          <Inbox className="size-6 text-ink-400" />
          <p className="mt-2 font-semibold">All caught up</p>
          <p className="text-sm text-ink-500">{resolved.length} handled this session</p>
        </div>
      )}
      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {queue.map((b) => {
            const client = clients.find((c) => c.id === b.clientId)!;
            const zone = findZone(b.zoneId)!;
            const svc = findService(b.serviceId)!;
            const bPets = pets.filter((p) => b.petIds.includes(p.id));
            const onLane = zone.laneDays.includes(weekdayOf(b.date));
            const vaxIssue = bPets.some((p) => petVaccineStatus(p) !== "valid");
            return (
              <motion.li
                key={b.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                className="rounded-2xl bg-white p-4 ring-1 ring-ink-200"
              >
                <div className="flex items-start gap-3">
                  <PetAvatar pet={bPets[0]} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="font-semibold">
                        {bPets.map((p) => p.name).join(" & ")} <span className="font-normal text-ink-500">· {client.name}</span>
                      </p>
                      <p className="font-mono text-xs text-ink-400">{b.ref}</p>
                    </div>
                    <p className="text-sm text-ink-600">
                      {svc.name} · {formatDate(b.date, "day")}, {formatTime(b.time)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Tag tone={onLane ? "ok" : "warn"}>
                        {zone.code} {onLane ? "lane day" : "off-lane"}
                      </Tag>
                      {vaxIssue && <Tag tone="warn">Vaccine check</Tag>}
                      {svc.id === "puppy-social" && <Tag tone="info">Trainer needed</Tag>}
                    </div>
                    {b.note && !compact && <p className="mt-2 text-sm text-ink-500 italic">“{b.note}”</p>}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => resolve(b.id, "approved")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    <Check className="size-4" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => resolve(b.id, "declined")}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-ink-600 ring-1 ring-ink-200 hover:bg-ink-100"
                  >
                    <X className="size-4" /> Decline
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Tag({ tone, children }: { tone: "ok" | "warn" | "info"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 font-mono text-[10.5px] tracking-wide uppercase",
        tone === "ok" && "bg-teal-50 text-teal-800",
        tone === "warn" && "bg-amber-50 text-amber-800",
        tone === "info" && "bg-ink-100 text-ink-700",
      )}
    >
      {children}
    </span>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, SkipForward } from "lucide-react";
import { PetStack } from "@/components/shared/pet-avatar";
import { BookingStatusBadge } from "@/components/shared/status";
import { findService } from "@/lib/api";
import { arrivalWindow, formatDate, relativeDay } from "@/lib/schedule";
import type { Booking, Pet } from "@/lib/types";
import { cn } from "@/lib/utils";

export function UpcomingList({ bookings, pets }: { bookings: Booking[]; pets: Pet[] }) {
  const [skipped, setSkipped] = useState<string[]>([]);

  return (
    <ul className="divide-y divide-mint-200">
      {bookings.map((b) => {
        const svc = findService(b.serviceId)!;
        const isSkipped = skipped.includes(b.id);
        const bookingPets = pets.filter((p) => b.petIds.includes(p.id));
        return (
          <li key={b.id} className="flex items-center gap-4 py-3.5">
            <div
              className={cn(
                "grid w-14 shrink-0 place-items-center rounded-xl py-2 text-center transition-opacity",
                relativeDay(b.date) === "Tomorrow" ? "bg-coral-100" : "bg-mint-100",
                isSkipped && "opacity-40",
              )}
            >
              <span className="font-mono text-[10px] text-ink-500 uppercase">{formatDate(b.date, "weekday")}</span>
              <span className="font-display text-2xl leading-none font-bold">{b.date.slice(8)}</span>
            </div>
            <div className={cn("min-w-0 flex-1 transition-opacity", isSkipped && "opacity-40")}>
              <p className={cn("truncate font-semibold", isSkipped && "line-through")}>{svc.name}</p>
              <p className="truncate text-sm text-ink-500">
                {relativeDay(b.date)} · {arrivalWindow(b.time)}
              </p>
            </div>
            <div className="hidden sm:block">
              <PetStack pets={bookingPets} size={28} />
            </div>
            <div className="hidden w-32 justify-end md:flex">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={isSkipped ? "s" : "n"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isSkipped ? (
                    <span className="text-xs font-medium text-ink-500">Skipped · no charge</span>
                  ) : (
                    <BookingStatusBadge status={b.status} short />
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
            {b.subscriptionId && (
              <button
                type="button"
                onClick={() => setSkipped((s) => (isSkipped ? s.filter((x) => x !== b.id) : [...s, b.id]))}
                className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-mint-100 hover:text-ink-900"
                aria-label={isSkipped ? "Undo skip" : "Skip this visit"}
                title={isSkipped ? "Undo skip" : "Skip this visit"}
              >
                {isSkipped ? <RotateCcw className="size-4" /> : <SkipForward className="size-4" />}
              </button>
            )}
            {!b.subscriptionId && <span className="size-9 shrink-0" />}
          </li>
        );
      })}
    </ul>
  );
}

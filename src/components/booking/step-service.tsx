"use client";

import Image from "next/image";
import { Check, Clock, Repeat, Users } from "lucide-react";
import type { Service } from "@/lib/types";
import { cn, money } from "@/lib/utils";
import { StepHeader, type StepProps } from "./booking-wizard";

export function StepService({ draft, update, services }: StepProps & { services: Service[] }) {
  return (
    <section>
      <StepHeader title="What does your pet need?">
        Pick a service. You can add pets and choose one-off or weekly visits in the next steps.
      </StepHeader>

      <div role="radiogroup" aria-label="Service" className="grid gap-3">
        {services.map((s) => {
          const selected = draft.serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() =>
                update({
                  serviceId: s.id,
                  mode: s.recurring ? draft.mode : "once",
                  petIds: draft.petIds.slice(0, s.capacity),
                  time: null,
                })
              }
              className={cn(
                "group flex items-stretch gap-3 rounded-2xl bg-white p-2.5 text-left ring-1 transition-all active:scale-[0.985] sm:gap-4",
                selected ? "ring-2 ring-teal-600 shadow-lift" : "ring-mint-200 hover:ring-ink-300",
              )}
            >
              <span className="relative w-20 shrink-0 overflow-hidden rounded-xl sm:w-28">
                <Image src={s.image} alt="" fill sizes="224px" className="object-cover" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col justify-center py-1.5 pr-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-[22px] leading-none font-bold uppercase sm:text-[26px]">{s.name}</span>
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full ring-1 transition-colors",
                      selected ? "bg-teal-600 text-white ring-teal-600" : "ring-mint-300",
                    )}
                  >
                    {selected && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                </span>
                <span className="mt-1.5 text-[15px] text-ink-500">{s.tagline}</span>
                <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-ink-400" /> {s.durationMin} min
                  </span>
                  {s.capacity > 1 && (
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-ink-400" /> Up to {s.capacity} pets
                    </span>
                  )}
                  {s.recurring && (
                    <span className="flex items-center gap-1.5">
                      <Repeat className="size-3.5 text-ink-400" /> Weekly plans
                    </span>
                  )}
                  <span className="ml-auto font-mono text-[13px] font-medium text-ink-900">
                    {s.price === 0 ? (
                      <span className="text-teal-700">Free</span>
                    ) : (
                      <>
                        {money(s.price)}
                        {s.laneDayDiscount > 0 && (
                          <span className="ml-1.5 text-teal-700">{money(s.price - s.laneDayDiscount)} lane day</span>
                        )}
                      </>
                    )}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

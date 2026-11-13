"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Pencil, Play, Plus, Sparkles, X } from "lucide-react";
import { PetStack } from "@/components/shared/pet-avatar";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { findService } from "@/lib/api";
import { planEstimate, recurringOpen } from "@/lib/booking";
import {
  addDays,
  daysLabel,
  diffDays,
  formatDate,
  formatTime,
  occurrences,
  TODAY,
  WEEK_ORDER,
  WEEKDAYS,
} from "@/lib/schedule";
import type { Pet, Subscription, Weekday, Zone } from "@/lib/types";
import { cn, money } from "@/lib/utils";

export function PlansManager({ initial, pets, zone }: { initial: Subscription[]; pets: Pet[]; zone: Zone }) {
  const [plans, setPlans] = useState(initial);
  const patch = (id: string, p: Partial<Subscription>) =>
    setPlans((list) => list.map((s) => (s.id === id ? { ...s, ...p } : s)));

  return (
    <div className="space-y-5">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          pets={pets.filter((p) => plan.petIds.includes(p.id))}
          zone={zone}
          onChange={(p) => patch(plan.id, p)}
          onCancel={() => setPlans((list) => list.filter((s) => s.id !== plan.id))}
        />
      ))}
      <ButtonLink
        href="/book"
        variant="outline"
        className="h-auto w-full justify-center rounded-3xl border-2 border-dashed border-mint-300 bg-transparent py-6 text-teal-800 hover:border-teal-600"
      >
        <Plus className="size-4" /> Start another weekly plan
      </ButtonLink>
    </div>
  );
}

function PlanCard({
  plan,
  pets,
  zone,
  onChange,
  onCancel,
}: {
  plan: Subscription;
  pets: Pet[];
  zone: Zone;
  onChange: (p: Partial<Subscription>) => void;
  onCancel: () => void;
}) {
  const service = findService(plan.serviceId)!;
  const [editing, setEditing] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [draftDays, setDraftDays] = useState<Weekday[]>(plan.days);
  const [draftTime, setDraftTime] = useState(plan.time);

  const paused = plan.status === "paused";
  const resumeFrom = paused && plan.pausedUntil ? plan.pausedUntil : addDays(TODAY, 1);
  const upcoming = occurrences({
    days: plan.days,
    startDate: diffDays(resumeFrom, TODAY) > 0 ? resumeFrom : addDays(TODAY, 1),
    frequency: plan.frequency,
    count: 5,
  });
  const est = planEstimate({ service, zone, petCount: pets.length, days: plan.days, frequency: plan.frequency });

  return (
    <article className={cn("overflow-hidden rounded-3xl bg-white ring-1 transition-colors", paused ? "ring-mint-200" : "ring-mint-200")}>
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative h-36 md:h-auto">
          <Image src={service.image} alt="" fill sizes="220px" className={cn("object-cover", paused && "grayscale")} />
          <div className="absolute inset-0 bg-linear-to-t from-ink-950/60 to-transparent md:bg-linear-to-r" />
          <div className="absolute bottom-3 left-3">
            <PetStack pets={pets} size={40} />
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {paused ? (
                  <Badge tone="amber" dot>
                    Paused until {plan.pausedUntil ? formatDate(plan.pausedUntil) : "you resume"}
                  </Badge>
                ) : (
                  <Badge tone="teal" dot>
                    Active
                  </Badge>
                )}
                <span className="font-mono text-xs text-ink-400">since {formatDate(plan.startDate, "month")}</span>
              </div>
              <h2 className="mt-3 font-display text-3xl leading-none font-bold uppercase sm:text-4xl">
                {service.name}
              </h2>
              <p className="mt-1.5 text-ink-500">
                {pets.map((p) => p.name).join(" & ")} · {plan.frequency === "weekly" ? "Every" : "Every other"}{" "}
                {daysLabel(plan.days)} at {formatTime(plan.time)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl leading-none font-bold">{money(est.monthly)}</p>
              <p className="text-xs text-ink-500">per month · {est.visits} visits</p>
            </div>
          </div>

          <AnimatePresence initial={false} mode="wait">
            {editing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 rounded-2xl bg-mint-50 p-4">
                  <p className="text-sm font-semibold">Days</p>
                  <div className="mt-2 grid grid-cols-6 gap-1.5">
                    {WEEK_ORDER.filter((d) => d !== 0).map((d) => {
                      const on = draftDays.includes(d);
                      const lane = zone.laneDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setDraftDays(on ? draftDays.filter((x) => x !== d) : [...draftDays, d])}
                          className={cn(
                            "rounded-xl py-2.5 text-center ring-1 transition-colors",
                            on ? "bg-ink-900 text-white ring-ink-900" : lane ? "bg-teal-50 ring-teal-600/30" : "bg-white ring-mint-200",
                          )}
                        >
                          <span className="block text-sm font-semibold">{WEEKDAYS[d]}</span>
                          {lane && <span className={cn("block font-mono text-[9px] uppercase", on ? "text-teal-300" : "text-teal-700")}>Lane</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm font-semibold">Time</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {service.slots.map((t) => {
                      const open = draftDays.every((d) => recurringOpen(service, d, t)) || t === plan.time;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={!open}
                          onClick={() => setDraftTime(t)}
                          className={cn(
                            "rounded-xl px-3.5 py-2 text-sm font-semibold ring-1 transition-colors",
                            draftTime === t ? "bg-coral-400 ring-coral-400" : "bg-white ring-mint-200",
                            !open && "opacity-40",
                          )}
                        >
                          {formatTime(t)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="dark"
                      size="sm"
                      disabled={!draftDays.length}
                      onClick={() => {
                        onChange({ days: draftDays, time: draftTime });
                        setEditing(false);
                      }}
                    >
                      Save changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mt-6 font-mono text-[10.5px] tracking-[0.16em] text-ink-400 uppercase">
                  {paused ? "Resumes with" : "Next visits"}
                </p>
                <ol className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
                  {upcoming.map((d, i) => (
                    <li
                      key={d}
                      className={cn(
                        "shrink-0 rounded-xl px-3 py-2 ring-1",
                        i === 0 && !paused ? "bg-ink-900 text-white ring-ink-900" : "bg-mint-50 ring-mint-200",
                      )}
                    >
                      <span className="block font-mono text-[10px] uppercase opacity-60">{formatDate(d, "weekday")}</span>
                      <span className="block text-sm font-semibold">{formatDate(d)}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>

          {est.saved > 0 && !editing && (
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-teal-700">
              <Sparkles className="size-3.5" /> Lane-day pricing saves {money(est.saved)} a month on this plan.
            </p>
          )}

          <AnimatePresence>
            {pausing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-600/20">
                  <span className="mr-1 text-sm font-medium text-amber-900">Pause for</span>
                  {[1, 2, 4].map((w) => (
                    <Button
                      key={w}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onChange({ status: "paused", pausedUntil: addDays(TODAY, w * 7) });
                        setPausing(false);
                      }}
                    >
                      {w} week{w > 1 ? "s" : ""}
                    </Button>
                  ))}
                  <button type="button" onClick={() => setPausing(false)} className="ml-auto grid size-8 place-items-center rounded-lg text-amber-900 hover:bg-amber-100" aria-label="Close">
                    <X className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!editing && (
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-mint-200 pt-5">
              {paused ? (
                <Button variant="teal" size="sm" onClick={() => onChange({ status: "active", pausedUntil: undefined })}>
                  <Play className="size-4" /> Resume now
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setPausing((p) => !p)}>
                  <Pause className="size-4" /> Pause
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDraftDays(plan.days);
                  setDraftTime(plan.time);
                  setEditing(true);
                }}
              >
                <Pencil className="size-4" /> Change days or time
              </Button>
              <div className="ml-auto">
                {confirmCancel ? (
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-ink-500">End this plan?</span>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmCancel(false)}>
                      Keep
                    </Button>
                    <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={onCancel}>
                      End plan
                    </Button>
                  </span>
                ) : (
                  <Button variant="ghost" size="sm" className="text-ink-500 hover:text-red-700" onClick={() => setConfirmCancel(true)}>
                    End plan
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

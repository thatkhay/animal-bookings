"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, MapPinned, Route } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui/field";
import { zoneForPostalCode } from "@/lib/api";
import { daysLabel, WEEK_ORDER, WEEKDAYS } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import { StepHeader, type StepProps } from "./booking-wizard";

export function StepAddress({ draft, update }: StepProps) {
  const zone = zoneForPostalCode(draft.postalCode);
  const complete = draft.postalCode.length === 5;

  return (
    <section>
      <StepHeader title="Where are we headed?">
        Your ZIP code puts you on a lane. Visits on your lane day are cheaper because your walker is already nearby.
      </StepHeader>

      <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
        <Field label="ZIP code">
          <Input
            value={draft.postalCode}
            onChange={(e) => update({ postalCode: e.target.value.replace(/\D/g, "").slice(0, 5) })}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="40211"
            className="font-mono text-lg tracking-widest"
          />
        </Field>
        <Field label="Street address">
          <Input
            value={draft.street}
            onChange={(e) => update({ street: e.target.value })}
            autoComplete="street-address"
            placeholder="218 Linden Ave, Apt 2"
          />
        </Field>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {complete && zone && (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 overflow-hidden rounded-2xl bg-ink-900 text-white"
          >
            <div className="bg-grid flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
              <span
                className="grid size-14 shrink-0 place-items-center rounded-2xl font-mono text-lg font-medium"
                style={{ background: `${zone.color}22`, color: zone.color, boxShadow: `inset 0 0 0 1px ${zone.color}55` }}
              >
                {zone.code}
              </span>
              <div className="flex-1">
                <p className="font-mono text-[11px] tracking-[0.16em] text-white/50 uppercase">You&apos;re on the</p>
                <p className="font-display text-3xl leading-none font-bold uppercase">{zone.name} lane</p>
                <p className="mt-2 text-sm text-white/65">
                  {zone.walker.name} covers your street on {daysLabel(zone.laneDays)}.
                </p>
              </div>
              <div className="flex gap-1">
                {WEEK_ORDER.slice(0, 6).map((d) => (
                  <span
                    key={d}
                    className={cn(
                      "grid h-10 w-8 place-items-center rounded-lg font-mono text-[11px]",
                      zone.laneDays.includes(d) ? "text-ink-950" : "bg-white/5 text-white/35",
                    )}
                    style={zone.laneDays.includes(d) ? { background: zone.color } : undefined}
                  >
                    {WEEKDAYS[d].slice(0, 2)}
                  </span>
                ))}
              </div>
            </div>
            <p className="flex items-center gap-2 border-t border-white/10 px-6 py-3 text-xs text-white/55">
              <Route className="size-3.5 text-teal-300" />
              Grouping your visits with {zone.name} neighbors saves about 20 minutes of driving per visit.
            </p>
          </motion.div>
        )}
        {complete && !zone && (
          <motion.div
            key="none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex gap-3 rounded-2xl bg-coral-50 p-5 text-coral-700 ring-1 ring-coral-200"
          >
            <CircleAlert className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">We don&apos;t cover {draft.postalCode} yet.</p>
              <p className="mt-1 text-sm text-coral-700/80">
                We&apos;re adding lanes as neighborhoods fill up. For this demo, try 40211 (Northside), 40220
                (Riverbend) or 40260 (Eastgate).
              </p>
            </div>
          </motion.div>
        )}
        {!complete && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-2 text-sm text-ink-500"
          >
            <MapPinned className="size-4 text-teal-700" /> Enter a 5-digit ZIP to find your lane.
          </motion.p>
        )}
      </AnimatePresence>

      <Field
        label="Access notes"
        optional
        className="mt-6"
        hint="Gate codes, where the key is, parking, building rules. Only your walker sees this."
      >
        <Textarea
          value={draft.access}
          onChange={(e) => update({ access: e.target.value })}
          placeholder="Lockbox on the side gate, code 4417. Park on Elm, not Linden."
          rows={3}
        />
      </Field>
    </section>
  );
}

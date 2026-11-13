"use client";

import { useEffect } from "react";
import { CalendarDays, Info, Repeat, Sparkles } from "lucide-react";
import { isClosed, isLaneDay, nextVisits, planEstimate, recurringOpen, spotsLeft, visitPrice } from "@/lib/booking";
import {
  addDays,
  arrivalWindow,
  daysLabel,
  diffDays,
  formatDate,
  formatTime,
  occurrences,
  TODAY,
  WEEK_ORDER,
  WEEKDAYS,
  WEEKDAYS_LONG,
  weekdayOf,
} from "@/lib/schedule";
import type { Service, Weekday, Zone } from "@/lib/types";
import { cn, money } from "@/lib/utils";
import { StepHeader, type StepProps } from "./booking-wizard";
import { Calendar } from "./calendar";

export function StepSchedule({ draft, update, service, zone }: StepProps & { service: Service; zone?: Zone }) {
  const mode = service.recurring ? draft.mode : "once";

  return (
    <section>
      <StepHeader title="When works best?">
        {zone
          ? `${zone.name} lane days are ${daysLabel(zone.laneDays)} — they're marked in teal and cost less.`
          : "Pick a day and time."}
      </StepHeader>

      {service.recurring && (
        <div className="mb-7 grid grid-cols-2 gap-1 rounded-2xl bg-mint-100 p-1 sm:inline-grid sm:w-auto" role="radiogroup">
          {(
            [
              { id: "recurring", label: "Weekly plan", icon: Repeat },
              { id: "once", label: "One visit", icon: CalendarDays },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => update({ mode: m.id, time: null })}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[15px] font-semibold transition-all",
                mode === m.id ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900",
              )}
            >
              <m.icon className="size-4" /> {m.label}
            </button>
          ))}
        </div>
      )}

      {mode === "once" ? (
        <OnceScheduler draft={draft} update={update} service={service} zone={zone} />
      ) : (
        <RecurringScheduler draft={draft} update={update} service={service} zone={zone} />
      )}
    </section>
  );
}

function OnceScheduler({ draft, update, service, zone }: StepProps & { service: Service; zone?: Zone }) {
  const date = draft.date && diffDays(draft.date, TODAY) > 0 ? draft.date : null;
  const laneDay = date ? isLaneDay(zone, date) : false;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div>
        <Calendar
          value={date}
          onChange={(iso) => update({ date: iso, time: null })}
          isDisabled={(iso) => diffDays(iso, TODAY) <= 0 || isClosed(iso) || diffDays(iso, TODAY) > 75}
          isHighlighted={(iso) => isLaneDay(zone, iso)}
        />
        <Legend />
      </div>

      <div>
        {date ? (
          <>
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">{formatDate(date, "long")}</p>
              {laneDay && service.laneDayDiscount > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-teal-700">
                  <Sparkles className="size-3.5" /> Lane day · {money(service.laneDayDiscount)} off
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {service.slots.map((t) => {
                const left = spotsLeft(service, date, t);
                const selected = draft.time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={left === 0}
                    onClick={() => update({ time: t })}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-xl px-4 py-3 text-left ring-1 transition-all",
                      selected ? "bg-ink-900 text-white ring-ink-900" : "bg-white ring-mint-200 hover:ring-ink-300",
                      left === 0 && "cursor-not-allowed bg-mint-50 opacity-55 hover:ring-mint-200",
                    )}
                  >
                    <span className="block text-[17px] font-semibold">{formatTime(t)}</span>
                    <span className={cn("mt-0.5 block text-xs", selected ? "text-white/60" : "text-ink-500")}>
                      {left === 0
                        ? "Full"
                        : service.capacity > 1
                          ? `${left} of ${service.capacity} spots left`
                          : "Available"}
                    </span>
                  </button>
                );
              })}
            </div>
            {draft.time && (
              <p className="mt-4 flex gap-2 rounded-xl bg-mint-100 p-3 text-sm text-ink-600">
                <Info className="mt-0.5 size-4 shrink-0 text-teal-700" />
                Your walker arrives between {arrivalWindow(draft.time)}. We&apos;ll text when they&apos;re 10 minutes
                out.
              </p>
            )}
          </>
        ) : (
          <div className="grid h-full min-h-48 place-items-center rounded-2xl border-2 border-dashed border-mint-300 p-6 text-center text-sm text-ink-500">
            Choose a date to see open times.
          </div>
        )}
      </div>
    </div>
  );
}

function RecurringScheduler({ draft, update, service, zone }: StepProps & { service: Service; zone?: Zone }) {
  const petCount = Math.max(1, draft.petIds.length);
  const estimate = planEstimate({ service, zone, petCount, days: draft.days, frequency: draft.frequency });
  const startOptions = draft.days.length
    ? occurrences({ days: draft.days, startDate: addDays(TODAY, 1), frequency: "weekly", count: 8 })
    : [];
  const offLaneDays = draft.days.filter((d) => zone && !zone.laneDays.includes(d));

  useEffect(() => {
    if (startOptions.length && (!draft.startDate || !startOptions.includes(draft.startDate))) {
      update({ startDate: startOptions[0] });
    }
    if (!startOptions.length && draft.startDate) update({ startDate: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.days.join(",")]);

  const toggleDay = (d: Weekday) =>
    update({ days: draft.days.includes(d) ? draft.days.filter((x) => x !== d) : [...draft.days, d] });

  const visits = nextVisits({ ...draft, mode: "recurring" }, 6);

  return (
    <div className="space-y-8">
      <div>
        <Label n="A">Which days?</Label>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {WEEK_ORDER.filter((d) => d !== 0).map((d) => {
            const on = draft.days.includes(d);
            const lane = zone?.laneDays.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                aria-pressed={on}
                aria-label={`${WEEKDAYS_LONG[d]}${lane ? ", lane day" : ""}`}
                className={cn(
                  "relative flex h-20 flex-col items-center justify-center rounded-2xl ring-1 transition-all",
                  on
                    ? "bg-ink-900 text-white ring-ink-900"
                    : lane
                      ? "bg-teal-50 text-teal-900 ring-teal-600/30 hover:ring-teal-600"
                      : "bg-white ring-mint-200 hover:ring-ink-300",
                )}
              >
                <span className="font-display text-2xl font-bold uppercase">{WEEKDAYS[d]}</span>
                {lane && (
                  <span
                    className={cn(
                      "mt-0.5 font-mono text-[9px] tracking-[0.14em] uppercase",
                      on ? "text-teal-300" : "text-teal-700",
                    )}
                  >
                    Lane
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {offLaneDays.length > 0 && service.laneDayDiscount > 0 && (
          <p className="mt-3 flex gap-2 text-sm text-ink-500">
            <Info className="mt-0.5 size-4 shrink-0 text-coral-500" />
            {offLaneDays.map((d) => WEEKDAYS_LONG[d]).join(" & ")} {offLaneDays.length > 1 ? "aren't" : "isn't"}{" "}
            {zone?.name} lane {offLaneDays.length > 1 ? "days" : "a lane day"}, so those visits are{" "}
            {money(visitPrice(service, petCount, false))} instead of {money(visitPrice(service, petCount, true))}.
          </p>
        )}
      </div>

      <div>
        <Label n="B">What time?</Label>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {service.slots.map((t) => {
            const open = draft.days.length === 0 || draft.days.every((d) => recurringOpen(service, d, t));
            const selected = draft.time === t;
            return (
              <button
                key={t}
                type="button"
                disabled={!open}
                onClick={() => update({ time: t })}
                aria-pressed={selected}
                className={cn(
                  "rounded-xl py-3 text-center ring-1 transition-all",
                  selected ? "bg-coral-400 text-ink-900 ring-coral-400" : "bg-white ring-mint-200 hover:ring-ink-300",
                  !open && "cursor-not-allowed bg-mint-50 opacity-50 hover:ring-mint-200",
                )}
              >
                <span className="block font-semibold">{formatTime(t)}</span>
                <span className={cn("block text-[11px]", selected ? "text-ink-900/60" : "text-ink-400")}>
                  {open ? "Open" : "Waitlist"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <Label n="C">How often?</Label>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-mint-100 p-1">
            {(["weekly", "biweekly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => update({ frequency: f })}
                aria-pressed={draft.frequency === f}
                className={cn(
                  "rounded-lg py-2.5 text-sm font-semibold transition-all",
                  draft.frequency === f ? "bg-white shadow-soft" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {f === "weekly" ? "Every week" : "Every 2 weeks"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label n="D">Starting</Label>
          <div className="no-scrollbar mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {startOptions.length === 0 && <p className="py-2.5 text-sm text-ink-400">Pick days first.</p>}
            {startOptions.slice(0, 6).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => update({ startDate: d })}
                aria-pressed={draft.startDate === d}
                className={cn(
                  "shrink-0 rounded-xl px-3.5 py-2 text-left ring-1 transition-all",
                  draft.startDate === d ? "bg-ink-900 text-white ring-ink-900" : "bg-white ring-mint-200 hover:ring-ink-300",
                )}
              >
                <span className="block font-mono text-[10px] uppercase opacity-60">{WEEKDAYS[weekdayOf(d)]}</span>
                <span className="block text-sm font-semibold">{formatDate(d)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {draft.days.length > 0 && draft.time && (
        <div className="overflow-hidden rounded-2xl bg-ink-900 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-teal-300 uppercase">Your plan</p>
              <p className="mt-1 font-display text-3xl leading-none font-bold uppercase">
                {draft.frequency === "weekly" ? "Every" : "Every other"} {daysLabel(draft.days)} · {formatTime(draft.time)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl leading-none font-bold">{money(estimate.monthly)}</p>
              <p className="text-xs text-white/55">≈ {estimate.visits} visits / month</p>
            </div>
          </div>
          <ol className="no-scrollbar flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-4 sm:px-6">
            {visits.map((v, i) => (
              <li
                key={v}
                className={cn(
                  "shrink-0 rounded-xl px-3 py-2 ring-1",
                  i === 0 ? "bg-coral-400 text-ink-900 ring-coral-400" : "bg-white/5 ring-white/10",
                )}
              >
                <span className="block font-mono text-[10px] uppercase opacity-70">{i === 0 ? "First" : `#${i + 1}`}</span>
                <span className="block text-sm font-semibold">{formatDate(v, "day")}</span>
              </li>
            ))}
            <li className="grid shrink-0 place-items-center px-2 text-sm text-white/40">…</li>
          </ol>
          {estimate.saved > 0 && (
            <p className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-xs text-white/60 sm:px-6">
              <Sparkles className="size-3.5 text-teal-300" /> Lane-day pricing saves you {money(estimate.saved)} a month.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[15px] font-semibold">
      <span className="grid size-6 place-items-center rounded-md bg-ink-900 font-mono text-[11px] text-white">{n}</span>
      {children}
    </p>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-1 text-xs text-ink-500">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded bg-teal-50 ring-1 ring-teal-600/30" /> Lane day
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded bg-ink-900" /> Selected
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded ring-1 ring-ink-300" /> Today
      </span>
      <span>Closed Sundays</span>
    </div>
  );
}

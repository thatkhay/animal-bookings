"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { RouteMap } from "@/components/shared/route-map";
import { Button } from "@/components/ui/button";
import type { OpsSnapshot } from "@/lib/api";
import { planDay } from "@/lib/routing";
import { addDays, diffDays, formatDate, formatTime, startOfWeek, weekdayOf, WEEKDAYS, WEEKDAYS_LONG } from "@/lib/schedule";
import type { Booking, Zone } from "@/lib/types";
import { cn, hash } from "@/lib/utils";

export function WeekPlanner({ data }: { data: OpsSnapshot }) {
  const { today, bookings, clients, zones, hub } = data;
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(today);
  const [moved, setMoved] = useState<string[]>([]);

  const weekStart = addDays(startOfWeek(today), weekOffset * 7);
  const days = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));
  const active = bookings.filter((b) => b.status !== "cancelled");

  const count = (zoneId: string, date: string) => active.filter((b) => b.zoneId === zoneId && b.date === date).length;
  const max = Math.max(1, ...zones.flatMap((z) => days.map((d) => count(z.id, d))));

  const dayPlan = useMemo(
    () => planDay({ bookings: active.filter((b) => b.date === selected), clients, zones, hub }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected],
  );

  const offLane = active
    .filter((b) => diffDays(b.date, today) > 0 && !moved.includes(b.id))
    .filter((b) => {
      const z = zones.find((z) => z.id === b.zoneId)!;
      return !z.laneDays.includes(weekdayOf(b.date));
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">Lane load</h2>
            <p className="text-sm text-ink-500">Visits per lane per day. Outlined cells are lane days.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w - 1)} disabled={weekOffset <= -1} aria-label="Previous week">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-36 text-center font-mono text-sm">
              {formatDate(days[0])} – {formatDate(days[5])}
            </span>
            <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w + 1)} disabled={weekOffset >= 2} aria-label="Next week">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-1.5 p-3.5">
            <thead>
              <tr>
                <th className="w-44" />
                {days.map((d) => (
                  <th key={d} className="p-0">
                    <button
                      type="button"
                      onClick={() => setSelected(d)}
                      className={cn(
                        "w-full rounded-xl px-2 py-2 text-center transition-colors",
                        selected === d ? "bg-ink-900 text-white" : "hover:bg-ink-100",
                      )}
                    >
                      <span className="block font-mono text-[10px] tracking-wider uppercase opacity-60">{WEEKDAYS[weekdayOf(d)]}</span>
                      <span className="block text-sm font-semibold">
                        {formatDate(d)}
                        {d === today && <span className="ml-1 text-coral-500">•</span>}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id}>
                  <th className="pr-2 text-left font-normal">
                    <span className="flex items-center gap-2.5">
                      <span className="h-6 w-1 rounded-full" style={{ background: z.color }} />
                      <span>
                        <span className="block text-sm font-semibold">{z.name}</span>
                        <span className="block font-mono text-[10.5px] text-ink-400">{z.walker.name}</span>
                      </span>
                    </span>
                  </th>
                  {days.map((d) => {
                    const n = count(z.id, d);
                    const lane = z.laneDays.includes(weekdayOf(d));
                    return (
                      <td key={d} className="p-0">
                        <button
                          type="button"
                          onClick={() => setSelected(d)}
                          className={cn(
                            "relative grid h-12 w-full place-items-center rounded-xl font-mono text-sm transition-transform hover:scale-[1.04]",
                            lane && "ring-2 ring-inset",
                            n === 0 && "text-ink-300",
                          )}
                          style={{
                            background: n ? `color-mix(in srgb, ${z.color} ${15 + (n / max) * 70}%, white)` : "var(--color-ink-100)",
                            ["--tw-ring-color" as string]: lane ? z.color : undefined,
                          }}
                        >
                          {n || "·"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl bg-ink-900 p-2 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-2">
            <p className="font-display text-2xl font-bold uppercase">{WEEKDAYS_LONG[weekdayOf(selected)]} routes</p>
            <p className="font-mono text-xs text-white/60">
              {dayPlan.totals.stops} stops · {dayPlan.totals.driveMin}m drive ·{" "}
              <span className="text-teal-300">−{dayPlan.totals.savedMin}m vs unclustered</span>
            </p>
          </div>
          <RouteMap
            zones={zones}
            hub={hub}
            routes={dayPlan.lanes.map((l) => ({
              id: l.zone.id,
              color: l.zone.color,
              points: [hub, ...l.stops.map((s) => s.point), hub],
            }))}
            stops={dayPlan.lanes.flatMap((l) =>
              l.stops.map((s) => ({ id: s.booking.id, x: s.point.x, y: s.point.y, color: l.zone.color })),
            )}
          />
          {dayPlan.lanes.length === 0 && <p className="px-4 pb-3 text-sm text-white/55">No visits scheduled.</p>}
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-ink-200">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
            <Lightbulb className="size-5 text-coral-500" /> Route suggestions
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Upcoming visits booked outside their lane&apos;s days. Moving them tightens routes.
          </p>
          <ul className="mt-4 space-y-2.5">
            {offLane.length === 0 && <li className="rounded-xl bg-ink-100/60 p-4 text-sm text-ink-500">Every upcoming visit is on its lane day.</li>}
            {offLane.map((b) => (
              <Suggestion
                key={b.id}
                booking={b}
                zone={zones.find((z) => z.id === b.zoneId)!}
                clientName={clients.find((c) => c.id === b.clientId)!.name}
                onApply={() => setMoved((m) => [...m, b.id])}
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Suggestion({ booking, zone, clientName, onApply }: { booking: Booking; zone: Zone; clientName: string; onApply: () => void }) {
  let target = booking.date;
  for (let i = 1; i <= 7; i++) {
    const d = addDays(booking.date, i);
    if (zone.laneDays.includes(weekdayOf(d))) {
      target = d;
      break;
    }
  }
  const before = addDays(booking.date, -1);
  const prevLane = zone.laneDays.includes(weekdayOf(before)) ? before : null;
  const best = prevLane ?? target;
  return (
    <li className="rounded-2xl p-3.5 ring-1 ring-ink-200">
      <p className="text-sm">
        <span className="font-semibold">{clientName}</span>{" "}
        <span className="text-ink-500">
          · {formatDate(booking.date, "day")} {formatTime(booking.time)}
        </span>
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 font-mono text-xs text-ink-600">
          {WEEKDAYS[weekdayOf(booking.date)]} <ArrowRight className="size-3" /> {WEEKDAYS[weekdayOf(best)]} {zone.code}
          <span className="text-teal-700">· ≈{12 + (hash(booking.id) % 14)}m saved</span>
        </p>
        <button type="button" onClick={onApply} className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink-800">
          Propose to client
        </button>
      </div>
    </li>
  );
}

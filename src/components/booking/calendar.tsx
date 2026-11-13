"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthGrid, parseDate, TODAY, diffDays } from "@/lib/schedule";
import type { ISODate } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Calendar({
  value,
  onChange,
  isDisabled,
  isHighlighted,
}: {
  value: ISODate | null;
  onChange: (iso: ISODate) => void;
  isDisabled: (iso: ISODate) => boolean;
  isHighlighted?: (iso: ISODate) => boolean;
}) {
  const today = parseDate(TODAY);
  const [cursor, setCursor] = useState(() => {
    const d = value ? parseDate(value) : today;
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const cells = monthGrid(cursor.y, cursor.m);
  const label = new Date(cursor.y, cursor.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const atStart = cursor.y === today.getFullYear() && cursor.m === today.getMonth();
  const monthsAhead = (cursor.y - today.getFullYear()) * 12 + cursor.m - today.getMonth();

  const shift = (n: number) =>
    setCursor(({ y, m }) => {
      const d = new Date(y, m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-mint-200 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold uppercase">{label}</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={atStart}
            className="grid size-9 place-items-center rounded-lg text-ink-600 hover:bg-mint-100 disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={monthsAhead >= 2}
            className="grid size-9 place-items-center rounded-lg text-ink-600 hover:bg-mint-100 disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono text-[10.5px] tracking-wider text-ink-400 uppercase">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <span key={i} />;
          const disabled = isDisabled(iso);
          const selected = value === iso;
          const lane = isHighlighted?.(iso);
          const isToday = diffDays(iso, TODAY) === 0;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              aria-label={parseDate(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              className={cn(
                "relative grid aspect-square place-items-center rounded-xl text-[15px] font-medium transition-colors",
                selected
                  ? "bg-ink-900 text-white"
                  : lane && !disabled
                    ? "bg-teal-50 text-teal-900 hover:bg-teal-100"
                    : "hover:bg-mint-100",
                disabled && "cursor-not-allowed text-ink-300 line-through decoration-ink-200 hover:bg-transparent",
                isToday && !selected && "ring-1 ring-ink-300",
              )}
            >
              {parseDate(iso).getDate()}
              {lane && !disabled && (
                <span
                  className={cn(
                    "absolute bottom-1.5 size-1 rounded-full",
                    selected ? "bg-coral-400" : "bg-teal-600",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

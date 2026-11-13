"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleAlert, MapPin } from "lucide-react";
import { RouteMap } from "@/components/shared/route-map";
import { Eyebrow, Heading } from "@/components/ui/eyebrow";
import { zoneForPostalCode } from "@/lib/api";
import { daysLabel, WEEK_ORDER, WEEKDAYS } from "@/lib/schedule";
import type { Zone } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CoverageSection({ zones, hub }: { zones: Zone[]; hub: { x: number; y: number } }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [zip, setZip] = useState("");
  const match = zip.length === 5 ? zoneForPostalCode(zip) : undefined;
  const highlighted = match?.id ?? focus;

  return (
    <section id="coverage" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div className="order-2 lg:order-1">
          <div className="rounded-[26px] bg-ink-900 p-2 shadow-lift">
            <RouteMap zones={zones} hub={hub} highlight={highlighted} onHighlight={setFocus} showLaneDays />
          </div>
          <p className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-wider text-ink-400 uppercase">
            <span className="inline-block size-2.5 rounded-[3px] bg-ink-900 ring-2 ring-white" /> Pawlane Hub
            <span className="mx-1 h-px w-4 bg-ink-300" />
            Hover a lane to see its days
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <Eyebrow index="03">Coverage</Eyebrow>
          <Heading className="mt-4">Six lanes. One walker each.</Heading>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-500">
            We split the city into lanes by ZIP code. Book on your lane day and your walker is already around the
            corner — you get a steadier schedule and a lower price.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-2 shadow-soft ring-1 ring-mint-200">
            <label className="flex items-center gap-3 px-3">
              <MapPin className="size-5 text-teal-700" />
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                inputMode="numeric"
                placeholder="Check your ZIP code"
                aria-label="ZIP code"
                className="h-12 flex-1 bg-transparent text-[17px] font-medium outline-none placeholder:text-ink-400"
              />
              <span className="font-mono text-xs text-ink-400">{zip.length}/5</span>
            </label>
            <AnimatePresence initial={false}>
              {zip.length === 5 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {match ? (
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50 px-4 py-3">
                      <p className="text-sm text-teal-900">
                        You&apos;re in <strong>{match.name}</strong>. {match.walker.name.split(" ")[0]} works your lane on{" "}
                        <strong>{daysLabel(match.laneDays)}</strong>.
                      </p>
                      <Link
                        href={`/book?zip=${zip}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 hover:underline"
                      >
                        Book <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-start gap-2.5 rounded-xl bg-coral-50 px-4 py-3 text-sm text-coral-700">
                      <CircleAlert className="mt-0.5 size-4 shrink-0" />
                      We&apos;re not in {zip} yet. Try 40211, 40220 or 40260 to see how it works.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ul className="mt-6 divide-y divide-mint-200 border-y border-mint-200">
            {zones.map((z) => (
              <li
                key={z.id}
                onMouseEnter={() => setFocus(z.id)}
                onMouseLeave={() => setFocus(null)}
                className={cn(
                  "flex items-center gap-4 px-1 py-3 transition-colors",
                  highlighted === z.id && "bg-white",
                )}
              >
                <span className="h-8 w-1 rounded-full" style={{ background: z.color }} />
                <span className="w-7 font-mono text-xs text-ink-400">{z.code}</span>
                <span className="flex-1 font-medium">{z.name}</span>
                <span className="hidden gap-1 sm:flex">
                  {WEEK_ORDER.slice(0, 6).map((d) => (
                    <span
                      key={d}
                      className={cn(
                        "grid size-7 place-items-center rounded-md font-mono text-[10px]",
                        z.laneDays.includes(d) ? "bg-ink-900 text-white" : "text-ink-300",
                      )}
                    >
                      {WEEKDAYS[d][0]}
                    </span>
                  ))}
                </span>
                <span className="font-mono text-xs text-ink-500 sm:hidden">{daysLabel(z.laneDays)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

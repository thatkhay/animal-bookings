"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const STOPS = [
  { time: "1:48 PM", title: "Maple", sub: "Picked up · Orchard Row" },
  { time: "1:56 PM", title: "Biscuit + Juniper", sub: "218 Linden Ave" },
  { time: "2:05 PM", title: "Linden Park loop", sub: "2.1 mi · pack of 3" },
  { time: "3:02 PM", title: "Drop-offs", sub: "Paw wipe · water · photo report" },
];

export function LiveRouteCard() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % STOPS.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm rounded-3xl bg-ink-950/60 p-5 shadow-float ring-1 ring-white/12 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10.5px] tracking-[0.16em] text-teal-300 uppercase">Lane N1 · Northside</p>
          <p className="mt-1 font-display text-2xl font-bold uppercase">Tuesday pack walk</p>
        </div>
        <span className="grid size-10 place-items-center rounded-2xl bg-teal-400/15 text-teal-300 ring-1 ring-teal-300/25">
          <Navigation className="size-4" />
        </span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-teal-400 to-coral-400"
          animate={{ width: `${((active + 1) / STOPS.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      <ol className="mt-4 space-y-0.5">
        {STOPS.map((s, i) => {
          const done = i < active;
          const now = i === active;
          return (
            <li
              key={s.title}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors duration-300",
                now && "bg-white/8",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold ring-1 transition-colors duration-300",
                  done && "bg-teal-400 text-ink-950 ring-teal-400",
                  now && "bg-coral-400 text-ink-950 ring-coral-400",
                  !done && !now && "text-white/50 ring-white/20",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-sm font-semibold", !done && !now && "text-white/70")}>
                  {s.title}
                </span>
                <span className="block truncate text-xs text-white/50">{s.sub}</span>
              </span>
              <span className={cn("font-mono text-[11px]", now ? "text-coral-300" : "text-white/40")}>{s.time}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/55">
        <span className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-white/10 text-[10px] font-semibold text-white">
            DM
          </span>
          Dani · your walker since Mar 2025
        </span>
        <span className="font-mono text-teal-300">−24 min drive</span>
      </div>
    </motion.div>
  );
}

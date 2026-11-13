import Image from "next/image";
import { Check } from "lucide-react";
import { Eyebrow, Heading } from "@/components/ui/eyebrow";
import { unsplash } from "@/lib/utils";

export function HowSection() {
  return (
    <section id="how" className="scroll-mt-20 px-3 sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-ink-900 text-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow index="02" tone="light">
                How it works
              </Eyebrow>
              <Heading className="mt-4">
                Set it up once.
                <br />
                <span className="text-teal-300">We handle the weeks.</span>
              </Heading>
            </div>
            <p className="max-w-md text-[17px] leading-relaxed text-white/65 lg:justify-self-end">
              Most pet-care apps make you book every walk like it&apos;s the first. Pawlane remembers your pet, holds
              your slot, and plans the route so your walker isn&apos;t stuck in cross-town traffic.
            </p>
          </div>

          <ol className="mt-10 snap-rail -mx-4 gap-3 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 lg:mt-16 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <Step n="01" title="Build a pet profile" body="Breed, vaccines, triggers, feeding notes. Upload records once — we flag anything that's about to expire.">
              <ProfileVignette />
            </Step>
            <Step n="02" title="Lock in weekly slots" body="Choose your days and a time. Every Tuesday and Thursday at 2 PM is yours until you change it.">
              <SlotsVignette />
            </Step>
            <Step n="03" title="We route by neighborhood" body="Bookings are grouped by ZIP into lanes, so one walker covers your block on set days.">
              <LaneVignette />
            </Step>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, body, children }: { n: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <li className="flex w-[84vw] max-w-sm shrink-0 snap-start flex-col rounded-3xl bg-white/[0.04] p-2 ring-1 ring-white/10 md:w-[46vw] lg:w-auto lg:max-w-none">
      <div className="relative h-56 overflow-hidden rounded-[18px] bg-ink-950/60 p-4 ring-1 ring-white/5">{children}</div>
      <div className="px-4 pt-5 pb-4">
        <p className="font-mono text-xs text-coral-300">{n}</p>
        <h3 className="mt-1.5 font-display text-[28px] font-bold uppercase leading-none">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">{body}</p>
      </div>
    </li>
  );
}

function ProfileVignette() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="rounded-2xl bg-white p-3.5 text-ink-900 shadow-float">
        <div className="flex items-center gap-3">
          <span className="relative size-11 overflow-hidden rounded-full">
            <Image src={unsplash("1587300003388-59208cc962cb")} alt="" fill sizes="88px" className="object-cover" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Juniper</p>
            <p className="text-xs text-ink-500">Australian Shepherd · 4 yrs · 44 lb</p>
          </div>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
            Bordetella · 18d
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Herds the pack", "Recall: solid", "Sound sensitive"].map((t) => (
            <span key={t} className="rounded-full bg-mint-100 px-2 py-0.5 text-[11px] font-medium text-teal-800">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-3 h-3 rounded-b-2xl bg-white/50" />
      <div className="mx-6 h-2.5 rounded-b-2xl bg-white/20" />
    </div>
  );
}

function SlotsVignette() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const on = i === 1 || i === 3;
          return (
            <span
              key={i}
              className={
                on
                  ? "grid h-11 place-items-center rounded-xl bg-teal-400 font-semibold text-ink-950"
                  : "grid h-11 place-items-center rounded-xl bg-white/5 text-sm text-white/45 ring-1 ring-white/10"
              }
            >
              {d}
            </span>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {["12 PM", "2 PM", "4 PM"].map((t) => (
          <span
            key={t}
            className={
              t === "2 PM"
                ? "flex-1 rounded-xl bg-coral-400 py-2 text-center text-sm font-semibold text-ink-950"
                : "flex-1 rounded-xl bg-white/5 py-2 text-center text-sm text-white/45 ring-1 ring-white/10"
            }
          >
            {t}
          </span>
        ))}
      </div>
      <p className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 font-mono text-[11px] text-teal-200">
        <Check className="size-3.5" /> Every Tue & Thu · 2 PM · from Nov 17
      </p>
    </div>
  );
}

function LaneVignette() {
  const pts = [
    [40, 150],
    [82, 96],
    [128, 120],
    [168, 64],
    [214, 90],
    [262, 48],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <svg viewBox="0 0 300 190" className="size-full">
      <rect x="18" y="20" width="270" height="150" rx="16" fill="#2dd4bf" fillOpacity="0.08" stroke="#2dd4bf" strokeOpacity="0.4" strokeDasharray="4 5" />
      <text x="34" y="44" fill="#2dd4bf" fontSize="10" fontFamily="var(--font-jetbrains)" letterSpacing="1.5">
        N1 · 40211–40213
      </text>
      <path d={d} fill="none" stroke="#2dd4bf" strokeOpacity="0.25" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeDasharray="7 4" className="animate-route" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#060f26" stroke={i === 2 ? "#ff8a65" : "#2dd4bf"} strokeWidth="3" />
        </g>
      ))}
      <rect x="150" y="136" width="126" height="24" rx="12" fill="#ff8a65" />
      <text x="213" y="152" textAnchor="middle" fill="#0b1b3f" fontSize="11" fontWeight="700" fontFamily="var(--font-dm-sans)">
        6 stops · 2.8 mi
      </text>
    </svg>
  );
}

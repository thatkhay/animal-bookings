import Image from "next/image";
import { Quote } from "lucide-react";
import { Eyebrow, Heading } from "@/components/ui/eyebrow";
import type { Testimonial } from "@/lib/types";

const STATS = [
  { value: "31%", label: "less time driving", note: "vs. booking walks city-wide" },
  { value: "94%", label: "same-walker visits", note: "across recurring plans" },
  { value: "2 hr", label: "median confirmation", note: "for new requests, 7 AM–8 PM" },
];

export function ProofSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="border-y border-mint-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl bg-mint-200 ring-1 ring-mint-200">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white p-4 sm:p-7">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-4xl leading-none font-bold text-ink-900 sm:text-7xl">{s.value}</dd>
              <dd className="mt-2 text-sm leading-tight font-medium sm:mt-3 sm:text-base">{s.label}</dd>
              <dd className="mt-0.5 hidden text-sm text-ink-500 sm:block">{s.note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 flex flex-col sm:mt-24 justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow index="04">From the lanes</Eyebrow>
            <Heading className="mt-4">Owners, in their words</Heading>
          </div>
        </div>

        <div className="mt-10 snap-rail -mx-4 gap-3 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={
                i === 0
                  ? "flex w-[84vw] max-w-sm shrink-0 snap-start flex-col rounded-3xl bg-ink-900 p-7 text-white lg:w-auto lg:max-w-none"
                  : "flex w-[84vw] max-w-sm shrink-0 snap-start flex-col rounded-3xl bg-mint-50 p-7 ring-1 ring-mint-200 lg:w-auto lg:max-w-none"
              }
            >
              <Quote className={i === 0 ? "size-7 text-coral-400" : "size-7 text-teal-700"} />
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span className="relative size-12 overflow-hidden rounded-full">
                  <Image src={t.photo} alt={t.pet} fill sizes="96px" className="object-cover" />
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className={i === 0 ? "block text-sm text-white/55" : "block text-sm text-ink-500"}>
                    {t.pet} · {t.zone}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

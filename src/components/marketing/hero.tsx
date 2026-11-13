import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Syringe } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { unsplash } from "@/lib/utils";
import type { Service } from "@/lib/types";
import { LiveRouteCard } from "./live-route-card";
import { QuickBook } from "./quick-book";

export function Hero({ services }: { services: Service[] }) {
  return (
    <section className="px-3 pt-1 sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-ink-900 text-white">
        <div className="absolute inset-x-0 top-0 h-115 sm:inset-0 sm:h-auto">
          <Image
            src={unsplash("1548199973-03cce0bbc87b")}
            alt="A corgi and a terrier trotting side by side down a sunlit path"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_45%] sm:object-[70%_55%]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-ink-950/55 via-ink-950/70 to-ink-900 sm:hidden" />
        </div>
        <div className="absolute inset-0 hidden bg-linear-to-r from-ink-950/95 via-ink-900/55 to-transparent sm:block" />
        <div className="absolute inset-0 hidden bg-linear-to-t from-ink-950/80 via-transparent to-transparent sm:block" />
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_right,black,transparent_60%)]" />

        <div className="relative grid gap-10 px-5 pt-10 pb-6 sm:px-10 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-6 lg:px-14 lg:pt-24 lg:pb-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-3.5 pl-2 font-mono text-[11px] tracking-wider text-white/80 uppercase ring-1 ring-white/15 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-teal-400" />
              </span>
              14 walkers on route right now
            </p>

            <h1 className="mt-6 font-display text-[clamp(3.2rem,8.5vw,6.8rem)] leading-[0.86] font-extrabold tracking-[-0.005em] uppercase">
              Pet care that
              <br />
              knows <span className="text-coral-400">your street.</span>
            </h1>

            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
              Dog walks, puppy socialization and in-home visits — booked around the days your walker is already in
              your neighborhood. Set your pet up once, lock in your weekly slots, and stop thinking about it.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <ButtonLink href="/book" size="lg" className="max-sm:px-4">
                Book a visit <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/#how" size="lg" variant="light" className="max-sm:px-4">
                How lanes work
              </ButtonLink>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Star className="size-4 fill-coral-400 text-coral-400" /> 4.9 from 1,280 visits
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-teal-300" /> Insured & background-checked
              </li>
              <li className="flex items-center gap-2">
                <Syringe className="size-4 text-teal-300" /> Vaccination-checked packs
              </li>
            </ul>
          </div>

          <div className="flex items-end justify-end">
            <LiveRouteCard />
          </div>
        </div>

        <div className="relative px-3 pb-3 sm:px-4 sm:pb-4">
          <QuickBook services={services} />
        </div>
      </div>
    </section>
  );
}

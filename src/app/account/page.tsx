import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Footprints, Repeat, Route } from "lucide-react";
import { UpcomingList } from "@/components/account/upcoming-list";
import { PetAvatar, PetStack } from "@/components/shared/pet-avatar";
import { VaccineBadge } from "@/components/shared/status";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  findService,
  findZone,
  getBookingsForClient,
  getCurrentClient,
  getPetsForClient,
  getSubscriptionsForClient,
  getVisitHistory,
  petVaccineStatus,
} from "@/lib/api";
import { arrivalWindow, daysLabel, diffDays, formatDate, formatTime, relativeDay, TODAY } from "@/lib/schedule";
import { money } from "@/lib/utils";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountOverview() {
  const [client, pets, subs, bookings] = await Promise.all([
    getCurrentClient(),
    getPetsForClient(),
    getSubscriptionsForClient(),
    getBookingsForClient(),
  ]);
  const zone = findZone(client.zoneId)!;
  const upcoming = bookings.filter((b) => diffDays(b.date, TODAY) > 0 && b.status !== "cancelled");
  const next = upcoming[0];
  const nextService = next && findService(next.serviceId)!;
  const nextPets = next ? pets.filter((p) => next.petIds.includes(p.id)) : [];
  const history = await getVisitHistory(pets[0].id);
  const last = history[0];
  const monthVisits = bookings.filter((b) => b.date.slice(0, 7) === TODAY.slice(0, 7) && b.status === "completed");
  const miles = history.slice(0, 12).reduce((sum, h) => sum + (h.report?.distanceMi ?? 0), 0);
  const flagged = pets.filter((p) => petVaccineStatus(p) !== "valid");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-ink-400 uppercase">{formatDate(TODAY, "long")}</p>
          <h1 className="mt-2 font-display text-5xl leading-none font-bold uppercase sm:text-6xl">
            Hi, {client.name.split(" ")[0]}
          </h1>
        </div>
        <p className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-mint-200">
          <span className="size-2 rounded-full" style={{ background: zone.color }} />
          {zone.name} lane · {daysLabel(zone.laneDays)} · {zone.walker.name}
        </p>
      </div>

      {flagged.length > 0 && (
        <Link
          href={`/account/pets/${flagged[0].id}`}
          className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-600/20 transition-colors hover:bg-amber-100/70"
        >
          <PetAvatar pet={flagged[0]} size={28} />
          <span className="flex-1">
            <strong>{flagged.map((p) => p.name).join(" & ")}</strong> — a vaccine record needs updating before the next pack
            walk.
          </span>
          <span className="flex items-center gap-1 font-semibold">
            Update <ArrowRight className="size-3.5" />
          </span>
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {next && nextService && (
          <section className="relative overflow-hidden rounded-3xl bg-ink-900 p-6 text-white sm:p-8">
            <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)]" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] tracking-[0.18em] text-teal-300 uppercase">Next visit</p>
                <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] ring-1 ring-white/15">
                  {next.ref}
                </span>
              </div>
              <p className="mt-4 font-display text-5xl leading-[0.9] font-bold uppercase sm:text-6xl">
                {relativeDay(next.date)}, {formatTime(next.time)}
              </p>
              <p className="mt-3 text-white/65">
                {nextService.name} · {nextPets.map((p) => p.name).join(" & ")} · arrive {arrivalWindow(next.time)}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-teal-400 font-mono text-sm font-medium text-ink-950">
                    {zone.walker.initials}
                  </span>
                  <div>
                    <p className="font-semibold">{zone.walker.name}</p>
                    <p className="text-sm text-white/55">Your walker since {formatDate(client.memberSince, "month")}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="light" size="sm">
                    <MessageCircle className="size-4" /> Message
                  </Button>
                  <Button variant="light" size="sm">
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3">
          <Stat icon={Footprints} label="Visits this month" value={String(monthVisits.length)} />
          <Stat icon={Route} label="Miles walked (12 visits)" value={miles.toFixed(1)} />
          <Stat icon={Repeat} label="Active plans" value={String(subs.filter((s) => s.status === "active").length)} />
          <Stat icon={Clock} label="Same-walker rate" value="100%" />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-mint-200 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold uppercase">Coming up</h2>
            <Link href="/account/plans" className="text-sm font-semibold text-teal-700 hover:underline">
              Manage plans
            </Link>
          </div>
          <p className="mt-1 text-sm text-ink-500">Skip a single plan visit up to 12 hours before. You won&apos;t be charged.</p>
          <div className="mt-4">
            <UpcomingList bookings={upcoming.slice(0, 6)} pets={pets} />
          </div>
        </section>

        <div className="space-y-6">
          {last?.report && (
            <section className="rounded-3xl bg-white p-5 ring-1 ring-mint-200 sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl font-bold uppercase">Last report</h2>
                <span className="font-mono text-xs text-ink-400">{formatDate(last.booking.date, "day")}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <PetStack pets={pets.filter((p) => last.booking.petIds.includes(p.id))} size={36} />
                <p className="text-sm text-ink-500">{findService(last.booking.serviceId)!.name}</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Metric value={`${last.report.distanceMi}`} unit="mi" />
                <Metric value={`${last.report.activeMin}`} unit="min" />
                <Metric value={`${last.report.checks.length}/4`} unit="checks" />
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-600">“{last.report.note}”</p>
              <p className="mt-2 text-sm text-ink-400">— {zone.walker.name.split(" ")[0]}</p>
            </section>
          )}

          <section className="rounded-3xl bg-white p-5 ring-1 ring-mint-200 sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold uppercase">Your pets</h2>
              <Link href="/account/pets" className="text-sm font-semibold text-teal-700 hover:underline">
                All profiles
              </Link>
            </div>
            <ul className="mt-4 space-y-1">
              {pets.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/account/pets/${p.id}`}
                    className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-mint-50"
                  >
                    <PetAvatar pet={p} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{p.name}</span>
                      <span className="block truncate text-sm text-ink-500">{p.breed}</span>
                    </span>
                    <VaccineBadge status={petVaccineStatus(p)} label={petVaccineStatus(p) === "valid" ? "Current" : undefined} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-coral-100 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase">Away for the holidays?</h2>
          <p className="mt-1 text-ink-600">
            Book a free sitter consult and we&apos;ll plan drop-ins or overnights. Lane-day drop-ins from{" "}
            {money(findService("drop-in")!.price - findService("drop-in")!.laneDayDiscount)}.
          </p>
        </div>
        <ButtonLink href="/book?service=sitter-consult" variant="dark">
          Plan holiday care <ArrowRight className="size-4" />
        </ButtonLink>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white p-5 ring-1 ring-mint-200">
      <Icon className="size-5 text-teal-700" />
      <div className="mt-6">
        <p className="font-display text-5xl leading-none font-bold">{value}</p>
        <p className="mt-1.5 text-sm text-ink-500">{label}</p>
      </div>
    </div>
  );
}

function Metric({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="rounded-2xl bg-mint-50 py-3">
      <p className="font-display text-3xl leading-none font-bold">{value}</p>
      <p className="mt-1 font-mono text-[10px] tracking-wider text-ink-400 uppercase">{unit}</p>
    </div>
  );
}

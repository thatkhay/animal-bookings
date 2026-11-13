import type { Metadata } from "next";
import { PlansManager } from "@/components/account/plans-manager";
import { findZone, getCurrentClient, getPetsForClient, getSubscriptionsForClient } from "@/lib/api";
import { daysLabel } from "@/lib/schedule";

export const metadata: Metadata = { title: "Recurring plans" };

export default async function PlansPage() {
  const [client, subs, pets] = await Promise.all([getCurrentClient(), getSubscriptionsForClient(), getPetsForClient()]);
  const zone = findZone(client.zoneId)!;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-400 uppercase">Recurring plans</p>
        <h1 className="mt-2 mb-8 font-display text-5xl leading-none font-bold uppercase sm:text-6xl">Your weekly slots</h1>
        <PlansManager initial={subs} pets={pets} zone={zone} />
      </div>

      <aside className="space-y-4 lg:pt-24">
        <div className="rounded-3xl bg-ink-900 p-6 text-white">
          <p className="font-mono text-[10.5px] tracking-[0.16em] text-teal-300 uppercase">Your lane</p>
          <p className="mt-2 font-display text-3xl font-bold uppercase">{zone.name}</p>
          <p className="mt-1 text-sm text-white/60">
            {zone.walker.name} is on your street {daysLabel(zone.laneDays)}. Plans on those days get lane pricing
            and priority when the schedule is tight.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 text-sm leading-relaxed text-ink-600 ring-1 ring-mint-200">
          <p className="font-semibold text-ink-900">How changes work</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-4">
            <li>Changes to days or time apply from next week.</li>
            <li>Pausing keeps your slot held for up to 4 weeks.</li>
            <li>Skip single visits from the Overview tab.</li>
            <li>Ending a plan releases the slot to the waitlist.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

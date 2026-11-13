import type { Metadata } from "next";
import { Clock3, Gauge, Inbox, MapPin, Route } from "lucide-react";
import { LaneTimeline } from "@/components/admin/lane-timeline";
import { RequestQueue } from "@/components/admin/request-queue";
import { RouteMap } from "@/components/shared/route-map";
import { getOpsSnapshot } from "@/lib/api";
import { planDay } from "@/lib/routing";
import { diffDays, formatDate } from "@/lib/schedule";
import { money } from "@/lib/utils";

export const metadata: Metadata = { title: "Today" };

export default async function AdminToday() {
  const { today, bookings, clients, pets, zones, hub } = await getOpsSnapshot();
  const todays = bookings.filter((b) => b.date === today);
  const plan = planDay({ bookings: todays, clients, zones, hub });
  const pending = bookings.filter((b) => b.status === "pending" && diffDays(b.date, today) >= 0);
  const revenue = todays.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);

  const routes = plan.lanes.map((l) => ({
    id: l.zone.id,
    color: l.zone.color,
    points: [hub, ...l.stops.map((s) => s.point), hub],
  }));
  const stops = plan.lanes.flatMap((l) =>
    l.stops.map((s, i) => ({
      id: s.booking.id,
      x: s.point.x,
      y: s.point.y,
      color: l.zone.color,
      label: s.client.name.split(" ")[0],
      active: i === 1,
    })),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-ink-500 uppercase">{formatDate(today, "long")}</p>
          <h1 className="mt-2 font-display text-5xl leading-none font-bold uppercase">Today&apos;s lanes</h1>
        </div>
        <p className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-mono text-xs ring-1 ring-ink-200">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-500 opacity-60" />
            <span className="relative size-2 rounded-full bg-teal-500" />
          </span>
          {plan.lanes.length} lanes live
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon={MapPin} label="Stops today" value={String(plan.totals.stops)} sub={`${plan.lanes.length} lanes`} />
        <Kpi icon={Route} label="Drive time" value={`${plan.totals.driveMin}m`} sub={`${plan.totals.miles} mi total`} />
        <Kpi
          icon={Gauge}
          label="Saved by lanes"
          value={`${plan.totals.savedMin}m`}
          sub={`vs ${plan.totals.naiveDriveMin}m unclustered`}
          accent
        />
        <Kpi icon={Clock3} label="Booked revenue" value={money(revenue)} sub={`${pending.length} requests pending`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="self-start rounded-3xl bg-ink-900 p-2">
          <RouteMap zones={zones} routes={routes} stops={stops} hub={hub} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 pt-3 pb-2">
            {plan.lanes.map((l) => (
              <span key={l.zone.id} className="flex items-center gap-2 text-sm text-white/75">
                <span className="h-1 w-5 rounded-full" style={{ background: l.zone.color }} />
                {l.zone.name} · {l.zone.walker.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
              <Inbox className="size-5 text-coral-500" /> Requests
            </h2>
            <span className="font-mono text-xs text-ink-500">{pending.length} waiting</span>
          </div>
          <RequestQueue bookings={pending.slice(0, 4)} clients={clients} pets={pets} compact />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {plan.lanes.map((lane) => (
          <LaneTimeline key={lane.zone.id} lane={lane} pets={pets} />
        ))}
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Route;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "rounded-3xl bg-teal-700 p-5 text-white" : "rounded-3xl bg-white p-5 ring-1 ring-ink-200"}>
      <div className="flex items-center justify-between">
        <p className={accent ? "text-sm text-white/75" : "text-sm text-ink-500"}>{label}</p>
        <Icon className={accent ? "size-4 text-teal-200" : "size-4 text-ink-400"} />
      </div>
      <p className="mt-4 font-display text-5xl leading-none font-bold">{value}</p>
      <p className={accent ? "mt-1.5 font-mono text-xs text-white/60" : "mt-1.5 font-mono text-xs text-ink-400"}>{sub}</p>
    </div>
  );
}

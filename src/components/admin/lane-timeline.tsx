import { PetStack } from "@/components/shared/pet-avatar";
import { BookingStatusBadge } from "@/components/shared/status";
import { findService } from "@/lib/api";
import type { LaneRoute } from "@/lib/routing";
import { formatTime } from "@/lib/schedule";
import type { Pet } from "@/lib/types";

export function LaneTimeline({ lane, pets }: { lane: LaneRoute; pets: Pet[] }) {
  const { zone } = lane;
  return (
    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200">
      <header className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
        <span
          className="grid size-10 place-items-center rounded-xl font-mono text-sm font-medium"
          style={{ background: `${zone.color}26`, color: "#0b1b3f", boxShadow: `inset 0 0 0 1.5px ${zone.color}` }}
        >
          {zone.code}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl leading-none font-bold uppercase">{zone.name}</p>
          <p className="mt-0.5 text-sm text-ink-500">{zone.walker.name}</p>
        </div>
        <div className="text-right font-mono text-xs text-ink-500">
          <p>
            <span className="text-ink-900">{lane.stops.length}</span> {lane.stops.length === 1 ? "stop" : "stops"}
          </p>
          <p>
            {lane.miles} mi · {lane.driveMin} min
          </p>
        </div>
      </header>
      <ol className="relative px-5 py-3">
        <span className="absolute top-6 bottom-6 left-[38px] w-0.5 rounded-full" style={{ background: `${zone.color}55` }} />
        {lane.stops.map((s, i) => {
          const svc = findService(s.booking.serviceId)!;
          return (
            <li key={s.booking.id} className="relative flex items-center gap-4 py-2.5">
              <span
                className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-white font-mono text-[11px] font-medium ring-2"
                style={{ ["--tw-ring-color" as string]: zone.color }}
              >
                {i + 1}
              </span>
              <span className="w-16 shrink-0 font-mono text-[13px] text-ink-600">{formatTime(s.booking.time)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{s.client.name}</span>
                <span className="block truncate text-sm text-ink-500">
                  {svc.name} · {s.client.street}
                </span>
              </span>
              <span className="hidden sm:block">
                <PetStack pets={pets.filter((p) => s.booking.petIds.includes(p.id))} size={28} />
              </span>
              <span className="hidden xl:block">
                <BookingStatusBadge status={s.booking.status} short />
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

import type { Metadata } from "next";
import { WeekPlanner } from "@/components/admin/week-planner";
import { getOpsSnapshot } from "@/lib/api";

export const metadata: Metadata = { title: "Lanes & routes" };

export default async function RoutesPage() {
  const data = await getOpsSnapshot();
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-500 uppercase">Route planning</p>
        <h1 className="mt-2 font-display text-5xl leading-none font-bold uppercase">Lanes & routes</h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Bookings are grouped by ZIP into lanes. Each lane runs on set days so one walker covers a tight cluster
          instead of crossing town between visits.
        </p>
      </div>
      <WeekPlanner data={data} />
    </div>
  );
}

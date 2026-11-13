import type { Metadata } from "next";
import { BookingsTable } from "@/components/admin/bookings-table";
import { getOpsSnapshot } from "@/lib/api";

export const metadata: Metadata = { title: "Bookings" };

export default async function BookingsPage() {
  const data = await getOpsSnapshot();
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-500 uppercase">All visits</p>
        <h1 className="mt-2 font-display text-5xl leading-none font-bold uppercase">Bookings</h1>
      </div>
      <BookingsTable data={data} />
    </div>
  );
}

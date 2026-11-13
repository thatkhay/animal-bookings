import { addDays, diffDays, occurrences, TODAY } from "../schedule";
import { hash } from "../utils";
import type { Booking, Subscription, VisitReport } from "../types";
import { services } from "./catalog";
import { clients } from "./people";

export const subscriptions: Subscription[] = [
  { id: "s1", clientId: "c1", petIds: ["p-biscuit", "p-juniper"], serviceId: "pack-walk", days: [2, 4], time: "14:00", frequency: "weekly", startDate: "2025-03-11", status: "active" },
  { id: "s2", clientId: "c1", petIds: ["p-clementine"], serviceId: "drop-in", days: [4], time: "17:00", frequency: "weekly", startDate: "2025-07-03", status: "paused", pausedUntil: "2026-11-26" },
  { id: "s3", clientId: "c2", petIds: ["p-olive"], serviceId: "solo-stroll", days: [2, 4], time: "11:00", frequency: "weekly", startDate: "2025-06-24", status: "active" },
  { id: "s10", clientId: "c9", petIds: ["p-maple"], serviceId: "pack-walk", days: [2, 4], time: "14:00", frequency: "weekly", startDate: "2025-09-09", status: "active" },
  { id: "s4", clientId: "c3", petIds: ["p-tofu"], serviceId: "pack-walk", days: [1, 3, 5], time: "10:00", frequency: "weekly", startDate: "2024-12-02", status: "active" },
  { id: "s12", clientId: "c12", petIds: ["p-rocket"], serviceId: "pack-walk", days: [1, 3, 5], time: "10:00", frequency: "weekly", startDate: "2026-02-04", status: "active" },
  { id: "s5", clientId: "c4", petIds: ["p-pepper"], serviceId: "solo-stroll", days: [1, 3, 5], time: "13:00", frequency: "weekly", startDate: "2025-01-15", status: "active" },
  { id: "s6", clientId: "c5", petIds: ["p-miso"], serviceId: "pack-walk", days: [2, 5], time: "10:00", frequency: "weekly", startDate: "2025-04-25", status: "active" },
  { id: "s9", clientId: "c11", petIds: ["p-ziggy"], serviceId: "solo-stroll", days: [2, 5], time: "15:00", frequency: "biweekly", startDate: "2026-05-12", status: "active" },
  { id: "s7", clientId: "c8", petIds: ["p-nori"], serviceId: "drop-in", days: [1, 3, 5], time: "08:00", frequency: "weekly", startDate: "2025-08-18", status: "active" },
  { id: "s8", clientId: "c10", petIds: ["p-coco"], serviceId: "pack-walk", days: [1, 3, 5], time: "14:00", frequency: "weekly", startDate: "2025-12-03", status: "active" },
  { id: "s13", clientId: "c13", petIds: ["p-luna"], serviceId: "solo-stroll", days: [1, 3, 5], time: "15:00", frequency: "weekly", startDate: "2026-07-22", status: "active" },
];

const oneOffs: Omit<Booking, "ref" | "zoneId" | "price">[] = [
  { id: "b-ruth-1", clientId: "c6", petIds: ["p-waffles"], serviceId: "puppy-social", date: "2026-11-16", time: "15:30", status: "pending", note: "First session. He's 12 weeks — vaccines not finished." },
  { id: "b-theo-1", clientId: "c7", petIds: ["p-bruno"], serviceId: "puppy-social", date: "2026-11-14", time: "10:00", status: "confirmed" },
  { id: "b-theo-0", clientId: "c7", petIds: ["p-bruno"], serviceId: "puppy-social", date: "2026-11-07", time: "10:00", status: "completed" },
  { id: "b-leila-1", clientId: "c10", petIds: ["p-coco"], serviceId: "sitter-consult", date: "2026-11-13", time: "17:30", status: "pending", note: "Away Dec 20–28, want overnight sitting quote." },
  { id: "b-hana-1", clientId: "c4", petIds: ["p-pepper"], serviceId: "solo-stroll", date: "2026-11-14", time: "09:00", status: "pending", note: "Extra Saturday walk, if possible." },
  { id: "b-sam-1", clientId: "c1", petIds: ["p-clementine"], serviceId: "sitter-consult", date: "2026-11-19", time: "17:30", status: "confirmed", note: "Plan holiday sitting for Clementine." },
  { id: "b-priya-1", clientId: "c2", petIds: ["p-olive"], serviceId: "drop-in", date: "2026-11-18", time: "12:00", status: "pending" },
  { id: "b-omar-0", clientId: "c13", petIds: ["p-luna"], serviceId: "pack-walk", date: "2026-11-11", time: "14:00", status: "cancelled", note: "Cancelled by client — vet visit." },
];

const WINDOW_START = addDays(TODAY, -21);
const WINDOW_END = addDays(TODAY, 21);

function makeRef(id: string) {
  return `PL-${(hash(id) % 46656).toString(36).toUpperCase().padStart(3, "0")}${(hash(id + "x") % 1296).toString(36).toUpperCase().padStart(2, "0")}`;
}

function priceFor(serviceId: Booking["serviceId"], petCount: number, onLaneDay: boolean) {
  const svc = services.find((s) => s.id === serviceId)!;
  const base = svc.price - (onLaneDay ? svc.laneDayDiscount : 0);
  return base + Math.max(0, petCount - 1) * Math.round(base * 0.5);
}

function statusFor(date: string): Booking["status"] {
  return diffDays(date, TODAY) < 0 ? "completed" : "confirmed";
}

function buildBookings(): Booking[] {
  const out: Booking[] = [];

  for (const sub of subscriptions) {
    const client = clients.find((c) => c.id === sub.clientId)!;
    const start = diffDays(sub.startDate, WINDOW_START) > 0 ? sub.startDate : WINDOW_START;
    const dates = occurrences({ days: sub.days, startDate: start, frequency: sub.frequency, count: 40 }).filter(
      (d) => diffDays(d, WINDOW_END) <= 0,
    );
    for (const date of dates) {
      const paused = sub.status === "paused" && diffDays(date, TODAY) >= 0 && diffDays(date, sub.pausedUntil ?? date) < 0;
      if (paused) continue;
      const id = `${sub.id}-${date}`;
      out.push({
        id,
        ref: makeRef(id),
        clientId: sub.clientId,
        petIds: sub.petIds,
        serviceId: sub.serviceId,
        date,
        time: sub.time,
        status: statusFor(date),
        zoneId: client.zoneId,
        price: priceFor(sub.serviceId, sub.petIds.length, true),
        subscriptionId: sub.id,
      });
    }
  }

  for (const b of oneOffs) {
    const client = clients.find((c) => c.id === b.clientId)!;
    out.push({
      ...b,
      ref: makeRef(b.id),
      zoneId: client.zoneId,
      price: priceFor(b.serviceId, b.petIds.length, false),
    });
  }

  return out.sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
}

export const bookings: Booking[] = buildBookings();

const REPORT_NOTES = [
  "Great energy today. Took the long loop past the park and everyone kept a loose leash.",
  "Bit of rain, so we stuck to the tree-covered streets. Paws wiped and dried at the door.",
  "Met a new neighbor dog at the corner — polite sniff, no drama. Water bowl topped up.",
  "Slower pace today, lots of sniffing. Back home happy and settled on the couch.",
  "Pack was in sync. Practiced sits at every crossing, nailed most of them.",
];

const CHECKS = ["Pee", "Poop", "Water refilled", "Paws wiped", "Door locked", "Meds given", "Litter cleaned", "Fed"];

export function reportFor(booking: Booking): VisitReport | null {
  if (booking.status !== "completed") return null;
  const h = hash(booking.id);
  const svc = services.find((s) => s.id === booking.serviceId)!;
  const isWalk = booking.serviceId === "pack-walk" || booking.serviceId === "solo-stroll";
  return {
    bookingId: booking.id,
    distanceMi: isWalk ? Math.round((1 + (h % 160) / 100) * 10) / 10 : 0,
    activeMin: svc.durationMin - (h % 6),
    checks: isWalk ? ["Pee", "Poop", "Water refilled", "Paws wiped"].filter((_, i) => i !== h % 5) : ["Fed", "Litter cleaned", "Water refilled", "Door locked"],
    note: REPORT_NOTES[h % REPORT_NOTES.length],
  };
}

export { CHECKS };

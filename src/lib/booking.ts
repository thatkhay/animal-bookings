import type { ClockTime, Frequency, ISODate, Pet, Service, ServiceId, Weekday, Zone } from "./types";
import { diffDays, occurrences, TODAY, visitsPerMonth, weekdayOf } from "./schedule";
import { hash } from "./utils";

export type ScheduleMode = "once" | "recurring";

export interface BookingDraft {
  serviceId: ServiceId | null;
  postalCode: string;
  street: string;
  access: string;
  petIds: string[];
  newPets: Pet[];
  mode: ScheduleMode;
  date: ISODate | null;
  time: ClockTime | null;
  days: Weekday[];
  frequency: Frequency;
  startDate: ISODate | null;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export const emptyDraft: BookingDraft = {
  serviceId: null,
  postalCode: "",
  street: "",
  access: "",
  petIds: [],
  newPets: [],
  mode: "recurring",
  date: null,
  time: null,
  days: [],
  frequency: "weekly",
  startDate: null,
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export function isLaneDay(zone: Zone | undefined, iso: ISODate) {
  return !!zone && zone.laneDays.includes(weekdayOf(iso));
}

export function visitPrice(service: Service, petCount: number, laneDay: boolean) {
  if (service.price === 0) return 0;
  const base = service.price - (laneDay ? service.laneDayDiscount : 0);
  return base + Math.max(0, petCount - 1) * Math.round(base * 0.5);
}

export function isClosed(iso: ISODate) {
  return weekdayOf(iso) === 0;
}

export function spotsLeft(service: Service, iso: ISODate, time: ClockTime) {
  if (diffDays(iso, TODAY) <= 0 || isClosed(iso)) return 0;
  const h = hash(`${service.id}|${iso}|${time}`);
  if (h % 7 === 0) return 0;
  if (service.capacity === 1) return 1;
  return 1 + (h % service.capacity);
}

export function recurringOpen(service: Service, day: Weekday, time: ClockTime) {
  return hash(`${service.id}|${day}|${time}`) % 6 !== 0;
}

export function planEstimate(opts: {
  service: Service;
  zone: Zone | undefined;
  petCount: number;
  days: Weekday[];
  frequency: Frequency;
}) {
  const { service, zone, petCount, days, frequency } = opts;
  if (!days.length) return { perVisit: 0, monthly: 0, visits: 0, saved: 0 };
  const laneVisits = days.filter((d) => zone?.laneDays.includes(d)).length;
  const offVisits = days.length - laneVisits;
  const lanePrice = visitPrice(service, petCount, true);
  const offPrice = visitPrice(service, petCount, false);
  const perWeek = laneVisits * lanePrice + offVisits * offPrice;
  const visits = visitsPerMonth(days, frequency);
  const factor = visits / days.length;
  return {
    perVisit: Math.round(perWeek / days.length),
    monthly: Math.round(perWeek * factor),
    visits,
    saved: Math.round(laneVisits * (offPrice - lanePrice) * factor),
  };
}

export function nextVisits(draft: BookingDraft, count = 6) {
  if (draft.mode === "once") return draft.date ? [draft.date] : [];
  if (!draft.startDate) return [];
  return occurrences({ days: draft.days, startDate: draft.startDate, frequency: draft.frequency, count });
}

export function makeReference(seed: string) {
  const n = hash(seed);
  return `PL-${n.toString(36).toUpperCase().slice(0, 5).padStart(5, "0")}`;
}

import type { ClockTime, Frequency, ISODate, Weekday } from "./types";

export const TODAY: ISODate = "2026-11-13";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function parseDate(iso: ISODate) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date): ISODate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: ISODate, n: number): ISODate {
  const d = parseDate(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function weekdayOf(iso: ISODate): Weekday {
  return parseDate(iso).getDay() as Weekday;
}

export function diffDays(a: ISODate, b: ISODate) {
  return Math.round((parseDate(a).getTime() - parseDate(b).getTime()) / 86_400_000);
}

export function formatDate(iso: ISODate, style: "short" | "long" | "day" | "weekday" | "month" = "short") {
  const d = parseDate(iso);
  const opts: Record<typeof style, Intl.DateTimeFormatOptions> = {
    short: { month: "short", day: "numeric" },
    long: { weekday: "long", month: "long", day: "numeric" },
    day: { weekday: "short", month: "short", day: "numeric" },
    weekday: { weekday: "short" },
    month: { month: "short", year: "numeric" },
  };
  return d.toLocaleDateString("en-US", opts[style]);
}

export function relativeDay(iso: ISODate) {
  const diff = diffDays(iso, TODAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return WEEKDAYS_LONG[weekdayOf(iso)];
  return formatDate(iso, "day");
}

export function formatTime(t: ClockTime) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function addMinutes(t: ClockTime, mins: number): ClockTime {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function arrivalWindow(t: ClockTime) {
  return `${formatTime(addMinutes(t, -15))} – ${formatTime(addMinutes(t, 15))}`;
}

export function daysLabel(days: Weekday[]) {
  const sorted = WEEK_ORDER.filter((d) => days.includes(d));
  if (sorted.length === 0) return "No days";
  if (sorted.length === 5 && !days.includes(0) && !days.includes(6)) return "Weekdays";
  if (sorted.length === 1) return `${WEEKDAYS_LONG[sorted[0]]}s`;
  const names = sorted.map((d) => WEEKDAYS[d]);
  return `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`;
}

export function startOfWeek(iso: ISODate): ISODate {
  const wd = weekdayOf(iso);
  return addDays(iso, wd === 0 ? -6 : 1 - wd);
}

export function occurrences(opts: {
  days: Weekday[];
  startDate: ISODate;
  frequency: Frequency;
  count: number;
}): ISODate[] {
  const { days, startDate, frequency, count } = opts;
  if (days.length === 0) return [];
  const out: ISODate[] = [];
  const anchorWeek = startOfWeek(startDate);
  let cursor = startDate;
  for (let i = 0; out.length < count && i < 400; i++) {
    const weekIndex = Math.floor(diffDays(startOfWeek(cursor), anchorWeek) / 7);
    const onWeek = frequency === "weekly" || weekIndex % 2 === 0;
    if (onWeek && days.includes(weekdayOf(cursor))) out.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return out;
}

export function visitsPerMonth(days: Weekday[], frequency: Frequency) {
  const perWeek = days.length;
  return Math.round(perWeek * (frequency === "weekly" ? 4.33 : 2.17));
}

export function monthGrid(year: number, month: number): (ISODate | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (ISODate | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(new Date(year, month, d)));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function ageFrom(birth: ISODate) {
  const months = Math.floor(diffDays(TODAY, birth) / 30.44);
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  return `${years} yr${years === 1 ? "" : "s"}`;
}

import type { Booking, Client, Zone } from "./types";

type Point = { x: number; y: number };

const MILES_PER_UNIT = 0.012;
const AVG_MPH = 17;

export interface RouteStop {
  booking: Booking;
  client: Client;
  point: Point;
}

export interface LaneRoute {
  zone: Zone;
  stops: RouteStop[];
  miles: number;
  driveMin: number;
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function pathLength(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i]);
  return total;
}

function toMiles(units: number) {
  return Math.round(units * MILES_PER_UNIT * 10) / 10;
}

function toMinutes(units: number) {
  return Math.round((units * MILES_PER_UNIT * 60) / AVG_MPH);
}

function orderStops(stops: RouteStop[], start: Point) {
  const byTime = new Map<string, RouteStop[]>();
  for (const s of stops) {
    const list = byTime.get(s.booking.time) ?? [];
    list.push(s);
    byTime.set(s.booking.time, list);
  }
  const ordered: RouteStop[] = [];
  let cursor = start;
  for (const time of [...byTime.keys()].sort()) {
    const pool = [...byTime.get(time)!];
    while (pool.length) {
      pool.sort((a, b) => dist(cursor, a.point) - dist(cursor, b.point));
      const next = pool.shift()!;
      ordered.push(next);
      cursor = next.point;
    }
  }
  return ordered;
}

export function planDay(opts: {
  bookings: Booking[];
  clients: Client[];
  zones: Zone[];
  hub: Point;
}) {
  const { bookings, clients, zones, hub } = opts;
  const active = bookings.filter((b) => b.status !== "cancelled");
  const stops: RouteStop[] = active.map((b) => {
    const client = clients.find((c) => c.id === b.clientId)!;
    return { booking: b, client, point: client.point };
  });

  const lanes: LaneRoute[] = zones
    .map((zone) => {
      const laneStops = orderStops(
        stops.filter((s) => s.booking.zoneId === zone.id),
        hub,
      );
      const units = laneStops.length ? pathLength([hub, ...laneStops.map((s) => s.point), hub]) : 0;
      return { zone, stops: laneStops, miles: toMiles(units), driveMin: toMinutes(units) };
    })
    .filter((l) => l.stops.length > 0);

  const walkers = Math.max(1, lanes.length);
  const byTime = [...stops].sort((a, b) => a.booking.time.localeCompare(b.booking.time));
  let naiveUnits = 0;
  for (let w = 0; w < walkers; w++) {
    const route = byTime.filter((_, i) => i % walkers === w).map((s) => s.point);
    if (route.length) naiveUnits += pathLength([hub, ...route, hub]);
  }
  const laneMiles = lanes.reduce((sum, l) => sum + l.miles, 0);
  const laneMinutes = lanes.reduce((sum, l) => sum + l.driveMin, 0);
  const naiveMinutes = toMinutes(naiveUnits);

  return {
    lanes,
    totals: {
      stops: stops.length,
      miles: Math.round(laneMiles * 10) / 10,
      driveMin: laneMinutes,
      naiveMiles: toMiles(naiveUnits),
      naiveDriveMin: naiveMinutes,
      savedMin: Math.max(0, naiveMinutes - laneMinutes),
    },
  };
}

export function smoothPath(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const mx = (p0.x + p1.x) / 2;
    d += ` Q ${mx} ${p0.y} ${mx} ${(p0.y + p1.y) / 2} T ${p1.x} ${p1.y}`;
  }
  return d;
}

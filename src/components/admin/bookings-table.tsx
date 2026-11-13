"use client";

import { useMemo, useState } from "react";
import { Check, Repeat, Search, X } from "lucide-react";
import { PetStack } from "@/components/shared/pet-avatar";
import { BookingStatusBadge } from "@/components/shared/status";
import { Select } from "@/components/ui/field";
import type { OpsSnapshot } from "@/lib/api";
import { diffDays, formatDate, formatTime } from "@/lib/schedule";
import type { BookingStatus } from "@/lib/types";
import { cn, money } from "@/lib/utils";

const TABS: { id: "upcoming" | BookingStatus | "all"; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

const PAGE = 14;

export function BookingsTable({ data }: { data: OpsSnapshot }) {
  const { bookings, clients, pets, zones, services, today } = data;
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("upcoming");
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("all");
  const [service, setService] = useState("all");
  const [limit, setLimit] = useState(PAGE);
  const [overrides, setOverrides] = useState<Record<string, BookingStatus>>({});

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .map((b) => ({ ...b, status: overrides[b.id] ?? b.status }))
      .filter((b) => {
        if (tab === "upcoming") return diffDays(b.date, today) >= 0 && b.status !== "cancelled";
        if (tab === "all") return true;
        return b.status === tab;
      })
      .filter((b) => zone === "all" || b.zoneId === zone)
      .filter((b) => service === "all" || b.serviceId === service)
      .filter((b) => {
        if (!q) return true;
        const client = clients.find((c) => c.id === b.clientId)!;
        const names = pets.filter((p) => b.petIds.includes(p.id)).map((p) => p.name);
        return [b.ref, client.name, client.street, ...names].some((s) => s.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        const cmp = a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date);
        return tab === "completed" || tab === "all" ? -cmp : cmp;
      });
  }, [bookings, clients, pets, tab, query, zone, service, overrides, today]);

  const counts = useMemo(() => {
    const withOverrides = bookings.map((b) => overrides[b.id] ?? b.status);
    return { pending: withOverrides.filter((s) => s === "pending").length };
  }, [bookings, overrides]);

  return (
    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200">
      <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-ink-100/70 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setLimit(PAGE);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                tab === t.id ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900",
              )}
            >
              {t.label}
              {t.id === "pending" && counts.pending > 0 && (
                <span className="rounded-full bg-coral-400 px-1.5 font-mono text-[10px] text-ink-950">{counts.pending}</span>
              )}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <label className="relative col-span-2 sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search client, pet, ref…"
              className="h-10 w-full rounded-xl bg-ink-100/70 pr-3 pl-9 text-sm outline-none placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-teal-600/30"
            />
          </label>
          <Select value={zone} onChange={(e) => setZone(e.target.value)} className="h-10 border-0 bg-ink-100/70 py-0 text-sm sm:w-40">
            <option value="all">All lanes</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.code} · {z.name}
              </option>
            ))}
          </Select>
          <Select value={service} onChange={(e) => setService(e.target.value)} className="h-10 border-0 bg-ink-100/70 py-0 text-sm sm:w-44">
            <option value="all">All services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <ul className="divide-y divide-ink-100 md:hidden">
        {rows.slice(0, limit).map((b) => {
          const client = clients.find((c) => c.id === b.clientId)!;
          const z = zones.find((x) => x.id === b.zoneId)!;
          const svc = services.find((x) => x.id === b.serviceId)!;
          const bPets = pets.filter((p) => b.petIds.includes(p.id));
          return (
            <li key={b.id} className="flex gap-3 px-4 py-3.5">
              <PetStack pets={bPets} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold">{client.name}</p>
                  <span className="shrink-0 font-mono text-sm">{money(b.price)}</span>
                </div>
                <p className="truncate text-sm text-ink-500">
                  {svc.name} · {bPets.map((p) => p.name).join(", ")}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                  <span className="font-medium whitespace-nowrap">
                    {formatDate(b.date, "day")} · {formatTime(b.time)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-ink-500">
                    <span className="size-1.5 rounded-full" style={{ background: z.color }} />
                    {z.code}
                  </span>
                  {b.subscriptionId && <Repeat className="size-3.5 text-ink-400" aria-label="Recurring" />}
                  <BookingStatusBadge status={b.status} short />
                </div>
                {b.status === "pending" && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOverrides((o) => ({ ...o, [b.id]: "confirmed" }))}
                      className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-teal-700 text-sm font-semibold text-white transition-transform active:scale-[0.97]"
                    >
                      <Check className="size-4" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverrides((o) => ({ ...o, [b.id]: "cancelled" }))}
                      className="flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold text-ink-600 ring-1 ring-ink-200 transition-transform active:scale-[0.97]"
                    >
                      <X className="size-4" /> Decline
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {rows.length === 0 && <p className="px-5 py-12 text-center text-ink-500 md:hidden">No bookings match those filters.</p>}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">
              <th className="px-5 py-3 font-normal">When</th>
              <th className="px-3 py-3 font-normal">Client</th>
              <th className="px-3 py-3 font-normal">Service</th>
              <th className="px-3 py-3 font-normal">Lane</th>
              <th className="px-3 py-3 font-normal">Status</th>
              <th className="px-3 py-3 text-right font-normal">Price</th>
              <th className="px-5 py-3 text-right font-normal">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.slice(0, limit).map((b) => {
              const client = clients.find((c) => c.id === b.clientId)!;
              const z = zones.find((x) => x.id === b.zoneId)!;
              const svc = services.find((s) => s.id === b.serviceId)!;
              const bPets = pets.filter((p) => b.petIds.includes(p.id));
              return (
                <tr key={b.id} className="transition-colors hover:bg-ink-100/40">
                  <td className="px-5 py-3">
                    <p className="font-semibold whitespace-nowrap">{formatDate(b.date, "day")}</p>
                    <p className="font-mono text-xs whitespace-nowrap text-ink-500">
                      {formatTime(b.time)} · {b.ref}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <PetStack pets={bPets} size={30} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{client.name}</p>
                        <p className="truncate text-xs text-ink-500">{bPets.map((p) => p.name).join(", ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="flex items-center gap-1.5">
                      {svc.name}
                      {b.subscriptionId && <Repeat className="size-3.5 text-ink-400" aria-label="Recurring" />}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                      <span className="size-2 rounded-full" style={{ background: z.color }} />
                      {z.code}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <BookingStatusBadge status={b.status} short />
                  </td>
                  <td className="px-3 py-3 text-right font-mono">{money(b.price)}</td>
                  <td className="px-5 py-3 text-right">
                    {b.status === "pending" ? (
                      <span className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => setOverrides((o) => ({ ...o, [b.id]: "confirmed" }))}
                          className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white hover:bg-teal-800"
                          aria-label={`Approve ${b.ref}`}
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOverrides((o) => ({ ...o, [b.id]: "cancelled" }))}
                          className="grid size-8 place-items-center rounded-lg text-ink-500 ring-1 ring-ink-200 hover:bg-ink-100"
                          aria-label={`Decline ${b.ref}`}
                        >
                          <X className="size-4" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-xs text-ink-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-5 py-12 text-center text-ink-500">No bookings match those filters.</p>}
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3 text-sm text-ink-500">
        <span>
          Showing {Math.min(limit, rows.length)} of {rows.length}
        </span>
        {limit < rows.length && (
          <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="font-semibold text-teal-700 hover:underline">
            Load more
          </button>
        )}
      </div>
    </section>
  );
}

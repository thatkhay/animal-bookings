"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, MapPin, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zoneForPostalCode } from "@/lib/api";
import { daysLabel } from "@/lib/schedule";
import type { Service } from "@/lib/types";

export function QuickBook({ services }: { services: Service[] }) {
  const router = useRouter();
  const [service, setService] = useState(services[0].id);
  const [zip, setZip] = useState("");
  const zone = zip.length === 5 ? zoneForPostalCode(zip) : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ service });
    if (zip) params.set("zip", zip);
    router.push(`/book?${params}`);
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-2 rounded-[22px] bg-white p-2 text-ink-900 shadow-lift md:grid-cols-[1.3fr_1fr_auto]"
    >
      <label className="flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors focus-within:bg-mint-50 hover:bg-mint-50">
        <PawPrint className="size-5 shrink-0 text-teal-700" />
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] tracking-[0.16em] text-ink-400 uppercase">Service</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value as Service["id"])}
            className="w-full cursor-pointer appearance-none bg-transparent text-[15px] font-semibold outline-none"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors focus-within:bg-mint-50 hover:bg-mint-50 md:border-l md:border-mint-200 md:rounded-l-none">
        <MapPin className="size-5 shrink-0 text-teal-700" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-ink-400 uppercase">
            ZIP code
            {zone && (
              <span className="normal-case tracking-normal text-teal-700">
                {zone.name} · {daysLabel(zone.laneDays)}
              </span>
            )}
            {zip.length === 5 && !zone && <span className="normal-case tracking-normal text-coral-600">Not covered yet</span>}
          </span>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            inputMode="numeric"
            placeholder="e.g. 40211"
            className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-400"
            aria-label="ZIP code"
          />
        </span>
      </label>

      <Button type="submit" size="lg" variant="dark" className="h-auto min-h-13 rounded-2xl">
        Find my slots <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

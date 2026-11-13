"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronUp, Loader2, ShieldCheck } from "lucide-react";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { Button } from "@/components/ui/button";
import { isLaneDay, planEstimate, visitPrice, type BookingDraft } from "@/lib/booking";
import { daysLabel, formatDate, formatTime } from "@/lib/schedule";
import type { Pet, Service, Zone } from "@/lib/types";
import { cn, money } from "@/lib/utils";

type Props = { draft: BookingDraft; service?: Service; zone?: Zone; pets: Pet[] };

function computeTotals({ draft, service, zone }: Props) {
  if (!service) return null;
  const count = Math.max(1, draft.petIds.length);
  if (draft.mode === "recurring" && service.recurring && draft.days.length > 0) {
    const est = planEstimate({ service, zone, petCount: count, days: draft.days, frequency: draft.frequency });
    return { label: "Estimated", headline: est.monthly, unit: "/ month", saved: est.saved, monthly: true };
  }
  if (!draft.date) {
    return { label: "From", headline: visitPrice(service, count, !!zone), unit: "/ visit", saved: 0, monthly: false };
  }
  const price = visitPrice(service, count, isLaneDay(zone, draft.date));
  const full = visitPrice(service, count, false);
  return { label: "Total", headline: price, unit: "/ visit", saved: full - price, monthly: false };
}

export function BookingSummary(props: Props) {
  const { draft, service, zone, pets } = props;
  const totals = computeTotals(props);
  const chosen = pets.filter((p) => draft.petIds.includes(p.id));

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-mint-200">
      <div className="relative h-28 bg-ink-900">
        {service && (
          <Image src={service.image} alt="" fill loading="eager" sizes="380px" className="object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 to-ink-950/10" />
        <div className="absolute inset-x-5 bottom-4 text-white">
          <p className="font-mono text-[10.5px] tracking-[0.16em] text-white/60 uppercase">Your booking</p>
          <p className="font-display text-2xl leading-tight font-bold uppercase">{service?.name ?? "Choose a service"}</p>
        </div>
      </div>

      <dl className="space-y-3.5 px-5 py-5 text-sm">
        <SummaryRow label="Lane">
          {zone ? (
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: zone.color }} />
              {zone.name} <span className="text-ink-400">· {zone.walker.name.split(" ")[0]}</span>
            </span>
          ) : (
            <Empty />
          )}
        </SummaryRow>
        <SummaryRow label="Pets">
          {chosen.length ? (
            <span className="flex items-center gap-2">
              <span className="flex -space-x-2">
                {chosen.map((p) => (
                  <PetAvatar key={p.id} pet={p} size={24} ring />
                ))}
              </span>
              <span className="truncate">{chosen.map((p) => p.name).join(", ")}</span>
            </span>
          ) : (
            <Empty />
          )}
        </SummaryRow>
        <SummaryRow label="When">
          {draft.mode === "once" || !service?.recurring ? (
            draft.date ? (
              `${formatDate(draft.date, "day")}${draft.time ? ` · ${formatTime(draft.time)}` : ""}`
            ) : (
              <Empty />
            )
          ) : draft.days.length ? (
            `${daysLabel(draft.days)}${draft.time ? ` · ${formatTime(draft.time)}` : ""}`
          ) : (
            <Empty />
          )}
        </SummaryRow>
        {draft.mode === "recurring" && service?.recurring && draft.startDate && (
          <SummaryRow label="Starts">{formatDate(draft.startDate, "day")}</SummaryRow>
        )}
      </dl>

      <div className="border-t border-dashed border-mint-300 px-5 py-5">
        {totals ? (
          <>
            <div className="flex items-end justify-between">
              <span className="text-sm text-ink-500">{totals.label}</span>
              <span>
                <span className="font-display text-4xl leading-none font-bold">{money(totals.headline)}</span>
                {totals.headline > 0 && <span className="ml-1 text-sm text-ink-500">{totals.unit}</span>}
              </span>
            </div>
            {totals.saved > 0 && (
              <p className="mt-2 rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800">
                Lane-day pricing applied · saving {money(totals.saved)}
                {totals.monthly ? " / month" : ""}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-ink-400">Price appears once you pick a service.</p>
        )}
        <p className="mt-4 flex items-center gap-2 text-xs text-ink-500">
          <ShieldCheck className="size-4 text-teal-700" /> No charge until a visit is completed.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{children}</dd>
    </div>
  );
}

function Empty() {
  return <span className="text-ink-300">—</span>;
}

export function MobileSummaryBar({
  step,
  canContinue,
  isLast,
  submitting,
  onBack,
  onNext,
  ...props
}: Props & {
  step: number;
  canContinue: boolean;
  isLast: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const [open, setOpen] = useState(false);
  const totals = computeTotals(props);

  return (
    <>
      <BottomSheet open={open} onClose={() => setOpen(false)} label="Booking summary">
        <div className="px-3 pb-4">
          <BookingSummary {...props} />
        </div>
      </BottomSheet>
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="border-t border-mint-200 bg-white/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl text-left transition-transform active:scale-[0.97]"
            aria-expanded={open}
          >
            <ChevronUp className={cn("size-4 shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
            <span className="min-w-0">
              <span className="block font-mono text-[10px] tracking-wider text-ink-400 uppercase">Summary</span>
              <span className="block truncate font-semibold">
                {totals ? `${money(totals.headline)} ${totals.headline > 0 ? totals.unit : ""}` : "—"}
              </span>
            </span>
          </button>
          {step > 0 && (
            <Button variant="outline" size="icon" onClick={onBack} aria-label="Back">
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <Button
            variant={isLast ? "primary" : "dark"}
            onClick={onNext}
            disabled={!canContinue || submitting}
          >
            {isLast ? (
              <>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Send request
              </>
            ) : (
              <>
                Continue <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}

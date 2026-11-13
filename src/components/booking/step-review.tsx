"use client";

import { Pencil } from "lucide-react";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { Field, Input, Textarea } from "@/components/ui/field";
import { arrivalWindow, daysLabel, formatDate, formatTime } from "@/lib/schedule";
import type { Pet, Service, Zone } from "@/lib/types";
import { StepHeader, type StepProps } from "./booking-wizard";

export function StepReview({
  draft,
  update,
  service,
  zone,
  pets,
  onEdit,
}: StepProps & { service: Service; zone?: Zone; pets: Pet[]; onEdit: (step: number) => void }) {
  const chosen = pets.filter((p) => draft.petIds.includes(p.id));
  const schedule =
    draft.mode === "once"
      ? draft.date && draft.time
        ? `${formatDate(draft.date, "long")} · arrive ${arrivalWindow(draft.time)}`
        : "—"
      : draft.time && draft.startDate
        ? `${draft.frequency === "weekly" ? "Every" : "Every other"} ${daysLabel(draft.days)} at ${formatTime(draft.time)}, from ${formatDate(draft.startDate)}`
        : "—";

  return (
    <section>
      <StepHeader title="Check and send">
        This sends a request, not a charge. We&apos;ll review pet profiles and route capacity and confirm by email —
        usually within two hours.
      </StepHeader>

      <dl className="divide-y divide-mint-200 overflow-hidden rounded-2xl bg-white ring-1 ring-mint-200">
        <Row label="Service" onEdit={() => onEdit(0)}>
          {service.name} · {service.durationMin} min
        </Row>
        <Row label="Address" onEdit={() => onEdit(1)}>
          {draft.street}, {draft.postalCode}
          {zone && <span className="block text-sm text-ink-500">{zone.name} lane · {zone.walker.name}</span>}
        </Row>
        <Row label="Pets" onEdit={() => onEdit(2)}>
          <span className="flex flex-wrap items-center gap-3">
            {chosen.map((p) => (
              <span key={p.id} className="flex items-center gap-2">
                <PetAvatar pet={p} size={28} /> {p.name}
              </span>
            ))}
          </span>
        </Row>
        <Row label={draft.mode === "once" ? "When" : "Plan"} onEdit={() => onEdit(3)}>
          {schedule}
        </Row>
      </dl>

      <h2 className="mt-10 font-display text-2xl font-bold uppercase">Your details</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <Input value={draft.name} onChange={(e) => update({ name: e.target.value })} autoComplete="name" />
        </Field>
        <Field label="Phone" hint="For day-of updates only.">
          <Input value={draft.phone} onChange={(e) => update({ phone: e.target.value })} autoComplete="tel" type="tel" />
        </Field>
        <Field label="Email" className="sm:col-span-2" hint="Your confirmation and visit reports go here.">
          <Input value={draft.email} onChange={(e) => update({ email: e.target.value })} autoComplete="email" type="email" />
        </Field>
        <Field label="Anything else?" optional className="sm:col-span-2">
          <Textarea
            value={draft.notes}
            onChange={(e) => update({ notes: e.target.value })}
            rows={3}
            placeholder="First visit nerves, a new harness, a vet trip that week…"
          />
        </Field>
      </div>

      <p className="mt-6 text-sm text-ink-500">
        By sending this request you agree to our cancellation policy: free up to 12 hours before a visit, 50% after
        that. Nothing is charged until a visit is completed.
      </p>
    </section>
  );
}

function Row({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <dt className="w-20 shrink-0 pt-0.5 font-mono text-[11px] tracking-[0.14em] text-ink-400 uppercase">{label}</dt>
      <dd className="min-w-0 flex-1 font-medium">{children}</dd>
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-teal-700 hover:bg-teal-50"
      >
        <Pencil className="size-3.5" /> Edit
      </button>
    </div>
  );
}

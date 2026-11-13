"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus, TriangleAlert } from "lucide-react";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { VaccineBadge } from "@/components/shared/status";
import { petVaccineStatus } from "@/lib/api";
import { ageFrom } from "@/lib/schedule";
import type { Pet, Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StepHeader, type StepProps } from "./booking-wizard";
import { PetForm } from "./pet-form";

export function StepPets({
  draft,
  update,
  service,
  savedPets,
}: StepProps & { service: Service; savedPets: Pet[] }) {
  const [adding, setAdding] = useState(savedPets.length === 0);
  const pets = [...savedPets, ...draft.newPets];
  const full = draft.petIds.length >= service.capacity;

  const toggle = (pet: Pet) => {
    if (draft.petIds.includes(pet.id)) {
      update({ petIds: draft.petIds.filter((id) => id !== pet.id) });
    } else if (service.capacity === 1) {
      update({ petIds: [pet.id] });
    } else if (!full) {
      update({ petIds: [...draft.petIds, pet.id] });
    }
  };

  return (
    <section>
      <StepHeader title="Who's coming along?">
        {service.capacity === 1
          ? `${service.name} is one pet per visit.`
          : `Choose up to ${service.capacity} pets from the same home. Extra pets are half price.`}{" "}
        Their profile goes to the walker before every visit.
      </StepHeader>

      <div className="grid gap-3 sm:grid-cols-2">
        {pets.map((pet) => {
          const selected = draft.petIds.includes(pet.id);
          const allowed = service.species.includes(pet.species);
          const vax = petVaccineStatus(pet);
          const disabled = !allowed || (!selected && full && service.capacity > 1);
          return (
            <button
              key={pet.id}
              type="button"
              onClick={() => allowed && toggle(pet)}
              disabled={disabled}
              aria-pressed={selected}
              className={cn(
                "relative flex items-start gap-4 rounded-2xl bg-white p-4 text-left ring-1 transition-all",
                selected ? "ring-2 ring-teal-600 shadow-lift" : "ring-mint-200 hover:ring-ink-300",
                disabled && "cursor-not-allowed opacity-50 hover:ring-mint-200",
              )}
            >
              <PetAvatar pet={pet} size={56} />
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold">{pet.name}</span>
                <span className="block truncate text-sm text-ink-500">
                  {pet.breed} · {ageFrom(pet.birthDate)} · {pet.weightLb} lb
                </span>
                <span className="mt-2.5 flex flex-wrap gap-1.5">
                  {allowed ? (
                    <VaccineBadge status={vax} />
                  ) : (
                    <span className="text-xs font-medium text-ink-500">
                      {service.name} is for {service.species.join(" & ")}s
                    </span>
                  )}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-md ring-1 transition-colors",
                  selected ? "bg-teal-600 text-white ring-teal-600" : "bg-white ring-mint-300",
                )}
              >
                {selected && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}

        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-[104px] items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mint-300 text-[15px] font-semibold text-teal-800 transition-colors hover:border-teal-600 hover:bg-white"
          >
            <Plus className="size-4" /> Add a new pet
          </button>
        )}
      </div>

      <SelectedWarnings pets={pets.filter((p) => draft.petIds.includes(p.id))} service={service} />

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <PetForm
              className="mt-6"
              onCancel={savedPets.length ? () => setAdding(false) : undefined}
              onSave={(pet) => {
                const canSelect = service.species.includes(pet.species) && (service.capacity === 1 || !full);
                update({
                  newPets: [...draft.newPets, pet],
                  petIds: canSelect
                    ? service.capacity === 1
                      ? [pet.id]
                      : [...draft.petIds, pet.id]
                    : draft.petIds,
                });
                setAdding(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SelectedWarnings({ pets, service }: { pets: Pet[]; service: Service }) {
  const flagged = pets.filter((p) => petVaccineStatus(p) !== "valid");
  if (!flagged.length) return null;
  return (
    <div className="mt-5 flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-600/20">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
      <p>
        <strong>{flagged.map((p) => p.name).join(" and ")}</strong> {flagged.length > 1 ? "have" : "has"} a vaccine
        that&apos;s due soon or out of date. You can still book
        {service.id === "pack-walk" ? ", but pack walks need current records" : ""} — upload the new certificate from
        the pet profile before the first visit.
      </p>
    </div>
  );
}

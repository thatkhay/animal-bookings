"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { PetForm } from "@/components/booking/pet-form";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { VaccineBadge } from "@/components/shared/status";
import { petVaccineStatus } from "@/lib/api";
import { ageFrom } from "@/lib/schedule";
import type { Pet } from "@/lib/types";

export function PetsGrid({ initialPets }: { initialPets: Pet[] }) {
  const [pets, setPets] = useState(initialPets);
  const [adding, setAdding] = useState(false);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((p) => (
          <PetCard key={p.id} pet={p} />
        ))}
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-mint-300 text-teal-800 transition-colors hover:border-teal-600 hover:bg-white"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-teal-50">
            <Plus className="size-5" />
          </span>
          <span className="font-semibold">Add a pet</span>
          <span className="max-w-52 text-center text-sm text-ink-500">Takes about two minutes. Vaccine records can come later.</span>
        </button>
      </div>

      <BottomSheet open={adding} onClose={() => setAdding(false)} label="Add a pet" centerOnDesktop>
        <PetForm
          className="rounded-none pt-1 shadow-none ring-0"
          onCancel={() => setAdding(false)}
          onSave={(pet) => {
            setPets((list) => [...list, pet]);
            setAdding(false);
          }}
        />
      </BottomSheet>
    </>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const saved = !pet.id.startsWith("new-");
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mint-200">
        {pet.photo ? (
          <Image
            src={pet.photo}
            alt={pet.name}
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 hover-device:group-hover:scale-[1.03]"
          />
        ) : (
          <span className="grid size-full place-items-center font-display text-7xl font-bold text-teal-800/30 uppercase">
            {pet.name.slice(0, 2)}
          </span>
        )}
        <span className="absolute top-3 left-3">
          <VaccineBadge status={petVaccineStatus(pet)} />
        </span>
        {saved && (
          <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white text-ink-900 opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>
      <div className="px-2 pt-4 pb-2">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl leading-none font-bold uppercase">{pet.name}</h2>
          <span className="font-mono text-xs text-ink-400 capitalize">{pet.species}</span>
        </div>
        <p className="mt-1.5 text-sm text-ink-500">
          {pet.breed} · {ageFrom(pet.birthDate)} · {pet.weightLb} lb
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pet.behavior.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-medium text-teal-900">
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  return saved ? (
    <Link href={`/account/pets/${pet.id}`} className="group rounded-3xl bg-white p-2 ring-1 ring-mint-200 transition-[box-shadow,transform] duration-150 active:scale-[0.98] hover:shadow-lift">
      {body}
    </Link>
  ) : (
    <div className="group rounded-3xl bg-white p-2 ring-1 ring-teal-600/40">{body}</div>
  );
}

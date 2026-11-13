"use client";

import { useState } from "react";
import { Cat, Dog, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { Pet, Species, Vaccination } from "@/lib/types";
import { cn } from "@/lib/utils";

const TAGS = [
  "Good with dogs",
  "Leash reactive",
  "Pulls",
  "Food motivated",
  "Sound sensitive",
  "Escape artist",
  "Senior",
  "Puppy",
  "Shy with strangers",
  "Loves water",
];

const DEFAULT_VACCINES: Record<Species, string[]> = {
  dog: ["Rabies", "DHPP", "Bordetella"],
  cat: ["Rabies", "FVRCP"],
};

export function PetForm({
  onSave,
  onCancel,
  className,
}: {
  onSave: (pet: Pet) => void;
  onCancel?: () => void;
  className?: string;
}) {
  const [species, setSpecies] = useState<Species>("dog");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState<Pet["sex"]>("Female");
  const [tags, setTags] = useState<string[]>([]);
  const [energy, setEnergy] = useState<Pet["behavior"]["energy"]>(3);
  const [notes, setNotes] = useState("");
  const [vaccines, setVaccines] = useState<Vaccination[]>(
    DEFAULT_VACCINES.dog.map((n) => ({ name: n, givenOn: "", expiresOn: "" })),
  );

  const switchSpecies = (s: Species) => {
    setSpecies(s);
    setVaccines(DEFAULT_VACCINES[s].map((n) => ({ name: n, givenOn: "", expiresOn: "" })));
  };

  const canSave = name.trim().length > 0 && breed.trim().length > 0;

  const save = () => {
    onSave({
      id: `new-${name.toLowerCase().replace(/\W+/g, "-")}-${Date.now().toString(36)}`,
      ownerId: "me",
      name: name.trim(),
      species,
      breed: breed.trim(),
      sex,
      birthDate: birthDate || "2024-01-01",
      weightLb: Number(weight) || 0,
      photo: "",
      vaccinations: vaccines.filter((v) => v.expiresOn),
      behavior: { tags, energy, notes },
      care: { feeding: "", medication: "", vet: "" },
    });
  };

  return (
    <div className={cn("rounded-3xl bg-white p-5 shadow-soft ring-1 ring-mint-200 sm:p-7", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-bold uppercase">New pet profile</h2>
        <div className="flex rounded-xl bg-mint-100 p-1" role="radiogroup" aria-label="Species">
          {(["dog", "cat"] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={species === s}
              onClick={() => switchSpecies(s)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                species === s ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900",
              )}
            >
              {s === "dog" ? <Dog className="size-4" /> : <Cat className="size-4" />} {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={species === "dog" ? "Biscuit" : "Clementine"} />
        </Field>
        <Field label="Breed">
          <Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Mixed breeds welcome" />
        </Field>
        <div className="grid grid-cols-3 gap-3 sm:col-span-2">
          <Field label="Birthday" optional>
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </Field>
          <Field label="Weight (lb)">
            <Input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value.replace(/[^\d.]/g, ""))} placeholder="26" />
          </Field>
          <Field label="Sex">
            <Select value={sex} onChange={(e) => setSex(e.target.value as Pet["sex"])}>
              <option>Female</option>
              <option>Male</option>
            </Select>
          </Field>
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-ink-800">Vaccination records</legend>
        <p className="mt-0.5 text-xs text-ink-500">Add expiry dates now, upload certificates later from the pet profile.</p>
        <div className="mt-3 space-y-2">
          {vaccines.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 rounded-xl bg-mint-50 p-2 sm:grid-cols-[140px_1fr_1fr_auto]">
              <Input
                value={v.name}
                onChange={(e) => setVaccines(vaccines.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                className="col-span-3 bg-white sm:col-span-1"
                aria-label="Vaccine name"
              />
              <Input
                type="date"
                value={v.expiresOn}
                onChange={(e) => setVaccines(vaccines.map((x, j) => (j === i ? { ...x, expiresOn: e.target.value } : x)))}
                aria-label={`${v.name} expiry date`}
                className="col-span-2 bg-white sm:col-span-1"
              />
              <span className="hidden items-center gap-1.5 text-xs text-ink-500 sm:flex">
                <Upload className="size-3.5" /> Certificate (later)
              </span>
              <button
                type="button"
                onClick={() => setVaccines(vaccines.filter((_, j) => j !== i))}
                className="grid size-9 place-items-center rounded-lg text-ink-400 hover:bg-white hover:text-red-600"
                aria-label={`Remove ${v.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setVaccines([...vaccines, { name: "", givenOn: "", expiresOn: "" }])}
            className="flex items-center gap-1.5 px-1 py-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            <Plus className="size-4" /> Add vaccine
          </button>
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-ink-800">Behavior</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t])}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors",
                  on ? "bg-ink-900 text-white ring-ink-900" : "bg-white text-ink-600 ring-mint-300 hover:ring-ink-300",
                )}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-800">Energy level</span>
            <span className="font-mono text-xs text-ink-500">
              {["", "Couch potato", "Easygoing", "Average", "Lively", "Rocket"][energy]}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setEnergy(n)}
                aria-label={`Energy ${n} of 5`}
                className={cn(
                  "h-2.5 rounded-full transition-colors",
                  n <= energy ? "bg-linear-to-r from-teal-500 to-teal-600" : "bg-mint-200 hover:bg-mint-300",
                )}
              />
            ))}
          </div>
        </div>

        <Field label="Anything the walker should know?" optional className="mt-5">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Triggers, favorite routes, how they like to be greeted…"
          />
        </Field>
      </fieldset>

      <div className="mt-7 flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="teal" onClick={save} disabled={!canSave}>
          Save {name.trim() || "pet"}
        </Button>
      </div>
    </div>
  );
}

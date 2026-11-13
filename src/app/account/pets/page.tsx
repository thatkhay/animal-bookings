import type { Metadata } from "next";
import { PetsGrid } from "@/components/account/pets-grid";
import { getPetsForClient } from "@/lib/api";

export const metadata: Metadata = { title: "Pet profiles" };

export default async function PetsPage() {
  const pets = await getPetsForClient();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-ink-400 uppercase">Pet profiles</p>
          <h1 className="mt-2 font-display text-5xl leading-none font-bold uppercase sm:text-6xl">Your crew</h1>
        </div>
        <p className="max-w-md text-ink-500">
          Walkers read these before every visit. Keep notes current and we&apos;ll remind you before any vaccine
          expires.
        </p>
      </div>
      <PetsGrid initialPets={pets} />
    </div>
  );
}

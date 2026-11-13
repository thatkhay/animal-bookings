import Image from "next/image";
import type { Pet } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PetAvatar({
  pet,
  size = 40,
  className,
  ring,
}: {
  pet: Pick<Pet, "name" | "photo">;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-mint-200",
        ring && "ring-2 ring-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {pet.photo ? (
        <Image src={pet.photo} alt={pet.name} fill sizes={`${size * 2}px`} className="object-cover" />
      ) : (
        <span className="grid size-full place-items-center font-display text-sm font-bold text-teal-800 uppercase">
          {pet.name.slice(0, 2)}
        </span>
      )}
    </span>
  );
}

export function PetStack({ pets, size = 32 }: { pets: Pick<Pet, "name" | "photo" | "id">[]; size?: number }) {
  return (
    <span className="flex -space-x-2.5">
      {pets.map((p) => (
        <PetAvatar key={p.id} pet={p} size={size} ring />
      ))}
    </span>
  );
}

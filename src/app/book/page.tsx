import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getCurrentClient, getPetsForClient, getServices } from "@/lib/api";

export const metadata: Metadata = { title: "Book a visit" };

export default async function BookPage() {
  const [services, client, savedPets] = await Promise.all([getServices(), getCurrentClient(), getPetsForClient()]);

  return (
    <Suspense fallback={<WizardSkeleton />}>
      <BookingWizard services={services} client={client} savedPets={savedPets} />
    </Suspense>
  );
}

function WizardSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-12 px-4 pt-10 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="h-3 w-24 rounded bg-mint-200" />
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1.5 rounded-full bg-mint-200" />
          ))}
        </div>
        <div className="mt-10 h-12 w-2/3 rounded-xl bg-mint-200" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white" />
          ))}
        </div>
      </div>
      <div className="hidden h-96 rounded-3xl bg-white lg:block" />
    </div>
  );
}

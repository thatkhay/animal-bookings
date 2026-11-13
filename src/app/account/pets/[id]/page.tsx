import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileUp, Pill, Stethoscope, UtensilsCrossed } from "lucide-react";
import { VaccineBadge } from "@/components/shared/status";
import { Button, ButtonLink } from "@/components/ui/button";
import { findService, getPet, getPetIds, getVisitHistory, petVaccineStatus, vaccineStatus } from "@/lib/api";
import { ageFrom, diffDays, formatDate, TODAY } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const ids = await getPetIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/account/pets/[id]">): Promise<Metadata> {
  const pet = await getPet((await params).id);
  return { title: pet ? `${pet.name}'s profile` : "Pet profile" };
}

const ENERGY = ["", "Couch potato", "Easygoing", "Average", "Lively", "Rocket"];

export default async function PetPage({ params }: PageProps<"/account/pets/[id]">) {
  const { id } = await params;
  const pet = await getPet(id);
  if (!pet) notFound();
  const history = await getVisitHistory(pet.id);
  const status = petVaccineStatus(pet);

  return (
    <div>
      <Link href="/account/pets" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="size-4" /> All pets
      </Link>

      <section className="mt-5 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-mint-200 lg:aspect-auto lg:min-h-[420px]">
          <Image src={pet.photo} alt={pet.name} fill priority sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col rounded-3xl bg-ink-900 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <VaccineBadge status={status} />
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-white/15">
              {pet.species}
            </span>
          </div>
          <h1 className="mt-5 font-display text-7xl leading-[0.85] font-extrabold uppercase sm:text-8xl">{pet.name}</h1>
          <p className="mt-3 text-lg text-white/65">{pet.breed}</p>

          <dl className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 pt-0 sm:grid-cols-4">
            {[
              ["Age", ageFrom(pet.birthDate)],
              ["Weight", `${pet.weightLb} lb`],
              ["Sex", pet.sex],
              ["Visits", String(history.length)],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink-900 p-4">
                <dt className="font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">{k}</dt>
                <dd className="mt-1 font-display text-3xl font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/book" size="md">
              Book for {pet.name}
            </ButtonLink>
            <Button variant="light">Edit profile</Button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Panel title="Behavior">
            <div className="flex flex-wrap gap-2">
              {pet.behavior.tags.map((t) => (
                <span key={t} className="rounded-full bg-mint-100 px-3 py-1 text-sm font-medium text-teal-900">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Energy</span>
                <span className="font-mono text-xs text-ink-500">{ENERGY[pet.behavior.energy]}</span>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={cn("h-2 rounded-full", n <= pet.behavior.energy ? "bg-teal-600" : "bg-mint-200")} />
                ))}
              </div>
            </div>
            <blockquote className="mt-5 border-l-2 border-coral-400 pl-4 text-[15px] leading-relaxed text-ink-600">
              {pet.behavior.notes}
            </blockquote>
          </Panel>

          <Panel title="Care">
            <ul className="space-y-4">
              <CareRow icon={UtensilsCrossed} label="Feeding" value={pet.care.feeding} />
              <CareRow icon={Pill} label="Medication" value={pet.care.medication} />
              <CareRow icon={Stethoscope} label="Vet" value={pet.care.vet} />
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            title="Vaccinations"
            action={
              <Button variant="outline" size="sm">
                <FileUp className="size-4" /> Upload record
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">
                    <th className="pb-3 font-normal">Vaccine</th>
                    <th className="pb-3 font-normal">Given</th>
                    <th className="pb-3 font-normal">Expires</th>
                    <th className="pb-3 text-right font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mint-200">
                  {pet.vaccinations.map((v) => {
                    const s = vaccineStatus(v);
                    const days = diffDays(v.expiresOn, TODAY);
                    return (
                      <tr key={v.name}>
                        <td className="py-3 font-semibold">{v.name}</td>
                        <td className="py-3 text-ink-500">{formatDate(v.givenOn, "month")}</td>
                        <td className="py-3 text-ink-500">{formatDate(v.expiresOn, "month")}</td>
                        <td className="py-3 text-right">
                          <VaccineBadge
                            status={s}
                            label={s === "valid" ? "Current" : s === "expiring" ? `${days} days left` : "Expired"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Visit reports">
            {history.length === 0 && <p className="text-sm text-ink-500">No visits yet.</p>}
            <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-mint-300">
              {history.slice(0, 5).map(({ booking, report }) => (
                <li key={booking.id} className="relative pl-7">
                  <span className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-teal-600 bg-white" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{findService(booking.serviceId)!.name}</p>
                    <p className="font-mono text-xs text-ink-400">{formatDate(booking.date, "day")}</p>
                  </div>
                  {report && (
                    <>
                      <p className="mt-1 text-sm text-ink-600">{report.note}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {report.distanceMi > 0 && (
                          <span className="rounded-md bg-ink-900 px-2 py-0.5 font-mono text-[11px] text-white">
                            {report.distanceMi} mi
                          </span>
                        )}
                        <span className="rounded-md bg-ink-900 px-2 py-0.5 font-mono text-[11px] text-white">
                          {report.activeMin} min
                        </span>
                        {report.checks.map((c) => (
                          <span key={c} className="rounded-md bg-mint-100 px-2 py-0.5 text-[11px] font-medium text-teal-900">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-mint-200 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-bold uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function CareRow({ icon: Icon, label, value }: { icon: typeof Pill; label: string; value: string }) {
  return (
    <li className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-teal-800">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">{label}</p>
        <p className="mt-0.5 text-[15px]">{value || "—"}</p>
      </div>
    </li>
  );
}

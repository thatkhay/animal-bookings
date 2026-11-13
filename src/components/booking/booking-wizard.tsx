"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findService, zoneForPostalCode } from "@/lib/api";
import { emptyDraft, makeReference, type BookingDraft } from "@/lib/booking";
import type { Client, Pet, Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookingSummary, MobileSummaryBar } from "./booking-summary";
import { Confirmation } from "./confirmation";
import { StepAddress } from "./step-address";
import { StepPets } from "./step-pets";
import { StepReview } from "./step-review";
import { StepSchedule } from "./step-schedule";
import { StepService } from "./step-service";

const STEPS = [
  { key: "service", label: "Service" },
  { key: "address", label: "Address" },
  { key: "pets", label: "Pets" },
  { key: "schedule", label: "Schedule" },
  { key: "review", label: "Review" },
] as const;

const STORAGE_KEY = "pawlane:booking-draft";

export type StepProps = {
  draft: BookingDraft;
  update: (patch: Partial<BookingDraft>) => void;
};

export function BookingWizard({
  services,
  savedPets,
  client,
}: {
  services: Service[];
  savedPets: Pet[];
  client: Client;
}) {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<BookingDraft>(() => {
    const fromUrl = params.get("service");
    const zip = params.get("zip");
    const base: BookingDraft = {
      ...emptyDraft,
      name: client.name,
      email: client.email,
      phone: client.phone,
      postalCode: zip ?? client.postalCode,
      street: zip && zip !== client.postalCode ? "" : client.street,
    };
    if (fromUrl && findService(fromUrl)) {
      const svc = findService(fromUrl)!;
      return { ...base, serviceId: svc.id, mode: svc.recurring ? "recurring" : "once" };
    }
    return base;
  });

  useEffect(() => {
    if (params.get("service") || params.get("zip")) return;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setDraft((d) => ({ ...d, ...JSON.parse(saved) }));
    } catch {}
  }, [params]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const update = (patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const service = draft.serviceId ? findService(draft.serviceId) : undefined;
  const zone = zoneForPostalCode(draft.postalCode);
  const allPets = useMemo(() => [...savedPets, ...draft.newPets], [savedPets, draft.newPets]);

  const valid = [
    !!service,
    !!zone && draft.street.trim().length > 3,
    draft.petIds.length > 0 && (!service || draft.petIds.length <= service.capacity),
    draft.mode === "once"
      ? !!draft.date && !!draft.time
      : draft.days.length > 0 && !!draft.time && !!draft.startDate,
    draft.name.trim().length > 1 && /\S+@\S+\.\S+/.test(draft.email),
  ];

  const go = (to: number) => {
    setDirection(to > step ? 1 : -1);
    setStep(to);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setReference(makeReference(JSON.stringify(draft)));
      setSubmitting(false);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }, 900);
  };

  if (reference && service) {
    return <Confirmation reference={reference} draft={draft} service={service} zone={zone} pets={allPets} />;
  }

  const isLast = step === STEPS.length - 1;
  const stepProps: StepProps = { draft, update };

  return (
    <div ref={topRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-6 pb-32 sm:px-6 lg:pt-10 lg:pb-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="min-w-0">
          <Progress step={step} valid={valid} onJump={go} />

          <div className="relative mt-6 sm:mt-8">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && <StepService {...stepProps} services={services} />}
                {step === 1 && <StepAddress {...stepProps} />}
                {step === 2 && service && <StepPets {...stepProps} service={service} savedPets={savedPets} />}
                {step === 3 && service && <StepSchedule {...stepProps} service={service} zone={zone} />}
                {step === 4 && service && (
                  <StepReview {...stepProps} service={service} zone={zone} pets={allPets} onEdit={go} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 hidden items-center justify-between border-t border-mint-200 pt-6 lg:flex">
            <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            {isLast ? (
              <Button size="lg" onClick={submit} disabled={!valid.every(Boolean) || submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {submitting ? "Sending request…" : "Send booking request"}
              </Button>
            ) : (
              <Button size="lg" variant="dark" onClick={() => go(step + 1)} disabled={!valid[step]}>
                Continue <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BookingSummary draft={draft} service={service} zone={zone} pets={allPets} />
          </div>
        </aside>
      </div>

      <MobileSummaryBar
        draft={draft}
        service={service}
        zone={zone}
        pets={allPets}
        step={step}
        canContinue={valid[step]}
        isLast={isLast}
        submitting={submitting}
        onBack={() => go(step - 1)}
        onNext={() => (isLast ? submit() : go(step + 1))}
      />
    </div>
  );
}

function Progress({ step, valid, onJump }: { step: number; valid: boolean[]; onJump: (i: number) => void }) {
  return (
    <nav aria-label="Booking progress">
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink-400 uppercase">
        Step {step + 1} of {STEPS.length}
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-1.5">
        {STEPS.map((s, i) => {
          const reachable = i <= step || valid.slice(0, i).every(Boolean);
          const done = i < step;
          return (
            <li key={s.key}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onJump(i)}
                className="group w-full text-left disabled:cursor-not-allowed"
                aria-current={i === step ? "step" : undefined}
              >
                <span className="block h-1.5 overflow-hidden rounded-full bg-mint-200">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-all duration-500",
                      i < step ? "w-full bg-teal-600" : i === step ? "w-1/2 bg-coral-400" : "w-0",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "mt-2 flex items-center gap-1 text-xs font-medium sm:text-sm",
                    i === step ? "text-ink-900" : done ? "text-teal-700" : "text-ink-400",
                  )}
                >
                  {done && <Check className="size-3.5 max-sm:hidden" strokeWidth={3} />}
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function StepHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-6 sm:mb-7">
      <h1 className="font-display text-[34px] leading-none font-bold uppercase sm:text-5xl">{title}</h1>
      {children && <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ink-500 sm:mt-3 sm:text-[16px]">{children}</p>}
    </header>
  );
}

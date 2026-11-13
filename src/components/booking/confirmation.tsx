"use client";

import { motion } from "motion/react";
import { CalendarPlus, Check, Copy, MailCheck, Route, UserCheck } from "lucide-react";
import { useState } from "react";
import { PetAvatar } from "@/components/shared/pet-avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { nextVisits, type BookingDraft } from "@/lib/booking";
import { daysLabel, formatDate, formatTime } from "@/lib/schedule";
import type { Pet, Service, Zone } from "@/lib/types";

export function Confirmation({
  reference,
  draft,
  service,
  zone,
  pets,
}: {
  reference: string;
  draft: BookingDraft;
  service: Service;
  zone?: Zone;
  pets: Pet[];
}) {
  const [copied, setCopied] = useState(false);
  const chosen = pets.filter((p) => draft.petIds.includes(p.id));
  const first = nextVisits(draft, 1)[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const steps = [
    { icon: MailCheck, title: "Request received", body: `We emailed a copy to ${draft.email}.`, done: true },
    { icon: UserCheck, title: "Profile & route check", body: `${zone?.walker.name ?? "Your walker"} reviews ${chosen.map((p) => p.name).join(" & ")}'s profile and the ${zone?.name ?? ""} route.` },
    { icon: Route, title: "Confirmed by email", body: "Usually within two hours, 7 AM–8 PM. Then it's locked in." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 200 }}
        className="grid size-16 place-items-center rounded-2xl bg-teal-600 text-white shadow-lift"
      >
        <Check className="size-8" strokeWidth={3} />
      </motion.div>

      <p className="mt-8 font-mono text-[11px] tracking-[0.18em] text-teal-700 uppercase">
        Request sent · not yet confirmed
      </p>
      <h1 className="mt-3 font-display text-5xl leading-[0.92] font-bold uppercase sm:text-6xl">
        Thanks — {chosen.length ? chosen.map((p) => p.name).join(" & ") : "your pet"}{" "}
        {chosen.length > 1 ? "are" : "is"} on the list.
      </h1>

      <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-mint-200">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-ink-900 px-6 py-5 text-white">
          <div>
            <p className="font-mono text-[10.5px] tracking-[0.16em] text-white/50 uppercase">Your reference</p>
            <p className="font-mono text-2xl tracking-wider">{reference}</p>
          </div>
          <Button variant="light" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="font-display text-2xl font-bold uppercase">{service.name}</p>
            <p className="mt-1 text-ink-500">
              {draft.mode === "recurring" && service.recurring
                ? `${draft.frequency === "weekly" ? "Every" : "Every other"} ${daysLabel(draft.days)} at ${draft.time && formatTime(draft.time)}`
                : draft.date && `${formatDate(draft.date, "long")} at ${draft.time && formatTime(draft.time)}`}
            </p>
            {first && draft.mode === "recurring" && (
              <p className="mt-1 text-sm text-ink-500">First visit {formatDate(first, "long")}</p>
            )}
            <p className="mt-1 text-sm text-ink-500">{draft.street}, {draft.postalCode}</p>
          </div>
          <div className="flex items-center gap-2">
            {chosen.map((p) => (
              <PetAvatar key={p.id} pet={p} size={52} />
            ))}
          </div>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold uppercase">What happens next</h2>
      <ol className="mt-5 space-y-1">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={
                  s.done
                    ? "grid size-10 place-items-center rounded-xl bg-teal-600 text-white"
                    : "grid size-10 place-items-center rounded-xl bg-white text-ink-500 ring-1 ring-mint-300"
                }
              >
                <s.icon className="size-4.5" />
              </span>
              {i < steps.length - 1 && <span className="my-1 w-px flex-1 bg-mint-300" />}
            </div>
            <div className="pb-6">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-ink-500">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/account" variant="dark" size="lg">
          Go to my account
        </ButtonLink>
        <Button variant="outline" size="lg">
          <CalendarPlus className="size-4" /> Add to calendar
        </Button>
      </div>
    </div>
  );
}

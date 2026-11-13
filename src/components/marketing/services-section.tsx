import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Repeat } from "lucide-react";
import { Eyebrow, Heading } from "@/components/ui/eyebrow";
import type { Service } from "@/lib/types";
import { cn, money } from "@/lib/utils";

export function ServicesSection({ services }: { services: Service[] }) {
  const [feature, ...rest] = services;

  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Eyebrow index="01">Services</Eyebrow>
          <Heading className="mt-4 max-w-2xl">Five ways we show up for your pet</Heading>
        </div>
        <p className="max-w-md text-[17px] leading-relaxed text-ink-500">
          Every visit starts from your pet&apos;s profile — vaccines, quirks, feeding notes — so the walker at your door
          already knows who they&apos;re meeting.
        </p>
      </div>

      <div className="mt-10 snap-rail -mx-4 gap-3 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:mt-14 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        <ServiceCard service={feature} featured className="md:col-span-2 lg:row-span-2" />
        {rest.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  featured,
  className,
}: {
  service: Service;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/book?service=${service.id}`}
      className={cn(
        "group relative flex min-h-[400px] w-[80vw] max-w-sm shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 p-5 text-white shadow-soft transition-[box-shadow,transform] duration-150 active:scale-[0.98] hover:shadow-lift sm:p-6 md:min-h-[280px] md:w-auto md:max-w-none",
        featured && "md:min-h-[420px] lg:min-h-0",
        className,
      )}
    >
      <Image
        src={service.image}
        alt=""
        fill
        loading={featured ? "eager" : "lazy"}
        sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="object-cover transition-transform duration-700 ease-out hover-device:group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/55 to-ink-950/0" />

      <div className="absolute top-4 right-4 left-4 flex items-start justify-between">
        <div className="flex flex-wrap gap-1.5">
          {service.recurring && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/20 backdrop-blur">
              <Repeat className="size-3" /> Weekly slots
            </span>
          )}
          {service.capacity > 1 && service.id === "pack-walk" && (
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/20 backdrop-blur">
              Max {service.capacity} dogs
            </span>
          )}
        </div>
        <span className="grid size-9 place-items-center rounded-full bg-white text-ink-900 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative">
        <h3 className={cn("font-display font-bold uppercase leading-none", featured ? "text-4xl sm:text-5xl" : "text-[28px]")}>
          {service.name}
        </h3>
        <p className={cn("mt-2 text-white/75", featured ? "max-w-md text-base" : "text-sm")}>
          <span className={featured ? "max-md:hidden" : undefined}>{featured ? service.description : null}</span>
          <span className={featured ? "md:hidden" : undefined}>{featured ? service.tagline : service.tagline}</span>
        </p>
        <div className="mt-4 flex items-center gap-4 border-t border-white/15 pt-3 text-sm">
          <span className="flex items-center gap-1.5 text-white/70">
            <Clock className="size-3.5" /> {service.durationMin} min
          </span>
          <span className="font-mono text-[13px]">
            {service.price === 0 ? (
              <span className="text-teal-300">Complimentary</span>
            ) : (
              <>
                from <span className="font-semibold text-coral-300">{money(service.price - service.laneDayDiscount)}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

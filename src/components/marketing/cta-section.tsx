import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { unsplash } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative mx-auto grid max-w-[1400px] overflow-hidden rounded-[28px] bg-coral-400 lg:grid-cols-2">
        <div className="relative z-10 px-6 py-16 sm:px-12 lg:py-24">
          <p className="font-mono text-[11px] tracking-[0.18em] text-ink-900/60 uppercase">First visit</p>
          <h2 className="mt-4 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.88] font-extrabold text-ink-900 uppercase">
            Meet your walker.
            <br />
            On us.
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink-900/75">
            Start with a free 30-minute Sitter Consult. We&apos;ll meet your pet, go over the profile together and
            suggest the right weekly plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book?service=sitter-consult" variant="dark" size="lg">
              Book a free consult <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/book"
              size="lg"
              variant="outline"
              className="border-ink-900/20 bg-transparent hover:bg-ink-900/5 hover:border-ink-900/40"
            >
              See all services
            </ButtonLink>
          </div>
        </div>
        <div className="relative min-h-72 lg:min-h-0">
          <Image
            src={unsplash("1552053831-71594a27632d")}
            alt="Golden retriever holding a flower in its mouth"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-coral-400 via-coral-400/0 to-transparent max-lg:bg-linear-to-b" />
        </div>
      </div>
    </section>
  );
}

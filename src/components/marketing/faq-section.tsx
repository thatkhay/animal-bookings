import { Plus } from "lucide-react";
import { Eyebrow, Heading } from "@/components/ui/eyebrow";
import type { Faq } from "@/lib/types";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Eyebrow index="05">Questions</Eyebrow>
          <Heading className="mt-4">The fine print, in plain words</Heading>
          <p className="mt-5 max-w-sm text-ink-500">
            Something else on your mind? Email{" "}
            <a href="mailto:hello@pawlane.example" className="font-medium text-teal-700 underline-offset-4 hover:underline">
              hello@pawlane.example
            </a>{" "}
            and a real person will answer.
          </p>
        </div>
        <div className="divide-y divide-mint-200 border-y border-mint-200">
          {faqs.map((f, i) => (
            <details key={f.q} className="group py-1" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white ring-1 ring-mint-200 transition-transform duration-200 group-open:rotate-45 group-open:bg-ink-900 group-open:text-white group-open:ring-ink-900">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pr-12 pb-5 leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

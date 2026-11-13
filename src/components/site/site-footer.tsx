import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const COLUMNS = [
  {
    title: "Book",
    links: [
      { href: "/book?service=pack-walk", label: "Pack walks" },
      { href: "/book?service=solo-stroll", label: "Solo strolls" },
      { href: "/book?service=puppy-social", label: "Puppy Social Club" },
      { href: "/book?service=drop-in", label: "Drop-in visits" },
      { href: "/book?service=sitter-consult", label: "Free sitter consult" },
    ],
  },
  {
    title: "Your account",
    links: [
      { href: "/account", label: "Overview" },
      { href: "/account/pets", label: "Pet profiles" },
      { href: "/account/plans", label: "Recurring plans" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#coverage", label: "Coverage map" },
      { href: "/#faq", label: "FAQ" },
      { href: "/admin", label: "Walker ops" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-[15px] leading-relaxed text-white/60">
              Neighborhood pet care, routed. The same walker on the same street, on the days that work for you.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 font-mono text-[11px] tracking-wider text-white/60 uppercase ring-1 ring-white/10">
              <span className="size-1.5 animate-pulse rounded-full bg-teal-400" />
              6 lanes active · Mon–Sat 7 AM–8 PM
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] tracking-[0.18em] text-white/40 uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[15px] text-white/75 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <p
            aria-hidden
            className="font-display text-[clamp(4rem,17vw,15rem)] leading-[0.8] font-extrabold tracking-tight text-white/[0.04] uppercase"
          >
            Pawlane
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Pawlane Pet Co. Insured & bonded.</p>
          <p className="font-mono text-xs">hello@pawlane.example · (502) 555-0100</p>
        </div>
      </div>
    </footer>
  );
}

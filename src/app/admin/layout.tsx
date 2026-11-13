import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/shared/logo";
import { MobileTabBar } from "@/components/shared/mobile-tab-bar";
import { getAllBookings, getWalkers } from "@/lib/api";
import { formatDate, TODAY } from "@/lib/schedule";

export const metadata: Metadata = { title: { default: "Ops", template: "%s · Pawlane Ops" } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [bookings, walkers] = await Promise.all([getAllBookings(), getWalkers()]);
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="flex min-h-full flex-1 bg-ink-100/60">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink-950 p-4 text-white lg:flex">
        <div className="flex items-center justify-between px-2 pt-1 pb-6">
          <Logo tone="light" href="/admin" />
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-white/60 uppercase">
            Ops
          </span>
        </div>
        <AdminNav pending={pending} />

        <div className="mt-8 px-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">On shift today</p>
          <ul className="mt-3 space-y-2.5">
            {walkers.map((w, i) => (
              <li key={w.id} className="flex items-center gap-2.5 text-sm text-white/75">
                <span className="relative grid size-7 place-items-center rounded-full bg-white/10 font-mono text-[10px]">
                  {w.initials}
                  <span
                    className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-ink-950 ${i % 3 === 2 ? "bg-white/30" : "bg-teal-400"}`}
                  />
                </span>
                {w.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto space-y-3 px-3">
          <p className="font-mono text-[10px] text-white/35">Demo clock · {formatDate(TODAY, "day")}</p>
          <Link href="/" className="flex items-center gap-2 text-sm text-white/55 hover:text-white">
            <ExternalLink className="size-4" /> View public site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="pt-safe sticky top-0 z-30 bg-ink-950 px-4 text-white lg:hidden">
          <div className="flex h-14 items-center justify-between">
            <Logo tone="light" href="/admin" />
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-white/60 uppercase">
              Ops
            </span>
          </div>
        </header>
        <main id="main" className="flex-1 px-4 pt-6 pb-tabbar sm:px-6 lg:px-10 lg:py-10">
          {children}
          <div className="h-6 lg:hidden" />
        </main>
        <MobileTabBar variant="admin" badge={pending} className="lg:hidden" />
      </div>
    </div>
  );
}

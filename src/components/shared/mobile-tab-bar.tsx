"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  CalendarClock,
  CalendarRange,
  Compass,
  Home,
  LayoutGrid,
  ListChecks,
  Map,
  MapPinned,
  PawPrint,
  Plus,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
  isActive?: (path: string) => boolean;
  badge?: number;
};

type Variant = "site" | "account" | "admin";

function tabsFor(variant: Variant, badge = 0): Tab[] {
  switch (variant) {
    case "site":
      return [
        { href: "/", label: "Home", icon: Home, isActive: (p) => p === "/" },
        { href: "/#services", label: "Services", icon: PawPrint },
        { href: "/book", label: "Book", icon: Plus, primary: true },
        { href: "/#coverage", label: "Coverage", icon: MapPinned },
        { href: "/account", label: "Account", icon: UserRound, isActive: (p) => p.startsWith("/account") },
      ];
    case "account":
      return [
        { href: "/account", label: "Overview", icon: LayoutGrid, isActive: (p) => p === "/account" },
        { href: "/account/pets", label: "Pets", icon: PawPrint, isActive: (p) => p.startsWith("/account/pets") },
        { href: "/book", label: "Book", icon: Plus, primary: true },
        { href: "/account/plans", label: "Plans", icon: CalendarRange, isActive: (p) => p.startsWith("/account/plans") },
        { href: "/", label: "Explore", icon: Compass, isActive: () => false },
      ];
    case "admin":
      return [
        { href: "/admin", label: "Today", icon: CalendarClock, isActive: (p) => p === "/admin" },
        { href: "/admin/routes", label: "Routes", icon: Map, isActive: (p) => p.startsWith("/admin/routes") },
        { href: "/admin/bookings", label: "Bookings", icon: ListChecks, isActive: (p) => p.startsWith("/admin/bookings"), badge },
      ];
  }
}

export function MobileTabBar({ variant, badge, className }: { variant: Variant; badge?: number; className?: string }) {
  const pathname = usePathname();
  const tabs = tabsFor(variant, badge);
  const dark = variant === "admin";

  const tap = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(6);
  };

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t pb-safe backdrop-blur-xl backdrop-saturate-150",
        dark ? "border-white/10 bg-ink-950/90" : "border-mint-200/80 bg-white/85",
        className,
      )}
    >
      <ul
        className="mx-auto grid h-16 max-w-md items-stretch px-2"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((t) => {
          const active = t.isActive ? t.isActive(pathname) : false;
          if (t.primary) {
            return (
              <li key={t.href} className="flex items-start justify-center">
                <Link
                  href={t.href}
                  onClick={tap}
                  aria-label={t.label}
                  className="-mt-5 grid size-14 place-items-center rounded-2xl bg-coral-400 text-ink-950 shadow-[0_10px_24px_-8px_rgb(255_112_67/0.7)] ring-4 ring-white transition-transform duration-150 active:scale-90"
                >
                  <Plus className="size-6" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                onClick={tap}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-[color,transform] duration-150 active:scale-90",
                  dark
                    ? active
                      ? "text-white"
                      : "text-white/45"
                    : active
                      ? "text-ink-900"
                      : "text-ink-400",
                )}
              >
                <span className="relative grid h-7 w-12 place-items-center">
                  {active && (
                    <motion.span
                      layoutId={`tab-pill-${variant}`}
                      className={cn("absolute inset-0 rounded-full", dark ? "bg-white/12" : "bg-teal-50")}
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <t.icon className={cn("relative size-[19px]", active && !dark && "text-teal-700")} strokeWidth={active ? 2.3 : 2} />
                  {!!t.badge && (
                    <span className="absolute -top-0.5 right-1.5 min-w-4 rounded-full bg-coral-400 px-1 text-center font-mono text-[9px] leading-4 text-ink-950">
                      {t.badge}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

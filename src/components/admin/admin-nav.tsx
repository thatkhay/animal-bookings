"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, ListChecks, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Today", icon: CalendarClock },
  { href: "/admin/routes", label: "Lanes & routes", icon: Map },
  { href: "/admin/bookings", label: "Bookings", icon: ListChecks },
];

export function AdminNav({ pending, orientation = "vertical" }: { pending: number; orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Operations"
      className={cn(orientation === "vertical" ? "space-y-1" : "no-scrollbar flex gap-1 overflow-x-auto")}
    >
      {NAV.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium whitespace-nowrap transition-colors",
              active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white",
            )}
          >
            <n.icon className="size-[18px]" />
            {n.label}
            {n.href === "/admin/bookings" && pending > 0 && (
              <span className="ml-auto rounded-full bg-coral-400 px-1.5 py-px font-mono text-[11px] font-medium text-ink-950">
                {pending}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

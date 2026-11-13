"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, LayoutGrid, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/account", label: "Overview", icon: LayoutGrid },
  { href: "/account/pets", label: "Pets", icon: PawPrint },
  { href: "/account/plans", label: "Plans", icon: CalendarRange },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
      {TABS.map((t) => {
        const active = t.href === "/account" ? pathname === "/account" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-3.5 text-[15px] font-medium whitespace-nowrap transition-colors",
              active ? "border-coral-400 text-ink-900" : "border-transparent text-ink-500 hover:text-ink-900",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

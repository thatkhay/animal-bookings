import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" fill="#0b1b3f" />
      <path
        d="M8 23c4.5 0 4-8 8-8s3.5-6 8-6"
        stroke="#ff8a65"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="8" cy="23" r="2.7" fill="#2dd4bf" />
      <circle cx="24" cy="9" r="2.7" fill="#fff" />
    </svg>
  );
}

export function Logo({ tone = "dark", href = "/" }: { tone?: "dark" | "light"; href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="Pawlane home">
      <LogoMark className={cn(tone === "light" && "[&>rect]:fill-white/10")} />
      <span
        className={cn(
          "font-display text-[22px] leading-none font-bold tracking-wide uppercase",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        Pawlane
      </span>
    </Link>
  );
}

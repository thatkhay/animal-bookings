import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-ink-900/5 text-ink-700",
  teal: "bg-teal-50 text-teal-800 ring-1 ring-teal-700/15",
  coral: "bg-coral-50 text-coral-700 ring-1 ring-coral-500/20",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-1 ring-red-600/15",
  ink: "bg-ink-900 text-white",
  glass: "bg-white/10 text-white ring-1 ring-white/15 backdrop-blur",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "neutral",
  dot,
  className,
  children,
  ...props
}: ComponentProps<"span"> & { tone?: BadgeTone; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

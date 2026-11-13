import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-coral-400 text-ink-900 hover:bg-coral-300 active:bg-coral-500 shadow-[inset_0_-2px_0_rgb(0_0_0/0.08)]",
  dark: "bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950",
  teal: "bg-teal-700 text-white hover:bg-teal-800",
  outline: "border border-mint-300 bg-white text-ink-900 hover:border-ink-300 hover:bg-mint-50",
  ghost: "text-ink-700 hover:bg-ink-900/5",
  light: "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/15",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-xl",
  md: "h-11 px-5 text-[15px] gap-2 rounded-xl",
  lg: "h-13 px-6 text-base gap-2.5 rounded-2xl",
  icon: "size-10 rounded-xl",
} as const;

type Style = { variant?: keyof typeof variants; size?: keyof typeof sizes };

export function buttonStyles({ variant = "primary", size = "md" }: Style = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-150 select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
  );
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & Style) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & Style) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

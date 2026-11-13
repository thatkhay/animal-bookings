import { cn } from "@/lib/utils";

export function Eyebrow({
  index,
  children,
  className,
  tone = "dark",
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.18em] uppercase",
        tone === "dark" ? "text-teal-700" : "text-teal-300",
        className,
      )}
    >
      {index && (
        <>
          <span className={tone === "dark" ? "text-ink-400" : "text-white/40"}>{index}</span>
          <span className={cn("h-px w-6", tone === "dark" ? "bg-ink-300" : "bg-white/25")} />
        </>
      )}
      {children}
    </p>
  );
}

export function Heading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("font-display text-4xl leading-[0.95] font-bold uppercase sm:text-5xl lg:text-6xl", className)}>
      {children}
    </Tag>
  );
}

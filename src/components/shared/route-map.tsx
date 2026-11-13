"use client";

import { useId, useState } from "react";
import type { Zone } from "@/lib/types";
import { smoothPath } from "@/lib/routing";
import { WEEKDAYS } from "@/lib/schedule";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

export interface MapRoute {
  id: string;
  color: string;
  points: Point[];
}

export interface MapStop extends Point {
  id: string;
  color: string;
  label?: string;
  active?: boolean;
}

export function RouteMap({
  zones,
  routes = [],
  stops = [],
  hub,
  highlight,
  onHighlight,
  showLaneDays,
  className,
}: {
  zones: Zone[];
  routes?: MapRoute[];
  stops?: MapStop[];
  hub?: Point & { name?: string };
  highlight?: string | null;
  onHighlight?: (zoneId: string | null) => void;
  showLaneDays?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<string | null>(null);
  const focus = highlight ?? hover;

  const set = (id: string | null) => {
    setHover(id);
    onHighlight?.(id);
  };

  return (
    <svg
      viewBox="0 0 800 520"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label="Map of Pawlane service lanes"
    >
      <defs>
        <pattern id={`grid-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="1" />
        </pattern>
        <radialGradient id={`glow-${uid}`}>
          <stop offset="0" stopColor="#2dd4bf" stopOpacity="0.5" />
          <stop offset="1" stopColor="#2dd4bf" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="520" rx="22" fill="#0b1b3f" />
      <rect width="800" height="520" rx="22" fill={`url(#grid-${uid})`} />

      <g stroke="rgb(255 255 255 / 0.09)" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M20 150 C 220 140, 420 170, 780 130" />
        <path d="M20 360 C 260 380, 520 340, 780 380" />
        <path d="M170 20 C 160 200, 190 360, 160 500" />
        <path d="M640 20 C 660 180, 620 340, 660 500" />
      </g>

      <path
        d="M440 0 C 420 110, 345 170, 320 270 S 210 430, 110 520"
        fill="none"
        stroke="#1f3a73"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <ellipse cx="95" cy="430" rx="62" ry="40" fill="#1f3a73" />

      {zones.map((z) => {
        const on = focus === z.id;
        const dim = focus && !on;
        return (
          <g
            key={z.id}
            onMouseEnter={() => set(z.id)}
            onMouseLeave={() => set(null)}
            className="cursor-pointer"
          >
            <polygon
              points={z.shape}
              fill={z.color}
              fillOpacity={on ? 0.22 : dim ? 0.03 : 0.08}
              stroke={z.color}
              strokeOpacity={on ? 0.9 : 0.35}
              strokeWidth={on ? 2 : 1.2}
              strokeDasharray={on ? undefined : "4 5"}
              strokeLinejoin="round"
              style={{ transition: "fill-opacity 200ms, stroke-opacity 200ms" }}
            />
            <g opacity={dim ? 0.4 : 1} style={{ transition: "opacity 200ms" }}>
              <text
                x={z.label.x}
                y={z.label.y}
                textAnchor="middle"
                fill={z.color}
                fontFamily="var(--font-jetbrains)"
                fontSize="12"
                letterSpacing="2"
              >
                {z.code}
              </text>
              <text
                x={z.label.x}
                y={z.label.y + 22}
                textAnchor="middle"
                fill="white"
                fontFamily="var(--font-barlow)"
                fontWeight="700"
                fontSize="21"
                letterSpacing="0.6"
              >
                {z.name.toUpperCase()}
              </text>
              {showLaneDays && (
                <text
                  x={z.label.x}
                  y={z.label.y + 40}
                  textAnchor="middle"
                  fill="rgb(255 255 255 / 0.55)"
                  fontFamily="var(--font-jetbrains)"
                  fontSize="10.5"
                  letterSpacing="1"
                >
                  {z.laneDays.map((d) => WEEKDAYS[d].toUpperCase()).join(" · ")}
                </text>
              )}
            </g>
          </g>
        );
      })}

      {routes.map((r) => {
        const d = smoothPath(r.points);
        return (
          <g key={r.id} pointerEvents="none">
            <path d={d} fill="none" stroke={r.color} strokeOpacity="0.25" strokeWidth="7" strokeLinecap="round" />
            <path
              d={d}
              fill="none"
              stroke={r.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="8 4"
              className="animate-route"
            />
          </g>
        );
      })}

      {hub && (
        <g pointerEvents="none">
          <circle cx={hub.x} cy={hub.y} r="34" fill={`url(#glow-${uid})`} />
          <rect x={hub.x - 9} y={hub.y - 9} width="18" height="18" rx="5" fill="#fff" />
          <rect x={hub.x - 4} y={hub.y - 4} width="8" height="8" rx="2" fill="#0b1b3f" />
        </g>
      )}

      {stops.map((s) => (
        <g key={s.id} pointerEvents="none">
          {s.active && (
            <circle cx={s.x} cy={s.y} r="7" fill={s.color} className="animate-ping-slow origin-center [transform-box:fill-box]" />
          )}
          <circle cx={s.x} cy={s.y} r="7" fill="#0b1b3f" stroke={s.color} strokeWidth="3" />
          {s.label && (
            <text
              x={s.x + 12}
              y={s.y + 4}
              fill="white"
              fontFamily="var(--font-dm-sans)"
              fontSize="12"
              fontWeight="600"
              paintOrder="stroke"
              stroke="#0b1b3f"
              strokeWidth="4"
            >
              {s.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

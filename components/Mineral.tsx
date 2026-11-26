"use client";

import { useEffect, useRef } from "react";
import type { MineralKind } from "@/lib/minerals/shapes";

/* A slot for one 3D specimen. The stone itself is drawn by the shared stage (lib/minerals/stage.ts);
   until it is, or where WebGL is refused, a flat drawing of the same habit stands in. */

type Face = [string, number];

const FALLBACK: Record<MineralKind, { faces: Face[]; extra?: React.ReactNode }> = {
  quartz: {
    faces: [
      ["100,30 68,80 100,92", 0.6],
      ["100,30 132,80 100,92", 0.38],
      ["68,80 100,92 100,222 68,210", 0.3],
      ["100,92 132,80 132,210 100,222", 0.16],
    ],
  },
  fluorite: {
    faces: [
      ["100,28 40,118 108,140", 0.58],
      ["100,28 108,140 162,108", 0.34],
      ["40,118 108,140 100,216", 0.24],
      ["108,140 162,108 100,216", 0.12],
    ],
  },
  pyrite: {
    faces: [
      ["100,64 152,90 100,116 48,90", 0.6],
      ["48,90 100,116 100,176 48,150", 0.32],
      ["100,116 152,90 152,150 100,176", 0.16],
    ],
  },
  sulfur: {
    faces: [
      ["100,24 58,120 96,136", 0.6],
      ["100,24 96,136 142,114", 0.36],
      ["58,120 96,136 100,218", 0.24],
      ["96,136 142,114 100,218", 0.12],
    ],
  },
  resonator: {
    faces: [
      ["100,16 76,60 100,70", 0.6],
      ["100,16 124,60 100,70", 0.36],
      ["76,60 100,70 100,184 76,174", 0.3],
      ["100,70 124,60 124,174 100,184", 0.14],
      ["76,174 100,184 100,226", 0.22],
      ["100,184 124,174 100,226", 0.1],
    ],
    extra: <ellipse cx="100" cy="128" rx="92" ry="26" fill="none" stroke="currentColor" strokeOpacity="0.35" />,
  },
};

export default function Mineral({ kind, label, className }: { kind: MineralKind; label?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let off = () => {};
    let gone = false;
    import("@/lib/minerals/stage")
      .then((m) => {
        if (!gone) off = m.register(el, kind);
      })
      .catch(() => {});
    return () => {
      gone = true;
      off();
    };
  }, [kind]);

  const fb = FALLBACK[kind];
  return (
    <div
      ref={ref}
      className={className ? `mineral ${className}` : "mineral"}
      data-kind={kind}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg className="mineral-fb" viewBox="0 0 200 240" aria-hidden="true">
        {fb.extra}
        {fb.faces.map(([pts, o]) => (
          <polygon key={pts} points={pts} fill="currentColor" fillOpacity={o} stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8" strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
}

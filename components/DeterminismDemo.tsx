"use client";

import { useState } from "react";

/* Same prompt three times → three different takes. Same knob value three times → one result.
   Purely illustrative curves, no audio. */

const PTS = 96;
const W = 320;
const H = 56;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toPath(ys: number[]) {
  return ys
    .map((y, i) => `${i === 0 ? "M" : "L"}${((i / (PTS - 1)) * W).toFixed(1)},${(H / 2 - y * (H * 0.44)).toFixed(1)}`)
    .join(" ");
}

/* A "phrase": the same melody contour every time. */
function base(u: number) {
  return Math.sin(u * Math.PI * 4) * 0.55 * Math.sin(u * Math.PI) + Math.sin(u * Math.PI * 9) * 0.18;
}

function generated(seed: number) {
  const r = rng(seed);
  const ph = r() * Math.PI * 2;
  const f = 3 + r() * 3;
  const a = 0.35 + r() * 0.45;
  const g = r() * 0.5;
  const ys: number[] = [];
  for (let i = 0; i < PTS; i++) {
    const u = i / (PTS - 1);
    ys.push(Math.sin(u * Math.PI * f + ph) * a * Math.sin(u * Math.PI) + Math.sin(u * Math.PI * 13 + ph * 2) * g * 0.3 + (r() - 0.5) * 0.16);
  }
  return toPath(ys);
}

function knobbed(warmth: number) {
  const k = warmth / 100;
  const ys: number[] = [];
  for (let i = 0; i < PTS; i++) {
    const u = i / (PTS - 1);
    const bright = Math.sin(u * Math.PI * 22) * 0.16 * (1 - k);
    ys.push(base(u) * (0.85 + k * 0.25) + bright);
  }
  return toPath(ys);
}

export type DemoText = {
  prompt: string;
  promptAria: string;
  regenerate: string;
  promptNote: string;
  knobAria: string;
  knobNote: string;
};

export default function DeterminismDemo({ t }: { t: DemoText }) {
  const [seeds, setSeeds] = useState([11, 23, 37]);
  const [warmth, setWarmth] = useState(40);
  const kp = knobbed(warmth);

  return (
    <div className="ddemo">
      <div className="ddemo-col">
        <div className="ddemo-head">
          <span className="mono ddemo-tag">Prompt</span>
          <p className="ddemo-prompt">{t.prompt}</p>
        </div>
        <ul className="ddemo-rows" aria-label={t.promptAria}>
          {seeds.map((s, i) => (
            <li key={`${s}-${i}`}>
              <span className="mono">#{i + 1}</span>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                <path d={generated(s)} className="ddemo-gen" />
              </svg>
            </li>
          ))}
        </ul>
        <div className="ddemo-foot">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setSeeds((prev) => prev.map((s) => (s * 7919 + 104729) % 2147483647))}
          >
            {t.regenerate}
          </button>
          <p>{t.promptNote}</p>
        </div>
      </div>

      <div className="ddemo-col ddemo-human">
        <div className="ddemo-head">
          <span className="mono ddemo-tag">Knob</span>
          <label className="ddemo-knob">
            <span>Warmth</span>
            <input type="range" min={0} max={100} value={warmth} onChange={(e) => setWarmth(Number(e.target.value))} />
            <output className="mono">{warmth}</output>
          </label>
        </div>
        <ul className="ddemo-rows" aria-label={t.knobAria}>
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <span className="mono">#{i + 1}</span>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                <path d={kp} className="ddemo-knobbed" />
              </svg>
            </li>
          ))}
        </ul>
        <div className="ddemo-foot">
          <p>{t.knobNote}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function DestinyReveal({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const t = window.setTimeout(() => setRevealed(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-700 ease-out ${
          revealed ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {children}
      </div>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-night transition-opacity duration-500 ${
          revealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={revealed}
      >
        <span className="animate-spin-slow text-5xl">🔮</span>
        <p className="font-display text-lg text-gold2">Le voile se lève…</p>
      </div>
    </div>
  );
}

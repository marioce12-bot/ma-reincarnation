"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { icon: "🔮", text: "Les esprits croisent les étoiles…" },
  { icon: "🌌", text: "Ton signe s'aligne avec les siècles…" },
  { icon: "📜", text: "Une vie oubliée se souvient de toi…" },
  { icon: "✨", text: "Le voile est sur le point de se lever…" },
];

export default function DestinyLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 850);
    return () => window.clearInterval(id);
  }, []);

  const current = STAGES[stage];

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="text-6xl animate-spin-slow">{current.icon}</span>
      <p key={stage} className="animate-fade-in font-display text-2xl">
        {current.text}
      </p>
      <p className="text-sm text-sand/50">Quelques secondes — ta vie antérieure se souvient de toi.</p>
      <div className="mt-2 flex gap-2">
        {STAGES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-7 rounded-full transition-colors duration-500 ${
              i <= stage ? "bg-gold" : "bg-white/15"
            }`}
          />
        ))}
      </div>
    </main>
  );
}

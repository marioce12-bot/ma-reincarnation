"use client";

import { useState } from "react";

export default function SaspayPayButton({
  sessionId,
  plan,
  label,
}: {
  sessionId: string;
  plan: "standard" | "premium" | "pack";
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/paiement/demarrer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, plan }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) throw new Error(data?.error ?? "Paiement indisponible.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={pay}
        disabled={loading}
        className="w-full rounded-2xl bg-gold px-4 py-3 text-center text-sm font-bold text-night transition hover:bg-gold2 disabled:opacity-50"
      >
        {loading ? "Redirection vers le paiement…" : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-300">{error}</p>}
    </div>
  );
}

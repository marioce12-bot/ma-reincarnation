"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "starting" | "waiting";

export default function SaspayPayButton({
  sessionId,
  plan,
  label,
}: {
  sessionId: string;
  plan: "standard" | "premium" | "pack";
  label: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [checkHint, setCheckHint] = useState<string | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    return () => {
      stopRef.current = true;
    };
  }, []);

  async function pay() {
    setError(null);
    setCheckHint(null);
    // Ouvrir l'onglet immédiatement (synchronique) pour éviter les bloqueurs de popup.
    const tab = window.open("about:blank");
    setPhase("starting");
    try {
      const res = await fetch("/api/paiement/demarrer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, plan }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) throw new Error(data?.error ?? "Paiement indisponible.");
      if (tab) tab.location.href = data.url;
      else window.location.href = data.url;
      setPhase("waiting");
      stopRef.current = false;
      void pollUntilPaid();
    } catch (e) {
      tab?.close();
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
      setPhase("idle");
    }
  }

  async function checkOnce(): Promise<boolean> {
    try {
      const res = await fetch(`/api/paiement/etat?session=${sessionId}`, { cache: "no-store" });
      if (!res.ok) return false;
      const data = (await res.json()) as { paid?: boolean };
      if (data.paid) {
        router.push(`/resultat/${sessionId}`);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async function pollUntilPaid() {
    const deadline = Date.now() + 10 * 60 * 1000;
    while (Date.now() < deadline && !stopRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const paid = await checkOnce();
      if (paid || stopRef.current) return;
    }
  }

  async function verifyNow() {
    setCheckHint("Vérification…");
    const paid = await checkOnce();
    setCheckHint(paid ? null : "Paiement pas encore confirmé — réessaie dans quelques secondes.");
  }

  if (phase === "waiting") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-center">
        <p className="text-sm font-semibold text-gold2">⏳ En attente du paiement…</p>
        <p className="mt-1 text-xs leading-relaxed text-sand/70">
          Dès que Saspay confirme, ta fiche s&apos;ouvre automatiquement ici. Paie dans
          l&apos;onglet qui vient de s&apos;ouvrir.
        </p>
        <button
          onClick={verifyNow}
          className="mt-3 w-full rounded-2xl bg-gold px-4 py-3 text-center text-sm font-bold text-night transition hover:bg-gold2"
        >
          Vérifier le paiement
        </button>
        {checkHint && <p className="mt-2 text-xs text-sand/60">{checkHint}</p>}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={pay}
        disabled={phase === "starting"}
        className="w-full rounded-2xl bg-gold px-4 py-3 text-center text-sm font-bold text-night transition hover:bg-gold2 disabled:opacity-50"
      >
        {phase === "starting" ? "Redirection vers le paiement…" : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-300">{error}</p>}
    </div>
  );
}

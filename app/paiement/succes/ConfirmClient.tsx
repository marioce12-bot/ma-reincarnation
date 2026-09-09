"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmClient({
  sessionId,
  plan,
  refParam,
}: {
  sessionId: string | null;
  plan: string | null;
  refParam: string | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<"working" | "done" | "error" | "missing">("working");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run();
  }, []);

  async function run() {
    let id = sessionId;
    let p = plan;
    if ((!id || !p) && typeof window !== "undefined") {
      const last = localStorage.getItem("tri_last_session");
      if (last) {
        const parsed = JSON.parse(last) as { id?: string; plan?: string };
        id = id ?? parsed.id ?? null;
        p = p ?? parsed.plan ?? null;
      }
    }
    if (!id) {
      setState("missing");
      return;
    }
    setState("working");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/paiement/confirmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: id, plan: p ?? "standard", ref: refParam }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Paiement introuvable");
      }
      localStorage.setItem("tri_last_session", JSON.stringify({ id, plan: p ?? "standard" }));
      setState("done");
      setTimeout(() => router.replace(`/resultat/${id}`), 1200);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Erreur inconnue");
      setState("error");
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      {state === "working" && (
        <>
          <span className="text-5xl animate-pulse">✨</span>
          <p className="font-display text-2xl">Vérification du paiement…</p>
          <p className="text-sm text-sand/60">Ton histoire s&apos;ouvre dans un instant.</p>
        </>
      )}
      {state === "done" && (
        <>
          <span className="text-5xl">🔓</span>
          <p className="font-display text-2xl">Fiche débloquée !</p>
          <p className="text-sm text-sand/60">Ouverture de ta révélation…</p>
        </>
      )}
      {state === "error" && (
        <>
          <span className="text-5xl">😔</span>
          <p className="font-display text-2xl">Impossible de débloquer</p>
          <p className="text-sm text-red-300">{errorMessage}</p>
          <p className="max-w-sm text-xs leading-relaxed text-sand/60">
            Vérifie que tu as payé via Saspay, puis réessaie depuis la page de paiement. Si le
            problème persiste, contacte le support — conserve ton reçu Mobile Money.
          </p>
        </>
      )}
      {state === "missing" && (
        <>
          <span className="text-5xl">📎</span>
          <p className="font-display text-2xl">Aucune révélation à débloquer</p>
          <p className="text-sm text-sand/60">
            Ouvre ta révélation et passe par la page de paiement.
          </p>
        </>
      )}
    </main>
  );
}

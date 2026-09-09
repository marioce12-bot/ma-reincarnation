"use client";

import { useRouter } from "next/navigation";

export default function PaidButton({
  sessionId,
  plan,
  label,
}: {
  sessionId: string;
  plan: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        localStorage.setItem("tri_last_session", JSON.stringify({ id: sessionId, plan }));
        router.push(`/paiement/succes?session=${sessionId}&plan=${plan}`);
      }}
      className="w-full rounded-2xl border border-gold/60 px-4 py-3 text-center text-sm font-semibold text-gold2 transition hover:bg-gold/10"
    >
      {label ?? "J'ai payé — Débloquer"}
    </button>
  );
}

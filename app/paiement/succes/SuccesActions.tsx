"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccesActions({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace(`/resultat/${sessionId}`), 4000);
    return () => clearTimeout(timer);
  }, [sessionId, router]);

  return (
    <button
      onClick={() => router.replace(`/resultat/${sessionId}`)}
      className="block w-full rounded-2xl border border-gold/60 px-6 py-4 font-semibold text-gold2 transition hover:bg-gold/10"
    >
      Voir ma révélation
    </button>
  );
}

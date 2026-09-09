import Link from "next/link";
import { cookies } from "next/headers";
import SuccesActions from "./SuccesActions";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PaiementSuccesPage() {
  const cookieStore = await cookies();
  const ref = cookieStore.get("tri_pay")?.value;

  let sessionId: string | null = null;
  if (ref) {
    const pending = await getStore().getPendingPayment(ref);
    if (pending) {
      const session = await getStore().markPaid(pending.session_id, pending.plan, ref);
      if (session) sessionId = session.id;
    }
  }

  if (!sessionId) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
        <span className="text-5xl">🧭</span>
        <h1 className="font-display text-2xl font-bold">Aucun paiement en attente</h1>
        <p className="max-w-sm text-sm leading-relaxed text-sand/70">
          Si tu viens de payer, rouvre le lien de ta révélation (garde-le précieusement) ou
          refais le quiz : chaque révélation est identifiable par son lien unique.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-2xl border border-gold/60 px-6 py-3 font-semibold text-gold2 transition hover:bg-gold/10"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="text-5xl">🔓</span>
      <h1 className="font-display text-3xl font-bold">Fiche débloquée !</h1>
      <p className="text-sm text-sand/70">Ta révélation s&apos;ouvre dans un instant…</p>
      <div className="w-full max-w-xs space-y-3">
        <Link
          href={`/partage/${sessionId}`}
          className="block rounded-2xl bg-gold px-6 py-4 font-bold text-night transition hover:bg-gold2"
        >
          Partager ma révélation
        </Link>
        <SuccesActions sessionId={sessionId} />
      </div>
      <p className="max-w-sm text-xs leading-relaxed text-sand/50">
        Partage sur WhatsApp : tes amis verront ton personnage et un lien pour découvrir les
        leurs.
      </p>
    </main>
  );
}

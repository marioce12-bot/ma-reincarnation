import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PlanChooser from "@/components/PlanChooser";
import { getStore, usingSupabase } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PaiementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const { id } = await params;
  const { plan: planParam } = await searchParams;
  const store = getStore();
  const session = await store.getSession(id);
  if (!session) notFound();
  if (session.plan_purchased) redirect(`/resultat/${id}`);

  const character = await store.getCharacter(session.matched_character_id);
  const highlight =
    planParam === "premium" ? "premium" : planParam === "pack" ? "pack" : "standard";
  const firstName = character ? character.name.split(",")[0] : null;

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href={`/resultat/${id}`} className="text-xs text-sand/60 hover:text-sand">
        ← Retour à ma révélation
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold leading-snug">
        Choisis ta révélation
      </h1>
      {firstName && (
        <p className="mt-2 text-sm text-sand/70">
          {firstName}, {character?.era} · {session.compatibility_score} % de compatibilité
        </p>
      )}

      <div className="mt-6">
        <PlanChooser sessionId={id} highlight={highlight} />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-sand/60">
        Paiement Mobile Money via Saspay. Après paiement, tu es redirigé automatiquement vers
        ta révélation débloquée.
      </div>

      {!usingSupabase && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-sand/50">
          Mode démo actif (aucune base connectée) : les sessions vivent en mémoire — parfait
          pour tester le flux.
        </div>
      )}
    </main>
  );
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PaidButton from "@/components/PaidButton";
import { PLANS } from "@/lib/plans";
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
  const highlight = planParam === "premium" ? "premium" : planParam === "pack" ? "pack" : "standard";
  const firstName = character ? character.name.split(",")[0] : null;
  const saspayLink = (plan: "standard" | "premium" | "pack") => {
    switch (plan) {
      case "standard":
        return process.env.SASPAY_LINK_STANDARD ?? null;
      case "premium":
        return process.env.SASPAY_LINK_PREMIUM ?? null;
      case "pack":
        return process.env.SASPAY_LINK_PACK ?? null;
    }
  };

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10">
      <Link href={`/resultat/${id}`} className="text-xs text-sand/60 hover:text-sand">
        ← Retour à ma révélation
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold leading-snug">
        Débloque ta révélation
      </h1>
      {firstName && (
        <p className="mt-2 text-sm text-sand/70">
          {firstName}, {character?.era} · {session.compatibility_score} % de compatibilité
        </p>
      )}

      <div className="mt-6 grid gap-4">
        <PlanCard
          name="Ma fiche complète"
          price={PLANS.standard.price}
          features={["Nom et époque", "Lieu et métier", "Histoire complète"]}
          sessionId={session.id}
          planId="standard"
          link={saspayLink("standard")}
          highlighted={highlight === "standard"}
        />
        <PlanCard
          name="Premium"
          price={PLANS.premium.price}
          features={["Tout de la fiche", "Histoire longue enrichie", "Carte du lieu de vie", "Portrait HD"]}
          sessionId={session.id}
          planId="premium"
          link={saspayLink("premium")}
          highlighted={highlight === "premium"}
        />
        <PlanCard
          name="Pack 3 révélations"
          price={PLANS.pack.price}
          features={["3 fiches Premium", "Économise 500 FCFA", "2 autres vies incluses"]}
          sessionId={session.id}
          planId="pack"
          link={saspayLink("pack")}
          highlighted={highlight === "pack"}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-sand/60">
        Après paiement Mobile Money, reviens sur cette page et clique « J&apos;ai payé —
        Débloquer » : ta fiche s&apos;ouvre immédiatement.
      </div>

      {!usingSupabase && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-sand/50">
          Mode démo actif (aucune base connectée) : les sessions vivent en mémoire — parfait pour
          tester le flux.
        </div>
      )}
    </main>
  );
}

function PlanCard({
  name,
  price,
  features,
  sessionId,
  planId,
  link,
  highlighted,
}: {
  name: string;
  price: number;
  features: string[];
  sessionId: string;
  planId: "standard" | "premium" | "pack";
  link: string | null;
  highlighted: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 ${
        highlighted ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg font-semibold">{name}</p>
        <p className="font-bold text-gold2">{price} FCFA</p>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-sand/80">
        {features.map((feature) => (
          <li key={feature}>✨ {feature}</li>
        ))}
      </ul>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block rounded-2xl bg-gold px-4 py-3 text-center text-sm font-bold text-night transition hover:bg-gold2"
        >
          Payer {price} FCFA avec Saspay
        </a>
      ) : (
        <span className="mt-5 block cursor-not-allowed rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-bold text-sand/50">
          Payer {price} FCFA avec Saspay
        </span>
      )}
      <div className="mt-3">
        <PaidButton sessionId={sessionId} plan={planId} />
      </div>
    </div>
  );
}

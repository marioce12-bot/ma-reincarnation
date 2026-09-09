import type { PlanId } from "./types";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // FCFA
  linkEnv: string;
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  standard: {
    id: "standard",
    name: "Standard",
    price: 200,
    linkEnv: "SASPAY_LINK_STANDARD",
    features: [
      "Fiche complète : nom, époque, lieu, profession",
      "Histoire immersive courte",
      "Portrait avec léger filigrane",
      "% de compatibilité détaillé",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 500,
    linkEnv: "SASPAY_LINK_PREMIUM",
    features: [
      "Tout le plan Standard",
      "Histoire longue enrichie (plongée complète)",
      "Portrait HD sans filigrane, téléchargeable",
      "Carte du lieu de vie",
      "Les indices qui expliquent ton matching",
    ],
  },
  pack: {
    id: "pack",
    name: "Pack 3 révélations",
    price: 1000,
    linkEnv: "SASPAY_LINK_PACK",
    features: [
      "3 révélations complètes (ta vie + 2 autres)",
      "Chaque révélation au niveau Premium",
      "Idéal pour comparer avec tes amis",
    ],
  },
};

export const CURRENCIES = "FCFA";

export function saspayLink(plan: PlanId): string {
  return (process.env[PLANS[plan].linkEnv] ?? "").trim();
}

export function planByAmount(amount: number): PlanId | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.price === amount) return plan.id;
  }
  return null;
}

import { PLANS } from "./plans";
import type { PlanId } from "./types";

const API_BASE = "https://api.saspay.me/api/v1";

export const saspayApiDisponible = Boolean(process.env.SASPAY_API_SECRET);

export interface SessionCheckout {
  id: string;
  checkoutUrl: string;
}

// Crée une session de checkout hébergé avec URL de retour + metadata (session liée).
export async function creerSessionCheckout(params: {
  sessionId: string;
  plan: PlanId;
  ref: string;
  siteUrl: string;
}): Promise<SessionCheckout | null> {
  const secret = process.env.SASPAY_API_SECRET;
  if (!secret) return null;
  const plan = PLANS[params.plan];
  try {
    const res = await fetch(`${API_BASE}/checkout-sessions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: `${plan.price.toFixed(2)}`,
        currency: "XOF",
        country: "BJ",
        description: `Révélation Ta-réincarnation — ${plan.name}`,
        customer_email: `paiement.${params.ref.toLowerCase()}@ta-reincarnation.com`,
        customer_name: "Client Ta-réincarnation",
        return_url: `${params.siteUrl}/paiement/succes`,
        metadata: { session_id: params.sessionId, ref: params.ref, plan: params.plan },
      }),
    });
    if (!res.ok) {
      console.error("[saspay] création checkout échouée:", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { id?: string; checkout_url?: string };
    if (!data.id || !data.checkout_url) {
      console.error("[saspay] réponse checkout inattendue:", JSON.stringify(data).slice(0, 300));
      return null;
    }
    return { id: data.id, checkoutUrl: data.checkout_url };
  } catch (e) {
    console.error("[saspay] erreur réseau création checkout:", e);
    return null;
  }
}

export type StatutCheckout = "PAID" | "PENDING" | "FAILED" | "INCONNU";

// Vérifie l'état réel d'une session de checkout côté gateway.
export async function statutCheckout(saspaySessionId: string): Promise<StatutCheckout> {
  const secret = process.env.SASPAY_API_SECRET;
  if (!secret) return "INCONNU";
  try {
    const res = await fetch(`${API_BASE}/checkout-sessions/${saspaySessionId}/`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!res.ok) {
      console.error("[saspay] lecture statut échouée:", res.status);
      return "INCONNU";
    }
    const data = (await res.json()) as { status?: string; paid_at?: string | null };
    if (data.paid_at || data.status === "PAID" || data.status === "SUCCESS") return "PAID";
    if (data.status === "FAILED" || data.status === "CANCELLED") return "FAILED";
    return "PENDING";
  } catch (e) {
    console.error("[saspay] erreur réseau lecture statut:", e);
    return "INCONNU";
  }
}

import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { saspayApiDisponible, statutCheckout } from "@/lib/saspay";

export const dynamic = "force-dynamic";

// Sondé par la page d'attente : renvoie paid=true dès confirmation
// (webhook reçu OU vérifié en direct auprès de la gateway Saspay).
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session");
  if (!sessionId) {
    return NextResponse.json({ error: "session manquante" }, { status: 400 });
  }

  const store = getStore();
  let session = await store.getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "session introuvable" }, { status: 404 });
  }

  // Pas encore payée : on revérifie l'état réel côté Saspay pour les
  // paiements en attente de cette session (filet si le webhook est retardé).
  if (!session.plan_purchased && saspayApiDisponible) {
    const pendings = await store.getPendingPaymentsBySession(sessionId);
    for (const pending of pendings) {
      if (!pending.saspaySessionId) continue;
      const statut = await statutCheckout(pending.saspaySessionId);
      if (statut === "PAID") {
        session = (await store.markPaid(sessionId, pending.plan, pending.ref)) ?? session;
        break;
      }
    }
  }

  return NextResponse.json({
    paid: Boolean(session.plan_purchased),
    plan: session.plan_purchased,
  });
}

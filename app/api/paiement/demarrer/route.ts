import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { PLANS, saspayLink } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

interface DemarrerBody {
  session_id?: string;
  plan?: PlanId;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as DemarrerBody | null;
  const plan = body?.plan as PlanId | undefined;
  if (!body?.session_id || !plan || !(plan in PLANS)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const link = saspayLink(plan);
  if (!link) {
    return NextResponse.json(
      { error: "Lien Saspay non configuré (variable " + PLANS[plan].linkEnv + ")." },
      { status: 503 }
    );
  }

  const store = getStore();
  const session = await store.getSession(body.session_id);
  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }
  if (session.plan_purchased) {
    return NextResponse.json({ error: "Révélation déjà débloquée." }, { status: 409 });
  }

  // Référence unique : le cookie posé ici permet au retour Saspay de retrouver
  // ce paiement et de débloquer la révélation automatiquement.
  const ref = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  await store.createPendingPayment(body.session_id, plan, ref);

  const res = NextResponse.json({ ok: true, url: link });
  res.cookies.set("tri_pay", ref, {
    httpOnly: true,
    sameSite: "lax",
    path: "/paiement/succes",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { PLANS, saspayLink } from "@/lib/plans";
import { creerSessionCheckout } from "@/lib/saspay";
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

  const store = getStore();
  const session = await store.getSession(body.session_id);
  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }
  if (session.plan_purchased) {
    return NextResponse.json({ error: "Révélation déjà débloquée." }, { status: 409 });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const ref = crypto.randomUUID().replace(/-/g, "").slice(0, 24);

  // 1) Voie API : session de checkout avec URL de retour + metadata (redirection native).
  const checkout = await creerSessionCheckout({
    sessionId: body.session_id,
    plan,
    ref,
    siteUrl,
  }).catch((e) => {
    console.error("[saspay] création via API échouée, fallback sur lien statique:", e);
    return null;
  });

  if (checkout) {
    await store.createPendingPayment(body.session_id, plan, ref, checkout.id);
    const res = NextResponse.json({ ok: true, url: checkout.checkoutUrl, mode: "api" });
    res.cookies.set("tri_pay", ref, {
      httpOnly: true,
      sameSite: "lax",
      path: "/paiement/succes",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // 2) Fallback : lien de paiement statique (redirection manuelle + polling).
  const link = saspayLink(plan);
  if (!link) {
    return NextResponse.json(
      { error: "Paiement indisponible (API Saspay non configurée et lien statique manquant)." },
      { status: 503 }
    );
  }
  await store.createPendingPayment(body.session_id, plan, ref);
  const res = NextResponse.json({ ok: true, url: link, mode: "lien" });
  res.cookies.set("tri_pay", ref, {
    httpOnly: true,
    sameSite: "lax",
    path: "/paiement/succes",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

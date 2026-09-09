import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

// Sondé par la page d'attente : renvoie true dès que le webhook a confirmé.
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session");
  if (!sessionId) {
    return NextResponse.json({ error: "session manquante" }, { status: 400 });
  }
  const session = await getStore().getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "session introuvable" }, { status: 404 });
  }
  return NextResponse.json({
    paid: Boolean(session.plan_purchased),
    plan: session.plan_purchased,
  });
}

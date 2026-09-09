import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

interface ConfirmBody {
  session_id?: string;
  plan?: string;
  ref?: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ConfirmBody | null;
  const plan = body?.plan as PlanId | undefined;
  if (!body?.session_id || !plan || !(plan in PLANS)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const session = await getStore().markPaid(body.session_id, plan, body.ref ?? null);
  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    plan: session.plan_purchased,
    pack_credits: session.pack_credits,
  });
}

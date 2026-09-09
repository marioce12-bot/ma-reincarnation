import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { planByAmount } from "@/lib/plans";
import { saspayApiDisponible, statutCheckout } from "@/lib/saspay";

export const dynamic = "force-dynamic";

// Vérifie la signature SasPay: HMAC-SHA256 de "{timestamp}.{corps brut}".
// Tolerance 5 min + comparaison en temps constant (cf. docs.saspay.me).
function signatureValide(rawBody: string, headers: Headers): boolean {
  const secret = process.env.SASPAY_WEBHOOK_SECRET;
  if (!secret) return true; // pas de secret configuré → on accepte (payload loggué)
  const signature = headers.get("x-webhook-signature") ?? "";
  const timestamp = headers.get("x-webhook-timestamp") ?? "0";
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Recherche profonde d'une chaîne sous une des clés données.
function findStringByKeys(obj: unknown, keys: string[]): string | null {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findStringByKeys(item, keys);
      if (found) return found;
    }
    return null;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (keys.includes(k.toLowerCase()) && typeof v === "string") return v;
    }
    for (const v of Object.values(obj)) {
      const found = findStringByKeys(v, keys);
      if (found) return found;
    }
  }
  return null;
}

function findNumberByKeys(obj: unknown, keys: string[]): number | null {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findNumberByKeys(item, keys);
      if (found !== null) return found;
    }
    return null;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (keys.includes(k.toLowerCase())) {
        const n = typeof v === "number" ? v : parseFloat(String(v));
        if (!Number.isNaN(n)) return n;
      }
    }
    for (const v of Object.values(obj)) {
      const found = findNumberByKeys(v, keys);
      if (found !== null) return found;
    }
  }
  return null;
}

function findSessionIdInPayload(payload: unknown): string | null {
  return findStringByKeys(payload, ["session_id"]);
}

function findCheckoutSessionIdInPayload(payload: unknown): string | null {
  return findStringByKeys(payload, ["checkout_session", "checkout_session_id", "checkout_id"]);
}

const AMOUNT_KEYS = ["amount", "montant", "total", "net_amount", "charged"];

function findAmountInPayload(payload: unknown): number | null {
  return findNumberByKeys(payload, AMOUNT_KEYS);
}

function isTransactionSuccessEvent(payload: { event?: string }): boolean {
  const event = payload.event ?? "";
  if (event === "transaction.success") return true;
  if (event) return false; // autres events (failed, cancelled, test…) → rien à confirmer
  return true; // pas d'event fourni → on tente la confirmation
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  let payload: { event?: string; data?: Record<string, unknown> } = {};
  try {
    payload = JSON.parse(rawBody) as { event?: string; data?: Record<string, unknown> };
  } catch {
    console.error("[webhook saspay] corps non-JSON ignoré");
    return NextResponse.json({ ok: true, ignored: "corps non-JSON" });
  }
  console.log("[webhook saspay] event:", payload.event ?? "?", "corps:", rawBody.slice(0, 1500));

  if (!signatureValide(rawBody, req.headers)) {
    return NextResponse.json({ error: "signature invalide" }, { status: 403 });
  }

  if (!isTransactionSuccessEvent(payload)) {
    return NextResponse.json({ ok: true, ignored: `event ${payload.event ?? "inconnu"}` });
  }

  const store = getStore();

  // 1) Le payload contient la session liée (metadata echo) → confirmation précise.
  const sessionId = findSessionIdInPayload(payload);
  if (sessionId) {
    const pendings = await store.getPendingPaymentsBySession(sessionId);
    if (pendings.length > 0) {
      const p = pendings[0];
      await store.markPaid(p.session_id, p.plan, p.ref);
      return NextResponse.json({ ok: true, mode: "metadata" });
    }
  }

  // 2) Vérification directe côté gateway des sessions de checkout en attente.
  if (saspayApiDisponible) {
    const checkoutId = findCheckoutSessionIdInPayload(payload);
    const candidates = checkoutId
      ? (await store.getAllPendingPayments(20)).filter((p) => p.saspaySessionId === checkoutId)
      : await store.getAllPendingPayments(10);
    for (const p of candidates) {
      if (!p.saspaySessionId) continue;
      const statut = await statutCheckout(p.saspaySessionId);
      if (statut === "PAID") {
        await store.markPaid(p.session_id, p.plan, p.ref);
        return NextResponse.json({ ok: true, mode: "verification_api" });
      }
    }
  }

  // 3) Dernier recours sans API : référence interne ou montant (ancien flux statique).
  const ref = findStringByKeys(payload, ["transaction_ref"]);
  if (ref) {
    const pending = await store.getPendingPayment(ref);
    if (pending) {
      await store.markPaid(pending.session_id, pending.plan, ref);
      return NextResponse.json({ ok: true, mode: "reference" });
    }
  }
  const plan = planByAmount(findAmountInPayload(payload) ?? -1);
  if (plan) {
    const oldest = await store.getOldestPendingPayment(plan);
    if (oldest) {
      await store.markPaid(oldest.session_id, oldest.plan, oldest.ref);
      return NextResponse.json({ ok: true, mode: "montant", plan });
    }
    return NextResponse.json({ ok: true, ignored: "aucun paiement en attente pour ce plan" });
  }

  return NextResponse.json({ ok: true, ignored: "payload non lié" });
}

// Permet de vérifier l'URL du webhook depuis le navigateur.
export async function GET() {
  return NextResponse.json({ ok: true, message: "webhook saspay prêt" });
}

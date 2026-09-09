import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { planByAmount } from "@/lib/plans";

export const dynamic = "force-dynamic";

// Saspay envoie le payload en JSON ou en formulaire ; on accepte les deux.
async function readPayload(req: Request): Promise<Record<string, unknown>> {
  const contentType = req.headers.get("content-type") ?? "";
  const text = await req.text();
  if (!contentType.includes("application/json")) {
    const params = new URLSearchParams(text);
    const obj: Record<string, unknown> = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    return obj;
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const params = new URLSearchParams(text);
    const obj: Record<string, unknown> = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    return obj;
  }
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

// Recherche profonde d'un nombre sous une des clés données.
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

// Notre référence est un uuid de 24 caractères hexadécimaux.
const REF_PATTERN = /^[a-f0-9]{24}$/i;
function findStringByValue(obj: unknown, value: string): boolean {
  if (typeof obj === "string") return obj === value;
  if (Array.isArray(obj)) return obj.some((item) => findStringByValue(item, value));
  if (obj && typeof obj === "object") {
    for (const item of Object.values(obj)) {
      if (findStringByValue(item, value)) return true;
    }
  }
  return false;
}

function secretMatches(req: Request, payload: Record<string, unknown>): boolean {
  const secret = process.env.SASPAY_WEBHOOK_SECRET ?? process.env.SASPAY_SECRET;
  if (!secret) return true; // pas de secret configuré → on accepte
  if (req.headers.get("x-webhook-secret") === secret) return true;
  if (new URL(req.url).searchParams.get("secret") === secret) return true;
  return findStringByValue(payload, secret); // le payload peut contenir le secret
}

function findStringByPattern(obj: unknown, pattern: RegExp): string | null {
  if (typeof obj === "string") return pattern.test(obj) ? obj.toLowerCase() : null;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findStringByPattern(item, pattern);
      if (found) return found;
    }
    return null;
  }
  if (obj && typeof obj === "object") {
    for (const v of Object.values(obj)) {
      const found = findStringByPattern(v, pattern);
      if (found) return found;
    }
  }
  return null;
}

function findRefInPayload(payload: Record<string, unknown>): string | null {
  const explicit = findStringByKeys(payload, [
    "custom_data",
    "metadata",
    "order_id",
    "client_ref",
    "external_id",
    "transaction_ref",
  ]);
  if (explicit && REF_PATTERN.test(explicit)) return explicit.toLowerCase();
  return findStringByPattern(payload, REF_PATTERN);
}

// Statuts qui déclenchent la confirmation ; sans statut, on tente la confirmation.
const SUCCESS_VALUES = new Set([
  "success",
  "successful",
  "paid",
  "completed",
  "complete",
  "approved",
  "succeeded",
  "true",
  "1",
  "done",
  "ok",
]);

function isSuccessful(payload: Record<string, unknown>): boolean {
  const status = findStringByKeys(payload, [
    "status",
    "state",
    "result",
    "payment_status",
    "transaction_status",
  ]);
  if (status == null) return true;
  return SUCCESS_VALUES.has(status.toLowerCase());
}

// Saspay peut confirmer par notre référence (si le payload la contient)
// ou par montant (le plus ancien paiement en attente de ce plan).
export async function POST(req: Request) {
  const payload = await readPayload(req);
  console.log("[webhook saspay] payload:", JSON.stringify(payload).slice(0, 2000));

  if (!secretMatches(req, payload)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isSuccessful(payload)) {
    console.log("[webhook saspay] statut non-final — ignoré");
    return NextResponse.json({ ok: true, ignored: "statut non réussi" });
  }

  const store = getStore();

  const ref = findRefInPayload(payload);
  if (ref) {
    const pending = await store.getPendingPayment(ref);
    if (pending) {
      await store.markPaid(pending.session_id, pending.plan, ref);
      return NextResponse.json({ ok: true, mode: "reference" });
    }
  }

  const amount = findNumberByKeys(payload, ["amount", "montant", "total", "prix", "price", "value"]);
  if (amount != null) {
    const plan = planByAmount(amount);
    if (plan) {
      const oldest = await store.getOldestPendingPayment(plan);
      if (oldest) {
        await store.markPaid(oldest.session_id, oldest.plan, oldest.ref);
        console.log("[webhook saspay] confirmé par montant:", plan);
        return NextResponse.json({ ok: true, mode: "montant", plan });
      }
      return NextResponse.json({ ok: true, ignored: "aucun paiement en attente pour ce plan" });
    }
  }

  return NextResponse.json({ ok: true, ignored: "payload non reconnu" });
}

// Permet de vérifier l'URL du webhook depuis le navigateur.
export async function GET() {
  return NextResponse.json({ ok: true, message: "webhook saspay prêt" });
}

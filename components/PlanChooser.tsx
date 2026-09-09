"use client";

import { PLANS } from "@/lib/plans";
import SaspayPayButton from "./SaspayPayButton";

const ORDER: Array<"standard" | "premium" | "pack"> = ["standard", "premium", "pack"];

export default function PlanChooser({
  sessionId,
  highlight,
}: {
  sessionId: string;
  highlight?: string;
}) {
  return (
    <div className="grid gap-4">
      {ORDER.map((id) => {
        const plan = PLANS[id];
        const highlighted = highlight === id;
        return (
          <div
            key={id}
            className={`rounded-3xl border p-6 ${
              highlighted ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <p className="font-display text-lg font-semibold">{plan.name}</p>
              <p className="font-bold text-gold2">{plan.price} FCFA</p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-sand/80">
              {plan.features.map((feature) => (
                <li key={feature}>✨ {feature}</li>
              ))}
            </ul>
            <div className="mt-5">
              <SaspayPayButton
                sessionId={sessionId}
                plan={id}
                label={`Payer ${plan.price} FCFA avec Saspay`}
              />
            </div>
            <p className="mt-2 text-center text-[11px] text-sand/50">
              MTN MoMo, Moov Money — ta fiche s&apos;ouvre automatiquement dès que le paiement
              est confirmé
            </p>
          </div>
        );
      })}
    </div>
  );
}

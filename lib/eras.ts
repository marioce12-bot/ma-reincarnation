import type { Affinity } from "./types";

export interface AffinityMeta {
  id: Affinity;
  label: string;
  emoji: string;
  from: string;
  to: string;
}

export const AFFINITIES: AffinityMeta[] = [
  { id: "afrique-ancienne", label: "Afrique ancienne", emoji: "🌍", from: "#7C2D12", to: "#E7A23C" },
  { id: "europe-medievale", label: "Europe médiévale", emoji: "🏰", from: "#312E81", to: "#8B5CF6" },
  { id: "asie-imperiale", label: "Asie impériale", emoji: "🐉", from: "#991B1B", to: "#F59E0B" },
  { id: "ameriques-precoloniales", label: "Amériques précoloniales", emoji: "🦅", from: "#064E3B", to: "#10B981" },
  { id: "monde-arabe", label: "Mondes arabes & caravanes", emoji: "🐪", from: "#1E1B4B", to: "#0EA5E9" },
  { id: "oceanie-insulaire", label: "Îles & mers du Sud", emoji: "🌊", from: "#0C4A6E", to: "#22D3EE" },
];

export function affinityMeta(id: string | undefined): AffinityMeta {
  return AFFINITIES.find((a) => a.id === id) ?? AFFINITIES[0];
}

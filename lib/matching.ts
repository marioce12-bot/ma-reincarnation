import { QUESTIONS } from "./quiz";
import type { Character } from "./types";

export interface MatchResult {
  character: Character;
  compatibility: number;
}

function tagWeights(answers: Record<string, string>): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const q of QUESTIONS) {
    const option = q.options.find((o) => o.id === answers[q.id]);
    if (!option?.tags) continue;
    for (const t of option.tags) weights[t] = (weights[t] ?? 0) + 1;
  }
  return weights;
}

export function userAffinity(answers: Record<string, string>): string | null {
  const a = answers["epoque"];
  return a && a !== "surprise" ? a : null;
}

export function matchCharacter(characters: Character[], answers: Record<string, string>): MatchResult {
  const weights = tagWeights(answers);
  const affinity = userAffinity(answers);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  const scored = characters.map((c) => {
    const tagScore =
      Object.entries(weights).reduce(
        (sum, [tag, w]) => sum + (c.personality_tags.includes(tag) ? w : 0),
        0
      ) / totalWeight;
    const affinityScore = affinity == null ? 0.5 : c.affinity_tags.includes(affinity as never) ? 1 : 0.1;
    // Facteur aléatoire (±13 %) : deux profils proches n'ont pas toujours le même résultat
    const jitter = 0.87 + Math.random() * 0.26;
    return { character: c, score: (tagScore * 0.65 + affinityScore * 0.35) * jitter };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const compatibility = Math.min(98, Math.max(70, Math.round(70 + best.score * 28)));
  return { character: best.character, compatibility };
}

export function matchedTagsFor(character: Character, answers: Record<string, string>): string[] {
  const weights = tagWeights(answers);
  return Object.keys(weights)
    .filter((t) => character.personality_tags.includes(t))
    .sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0));
}

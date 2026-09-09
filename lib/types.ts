export type Affinity =
  | "afrique-ancienne"
  | "europe-medievale"
  | "asie-imperiale"
  | "ameriques-precoloniales"
  | "monde-arabe"
  | "oceanie-insulaire";

export type PlanId = "standard" | "premium" | "pack";

export interface Character {
  id: string; // slug, ex: "abiba-conseillere-abomey"
  name: string;
  era: string;
  location: string;
  profession: string;
  personality_tags: string[];
  affinity_tags: Affinity[];
  hook: string;
  story_short: string;
  story_long: string;
  portrait_url: string | null;
  location_card_url: string | null;
}

export interface QuizSession {
  id: string;
  created_at: string;
  birth_date: string | null;
  zodiac: string | null;
  answers: Record<string, string> | null;
  matched_character_id: string;
  compatibility_score: number;
  plan_purchased: "standard" | "premium" | null;
  paid_at: string | null;
  pack_credits: number;
}

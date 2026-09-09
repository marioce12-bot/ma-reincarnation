import type { Affinity } from "./types";

export interface QuizOption {
  id: string;
  emoji: string;
  label: string;
  tags?: string[];
  affinity?: Affinity | "surprise";
}

export interface QuizQuestion {
  id: string;
  label: string;
  options: QuizOption[];
}

export const TAG_LABELS: Record<string, string> = {
  leader: "Leader né",
  observateur: "Observateur fin",
  creatif: "Esprit créatif",
  protecteur: "Protecteur des siens",
  negociateur: "Négociateur né",
  combattant: "Cœur de combattant",
  spirituel: "Âme spirituelle",
  curieux: "Curiosité sans fin",
  artiste: "Artiste dans la peau",
  commercant: "Sens du commerce",
  explorateur: "Explorateur infatigable",
  erudit: "Soif de savoir",
  diplomate: "Diplomate naturel",
  charismatique: "Charisme magnétique",
  solitaire: "Force tranquille",
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "groupe",
    label: "Dans un groupe, on te connaît plutôt comme…",
    options: [
      { id: "leader", emoji: "🦁", label: "Le leader qu'on suit", tags: ["leader", "charismatique"] },
      { id: "observateur", emoji: "🦉", label: "Celui/celle qui remarque tout", tags: ["observateur", "solitaire"] },
      { id: "creatif", emoji: "🎨", label: "La tête créative du groupe", tags: ["creatif", "artiste"] },
      { id: "protecteur", emoji: "🛡️", label: "Le/la protecteur(trice) des siens", tags: ["protecteur"] },
    ],
  },
  {
    id: "vibration",
    label: "Ce qui te fait vibrer le plus…",
    options: [
      { id: "nature", emoji: "🌍", label: "Les grands espaces et la nature", tags: ["explorateur"] },
      { id: "art", emoji: "🎭", label: "L'art et la beauté", tags: ["artiste", "creatif"] },
      { id: "commerce", emoji: "💰", label: "Le commerce et les bonnes affaires", tags: ["commercant", "negociateur"] },
      { id: "aventure", emoji: "🧭", label: "L'aventure et l'inconnu", tags: ["explorateur", "curieux"] },
    ],
  },
  {
    id: "conflit",
    label: "Face à un conflit, ta première réaction…",
    options: [
      { id: "paix", emoji: "🕊️", label: "Chercher un terrain d'entente", tags: ["diplomate", "negociateur"] },
      { id: "defendre", emoji: "⚔️", label: "Défendre ma position farouchement", tags: ["combattant", "leader"] },
      { id: "unir", emoji: "🤝", label: "Rassembler les gens autour de moi", tags: ["charismatique", "diplomate"] },
      { id: "recul", emoji: "🌙", label: "Prendre du recul et observer", tags: ["observateur", "solitaire"] },
    ],
  },
  {
    id: "trait",
    label: "On te dit surtout…",
    options: [
      { id: "savant", emoji: "📚", label: "Curieux(se), toujours en train d'apprendre", tags: ["erudit", "curieux"] },
      { id: "mysteres", emoji: "✨", label: "Attiré(e) par les mystères et l'invisible", tags: ["spirituel", "curieux"] },
      { id: "charismatique", emoji: "🗣️", label: "Celui/celle qu'on écoute", tags: ["charismatique", "leader"] },
      { id: "tetu", emoji: "💪", label: "Débrouillard(e) et têtu(e)", tags: ["combattant", "protecteur"] },
    ],
  },
  {
    id: "epoque",
    label: "Une époque t'appelle plus que les autres…",
    options: [
      { id: "afrique-ancienne", emoji: "🌍", label: "Afrique ancienne", affinity: "afrique-ancienne" },
      { id: "europe-medievale", emoji: "🏰", label: "Europe médiévale", affinity: "europe-medievale" },
      { id: "asie-imperiale", emoji: "🐉", label: "Asie impériale", affinity: "asie-imperiale" },
      { id: "ameriques-precoloniales", emoji: "🦅", label: "Amériques précoloniales", affinity: "ameriques-precoloniales" },
      { id: "monde-arabe", emoji: "🐪", label: "Mondes arabes & caravanes", affinity: "monde-arabe" },
      { id: "oceanie-insulaire", emoji: "🌊", label: "Îles & mers du Sud", affinity: "oceanie-insulaire" },
      { id: "surprise", emoji: "🤷", label: "Aucune idée — surprends-moi", affinity: "surprise" },
    ],
  },
];

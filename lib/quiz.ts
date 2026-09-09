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

// « Les Échos de l'âme » — parcours en 9 fragments.
// Chaque question évite de nommer directement une époque, un métier ou un trait :
// on laisse l'instinct répondre. Les tags alimentent le score de personnalité
// (lib/matching.ts), la question "lieu" porte seule l'affinité géographique/historique.
export const QUESTIONS: QuizQuestion[] = [
  {
    id: "lieu",
    label:
      "Tu arrives dans un endroit où tu n'es jamais allé. Pourtant, quelque chose te semble étrangement familier. Lequel ?",
    options: [
      { id: "ocean", emoji: "🌊", label: "Un village face à l'océan, où l'on apprend à lire le ciel avant de marcher", affinity: "oceanie-insulaire" },
      { id: "tambours", emoji: "🥁", label: "Une grande cour où les tambours parlent avant les hommes", affinity: "afrique-ancienne" },
      { id: "pont", emoji: "🏰", label: "Une forteresse de pierre grise, un pont gardé, une route de pèlerins", affinity: "europe-medievale" },
      { id: "porcelaine", emoji: "🐉", label: "Une cité aux toits de porcelaine, où l'on écrit avant de parler", affinity: "asie-imperiale" },
      { id: "caravane", emoji: "🐪", label: "Un marché sous les étoiles, entre les caravanes de sel et les cartes du ciel", affinity: "monde-arabe" },
      { id: "marches", emoji: "🦅", label: "Des marches de pierre qui montent vers un ciel qu'on compte en jours", affinity: "ameriques-precoloniales" },
      { id: "surprise", emoji: "🤷", label: "Aucune idée — laisse le hasard choisir", affinity: "surprise" },
    ],
  },
  {
    id: "objet",
    label:
      "Dans une pièce abandonnée, cinq objets reposent devant toi. Sans savoir pourquoi, lequel as-tu envie de toucher ?",
    options: [
      { id: "lame", emoji: "🗡️", label: "Une lame ancienne couverte de motifs", tags: ["combattant", "protecteur"] },
      { id: "talisman", emoji: "🪬", label: "Un pendentif ou un talisman", tags: ["spirituel", "curieux"] },
      { id: "couronne", emoji: "👑", label: "Une couronne ancienne", tags: ["leader", "charismatique"] },
      { id: "masque", emoji: "🎨", label: "Un masque peint à la main", tags: ["artiste", "creatif"] },
      { id: "carte", emoji: "🧭", label: "Une carte très ancienne", tags: ["explorateur", "curieux"] },
    ],
  },
  {
    id: "reve",
    label:
      "Cette nuit, tu fais un rêve étrange. Au réveil, une seule image reste dans ta mémoire.",
    options: [
      { id: "eau", emoji: "🌊", label: "Une grande étendue d'eau", tags: ["explorateur", "solitaire"] },
      { id: "feu", emoji: "🔥", label: "Un feu dans la nuit", tags: ["combattant", "charismatique"] },
      { id: "blanc", emoji: "🕊️", label: "Une personne vêtue de blanc", tags: ["spirituel", "diplomate"] },
      { id: "ville", emoji: "🏛️", label: "Une ville ancienne", tags: ["erudit", "observateur"] },
      { id: "animal", emoji: "🦉", label: "Un animal qui te regarde", tags: ["curieux", "solitaire"] },
      { id: "porte", emoji: "🚪", label: "Une porte que tu n'arrives pas à ouvrir", tags: ["erudit", "curieux"] },
    ],
  },
  {
    id: "son",
    label: "Ferme les yeux quelques secondes. Lequel de ces sons te semble étrangement familier ?",
    options: [
      { id: "vagues", emoji: "🌊", label: "Les vagues contre les rochers", tags: ["explorateur", "solitaire"] },
      { id: "tambours-son", emoji: "🥁", label: "Des tambours au loin", tags: ["leader", "charismatique"] },
      { id: "cloche", emoji: "🔔", label: "Une cloche dans un temple", tags: ["spirituel", "erudit"] },
      { id: "crepitement", emoji: "🔥", label: "Le crépitement d'un feu", tags: ["protecteur", "creatif"] },
      { id: "chevaux", emoji: "🐎", label: "Des chevaux au galop", tags: ["combattant", "explorateur"] },
      { id: "foule", emoji: "🗣️", label: "Une foule dans une grande cité", tags: ["commercant", "negociateur"] },
    ],
  },
  {
    id: "peur",
    label:
      "Parmi ces situations, laquelle te mettrait le plus mal à l'aise, même sans raison particulière ?",
    options: [
      { id: "enferme", emoji: "🔒", label: "Être enfermé dans un endroit sans issue", tags: ["explorateur", "curieux"] },
      { id: "seul-eau", emoji: "🌊", label: "Être seul au milieu d'une immense étendue d'eau", tags: ["diplomate", "charismatique"] },
      { id: "trahison", emoji: "💔", label: "Voir quelqu'un que tu aimes trahir ta confiance", tags: ["diplomate", "protecteur"] },
      { id: "possessions", emoji: "🪙", label: "Perdre toutes tes possessions", tags: ["commercant", "negociateur"] },
      { id: "proteger", emoji: "🛡️", label: "Être incapable de protéger quelqu'un", tags: ["protecteur", "combattant"] },
      { id: "oublie", emoji: "🕯️", label: "Être oublié après ta mort", tags: ["artiste", "charismatique"] },
    ],
  },
  {
    id: "role",
    label: "Une crise éclate autour de toi. Personne ne sait quoi faire. Sans réfléchir, que fais-tu ?",
    options: [
      { id: "decide", emoji: "👑", label: "Je prends les décisions", tags: ["leader"] },
      { id: "comprend", emoji: "🦉", label: "Je cherche à comprendre ce qui se passe", tags: ["observateur", "erudit"] },
      { id: "protege-role", emoji: "🛡️", label: "Je protège les autres", tags: ["protecteur", "combattant"] },
      { id: "expert", emoji: "🤝", label: "Je cherche quelqu'un capable de résoudre le problème", tags: ["diplomate", "negociateur"] },
      { id: "rassemble", emoji: "🗣️", label: "Je rassemble les gens", tags: ["charismatique", "leader"] },
      { id: "aide", emoji: "🧭", label: "Je pars chercher de l'aide", tags: ["explorateur", "curieux"] },
    ],
  },
  {
    id: "art",
    label: "Si tu devais laisser une seule œuvre derrière toi avant de disparaître, laquelle choisirais-tu ?",
    options: [
      { id: "peinture", emoji: "🎨", label: "Une peinture", tags: ["artiste", "creatif"] },
      { id: "masque-art", emoji: "🎭", label: "Un masque", tags: ["artiste", "spirituel"] },
      { id: "musique", emoji: "🎶", label: "Une musique", tags: ["artiste", "charismatique"] },
      { id: "texte", emoji: "📜", label: "Un texte", tags: ["erudit", "artiste"] },
      { id: "monument", emoji: "🏛️", label: "Un monument", tags: ["leader", "creatif"] },
      { id: "objet-precieux", emoji: "💍", label: "Un objet précieux", tags: ["commercant", "creatif"] },
    ],
  },
  {
    id: "moral",
    label:
      "Ton peuple est en danger. Tu détiens une information qui pourrait le sauver — mais la révéler condamnerait quelqu'un que tu aimes. Que fais-tu ?",
    options: [
      { id: "justice", emoji: "⚖️", label: "Je parle. Le bien du plus grand nombre passe avant tout", tags: ["leader", "combattant"] },
      { id: "loyaute", emoji: "❤️", label: "Je me tais. Je ne trahirai jamais quelqu'un que j'aime", tags: ["protecteur", "diplomate"] },
      { id: "troisieme-voie", emoji: "🤝", label: "Je cherche une troisième voie, coûte que coûte", tags: ["negociateur", "diplomate"] },
      { id: "destin", emoji: "🕊️", label: "Je laisse le destin décider à ma place", tags: ["spirituel", "solitaire"] },
    ],
  },
  {
    id: "final",
    label: "Si ton âme pouvait conserver une seule chose d'une vie passée, laquelle choisirais-tu ?",
    options: [
      { id: "pouvoir", emoji: "👑", label: "Le pouvoir", tags: ["leader", "charismatique"] },
      { id: "amour", emoji: "❤️", label: "L'amour", tags: ["protecteur", "diplomate"] },
      { id: "connaissance", emoji: "📚", label: "La connaissance", tags: ["erudit", "curieux"] },
      { id: "liberte", emoji: "🧭", label: "La liberté", tags: ["explorateur", "solitaire"] },
      { id: "creation", emoji: "🎨", label: "La création", tags: ["artiste", "creatif"] },
      { id: "paix", emoji: "🕊️", label: "La paix", tags: ["spirituel", "diplomate"] },
    ],
  },
];

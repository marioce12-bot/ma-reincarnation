import Link from "next/link";
import charactersJson from "@/data/characters.json";
import type { Character } from "@/lib/types";
import { PLANS } from "@/lib/plans";
import CharacterAvatar from "@/components/CharacterAvatar";

const examples: { id: string; score: number }[] = [
  { id: "abiba-conseillere-abomey", score: 94 },
  { id: "kenji-stratege-kiso", score: 89 },
  { id: "tepua-navigatrice-tuamotu", score: 92 },
];

const steps = [
  {
    emoji: "📅",
    title: "Réponds à 6 questions",
    text: "Ta date de naissance, ta personnalité, l'époque qui t'appelle. Moins de deux minutes.",
  },
  {
    emoji: "✨",
    title: "Le destin croise les signes",
    text: "Ton signe zodiacal, tes réponses et un soupçon de hasard — comme dans toute vie passée.",
  },
  {
    emoji: "📜",
    title: "Ta révélation s'ouvre",
    text: "Aperçu gratuit immédiat, puis ta fiche complète : nom, époque, lieu, métier et ton histoire.",
  },
];

export default function Landing() {
  const characters = charactersJson as unknown as Character[];
  const cards = examples.map((e) => {
    const character = characters.find((c) => c.id === e.id) as Character;
    return { ...character, score: e.score };
  });

  return (
    <main className="px-5 pb-28 pt-14 md:pb-10">
      <section className="mx-auto max-w-xl text-center">
        <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold2">
          100 % ludique · aucun compte requis
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-5xl">
          Et si tu avais <em className="text-gold2">déjà vécu</em> ?
        </h1>
        <p className="mt-4 text-sand/80">
          Réponds à 6 questions et découvre qui tu étais dans une vie antérieure : nom, époque,
          lieu et ton histoire complète.
        </p>
        <div className="mt-7 hidden md:block">
          <Cta />
        </div>
        <p className="mt-3 text-xs text-sand/50">
          {`Aperçu gratuit · moins de 2 minutes · dès ${PLANS.standard.price} FCFA pour la fiche complète`}
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="text-center font-display text-xl font-semibold text-gold2">
          Ils ont déjà vécu
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <article key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <CharacterAvatar character={c} size={56} />
                <div className="min-w-0">
                  <h3 className="truncate font-semibold leading-tight">
                    {c.name.split(",")[0]}
                  </h3>
                  <p className="text-xs text-sand/60">{c.era}</p>
                </div>
              </div>
              <p className="mt-3 text-sm italic text-sand/80">« {c.hook} »</p>
              <p className="mt-3 text-xs font-semibold text-gold2">
                {c.score} % de compatibilité
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-xl">
        <h2 className="text-center font-display text-xl font-semibold">Comment ça marche</h2>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className="font-semibold">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 text-sm text-sand/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-night/90 p-4 backdrop-blur md:hidden">
        <Cta />
      </div>
    </main>
  );
}

function Cta() {
  return (
    <Link
      href="/quiz"
      className="block rounded-2xl bg-gold px-6 py-4 text-center text-lg font-bold text-night shadow-lg shadow-gold/20 transition hover:bg-gold2"
    >
      Découvre ta réincarnation
    </Link>
  );
}

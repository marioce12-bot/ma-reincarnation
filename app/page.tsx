import Link from "next/link";
import charactersJson from "@/data/characters.json";
import type { Character } from "@/lib/types";
import { PLANS } from "@/lib/plans";
import CharacterAvatar from "@/components/CharacterAvatar";
import Reveal from "@/components/Reveal";

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

const trustPoints = [
  { emoji: "⚡", title: "2 minutes", text: "Pas besoin de compte, pas d'inscription." },
  { emoji: "🎭", title: "Une révélation unique", text: "Ton résultat dépend de tes réponses." },
  { emoji: "📜", title: "Une histoire personnalisée", text: "Nom, époque, lieu et récit complet." },
  { emoji: "🔒", title: "Paiement sécurisé", text: "Mobile Money — MTN MoMo / Moov Money." },
];

const faq = [
  { q: "Est-ce réel ?", a: "Non. C'est une expérience 100 % ludique, sans valeur scientifique ni ésotérique." },
  { q: "Dois-je créer un compte ?", a: "Non, jamais. Garde simplement le lien de ta révélation pour la retrouver." },
  {
    q: "Combien ça coûte ?",
    a: `L'aperçu est gratuit. La fiche complète démarre à ${PLANS.standard.price} FCFA, avec un plan Premium à ${PLANS.premium.price} FCFA et un pack 3 révélations à ${PLANS.pack.price} FCFA.`,
  },
  { q: "Puis-je recommencer ?", a: "Oui, autant de fois que tu veux — chaque tentative peut révéler une vie différente." },
];

export default function Landing() {
  const characters = charactersJson as unknown as Character[];
  const cards = examples.map((e) => {
    const character = characters.find((c) => c.id === e.id) as Character;
    return { ...character, score: e.score };
  });

  return (
    <main className="px-5 pb-28 pt-14 md:pb-10">
      <Reveal>
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

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-qui-etais-tu.webp"
            alt="Qui étais-tu vraiment dans une autre vie ?"
            width={1122}
            height={1402}
            className="mx-auto mt-7 w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
          />

          <div className="mt-7 hidden md:block">
            <Cta />
          </div>
          <p className="mt-3 text-xs text-sand/50">
            {`Aperçu gratuit · moins de 2 minutes · dès ${PLANS.standard.price} FCFA pour la fiche complète`}
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto mt-14 max-w-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-quatre-vies.webp"
            alt="Quatre vies passées possibles : reine africaine, samouraï, prêtresse égyptienne, général romain"
            width={1536}
            height={1024}
            className="w-full rounded-3xl border border-white/10"
          />
        </section>
      </Reveal>

      <section className="mx-auto mt-14 max-w-3xl">
        <Reveal>
          <h2 className="text-center font-display text-xl font-semibold text-gold2">
            Ils ont déjà vécu
          </h2>
        </Reveal>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.id} delay={i * 120}>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform duration-300 hover:-translate-y-1">
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
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-xl">
        <Reveal>
          <h2 className="text-center font-display text-xl font-semibold">Comment ça marche</h2>
        </Reveal>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <li className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="font-semibold">
                    {i + 1}. {s.title}
                  </p>
                  <p className="mt-1 text-sm text-sand/70">{s.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-14 max-w-xl">
        <Reveal>
          <h2 className="text-center font-display text-xl font-semibold">Ta carte de destin</h2>
          <p className="mt-2 text-center text-sm text-sand/70">
            En Premium, ta révélation devient une carte à partager sur WhatsApp, Instagram ou
            TikTok — comme celle-ci.
          </p>
        </Reveal>
        <Reveal delay={120}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/carte-exemple-amina.webp"
            alt="Exemple de carte de destin : Reine Amina du royaume de Zazzau"
            width={1122}
            height={1402}
            className="mx-auto mt-6 w-full max-w-xs rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
          />
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-4 text-center text-xs text-sand/50">
            Exemple généré pour Ta-réincarnation · ta carte sera unique, basée sur tes réponses.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-14 max-w-xl">
        <Reveal>
          <h2 className="text-center font-display text-xl font-semibold">Pourquoi essayer ?</h2>
        </Reveal>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {trustPoints.map((t, i) => (
            <Reveal key={t.title} delay={i * 100}>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-xl">{t.emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="mt-1 text-xs text-sand/60">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-xl">
        <Reveal>
          <h2 className="text-center font-display text-xl font-semibold">Questions fréquentes</h2>
        </Reveal>
        <div className="mt-5 space-y-3">
          {faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-gold2">{f.q}</p>
                <p className="mt-1 text-sm text-sand/70">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
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

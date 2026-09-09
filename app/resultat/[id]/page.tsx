import Link from "next/link";
import { notFound } from "next/navigation";
import CharacterAvatar from "@/components/CharacterAvatar";
import DestinyReveal from "@/components/DestinyReveal";
import { affinityMeta } from "@/lib/eras";
import { PLANS } from "@/lib/plans";
import { matchedTagsFor, userAffinity } from "@/lib/matching";
import { TAG_LABELS } from "@/lib/quiz";
import { getStore } from "@/lib/store";
import type { Character, QuizSession } from "@/lib/types";

export const dynamic = "force-dynamic";

const AFFINITY_LABELS: Record<string, string> = {
  "afrique-ancienne": "Afrique ancienne",
  "europe-medievale": "Europe médiévale",
  "asie-imperiale": "Asie impériale",
  "monde-arabe": "Monde arabe",
  "ameriques-precoloniales": "Amériques précoloniales",
  "oceanie-insulaire": "Océanie",
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = getStore();
  const session = await store.getSession(id);
  if (!session) notFound();
  const character = await store.getCharacter(session.matched_character_id);
  if (!character) notFound();

  const plan = session.plan_purchased;
  const answers = session.answers ?? {};
  const meta = affinityMeta(character.affinity_tags[0]);
  const indices = [
    ...matchedTagsFor(character, answers).map((t) => TAG_LABELS[t] ?? t),
    ...(userAffinity(answers) === character.affinity_tags[0]
      ? [`Attirance pour ${meta.label}`]
      : []),
  ];

  return (
    <main className="mx-auto max-w-xl px-5 pb-16 pt-10">
      <DestinyReveal>
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sand/50">Ta vie antérieure</p>
          <div className="mt-4 flex justify-center">
            <div
              className="animate-pulse-glow rounded-full p-1"
              style={{ background: `linear-gradient(145deg, ${meta.to}, ${meta.from})` }}
            >
              <CharacterAvatar character={character} size={96} className="rounded-full" />
            </div>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-snug">{character.name}</h1>
          <p className="mt-2 text-sm text-sand/70">{character.era}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-bold text-gold2">
              {session.compatibility_score} % de compatibilité
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-sand/80">
              {session.zodiac ? `Ton signe : ${session.zodiac}` : "Signe inconnu"}
            </span>
          </div>
        </header>
      </DestinyReveal>

      {plan ? (
        <UnlockedResult
          character={character}
          plan={plan}
          session={session}
          indices={indices}
        />
      ) : (
        <LockedResult character={character} session={session} />
      )}
    </main>
  );
}

function LockedResult({
  character,
  session,
}: {
  character: Character;
  session: QuizSession;
}) {
  return (
    <section className="mt-6">
      <p className="text-center font-display text-lg italic text-sand/90">« {character.hook} »</p>

      <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="space-y-4 p-6 text-sm leading-relaxed text-sand/70 blur-[5px] select-none" aria-hidden>
          <p>📍 {character.location}</p>
          <p>🔨 {character.profession}</p>
          <p>{character.story_short.slice(0, 220)}…</p>
          <p>« Ton destin ne change pas de visage — il change de siècle. »</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night/40 text-center">
          <span className="text-4xl">🔒</span>
          <p className="font-display text-xl font-semibold">Ton histoire complète t&apos;attend</p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/paiement/${session.id}`}
          className="block rounded-2xl bg-gold px-6 py-4 text-center text-lg font-bold text-night shadow-lg shadow-gold/20 transition hover:bg-gold2"
        >
          {`Débloquer ma fiche complète — dès ${PLANS.standard.price} FCFA`}
        </Link>
        <p className="mt-3 text-center text-xs text-sand/50">
          Paiement Mobile Money (MTN MoMo, Moov Money) · débloqué en 30 secondes
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-xs leading-relaxed text-sand/60">
        📎 Garde précieusement le lien de cette page : c&apos;est ta clé de révélation.
        <br />
        <span className="break-all text-sand/40">/resultat/{session.id}</span>
      </div>
    </section>
  );
}

function UnlockedResult({
  character,
  plan,
  session,
  indices,
}: {
  character: Character;
  plan: "standard" | "premium";
  session: QuizSession;
  indices: string[];
}) {
  const meta = affinityMeta(character.affinity_tags[0]);

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sand/50">Ta fiche</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="text-sand/60">Lieu</dt>
            <dd className="flex-1 font-semibold">{character.location}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-sand/60">Métier</dt>
            <dd className="flex-1 font-semibold">{character.profession}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-sand/60">Compatibilité</dt>
            <dd className="flex-1 font-semibold text-gold2">{session.compatibility_score} %</dd>
          </div>
        </dl>
        <p className="mt-5 leading-relaxed text-sand/90">{character.story_short}</p>
      </div>

      <div className="relative">
        <div className="flex justify-center rounded-3xl border border-white/10 bg-white/5 p-8">
          <CharacterAvatar character={character} size={288} />
        </div>
        {plan === "standard" && (
          <span className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-0.5 text-[10px] text-sand/80">
            ta-reincarnation.com
          </span>
        )}
        {plan === "premium" && (
          <div className="mt-3 text-center">
            <a
              href={character.portrait_url ?? `/api/og?session=${session.id}&format=portrait`}
              download="ta-reincarnation-portrait.png"
              className="text-xs font-semibold text-gold2 underline underline-offset-2"
            >
              ⬇ Télécharger ton portrait HD
            </a>
          </div>
        )}
      </div>

      {plan === "premium" ? (
        <>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-sand/50">Ton histoire complète</p>
            <p className="mt-4 leading-relaxed text-sand/90">{character.story_long}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            {character.location_card_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={character.location_card_url}
                alt={`Carte — ${character.location}`}
                className="w-full rounded-2xl"
              />
            ) : (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: `linear-gradient(145deg, ${meta.to}, ${meta.from})` }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-night/70">
                  Lieu de ta vie antérieure
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-night">
                  {character.location}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-sand/50">Pourquoi toi ?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {indices.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-gold2"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-gold/30 bg-gold/5 p-6">
          <p className="font-display text-lg font-semibold">Pousse plus loin</p>
          <ul className="mt-3 space-y-1 text-sm text-sand/80">
            <li>📜 Histoire longue enrichie</li>
            <li>🗺️ Carte du lieu de vie</li>
            <li>✨ Les indices du destin</li>
            <li>🖼️ Portrait HD sans filigrane</li>
          </ul>
          <Link
            href={`/paiement/${session.id}?plan=premium`}
            className="mt-5 block rounded-2xl bg-gold px-6 py-4 text-center text-lg font-bold text-night transition hover:bg-gold2"
          >
            {`Passer en Premium — ${PLANS.premium.price} FCFA`}
          </Link>
        </div>
      )}

      {session.pack_credits > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm">
          🎁 {session.pack_credits} révélation{session.pack_credits > 1 ? "s" : ""} offerte
          {session.pack_credits > 1 ? "s" : ""} restante
          {session.pack_credits > 1 ? "s" : ""} dans ton pack
        </div>
      )}

      <div className="space-y-3 text-center">
        <Link
          href={`/partage/${session.id}`}
          className="block rounded-2xl border border-gold/60 px-6 py-4 text-center font-semibold text-gold2 transition hover:bg-gold/10"
        >
          Partager ma révélation
        </Link>
        <Link
          href="/quiz"
          className="block rounded-2xl bg-gold px-6 py-4 text-center font-bold text-night transition hover:bg-gold2"
        >
          Découvrir une autre vie
        </Link>
        <p className="text-xs text-sand/50">
          Ta prochaine révélation se débloque gratuitement si des crédits de pack restent — sinon
          le paiement te sera proposé.
        </p>
      </div>
    </section>
  );
}

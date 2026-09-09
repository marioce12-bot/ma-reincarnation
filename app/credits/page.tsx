import type { Metadata } from "next";
import charactersJson from "@/data/characters.json";
import creditsJson from "@/data/image-credits.json";
import type { Character } from "@/lib/types";

export const metadata: Metadata = {
  title: "Crédits images — Ta-réincarnation",
};

interface Credit {
  file: string;
  title: string;
  source: string;
  license: string;
}

const credits = creditsJson as unknown as Credit[];
const characters = charactersJson as unknown as Character[];

const usedByFile = new Map<string, string[]>();
for (const character of characters) {
  if (!character.portrait_url) continue;
  const names = usedByFile.get(character.portrait_url) ?? [];
  names.push(character.name.split(",")[0]);
  usedByFile.set(character.portrait_url, names);
}

const used = credits.filter((c) => usedByFile.has(c.file));
const bank = credits.filter((c) => !usedByFile.has(c.file));

function CreditRow({ credit }: { credit: Credit }) {
  const who = usedByFile.get(credit.file);
  return (
    <li className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={credit.file}
        alt={credit.title}
        loading="lazy"
        className="h-20 w-16 flex-none rounded-xl object-cover"
      />
      <div className="min-w-0 text-left">
        <p className="text-sm font-semibold leading-snug">{credit.title}</p>
        <p className="mt-1 text-xs text-sand/60">
          {who ? `Portrait de : ${who.join(", ")}` : "Banque d'images (non attribuée)"}
        </p>
        <p className="mt-1 text-xs text-gold2">{credit.license}</p>
        <a
          href={credit.source}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-xs text-sand/60 underline underline-offset-2 hover:text-sand"
        >
          Voir la source ↗
        </a>
      </div>
    </li>
  );
}

export default function CreditsPage() {
  return (
    <main className="mx-auto max-w-xl px-5 pb-16 pt-10">
      <h1 className="font-display text-3xl font-bold">Crédits images</h1>
      <p className="mt-3 text-sm leading-relaxed text-sand/80">
        Les portraits utilisés sur Ta-réincarnation proviennent de{" "}
        <a
          href="https://commons.wikimedia.org"
          target="_blank"
          rel="noreferrer"
          className="text-gold2 underline underline-offset-2"
        >
          Wikimedia Commons
        </a>{" "}
        et du programme{" "}
        <a
          href="https://www.metmuseum.org/about-the-met/policies-and-documents/open-access"
          target="_blank"
          rel="noreferrer"
          className="text-gold2 underline underline-offset-2"
        >
          Open Access du Metropolitan Museum of Art
        </a>
        . Ils sont servis localement depuis ce site, en versions allégées. Les licences
        Creative Commons (CC BY / CC BY-SA) requièrent l&apos;attribution indiquée
        ci-dessous.
      </p>

      {used.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-gold2">
            Portraits utilisés sur les fiches
          </h2>
          <ul className="mt-4 space-y-3">
            {used.map((credit) => (
              <CreditRow key={credit.file} credit={credit} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-gold2">
          Banque d&apos;images (à venir sur de nouvelles fiches)
        </h2>
        <ul className="mt-4 space-y-3">
          {bank.map((credit) => (
            <CreditRow key={credit.file} credit={credit} />
          ))}
        </ul>
      </section>

      <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-sand/60">
        Les personnages de Ta-réincarnation sont des fictions : les portraits
        historiques illustrent une époque ou un archétype, ils ne représentent pas des
        personnes ayant réellement existé telles que décrites dans les histoires.
      </p>
    </main>
  );
}

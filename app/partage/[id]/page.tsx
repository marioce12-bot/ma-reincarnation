import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PartagePage({
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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const resultUrl = `${siteUrl}/resultat/${session.id}`;
  const firstName = character.name.split(",")[0];
  const caption = `J'étais ${firstName} — ${character.era} (${session.compatibility_score} % de compatibilité) ✨ Et si tu avais déjà vécu ? Découvre qui tu étais : ${resultUrl}`;
  const storyUrl = `/api/og?session=${session.id}&format=story`;
  const squareUrl = `/api/og?session=${session.id}&format=square`;

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-10 text-center">
      <h1 className="font-display text-3xl font-bold leading-snug">Partage ta révélation</h1>
      <p className="mt-2 text-sm text-sand/70">
        L&apos;image contient ton nom, ton époque, ton pourcentage et le lien du quiz.
      </p>

      <div className="mt-6 flex items-end justify-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={storyUrl}
          alt="Image Story (9:16)"
          className="h-72 w-auto rounded-2xl border border-white/10"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={squareUrl}
          alt="Image Post (1:1)"
          className="h-44 w-44 rounded-2xl border border-white/10 object-cover"
        />
      </div>

      <div className="mt-8">
        <ShareButtons resultUrl={resultUrl} caption={caption} storyUrl={storyUrl} squareUrl={squareUrl} />
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";

export default function ShareButtons({
  resultUrl,
  caption,
  storyUrl,
  squareUrl,
}: {
  resultUrl: string;
  caption: string;
  storyUrl: string;
  squareUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    resultUrl
  )}&quote=${encodeURIComponent(caption)}`;

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="block rounded-2xl border border-green-400/50 bg-green-400/10 px-4 py-3 font-semibold text-green-200 transition hover:bg-green-400/20"
      >
        Partager sur WhatsApp
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="block rounded-2xl border border-sky-400/50 bg-sky-400/10 px-4 py-3 font-semibold text-sky-200 transition hover:bg-sky-400/20"
      >
        Partager sur Facebook
      </a>
      <a
        href={storyUrl}
        download="ta-reincarnation-story.png"
        className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-sand transition hover:bg-white/10"
      >
        ⬇ Télécharger l&apos;image Story (9:16)
      </a>
      <a
        href={squareUrl}
        download="ta-reincarnation-post.png"
        className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-sand transition hover:bg-white/10"
      >
        ⬇ Télécharger l&apos;image Post (1:1)
      </a>
      <button
        onClick={copyCaption}
        className="block w-full rounded-2xl border border-gold/60 px-4 py-3 font-semibold text-gold2 transition hover:bg-gold/10"
      >
        {copied ? "Légende copiée ✓" : "Copier la légende"}
      </button>
      <p className="pt-2 text-xs leading-relaxed text-sand/60">
        Instagram & TikTok : télécharge l&apos;image ci-dessus, ouvre l&apos;app, crée une story
        puis colle la légende. Le lien du quiz y est déjà.
      </p>
    </div>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 px-5 py-8 text-center text-xs leading-relaxed text-sand/60">
      <p className="font-display text-sm text-gold">Ta-réincarnation</p>
      <p className="mt-2">
        Ta-réincarnation est un jeu à but purement ludique : aucune valeur scientifique ni
        ésotérique.
      </p>
      <p className="mt-2">
        <Link href="/cgu" className="underline underline-offset-2 hover:text-sand">
          Conditions générales
        </Link>
        {" · "}
        Paiement Mobile Money (MTN MoMo, Moov Money)
      </p>
    </footer>
  );
}

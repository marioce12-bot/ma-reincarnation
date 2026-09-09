import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function Footer() {
  return (
    <Reveal>
      <footer className="mt-16 border-t border-white/10 px-5 pt-8 pb-28 text-center text-xs leading-relaxed text-sand/60 md:pb-8">
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
    </Reveal>
  );
}

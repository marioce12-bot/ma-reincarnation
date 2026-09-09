import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales — Ta-réincarnation",
};

const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: "1. Objet du service",
    paragraphs: [
      "Ta-réincarnation est un jeu en ligne à but purement ludique et divertissant. Il ne prétend à aucune valeur scientifique, historique, ésotérique ou spirituelle. Les « réincarnations » révélées sont des fictions créées pour le plaisir, inspirées librement de personnages et d'époques réels ou imaginaires.",
    ],
  },
  {
    title: "2. Accès et quiz",
    paragraphs: [
      "Le quiz (6 questions) et l'aperçu du résultat sont gratuits et ne nécessitent aucun compte. Seule une date de naissance est demandée ; elle sert uniquement au calcul du signe zodiacal affiché.",
    ],
  },
  {
    title: "3. Paiements",
    paragraphs: [
      "Le déblocage de la fiche complète se fait via paiement Mobile Money (MTN MoMo, Moov Money) traité par un prestataire de paiement (Saspay). Les tarifs sont de 500 FCFA (Standard), 1000 FCFA (Premium) et 1200 FCFA (Pack 3 révélations). Aucun numéro de téléphone n'est stocké par Ta-réincarnation : il est traité directement par le prestataire de paiement.",
    ],
  },
  {
    title: "4. Remboursements",
    paragraphs: [
      "Le contenu étant numérique et débloqué immédiatement, les paiements ne sont en principe pas remboursables. En cas d'erreur de paiement (double débit, montant erroné), contacte le support sous 48 heures avec le reçu Mobile Money : le remboursement sera étudié de bonne foi.",
    ],
  },
  {
    title: "5. Données personnelles",
    paragraphs: [
      "Ta-réincarnation stocke uniquement : ta date de naissance, tes réponses au quiz et l'identifiant de ta révélation (nécessaire pour retrouver ta fiche via son lien). Aucune création de compte, aucun suivi publicitaire.",
    ],
  },
  {
    title: "6. Contact",
    paragraphs: [
      "Pour toute question, écris à contact@ta-reincarnation.com (adresse à personnaliser lors de la mise en production).",
    ],
  },
];

export default function CguPage() {
  return (
    <main className="mx-auto max-w-xl px-5 pb-16 pt-10">
      <h1 className="font-display text-3xl font-bold">Conditions générales</h1>
      <p className="mt-2 text-sm text-sand/60">
        Dernière mise à jour : septembre 2026
      </p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-lg font-semibold text-gold2">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-3 text-sm leading-relaxed text-sand/80">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

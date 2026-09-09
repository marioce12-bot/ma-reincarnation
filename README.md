# Ta-réincarnation

**« Et si tu avais déjà vécu ? »** — Web app ludique (non scientifique) qui révèle *qui tu aurais pu être dans une vie antérieure* à partir d'un quiz de 6 questions. Mobile-first, pensée pour le partage viral (WhatsApp, Instagram, TikTok, Facebook) et le paiement Mobile Money (MTN MoMo, Moov Money) via **Saspay**.

> Projet à but 100 % ludique : aucune valeur scientifique ou ésotérique (mentionné dans le footer et les CGU).

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000. **Sans aucune configuration**, l'app tourne en **mode démo** : les 16 personnages de `data/characters.json` sont utilisés et les sessions vivent en mémoire — parfait pour tester tout le parcours (quiz → aperçu → paiement → révélation → partage).

Copie `.env.example` vers `.env.local` pour la configuration complète.

## Configuration Supabase (production)

1. Crée un projet Supabase, exécute `supabase/schema.sql` dans le **SQL Editor** (3 tables + RLS verrouillé).
2. Renseigne dans `.env.local` :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (clé **service**, jamais exposée au client : tout passe par le serveur)
3. Charge les personnages : `node scripts/seed.mjs`
4. Ajoute les images quand tu en as : dépose-les dans `public/portraits/` puis mets `portrait_url` / `location_card_url` à jour dans la table `characters` (sinon l'app affiche un placeholder élégant).

Sans ces variables, l'app reste en mode démo (personnages du JSON, sessions non persistées).

## Configuration Saspay (liens de paiement)

L'intégration repose sur des **liens Saspay** générés une fois pour chaque plan :

1. Dans ton dashboard Saspay, crée 3 liens de paiement :
   - Standard — **500 FCFA**
   - Premium — **1000 FCFA**
   - Pack 3 révélations — **1200 FCFA**
2. Colle-les dans `.env.local` :
   - `SASPAY_LINK_STANDARD`, `SASPAY_LINK_PREMIUM`, `SASPAY_LINK_PACK`
3. Définis `NEXT_PUBLIC_SITE_URL` (ex. `https://ta-reincarnation.com`) pour que les liens de partage pointent vers ton domaine.

### Fonctionnement du flux paiement

1. L'utilisateur choisit un plan (les 3 plans sont affichés directement sur la fiche verrouillée) → `POST /api/paiement/demarrer` enregistre un paiement **en attente** dans `payments` (référence unique) et pose un cookie de retour.
2. Il paie sur le lien Saspay → après paiement, Saspay le renvoie vers l'URL de retour.
3. La page de retour lit la référence (cookie), confirme le paiement en base et redirige automatiquement vers la révélation débloquée, avec un bouton de partage.

**Flux automatique sans URL de retour** : au clic sur « Payer », Saspay s'ouvre dans un nouvel onglet et l'onglet du site sonde `/api/paiement/etat` toutes les 4 s — dès que le webhook confirme le paiement, la fiche s'ouvre automatiquement. Si Saspay propose une **URL de retour**, configure-la vers `https://TON-DOMAIN/paiement/succes` en bonus (redirection immédiate).

### Webhook Saspay (indispensable au flux automatique)

Si Saspay propose un champ **Webhook / IPN**, indique : `https://TON-DOMAIN/api/paiement/webhook`.

Le webhook confirme les paiements même hors redirection navigateur :
- si le payload contient notre référence (champ `custom_data`/`metadata`/`reference`…), le paiement correspondant est confirmé précisément ;
- sinon, le webhook confirme **le plus ancien paiement en attente du plan correspondant au montant** (200/500/1000 FCFA) ;
- chaque payload reçu est loggué (`[webhook saspay] payload:`) pour ajuster le mapping depuis les logs Vercel si besoin.

Optionnel : définis `SASPAY_WEBHOOK_SECRET` et configure le même secret dans Saspay (header `x-webhook-secret` ou `?secret=`) pour protéger l'endpoint.

**Limite connue (V1)** : avec des liens statiques, si le payload du webhook ne contient ni notre référence ni un montant exploitable, la confirmation automatique ne peut pas s'appliquer (les payloads reçus sont alors visibles dans les logs Vercel pour adapter le mapping).

## Architecture

```
app/
  page.tsx                 Landing (accroche, exemples, CTA unique)
  quiz/                    Quiz 6 étapes (date de naissance + 5 questions à emoji)
  resultat/[id]/           Aperçu flouté OU fiche complète selon le plan
  paiement/[id]/           Choix des plans + démarrage du paiement Saspay
  paiement/succes/         Retour Saspay : confirmation automatique + partage
  api/paiement/webhook/    Webhook Saspay : confirmation serveur-à-serveur
  partage/[id]/            Images de partage + boutons WhatsApp/Facebook/IG/TikTok
  cgu/                     Conditions générales (mention ludique)
  api/match/               POST : calcule le matching + crée la session
  api/paiement/confirmer/  POST : marque la session payée
  api/og/                  GET : images de partage générées (Story 9:16, Post 1:1, Portrait 4:5)
lib/
  quiz.ts     Questions + mapping réponses → tags
  matching.ts Scoring (tags pondérés + affinité + facteur aléatoire ±13 %), score affiché borné à 70–98 %
  zodiac.ts   Signe zodiacal depuis la date de naissance
  store.ts    Supabase (prod) ou mémoire (démo) — même interface
  plans.ts    Les 3 plans et les liens Saspay
data/
  characters.json          Jeu de données des personnages
  PROMPT-PERSONNAGES.md    Prompt prêt à l'emploi pour générer les personnages suivants
supabase/schema.sql        Schéma DB
scripts/seed.mjs           Seed des personnages vers Supabase
```

## Modèle économique

| Plan | Prix | Contenu |
|---|---|---|
| Aperçu | Gratuit | Nom, époque, phrase d'accroche (reste flouté) |
| Standard | 200 FCFA | Fiche complète, histoire courte, portrait avec filigrane |
| Premium | 500 FCFA | + histoire longue, carte du lieu, indices du matching, portrait HD |
| Pack (V2) | 1000 FCFA | 3 révélations niveau Premium (crédits suivis sur la session) |

## Algorithme de matching

- Chaque réponse ajoute des **tags de personnalité** ; la question « époque » fixe une **affinité culturelle**.
- Score d'un personnage = `0,65 × similarité de tags + 0,35 × affinité`, multiplié par un **facteur aléatoire ±13 %** (deux profils proches n'ont pas toujours le même résultat).
- Le « % de compatibilité » affiché est normalisé entre **70 % et 98 %**.

## Étendre le jeu de données

16 personnages prêts à l'emploi. Pour aller vers 50, ouvre `data/PROMPT-PERSONNAGES.md`, colle-le dans un assistant IA, puis fusionne le JSON obtenu dans `data/characters.json` et relance `node scripts/seed.mjs`.

## Déploiement Vercel

1. Pousse le repo sur GitHub puis importe-le dans Vercel.
2. Ajoute les variables d'environnement : `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SASPAY_LINK_STANDARD`, `SASPAY_LINK_PREMIUM`, `SASPAY_LINK_PACK`.
3. Déploie. Les images de partage sont servies par la route `api/og` (compatible Vercel).
"# ma-reincarnation" 

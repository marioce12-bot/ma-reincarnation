# Générer les personnages suivants (objectif : 50 au total)

Copie ce prompt tel quel dans un assistant IA, colle le JSON produit à la fin de
`data/characters.json`, puis relance `node scripts/seed.mjs`.

---

Génère N nouveaux personnages (au format JSON strict, sans commentaires) pour l'app
« Ta-réincarnation » : une plateforme ludique qui révèle « qui tu étais dans une vie
antérieure ». Marché cible : Bénin / Afrique de l'Ouest francophone. Langue : français,
ton chaleureux, immersif, deuxième personne du singulier (« tu étais… »). Jamais de
discours ésotérique : c'est un jeu.

Chaque personnage DOIT respecter exactement ce schéma :

```json
{
  "id": "prenom-element-lieu",           // slug en minuscules, unique
  "name": "Prénom, surnom évocateur",    // ex: "Aminata, griotte du fleuve"
  "era": "XIVe siècle — Empire du Mali", // siècle + civilisation/royaume
  "location": "Ville ou région (pays actuel entre parenthèses)",
  "profession": "Métier de l'époque",
  "personality_tags": [],                // 3 à 4 tags parmi la liste fermée ci-dessous
  "affinity_tags": [],                   // 1 seule valeur parmi les affinités ci-dessous
  "hook": "Une phrase d'accroche percutante à la deuxième personne.",
  "story_short": "Histoire immersive de 150 à 200 mots, à la deuxième personne.",
  "story_long": "Histoire enrichie de 350 à 450 mots, à la deuxième personne, avec anecdotes concrètes, un tournant marquant, et une dernière phrase qui fait le lien avec la personnalité de l'utilisateur aujourd'hui.",
  "portrait_url": null,
  "location_card_url": null
}
```

Tags de personnalité (liste fermée) : leader, observateur, creatif, protecteur,
negociateur, combattant, spirituel, curieux, artiste, commercant, explorateur,
erudit, diplomate, charismatique, solitaire.

Affinités (liste fermée, une seule par personnage) : afrique-ancienne,
europe-medievale, asie-imperiale, ameriques-precoloniales, monde-arabe,
oceanie-insulaire.

Contraintes :
- Répartition équilibrée entre les 6 affinités.
- Varier genres, âges, métiers (guerriers ET artisans, marchands ET savants,
  femmes ET hommes). Inclure des figures inspirées de l'histoire ouest-africaine
  (Dahomey, empire du Mali, Songhaï, royaumes yoruba, Nubie, Kongo…) mais rester
  fictif ou « inspiré de » : jamais un personnage historique précis et documenté.
- Interdits : célébrités vivantes, noms de marque, contenu violent ou sexuel,
  affirmations surnaturelles présentées comme vraies.
- story_short : 150–200 mots. story_long : 350–450 mots.
- Retourne UNIQUEMENT le tableau JSON valide, sans texte autour.

# ANALYTICS-SAISIE-003 — Route et navigation mobile des présences

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-003 |
| **Version** | 1.1.0 |
| **Statut** | Publié sur `main` et validé en production |
| **Nature** | Spécification d’incrément et état d’implémentation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Cet incrément fournit le premier parcours mobile de saisie des présences sans
encore permettre la modification des statuts. Il couvre la route dédiée, le compte
Google actif, le choix d’un cours autorisé, la date et la consultation des séances
récentes.

## 2. Périmètre livré

- route Web `?app=attendance` ;
- identité du compte Google actif affichée ;
- liste limitée aux cours autorisés par `ACCESS-001` ;
- choix d’une date de séance ;
- effectif éligible à la date sélectionnée ;
- vingt séances récentes avec date et état `BROUILLON` ou `CLOTUREE` ;
- interface adaptée au téléphone et à la tablette ;
- états de chargement, vide, refus et indisponibilité annoncés de manière accessible.

## 3. Sécurité

La capacité `ATTENDANCE_READ` est contrôlée côté serveur avant toute ouverture
du classeur. Le navigateur ne fournit ni identité fiable, ni rôle, ni autorisation,
ni identifiant de classeur. La réponse exclut le classeur, les dépendances
techniques et l’auteur des modifications.

## 4. Exclusions

Cet incrément ne crée, ne modifie et ne clôture aucune séance. Il ne saisit aucun
statut de présence, n’installe aucun registre réel et ne crée aucun déploiement.
Ces fonctions relèvent des incréments `ANALYTICS-SAISIE-004` et
`ANALYTICS-SAISIE-005`.

## 5. Validation technique

L’implémentation est fusionnée sur `develop` par la PR applicative #58, commit
`c7adbe52a8b30a55804b8f1867842f4e22ec2d9d`.

Les six tests ciblés réussissent localement. Ils contrôlent le refus avant lecture,
le périmètre, le nettoyage de la réponse, le parcours cours/séance, les retours
accessibles et les cibles mobiles. La syntaxe Apps Script des fichiers modifiés
est valide.

La suite cumulative Apps Script exécutée le 28 juillet 2026 est concluante :
**321/321 tests réussis, 0 échec**. La navigation mobile en lecture seule est donc
validée sans régression et l’incrément de saisie rapide des statuts est autorisé à
poursuivre sur `develop`.

Aucune publication sur `main` ni aucun déploiement utilisateur n’est réalisé à ce
stade.

## 6. Publication et validation en production

Le parcours mobile a été publié sur `main`. Après le déploiement de production,
le bouton de retour vers le Centre de pilotage a été corrigé afin d’utiliser une
URL absolue du déploiement Web, transmise par
`viewModel.navigation.homeTarget`, selon le même contrat que le module
Analytics.

La composition serveur de production reste distincte de celle de la recette.
Le bouton conserve la cible `?app=admin`, interdit tout lien relatif vers
`userCodeAppPanel` et reprend la présentation visuelle des boutons de
Paramétrages, Journaux et Analytics.

Les preuves finales sont les suivantes :

- suite cumulative sur `develop` : **333/333 tests réussis, 0 échec** ;
- publication applicative vers `main` : PR
  [#79](https://github.com/karateseremange/AKS-Platform/pull/79), commit
  `4cad3c44` ;
- harmonisation visuelle : PR
  [#81](https://github.com/karateseremange/AKS-Platform/pull/81), commit
  `8cee161c` ;
- suite cumulative finale sur `main` : **333/333 tests réussis, 0 échec** ;
- validation navigateur en production : bouton visible, adapté au mobile et
  retour vers le Centre de pilotage fonctionnel.

## 7. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.1.0 | 2026-07-29 | Publication sur `main`, URL absolue de retour alignée sur Analytics, composition production/recette séparée, bouton harmonisé et validation en production après 333/333 tests |
| 1.0.1 | 2026-07-28 | Validation cumulative Apps Script : 321/321 tests réussis, 0 échec ; saisie rapide autorisée à poursuivre |
| 1.0.0 | 2026-07-28 | Route et navigation mobile intégrées sur `develop` ; 6/6 tests ciblés réussis ; validation cumulative 321/321 requise |

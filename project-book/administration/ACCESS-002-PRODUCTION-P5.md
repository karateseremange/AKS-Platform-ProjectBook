# ACCESS-002-PRODUCTION-P5 — Publication Git contrôlée

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P5 |
| **Titre** | Finalisation stable et publication Git contrôlée de V1.4.0 |
| **Version** | 1.0.1 |
| **Statut** | Clôturé — V1.4.0 publiée dans les deux dépôts et tags `v1.4.0` vérifiés |
| **Nature** | Protocole de publication Git |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-24 |
| **Candidate admise** | `1.4.0-rc.5` — `52024aba72a76247179bb801cfb93006151ebbb9` |

## 1. Objet

P5 transforme la candidate RC5 admise par le Quality Gate P4 en version Git
stable, puis publie de manière cohérente les branches `develop` applicative et
documentaire vers leurs branches `main`.

P5 couvre uniquement la finalisation de version, les deux Pull Requests vers
`main`, leurs fusions séparément autorisées, les tags Git cohérents et le
rapport de clôture Git.

P5 n'autorise aucune synchronisation Apps Script de production, aucune nouvelle
version Apps Script, aucune modification du déploiement public, aucune
configuration AUDIT, aucun amorçage ACCESS et aucune modification de compte réel.

## 2. Références validées à l'ouverture

| Référence | Valeur |
|---|---|
| Application `develop` | `52024aba72a76247179bb801cfb93006151ebbb9` — RC5 |
| Application `main` | `e8fb0fc3d8e5dfcf806ef5a0b7fab0007b84ec49` |
| Écart applicatif | 230 commits en avance, 0 en retard |
| Project Book `develop` | `ead35c914af58a0a09523ffb2d377de57535b551` |
| Project Book `main` | `647ae45a501bf14c1f3463fbca480945993bc515` |
| Écart documentaire | 389 commits en avance, 0 en retard |
| Quality Gate | P4 concluant, P4-G validé le 24 août 2026 |
| Production actuelle | déploiement `wgNc37`, version Apps Script 53, inchangé |

Ces références sont revérifiées avant chaque opération concernée. Un mouvement
de la tête applicative RC5 impose une analyse d'impact et invalide son admission
automatique à la suite de P5.

## 3. Décisions P5.1 à P5.12

### P5.1 — Objet strictement Git

P5 couvre exclusivement :

- la finalisation de la version stable ;
- la publication applicative de `develop` vers `main` ;
- la publication documentaire de `develop` vers `main` ;
- la création de tags Git cohérents.

Aucune opération Apps Script ou ressource de production n'appartient à P5.

### P5.2 — Publication complète de `develop`

Les deux dépôts sont publiés depuis leurs branches `develop` respectives.
Aucune sélection partielle de commits n'est retenue. Cette règle évite de rompre
les dépendances cumulatives entre ACCESS, AUDIT et les fondations transverses
déjà validées.

### P5.3 — Précontrôle et gel du périmètre

Avant toute modification ou PR, vérifier :

- les HEAD de `main` et `develop` ;
- l'absence de divergence ou de retard ;
- l'absence de nouvelle modification non contrôlée ;
- les PR ouvertes et les fils de revue ;
- l'absence de changement depuis P4-G.

La tête `52024ab` reste la candidate admise. Toute modification fonctionnelle
exige une nouvelle candidate et une reprise proportionnée du Quality Gate.

### P5.4 — Finalisation applicative stable

Une branche applicative dédiée issue de `develop` réalise uniquement :

- le passage de `1.4.0-rc.5` à `1.4.0` ;
- le nom stable de la version ;
- l'alignement du README et du changelog ;
- la cohérence des marqueurs contrôlés par VERSION-001.

Aucune évolution fonctionnelle n'est admise dans cette branche.

### P5.5 — Commit final explicite et testable

RC5 n'est pas renommée silencieusement. La finalisation crée un nouveau commit
applicatif identifiable.

Ce commit doit réussir au minimum :

- VERSION-001 ;
- les contrôles syntaxiques et statiques ;
- la campagne cumulative complète ;
- la vérification que seuls les marqueurs et documents de version ont changé.

Toute synchronisation ou exécution dans Apps Script RECETTE demeure soumise à
une autorisation distincte.

### P5.6 — Finalisation documentaire

Une branche documentaire dédiée met à jour :

- le présent protocole ;
- `ACCESS-002-PRODUCTION` ;
- la note `V1.4.0` ;
- la roadmap et les index concernés ;
- les références exactes du commit applicatif final et des fusions.

Les références résiduelles à RC1 dans le résumé directeur de P4 sont corrigées
pour refléter la clôture réelle sur RC5.

### P5.7 — PR applicative `develop → main`

Après validation du commit stable :

1. ouvrir une PR applicative complète de `develop` vers `main` ;
2. contrôler le périmètre cumulé, l'absence de conflit et les revues ;
3. vérifier que la tête correspond exactement au commit validé ;
4. conserver la PR non fusionnée jusqu'à autorisation explicite.

L'ouverture ou le passage en « prête pour revue » ne vaut pas autorisation de
fusion.

### P5.8 — Fusion applicative séparément autorisée

La fusion applicative nécessite une autorisation explicite propre et utilise la
tête exacte revue. Toute évolution de cette tête impose une nouvelle revue et
une nouvelle demande de validation.

Cette fusion ne déclenche aucune opération Apps Script.

### P5.9 — PR documentaire `develop → main`

Après connaissance du commit applicatif publié :

1. reporter sa référence exacte dans le Project Book ;
2. ouvrir la PR documentaire complète de `develop` vers `main` ;
3. contrôler la cohérence entre code, release, roadmap et preuves ;
4. demander une autorisation distincte avant fusion.

### P5.10 — Tags après les deux fusions

Les tags ne sont créés qu'après vérification des deux branches `main`.

Ils doivent :

- identifier la même version `V1.4.0` ;
- pointer sur les commits `main` réellement publiés dans chaque dépôt ;
- respecter la convention historique vérifiée avant création ;
- être prévisualisés puis autorisés explicitement.

La création d'un tag dans un dépôt n'autorise pas celle du second.

### P5.11 — Contrôles de sortie

P5 est conforme lorsque :

- la version stable n'affiche plus de marqueur RC ;
- le commit final a réussi les validations requises ;
- les deux branches `main` contiennent leurs contenus validés ;
- les tags sont cohérents et vérifiés ;
- aucun changement de `develop` n'a été perdu ;
- toutes les références finales sont consignées dans le Project Book.

### P5.12 — Limites après P5

Même clôturé, P5 n'autorise pas automatiquement :

- un `clasp push` en production ;
- une version ou un déploiement Apps Script ;
- une modification du déploiement `wgNc37` ;
- la création ou configuration d'AUDIT de production ;
- un test réel d'écriture AUDIT ;
- l'amorçage ACCESS ;
- l'attribution d'un droit à un compte réel ;
- une purge ou une récupération réelle.

Ces opérations relèvent de P6 et des étapes suivantes, avec autorisations
séparées.

## 4. Découpage d'exécution

### P5-A — Précontrôle Git et gel du périmètre

Revérifier les quatre branches de référence, les écarts, les PR et la tête RC5.
Documenter le gel avant toute finalisation.

### P5-B — Finalisation applicative `1.4.0`

Créer la branche applicative dédiée, modifier uniquement les marqueurs et
documents de version, puis ouvrir une PR vers `develop`.

### P5-C — Validation du commit stable

Contrôler le diff, VERSION-001, la syntaxe, les références cumulatives et la
campagne complète. Toute exécution Apps Script nécessite son autorisation.

### P5-D — PR et fusion applicatives vers `main`

Ouvrir, revoir puis soumettre séparément la fusion complète de `develop` vers
`main`.

### P5-E — Finalisation, PR et fusion documentaires

Reporter le commit applicatif publié, finaliser le Project Book, ouvrir la PR
documentaire complète vers `main`, puis soumettre séparément sa fusion.

### P5-F — Tags cohérents et rapport de clôture

Vérifier les deux `main`, prévisualiser les tags, obtenir les autorisations
requises, créer les tags puis consigner leurs références. P6 reste non autorisé.

## 5. Résultats P5-A à P5-F

### 5.1 P5-A — Précontrôle et gel

Le précontrôle distant a confirmé les références suivantes avant finalisation :

- application `develop` : `52024aba72a76247179bb801cfb93006151ebbb9` ;
- application `main` : `e8fb0fc3d8e5dfcf806ef5a0b7fab0007b84ec49` ;
- écart applicatif : **230 commits en avance, 0 en retard** ;
- Project Book `develop` : `ead35c914af58a0a09523ffb2d377de57535b551` ;
- Project Book `main` : `647ae45a501bf14c1f3463fbca480945993bc515` ;
- écart documentaire : **389 commits en avance, 0 en retard**.

La PR historique Project Book #1 visant `main` est exclue du périmètre et ne
doit pas être fusionnée.

### 5.2 P5-B — Finalisation stable

La branche applicative `release/v1.4.0-finalization` a été créée depuis RC5.
Elle contient :

- `be07ea57ddd0a50f05bbe550d2ab295e39d91829` — finalisation de
  `1.4.0`, build `20260824.1`, nom « ACCESS et administration sécurisée » ;
- `5f16d9072b99a4449e1198454b26e484b92de954` — alignement des intitulés
  et identifiants de tests sur la version stable.

La PR applicative
[#131](https://github.com/karateseremange/AKS-Platform/pull/131) a porté
exactement **2 commits et 7 fichiers**, sans évolution fonctionnelle.

### 5.3 P5-C — Validation et intégration dans `develop`

Les contrôles du commit stable exact `5f16d9072b99a4449e1198454b26e484b92de954`
ont obtenu :

- syntaxe JavaScript : **223/223 fichiers `.gs`** ;
- VERSION-001 locale : **8/8** ;
- agrégateur cumulatif : **665 références, 665 uniques** ;
- synchronisation dans Apps Script RECETTE : **261 fichiers poussés** ;
- `AKS_runVersion001Tests()` en RECETTE : **8/8 réussis** ;
- `AKS_runValidationSuiteV11()` en RECETTE : **665/665 réussis, 0 échec**.

La PR #131 a été fusionnée dans `develop` par le commit
`32a511a93eb341efa29cedffd3358f638c7b1d30`. Le contrôle distant a confirmé
que `develop` pointe exactement sur ce commit. P5-A à P5-C sont clôturés.

### 5.4 P5-D — Publication applicative sur `main`

Le précontrôle de publication a confirmé :

- application `main` : `e8fb0fc3d8e5dfcf806ef5a0b7fab0007b84ec49` ;
- application `develop` : `32a511a93eb341efa29cedffd3358f638c7b1d30` ;
- écart : **233 commits en avance, 0 en retard** ;
- périmètre cumulatif : **87 fichiers**, sans autre PR applicative ouverte.

La PR applicative
[#132](https://github.com/karateseremange/AKS-Platform/pull/132) a été revue
sans défaut bloquant puis fusionnée dans `main` au commit
`fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5`.

Le contrôle distant a confirmé que `main` pointe exactement sur ce commit et
possède le même contenu que `develop`, avec uniquement le commit de fusion
supplémentaire. Les marqueurs `1.4.0` et `20260824.1` ont été relus sur
`main`. P5-D est clôturé.

### 5.5 P5-E — Publication documentaire

La finalisation après publication applicative a été intégrée dans `develop`
du Project Book par la PR #169 au commit
`88a50c0e44ed9fa84331a1c6d07898880e15b2fa`.

La PR documentaire complète
[#170](https://github.com/karateseremange/AKS-Platform-ProjectBook/pull/170)
a ensuite été revue sans défaut bloquant puis fusionnée dans `main` au commit
`7cfa3ce62b12edaf26d38e743e4cdd2da2ce43c1`. Le contrôle distant a confirmé
un contenu identique à `develop`, avec uniquement le commit de fusion
supplémentaire. P5-E est clôturé.

### 5.6 P5-F — Tags et contrôle de sortie

La convention historique a été vérifiée : les tags de publication sont des
tags légers au format `vX.Y.Z`.

Les deux tags `v1.4.0` ont été créés puis relus sur GitHub :

- application : `v1.4.0` pointe sur
  `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5` ;
- Project Book : `v1.4.0` pointe sur
  `7cfa3ce62b12edaf26d38e743e4cdd2da2ce43c1`.

Chaque tag est strictement identique au `main` correspondant au moment de la
publication. Ces commits sont les snapshots V1.4.0 immuables ciblés par les
tags ; ils ne constituent pas des têtes de branche invariantes. La PR
applicative #134 a ensuite porté `main` applicatif à `7a6b70a341bc869f10e1a18efda8ad4d6ab8fe6d`
par une correction exclusivement documentaire, sans déplacer `v1.4.0`. La
publication post-release du Project Book suit la même règle : sa tête `main`
peut avancer tandis que le tag documentaire reste sur `7cfa3ce62b12edaf26d38e743e4cdd2da2ce43c1`.
P5-A à P5-F sont clôturés.

Cette clôture reste exclusivement Git. P6, Apps Script de production, AUDIT de
production, amorçage ACCESS et toute attribution réelle restent non engagés.

## 6. Autorisations distinctes

Les opérations P5-A à P5-F ci-dessus ont été exécutées après leurs
autorisations successives. P5 est clôturé.

Restent soumises à des validations distinctes :

1. la fusion puis la publication de ce rapport post-publication ;
2. le démarrage de P6 ;
3. chaque opération Apps Script ou réelle de production.

## 7. Retour arrière Git

Avant chaque fusion, les références exactes de la base et de la tête sont
enregistrées. En cas d'anomalie Git avant P6, le traitement privilégié est un
correctif ou un revert traçable validé ; aucun reset destructif des branches
partagées n'est utilisé.

Le retour arrière Git de P5 ne modifie jamais automatiquement Apps Script. La
production reste sur la version 53 tant que P6 n'est pas explicitement autorisé.

## 8. Critères d'acceptation du cadrage

Le cadrage est conforme lorsque :

- P5 reste strictement séparé de P6 et de la production ;
- la publication complète de `develop` est retenue ;
- RC5 produit un commit stable explicite et retesté ;
- les deux PR et leurs fusions sont séparées ;
- les tags sont créés seulement après les deux publications ;
- chaque mutation possède son autorisation propre ;
- les références finales sont documentées.

## 9. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-08-24 | Distinction entre les snapshots de publication/tagués V1.4.0 et les têtes de `main` post-release ; PR applicative #134 consignée à `7a6b70a`, tags inchangés et production non engagée |
| 1.0.0 | 2026-08-24 | P5 clôturé : application `main@fa8876f`, Project Book `main@7cfa3ce`, tags légers `v1.4.0` vérifiés dans les deux dépôts ; P6 et production non engagés |
| 0.3.0 | 2026-08-24 | P5-D clôturé : PR applicative #132 revue et fusionnée dans `main` à `fa8876f`, contenu identique à `develop`, version `1.4.0` build `20260824.1`; P5-E engagé, tags et production inchangés |
| 0.2.0 | 2026-08-24 | P5-A à P5-C clôturés : précontrôle conforme, version stable `1.4.0` build `20260824.1` validée en RECETTE à 8/8 et 665/665, PR applicative #131 fusionnée dans `develop` à `32a511a`; P5-D, `main`, tags et production non engagés |
| 0.1.0 | 2026-08-24 | Cadrage P5.1 à P5.12 et P5-A à P5-F validé : finalisation stable explicite, publication complète des deux `develop`, fusions et tags séparément autorisés, aucune opération de production |

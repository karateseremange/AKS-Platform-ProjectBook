# ACCESS-002-PRODUCTION-P5 — Publication Git contrôlée

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P5 |
| **Titre** | Finalisation stable et publication Git contrôlée de V1.4.0 |
| **Version** | 0.1.0 |
| **Statut** | Cadrage validé — exécution non engagée |
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
| Project Book `develop` | `ac8be0c7fb37a71caf384ad288b1a0308d42fa28` |
| Project Book `main` | `647ae45a501bf14c1f3463fbca480945993bc515` |
| Écart documentaire | 379 commits en avance, 0 en retard |
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

## 5. Autorisations distinctes

La validation du présent cadrage autorise uniquement sa consignation dans une
branche et une PR Project Book vers `develop`.

Restent notamment soumises à des validations ultérieures distinctes :

1. la fusion de la PR de cadrage dans `develop` ;
2. le démarrage de P5-A et P5-B ;
3. toute synchronisation ou campagne Apps Script RECETTE ;
4. la fusion de la finalisation applicative dans `develop` ;
5. l'ouverture puis la fusion de chaque PR vers `main` ;
6. la création de chaque tag ;
7. le démarrage de P6 ;
8. chaque opération réelle de production.

## 6. Retour arrière Git

Avant chaque fusion, les références exactes de la base et de la tête sont
enregistrées. En cas d'anomalie Git avant P6, le traitement privilégié est un
correctif ou un revert traçable validé ; aucun reset destructif des branches
partagées n'est utilisé.

Le retour arrière Git de P5 ne modifie jamais automatiquement Apps Script. La
production reste sur la version 53 tant que P6 n'est pas explicitement autorisé.

## 7. Critères d'acceptation du cadrage

Le cadrage est conforme lorsque :

- P5 reste strictement séparé de P6 et de la production ;
- la publication complète de `develop` est retenue ;
- RC5 produit un commit stable explicite et retesté ;
- les deux PR et leurs fusions sont séparées ;
- les tags sont créés seulement après les deux publications ;
- chaque mutation possède son autorisation propre ;
- les références finales sont documentées.

## 8. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-24 | Cadrage P5.1 à P5.12 et P5-A à P5-F validé : finalisation stable explicite, publication complète des deux `develop`, fusions et tags séparément autorisés, aucune opération de production |

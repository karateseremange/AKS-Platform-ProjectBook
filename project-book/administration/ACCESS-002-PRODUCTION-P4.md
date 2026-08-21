# ACCESS-002-PRODUCTION-P4 — Quality Gate final de la candidate

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P4 |
| **Titre** | Quality Gate final de la candidate ACCESS |
| **Version** | 0.1.0 |
| **Statut** | Cadrage validé — exécution non autorisée par ce document |
| **Nature** | Protocole de validation de release |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-21 |
| **Candidate contrôlée** | `1.4.0-rc.1` — `b13fc202300af6f7ce0c99b65403fa83117ed34b` |

## 1. Objet

P4 définit le Quality Gate final qui précède toute publication de la candidate
sur `main`. Il consolide les preuves statiques, automatiques et fonctionnelles
sans confondre la recette de RC1 avec la production publique actuellement figée
à la version Apps Script 53.

La validation du présent cadrage autorise sa documentation, les analyses Git et
statiques et la préparation des commandes RECETTE. Elle n’autorise aucune
synchronisation Apps Script, recette avec écriture, consultation de l’URL
publique, publication Git ou mutation de production.

## 2. Références de départ

| Référence | Valeur |
|---|---|
| `main` applicatif | `e8fb0fc3d8e5dfcf806ef5a0b7fab0007b84ec49` |
| Candidate `develop` | `b13fc202300af6f7ce0c99b65403fa83117ed34b` |
| Écart vérifié | 211 commits, 87 fichiers |
| Projet Apps Script RECETTE | suffixe `eIRxs4` |
| Déploiement public actuel | suffixe `wgNc37`, version 53 |
| Résultats P2 | VERSION-001 **8/8**, campagne cumulative **661/661** |
| Archive version 53 + HEAD | SHA-256 `10F14203AD214DA930B16C852F415A78EC72196D1F4013D886C07D6` |
| Archive de rapprochement | SHA-256 `EBBCB6B0CADF5546B933705F328D0A7FFA50286134A41FAC6DEE34530D9FAD79` |

## 3. Décisions P4.1 à P4.12

### P4.1 — Candidate figée

Le Quality Gate porte exclusivement sur le commit `b13fc20`. Toute
modification applicative ultérieure invalide les preuves concernées, impose une
nouvelle candidate — normalement `1.4.0-rc.2` — et une campagne sur sa tête
exacte.

### P4.2 — Quatre niveaux de contrôle

| Niveau | Environnement | Nature |
|---|---|---|
| A | Git/local | diff, syntaxe, inventaires et contrôles statiques |
| B | Apps Script RECETTE `eIRxs4` | suites automatiques sans donnée de production |
| C | RECETTE | parcours fonctionnels contrôlés |
| D | Production actuelle | contrôles publics strictement sans écriture, autorisés séparément |

Le niveau D porte uniquement sur la version 53 actuelle. Il ne constitue pas
une recette de RC1 en production.

### P4.3 — Précontrôle avant synchronisation RECETTE

Avant tout nouveau `clasp push`, l’opérateur vérifie :

- la branche locale et le SHA exacts ;
- un arbre Git propre ;
- un `.clasp.json` dont l’identifiant se termine par `eIRxs4` ;
- l’absence de référence au projet de production ;
- l’absence de résidu local non versionné sous `src` ;
- l’état Apps Script de recette par rapport à la candidate lorsque nécessaire.

Toute synchronisation RECETTE exige une autorisation distincte.

### P4.4 — Contrôles statiques

Le gate confirme au minimum :

- les références `main`, candidate et leur écart complet ;
- la syntaxe de tous les fichiers `.gs` ;
- l’unicité des 661 références cumulatives ;
- les marqueurs exacts `1.4.0-rc.1` ;
- le fuseau `Europe/Paris` ;
- l’absence de route Web Audit, Maintenance ou Inscriptions ;
- le maintien du Questionnaire santé comme service public hors ACCESS ;
- l’absence de dépendance normale résiduelle à `AKS.Admin.Access` dans les
  contrôleurs migrés ;
- l’absence de capacité fictive ou d’attribution implicite.

### P4.5 — Campagne automatique RECETTE

La campagne minimale sur la tête exacte comprend :

1. `AKS_runVersion001Tests()`, attendu **8/8** ;
2. `AKS_runValidationSuiteV11()`, attendu **661/661** ;
3. les suites ciblées ACCESS et AUDIT réellement disponibles ;
4. les contrôles ciblés Paramétrage, Journaux, Analytics et Portail ;
5. la vérification que les fonctions de recette avec écriture restent hors de
   la suite automatique.

Les résultats P2 restent des preuves, mais ne remplacent pas la campagne finale
P4.

### P4.6 — Parcours fonctionnels en RECETTE

Les parcours couvrent :

- Questionnaire santé ;
- Portail AKS ;
- « Mes accès » ;
- « Comptes et accès » ;
- Analytics selon les combinaisons de capacités ;
- Paramétrage en lecture, écriture et réinitialisation selon les droits ;
- Journaux avec `LOG_READ` ;
- Présences ;
- refus des appels serveur directs non autorisés ;
- absence d’exposition fonctionnelle d’Inscriptions.

Les mutations réversibles utilisent uniquement les protocoles déjà cadrés et
nécessitent une autorisation distincte.

### P4.7 — Fermeture avant configuration

Le gate démontre que :

- l’absence d’AUDIT persistant conforme interdit toute mutation ACCESS ;
- aucun registre n’est créé automatiquement ;
- aucune capacité n’est inférée ;
- un registre `access/1.1` reste lisible sans réécriture ;
- aucune récupération réelle n’est exécutable depuis les fonctions de recette ;
- le code reste fermé avant configuration sans casser le Questionnaire santé.

### P4.8 — Production publique actuelle

Après autorisation spécifique, les seuls contrôles de production admis portent
sur la version 53 actuelle :

- conservation de l’URL publique ;
- accessibilité du Questionnaire santé ;
- chargement et validation sans soumission ;
- routes administratives historiques attendues ;
- absence d’effet de bord.

Aucun formulaire n’est envoyé et aucun appel administratif mutable n’est
effectué.

### P4.9 — Retour arrière

La référence primaire reste le déploiement `wgNc37` à la version Apps Script
53, couvert par les deux archives P3. Le HEAD Apps Script ne constitue jamais
la référence de retour arrière.

### P4.10 — Critères bloquants

Le gate échoue notamment si :

- un test automatique échoue ;
- la tête testée diffère de `b13fc20` ;
- un contrôle exige une ressource de production non autorisée ;
- le Questionnaire santé régresse ;
- une route Inscriptions, Audit ou Maintenance est exposée ;
- ACCESS peut muter sans AUDIT persistant ;
- le retour vers la version 53 n’est plus démontrable ;
- un défaut bloquant ou critique reste ouvert.

### P4.11 — Gel de V1.4.0

Si le gate est concluant :

- `V1.4.0` peut être retenue comme numéro stable ;
- le build final est dérivé du commit finalement publié ;
- RC1 n’est pas renommée silencieusement dans son commit actuel ;
- une finalisation documentaire et applicative précède la PR
  `develop → main`.

### P4.12 — Limites d’autorisation

La validation du cadrage autorise uniquement :

- la documentation du protocole ;
- les analyses Git et statiques ;
- la préparation des commandes RECETTE.

Elle n’autorise pas automatiquement :

- `clasp push`, même en recette ;
- une recette avec écriture ;
- l’appel de l’URL de production ;
- une PR ou fusion vers `main` ;
- un tag ;
- une version ou un déploiement Apps Script ;
- une propriété ou ressource AUDIT de production ;
- l’amorçage ACCESS ;
- une modification de compte réel.

## 4. Découpage d’exécution

### P4-A — Documentation du Quality Gate

Consigner P4.1 à P4.12 dans le Project Book.

### P4-B — Contrôles Git et statiques

Vérifier la candidate sans Apps Script.

### P4-C — Précontrôle RECETTE

Vérifier le projet, la branche, le SHA et l’état local avant toute
synchronisation.

### P4-D — Campagne automatique RECETTE

Après autorisation, synchroniser uniquement si nécessaire puis exécuter les
suites ciblées et cumulative.

### P4-E — Parcours fonctionnels RECETTE

Exécuter les contrôles sans mutation puis, séparément, les recettes réversibles
autorisées.

### P4-F — Référence publique actuelle

Après autorisation spécifique, contrôler sans écriture la production version
53.

### P4-G — Rapport et décision

Conclure le gate, qualifier les défauts, maintenir RC1 ou préparer RC2, puis
soumettre séparément la décision d’engager P5.

## 5. Critères de sortie

P4 est concluant lorsque :

- tous les contrôles A à F autorisés sont documentés ;
- la candidate exacte a réussi les campagnes automatiques ;
- les parcours RECETTE sont conformes ;
- la production version 53 reste la référence publique intacte ;
- le retour arrière est démontré ;
- aucun défaut bloquant ou critique n’est ouvert ;
- le Product Owner valide le rapport P4-G.

La clôture de P4 n’autorise pas P5, une fusion vers `main` ou une opération
Apps Script de production.

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-21 | P4.1 à P4.12 et sous-étapes P4-A à P4-G validés : candidate figée, contrôles statiques/RECETTE/production séparés, autorisations distinctes et aucun droit de publication ou mutation accordé |

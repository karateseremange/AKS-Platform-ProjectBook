# ARCH-CONSOLIDATION-001 — M4.3

# Bilan et critères de clôture des migrations documentaires

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M4.3 — Bilan et critères de clôture des migrations documentaires |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Gouvernance documentaire non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document clôt le jalon M4 — Plan des migrations documentaires du chantier `ARCH-CONSOLIDATION-001`.

Il consolide :

- le registre des candidats à migration défini en M4.1 ;
- le plan d’exécution ordonné défini en M4.2 ;
- les critères permettant de décider qu’une migration est terminée ;
- les règles de traitement des écarts, reports et blocages ;
- les conditions nécessaires pour prononcer la clôture du jalon M4.

Ce livrable ne réalise pas les migrations. Il définit le cadre de contrôle qui devra être utilisé pendant leur exécution et lors de leur validation finale.

---

# 2. Périmètre de clôture

La clôture couvre l’ensemble des migrations `MIG-001` à `MIG-027` identifiées dans M4.1.

Elle vérifie notamment :

- l’existence d’une source de référence unique par domaine ;
- la disparition des doublons normatifs non justifiés ;
- la conservation des contraintes locales utiles ;
- la présence de références croisées explicites ;
- l’harmonisation du vocabulaire ;
- la traçabilité des décisions et des commits ;
- l’absence de contradiction documentaire majeure.

La clôture du jalon M4 ne signifie pas nécessairement que tous les documents du Project Book sont définitivement figés. Elle signifie que les migrations identifiées ont reçu une décision explicite, vérifiable et traçable.

---

# 3. États finaux autorisés

Chaque migration doit atteindre l’un des états finaux suivants :

| État final | Signification |
|---|---|
| **Terminé** | La migration a été exécutée et tous ses critères de validation sont satisfaits. |
| **Écart accepté** | Un chevauchement ou un rappel est conservé avec une justification, une source normative identifiée et un risque maîtrisé. |
| **Reporté** | La migration est transférée vers un jalon ultérieur avec justification, propriétaire et échéance cible. |
| **Annulé** | La migration est devenue sans objet après analyse, avec justification explicite. |

Les états `À faire`, `Prête`, `En cours`, `À valider` et `Bloqué` ne sont pas compatibles avec la clôture définitive du jalon M4, sauf décision formelle de report.

---

# 4. Critères de clôture d’une migration

Une migration peut être déclarée `Terminé` lorsque tous les critères suivants sont satisfaits :

1. le contenu concerné est précisément identifié ;
2. le document responsable est confirmé conformément à M3.3 ;
3. la source normative contient la règle de référence ;
4. les documents consommateurs ne portent plus de définition concurrente ;
5. les rappels locaux utiles sont conservés et clairement non normatifs ;
6. les références croisées sont explicites et valides ;
7. le vocabulaire est cohérent avec le reste du périmètre ;
8. aucun contenu utile n’a été perdu ;
9. les critères spécifiques définis dans M4.1 sont satisfaits ;
10. la modification a fait l’objet d’une relecture croisée ;
11. le ou les commits Git sont identifiés ;
12. le statut du registre est mis à jour.

Une migration ne doit pas être déclarée terminée sur la seule base d’une modification éditoriale partielle.

---

# 5. Critères d’acceptation d’un écart

Un état `Écart accepté` est autorisé uniquement si le maintien d’un contenu similaire dans plusieurs documents est nécessaire à la compréhension locale.

L’écart doit préciser :

- l’identifiant de la migration ;
- le contenu conservé ;
- le document responsable ;
- les documents consommateurs concernés ;
- la justification fonctionnelle ou opérationnelle ;
- la nature non normative du rappel ;
- la référence explicite vers la source ;
- le risque de divergence ;
- le mécanisme de contrôle lors des évolutions futures ;
- le propriétaire de la décision.

Un écart accepté ne peut jamais créer une seconde source normative.

---

# 6. Critères de report

Une migration peut être marquée `Reporté` uniquement si son exécution immédiate présente un risque supérieur à son maintien temporaire.

Le report doit documenter :

- l’identifiant de la migration ;
- la raison du report ;
- les dépendances non levées ;
- le risque associé au maintien temporaire ;
- les mesures compensatoires ;
- le jalon ou la version cible ;
- le propriétaire du suivi ;
- la date de réévaluation.

Aucune migration P1 ne peut être reportée sans décision explicite du Product Owner.

Aucune migration P2 ne peut être reportée sans justification documentée et mesure compensatoire.

---

# 7. Contrôles globaux de clôture

Avant de prononcer la clôture du jalon M4, les contrôles suivants doivent être réalisés.

## 7.1 Contrôle des responsabilités

- chaque domaine possède un document responsable unique ;
- les responsabilités correspondent à la matrice M3.3 ;
- aucun document consommateur ne devient une source normative parallèle ;
- `ARCH-CONSOLIDATION-001` et ses livrables restent non normatifs.

## 7.2 Contrôle des doublons

- les doublons normatifs sont supprimés ou remplacés par des références ;
- les rappels locaux conservés ont une valeur explicative réelle ;
- aucun rappel local ne modifie la règle source ;
- aucun contenu contradictoire ne subsiste.

## 7.3 Contrôle des références

- chaque politique transverse consommée cite sa source ;
- les identifiants documentaires sont corrects ;
- les chemins de fichiers sont valides ;
- aucune référence ne pointe vers un document obsolète ou inexistant.

## 7.4 Contrôle du vocabulaire

- les termes structurants possèdent une définition unique ;
- les documents utilisent une terminologie cohérente ;
- les synonymes ambigus sont supprimés ou explicités ;
- le vocabulaire métier reste distinct du vocabulaire technique.

## 7.5 Contrôle de traçabilité

- chaque migration possède un statut final ;
- chaque migration exécutée est liée à un ou plusieurs commits ;
- les écarts et reports sont justifiés ;
- les décisions du Product Owner sont identifiables ;
- le registre M4.1 est à jour.

---

# 8. Matrice de validation finale

| Domaine | Contrôle attendu | Preuve attendue | Responsable de validation |
|---|---|---|---|
| Architecture documentaire | ADR-001 reste la source des règles documentaires | Relecture ADR-001 et références associées | Product Owner |
| Architecture fonctionnelle | ARCH-001 et CORE-001 ont des frontières non ambiguës | Sections de responsabilité et références croisées | Product Owner |
| Paramétrage | CONFIG-001 est la source unique | Absence de règles concurrentes dans les consommateurs | Product Owner |
| Journalisation | LOG-001 définit le modèle commun | Références depuis les documents consommateurs | Product Owner |
| Audit | AUDIT-001 définit les actions sensibles et les preuves | Distinction claire entre journal et audit | Product Owner |
| Erreurs | ERROR-001 définit le modèle commun | Références depuis API-001 et DOCUMENT-001 | Product Owner |
| Sécurité | SECURITY-001 définit les exigences générales | Applications locales sans politique parallèle | Product Owner |
| UX | UX-001 définit les principes de présentation | Parcours locaux conformes dans ADMIN-001 et autres interfaces | Product Owner |
| Notifications | NOTIF-001 décrit le cycle fonctionnel | Paramètres, logs, audit et sécurité référencés | Product Owner |
| Documents générés | DOCUMENT-001 décrit le cycle fonctionnel | Stockage et sécurité référencés | Product Owner |
| Stockage | STORAGE-001 décrit les mécanismes de conservation | Durées et exigences métier référencées | Product Owner |

---

# 9. Règles de relecture

La validation finale doit comporter au minimum :

1. une relecture du document responsable ;
2. une relecture d’au moins un document consommateur ;
3. une vérification des références croisées ;
4. une comparaison avec les critères de M4.1 ;
5. une vérification du statut et de la traçabilité Git.

Pour les migrations P1, une relecture complète de tous les documents concernés est requise.

Pour les migrations P2, une relecture de la source normative et des principaux consommateurs est requise.

Pour les migrations P3 et P4, une vérification ciblée peut suffire lorsque l’impact est uniquement éditorial.

---

# 10. Conditions de clôture du jalon M4

Le jalon M4 peut être déclaré clos lorsque :

- toutes les migrations `MIG-001` à `MIG-027` possèdent un état final ;
- aucune migration P1 ne reste non traitée ;
- aucune migration P2 ne reste sans décision ;
- les écarts acceptés sont documentés ;
- les reports sont justifiés et planifiés ;
- les contrôles globaux sont satisfaits ;
- le registre M4.1 est mis à jour ;
- le bilan final est approuvé par le Product Owner ;
- l’état du dépôt est propre ;
- les commits associés sont publiés sur la branche de référence.

---

# 11. Décision de clôture

La décision de clôture doit être enregistrée avec les informations suivantes :

| Propriété | Valeur attendue |
|---|---|
| **Jalon** | M4 — Plan des migrations documentaires |
| **Décision** | Clos / Clos avec écarts / Non clos |
| **Date** | Date de validation |
| **Validateur** | Product Owner |
| **Migrations terminées** | Nombre et liste |
| **Écarts acceptés** | Nombre et liste |
| **Migrations reportées** | Nombre et liste |
| **Migrations annulées** | Nombre et liste |
| **Référence Git** | Commit ou tag de validation |
| **Observations** | Risques résiduels et actions futures |

La décision `Clos avec écarts` est autorisée uniquement lorsque tous les écarts sont documentés et qu’aucun risque critique n’est laissé sans mesure de maîtrise.

---

# 12. Résultat du jalon M4

Le jalon M4 fournit désormais :

- un registre des candidats à migration avec M4.1 ;
- un ordre d’exécution et des dépendances avec M4.2 ;
- des critères de validation et de clôture avec M4.3.

Le plan des migrations documentaires est donc entièrement défini.

L’étape suivante du chantier `ARCH-CONSOLIDATION-001` consiste à exécuter les migrations selon les vagues prévues, à mettre à jour le registre et à produire la validation finale de consolidation.

# AKS Platform Project Book

Bienvenue dans le **Project Book** d'AKS Platform.

Ce dépôt constitue la **documentation officielle** du projet. Toute décision fonctionnelle, d'architecture ou de gouvernance doit y être documentée avant ou en parallèle de son implémentation.

Le catalogue documentaire officiel est disponible dans [`project-book/documentation/INDEX-001.md`](project-book/documentation/INDEX-001.md).

## Historique

AKS Platform est née de la volonté de remplacer une collection d'outils indépendants par une plateforme unique, cohérente, documentée, maintenable et évolutive.

Avant le développement officiel de la version 1.0.0, un **Proof of Concept (PoC)** a permis de valider les principaux choix techniques et méthodologiques. Cette phase exploratoire a confirmé la faisabilité du projet et conduit à la conception d'une nouvelle architecture, accompagnée de la création du **Project Book** comme documentation officielle de référence.

Depuis la publication de la version **1.0.0**, le développement suit une approche structurée basée sur :

- une gouvernance documentaire ;
- une architecture modulaire ;
- des services communs mutualisés ;
- un processus de publication maîtrisé ;
- une évolution incrémentale des modules métier.

# Objectifs

Le Project Book a pour objectifs de :

- centraliser la documentation officielle ;
- garantir la cohérence des développements ;
- assurer la traçabilité des décisions ;
- faciliter la maintenance et les évolutions.

---

# Organisation

```text
project-book/
├── vision/
├── strategy/
├── roadmap/
├── governance/
├── architecture/
├── administration/
├── ux/
├── modules/
├── operations/
├── documentation/
├── release/
└── references/
```

Chaque document possède une responsabilité unique et est identifié par un code (`ARCH-001`, `CORE-001`, etc.).

L'arborescence peut évoluer lorsque de nouveaux domaines apparaissent. Le catalogue [`INDEX-001`](project-book/documentation/INDEX-001.md) fait autorité sur l'organisation documentaire active.

---

# Documents de référence

## Catalogue et gouvernance documentaire

- [INDEX-001 — Catalogue du Project Book](project-book/documentation/INDEX-001.md)
- [DOC-001 — Règles de documentation](project-book/documentation/DOC-001.md)
- RELEASE-001 — Processus de publication

## Vision et stratégie

- VISION-001 — Vision d'AKS Platform
- OBJECTIVES-001 — Objectifs stratégiques
- SCOPE-001 — Périmètre fonctionnel
- ROADMAP-001 — Feuille de route officielle
- GOV-001 — Gouvernance produit

## Architecture

- ARCH-001 — Architecture fonctionnelle
- CORE-001 — AKS Core

## Administration

- ADMIN-001 — Tableau de bord
- CONFIG-001 — Paramétrage centralisé
- LOG-001 — Journalisation

## Expérience utilisateur

- UX-001 — Principes UX

## Modules

Les spécifications des modules métier sont regroupées dans le dossier `modules/`.

Le premier module historique est **Questionnaire Santé** (V1.0.0).

Le premier nouveau module prévu après la V1.1 est **AKS Analytics**, suivi d'**AKS Calendar**.

---

# Dépôts Git

## Application

- Branche `develop` : développement courant.
- Branche `main` : version stable et production.

## Project Book

- Branche `develop` : préparation et validation des évolutions documentaires.
- Branche `main` : documentation officielle validée et publiée.

Toute publication documentaire suit un cycle de validation, de fusion de `develop` vers `main`, puis de création d'un tag correspondant.

Les modifications courantes ne doivent pas être réalisées directement sur `main`, sauf correctif documentaire urgent et explicitement validé.

---

# Principes

Les développements doivent respecter les règles suivantes :

- aucune régression fonctionnelle ;
- documentation synchronisée avec le code ;
- architecture modulaire ;
- services communs mutualisés ;
- compatibilité ascendante autant que possible.

---

# Ordre de lecture recommandé

Pour découvrir le projet, il est recommandé de lire les documents dans l'ordre suivant :

1. INDEX-001 — Catalogue du Project Book
2. VISION-001 — Vision d'AKS Platform
3. OBJECTIVES-001 — Objectifs stratégiques
4. SCOPE-001 — Périmètre fonctionnel
5. ROADMAP-001 — Feuille de route officielle
6. GOV-001 — Gouvernance produit
7. ARCH-001 — Architecture fonctionnelle
8. CORE-001 — AKS Core
9. documents transverses, d'administration et d'expérience utilisateur
10. documents des modules métier
11. DOC-001 — Règles de documentation
12. RELEASE-001 — Processus de publication

---

# Licence

La licence applicable au projet est définie dans le dépôt GitHub principal.

---

# État du Project Book

Le Project Book est maintenu conjointement avec le développement d'AKS Platform.

Toute évolution fonctionnelle importante doit être accompagnée d'une mise à jour de la documentation concernée et, lorsque nécessaire, du catalogue [`INDEX-001`](project-book/documentation/INDEX-001.md).

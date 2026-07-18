# AKS Platform Project Book

Bienvenue dans le **Project Book** d'AKS Platform.

Ce dépôt constitue la **documentation officielle** du projet. Toute décision fonctionnelle, d'architecture ou de gouvernance doit y être documentée avant ou en parallèle de son implémentation.

---

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
├── roadmap/
├── architecture/
├── administration/
├── documentation/
├── modules/
├── release/
└── ux/
```

Chaque document possède une responsabilité unique et est identifié par un code (`ARCH-001`, `CORE-001`, etc.).

---

# Documents de référence

## Gouvernance

- ROADMAP-001 — Feuille de route
- DOC-001 — Gouvernance documentaire
- RELEASE-001 — Processus de publication

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

- Branche `develop` : développement
- Branche `main` : production

## Project Book

Le dépôt documentaire utilise actuellement sa branche de référence `master`.

---

# Principes

Les développements doivent respecter les règles suivantes :

- aucune régression fonctionnelle ;
- documentation synchronisée avec le code ;
- architecture modulaire ;
- services communs mutualisés ;
- compatibilité ascendante autant que possible.

---

# Démarrage

Pour découvrir le projet, il est recommandé de lire les documents dans l'ordre suivant :

1. ROADMAP-001
2. ARCH-001
3. CORE-001
4. ADMIN-001
5. CONFIG-001
6. LOG-001
7. UX-001
8. DOC-001
9. RELEASE-001

---

# Licence

La licence applicable au projet est définie dans le dépôt GitHub principal.

---

# État du Project Book

Le Project Book est maintenu conjointement avec le développement d'AKS Platform.

Toute évolution fonctionnelle importante doit être accompagnée d'une mise à jour de la documentation concernée.

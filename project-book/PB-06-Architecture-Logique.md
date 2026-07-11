# PB-06 — Architecture logique

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | PB-06 |
| **Titre** | Architecture logique |
| **Version** | 0.2.0 |
| **Statut** | Review |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-10 |

---

# Objet du document

Ce document décrit l'architecture logique d'AKS Platform.

Il définit les couches qui composent la plateforme, leurs responsabilités et les dépendances autorisées entre elles.

Cette architecture constitue la référence de tout développement réalisé au sein du projet.

---

# Principes

L'architecture repose sur les principes suivants :

- séparation des responsabilités ;
- faible couplage ;
- forte cohésion ;
- modularité ;
- réutilisation des composants ;
- indépendance des modules métier.

Chaque couche possède un rôle unique et clairement identifié.

---

# Architecture logique

```text
                    AKS Platform

                          │
                          ▼
                    Bootstrap Layer
                          │
                          ▼
                     Application Layer
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
    Core Layer       Module Layer     Shared Layer
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                     Data Layer
                          │
                          ▼
                  Google Workspace
```

---

# Bootstrap Layer

Responsabilités :

- initialiser l'application ;
- charger la configuration ;
- enregistrer les modules ;
- préparer l'environnement d'exécution.

Cette couche ne contient aucune logique métier.

---

# Application Layer

Responsabilités :

- exposer les points d'entrée Apps Script ;
- coordonner les appels ;
- déléguer le traitement aux modules.

Elle ne contient pas de règles métier.

---

# Core Layer

Responsabilités :

- fournir les services communs ;
- gérer les erreurs ;
- centraliser la configuration ;
- proposer les composants réutilisables ;
- garantir les conventions de la plateforme.

Le Core ne dépend d'aucun module métier.

---

# Module Layer

Responsabilités :

- implémenter les règles métier ;
- répondre aux besoins fonctionnels ;
- utiliser exclusivement les services du Core.

Chaque module est indépendant des autres.

Les échanges entre modules passent par des interfaces ou des services du Core.

---

# Shared Layer

Responsabilités :

- mutualiser les services techniques ;
- encapsuler les accès aux API externes ;
- fournir des composants communs.

Exemples :

- génération PDF ;
- notifications ;
- export ;
- utilitaires.

---

# Data Layer

Responsabilités :

- accéder aux données ;
- encapsuler Google Sheets, Drive et les autres sources ;
- masquer les détails techniques au reste de l'application.

Aucune logique métier ne doit être présente dans cette couche.

---

# Dépendances autorisées

Les dépendances suivent la règle suivante :

```text
Bootstrap
    ↓
Application
    ↓
Modules
    ↓
Core
    ↓
Shared
    ↓
Data
```

Les dépendances inverses sont interdites.

En particulier :

- Core ne dépend jamais d'un module.
- Un module ne dépend jamais directement d'un autre module.
- Les accès aux données passent exclusivement par la Data Layer.

---

# Règles d'architecture

Les règles suivantes sont obligatoires :

- une responsabilité par composant ;
- aucune logique métier dans Core ;
- aucune logique technique dans les modules ;
- aucune dépendance circulaire ;
- toute dépendance doit être justifiée.

Le non-respect de ces règles constitue une dette d'architecture.

---

# Évolutivité

L'ajout d'un nouveau module ne doit nécessiter aucune modification des modules existants.

Le développement privilégie l'extension de la plateforme plutôt que la modification des composants validés.

Cette approche garantit la stabilité du système et facilite sa maintenance.

---

# Références

- PB-01 — Vision
- PB-02 — Philosophie
- PB-05 — Vue d'ensemble
- PB-07 — AKS Core
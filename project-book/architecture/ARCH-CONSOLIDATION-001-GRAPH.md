# ARCH-CONSOLIDATION-001-GRAPH

# Graphe des dépendances documentaires — M2.2

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M2.2 — Graphe documentaire |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Cartographie descriptive non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-21 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document représente graphiquement les dépendances documentaires explicites recensées dans la matrice M2.1 du chantier `ARCH-CONSOLIDATION-001`.

Le graphe ne crée aucune dépendance nouvelle. Il reprend uniquement les relations identifiées dans les métadonnées, le catalogue `INDEX-001` ou le contenu des documents consultés.

Une flèche `A --> B` signifie que le document **A référence explicitement le document B**.

---

# 2. Graphe documentaire consolidé

```mermaid
flowchart LR
    ADR001[ADR-001]
    ARCH001[ARCH-001]
    CORE001[CORE-001]
    ADMIN001[ADMIN-001]
    CONFIG001[CONFIG-001]
    LOG001[LOG-001]
    UX001[UX-001]
    API001[API-001]
    SECURITY001[SECURITY-001]
    AUDIT001[AUDIT-001]
    ERROR001[ERROR-001]
    NOTIF001[NOTIF-001]
    DOCUMENT001[DOCUMENT-001]
    STORAGE001[STORAGE-001]

    VISION001[VISION-001]
    OBJECTIVES001[OBJECTIVES-001]
    SCOPE001[SCOPE-001]
    ROADMAP001[ROADMAP-001]
    GOVDOC001[GOV-DOC-001]
    GOVDEV001[GOV-DEV-001]

    ADR001 --> GOVDOC001
    ADR001 --> GOVDEV001

    ARCH001 --> VISION001
    ARCH001 --> OBJECTIVES001
    ARCH001 --> SCOPE001
    ARCH001 --> ROADMAP001
    ARCH001 --> CORE001
    ARCH001 --> ADMIN001
    ARCH001 --> CONFIG001
    ARCH001 --> LOG001
    ARCH001 --> UX001

    CORE001 --> ARCH001
    CORE001 --> CONFIG001
    CORE001 --> LOG001
    CORE001 --> UX001
    CORE001 --> ADMIN001

    CONFIG001 --> CORE001
    CONFIG001 --> ADMIN001

    LOG001 --> CORE001
    LOG001 --> AUDIT001
    LOG001 --> ARCH001
    LOG001 --> ADMIN001
    LOG001 --> CONFIG001
    LOG001 --> ROADMAP001

    UX001 --> VISION001
    UX001 --> ARCH001

    API001 --> SECURITY001
    API001 --> LOG001
    API001 --> ERROR001
    API001 --> AUDIT001
    API001 --> CONFIG001
    API001 --> ARCH001
    API001 --> CORE001
    API001 --> NOTIF001

    SECURITY001 --> ADMIN001
    SECURITY001 --> CONFIG001
    SECURITY001 --> LOG001
    SECURITY001 --> AUDIT001
    SECURITY001 --> ERROR001
    SECURITY001 --> STORAGE001

    AUDIT001 --> LOG001
    AUDIT001 --> CONFIG001
    AUDIT001 --> ADMIN001

    ERROR001 --> API001
    ERROR001 --> LOG001
    ERROR001 --> AUDIT001
    ERROR001 --> SECURITY001
    ERROR001 --> UX001

    NOTIF001 --> ARCH001
    NOTIF001 --> CORE001
    NOTIF001 --> CONFIG001
    NOTIF001 --> LOG001
    NOTIF001 --> SECURITY001
    NOTIF001 --> AUDIT001

    STORAGE001 --> ARCH001
    STORAGE001 --> CORE001
    STORAGE001 --> CONFIG001
    STORAGE001 --> LOG001
    STORAGE001 --> AUDIT001
    STORAGE001 --> SECURITY001
    STORAGE001 --> DOCUMENT001
    STORAGE001 --> ERROR001
    STORAGE001 --> ADMIN001
```

---

# 3. Vue par familles documentaires

```mermaid
flowchart TB
    subgraph GOV[Vision et gouvernance]
        VISION001[VISION-001]
        OBJECTIVES001[OBJECTIVES-001]
        SCOPE001[SCOPE-001]
        ROADMAP001[ROADMAP-001]
        GOVDOC001[GOV-DOC-001]
        GOVDEV001[GOV-DEV-001]
    end

    subgraph ARCH[Architecture]
        ADR001[ADR-001]
        ARCH001[ARCH-001]
        CORE001[CORE-001]
        API001[API-001]
        SECURITY001[SECURITY-001]
        ERROR001[ERROR-001]
        NOTIF001[NOTIF-001]
        DOCUMENT001[DOCUMENT-001]
        STORAGE001[STORAGE-001]
    end

    subgraph ADMIN[Administration]
        ADMIN001[ADMIN-001]
        CONFIG001[CONFIG-001]
        LOG001[LOG-001]
        AUDIT001[AUDIT-001]
    end

    subgraph UX[Expérience utilisateur]
        UX001[UX-001]
    end

    ADR001 --> GOVDOC001
    ADR001 --> GOVDEV001
    ARCH001 --> GOV
    ARCH001 --> CORE001
    ARCH001 --> ADMIN
    ARCH001 --> UX001
    CORE001 --> ARCH001
    CORE001 --> ADMIN
    CORE001 --> UX001
    CONFIG001 --> CORE001
    LOG001 --> ARCH001
    LOG001 --> ROADMAP001
    API001 --> ARCH
    API001 --> ADMIN
    SECURITY001 --> ADMIN
    SECURITY001 --> ARCH
    AUDIT001 --> ADMIN
    ERROR001 --> ARCH
    ERROR001 --> ADMIN
    ERROR001 --> UX001
    NOTIF001 --> ARCH
    NOTIF001 --> ADMIN
    STORAGE001 --> ARCH
    STORAGE001 --> ADMIN
```

---

# 4. Boucles de références observées

Les relations suivantes forment des références réciproques explicites :

| Document A | Document B | Relation observée |
|---|---|---|
| ARCH-001 | CORE-001 | Référence réciproque |
| ARCH-001 | LOG-001 | Référence réciproque |
| ARCH-001 | UX-001 | Référence réciproque |
| CORE-001 | CONFIG-001 | Référence réciproque |
| CORE-001 | LOG-001 | Référence réciproque |
| CORE-001 | NOTIF-001 | Référence réciproque |
| CONFIG-001 | LOG-001 | Référence réciproque |
| CONFIG-001 | AUDIT-001 | Référence réciproque |
| CONFIG-001 | SECURITY-001 | Référence réciproque |
| CONFIG-001 | NOTIF-001 | Référence réciproque |
| CONFIG-001 | STORAGE-001 | Référence réciproque |
| LOG-001 | AUDIT-001 | Référence réciproque |
| LOG-001 | SECURITY-001 | Référence réciproque |
| LOG-001 | ERROR-001 | Référence réciproque |
| LOG-001 | NOTIF-001 | Référence réciproque |
| LOG-001 | STORAGE-001 | Référence réciproque |
| API-001 | ERROR-001 | Référence réciproque |
| SECURITY-001 | ERROR-001 | Référence réciproque |
| SECURITY-001 | STORAGE-001 | Référence réciproque |
| AUDIT-001 | ERROR-001 | Référence réciproque |
| AUDIT-001 | NOTIF-001 | Référence réciproque |
| AUDIT-001 | STORAGE-001 | Référence réciproque |
| ERROR-001 | STORAGE-001 | Référence réciproque |

Ce relevé est descriptif. L'interprétation des boucles, des recouvrements et des responsabilités relève du jalon M3.

---

# 5. Résultat du sous-jalon M2.2

Le graphe représente les relations explicites recensées dans la matrice M2.1 et distingue les familles documentaires concernées.

Le sous-jalon **M2.2 — Graphe documentaire** est produit.

Sa validation permettra :

- de clôturer le jalon M2 ;
- d'ouvrir le jalon M3 — Analyse des responsabilités ;
- d'utiliser les références réciproques comme points d'entrée de l'analyse, sans préjuger d'une migration documentaire.

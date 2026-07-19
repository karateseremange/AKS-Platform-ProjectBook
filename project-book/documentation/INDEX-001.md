# INDEX-001

# Catalogue du Project Book

| Propriété | Valeur |
|-----------|--------|
| Document ID | INDEX-001 |
| Titre | Catalogue du Project Book |
| Version | 1.1.1 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-19 |
| Version du produit | V1.1 |

---

# 1. Objet

Le présent document constitue le registre documentaire officiel du Project Book d'AKS Platform.

Il fournit un point d'entrée unique vers la documentation de référence, précise l'organisation du dépôt, recense les documents officiels et définit leur position dans l'ensemble documentaire.

`INDEX-001` est le document maître de l'organisation documentaire. Il ne remplace pas le `README.md`, qui présente le dépôt aux visiteurs et contributeurs.

---

# 2. Principes documentaires

Le Project Book respecte les principes suivants :

- une référence documentaire unique pour chaque sujet structurant ;
- un identifiant stable pour chaque document ;
- une séparation claire entre vision, gouvernance, architecture, administration, expérience utilisateur, modules métier et guides opérationnels ;
- une version et un statut explicites ;
- des références croisées traçables ;
- une évolution cumulative sans altération silencieuse des décisions validées ;
- l'archivage des documents devenus obsolètes plutôt que leur suppression sans trace.

---

# 3. Organisation du dépôt

L'organisation documentaire de référence est la suivante :

```text
project-book/
├── vision/
├── roadmap/
├── governance/
├── architecture/
├── administration/
├── ux/
├── modules/
├── operations/
└── references/
```

L'arborescence réelle peut évoluer lorsque de nouveaux domaines apparaissent. Toute évolution significative doit être répercutée dans le présent catalogue.

---

# 4. Documents directeurs

| ID | Titre | Domaine | Statut | Version | Rôle |
|----|-------|---------|--------|---------|------|
| VISION-001 | Vision d'AKS Platform | Vision | Validé | 1.1.0 | Définit la finalité, les principes et les ambitions de la plateforme |
| OBJECTIVES-001 | Objectifs stratégiques | Stratégie | Validé | 1.1.0 | Définit les objectifs stratégiques et les résultats attendus |
| SCOPE-001 | Périmètre fonctionnel | Stratégie | Validé | 1.1.0 | Définit les éléments inclus, exclus et différés du périmètre produit |
| ROADMAP-001 | Feuille de route officielle | Roadmap | Validé | 1.1.1 | Définit l'ordre et les priorités d'évolution |
| GOV-001 | Gouvernance produit | Gouvernance | Validé | 1.1.0 | Définit les rôles, décisions et règles de pilotage |
| ARCH-001 | Architecture fonctionnelle | Architecture | Validé | 1.1.0 | Définit l'organisation fonctionnelle générale |
| CORE-001 | AKS Core | Architecture | Validé | 1.1.0 | Définit le socle commun de la plateforme |

---

# 5. Documents d'architecture transverse

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| API-001 | Contrats et principes d'API | Validé | 1.1.0 | ARCH-001, CORE-001 |
| SECURITY-001 | Sécurité d'AKS Platform | Validé | 1.1.0 | ARCH-001, CORE-001 |
| AUDIT-001 | Audit et traçabilité | Validé | 1.1.0 | SECURITY-001, LOG-001 |
| ERROR-001 | Gestion des erreurs | Validé | 1.1.0 | API-001, LOG-001 |
| NOTIF-001 | Notifications | Validé | 1.1.0 | CORE-001, CONFIG-001 |
| DOCUMENT-001 | Gestion documentaire | Validé | 1.1.0 | CORE-001, STORAGE-001 |
| STORAGE-001 | Stockage transverse | Validé | 1.1.0 | ARCH-001, CORE-001 |

---

# 6. Documents d'administration

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| ADMIN-001 | Tableau de bord d'administration | Validé | 1.1.0 | CORE-001, CONFIG-001, LOG-001 |
| CONFIG-001 | Paramétrage centralisé | Validé | 1.1.0 | CORE-001, ADMIN-001 |
| LOG-001 | Journalisation | Validé | 1.1.0 | CORE-001, AUDIT-001 |

---

# 7. Expérience utilisateur

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| UX-001 | Principes d'expérience utilisateur | Validé | 1.1.0 | VISION-001, ARCH-001 |

---

# 8. Modules métier

Les modules métier sont documentés dans des documents dédiés lorsqu'ils entrent dans le périmètre actif de développement.

Ordre produit validé après la consolidation V1.1 :

1. AKS Analytics ;
2. AKS Calendar ;
3. autres modules selon la feuille de route officielle.

Les domaines fonctionnels prévus comprennent notamment :

- Questionnaire santé ;
- Analytics ;
- Calendar ;
- Grades ;
- Présences ;
- Licenciés ;
- Communication.

Un module futur ne doit pas être présenté comme livré tant que son document de référence et son périmètre ne sont pas validés.

---

# 9. Hiérarchie des références

La hiérarchie documentaire générale est la suivante :

```text
VISION-001
    ↓
OBJECTIVES-001 et SCOPE-001
    ↓
ROADMAP-001 et GOV-001
    ↓
ARCH-001
    ↓
CORE-001
    ↓
Services transverses
    ↓
Administration et UX
    ↓
Modules métier
    ↓
Guides opérationnels
```

En cas de divergence :

- `VISION-001` fait autorité sur la finalité du produit ;
- `OBJECTIVES-001` fait autorité sur les objectifs stratégiques ;
- `SCOPE-001` fait autorité sur le périmètre fonctionnel ;
- `ROADMAP-001` fait autorité sur les priorités et l'ordre des versions ;
- `GOV-001` fait autorité sur la gouvernance et les décisions ;
- `ARCH-001` fait autorité sur l'architecture fonctionnelle ;
- le document métier ou transverse spécialisé fait autorité sur son propre périmètre ;
- `INDEX-001` fait autorité sur le catalogue et l'organisation documentaire.

---

# 10. Convention de nommage

Les documents de référence utilisent la convention suivante :

```text
<DOMAINE>-<NUMÉRO>
```

Exemples :

- `ARCH-001` ;
- `API-001` ;
- `CONFIG-001` ;
- `UX-001`.

L'identifiant doit être unique, stable et utilisé dans les références croisées.

Le nom de fichier recommandé est :

```text
<ID>.md
```

---

# 11. Métadonnées obligatoires

Chaque document officiel doit comporter un en-tête indiquant au minimum :

- l'identifiant du document ;
- le titre ;
- la version ;
- le statut ;
- le propriétaire ;
- la date de dernière mise à jour ;
- la version du produit concernée.

Le format de référence est celui utilisé par `ARCH-001` et le présent document.

---

# 12. Cycle de vie documentaire

Les statuts documentaires autorisés sont :

| Statut | Signification |
|--------|---------------|
| Brouillon | Document initial non stabilisé |
| En rédaction | Contenu en cours de construction |
| En revue | Document soumis à validation |
| Validé | Document approuvé et applicable |
| Obsolète | Document remplacé, conservé temporairement pour traçabilité |
| Archivé | Document retiré du corpus actif et conservé à titre historique |

Une modification structurante d'un document validé doit entraîner une mise à jour de sa version, de sa date et, si nécessaire, des documents qui le référencent.

---

# 13. Matrice de couverture V1.1

| Domaine | Documents principaux | Couverture |
|---------|----------------------|------------|
| Vision | VISION-001 | Complète |
| Objectifs stratégiques | OBJECTIVES-001 | Complète |
| Périmètre fonctionnel | SCOPE-001 | Complète |
| Roadmap | ROADMAP-001 | Complète |
| Gouvernance | GOV-001 | Complète |
| Architecture générale | ARCH-001, CORE-001 | Complète |
| API | API-001 | Complète |
| Sécurité | SECURITY-001 | Complète |
| Audit | AUDIT-001 | Complète |
| Gestion des erreurs | ERROR-001 | Complète |
| Notifications | NOTIF-001 | Complète |
| Gestion documentaire | DOCUMENT-001 | Complète |
| Stockage | STORAGE-001 | Complète |
| Administration | ADMIN-001, CONFIG-001, LOG-001 | Complète |
| Expérience utilisateur | UX-001 | Complète |
| Modules métier futurs | Documents à créer selon la roadmap | Planifiée |

---

# 14. Maintenance du catalogue

`INDEX-001` doit être mis à jour lorsqu'un document est :

- créé ;
- renommé ;
- déplacé ;
- validé ;
- rendu obsolète ;
- archivé ;
- remplacé par une nouvelle référence.

La mise à jour du catalogue fait partie intégrante de la livraison documentaire concernée.

---

# 15. Contrôles de cohérence

Avant le gel d'une version du Project Book, les contrôles suivants doivent être réalisés :

- tous les documents recensés existent réellement ;
- les identifiants sont uniques ;
- les en-têtes suivent le format officiel ;
- les versions et statuts sont cohérents ;
- les références croisées pointent vers des documents existants ou explicitement futurs ;
- aucun document validé n'est tronqué ou vide ;
- le `README.md` renvoie vers le catalogue officiel ;
- les documents obsolètes sont clairement identifiés.

---

# 16. Historique

| Version | Date | Évolution |
|---------|------|-----------|
| 1.1.1 | 2026-07-19 | Alignement de la version de ROADMAP-001 avec le document de référence |
| 1.1.0 | 2026-07-19 | Création du catalogue officiel du Project Book et ajout de OBJECTIVES-001 et SCOPE-001 |

---

# 17. Références

- `README.md` — Présentation du dépôt documentaire
- `VISION-001` — Vision d'AKS Platform
- `OBJECTIVES-001` — Objectifs stratégiques
- `SCOPE-001` — Périmètre fonctionnel
- `ROADMAP-001` — Feuille de route officielle
- `GOV-001` — Gouvernance produit
- `ARCH-001` — Architecture fonctionnelle
- `CORE-001` — AKS Core

---

# 18. Conclusion

`INDEX-001` centralise l'organisation documentaire d'AKS Platform et fournit une vision claire des références applicables.

Il facilite la navigation, la maintenance, les audits de cohérence et l'intégration progressive des futurs modules tout en préservant la traçabilité des décisions du Project Book.
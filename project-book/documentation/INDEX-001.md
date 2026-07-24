# INDEX-001

# Catalogue du Project Book

| Propriété | Valeur |
|-----------|--------|
| Document ID | INDEX-001 |
| Titre | Catalogue du Project Book |
| Version | 1.2.2 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-24 |
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
- l'archivage des documents devenus obsolètes plutôt que leur suppression sans trace ;
- l'application des principes généraux définis dans `DOC-001` ;
- l'application de `STD-001` à tout nouveau module métier, sauf dérogation documentée conformément à `GOV-DOC-001`.

---

# 3. Organisation du dépôt

```text
project-book/
├── vision/
├── strategy/
├── governance/
├── architecture/
├── administration/
├── ux/
├── modules/
│   └── analytics/
├── documentation/
│   ├── DOC-001.md
│   ├── INDEX-001.md
│   └── STD-001.md
└── release/
```

Les documents transverses existants restent à leur emplacement actuel. Les modules métier sont regroupés sous `project-book/modules/`, avec un sous-dossier par module.

Le dossier `project-book/documentation/` contient les règles générales, le catalogue et les standards spécialisés du système documentaire.

Toute évolution significative de cette organisation doit être répercutée dans le présent catalogue et dans le `README.md`.

---

# 4. Documents directeurs

| ID | Titre | Domaine | Statut | Version | Rôle |
|----|-------|---------|--------|---------|------|
| VISION-001 | Vision d'AKS Platform | Vision | Validé | 1.1.0 | Définit la finalité, les principes et les ambitions de la plateforme |
| OBJECTIVES-001 | Objectifs stratégiques | Stratégie | Validé | 1.1.0 | Définit les objectifs stratégiques et les résultats attendus |
| SCOPE-001 | Périmètre fonctionnel | Stratégie | Validé | 1.1.0 | Définit les éléments inclus, exclus et différés du périmètre produit |
| ROADMAP-001 | Feuille de route officielle | Stratégie | Validé | 1.1.1 | Définit l'ordre et les priorités d'évolution |
| GOV-001 | Gouvernance produit | Stratégie | Validé | 1.1.0 | Définit les rôles, décisions et règles de pilotage |
| ARCH-001 | Architecture fonctionnelle | Architecture | Validé | 1.2.0 | Définit l'organisation fonctionnelle générale |
| CORE-001 | AKS Core | Architecture | Published | 1.2.0 | Définit le socle commun de la plateforme |

---

# 5. Gouvernance et standards documentaires

| ID | Titre | Statut | Version | Rôle |
|----|-------|--------|---------|------|
| GOV-DOC-001 | Gouvernance documentaire | Published | 1.1.0 | Définit l'autorité, le cycle de vie et les règles de publication documentaire |
| GOV-DEV-001 | Gouvernance du développement logiciel | Published | 1.0.0 | Définit les principes de gouvernance applicables au développement logiciel |
| DOC-001 | Règles de documentation d'AKS Platform | Validé | 1.2.0 | Définit les principes généraux du système documentaire |
| STD-001 | Module Documentation Standard | Validé | 1.0.0 | Définit l'organisation documentaire obligatoire de tout module métier |
| ADR-001 | Architecture documentaire d'AKS Platform | Published | À confirmer | Documente les motivations de l'organisation documentaire |

`DOC-001` constitue la référence générale des règles documentaires. `STD-001` en est une spécialisation applicable aux modules métier.

---

# 6. Documents d'architecture transverse

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| API-001 | Contrats et principes d'API | Validé | 1.1.0 | ARCH-001, CORE-001 |
| SECURITY-001 | Sécurité d'AKS Platform | Validé | 1.1.0 | ARCH-001, CORE-001 |
| ERROR-001 | Gestion des erreurs | Validé | 1.1.0 | API-001, LOG-001 |
| NOTIF-001 | Notifications | Validé | 1.1.0 | CORE-001, CONFIG-001 |
| DOCUMENT-001 | Gestion documentaire | Validé | 1.1.0 | CORE-001, STORAGE-001 |
| STORAGE-001 | Stockage transverse | Validé | 1.2.1 | ARCH-001, CORE-001 |
| UI-001 | Contrat d'interface utilisateur | Validé | 1.1.0 | UX-001, ARCH-001 |

---

# 7. Documents d'administration

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| ADMIN-001 | Tableau de bord d'administration | Validé | 1.2.1 | CORE-001, CONFIG-001, LOG-001 |
| ADMIN-002 | Interface utilisateur et navigation | Référence de développement | 1.2.0 | ADMIN-001, UX-001, UI-001 |
| ADMIN-003 | Centre de pilotage | Référence de développement | 1.2.0 | ADMIN-001, ADMIN-002, CORE-001 |
| ADMIN-004 | Contrat DashboardProvider et DashboardWidget | Référence de développement | 1.2.0 | ADMIN-003, CORE-001, API-001 |
| ADMIN-005 | Validation et conformité du Centre de pilotage | Référence de développement | 1.2.0 | ADMIN-001 à ADMIN-004, UI-001, SECURITY-001 |
| CONFIG-001 | Paramétrage centralisé | Validé | 1.2.0 | CORE-001, ADMIN-001 |
| LOG-001 | Journalisation | Validé | 1.2.1 | CORE-001, AUDIT-001 |
| AUDIT-001 | Audit et traçabilité | Validé | 1.1.1 | SECURITY-001, LOG-001 |

---

# 8. Expérience utilisateur

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| UX-001 | Principes d'expérience utilisateur | Validé | 1.1.0 | VISION-001, ARCH-001 |

---

# 9. Modules métier

Les modules métier sont documentés sous `project-book/modules/<module>/` lorsqu'ils entrent dans le périmètre actif de développement.

Tout nouveau module métier doit respecter `STD-001`, conformément à la règle `GOV-DOC-003` définie dans `GOV-DOC-001`.

| Module | Dossier | Document d'entrée | État |
|--------|---------|-------------------|------|
| AKS Analytics | `project-book/modules/analytics/` | `ANALYTICS-001` | En cours de documentation |
| AKS Calendar | `project-book/modules/calendar/` | À créer | Planifié |
| Questionnaire Santé | À structurer dans le Project Book | À consolider | Livré en V1.0.0 |
| Grades | À créer | À créer | Futur |
| Présences | À créer | À créer | Futur |
| Licenciés | À créer | À créer | Futur |
| Communication | À créer | À créer | Futur |

Ordre produit validé après la consolidation V1.1 :

1. AKS Analytics ;
2. AKS Calendar ;
3. autres modules selon `ROADMAP-001`.

Un module futur ne doit pas être présenté comme livré tant que son document de référence et son périmètre ne sont pas validés.

---

# 10. Hiérarchie des références

```text
VISION-001
    ↓
OBJECTIVES-001 et SCOPE-001
    ↓
ROADMAP-001 et GOV-001
    ↓
GOV-DOC-001
    ↓
DOC-001
    ↓
STD-001
    ↓
ARCH-001 et référentiels transverses
    ↓
Modules métier
    ↓
Guides opérationnels
```

En cas de divergence, le document spécialisé fait autorité sur son propre périmètre et `INDEX-001` fait autorité sur le catalogue et l'organisation documentaire.

---

# 11. Convention de nommage

Les documents de référence utilisent la convention `<DOMAINE>-<NUMÉRO>`. L'identifiant doit être unique, stable et utilisé dans les références croisées. Le nom de fichier recommandé est `<ID>.md`.

---

# 12. Métadonnées obligatoires

Chaque document officiel doit comporter au minimum : identifiant, titre, version, statut, propriétaire, date de dernière mise à jour et version du produit concernée.

---

# 13. Cycle de vie documentaire

| Statut | Signification |
|--------|---------------|
| Brouillon | Document initial non stabilisé |
| En rédaction | Contenu en cours de construction |
| En revue | Document soumis à validation |
| Validé | Document approuvé et applicable |
| Référence de développement | Document applicable à l'implémentation en cours |
| Published | Document normatif officiellement publié selon `GOV-DOC-001` |
| Obsolète | Document remplacé, conservé pour traçabilité |
| Archivé | Document retiré du corpus actif et conservé à titre historique |

---

# 14. Matrice de couverture V1.1

| Domaine | Documents principaux | Couverture |
|---------|----------------------|------------|
| Vision et stratégie | VISION-001, OBJECTIVES-001, SCOPE-001, ROADMAP-001, GOV-001 | Complète |
| Gouvernance documentaire | GOV-DOC-001, GOV-DEV-001, DOC-001, STD-001, ADR-001 | Complète sous réserve de confirmation d'ADR-001 |
| Architecture générale | ARCH-001, CORE-001 | Complète |
| Services transverses | API-001, SECURITY-001, ERROR-001, NOTIF-001, DOCUMENT-001, STORAGE-001, UI-001 | Complète |
| Administration | ADMIN-001 à ADMIN-005, CONFIG-001, LOG-001, AUDIT-001 | Complète |
| Expérience utilisateur | UX-001 | Complète |
| AKS Analytics | ANALYTICS-001 et documents suivants | En cours |
| Autres modules métier | Documents à créer selon la roadmap et STD-001 | Planifiée |

---

# 15. Maintenance du catalogue

`INDEX-001` doit être mis à jour lorsqu'un document est créé, renommé, déplacé, validé, rendu obsolète, archivé ou remplacé. Cette mise à jour fait partie intégrante de la livraison documentaire concernée.

---

# 16. Contrôles de cohérence

Avant le gel d'une version du Project Book, il faut vérifier l'existence des documents recensés, l'unicité des identifiants, la conformité des en-têtes, la cohérence des versions et statuts, la validité des références croisées et l'alignement du `README.md` avec le présent catalogue.

---

# 17. Historique

| Version | Date | Évolution |
|---------|------|-----------|
| 1.2.2 | 2026-07-24 | Alignement des versions et statuts réels, clôture d’ADMIN-001 et synchronisation avec ROADMAP-001 |
| 1.2.1 | 2026-07-23 | Déplacement de STD-001 dans `project-book/documentation/` et alignement de l'organisation officielle du dépôt |
| 1.2.0 | 2026-07-23 | Intégration de DOC-001, STD-001, GOV-DOC-001 et GOV-DEV-001 dans le catalogue officiel et formalisation du standard applicable aux modules métier |
| 1.1.2 | 2026-07-23 | Ajout de la structure `modules/`, intégration d'AKS Analytics et mise à jour du domaine Administration |
| 1.1.1 | 2026-07-19 | Alignement de la version de ROADMAP-001 |
| 1.1.0 | 2026-07-19 | Création du catalogue officiel |

---

# 18. Conclusion

`INDEX-001` centralise l'organisation documentaire d'AKS Platform et facilite la navigation, la maintenance, les audits de cohérence et l'intégration progressive des modules métier.
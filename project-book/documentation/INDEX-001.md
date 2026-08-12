# INDEX-001

# Catalogue du Project Book

| Propriété | Valeur |
|-----------|--------|
| Document ID | INDEX-001 |
| Titre | Catalogue du Project Book |
| Version | 1.3.8 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-08-13 |
| Version du produit | Post-V1.3 |

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
│   ├── analytics/
│   ├── calendar/
│   └── inscriptions/
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
| ROADMAP-001 | Feuille de route officielle | Stratégie | Validé | 1.2.90 | Définit l'ordre et les priorités d'évolution |
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
| ARCH-002 | Architecture logique transverse — chantier M1.1 à M1.7 terminé | Validé | 1.0.0 | ARCH-001, CORE-001 |
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
| ADMIN-002 | Interface utilisateur et navigation | Validé | 1.2.1 | ADMIN-001, UX-001, UI-001 |
| ADMIN-003 | Centre de pilotage | Validé | 1.2.1 | ADMIN-001, ADMIN-002, CORE-001 |
| ADMIN-004 | Contrat DashboardProvider et DashboardWidget | Validé | 1.2.1 | ADMIN-003, CORE-001, API-001 |
| ADMIN-005 | Validation et conformité du Centre de pilotage | Validé | 1.2.1 | ADMIN-001 à ADMIN-004, UI-001, SECURITY-001 |
| ACCESS-002 | Administration des utilisateurs et habilitations privées | Réalisation engagée — cadrage ACCESS-002-03 en revue | 0.4.12 | ACCESS-001, ADMIN-001 à ADMIN-005, SECURITY-001, CONFIG-001, AUDIT-001 |
| ACCESS-002-01 | Socle d’administration des utilisateurs et habilitations | Validé — intégré dans `develop` par la PR #93 | 1.0.0 | ACCESS-002, ACCESS-001, SECURITY-001, AUDIT-001, AKS-Platform #93, `91ba7e3` |
| ACCESS-002-02 | Amorçage contrôlé et migration du premier gestionnaire ACCESS | Validé — recette réversible concluante | 1.0.0 | ACCESS-002, ACCESS-002-01, ACCESS-001, SECURITY-001, AUDIT-001, CONFIG-001, AKS-Platform #94 à #100, `a1181ed` |
| ACCESS-002-03 | Liste, recherche et cycle de vie des comptes d’accès | Cadrage en revue — aucune implémentation engagée | 0.1.0 | ACCESS-002, ACCESS-002-01, ACCESS-002-02, ACCESS-001, SECURITY-001, AUDIT-001 |
| CONFIG-001 | Paramétrage centralisé | Validé | 1.2.3 | CORE-001, ADMIN-001 |
| LOG-001 | Journalisation | Validé | 1.2.5 | CORE-001, AUDIT-001 |
| AUDIT-001 | Audit et traçabilité — socle persistant étendu aux opérations ACCESS | Validé | 1.3.4 | SECURITY-001, LOG-001, CORE-001, STORAGE-001, ERROR-001, ACCESS-002-01 |
| AUDIT-001-RECETTE | Procès-verbal de recette du socle persistant AUDIT-001 | En revue | 1.0.0 | AUDIT-001, CONFIG-001, AKS-Platform #90 |

---

# 8. Expérience utilisateur

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| UX-001 | Principes d'expérience utilisateur — chantier V1.1 terminé : fondations communes, retours d’action, consultation des journaux et présentation compréhensible des événements validés (121/121 tests) | Validé | 1.5 | VISION-001, ARCH-001, ADMIN-001 |
| WEB-001 | Point d’accès WordPress à AKS Platform — menu « Services en ligne » publié et recette validée | Validé | 1.1.0 | ROADMAP-001, SECURITY-001, ADMIN-001 |

---

# 9. Modules métier

Les modules métier sont documentés sous `project-book/modules/<module>/` lorsqu'ils entrent dans le périmètre actif de développement.

Tout nouveau module métier doit respecter `STD-001`, conformément à la règle `GOV-DOC-003` définie dans `GOV-DOC-001`.

| Module | Dossier | Document d'entrée | État |
|--------|---------|-------------------|------|
| AKS Analytics | `project-book/modules/analytics/` | `ANALYTICS-001` à `ANALYTICS-009`, `ANALYTICS-SAISIE-001` à `ANALYTICS-SAISIE-005`, `ACCESS-001` | V1.2.0 publiée — contrat d’écriture des présences publié |
| AKS Calendar | `project-book/modules/calendar/` | `CALENDAR-001` à `CALENDAR-004` | Socle Google Calendar, publication publique et accès internes WordPress opérationnels |
| AKS Inscriptions | `project-book/modules/inscriptions/` | `INSCRIPTIONS-001` à `INSCRIPTIONS-006`, `INSCRIPTIONS-008` à `INSCRIPTIONS-010`, `INSCRIPTIONS-010-RECETTE` | Quatrième incrément INSCRIPTIONS-010 clôturé et fusionné dans `develop` par la PR #89 au commit `ed03cc4…` ; **455/455 tests**, recette Google isolée concluante pour le périmètre exécuté ; ACCESS-002 devient le prérequis transverse avant le cadrage d’INSCRIPTIONS-011 |
| Questionnaire Santé | À structurer dans le Project Book | À consolider | Livré en V1.0.0 |
| Grades | À créer | À créer | Futur |
| Présences | Extension d’AKS Analytics | `ANALYTICS-SAISIE-001` à `ANALYTICS-SAISIE-006` | Parcours mobile publié et validé en production |
| Communication | À créer | À créer | Futur |

### 9.1 Documents AKS Calendar

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| CALENDAR-001 | Cadrage fonctionnel et architectural d’AKS Calendar | Validé | 1.0.1 | ROADMAP-001, ARCH-001, SECURITY-001, CONFIG-001, LOG-001, UI-001, UX-001 |
| CALENDAR-002 | Configuration et recette du socle Google Calendar | Validé | 1.0.0 | CALENDAR-001, SECURITY-001 |
| CALENDAR-003 | Publication WordPress et guide utilisateur d’AKS Calendar | Validé | 1.0.0 | CALENDAR-001, CALENDAR-002, WEB-001, SECURITY-001 |
| CALENDAR-004 | Accès protégé aux calendriers internes depuis WordPress | Validé | 1.0.0 | CALENDAR-002, CALENDAR-003, WEB-001, SECURITY-001 |

### 9.2 Documents AKS Analytics

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| ANALYTICS-001 | Vision et architecture du module AKS Analytics | Référence de développement | 1.3.0 | ARCH-001, CORE-001, ADMIN-004, STD-001 |
| ANALYTICS-002 | Modèle métier d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001, ROADMAP-001, SECURITY-001, STORAGE-001 |
| ANALYTICS-003 | Services et règles d'orchestration d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001, ANALYTICS-002, CORE-001, ADMIN-004, CONFIG-001, LOG-001 |
| ANALYTICS-004 | Interfaces et restitutions d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001 à ANALYTICS-003, ADMIN-002 à ADMIN-004, UI-001, UX-001 |
| ANALYTICS-005 | Contrats externes et formats des sources d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001 à ANALYTICS-004, STORAGE-001, SECURITY-001, CONFIG-001 |
| ANALYTICS-006 | Stratégie de validation, jeux d’essai et recette d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001 à ANALYTICS-005, ADMIN-004, CONFIG-001, LOG-001, SECURITY-001, STORAGE-001, UI-001, UX-001 |
| ANALYTICS-007 | Catalogue des indicateurs et règles de calcul | Référence de développement | 1.0.0 | ANALYTICS-001 à ANALYTICS-006 |
| ANALYTICS-008 | Bilan d’implémentation et procès-verbal de recette | Validé | 1.0.1 | ANALYTICS-001 à ANALYTICS-007 |
| ANALYTICS-009 | Guide d’alimentation Google Sheets V1.2.0 | Validé | 1.0.0 | ANALYTICS-005, ANALYTICS-008, implémentation V1.2.0 |
| ANALYTICS-SAISIE-001 | Cadrage fonctionnel et UX de la saisie des présences | Validé | 1.0.0 | ANALYTICS-001 à ANALYTICS-009, SECURITY-001, UX-001 |
| ACCESS-001 | Rôles, capacités et habilitations privées d’AKS Platform | Socle implémenté et utilisé par Présences — extension transverse partiellement raccordée | 1.2.1 | ANALYTICS-SAISIE-001, INSCRIPTIONS-004, SECURITY-001, CONFIG-001, LOG-001, AUDIT-001, API-001 |
| ANALYTICS-SAISIE-002 | Contrat d’écriture des séances et présences | Implémentation et recette validées — publiée sur `main` | 1.1.2 | ANALYTICS-SAISIE-001, ACCESS-001, ANALYTICS-009, SECURITY-001, AUDIT-001, LOG-001, API-001, ERROR-001 |
| ANALYTICS-SAISIE-003 | Route et navigation mobile des présences | Publié sur `main` et validé en production | 1.1.0 | ANALYTICS-SAISIE-001, ANALYTICS-SAISIE-002, ACCESS-001, UX-001, API-001 |
| ANALYTICS-SAISIE-004 | Saisie rapide et brouillon reprenable | Publié sur `main` et validé en production | 1.1.0 | ANALYTICS-SAISIE-001 à ANALYTICS-SAISIE-003, ACCESS-001, UX-001, API-001 |
| ANALYTICS-SAISIE-005 | Clôture mobile sécurisée | Publié sur `main` et validé en production | 1.1.0 | ANALYTICS-SAISIE-001 à ANALYTICS-SAISIE-004, ACCESS-001, UX-001, API-001 |
| ANALYTICS-SAISIE-006 | Recette fonctionnelle mobile isolée | Recette validée et parcours mobile publié en production | 1.1.0 | ANALYTICS-SAISIE-001 à ANALYTICS-SAISIE-005, ACCESS-001, UX-001, API-001 |

### 9.3 Documents AKS Inscriptions

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| INSCRIPTIONS-001 | Cadrage fonctionnel d’AKS Inscriptions | Validé | 1.0.2 | ROADMAP-001, STD-001, SECURITY-001, STORAGE-001, NOTIF-001, ANALYTICS-001, ANALYTICS-SAISIE-001 |
| INSCRIPTIONS-002 | Modèle métier d’AKS Inscriptions | Validé | 1.0.2 | INSCRIPTIONS-001, ANALYTICS-002, SECURITY-001, STORAGE-001, LOG-001, AUDIT-001 |
| INSCRIPTIONS-003 | Services, transitions et reprise Google Forms | Validé | 1.0.1 | INSCRIPTIONS-001, INSCRIPTIONS-002, SECURITY-001, STORAGE-001, LOG-001, AUDIT-001, ERROR-001 |
| INSCRIPTIONS-004 | Interfaces et accès privés d’AKS Platform | Validé | 1.0.1 | INSCRIPTIONS-001 à INSCRIPTIONS-003, ACCESS-001, ADMIN-002, SECURITY-001, UI-001, UX-001 |
| INSCRIPTIONS-005 | Contrats techniques, stockage et intégrations | Validé | 1.0.1 | INSCRIPTIONS-001 à INSCRIPTIONS-004, CONFIG-001, ACCESS-001, STORAGE-001, LOG-001, AUDIT-001, ERROR-001 |
| INSCRIPTIONS-006 | Jeux d’essai et stratégie de recette cumulative | Validé | 1.0.1 | INSCRIPTIONS-001 à INSCRIPTIONS-005, ACCESS-001, CONFIG-001, LOG-001, AUDIT-001, SECURITY-001, ERROR-001 |
| INSCRIPTIONS-008 | Deuxième incrément : accès et audit sans écriture métier | Validé | 1.1.0 | INSCRIPTIONS-004 à INSCRIPTIONS-006, ACCESS-001, AUDIT-001, SECURITY-001, ERROR-001 |
| INSCRIPTIONS-009 | Troisième incrément : journal de commandes et reprise sans Google | Validé | 1.1.0 | INSCRIPTIONS-005, INSCRIPTIONS-006, INSCRIPTIONS-008, ACCESS-001, AUDIT-001, SECURITY-001, ERROR-001 |
| INSCRIPTIONS-010 | Quatrième incrément : persistance technique en recette contrôlée | Validé — implémentation, recette technique et intégration dans `develop` terminées | 1.1.1 | INSCRIPTIONS-005, INSCRIPTIONS-006, INSCRIPTIONS-008, INSCRIPTIONS-009, CONFIG-001, ACCESS-001, AUDIT-001, STORAGE-001, SECURITY-001, ERROR-001 |
| INSCRIPTIONS-010-RECETTE | Procès-verbal de recette de la persistance technique INSCRIPTIONS-010 | Validé | 1.1.0 | INSCRIPTIONS-010, AUDIT-001, CONFIG-001, AKS-Platform #89 |

Ordre produit validé après la publication de la V1.1 :

1. WEB-001 — point d’accès WordPress à AKS Platform ;
2. AKS Analytics ;
3. ANALYTICS-SAISIE — saisie des présences et contrôle d’accès ;
4. AKS Calendar ;
5. autres modules selon `ROADMAP-001`.

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

# 14. Matrice de couverture V1.3

| Domaine | Documents principaux | Couverture |
|---------|----------------------|------------|
| Vision et stratégie | VISION-001, OBJECTIVES-001, SCOPE-001, ROADMAP-001, GOV-001 | Complète |
| Gouvernance documentaire | GOV-DOC-001, GOV-DEV-001, DOC-001, STD-001, ADR-001 | Complète sous réserve de confirmation d'ADR-001 |
| Architecture générale | ARCH-001, CORE-001 | Complète |
| Services transverses | API-001, SECURITY-001, ERROR-001, NOTIF-001, DOCUMENT-001, STORAGE-001, UI-001 | Complète |
| Administration | ADMIN-001 à ADMIN-005, ACCESS-002, ACCESS-002-01, ACCESS-002-02, CONFIG-001, LOG-001, AUDIT-001, AUDIT-001-RECETTE | Socle validé — ACCESS-002 0.4.6 en réalisation ; ACCESS-002-01 1.0.0 clôturé ; retrait des droits implicites `ADMINISTRATEUR` validé en recette à 497/497, application et restauration non exécutées, registre inchangé |
| Expérience utilisateur | UX-001 | Complète |
| AKS Analytics | ANALYTICS-001 à ANALYTICS-009, V1.2.0 | Publié en V1.2.0 ; exploitation officielle conditionnée à des sources réelles exploitables |
| AKS Calendar | CALENDAR-001 à CALENDAR-004, V1.3.0 | Publié en V1.3.0 |
| AKS Inscriptions | INSCRIPTIONS-001 à INSCRIPTIONS-006, INSCRIPTIONS-008 à INSCRIPTIONS-010, INSCRIPTIONS-010-RECETTE | Quatrième incrément INSCRIPTIONS-010 clôturé et intégré dans `develop` par la PR #89 ; **455/455**, recette Google isolée concluante pour le périmètre exécuté ; ACCESS-002 est le prérequis transverse avant INSCRIPTIONS-011 |
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
| 1.3.8 | 2026-08-13 | Référencement d’ACCESS-002-03 0.1.0 et passage d’ACCESS-002 en 0.4.12 : liste/recherche/filtres, création inactive sans habilitation, cycle d’activation/désactivation et synthèse des accès proposés avant implémentation ; ROADMAP-001 1.2.99 alignée |
| 1.3.7 | 2026-08-13 | ACCESS-002-02 1.0.0 validé après campagne 507/507 et cycle réversible complet avec preuves persistantes, restaurations exactes d’ACCESS et d’AUDIT ; ACCESS-002 0.4.11 et ROADMAP-001 1.2.98 alignés sur le cadrage suivant d’ACCESS-002-03 |
| 1.3.6 | 2026-08-12 | ACCESS-002-02 0.11.0 et ACCESS-002 0.4.10 : campagne 502/502 validée, refus réel de l’audit confirmé et raccordement persistant réversible et récupérable après état partiel préparé ; ROADMAP-001 1.2.97 alignée |
| 1.3.5 | 2026-08-12 | ACCESS-002-02 0.10.0 et ACCESS-002 0.4.9 : 498/498 du corpus antérieur validés, omission de trois tests dans l’agrégateur consignée et garde structurel ajouté ; ROADMAP-001 1.2.96 alignée |
| 1.3.4 | 2026-08-12 | ACCESS-002-02 0.9.0 et ACCESS-002 0.4.8 : 498/498 réussis après synchronisation, faux positif du premier garde-fou documenté et second correctif de validation réelle de l’audit engagé ; ROADMAP-001 1.2.95 alignée |
| 1.3.3 | 2026-08-11 | ACCESS-002-02 0.8.0 et ACCESS-002 0.4.7 : échec d’audit avant écriture consigné, registre intact confirmé et garde-fou d’audit ajouté au précontrôle ; ROADMAP-001 1.2.94 alignée |
| 1.3.2 | 2026-08-09 | ACCESS-002-02 passé en 0.7.0 après synchronisation de 229 fichiers et validation réelle 497/497 de la tête corrigée `747c9a3` de la PR applicative #96 ; ACCESS-002 0.4.6 et ROADMAP-001 1.2.93 alignés, application et restauration non exécutées |
| 1.3.1 | 2026-08-09 | ACCESS-002-02 passé en 0.6.0 après blocage de la première tête 496/496 : correctif `7dacc7b` préparé pour rendre `ADMINISTRATEUR` strictement descriptif, suite portée à 497 tests uniques ; ACCESS-002 0.4.5 et ROADMAP-001 1.2.92 alignés, nouvelle recette Apps Script requise |
| 1.3.0 | 2026-08-09 | ACCESS-002-02 passé en 0.5.0 après synchronisation de 229 fichiers et validation réelle 496/496 de la tête `395de24` de la PR applicative #96 ; ACCESS-002 0.4.4 et ROADMAP-001 1.2.91 alignés, application et restauration non exécutées |
| 1.2.99 | 2026-08-09 | ACCESS-002-02 passé en 0.4.0 après précontrôle réussi sans écriture et confirmation de `ADMINISTRATEUR + ACCESS_MANAGE` ; ACCESS-002 0.4.3 et ROADMAP-001 1.2.90 alignés, application et restauration non exécutées |
| 1.2.98 | 2026-08-09 | ACCESS-002-02 passé en 0.3.0 après intégration du protocole réversible par la PR applicative #95 au commit `bbedf0a` et campagne isolée 495/495 ; ACCESS-002 0.4.2 et ROADMAP-001 1.2.89 alignés, sans exécution des fonctions de recette ni mutation réelle |
| 1.2.97 | 2026-08-09 | ACCESS-002-02 passé en 0.2.0 après intégration du prérequis applicatif #94 au commit `e800bdb` et campagne isolée 484/484 ; ACCESS-002 0.4.1 et ROADMAP-001 1.2.88 alignés sur la préparation de la recette réversible, sans mutation réelle |
| 1.2.96 | 2026-08-09 | Référencement d’ACCESS-002-02 0.1.0 et passage d’ACCESS-002 en 0.4.0 : habilitation transverse `ACCESS_MANAGE` proposée, recette réversible séparée de l’amorçage réel et ROADMAP-001 alignée en 1.2.87, sans mutation |
| 1.2.95 | 2026-08-09 | Clôture d’ACCESS-002-01 référencée après fusion de la PR applicative #93 dans `develop` au commit `91ba7e3` : ACCESS-002-01 1.0.0, ACCESS-002 0.3.6, AUDIT-001 1.3.4 et ROADMAP-001 1.2.86 |
| 1.2.94 | 2026-08-09 | Cohérence du catalogue Administration rétablie avec les versions documentaires courantes ACCESS-002 0.3.5, ACCESS-002-01 0.4.1 et AUDIT-001 1.3.3 ; synthèse alignée sur la campagne cumulative réelle 477/477 sans échec |
| 1.2.93 | 2026-08-09 | Recette Apps Script isolée d’ACCESS-002-01 référencée : ACCESS-002-01 passe en 0.4.1, ACCESS-002 en 0.3.5, AUDIT-001 en 1.3.3 et ROADMAP-001 en 1.2.85 ; tête `84ea68f`, 226 fichiers synchronisés et suite cumulative réelle 477/477 sans échec ; inventaire préparatoire 478 corrigé |
| 1.2.92 | 2026-08-09 | Cinquième lot ACCESS-002-01 documenté : ACCESS-002-01 passe en 0.4.0, ACCESS-002 en 0.3.4, AUDIT-001 en 1.3.2 et ROADMAP-001 en 1.2.84 ; verrou partagé et autorisation d’audit corrigés, validations locales 193/193, 19/19 et 46/46, suite cumulative préparée à 478 fonctions uniques sans nouvelle exécution Apps Script |
| 1.2.91 | 2026-08-09 | Quatrième lot ACCESS-002-01 documenté : ACCESS-002-01 passe en 0.3.0, ACCESS-002 en 0.3.3, AUDIT-001 en 1.3.1 et ROADMAP-001 en 1.2.83 ; preuves persistantes corrélées, refus/restaurations et catalogues ACCESS couverts localement à 19/19 et 9/9, référence cumulative maintenue à 455/455 |
| 1.2.90 | 2026-08-09 | Troisième lot ACCESS-002-01 documenté : ACCESS-002-01 passe en 0.2.0, ACCESS-002 en 0.3.2 et ROADMAP-001 en 1.2.82 ; écriture atomique et validations couvertes localement à 15/15 sans mutation réelle, référence cumulative maintenue à 455/455 |
| 1.2.89 | 2026-08-09 | Référencement d’ACCESS-002-01 0.1.0 et passage d’ACCESS-002 en 0.3.1 : deux premiers lots applicatifs documentés, ROADMAP-001 alignée en 1.2.81, référence cumulative réelle maintenue à 455/455 |
| 1.2.88 | 2026-08-09 | Alignement final d’ACCESS-002 sur la version 0.3.0 : cadrage et conception validés, UX, amorçage/migration et découpage en six incréments actés ; ROADMAP-001 référencée en 1.2.80 et chantier prêt pour réalisation |
| 1.2.87 | 2026-08-09 | Référencement d’ACCESS-002 0.1.0 comme cadrage de l’administration des utilisateurs et habilitations ; correction du statut réel d’ACCESS-001, déjà implémenté et utilisé par Présences mais encore partiellement raccordé aux autres espaces privés ; ACCESS-002 devient le prérequis transverse avant INSCRIPTIONS-011 et ROADMAP-001 passe en 1.2.79 |
| 1.2.86 | 2026-08-09 | Clôture documentaire d’INSCRIPTIONS-010 après fusion de la PR applicative #89 dans `develop` au commit `ed03cc428f8a8b055400b59aec7ba2e0a005629f` ; INSCRIPTIONS-010 1.1.1 et son PV 1.1.0 passent à l’état final validé, ROADMAP-001 alignée en 1.2.78, prochain incrément à cadrer séparément |
| 1.2.85 | 2026-08-09 | Référencement de la recette réelle INSCRIPTIONS-010 : tête applicative `0da406b`, 455/455 tests, schéma Google isolé et persistance séquence/commande validés, anomalie de typage Sheets détectée et corrigée ; ajout d’INSCRIPTIONS-010-RECETTE et maintien explicite des limites de concurrence/interruption non exécutées réellement |
| 1.2.84 | 2026-08-09 | Validation du premier socle persistant AUDIT-001 : PR applicative #90 testée sur `11e36134`, recette Google isolée concluante, deux preuves corrélées persistées, configuration restaurée, suite cumulative 423/423 ; référencement du PV AUDIT-001-RECETTE et levée du prérequis audit pour la suite d’INSCRIPTIONS-010 |
| 1.2.83 | 2026-08-08 | Précision d’AUDIT-001 après revue (identités serveur, catalogues initiaux, cellules canoniques et paramètres CONFIG-001) et correction du statut global du domaine Administration |
| 1.2.82 | 2026-08-08 | Proposition du cadrage persistant d’AUDIT-001 : port commun `AKS.Core.Audit`, support `AKS_Audit` distinct d’`AKS_Logs`, écriture verrouillée, relecture exacte, échec fermé, minimisation, corrélation et recette isolée, sans implémentation ni production |
| 1.2.81 | 2026-08-08 | Validation documentaire d’INSCRIPTIONS-010 1.0.1 et autorisation de son implémentation bornée ; référence maintenue à 380/380 et bilan 13/1/2 jusqu’aux futures preuves, sans donnée nominative, application de lot, production ni déploiement |
| 1.2.80 | 2026-08-03 | Référencement d’INSCRIPTIONS-010 : quatrième incrément proposé pour la persistance technique du journal et des séquences dans une recette Google isolée, avec garde d’environnement et audit commun, sans donnée nominative, application de lot ni déploiement |
| 1.2.79 | 2026-08-03 | Validation d’INSCRIPTIONS-009 : PR applicative #88 fusionnée, 20/20 tests ciblés et suite Apps Script 380/380, bilan des jeux d’or inchangé à 13 réussis, 1 partiel et 2 bloqués, sans adaptateur Google ni déploiement |
| 1.2.78 | 2026-08-03 | Référencement d’INSCRIPTIONS-009 : troisième incrément proposé pour le journal de commandes injectable, l’idempotence et la reprise après interruption sans API Google |
| 1.2.77 | 2026-08-02 | Validation d’INSCRIPTIONS-008 : PR applicative #87 fusionnée sur `develop`, 360/360 tests réussis, 13 jeux d’or réussis, 1 partiel et 2 bloqués, sans déploiement ni donnée Google réelle |
| 1.2.76 | 2026-08-02 | Ouverture d’INSCRIPTIONS-008 : deuxième incrément borné aux capacités Inscriptions d’ACCESS-001, à une matrice de périmètres fermée et à un cycle d’audit en deux temps sans écriture métier |
| 1.2.75 | 2026-08-02 | Validation d’INSCRIPTIONS-006 et du premier socle applicatif sans écriture : PR #85 fusionnée sur `develop`, 341/341 tests réussis, 12 jeux réussis, 2 partiels et 2 bloqués |
| 1.2.74 | 2026-08-02 | Validation d’INSCRIPTIONS-005 et référencement d’INSCRIPTIONS-006 : jeux d’or, niveaux de validation, recette isolée, concurrence, restauration et preuves cumulatives |
| 1.2.73 | 2026-08-02 | Validation d’INSCRIPTIONS-004 et référencement d’INSCRIPTIONS-005 : stockage privé, schéma, séquences, idempotence durable, audit fonctionnel et intégrations externes |
| 1.2.72 | 2026-08-02 | Correction du catalogue général AKS Inscriptions : référencement d’INSCRIPTIONS-001 à INSCRIPTIONS-004 et alignement de l’état sur la validation d’INSCRIPTIONS-003 |
| 1.2.71 | 2026-08-02 | Validation d’INSCRIPTIONS-003 et référencement d’INSCRIPTIONS-004 ; extension transverse d’ACCESS-001 pour Inscriptions, Analytics, Présences et administration privée |
| 1.2.70 | 2026-08-02 | Validation d’INSCRIPTIONS-002 et référencement d’INSCRIPTIONS-003 : services, transitions, adaptateurs versionnés et reprise contrôlée des trois Google Forms 2026–2027 |
| 1.2.69 | 2026-08-02 | Validation d’INSCRIPTIONS-001 et référencement d’INSCRIPTIONS-002 : modèle licencié, dossier saisonnier, états indépendants, imports Google Forms/SIKADA et écarts Analytics/Body Karaté |
| 1.2.68 | 2026-08-02 | Alignement d’INSCRIPTIONS-001 en version 1.0.1 : maintien transitoire des trois Google Forms et reprise complète, contrôlée, relançable et sans doublon de leurs réponses |
| 1.2.67 | 2026-08-02 | Ouverture du chantier AKS Inscriptions : création et référencement d’INSCRIPTIONS-001, alignement de ROADMAP-001 en version 1.2.61 et correction du statut publié de la V1.3.0 |
| 1.2.66 | 2026-08-01 | Préparation de la V1.3.0 : référencement de la note de publication AKS Calendar, alignement de la matrice de couverture et statut prêt à publier, sans fusion sur main ni création de tag |
| 1.2.65 | 2026-08-01 | CALENDAR-004 validé : page WordPress protégée, accès aux trois calendriers internes, recette de sécurité et menu Services en ligne validés ; clôture complète du socle AKS Calendar |
| 1.2.64 | 2026-07-31 | CALENDAR-003 validé : calendrier Public publié sur WordPress, affichages ordinateur et mobile, abonnements Google Agenda et iCal, menu Services en ligne et guide utilisateur validés ; socle AKS Calendar clôturé |
| 1.2.63 | 2026-07-31 | CALENDAR-002 validé : quatre calendriers configurés, droits internes et circuit Propositions vers Public testés, données temporaires supprimées et CALENDAR-003 autorisé |
| 1.2.62 | 2026-07-30 | Validation de CALENDAR-001 et autorisation de démarrer CALENDAR-002 |
| 1.2.61 | 2026-07-30 | Création de CALENDAR-001 : cadrage simplifié du socle Google Calendar, séparation des calendriers Public, Encadrement, Administration / Comité et Propositions, et report des mécanismes avancés |
| 1.2.60 | 2026-07-30 | Clôture complète du parcours Présences : guide utilisateur illustré publié, date de recette déplacée au 26/09/2026 et validée par 333/333 tests, statut terminé et AKS Calendar confirmé comme prochain chantier |
| 1.2.59 | 2026-07-29 | Clôture de la publication du parcours Présences : URL absolue de retour, séparation production/recette, harmonisation visuelle, 333/333 tests sur `main` et validation navigateur en production |
| 1.2.58 | 2026-07-29 | ANALYTICS-SAISIE-006 clôturé : parcours mobile complet brouillon, reprise, clôture et lecture seule validé sur la recette isolée ; restriction à la date réservée confirmée conforme |
| 1.2.57 | 2026-07-29 | Recette mobile : brouillon, reprise et clôture validés ; correctifs PR #64 et #65 validés par 333/333 ; dernier contrôle navigateur de lecture seule autorisé |
| 1.2.56 | 2026-07-29 | Validation Apps Script d’ANALYTICS-SAISIE-006 : suite cumulative 333/333 réussie, 0 échec ; déploiement Web de recette isolé autorisé |
| 1.2.55 | 2026-07-29 | ANALYTICS-SAISIE-006 intégré sur `develop` par la PR applicative #63, commit `0c78284c` ; route et composition de recette isolées, cible/date/identité verrouillées ; validation 333/333 requise avant déploiement de recette |
| 1.2.54 | 2026-07-28 | Validation Apps Script d’ANALYTICS-SAISIE-005 : suite cumulative 329/329 réussie, 0 échec ; correctif de test PR #62 confirmé ; recette mobile autorisée |
| 1.2.53 | 2026-07-28 | ANALYTICS-SAISIE-005 intégré sur `develop` par la PR applicative #61, commit `6c67719b` ; clôture mobile sécurisée et 4/4 tests ciblés réussis ; validation 329/329 requise |
| 1.2.52 | 2026-07-28 | Validation Apps Script d’ANALYTICS-SAISIE-004 : suite cumulative 325/325 réussie, 0 échec ; clôture mobile autorisée à poursuivre |
| 1.2.51 | 2026-07-28 | ANALYTICS-SAISIE-004 intégré sur `develop` par la PR applicatives #59 et #60, commit final `3a15d65e` ; saisie rapide, brouillon reprenable et séance clôturée en lecture seule et 4/4 tests ciblés réussis ; validation 325/325 requise |
| 1.2.50 | 2026-07-28 | Validation Apps Script d’ANALYTICS-SAISIE-003 : suite cumulative 321/321 réussie, 0 échec ; saisie rapide des statuts autorisée à poursuivre |
| 1.2.49 | 2026-07-28 | ANALYTICS-SAISIE-003 intégré sur `develop` par la PR applicative #58, commit `c7adbe52` ; route, cours autorisés et séances récentes ; 6/6 tests ciblés réussis, validation 321/321 requise |
| 1.2.48 | 2026-07-28 | Recette fonctionnelle serveur ACCESS-001 réussie sur la copie Analytics Baby : refus `ACCESS_DENIED`, identité serveur, un cours autorisé, séance clôturée en version 2 et deux présences enregistrées |
| 1.2.47 | 2026-07-28 | Validation Apps Script de l’exposition serveur ACCESS-001 : suite cumulative 315/315 réussie, 0 échec ; recette fonctionnelle autorisée à poursuivre |
| 1.2.46 | 2026-07-28 | Exposition serveur sécurisée ACCESS-001 intégrée par la PR applicative #53, commit `d67bc1c2` ; quatre tests ajoutés, validation Apps Script 315/315 requise |
| 1.2.45 | 2026-07-28 | Validation Apps Script du raccordement ACCESS-001 : suite cumulative 311/311 réussie, 0 échec ; exposition serveur autorisée à poursuivre |
| 1.2.44 | 2026-07-28 | Raccordement ACCESS-001 au catalogue Analytics et au service d’écriture par la PR applicative #52 ; 17/17 tests ciblés réussis, validation Apps Script requise |
| 1.2.43 | 2026-07-28 | Validation Apps Script du socle ACCESS-001 : suite cumulative 309/309 réussie, 0 échec ; raccordement fonctionnel restant à réaliser |
| 1.2.41 | 2026-07-28 | Clôture d’ANALYTICS-SAISIE-002 : 291/291 tests réussis, recette d’écriture conclue sur copie, correctif Europe/Paris validé et publication applicative sur `main` |
| 1.2.40 | 2026-07-28 | Référencement de la validation Apps Script d’ANALYTICS-SAISIE-002 : 290/290 tests réussis, 0 échec |
| 1.2.39 | 2026-07-28 | Référencement de l’implémentation d’ANALYTICS-SAISIE-002 sur `develop`, de ses tests locaux et de la recette Apps Script encore requise |
| 1.2.38 | 2026-07-28 | Validation d’ANALYTICS-SAISIE-002 et référencement du contrat d’écriture sécurisé comme référence de développement |
| 1.2.34 | 2026-07-28 | Engagement d’ANALYTICS-SAISIE avant Calendar, référencement d’ANALYTICS-008 et ROADMAP-001 |
| 1.2.33 | 2026-07-28 | Validation d’ANALYTICS-009 comme guide d’exploitation officiel de la V1.2.0 |
| 1.2.32 | 2026-07-28 | Référencement d’ANALYTICS-009, guide d’alimentation Google Sheets conforme à l’implémentation V1.2.0 et explicitation de l’écart avec la structure cible d’ANALYTICS-005 |
| 1.2.31 | 2026-07-28 | Clôture de la publication applicative V1.2.0 : PR #41 fusionnée, commit `47bb3ca8`, tag `v1.2.0`, et alignement de la note de version, de ROADMAP-001 et du README |
| 1.2.30 | 2026-07-28 | Préparation documentaire de la V1.2.0 dédiée à AKS Analytics, référencement de la note de publication et alignement de ROADMAP-001 et du README sans création de tag ni publication sur main |
| 1.2.29 | 2026-07-28 | Référencement d’ANALYTICS-008 et clôture documentaire de l’implémentation Analytics : périmètre saisonnier, diagnostic, six prévisualisations, publication Drive, recette 273/273 et restauration des sources officielles |
| 1.2.28 | 2026-07-26 | Référencement d’ANALYTICS-007, catalogue V1 des indicateurs : participation et assiduité activées, régularité, stabilité et fidélité non calculables, score AKS exclu |
| 1.2.27 | 2026-07-26 | Validation d’ANALYTICS-006 comme référence de développement, constat du corpus ANALYTICS-001 à 006 validé et clôture du cadrage préalable au développement applicatif |
| 1.2.26 | 2026-07-26 | Validation d’ANALYTICS-005 comme référence de développement et référencement d’ANALYTICS-006 pour la stratégie de validation, les jeux d’essai et la recette |
| 1.2.25 | 2026-07-26 | Validation d’ANALYTICS-004 comme référence de développement et référencement d’ANALYTICS-005 pour les contrats externes et formats des sources |
| 1.2.24 | 2026-07-26 | Validation d’ANALYTICS-003 comme référence de développement et référencement d’ANALYTICS-004 pour les interfaces et restitutions |
| 1.2.23 | 2026-07-26 | Validation d’ANALYTICS-002 comme référence de développement et référencement d’ANALYTICS-003 pour les services et l’orchestration |
| 1.2.22 | 2026-07-25 | Ouverture du cadrage AKS Analytics, référencement d’ANALYTICS-002 et exclusion méthodologique du cours féminin des calculs 2025-2026 |
| 1.2.21 | 2026-07-25 | Clôture de WEB-001 après validation du menu sur ordinateur et mobile, du Questionnaire santé, de l’administration autorisée et du refus d’un compte non autorisé ; AKS Analytics devient le prochain chantier |
| 1.2.20 | 2026-07-25 | Clôture documentaire de la publication V1.1.0, référencement du tag applicatif, des preuves de recette et de la note de release officielle |
| 1.2.19 | 2026-07-25 | Inscription de WEB-001 comme point d’accès WordPress planifié après la publication de la V1.1 et avant AKS Analytics, avec séparation des accès publics et administratifs |
| 1.2.18 | 2026-07-25 | Référencement et clôture documentaire du chantier ARCH-002 après validation des livrables M1.1 à M1.7, sans anticipation de l'architecture interne des futurs modules |
| 1.2.17 | 2026-07-25 | Clôture finale de UX-001 après harmonisation des dates, heures et niveaux d’événement entre Journaux et Centre de pilotage, conservation des valeurs techniques et validation de la suite Apps Script V1.1 (121/121 tests) |
| 1.2.16 | 2026-07-25 | Clôture du troisième incrément UX-001 après validation du nombre de résultats, de l’état filtré, de la réinitialisation des filtres, de l’état vide contextualisé et de la suite Apps Script V1.1 (118/118 tests) |
| 1.2.15 | 2026-07-25 | Clôture du deuxième incrément UX-001 après validation de la prévention des doubles actions, du verrouillage pendant traitement, des retours accessibles, des messages publics maîtrisés et de la suite Apps Script V1.1 (115/115 tests) |
| 1.2.14 | 2026-07-25 | Clôture du premier incrément UX-001 après validation des fondations administratives communes, de l'accessibilité clavier, des zones d'action, des états désactivés, de la réduction des animations et de la suite Apps Script V1.1 (111/111 tests) |
| 1.2.13 | 2026-07-25 | Clôture finale de LOG-001 après validation de la consultation administrative, de la carte « Journal récent », des filtres serveur, de la lecture seule et de la suite Apps Script V1.1 (106/106 tests) |
| 1.2.12 | 2026-07-25 | Clôture du troisième incrément LOG-001 après validation de la conservation à 90 jours, de la purge contrôlée par lots, de l'exclusion d'AUDIT-001 et de la suite Apps Script V1.1 (100/100 tests) |
| 1.2.11 | 2026-07-25 | Clôture du deuxième incrément LOG-001 après validation de la persistance durable dans `AKS_Logs`, du contrôle de schéma, des écritures verrouillées et de la suite Apps Script V1.1 (95/95 tests) |
| 1.2.10 | 2026-07-25 | Clôture du premier incrément LOG-001 après validation du socle d'événements structurés, de l'isolation d'une panne fournisseur et de la suite Apps Script V1.1 (88/88 tests) |
| 1.2.9 | 2026-07-25 | Clôture du troisième incrément CONFIG-001 après validation de l’interface d’administration, de ses corrections manuelles et de la suite Apps Script V1.1 (80/80 tests) |
| 1.2.8 | 2026-07-25 | Clôture du deuxième incrément CONFIG-001 après validation de la persistance, de l’écriture contrôlée et de la suite Apps Script V1.1 (72/72 tests) |
| 1.2.7 | 2026-07-25 | Clôture du premier incrément CONFIG-001 après validation du registre de configuration et de la suite Apps Script V1.1 (64/64 tests) |
| 1.2.5 | 2026-07-25 | Clôture d’ADMIN-002 après validation de l’interface utilisateur, de la navigation déclarative et de la suite Apps Script V1.1 (48/48 tests) |
| 1.2.4 | 2026-07-25 | Clôture d’ADMIN-003 après validation de la composition du Centre de pilotage et de la suite Apps Script V1.1 (40/40 tests) |
| 1.2.3 | 2026-07-24 | Clôture d’ADMIN-004 après validation de l’implémentation et de la suite Apps Script V1.1 (32/32 tests) |
| 1.2.2 | 2026-07-24 | Alignement des versions et statuts réels, clôture d’ADMIN-001 et synchronisation avec ROADMAP-001 |
| 1.2.1 | 2026-07-23 | Déplacement de STD-001 dans `project-book/documentation/` et alignement de l'organisation officielle du dépôt |
| 1.2.0 | 2026-07-23 | Intégration de DOC-001, STD-001, GOV-DOC-001 et GOV-DEV-001 dans le catalogue officiel et formalisation du standard applicable aux modules métier |
| 1.1.2 | 2026-07-23 | Ajout de la structure `modules/`, intégration d'AKS Analytics et mise à jour du domaine Administration |
| 1.1.1 | 2026-07-19 | Alignement de la version de ROADMAP-001 |
| 1.1.0 | 2026-07-19 | Création du catalogue officiel |

---

# 18. Conclusion

`INDEX-001` centralise l'organisation documentaire d'AKS Platform et facilite la navigation, la maintenance, les audits de cohérence et l'intégration progressive des modules métier.

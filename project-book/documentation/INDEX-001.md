# INDEX-001

# Catalogue du Project Book

| Propriété | Valeur |
|-----------|--------|
| Document ID | INDEX-001 |
| Titre | Catalogue du Project Book |
| Version | 1.3.90 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-09-02 |
| Version du produit | V1.4.1 déployée — ADMIN-006 bloquant multi-compte |

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
| ROADMAP-001 | Feuille de route officielle | Stratégie | Validé | 1.3.54 | Définit l'ordre et les priorités d'évolution |
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
| ADMIN-006 | Administration multi-compte et accès aux supports privés | D4-B conforme — revue avant décision de fusion | 0.33.0 | ACCESS-002, CONFIG-001, LOG-001, AUDIT-001-PRODUCTION, SECURITY-001 |
| ADMIN-006-01 | Inventaire des routes, identités et dépendances Google | Analyse terminée — option backend privé signé recommandée | 0.1.0 | ADMIN-006, Web Apps Apps Script, ACCESS-002, LOG-001, AUDIT-001-PRODUCTION |
| ADMIN-006-02 | Contrat du prototype LOG_READ avec backend privé signé | Contrat directeur validé — lot D détaillé dans ADMIN-006-08 | 0.6.0 | ADMIN-006, ADMIN-006-01, ACCESS-002, LOG-001, AUDIT-001 |
| ADMIN-006-03 | Implémentation des contrats purs AKS-PRIVATE/1 | Validé en RECETTE — intégré dans `develop` | 0.3.0 | ADMIN-006, ADMIN-006-01, ADMIN-006-02, AKS-Platform #140 |
| ADMIN-006-04 | Backend privé RECETTE et stockage anti-rejeu | Implémenté, validé en RECETTE et intégré dans `develop` | 0.3.0 | ADMIN-006, ADMIN-006-02, ADMIN-006-03, ACCESS-002, LOG-001, AUDIT-001 |
| ADMIN-006-05 | Implémentation B1 à B3 du backend privé RECETTE | Validé en RECETTE — intégré dans `develop` | 0.2.0 | ADMIN-006, ADMIN-006-02, ADMIN-006-03, ADMIN-006-04, AKS-Platform #141 |
| ADMIN-006-06 | Client portail privé et isolation du widget Journaux | Implémenté, validé et intégré dans `develop` | 0.3.0 | ADMIN-006, ADMIN-006-02, ADMIN-006-04, ADMIN-006-05, ACCESS-002, LOG-001 |
| ADMIN-006-07 | Résultat du lot C portail privé | Validé en RECETTE — intégré dans `develop` | 0.3.0 | ADMIN-006, ADMIN-006-02, ADMIN-006-06, AKS-Platform #142 |
| ADMIN-006-08 | Raccordement privé RECETTE et recette multi-compte LOG_READ | D4-B conforme — revue avant décision de fusion | 0.18.0 | ADMIN-006, ADMIN-006-02, ADMIN-006-06, ADMIN-006-14, ACCESS-002, LOG-001 |
| ADMIN-006-09 | Inventaire D0 des ressources RECETTE | D0 terminé — aucun backend existant admissible | 0.1.0 | ADMIN-006, ADMIN-006-08, ACCESS-002, LOG-001, AUDIT-001 |
| ADMIN-006-10 | Préparation D1 du backend privé et du support LOG RECETTE | D1 terminé — ressources créées, non raccordées | 0.1.0 | ADMIN-006, ADMIN-006-08, ADMIN-006-09, LOG-001 |
| ADMIN-006-11 | Précontrôle D2 et protocole du secret HMAC | Précontrôle terminé — inspecteur réversible requis | 0.1.0 | ADMIN-006, ADMIN-006-08, ADMIN-006-10, SECURITY-001 |
| ADMIN-006-13 | Précontrôle D3 du backend privé RECETTE | D3-D4 validé — backend inactif, D4 non engagé | 0.8.0 | ADMIN-006, ADMIN-006-08, ADMIN-006-10, ADMIN-006-12, SECURITY-001, LOG-001 |
| ADMIN-006-14 | Manifeste, version et premier déploiement du backend privé | D3-D4 validé — preuve technique, pas encore de recette multi-compte | 0.4.0 | ADMIN-006, ADMIN-006-08, ADMIN-006-12, ADMIN-006-13, SECURITY-001, LOG-001 |
| ACCESS-002 | Administration des utilisateurs et habilitations privées | V1.4.0 en production — correctif V1.4.1 publié et tagué dans Git, non déployé | 0.4.56 | ACCESS-001, ADMIN-001 à ADMIN-005, SECURITY-001, CONFIG-001, AUDIT-001 |
| ACCESS-002-01 | Socle d’administration des utilisateurs et habilitations | Validé — intégré dans `develop` par la PR #93 | 1.0.0 | ACCESS-002, ACCESS-001, SECURITY-001, AUDIT-001, AKS-Platform #93, `91ba7e3` |
| ACCESS-002-02 | Amorçage contrôlé et migration du premier gestionnaire ACCESS | Validé — recette réversible concluante | 1.0.0 | ACCESS-002, ACCESS-002-01, ACCESS-001, SECURITY-001, AUDIT-001, CONFIG-001, AKS-Platform #94 à #100, `a1181ed` |
| ACCESS-002-03 | Liste, recherche et cycle de vie des comptes d’accès | Validé — recette réversible concluante | 1.0.0 | ACCESS-002, ACCESS-002-01, ACCESS-002-02, ACCESS-001, SECURITY-001, AUDIT-001, AKS-Platform #101 à #104, `b120963` |
| ACCESS-002-04 | Fiche utilisateur, rôles multiples et habilitations explicites | Validé et clôturé | 1.0.0 | ACCESS-002, ACCESS-002-01 à ACCESS-002-03, ACCESS-001, SECURITY-001, AUDIT-001 |
| ACCESS-002-05 | Portail privé personnalisé et consultation de ses accès | Clôturé — recette multi-profils conforme | 1.0.0 | ACCESS-002, ACCESS-002-04, ACCESS-001, SECURITY-001 |
| ACCESS-002-06 | Migration définitive des modules vers les capacités ACCESS | Intégré, publié et validé en production dans V1.4.0 | 0.7.1 | ACCESS-002, ACCESS-002-05, CONFIG-001, LOG-001, AUDIT-001 |
| ACCESS-002-07 | Attribution des habilitations Configuration et Journaux | V1.4.1 publiée et taguée dans Git — déploiement en attente | 0.3.6 | ACCESS-002, ACCESS-002-06, CONFIG-001, LOG-001, AUDIT-001 |
| ACCESS-002-PRODUCTION | Publication, déploiement et amorçage d’ACCESS en production | P1 à P10 clôturés — production V1.4.0 confirmée | 1.2.15 | ACCESS-002, ACCESS-002-06, AUDIT-001, AUDIT-001-PRODUCTION, ACCESS-002-PRODUCTION-P2 à P10, RELEASE-001, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P2 | Candidate et Quality Gate ACCESS | P2 clôturé sur `develop` — candidate validée en recette, production interdite | 1.0.0 | ACCESS-002-PRODUCTION, RELEASE-001, AUDIT-001-PRODUCTION, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P3 | Inventaire de production en lecture seule | Inventaire et rapprochement clôturés — production inchangée | 1.0.0 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P2, RELEASE-001, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P4 | Quality Gate final de la candidate ACCESS | Clôturé — P4-G validé sur RC5 | 0.4.0 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P3, RELEASE-001, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P4-G | Rapport final du Quality Gate ACCESS | Validé — Quality Gate P4 concluant | 0.2.0 | ACCESS-002-PRODUCTION-P4, RELEASE-001, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P5 | Finalisation stable et publication Git contrôlée de V1.4.0 | Clôturé — snapshots publiés et tagués, têtes post-release distinguées | 1.0.1 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P4-G, RELEASE-001, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P6 | Préparation et déploiement Apps Script contrôlé | Clôturé — déploiement version 54 et vérifications P6-H concluantes | 0.4.0 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P3, ACCESS-002-PRODUCTION-P5, AUDIT-001-PRODUCTION, ROADMAP-001 |
| ACCESS-002-PRODUCTION-P7 | Activation contrôlée d’AUDIT en production | Clôturé — P7-A à P7-F conformes, P8 à P10 clôturés ultérieurement | 1.0.1 | ACCESS-002-PRODUCTION, AUDIT-001-PRODUCTION, CONFIG-001, SECURITY-001, STORAGE-001 |
| ACCESS-002-PRODUCTION-P8 | Amorçage minimal du premier gestionnaire ACCESS | Clôturé — P8-A à P8-D conformes, P9 clôturé ultérieurement | 1.0.1 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P7, ACCESS-002-PRODUCTION-P9, AUDIT-001-PRODUCTION, ACCESS-002-02, SECURITY-001 |
| ACCESS-002-PRODUCTION-P9 | Validation fonctionnelle et deuxième gestionnaire ACCESS | Clôturé — P9-A à P9-E conformes, P10 clôturé ultérieurement | 1.0.1 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P8, ACCESS-002-PRODUCTION-P10, AUDIT-001-PRODUCTION, SECURITY-001 |
| ACCESS-002-PRODUCTION-P10 | Confirmation finale de production ou retour arrière | Clôturé — production V1.4.0 confirmée, aucun retour arrière autorisé | 1.0.0 | ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P9, AUDIT-001-PRODUCTION, RELEASE-001, ROADMAP-001 |
| AUDIT-001-PRODUCTION | Extension contrôlée d’AUDIT-001 à la production | Activé et confirmé en production — support privé stable à cinq preuves | 1.0.4 | AUDIT-001, ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P7 à P10, CONFIG-001, SECURITY-001, STORAGE-001 |
| ACCESS-002-06-RECOVERY | Procédure de récupération exceptionnelle | Validé par recette réversible — récupération réelle non exécutée | 1.0.0 | ACCESS-002-06, AUDIT-001, CONFIG-001 |
| CONFIG-001 | Paramétrage centralisé | Validé | 1.2.3 | CORE-001, ADMIN-001 |
| LOG-001 | Journalisation | Validé | 1.2.5 | CORE-001, AUDIT-001 |
| AUDIT-001 | Audit et traçabilité — socle persistant étendu aux opérations ACCESS | Extension multi-environnement intégrée et validée en recette — production non configurée | 1.4.1 | SECURITY-001, LOG-001, CORE-001, STORAGE-001, ERROR-001, ACCESS-002-01, AUDIT-001-PRODUCTION |
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
| AKS Inscriptions | `project-book/modules/inscriptions/` | `INSCRIPTIONS-001` à `INSCRIPTIONS-006`, `INSCRIPTIONS-008` à `INSCRIPTIONS-010`, `INSCRIPTIONS-010-RECETTE` | Quatrième incrément INSCRIPTIONS-010 clôturé et fusionné dans `develop` par la PR #89 au commit `ed03cc4…` ; **455/455 tests**, recette Google isolée concluante ; prérequis ACCESS-002 satisfait par P10 ; cadrage en lecture seule d’INSCRIPTIONS-011 autorisé séparément le 26 août 2026, limité à l’analyse et à la préparation d’une proposition, sans implémentation ni mutation |
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
| Administration | ADMIN-001 à ADMIN-005, ACCESS-002, ACCESS-002-01 à ACCESS-002-07, ACCESS-002-PRODUCTION, ACCESS-002-PRODUCTION-P2 à P10, CONFIG-001, LOG-001, AUDIT-001, AUDIT-001-RECETTE, AUDIT-001-PRODUCTION | ACCESS publié, déployé, amorcé et validé en production ; P10 clôturé sans retour arrière ; correctif ACCESS-002-07 intégré dans les deux `develop` par les PR #135 et #194 après validation **15/15** et **665/665** et restauration exacte de la recette ; candidate V1.4.1 `60cc727e` validée à **8/8**, **15/15** et **665/665**, puis recette restaurée exactement ; publication applicative #137 fusionnée dans `main` au commit `7e5125e7` et publication documentaire #197 fusionnée dans `main` au commit `5f9f6623` ; tags légers `v1.4.1` créés et vérifiés sur `7e5125e7` pour l’application et `5f9f6623` pour le Project Book, déploiement et production en attente |
| Expérience utilisateur | UX-001 | Complète |
| AKS Analytics | ANALYTICS-001 à ANALYTICS-009, V1.2.0 | Publié en V1.2.0 ; exploitation officielle conditionnée à des sources réelles exploitables |
| AKS Calendar | CALENDAR-001 à CALENDAR-004, V1.3.0 | Publié en V1.3.0 |
| AKS Inscriptions | INSCRIPTIONS-001 à INSCRIPTIONS-006, INSCRIPTIONS-008 à INSCRIPTIONS-010, INSCRIPTIONS-010-RECETTE | Quatrième incrément INSCRIPTIONS-010 clôturé et intégré dans `develop` par la PR #89 ; **455/455**, recette Google isolée concluante ; prérequis ACCESS-002 satisfait ; cadrage en lecture seule d’INSCRIPTIONS-011 autorisé séparément, proposition à préparer, sans implémentation autorisée |
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
| 1.3.90 | 2026-09-02 | ADMIN-006 0.33.0 et ADMIN-006-08 0.18.0 : D4-B conforme, 761/761 et restauration/propriétés confirmées ; revue avant décision de fusion, D4-C/D5 non engagés |
| 1.3.89 | 2026-09-02 | ADMIN-006 0.32.1 et ADMIN-006-08 0.17.1 : contrôle Windows B1-C2 conforme, autorisation distincte de test/restauration reçue, résultats Google attendus |
| 1.3.88 | 2026-09-02 | ADMIN-006 0.32.0 et ADMIN-006-08 0.17.0 : précontrôle C2 conforme ; B1-C2 préparé, 25/25 tests locaux et contrôle Windows requis, aucune autorisation d'exécution |
| 1.3.87 | 2026-09-02 | ADMIN-006 0.31.1 et ADMIN-006-08 0.16.1 : contrôle Windows C2-readonly-r1 conforme à 20/20 sans Google ; précontrôle distant lecture seule à exécuter, aucun nouveau B1 |
| 1.3.86 | 2026-09-01 | ADMIN-006 0.31.0 et ADMIN-006-08 0.16.0 : reconstruction C2 rapportée conforme, lecture seule autorisée et outillage préparé ; 20 tests Windows non encore exécutés, aucun nouveau B1 |
| 1.3.85 | 2026-09-01 | ADMIN-006 0.30.0 et ADMIN-006-08 0.15.0 : reconstruction locale C2 préparée (17/17), sans Google ; contrôle Windows et empreintes adaptées attendus |
| 1.3.84 | 2026-09-01 | ADMIN-006 0.29.0 et ADMIN-006-08 0.14.0 : B1 échoué puis restauré selon le rapport ; correction des tests/harnais c39cded9 et six scénarios locaux conformes, nouveau B1 non autorisé |
| 1.3.83 | 2026-09-01 | ADMIN-006 0.28.1 et ADMIN-006-08 0.13.1 : contrôle local Windows B1 conforme et autorisation distincte d'exécution/restauration ; résultats Google attendus, aucune fusion |
| 1.3.82 | 2026-09-01 | ADMIN-006 0.28.0 et ADMIN-006-08 0.13.0 : B0 conforme, diff expliqué et propriétés confirmées ; outillage B1-r1 testé localement, contrôle Windows requis et exécution non autorisée |
| 1.3.81 | 2026-09-01 | ADMIN-006 0.27.2 et ADMIN-006-08 0.12.2 : contrôle Windows B0-r2 rapporté conforme, 14/14 et LOCAL_CHECK_ONLY ; lecture Google non exécutée |
| 1.3.80 | 2026-09-01 | ADMIN-006 0.27.1 et ADMIN-006-08 0.12.1 : B0-r2 adapté à clasp 3.3.0, 14/14 tests Node, aucun changement des outils du poste ni opération Google |
| 1.3.79 | 2026-09-01 | ADMIN-006 0.27.0 et ADMIN-006-08 0.12.0 : outillage B0-r1 référencé, 13/13 tests Node, contrôle Windows et lectures Google non exécutés |
| 1.3.78 | 2026-09-01 | ADMIN-006 0.26.0 et ADMIN-006-08 0.11.0 : revue D4-A, contrôles locaux complémentaires et protocole D4-B préparé ; package complet 277 fichiers, B0/B1 distincts, aucune opération Google |
| 1.3.77 | 2026-09-01 | ADMIN-006 0.25.0 et ADMIN-006-08 0.10.0 : résultat D4-A, PR applicative #145, 761/761 tests locaux et 8/8 client simulé ; D4-B et navigateur requis, aucune opération Google |
| 1.3.76 | 2026-09-01 | ADMIN-006-08 0.9.1 : limite aux 500 dernières lignes, absence d'exhaustivité historique, affichage et tests prévus précisés dans #224 ; aucune modification du backend ni de la validation D3-D4 |
| 1.3.75 | 2026-09-01 | ADMIN-006 0.24.0 et ADMIN-006-08 0.9.0 : précontrôle et plan D4 proposés, préparation applicative inactive requise ; aucune opération Google |
| 1.3.74 | 2026-09-01 | Référencement d’ADMIN-006-13 0.8.0 et ADMIN-006-14 0.4.0 : D3-D4 validé selon le rapport transmis, backend inactif, code et propriétés restaurés ; D4 et recette fonctionnelle multi-compte non engagés |
| 1.3.73 | 2026-08-30 | ADMIN-006-11 : précontrôle D2 terminé, propriétés non observables sans inspecteur contrôlé, protocole HMAC réversible préparé sans secret |
| 1.3.72 | 2026-08-30 | ADMIN-006-10 : D1 terminé, backend privé vide et support LOG dédié créés, propriétaires et permissions contrôlés sans partage ni raccordement |
| 1.3.71 | 2026-08-30 | ADMIN-006-09 : D0 terminé en lecture seule ; POC, Services et supports LOG multifonctions refusés, ressources dédiées recommandées |
| 1.3.70 | 2026-08-30 | ADMIN-006-08 : raccordement backend privé, secret HMAC, anti-rejeu, preuves et recette multi-compte cadrés sans opération Google |
| 1.3.69 | 2026-08-30 | ADMIN-006 lot C intégré dans `develop` par la PR applicative #142 au commit `d8ca2840659cad6b467772f2563ac61a834d6ada` |
| 1.3.68 | 2026-08-30 | ADMIN-006-07 : C1 à C3 validés à 15/15 puis 716/716 en RECETTE avec restauration exacte ; fusion applicative attendue |
| 1.3.67 | 2026-08-30 | ADMIN-006-06 : cadrage détaillé du lot C client portail, contrôle LOG_READ et isolation du widget Journaux, sans implémentation ni opération Google |
| 1.3.66 | 2026-08-29 | ADMIN-006 lot B intégré dans `develop` par la PR applicative #141 au commit `c064f0f027e3e8d6e3087ba71930866588a95d05` |
| 1.3.65 | 2026-08-29 | ADMIN-006-05 : lot B validé à 18/18 localement et 701/701 en RECETTE avec restauration exacte ; fusion applicative attendue |
| 1.3.64 | 2026-08-29 | ADMIN-006-04 : cadrage détaillé du lot B backend RECETTE et stockage anti-rejeu, sans implémentation ni opération Google |
| 1.3.63 | 2026-08-29 | ADMIN-006 lot A intégré dans `develop` par la PR applicative #140 au commit `ea38f0759ec4b26ce73e112738075f3b501799da` |
| 1.3.62 | 2026-08-29 | ADMIN-006-03 : validation réversible du lot A en RECETTE à 683/683, relecture candidate conforme et restauration exacte sans modification de déploiement |
| 1.3.61 | 2026-08-28 | ADMIN-006-03 : lot A AKS-PRIVATE/1 implémenté dans la PR applicative #140, 18/18 tests isolés réussis et aucune opération Google |
| 1.3.60 | 2026-08-28 | ADMIN-006-02 : plan du prototype LOG_READ privé en RECETTE, protocole HMAC, anti-rejeu, résilience, tests et retour arrière cadrés sans implémentation |
| 1.3.59 | 2026-08-28 | ADMIN-006-01 : inventaire des routes, identités et supports privés terminé ; option portail utilisateur et backend privé signé recommandée pour prototype LOG en RECETTE, sans implémentation ni production |
| 1.3.58 | 2026-08-28 | Création d’ADMIN-006 après reproduction du blocage de l’habilitation Configuration et Journaux sur un compte secondaire en production ; V1.4.1 maintenue, habilitation retirée, futurs modules privés suspendus |
| 1.3.57 | 2026-08-27 | Tags légers `v1.4.1` créés et vérifiés : application `7e5125e7`, Project Book `5f9f6623` ; production inchangée, INSCRIPTIONS-011 non engagé |
| 1.3.56 | 2026-08-27 | PR Project Book de publication #197 fusionnée dans `main` au commit `5f9f6623` ; V1.4.1 publiée dans les deux dépôts, tags et production inchangés, INSCRIPTIONS-011 non engagé |
| 1.3.55 | 2026-08-27 | PR applicative de publication #137 fusionnée dans `main` au commit `7e5125e7` ; PR Project Book #197 ouverte sans fusion, tag et production inchangés, INSCRIPTIONS-011 non engagé |
| 1.3.54 | 2026-08-27 | PR Project Book #195 fusionnée dans `develop` au commit `0b428b76` ; V1.4.1 intégrée dans les deux `develop`, sans `main`, tag, production ni engagement d’INSCRIPTIONS-011 |
| 1.3.53 | 2026-08-27 | PR applicative V1.4.1 #136 fusionnée dans `develop` au commit `62c859a7`, contenu identique à la branche validée ; PR Project Book #195 maintenue ouverte sans fusion, `main`, tags et production inchangés |
| 1.3.52 | 2026-08-27 | Candidate finale V1.4.1 `60cc727e` relue à 261/261 sans différence, validée à **8/8**, **15/15** et **665/665**, puis recette restaurée à 261/261 sans différence ; deux déploiements de recette préservés, production absente et PR maintenues sans fusion |
| 1.3.51 | 2026-08-27 | Préparation documentaire de V1.4.1 : ACCESS-002-07 intégré dans les deux `develop`, note corrective créée, métadonnées de publication cadrées ; aucune fusion vers `main`, aucun tag, aucun déploiement et aucune implémentation d’INSCRIPTIONS-011 |
| 1.3.50 | 2026-08-27 | Référencement d’ACCESS-002-07 0.2.0 : PR applicative #135 fusionnée dans `develop` au commit `6d7815a`, PR Project Book #194 maintenue ouverte ; `main`, production et implémentation d’INSCRIPTIONS-011 inchangés |
| 1.3.49 | 2026-08-27 | Référencement d’ACCESS-002-07 0.1.1 : candidate `c2efda48` synchronisée et relue à 261/261 sans différence, validations Apps Script **15/15** et **665/665** sans échec, puis recette restaurée et relue à 261/261 sans différence ; PR en revue, sans fusion ni production |
| 1.3.48 | 2026-08-26 | Référencement d’ACCESS-002-07 0.1.0 : exposition contrôlée du module ADMINISTRATION dans la fiche et le filtre, sans fusion ni production ; cadrage en lecture seule d’INSCRIPTIONS-011 autorisé séparément, non élargi et sans implémentation engagée |
| 1.3.47 | 2026-08-26 | Alignement postérieur de P7 1.0.1 : P8 à P10 clôturés, support AUDIT privé stable à cinq preuves et production V1.4.0 confirmée sans retour arrière |
| 1.3.46 | 2026-08-26 | Référencement de P10 1.0.0 : précontrôle final conforme, neuf déploiements confirmés, `wgNc37` unique en version 54, AUDIT privé inchangé à cinq preuves, production V1.4.0 confirmée et aucun retour arrière autorisé |
| 1.3.45 | 2026-08-26 | Référencement de P9 1.0.0 : deuxième gestionnaire ajouté, révision `dlkpc9`, preuves corrélées par `c9e6d7`, validation multi-compte et support privé à cinq preuves conformes ; P10 non autorisé |
| 1.3.44 | 2026-08-26 | P8 clôturé : registre `access/1.2` amorcé pour le premier gestionnaire, révision persistée `nshtnj`, preuves `INTENTION` et `REUSSI` corrélées par `4d3bb3`, support privé à trois preuves et déploiement public toujours en version 54 ; P9 non autorisé |
| 1.3.43 | 2026-08-26 | Référencement d’ACCESS-002-PRODUCTION-P8 0.1.0 : P8-A et P8-B clôturés sans écriture, registre initial absent, premier gestionnaire confirmé, prévisualisation minimale et support AUDIT toujours à une preuve ; P8-C non autorisé |
| 1.3.42 | 2026-08-25 | P7-F et P7 clôturés : relecture directe d’une preuve unique, précontrôle final `rowCount: 1`, `writePerformed: false` et permissions privées conformes ; AUDIT activé, P8 non autorisé |
| 1.3.41 | 2026-08-25 | P7-E clôturé : preuve contrôlée `AUDIT_SUPPORT_TEST` créée et relue exactement, `businessOperation: false`, suffixes `ac6e57` et `895d54` ; fichier temporaire supprimé, P7-F non autorisé |
| 1.3.40 | 2026-08-25 | P7-D clôturé : précontrôle réussi pour `6x2ZeH` et `GyeQH4`, support privé vide, permissions compatibles, acteur technique présent et `writePerformed: false` ; P7-E non autorisé |
| 1.3.39 | 2026-08-25 | P7-C clôturé : cinq paramètres techniques installés et relus exactement pour le projet `6x2ZeH` et le support `GyeQH4`, avec rétention 1 095 jours et schéma `aks-audit/1.0` ; aucune écriture d’audit, fonction temporaire supprimée, P7-D non autorisé |
| 1.3.38 | 2026-08-25 | P7-B clôturé : support AUDIT privé créé et relu conforme sur l’onglet, les seize en-têtes, l’absence de lignes, les permissions et le fuseau `Europe/Paris` ; aucune configuration Apps Script ni preuve, P7-C non autorisé |
| 1.3.37 | 2026-08-25 | Référencement d’ACCESS-002-PRODUCTION-P7 0.1.0 : P7-A clôturé en lecture seule, aucun support exact accessible identifié et précontrôle fermé sur la configuration indisponible ; aucune ressource ou preuve créée, P7-B non autorisé |
| 1.3.36 | 2026-08-24 | P6 clôturé : déploiement public existant passé en version 54 avec identifiant et URL préservés ; Questionnaire public, portail, Paramétrage et Journaux vérifiés sans mutation ; P7 devient le prochain jalon |
| 1.3.35 | 2026-08-24 | P6-F clôturé : version Apps Script 54 créée puis relue à 261/261 sans différence ; déploiement public maintenu en version 53, P6-G non autorisé |
| 1.3.34 | 2026-08-24 | P6-E clôturé : 261 fichiers poussés vers le HEAD de production, relus à 261/261 et comparés sans différence sous PowerShell 5.1 ; déploiement public maintenu en version 53, P6-F non autorisé |
| 1.3.33 | 2026-08-24 | Référencement d’ACCESS-002-PRODUCTION-P6 0.1.0 : P6-A à P6-D validés localement, sauvegardes et paquet corrigé vérifiés, barrière canonique 54/30/0 ; aucune écriture de production autorisée |
| 1.3.32 | 2026-08-24 | Clarification post-release V1.4.0 : snapshots tagués `fa8876f` et `7cfa3ce` distingués des têtes `main`; application `main@7a6b70a` après la PR #134, production inchangée |
| 1.3.31 | 2026-08-24 | P5 clôturé : application `main@fa8876f`, Project Book `main@7cfa3ce` et tags légers `v1.4.0` vérifiés dans les deux dépôts ; P6 et production non engagés |
| 1.3.30 | 2026-08-24 | P5-D clôturé : PR applicative #132 fusionnée dans `main` au commit `fa8876f`, contenu identique à `develop`, V1.4.0 et build `20260824.1` confirmés ; P5-E engagé, tags et production inchangés |
| 1.3.29 | 2026-08-24 | P5-A à P5-C clôturés : version stable `1.4.0` build `20260824.1` validée en RECETTE à 8/8 et 665/665, puis intégrée dans `develop` à `32a511a`; P5-D et production non engagés |
| 1.3.28 | 2026-08-24 | Référencement du Quality Gate P4 clôturé et du cadrage P5 validé : finalisation stable, publications complètes vers `main` et tags cohérents, sans exécution P5 ni production |
| 1.3.27 | 2026-08-21 | P3 renforcé : HEAD Apps Script et version réellement déployée sauvegardés séparément ; archive durable horodatée, relue et vérifiée par SHA-256 avant toute suite |
| 1.3.26 | 2026-08-21 | P2 clôturé sur `develop` ; référencement d’ACCESS-002-PRODUCTION-P3 0.1.0 et cadrage I1 à I12 de l’inventaire en lecture seule, sans accès réel à la production |
| 1.3.25 | 2026-08-21 | Note V1.4.0 candidate non publiée ajoutée et checklist P2 renseignée ; statuts bornés à une clôture documentaire encore en revue |
| 1.3.24 | 2026-08-21 | Candidate `1.4.0-rc.1` intégrée par la PR applicative #126 au commit `b13fc20` et validée sur sa tête exacte à **8/8** VERSION-001 et **661/661** cumulés, sans opération de production |
| 1.3.23 | 2026-08-21 | Référencement d’ACCESS-002-PRODUCTION-P2 0.1.0 et passage d’ACCESS-002-PRODUCTION en 0.4.0 : candidate `1.4.0-rc.1`, écart complet, synchronisation des versions et Quality Gate transverse, sans publication ni opération réelle |
| 1.3.22 | 2026-08-21 | P1 AUDIT de production intégré par la PR applicative #125 au commit `ab52dc6` ; AUDIT-001-PRODUCTION 0.2.0, ACCESS-002-PRODUCTION 0.3.0 et AUDIT-001 1.4.1 alignés après validations **62/62** et **660/660**, sans opération réelle |
| 1.3.21 | 2026-08-20 | Référencement d’AUDIT-001-PRODUCTION 0.1.0 et consolidation d’ACCESS-002-PRODUCTION 0.2.0 : P1.1 à P1.12, conservation 1 095 jours, aucune opération réelle autorisée |
| 1.3.20 | 2026-08-20 | Statut ACCESS rectifié : six lots intégrés et recettés mais non publiés ; ajout d’ACCESS-002-PRODUCTION comme jalon prioritaire avant INSCRIPTIONS-011 |
| 1.3.18 | 2026-08-13 | Référencement d’ACCESS-002-04 0.1.0 et passage d’ACCESS-002 en 0.4.22 : fiche, multi-rôle, quatre cartes d’habilitations, temporalité, synthèse, audit et évolution compatible `access/1.1` cadrés ; ROADMAP-001 1.3.9 alignée, sans implémentation ni donnée réelle |
| 1.3.17 | 2026-08-13 | ACCESS-002-03 clôturé en 1.0.0 après synchronisation de 240 fichiers, campagne 542/542 et recette réversible complète avec restaurations exactes d’ACCESS et d’AUDIT ; ACCESS-002 0.4.21 et ROADMAP-001 1.3.8 alignées |
| 1.3.16 | 2026-08-13 | ACCESS-002-03 0.9.0 et ACCESS-002 0.4.20 : protocole réversible du lot 4 publié dans la PR applicative brouillon #104, 5/5 tests ciblés, syntaxe 204/204 et suite préparée à 542 références ; ROADMAP-001 1.3.7 alignée, sans Apps Script ni mutation réelle |
| 1.3.15 | 2026-08-13 | ACCESS-002-03 0.8.0 validé après intégration de la PR #103 au commit `846e666`, synchronisation de 238 fichiers, campagne 537/537, contrôle visuel autorisé et refus direct non habilité ; ACCESS-002 0.4.19 et ROADMAP-001 1.3.6 alignées, sans mutation de registre |
| 1.3.14 | 2026-08-13 | ACCESS-002-03 0.7.0 et ACCESS-002 0.4.18 : lot 3 publié dans la PR applicative brouillon #103, route et interface protégées, navigation conditionnelle et états interactifs ; tests ciblés 5/5, syntaxe 202/202 et suite cumulative préparée à 537 références uniques, sans Apps Script ni mutation réelle |
| 1.3.13 | 2026-08-13 | ACCESS-002-03 0.6.0 validé après intégration de la PR #102 au commit `066aebb`, synchronisation de 233 fichiers et campagne Apps Script 532/532 ; ACCESS-002 0.4.17 et ROADMAP-001 1.3.4 alignées, sans commande de cycle de vie ni mutation de registre |
| 1.3.12 | 2026-08-13 | ACCESS-002-03 0.5.0 et ACCESS-002 0.4.16 : lot 2 corrigé après revue dans la PR applicative brouillon #102, refus métier audités, révision idempotente contrôlée, cycle de vie 13/13, socle ACCESS 20/20 et inventaire cumulatif préparé à 532 références uniques ; ROADMAP-001 1.3.3 alignée, sans Apps Script ni donnée réelle |
| 1.3.11 | 2026-08-13 | ACCESS-002-03 0.4.0 validé après intégration de la PR #101 au commit `b41787d`, synchronisation de 231 fichiers et campagne Apps Script 518/518 ; ACCESS-002 0.4.15 et ROADMAP-001 1.3.2 alignées, sans mutation de registre ni donnée réelle |
| 1.3.10 | 2026-08-13 | ACCESS-002-03 0.3.0 engagé par la PR applicative brouillon #101 : projection corrigée pour dériver les modules des capacités effectives, tests ciblés 11/11, syntaxe 198/198 et inventaire cumulatif préparé à 518 références uniques ; ACCESS-002 0.4.14 et ROADMAP-001 1.3.1 alignées, sans recette Apps Script ni donnée réelle |
| 1.3.9 | 2026-08-13 | Validation d’ACCESS-002-03 0.2.0 et passage d’ACCESS-002 en 0.4.13 : sept décisions de cadrage approuvées, implémentation maintenue non engagée avant intégration ; ROADMAP-001 1.3.0 alignée |
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

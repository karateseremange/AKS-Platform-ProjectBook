# INDEX-001

# Catalogue du Project Book

| Propriété | Valeur |
|-----------|--------|
| Document ID | INDEX-001 |
| Titre | Catalogue du Project Book |
| Version | 1.2.47 |
| Statut | Validé |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-28 |
| Version du produit | V1.2 |

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
| ROADMAP-001 | Feuille de route officielle | Stratégie | Validé | 1.2.41 | Définit l'ordre et les priorités d'évolution |
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
| CONFIG-001 | Paramétrage centralisé | Validé | 1.2.3 | CORE-001, ADMIN-001 |
| LOG-001 | Journalisation | Validé | 1.2.5 | CORE-001, AUDIT-001 |
| AUDIT-001 | Audit et traçabilité | Validé | 1.1.1 | SECURITY-001, LOG-001 |

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
| AKS Analytics | `project-book/modules/analytics/` | `ANALYTICS-001` à `ANALYTICS-009`, `ANALYTICS-SAISIE-001`, `ACCESS-001`, `ANALYTICS-SAISIE-002` | V1.2.0 publiée — contrat d’écriture des présences publié |
| AKS Calendar | `project-book/modules/calendar/` | À créer | Planifié |
| Questionnaire Santé | À structurer dans le Project Book | À consolider | Livré en V1.0.0 |
| Grades | À créer | À créer | Futur |
| Présences | Extension d’AKS Analytics | `ANALYTICS-SAISIE-001` | Contrat d’écriture publié ; interface à poursuivre |
| Licenciés | À créer | À créer | Futur |
| Communication | À créer | À créer | Futur |

### 9.1 Documents AKS Analytics

| ID | Titre | Statut | Version | Dépendances principales |
|----|-------|--------|---------|-------------------------|
| ANALYTICS-001 | Vision et architecture du module AKS Analytics | Référence de développement | 1.3.0 | ARCH-001, CORE-001, ADMIN-004, STD-001 |
| ANALYTICS-002 | Modèle métier d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001, ROADMAP-001, SECURITY-001, STORAGE-001 |
| ANALYTICS-003 | Services et règles d’orchestration d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001, ANALYTICS-002, CORE-001, ADMIN-004, CONFIG-001, LOG-001 |
| ANALYTICS-004 | Interfaces et restitutions d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001 à ANALYTICS-003, ADMIN-002 à ADMIN-004, UI-001, UX-001 |
| ANALYTICS-005 | Contrats externes et formats des sources d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001 à ANALYTICS-004, STORAGE-001, SECURITY-001, CONFIG-001 |
| ANALYTICS-006 | Stratégie de validation, jeux d’essai et recette d’AKS Analytics | Référence de développement | 1.1.0 | ANALYTICS-001 à ANALYTICS-005, ADMIN-004, CONFIG-001, LOG-001, SECURITY-001, STORAGE-001, UI-001, UX-001 |
| ANALYTICS-007 | Catalogue des indicateurs et règles de calcul | Référence de développement | 1.0.0 | ANALYTICS-001 à ANALYTICS-006 |
| ANALYTICS-008 | Bilan d’implémentation et procès-verbal de recette | Validé | 1.0.1 | ANALYTICS-001 à ANALYTICS-007 |
| ANALYTICS-009 | Guide d’alimentation Google Sheets V1.2.0 | Validé | 1.0.0 | ANALYTICS-005, ANALYTICS-008, implémentation V1.2.0 |
| ANALYTICS-SAISIE-001 | Cadrage fonctionnel et UX de la saisie des présences | Validé | 1.0.0 | ANALYTICS-001 à ANALYTICS-009, SECURITY-001, UX-001 |
| ACCESS-001 | Rôles, capacités et affectations Analytics | Exposition serveur validée sur `develop` — recette fonctionnelle à poursuivre | 1.0.7 | ANALYTICS-SAISIE-001, SECURITY-001, CONFIG-001, LOG-001, AUDIT-001, API-001 |
| ANALYTICS-SAISIE-002 | Contrat d’écriture des séances et présences | Implémentation et recette validées — publiée sur `main` | 1.1.2 | ANALYTICS-SAISIE-001, ACCESS-001, ANALYTICS-009, SECURITY-001, AUDIT-001, LOG-001, API-001, ERROR-001 |

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

# 14. Matrice de couverture V1.2

| Domaine | Documents principaux | Couverture |
|---------|----------------------|------------|
| Vision et stratégie | VISION-001, OBJECTIVES-001, SCOPE-001, ROADMAP-001, GOV-001 | Complète |
| Gouvernance documentaire | GOV-DOC-001, GOV-DEV-001, DOC-001, STD-001, ADR-001 | Complète sous réserve de confirmation d'ADR-001 |
| Architecture générale | ARCH-001, CORE-001 | Complète |
| Services transverses | API-001, SECURITY-001, ERROR-001, NOTIF-001, DOCUMENT-001, STORAGE-001, UI-001 | Complète |
| Administration | ADMIN-001 à ADMIN-005, CONFIG-001, LOG-001, AUDIT-001 | Complète |
| Expérience utilisateur | UX-001 | Complète |
| AKS Analytics | ANALYTICS-001 à ANALYTICS-009, V1.2.0 | Publié en V1.2.0 ; exploitation officielle conditionnée à des sources réelles exploitables |
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
| 1.2.47 | 2026-07-28 | Validation Apps Script de l’exposition serveur ACCESS-001 : suite cumulative 315/315 réussie, 0 échec ; recette fonctionnelle autorisée à poursuivre |
| 1.2.46 | 2026-07-28 | Exposition serveur sécurisée ACCESS-001 intégrée par la PR applicative #53, commit `d67bc1c2` ; quatre tests ajoutés, validation Apps Script 315/315 requise |
| 1.2.45 | 2026-07-28 | Validation Apps Script du raccordement ACCESS-001 : suite cumulative 311/311 réussie, 0 échec ; exposition serveur autorisée à poursuivre |
| 1.2.44 | 2026-07-28 | Raccordement ACCESS-001 au catalogue Analytics et au service d’écriture par la PR applicative #52 ; 17/17 tests ciblés réussis, validation Apps Script requise |
| 1.2.43 | 2026-07-28 | Validation Apps Script du socle ACCESS-001 : suite cumulative 309/309 réussie, 0 échec ; raccordement fonctionnel restant à réaliser |
| 1.2.41 | 2026-07-28 | Clôture d’ANALYTICS-SAISIE-002 : 291/291 tests réussis, recette d’écriture conclue sur copie, correctif Europe/Paris validé et publication applicative sur `main` |
| 1.2.40 | 2026-07-28 | Référencement de la validation Apps Script d’ANALYTICS-SAISIE-002 : 290/290 tests réussis, 0 échec |
| 1.2.39 | 2026-07-28 | Référencement de l’implémentation d’ANALYTICS-SAISIE-002 sur `develop`, de ses tests locaux et de la recette Apps Script encore requise |
| 1.2.38 | 2026-07-28 | Validation d’ANALYTICS-SAISIE-002 et référencement du contrat d’écriture sécurisé comme référence de développement |
| 1.2.34 | 2026-07-28 | Engagement d’ANALYTICS-SAISIE avant Calendar, référencement d’ANALYTICS-SAISIE-001 et alignement d’ANALYTICS-008 et ROADMAP-001 |
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

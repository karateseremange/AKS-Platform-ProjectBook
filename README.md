# AKS Platform Project Book

Bienvenue dans le **Project Book** d'AKS Platform.

Ce dépôt constitue la **documentation officielle** du projet. Toute décision fonctionnelle, d'architecture ou de gouvernance doit y être documentée avant ou en parallèle de son implémentation.

Le catalogue documentaire officiel est disponible dans [`project-book/documentation/INDEX-001.md`](project-book/documentation/INDEX-001.md).

## Historique

AKS Platform est née de la volonté de remplacer une collection d'outils indépendants par une plateforme unique, cohérente, documentée, maintenable et évolutive.

Avant le développement officiel de la version **1.0.0**, un Proof of Concept a permis de valider les principaux choix techniques et méthodologiques. Depuis cette publication, le développement suit une approche structurée fondée sur la gouvernance documentaire, l'architecture modulaire, les services communs mutualisés, la publication maîtrisée et l'évolution incrémentale des modules métier.

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
├── governance/
├── architecture/
├── administration/
├── ux/
├── modules/
│   ├── analytics/
│   ├── calendar/
│   └── inscriptions/
├── documentation/
└── release/
```

Les documents transverses existants restent à leur emplacement actuel. Les spécifications des modules métier sont regroupées sous `project-book/modules/`, chaque module disposant de son propre sous-dossier.

Chaque document possède une responsabilité unique et est identifié par un code stable (`ARCH-001`, `ADMIN-001`, `ANALYTICS-001`, etc.).

L'arborescence peut évoluer lorsque de nouveaux domaines apparaissent. Le catalogue [`INDEX-001`](project-book/documentation/INDEX-001.md) fait autorité sur l'organisation documentaire active.

---

# Documents de référence

## Catalogue et gouvernance documentaire

- [INDEX-001 — Catalogue du Project Book](project-book/documentation/INDEX-001.md)
- [DOC-001 — Règles de documentation](project-book/documentation/DOC-001.md)
- [RELEASE-001 — Processus de publication](project-book/release/RELEASE-001.md)
- [V1.1.0 — Note de publication](releases/V1.1.0.md)
- [V1.2.0 — Note de publication](releases/V1.2.0.md)
- [V1.3.0 — Note de prépublication](releases/V1.3.0.md)

## Vision et stratégie

- [VISION-001 — Vision d'AKS Platform](project-book/vision/VISION-001.md)
- [OBJECTIVES-001 — Objectifs stratégiques](project-book/strategy/OBJECTIVES-001.md)
- [SCOPE-001 — Périmètre fonctionnel](project-book/strategy/SCOPE-001.md)
- [ROADMAP-001 — Feuille de route officielle](project-book/strategy/ROADMAP-001.md)
- [GOV-001 — Gouvernance produit](project-book/strategy/GOV-001.md)

## Architecture

- [ARCH-001 — Architecture fonctionnelle](project-book/architecture/ARCH-001.md)
- [CORE-001 — AKS Core](project-book/architecture/CORE-001.md)
- [API-001 — Contrats et principes d'API](project-book/architecture/API-001.md)
- [SECURITY-001 — Sécurité](project-book/architecture/SECURITY-001.md)
- [STORAGE-001 — Stockage transverse](project-book/architecture/STORAGE-001.md)
- [ERROR-001 — Gestion des erreurs](project-book/architecture/ERROR-001.md)
- [NOTIF-001 — Notifications](project-book/architecture/NOTIF-001.md)
- [DOCUMENT-001 — Gestion documentaire](project-book/architecture/DOCUMENT-001.md)
- [UI-001 — Contrat d'interface utilisateur](project-book/architecture/UI-001.md)

## Administration

- [ADMIN-001 — Tableau de bord d'administration](project-book/administration/ADMIN-001.md)
- [ADMIN-002 — Interface utilisateur et navigation](project-book/administration/ADMIN-002.md)
- [ADMIN-003 — Centre de pilotage](project-book/administration/ADMIN-003.md)
- [ADMIN-004 — Contrat DashboardProvider et DashboardWidget](project-book/administration/ADMIN-004.md)
- [ADMIN-005 — Validation et conformité du Centre de pilotage](project-book/administration/ADMIN-005.md)
- [CONFIG-001 — Paramétrage centralisé](project-book/administration/CONFIG-001.md)
- [LOG-001 — Journalisation](project-book/administration/LOG-001.md)
- [AUDIT-001 — Audit et traçabilité](project-book/administration/AUDIT-001.md)

## Expérience utilisateur

- [UX-001 — Principes UX](project-book/ux/UX-001.md)

## Modules métier

Les spécifications des modules métier sont regroupées dans le dossier [`project-book/modules/`](project-book/modules/).

- [AKS Analytics](project-book/modules/analytics/) — premier nouveau module métier de la phase suivant la consolidation V1.1.
- [AKS Calendar](project-book/modules/calendar/) — socle Google Calendar publié en V1.3.0.
- [AKS Inscriptions](project-book/modules/inscriptions/) — chantier fonctionnel engagé après la V1.3.0.

Le module historique **Questionnaire Santé** reste la première capacité métier livrée en V1.0.0. Les prochains modules sont intégrés progressivement selon `ROADMAP-001`.

---

# Dépôts Git

## Application

- Branche `develop` : développement courant.
- Branche `main` : version stable et production.

## Project Book

- Branche `develop` : préparation et validation des évolutions documentaires.
- Branche `main` : documentation officielle validée et publiée.

Toute publication documentaire suit un cycle de validation, de fusion de `develop` vers `main`, puis de création d'un tag correspondant.

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

# État du Project Book

La version **V1.2.0**, publiée le 28 juillet 2026, est la référence applicative
stable. Elle correspond au tag `v1.2.0` et au commit
`47bb3ca83eb902bc9db0867c8d41affffd3ceb47`.

Cette version introduit AKS Analytics. Son périmètre, ses limites et ses preuves
de validation sont consignés dans la [note de publication V1.2.0](releases/V1.2.0.md)
et dans `ANALYTICS-008`.

La **V1.3.0** a été publiée le 1er août 2026. Elle formalise le socle AKS Calendar déjà opérationnel : quatre calendriers Google, publication du calendrier public sur WordPress, accès protégé aux calendriers internes et guide utilisateur. Aucun nouveau code applicatif n’est introduit par cette version. Le tag documentaire `v1.3.0` pointe sur le commit `647ae45a501bf14c1f3463fbca480945993bc515`.

Le chantier suivant est **AKS Inscriptions**. Son cadrage fonctionnel, son modèle métier, ses services, la reprise des trois Google Forms, les interfaces de contrôle, le socle transverse d’accès privés, les contrats techniques ainsi que la stratégie de recette cumulative sont validés dans [`INSCRIPTIONS-001`](project-book/modules/inscriptions/INSCRIPTIONS-001.md) à [`INSCRIPTIONS-006`](project-book/modules/inscriptions/INSCRIPTIONS-006.md).

Le premier incrément applicatif sans écriture réelle est intégré sur `develop` par la PR applicative #85, commit `d09c85c3e125f8944b3f6aa47ba222fdf3a73b32`. La suite cumulative exécutée dans Apps Script le 2 août 2026 est concluante : **341/341 tests réussis, 0 échec**. Les seize jeux d’or produisent 12 réussites, 2 résultats partiels et 2 blocages attendus. Le code a été synchronisé dans le projet Apps Script pour cette validation, mais les tests n’ont lu ni écrit aucune donnée métier ou cible Google réelle et aucun déploiement de production n’a été créé.

Le deuxième incrément est validé dans [`INSCRIPTIONS-008`](project-book/modules/inscriptions/INSCRIPTIONS-008.md). Il étend `ACCESS-001` aux six capacités Inscriptions, applique des périmètres fermés et fournit un cycle d’audit injectable en deux temps. La PR applicative [#87](https://github.com/karateseremange/AKS-Platform/pull/87) est fusionnée sur `develop` au commit `ceda8b322715f77399bf8e7eda80c8e2b046daaa`. Après synchronisation contrôlée par `clasp push`, la suite Apps Script atteint **360/360 tests réussis, 0 échec** et les jeux d’or **13 réussis, 1 partiel, 2 bloqués**. Aucun registre réel, ressource Google métier, interface ou déploiement n’a été introduit.

Le troisième incrément est validé dans [`INSCRIPTIONS-009`](project-book/modules/inscriptions/INSCRIPTIONS-009.md). La PR applicative [#88](https://github.com/karateseremange/AKS-Platform/pull/88) est fusionnée sur `develop` au commit `b870d6f425e52c1ec63f1bb5ce1b5214296c8465`. Son journal de commandes injectable, ses transitions fermées, l’idempotence et la reprise après reconstruction du service ajoutent **20 tests ciblés**. Après synchronisation contrôlée de la tête testée `0ee4bb7b7d37a6f84dea38dc57edccf732053782`, la suite Apps Script atteint **380/380 tests réussis, 0 échec**. Le bilan reste **13 jeux d’or réussis, 1 partiel et 2 bloqués**. Aucun adaptateur Google, stockage métier réel, interface ou déploiement n’a été introduit.

Toute évolution fonctionnelle importante doit être accompagnée d'une mise à jour de la documentation concernée et, lorsque nécessaire, du catalogue [`INDEX-001`](project-book/documentation/INDEX-001.md).

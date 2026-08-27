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
- [V1.4.1 — Correctif ACCESS en préparation](releases/V1.4.1.md)
- [V1.4.0 — Publication et production clôturées](releases/V1.4.0.md)
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
- [AUDIT-001-RECETTE — Procès-verbal de recette du socle persistant](project-book/administration/AUDIT-001-RECETTE.md)
- [ACCESS-002 — Administration des utilisateurs et habilitations](project-book/administration/ACCESS-002.md)
- [ACCESS-002-06 — Migration des modules, validée en recette](project-book/administration/ACCESS-002-06.md)
- [ACCESS-002-PRODUCTION — Publication et amorçage](project-book/administration/ACCESS-002-PRODUCTION.md)
- [ACCESS-002-PRODUCTION-P2 — Candidate et Quality Gate](project-book/administration/ACCESS-002-PRODUCTION-P2.md)
- [ACCESS-002-PRODUCTION-P3 — Inventaire de production en lecture seule](project-book/administration/ACCESS-002-PRODUCTION-P3.md)
- [ACCESS-002-PRODUCTION-P4 — Quality Gate final](project-book/administration/ACCESS-002-PRODUCTION-P4.md)
- [ACCESS-002-PRODUCTION-P4-G — Rapport final du Quality Gate](project-book/administration/ACCESS-002-PRODUCTION-P4-G.md)
- [ACCESS-002-PRODUCTION-P5 — Publication Git contrôlée](project-book/administration/ACCESS-002-PRODUCTION-P5.md)
- [ACCESS-002-PRODUCTION-P6 — Préparation et déploiement Apps Script contrôlé](project-book/administration/ACCESS-002-PRODUCTION-P6.md)
- [ACCESS-002-PRODUCTION-P7 — Activation contrôlée d’AUDIT en production](project-book/administration/ACCESS-002-PRODUCTION-P7.md)
- [ACCESS-002-PRODUCTION-P8 — Amorçage minimal du premier gestionnaire](project-book/administration/ACCESS-002-PRODUCTION-P8.md)
- [ACCESS-002-PRODUCTION-P9 — Validation fonctionnelle et deuxième gestionnaire](project-book/administration/ACCESS-002-PRODUCTION-P9.md)
- [ACCESS-002-PRODUCTION-P10 — Confirmation finale de production](project-book/administration/ACCESS-002-PRODUCTION-P10.md)
- [AUDIT-001-PRODUCTION — Audit persistant de production](project-book/administration/AUDIT-001-PRODUCTION.md)

## Expérience utilisateur

- [UX-001 — Principes UX](project-book/ux/UX-001.md)

## Modules métier

Les spécifications des modules métier sont regroupées dans le dossier [`project-book/modules/`](project-book/modules/).

- [AKS Analytics](project-book/modules/analytics/) — premier nouveau module métier de la phase suivant la consolidation V1.1.
- [AKS Calendar](project-book/modules/calendar/) — socle Google Calendar publié en V1.3.0.
- [AKS Inscriptions](project-book/modules/inscriptions/) — chantier fonctionnel engagé après la V1.3.0 ; quatrième incrément technique INSCRIPTIONS-010 intégré dans `develop` après recette Google isolée concluante.

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

Le correctif **V1.4.1 — ACCESS et administration sécurisée — correctif
d’attribution** est préparé sur deux branches dédiées à partir des `develop`
contrôlés. La candidate applicative exacte `60cc727e` a réussi VERSION-001
**8/8**, ACCESS **15/15** et la campagne cumulative **665/665** dans le projet
Apps Script de recette `eIRxs4`. La recette a ensuite été restaurée à
261/261 fichiers sans différence. La finalisation V1.4.1 a été intégrée dans le `develop` applicatif par la
PR #136 au commit `62c859a7`. La PR documentaire #195 reste ouverte sans
fusion. V1.4.1 n’est ni publiée dans `main`, ni taguée, ni déployée.
La production reste sur V1.4.0, version Apps Script 54 du déploiement public
`wgNc37`. L’implémentation d’INSCRIPTIONS-011 n’est pas engagée.


La version **V1.2.0**, publiée le 28 juillet 2026, constitue la référence
historique de l’introduction d’AKS Analytics. Elle correspond au tag
`v1.2.0` et au commit `47bb3ca83eb902bc9db0867c8d41affffd3ceb47`.

Cette version introduit AKS Analytics. Son périmètre, ses limites et ses preuves
de validation sont consignés dans la [note de publication V1.2.0](releases/V1.2.0.md)
et dans `ANALYTICS-008`.

La **V1.3.0** a été publiée le 1er août 2026. Elle formalise le socle AKS Calendar déjà opérationnel : quatre calendriers Google, publication du calendrier public sur WordPress, accès protégé aux calendriers internes et guide utilisateur. Aucun nouveau code applicatif n’est introduit par cette version. Le tag documentaire `v1.3.0` pointe sur le commit `647ae45a501bf14c1f3463fbca480945993bc515`.

Les six lots d’**ACCESS-002-06** sont validés en recette et la publication Git V1.4.0 est clôturée. Les snapshots de publication, également ciblés par les tags légers `v1.4.0`, sont `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5` pour l’application et `7cfa3ce62b12edaf26d38e743e4cdd2da2ce43c1` pour le Project Book. Les têtes de branche peuvent ensuite avancer sans déplacer ces tags : après la PR applicative #134, `main` applicatif pointe sur `7a6b70a341bc869f10e1a18efda8ad4d6ab8fe6d`. Cette publication Git ne constitue ni un déploiement ni un amorçage ACCESS en production. [P5 — publication Git contrôlée](project-book/administration/ACCESS-002-PRODUCTION-P5.md) est clôturé. [P6 — préparation et déploiement Apps Script contrôlé](project-book/administration/ACCESS-002-PRODUCTION-P6.md) est clôturé : le déploiement public existant `wgNc37` exécute la version 54, avec identifiant et URL préservés. Le Questionnaire santé public, le portail V1.4.0, Paramétrage et Journaux ont été vérifiés sans mutation. [P7 — activation contrôlée d’AUDIT](project-book/administration/ACCESS-002-PRODUCTION-P7.md) est clôturé : support privé conforme, cinq paramètres techniques relus exactement, précontrôle sans écriture réussi, preuve `AUDIT_SUPPORT_TEST` créée puis relue et vérification finale concordante. Le support contient exactement une preuve, le précontrôle final confirme `rowCount: 1`, `writePerformed: false` et des permissions privées conformes. Les suffixes minimisés sont `ac6e57` et `895d54`. AUDIT-001 est activé en production comme prérequis technique. P8 est clôturé selon [P8 — amorçage minimal du premier gestionnaire](project-book/administration/ACCESS-002-PRODUCTION-P8.md). Après l’inventaire et la prévisualisation sans écriture, P8-C a créé atomiquement le registre `access/1.2` avec un unique compte actif `karate.seremange@gmail.com`, rôle `ADMINISTRATEUR`, affectation globale ACCESS et capacité `ACCESS_MANAGE`. La révision persistée se termine par `nshtnj` et les preuves `INTENTION` puis `REUSSI` sont corrélées par `4d3bb3`. P8-D a relu sans écriture le registre, les droits effectifs, le support AUDIT privé à exactement trois preuves et le déploiement public `wgNc37` toujours en version 54. Tous les fichiers temporaires ont été supprimés. P9 est clôturé selon [P9 — validation fonctionnelle et deuxième gestionnaire](project-book/administration/ACCESS-002-PRODUCTION-P9.md). P9-C a ajouté `aserridj@gmail.com` comme deuxième gestionnaire actif, avec la révision `dlkpc9` et les preuves corrélées par `c9e6d7`. La validation finale a confirmé les deux comptes actifs, le refus fermé, la non-régression du Questionnaire santé public et le support AUDIT privé à cinq preuves, sans `ECHEC` ni `REFUSE`. Les anomalies de présentation relevées restent non bloquantes. P10 est clôturé selon [P10 — confirmation finale de production](project-book/administration/ACCESS-002-PRODUCTION-P10.md). Le précontrôle final a confirmé neuf déploiements, dont l’unique déploiement public `wgNc37` en version 54, ainsi qu’un support AUDIT privé inchangé à cinq preuves, sans `ECHEC` ni `REFUSE`. Le Product Owner a confirmé l’état final de production et n’a autorisé aucun retour arrière. ACCESS est publié, amorcé et validé en production ; `INSCRIPTIONS-011` n’est plus suspendu par ce prérequis, mais son engagement reste une décision distincte.

Le chantier métier suivant est **AKS Inscriptions**. Son cadrage fonctionnel, son modèle métier, ses services, la reprise des trois Google Forms, les interfaces de contrôle, le socle transverse d’accès privés, les contrats techniques ainsi que la stratégie de recette cumulative sont validés dans [`INSCRIPTIONS-001`](project-book/modules/inscriptions/INSCRIPTIONS-001.md) à [`INSCRIPTIONS-006`](project-book/modules/inscriptions/INSCRIPTIONS-006.md).

Le premier incrément applicatif sans écriture réelle est intégré sur `develop` par la PR applicative #85, commit `d09c85c3e125f8944b3f6aa47ba222fdf3a73b32`. La suite cumulative exécutée dans Apps Script le 2 août 2026 est concluante : **341/341 tests réussis, 0 échec**. Les seize jeux d’or produisent 12 réussites, 2 résultats partiels et 2 blocages attendus. Le code a été synchronisé dans le projet Apps Script pour cette validation, mais les tests n’ont lu ni écrit aucune donnée métier ou cible Google réelle et aucun déploiement de production n’a été créé.

Le deuxième incrément est validé dans [`INSCRIPTIONS-008`](project-book/modules/inscriptions/INSCRIPTIONS-008.md). Il étend `ACCESS-001` aux six capacités Inscriptions, applique des périmètres fermés et fournit un cycle d’audit injectable en deux temps. La PR applicative [#87](https://github.com/karateseremange/AKS-Platform/pull/87) est fusionnée sur `develop` au commit `ceda8b322715f77399bf8e7eda80c8e2b046daaa`. Après synchronisation contrôlée par `clasp push`, la suite Apps Script atteint **360/360 tests réussis, 0 échec** et les jeux d’or **13 réussis, 1 partiel, 2 bloqués**. Aucun registre réel, ressource Google métier, interface ou déploiement n’a été introduit.

Le troisième incrément est validé dans [`INSCRIPTIONS-009`](project-book/modules/inscriptions/INSCRIPTIONS-009.md). La PR applicative [#88](https://github.com/karateseremange/AKS-Platform/pull/88) est fusionnée sur `develop` au commit `b870d6f425e52c1ec63f1bb5ce1b5214296c8465`. Son journal de commandes injectable, ses transitions fermées, l’idempotence et la reprise après reconstruction du service ajoutent **20 tests ciblés**. Après synchronisation contrôlée de la tête testée `0ee4bb7b7d37a6f84dea38dc57edccf732053782`, la suite Apps Script atteint **380/380 tests réussis, 0 échec**. Le bilan reste **13 jeux d’or réussis, 1 partiel et 2 bloqués**. Aucun adaptateur Google, stockage métier réel, interface ou déploiement n’a été introduit.

Le quatrième incrément est documenté dans [`INSCRIPTIONS-010`](project-book/modules/inscriptions/INSCRIPTIONS-010.md) et dans [`INSCRIPTIONS-010-RECETTE`](project-book/modules/inscriptions/INSCRIPTIONS-010-RECETTE.md). La PR applicative [#89](https://github.com/karateseremange/AKS-Platform/pull/89) a été fusionnée dans `develop` le 9 août 2026 au commit `ed03cc428f8a8b055400b59aec7ba2e0a005629f`. La tête finale recettée avant fusion est `0da406b0796dc4d96e1c403fe90dc4ab76d4cc06` et la suite cumulative atteint **455/455 tests réussis, 0 échec**.

La recette Google Sheets isolée sur `[RECETTE] AKS Inscriptions` est concluante pour le périmètre réellement exécuté : schéma `Metadata`/`Sequences`/`Commandes`, fuseau `Europe/Paris`, séquence `INS-2026-000001`, commande fictive `CMD-RECETTE-010-001` et relecture stricte identique. Une première tentative a détecté une conversion automatique de `scope_key = "2026"` en nombre par Sheets ; le contrôle strict l’a refusée et l’adaptateur a été corrigé dans `0da406b`. Les scénarios Google réels de concurrence simultanée, interruption et réconciliation ne sont pas présentés comme exécutés tant qu’une campagne dédiée ne les a pas prouvés.

Le socle persistant commun [`AUDIT-001`](project-book/administration/AUDIT-001.md) est intégré dans `develop` par la PR applicative #90 au commit `ad3b5cea26063c73b22f155a85ed4fbfa855ba69`. Sa recette isolée reste documentée dans [`AUDIT-001-RECETTE`](project-book/administration/AUDIT-001-RECETTE.md).

INSCRIPTIONS-010 reste strictement interne et editor-only dans cet incrément : aucun déploiement Web App de test n’a été requis. Toute fonctionnalité ultérieure observable ou utilisable depuis le Web App devra être validée sur un déploiement de test avant validation finale et fusion dans `develop`.

Le cycle INSCRIPTIONS-010 est clôturé pour son périmètre autorisé. La publication, l’amorçage et la validation fonctionnelle d’ACCESS en production sont désormais clôturés par P10. Le cadrage d’`INSCRIPTIONS-011` peut être préparé, mais n’est pas engagé par cette clôture. Le volet SIKADA demeure bloqué tant que l’échantillon anonymisé Windows-1252 à 12 colonnes prévu par `INSCRIPTIONS-006` n’est pas disponible, sécurisé et versionné. Aucun tag, déploiement ou fusion vers `main` n’a été effectué dans ce cycle.

Toute évolution fonctionnelle importante doit être accompagnée d'une mise à jour de la documentation concernée et, lorsque nécessaire, du catalogue [`INDEX-001`](project-book/documentation/INDEX-001.md).

# ARCH-CONSOLIDATION-001 — M3.1

# Matrice des responsabilités documentaires

| Propriété | Valeur |
|---|---|
| **Document parent** | ARCH-CONSOLIDATION-001 |
| **Livrable** | M3.1 — Matrice initiale des responsabilités documentaires |
| **Version** | 1.0.0 |
| **Statut** | Livrable de travail |
| **Nature** | Analyse documentaire non normative |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-21 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Ce document identifie la responsabilité principale de chaque document inclus dans le périmètre du chantier `ARCH-CONSOLIDATION-001`.

Il constitue le premier sous-jalon du jalon M3 — Analyse des responsabilités.

Cette matrice ne décide encore d'aucune fusion, suppression, migration ou réécriture. Elle établit une base de lecture commune permettant d'identifier ensuite les chevauchements documentaires.

---

# 2. Catégories de responsabilité

| Catégorie | Définition |
|---|---|
| **Document maître** | Porte la définition de référence d'un domaine et constitue la source principale à citer. |
| **Document spécialisé** | Décrit en profondeur un sous-domaine délimité sans remplacer le document maître. |
| **Document transverse** | Définit une règle ou un service applicable à plusieurs domaines ou modules. |
| **Document consommateur** | Utilise des règles définies ailleurs et décrit leur application dans son propre périmètre. |
| **Document de pilotage** | Organise un chantier, son avancement et ses décisions sans constituer une norme produit. |

Un document peut interagir avec plusieurs catégories, mais une seule responsabilité principale est retenue dans cette matrice.

---

# 3. Matrice initiale des responsabilités

| Document | Responsabilité principale | Catégorie | Périmètre de responsabilité | Documents principalement consommés | Limite de responsabilité |
|---|---|---|---|---|---|
| **ADR-001** | Définir l'architecture documentaire du Project Book | Document maître | Organisation des familles documentaires, hiérarchie et principes de structuration | GOV-DOC-001, GOV-DEV-001 | Ne définit pas l'architecture fonctionnelle ou technique du produit |
| **ARCH-001** | Définir l'architecture fonctionnelle de référence d'AKS Platform | Document maître | Composants majeurs, relations fonctionnelles, frontières de la plateforme et articulation des modules | VISION-001, OBJECTIVES-001, SCOPE-001, ROADMAP-001 | Ne détaille pas les règles internes de chaque service transverse ou module |
| **CORE-001** | Définir les responsabilités et services communs d'AKS Core | Document spécialisé | Socle partagé, services communs et responsabilités centrales du noyau | ARCH-001, CONFIG-001, LOG-001, UX-001, ADMIN-001 | Ne doit pas redéfinir les politiques spécialisées portées par les documents transverses |
| **ADMIN-001** | Spécifier le tableau de bord d'administration | Document spécialisé | Fonctions, vues et comportements de l'espace d'administration | CORE-001, CONFIG-001, LOG-001, SECURITY-001, AUDIT-001, UX-001 | Ne définit pas les politiques de configuration, sécurité, journalisation ou audit |
| **CONFIG-001** | Définir la politique de paramétrage centralisé | Document transverse | Sources de configuration, portée, règles d'accès et principes de gestion des paramètres | CORE-001, ADMIN-001 | Ne décrit pas l'intégralité des interfaces d'administration ni les règles métier des modules |
| **LOG-001** | Définir la politique fonctionnelle de journalisation | Document transverse | Événements journalisés, niveaux, structure et exploitation des journaux | CORE-001, AUDIT-001, ARCH-001, ADMIN-001, CONFIG-001 | Ne remplace pas la traçabilité métier et réglementaire définie dans AUDIT-001 |
| **UX-001** | Définir les principes d'expérience utilisateur de la plateforme | Document transverse | Règles UX communes aux interfaces publiques, administratives et métier | VISION-001, ARCH-001 | Ne spécifie pas chaque écran ni chaque parcours fonctionnel détaillé |
| **API-001** | Définir les principes et conventions des API AKS Platform | Document transverse | Contrats d'interface, conventions d'échange, sécurité, erreurs et traçabilité des API | SECURITY-001, LOG-001, ERROR-001, AUDIT-001, CONFIG-001, ARCH-001, CORE-001, NOTIF-001 | Ne définit pas les règles internes des services appelés par les API |
| **SECURITY-001** | Définir les principes de sécurité de la plateforme | Document transverse | Authentification, autorisation, protection des données, secrets et contrôles de sécurité | ADMIN-001, CONFIG-001, LOG-001, AUDIT-001, ERROR-001, STORAGE-001 | Ne détaille pas les processus fonctionnels propres aux modules |
| **AUDIT-001** | Définir la traçabilité des actions sensibles | Document transverse | Événements auditables, preuve, consultation et conservation des traces d'audit | LOG-001, CONFIG-001, ADMIN-001 | Ne définit pas l'ensemble des journaux techniques ou opérationnels |
| **ERROR-001** | Définir la gestion transverse des erreurs | Document transverse | Typologie, propagation, traitement, restitution et traçabilité des erreurs | API-001, LOG-001, AUDIT-001, SECURITY-001, UX-001 | Ne définit pas les règles métier qui provoquent ou résolvent une erreur fonctionnelle |
| **NOTIF-001** | Définir le service transversal de notifications | Document transverse | Canaux, déclenchement, modèles, traçabilité et responsabilités d'envoi | ARCH-001, CORE-001, CONFIG-001, LOG-001, SECURITY-001, AUDIT-001 | Ne porte pas les règles métier qui décident qu'une notification doit être émise |
| **DOCUMENT-001** | Définir la gestion des documents générés | Document transverse | Génération, identification, cycle de vie et règles communes des documents produits | STORAGE-001, SECURITY-001, ERROR-001 | Ne définit pas la stratégie générale de stockage de toutes les données de la plateforme |
| **STORAGE-001** | Définir la stratégie de stockage d'AKS Platform | Document transverse | Emplacements, catégories de données, conservation, accès et responsabilités de stockage | ARCH-001, CORE-001, CONFIG-001, LOG-001, AUDIT-001, SECURITY-001, DOCUMENT-001, ERROR-001, ADMIN-001 | Ne définit pas le contenu fonctionnel des données ni les règles métier des documents générés |
| **ARCH-CONSOLIDATION-001** | Piloter la consolidation de la famille documentaire Architecture | Document de pilotage | Inventaire, cartographie, analyse, décisions et suivi des migrations documentaires | Tous les documents du périmètre | Ne constitue pas une source normative de l'architecture produit |

---

# 4. Répartition des responsabilités par domaine

| Domaine | Document maître ou responsable principal | Documents spécialisés ou consommateurs |
|---|---|---|
| Architecture documentaire | ADR-001 | ARCH-CONSOLIDATION-001 |
| Architecture fonctionnelle | ARCH-001 | CORE-001, ADMIN-001 et documents de modules métier |
| Socle commun | CORE-001 | ADMIN-001 et modules métier |
| Administration | ADMIN-001 | CONFIG-001, LOG-001, AUDIT-001, SECURITY-001 et UX-001 en tant que règles consommées |
| Paramétrage | CONFIG-001 | CORE-001, ADMIN-001, services transverses et modules métier |
| Journalisation | LOG-001 | CORE-001, ADMIN-001, API-001, ERROR-001, NOTIF-001 et STORAGE-001 |
| Expérience utilisateur | UX-001 | Interfaces publiques, administratives et métier |
| API | API-001 | Services transverses et modules exposant une interface |
| Sécurité | SECURITY-001 | Tous les composants et modules concernés |
| Audit | AUDIT-001 | Administration, services transverses et modules sensibles |
| Gestion des erreurs | ERROR-001 | API, interfaces, services transverses et modules métier |
| Notifications | NOTIF-001 | Modules métier et fonctions administratives déclenchant un envoi |
| Documents générés | DOCUMENT-001 | Modules produisant des attestations, rapports ou exports |
| Stockage | STORAGE-001 | Tous les services et modules conservant des données ou documents |

---

# 5. Critères appliqués

La responsabilité principale est déterminée selon les critères suivants :

1. l'objet déclaré du document ;
2. son périmètre fonctionnel ou technique ;
3. son statut de référence dans le Project Book ;
4. les responsabilités qu'il affirme porter ;
5. les documents qu'il cite ou dont il dépend ;
6. la distinction entre définition d'une règle et simple consommation de cette règle.

Le nombre de références entrantes recensées dans M2 n'est pas utilisé seul pour attribuer une responsabilité. Une forte centralité documentaire indique une dépendance importante, mais ne suffit pas à faire d'un document la source normative d'un domaine.

---

# 6. Résultat du sous-jalon M3.1

La matrice attribue une responsabilité principale et une limite de responsabilité à chacun des documents du périmètre.

Elle fournit la base nécessaire au sous-jalon suivant :

**M3.2 — Identification des chevauchements documentaires.**

Aucune décision de migration n'est prise à ce stade.
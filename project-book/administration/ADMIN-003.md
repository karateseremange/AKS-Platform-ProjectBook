# ADMIN-003 — Modèle du Centre de pilotage

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-003 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Nature** | Spécification fonctionnelle d’architecture d’interface |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit le modèle fonctionnel du Centre de pilotage d’AKS Platform.

Il précise son organisation, ses zones fonctionnelles, les règles de composition de ses contenus et les états que l’interface doit savoir représenter.

Il complète :

- `ADMIN-001`, qui définit le premier incrément du Dashboard d’administration ;
- `ADMIN-002`, qui définit l’interface utilisateur et la navigation du Centre de pilotage.

`ADMIN-003` ne définit pas encore le contrat technique d’extension des modules. Ce contrat fera l’objet de `ADMIN-004`.

---

## 2. Références applicables

Le Centre de pilotage applique les références suivantes :

- `ARCH-001` pour l’architecture générale de la plateforme ;
- `CORE-001` pour les services transverses ;
- `CONFIG-001` pour le paramétrage centralisé ;
- `LOG-001` pour les informations de journalisation ;
- `UX-001` pour les principes d’expérience utilisateur ;
- `UI-001` pour les composants, états et règles de composition visuelle.

Aucune règle transverse n’est redéfinie dans le présent document.

---

## 3. Définition du Centre de pilotage

Le Centre de pilotage est l’espace administratif central d’AKS Platform.

Il fournit une vue synthétique, déclarative et orientée action des capacités réellement disponibles dans la plateforme.

Il ne constitue ni :

- un moteur métier ;
- une base de données ;
- une console de supervision d’infrastructure ;
- un outil de diagnostic technique brut ;
- un substitut aux écrans spécialisés des modules.

Le Centre de pilotage affiche exclusivement des informations déjà déterminées par leurs services ou modules sources.

---

## 4. Principes du modèle

### 4.1 Modèle déclaratif

Le Centre de pilotage décrit ce qui doit être présenté. Il n’interprète pas les données métier et ne prend aucune décision fonctionnelle.

### 4.2 Agrégation sans propriété métier

Il peut agréger des informations provenant de plusieurs sources, mais il n’en devient jamais propriétaire.

Chaque information conserve :

- une source identifiée ;
- une responsabilité métier externe au Centre de pilotage ;
- une destination explicite lorsqu’une action est proposée.

### 4.3 Dégradation maîtrisée

L’indisponibilité d’une source ne doit pas rendre l’ensemble du Centre de pilotage inutilisable.

Chaque zone et chaque carte doivent pouvoir représenter leur propre état sans bloquer les autres contenus.

### 4.4 Affichage fondé sur la disponibilité réelle

Aucun module, indicateur, action ou état futur n’est simulé.

Un contenu n’est affiché que lorsque sa source et sa destination existent réellement dans la version exécutée.

---

## 5. Organisation fonctionnelle

Le Centre de pilotage est organisé en quatre zones.

### 5.1 En-tête du Centre de pilotage

L’en-tête permet d’identifier :

- le nom de la plateforme ;
- la version exécutée ;
- le contexte administratif courant ;
- l’utilisateur authentifié lorsque cette information est utile et autorisée.

Il ne contient aucune logique métier.

### 5.2 Zone de synthèse

La zone de synthèse présente les informations globales utiles à la compréhension immédiate de la plateforme.

Elle peut contenir notamment :

- les informations de version ;
- l’état fonctionnel publié par un service qualifié ;
- les indicateurs transverses réellement disponibles.

Aucun état global n’est calculé localement à partir d’informations partielles.

### 5.3 Zone des modules

La zone des modules présente les informations synthétiques publiées par les modules installés et disponibles.

Chaque module reste responsable :

- du sens de ses données ;
- de leur fraîcheur ;
- de leurs règles d’accès ;
- des actions proposées ;
- de son écran détaillé.

### 5.4 Zone des actions et accès rapides

Cette zone regroupe les accès vers les fonctionnalités administratives réellement disponibles.

Une action rapide :

- effectue uniquement une navigation ;
- ne déclenche pas directement un traitement métier ;
- respecte les autorisations de sa destination ;
- disparaît ou devient indisponible lorsque sa destination n’existe pas.

---

## 6. Unité de composition

L’unité principale de composition du Centre de pilotage est la carte définie par `UI-001`.

Une carte comporte :

- un en-tête obligatoire ;
- un contenu obligatoire ;
- éventuellement un état ;
- éventuellement des indicateurs ;
- éventuellement des actions ;
- éventuellement un pied de carte.

Une carte ne doit traiter qu’un objectif fonctionnel principal.

Les cartes sont indépendantes entre elles. Une carte ne modifie jamais directement l’état ou le contenu d’une autre carte.

---

## 7. Cycle de vie d’une carte

Une carte suit le cycle de vie fonctionnel suivant :

1. la source est identifiée ;
2. l’autorisation est vérifiée côté serveur ;
3. les données de présentation sont obtenues ;
4. l’état de la carte est déterminé par la source ou le contrôleur habilité ;
5. la carte est rendue ;
6. ses actions conduisent vers leurs destinations sans exécuter de logique métier locale.

Le Centre de pilotage ne conserve pas d’état métier propre entre deux affichages.

---

## 8. États normalisés

Chaque carte doit pouvoir représenter les états suivants lorsque ceux-ci sont pertinents.

### 8.1 Chargement

L’interface indique qu’une information est en cours d’obtention sans bloquer les autres cartes.

### 8.2 Disponible

La carte présente les données fournies par sa source.

### 8.3 Vide

La source est disponible, mais aucune donnée n’est actuellement à afficher.

L’état vide doit être explicite et ne doit pas être présenté comme une erreur.

### 8.4 Indisponible

La fonctionnalité ou la source nécessaire n’est pas disponible dans la version exécutée.

L’indisponibilité ne doit pas être interprétée comme un incident technique sans preuve fournie par un service qualifié.

### 8.5 Erreur

Une erreur connue empêche l’affichage du contenu attendu.

La carte présente un message compréhensible, un code exploitable lorsqu’il existe et une action de reprise uniquement si elle est réellement disponible.

### 8.6 Accès refusé

L’utilisateur ne possède pas l’autorisation nécessaire.

Aucune donnée protégée n’est transmise à l’interface avant le contrôle d’autorisation.

---

## 9. Priorité et ordre d’affichage

L’ordre d’affichage suit les priorités suivantes :

1. identification de la plateforme ;
2. informations nécessitant une attention administrative ;
3. synthèses des modules ;
4. actions rapides ;
5. informations secondaires.

La priorité ne doit jamais être déterminée arbitrairement par le composant visuel.

Lorsqu’une priorité métier existe, elle est fournie par la source responsable selon un vocabulaire normalisé.

Les cartes de même priorité suivent un ordre stable afin d’éviter les déplacements imprévisibles dans l’interface.

---

## 10. Responsive et accessibilité

Le modèle s’applique sur ordinateur, tablette et smartphone.

L’adaptation responsive modifie la disposition, mais pas :

- le sens des informations ;
- les autorisations ;
- les actions disponibles ;
- l’ordre logique de lecture.

Chaque carte respecte les exigences d’accessibilité définies dans `UX-001` et `UI-001`.

Aucune information essentielle ne repose uniquement sur la couleur, la position ou une icône non libellée.

---

## 11. Hors périmètre

`ADMIN-003` ne définit pas :

- les interfaces techniques `DashboardProvider` et `DashboardWidget` ;
- le registre des fournisseurs ;
- l’implémentation dans AKS Core ;
- le stockage des données métier ;
- les règles métier propres aux modules ;
- la supervision de l’infrastructure ;
- les métriques de performance système ;
- le diagnostic technique détaillé ;
- l’administration interne de chaque module.

---

## 12. Critères d’acceptation

Le modèle est respecté lorsque :

- le Centre de pilotage reste déclaratif ;
- chaque information possède une source identifiée ;
- aucune logique métier n’est exécutée par les cartes ;
- les zones fonctionnelles sont clairement séparées ;
- chaque carte possède un objectif principal unique ;
- l’indisponibilité d’une carte ne bloque pas les autres ;
- les états vide, indisponible, erreur et accès refusé sont distingués ;
- seules les fonctionnalités réellement disponibles sont affichées ;
- les actions réalisent uniquement une navigation ;
- aucun état global n’est déduit d’informations partielles ;
- l’interface respecte `UX-001` et `UI-001` ;
- le comportement reste cohérent sur ordinateur, tablette et smartphone.

---

## 13. Définition de terminé

`ADMIN-003` est terminé lorsque :

- l’organisation fonctionnelle du Centre de pilotage est validée ;
- les zones de présentation sont définies ;
- l’unité de composition est établie ;
- le cycle de vie des cartes est défini ;
- les états normalisés sont documentés ;
- les règles de priorité et de dégradation sont fixées ;
- le périmètre du futur contrat d’extension est clairement séparé.

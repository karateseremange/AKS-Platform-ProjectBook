# ADMIN-003 — Modèle fonctionnel du Centre de pilotage

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-003 |
| **Version** | 1.2.0 |
| **Statut** | Référence de développement |
| **Nature** | Spécification fonctionnelle du modèle de présentation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit exclusivement le modèle fonctionnel du Centre de pilotage d’AKS Platform.

Il précise :

- les zones fonctionnelles de présentation ;
- l’unité de composition ;
- le cycle de vie d’une carte ;
- les états représentables ;
- les règles de priorité, de fraîcheur et de dégradation.

Il complète :

- `ADMIN-001`, qui définit le premier incrément livrable ;
- `ADMIN-002`, qui définit l’interface et la navigation.

Le contrat technique d’extension des modules relève exclusivement de `ADMIN-004`.

---

## 2. Références applicables

Le modèle applique :

- `ARCH-001` — architecture générale ;
- `CORE-001` — services transverses ;
- `SECURITY-001` — autorisations et confidentialité ;
- `CONFIG-001` — paramétrage centralisé ;
- `LOG-001` — journalisation ;
- `UX-001` — expérience utilisateur ;
- `UI-001` — composants, états visuels et accessibilité.

Aucune règle transverse n’est redéfinie localement.

---

## 3. Définition

Le Centre de pilotage est l’espace administratif central d’AKS Platform.

Il fournit une vue synthétique, déclarative et orientée action des capacités réellement disponibles.

Il ne constitue ni :

- un moteur métier ;
- une base de données ;
- une source de vérité ;
- une console de supervision d’infrastructure ;
- un outil de diagnostic technique brut ;
- un substitut aux écrans spécialisés des modules.

Il affiche exclusivement des informations déjà déterminées par leurs services ou modules sources.

---

## 4. Principes du modèle

### 4.1 Modèle déclaratif

Le Centre de pilotage décrit ce qui doit être présenté. Il n’interprète pas les données métier et ne prend aucune décision fonctionnelle.

### 4.2 Agrégation sans propriété métier

Il peut agréger plusieurs sources, mais n’en devient jamais propriétaire.

Chaque information conserve :

- une source identifiée ;
- une responsabilité externe au Centre de pilotage ;
- une date ou indication de fraîcheur lorsque nécessaire ;
- une destination explicite lorsqu’une action est proposée.

### 4.3 Dégradation maîtrisée

L’indisponibilité d’une source ne doit pas rendre l’ensemble du Centre de pilotage inutilisable.

Chaque zone et chaque carte représentent leur propre état sans bloquer les autres contenus.

### 4.4 Disponibilité réelle

Aucun module, indicateur, action ou état futur n’est simulé.

Un contenu n’est présenté que lorsque sa source existe, que son contrat est valide et que l’utilisateur est autorisé.

### 4.5 Minimisation

Une carte ne reçoit que les données strictement nécessaires à sa présentation.

Elle ne contient ni secret, ni donnée personnelle inutile, ni contenu métier détaillé pouvant être consulté dans l’écran spécialisé.

---

## 5. Organisation fonctionnelle

Le Centre de pilotage est organisé en quatre zones de présentation.

### 5.1 En-tête

L’en-tête permet d’identifier :

- le nom de la plateforme ;
- la version exécutée ;
- le contexte administratif courant ;
- l’utilisateur authentifié lorsque cette information est utile et autorisée.

Il ne contient aucune logique métier.

### 5.2 Zone de synthèse

Elle présente les informations globales utiles à la compréhension immédiate de la plateforme, notamment :

- les informations de version ;
- l’état fonctionnel publié par un service qualifié ;
- les alertes administratives transverses ;
- les indicateurs transverses réellement disponibles.

Aucun état global n’est calculé localement à partir d’informations partielles.

### 5.3 Zone des modules

Elle présente les synthèses publiées par les modules installés, actifs et accessibles.

Chaque module reste responsable :

- du sens de ses données ;
- de leur exactitude et fraîcheur ;
- de leurs règles d’accès ;
- des actions proposées ;
- de son écran détaillé.

### 5.4 Zone des actions rapides

Elle regroupe les accès vers les fonctionnalités administratives réellement disponibles.

Une action rapide :

- effectue uniquement une navigation ;
- ne déclenche pas directement de traitement destructif ou irréversible ;
- respecte les autorisations de sa destination ;
- disparaît lorsque sa destination n’existe plus.

La structure générale de navigation relève de `ADMIN-002`.

---

## 6. Unité de composition

L’unité principale de composition est la carte définie par `UI-001`.

Une carte comporte :

- un identifiant stable ;
- un en-tête obligatoire ;
- un contenu obligatoire ;
- une source identifiée ;
- un état explicite ;
- éventuellement des indicateurs ;
- éventuellement des actions ;
- éventuellement un pied de carte ;
- éventuellement une indication de fraîcheur.

Une carte ne traite qu’un objectif fonctionnel principal.

Les cartes sont indépendantes : une carte ne modifie jamais directement l’état ou le contenu d’une autre carte.

---

## 7. Cycle de vie d’une carte

Une carte suit le cycle fonctionnel suivant :

1. la source et le contrat sont identifiés ;
2. l’autorisation est vérifiée côté serveur ;
3. les données de présentation minimales sont obtenues ;
4. la source détermine l’état fonctionnel ;
5. le modèle est validé ;
6. la carte est rendue avec les composants communs ;
7. ses actions conduisent vers leurs destinations ;
8. les erreurs significatives sont journalisées conformément à `LOG-001`.

Le Centre de pilotage ne conserve pas d’état métier propre entre deux affichages.

---

## 8. États normalisés

Chaque carte utilise un état explicite parmi les suivants lorsque pertinent.

### 8.1 `loading`

L’information est en cours d’obtention sans bloquer les autres cartes.

### 8.2 `available`

La carte présente des données valides fournies par sa source.

### 8.3 `empty`

La source est disponible mais aucune donnée n’est actuellement à afficher.

Cet état ne doit pas être présenté comme une erreur.

### 8.4 `unavailable`

La fonctionnalité ou la source n’est pas disponible dans la version exécutée.

L’indisponibilité ne constitue pas automatiquement un incident.

### 8.5 `error`

Une erreur connue empêche l’affichage du contenu attendu.

La carte présente un message compréhensible, un code exploitable lorsqu’il existe et une action de reprise uniquement si elle est réellement disponible.

### 8.6 `access-denied`

L’utilisateur ne possède pas l’autorisation nécessaire.

Aucune donnée protégée ne doit être transmise à l’interface avant ce contrôle.

### 8.7 `disabled`

La capacité existe mais a été désactivée de manière contrôlée.

Cet état doit être distingué d’une indisponibilité ou d’une erreur.

---

## 9. Priorité et ordre d’affichage

L’ordre fonctionnel suit les priorités suivantes :

1. identification de la plateforme ;
2. informations nécessitant une attention administrative ;
3. synthèses des modules ;
4. actions rapides ;
5. informations secondaires.

La priorité métier est fournie par la source selon un vocabulaire normalisé. Elle n’est pas déduite par le composant visuel.

Les cartes de même priorité suivent un ordre stable afin d’éviter les déplacements imprévisibles.

Un fournisseur ne peut imposer l’ordre absolu des contenus appartenant à d’autres fournisseurs.

---

## 10. Fraîcheur et actualisation

Lorsqu’une information peut devenir obsolète, la carte doit pouvoir présenter :

- la date de dernière mise à jour ;
- un état d’actualisation ;
- une action de rafraîchissement lorsqu’elle est réellement supportée.

Une donnée ancienne ne doit pas être présentée comme actuelle sans indication.

Le rafraîchissement d’une carte ne doit pas modifier les autres cartes, sauf orchestration explicitement définie par le Centre de pilotage.

---

## 11. Responsive et accessibilité

Le modèle s’applique sur ordinateur, tablette et smartphone.

L’adaptation responsive modifie la disposition, mais pas :

- le sens des informations ;
- les autorisations ;
- les actions disponibles ;
- l’ordre logique de lecture.

Chaque carte respecte `UX-001` et `UI-001`.

Aucune information essentielle ne repose uniquement sur la couleur, la position ou une icône non libellée.

---

## 12. Responsabilités

### 12.1 Centre de pilotage

Il est responsable :

- de la composition générale ;
- de la validation minimale des modèles ;
- de l’isolation des erreurs ;
- de l’ordre stable ;
- du rendu avec les composants communs.

### 12.2 Sources et modules

Ils sont responsables :

- du sens et de la validité des données ;
- de l’état fonctionnel ;
- de la fraîcheur ;
- des autorisations ;
- des actions et destinations ;
- de l’absence de données sensibles inutiles.

### 12.3 Product Owner

Il valide :

- les zones fonctionnelles ;
- le vocabulaire des états ;
- les priorités fonctionnelles ;
- les nouveaux types de présentation ;
- les exceptions documentées.

---

## 13. Hors périmètre

`ADMIN-003` ne définit pas :

- la structure de navigation ;
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

## 14. Critères d’acceptation

Le modèle est respecté lorsque :

- le Centre de pilotage reste déclaratif ;
- chaque information possède une source identifiée ;
- aucune logique métier n’est exécutée par les cartes ;
- les quatre zones fonctionnelles sont clairement séparées ;
- chaque carte possède un objectif principal unique ;
- l’indisponibilité d’une carte ne bloque pas les autres ;
- les états `empty`, `unavailable`, `error`, `access-denied` et `disabled` sont distingués ;
- seules les fonctionnalités réellement disponibles sont affichées ;
- les actions réalisent uniquement une navigation ;
- aucun état global n’est déduit d’informations partielles ;
- la fraîcheur est indiquée lorsqu’elle est nécessaire ;
- les données sont minimisées ;
- l’interface respecte `UX-001` et `UI-001` ;
- le comportement reste cohérent sur ordinateur, tablette et smartphone.

---

## 15. Définition de terminé

`ADMIN-003` est terminé lorsque :

- les zones de présentation sont validées ;
- l’unité de composition est établie ;
- le cycle de vie des cartes est défini ;
- les états normalisés sont documentés ;
- les règles de priorité, fraîcheur et dégradation sont fixées ;
- le périmètre du contrat d’extension est clairement séparé.

---

## 16. Références

- `ARCH-001`
- `CORE-001`
- `SECURITY-001`
- `CONFIG-001`
- `LOG-001`
- `UX-001`
- `UI-001`
- `ADMIN-001`
- `ADMIN-002`
- `ADMIN-004`
- `ADMIN-005`

---

## 17. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.0 | 2026-07-23 | Recentrage sur le modèle fonctionnel, séparation avec la navigation, ajout de la fraîcheur, de la minimisation, de l’état disabled et des responsabilités |
| 1.1.0 | 2026-07-23 | Première définition du modèle du Centre de pilotage |
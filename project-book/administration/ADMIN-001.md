# ADMIN-001 — Tableau de bord d’administration

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-001 |
| **Version** | 1.2.1 |
| **Statut** | Validé |
| **Nature** | Spécification du premier incrément |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-24 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le Dashboard est la page d’accueil du Centre de pilotage d’AKS Platform.

Le présent document décrit exclusivement le premier incrément livrable du Dashboard. Il fixe son périmètre minimal, ses dépendances réelles et ses critères d’acceptation.

Il ne définit ni l’organisation cible complète du Centre de pilotage, ni son modèle fonctionnel, ni son contrat d’extension. Ces responsabilités relèvent respectivement de `ADMIN-002`, `ADMIN-003` et `ADMIN-004`.

Cette spécification constitue la référence validée d’`ADMIN-001`. Elle ne peut être ajustée qu’à la suite d’une décision documentée et validée conformément à la gouvernance du Project Book.

---

## 2. Position dans le Project Book

`ADMIN-001` applique notamment :

- `ARCH-001` — architecture générale ;
- `CORE-001` — services transverses ;
- `SECURITY-001` — sécurité et autorisations ;
- `UX-001` — principes d’expérience utilisateur ;
- `UI-001` — composants et règles visuelles.

Il est complété par :

- `ADMIN-002` — interface et navigation cible ;
- `ADMIN-003` — modèle fonctionnel du Centre de pilotage ;
- `ADMIN-004` — contrat d’extension ;
- `ADMIN-005` — validation et conformité.

---

## 3. Finalité fonctionnelle

Le premier incrément permet à un administrateur autorisé de :

- identifier immédiatement la version exécutée ;
- accéder rapidement aux fonctionnalités administratives réellement disponibles ;
- disposer d’une page d’accueil stable pour les futurs incréments.

Le Dashboard n’est ni une console de supervision technique, ni un moteur métier, ni une source de données.

---

## 4. Principes d’architecture

### 4.1 Consommateur de services

Le Dashboard consomme uniquement des informations fournies par des services identifiés d’AKS Core ou par des modules existants. Il ne constitue jamais une source de vérité.

### 4.2 Absence de logique métier

Le Dashboard ne réalise aucun calcul, aucune décision administrative, aucune interprétation métier et aucune déduction sur l’état de la plateforme.

### 4.3 Architecture déclarative

Le Dashboard affiche exclusivement :

- des informations déjà déterminées par leur source ;
- des états déjà calculés ;
- des actions de navigation vers des fonctionnalités existantes.

### 4.4 Absence de service artificiel

`ADMIN-001` ne provoque pas la création d’un service uniquement destiné à relayer une information déjà disponible.

Le premier incrément ne contient donc ni `DashboardService`, ni `DashboardFacade`, ni enregistrement supplémentaire dans le Container.

Une façade ne pourra être introduite que lorsqu’une responsabilité réelle d’orchestration apparaîtra.

### 4.5 Traçabilité des sources

Chaque information affichée possède une source identifiée. Aucune information ne doit être dupliquée, simulée ou déduite à partir d’indicateurs incomplets.

### 4.6 Séparation avec la supervision

Les notions d’uptime, d’état d’un conteneur, de mémoire, de serveur ou de disponibilité d’infrastructure sont exclues tant qu’un service de diagnostic qualifié ne les fournit pas.

L’environnement Proxmox personnel du Product Owner reste explicitement hors périmètre d’AKS Platform.

---

## 5. Périmètre du premier incrément

Le premier incrément d’`ADMIN-001` est complet avec les deux cartes suivantes.

### 5.1 Carte « Informations plateforme »

**Objectif**

Présenter l’identité de la version d’AKS Platform actuellement exécutée.

**Informations affichées**

- nom de la plateforme ;
- numéro de version ;
- nom de la version.

**Source**

```javascript
AKS.Version.getReleaseInfo()
```

La version et le nom de la version proviennent exclusivement du service transversal de version.

### 5.2 Carte « Actions rapides »

**Objectif**

Donner au Dashboard son rôle de page d’accueil du Centre de pilotage.

Les actions rapides correspondent uniquement aux fonctionnalités administratives effectivement disponibles dans la version exécutée.

Une action rapide :

- réalise uniquement une navigation ;
- ne contient aucune logique métier ;
- ne déclenche aucun traitement administratif directement depuis le Dashboard ;
- n’est affichée que si sa destination existe ;
- respecte les règles d’autorisation de l’écran ciblé.

Lorsque aucune autre fonctionnalité administrative Web n’est disponible, la carte reste présente et affiche un état vide explicite.

---

## 6. Architecture du premier incrément

```text
Contrôleur administratif
        ↓
Contrôle d’autorisation côté serveur
        ↓
AKS.Version
        ↓
Modèle de présentation
        ↓
Vue Dashboard
```

Le contrôleur possède uniquement des responsabilités d’interface :

- contrôler l’autorisation ;
- obtenir les informations de version ;
- préparer le modèle de présentation ;
- rendre la vue.

Le modèle de présentation ne contient aucune fonction exécutable, aucun secret et aucune donnée métier non nécessaire.

---

## 7. Dépendances nécessaires

| Dépendance | Usage | État |
|---|---|---|
| Service transversal de version | Carte « Informations plateforme » | Disponible |
| Authentification Google | Identification de l’utilisateur | Disponible |
| Autorisation administrative côté serveur | Protection du Dashboard | Incluse dans ADMIN-001 |
| Rendu HtmlService | Affichage du Dashboard | Disponible |

Les services futurs de configuration, registre des modules, journalisation et diagnostic ne sont pas bloquants.

---

## 8. Hors périmètre

`ADMIN-001` ne comprend pas :

- l’organisation cible complète du Centre de pilotage ;
- le modèle fonctionnel des zones et des cartes ;
- le contrat `DashboardProvider` et `DashboardWidget` ;
- le service de configuration ;
- le registre des modules ;
- le service de journalisation ;
- le service de diagnostic ;
- la supervision système ;
- les métriques de performance ;
- l’administration interne des modules ;
- la gestion des utilisateurs ;
- le paramétrage métier ;
- les statistiques métier ;
- les opérations de maintenance ;
- les traitements du questionnaire santé ;
- AKS Analytics ;
- AKS Calendar.

---

## 9. Comportement attendu

Lorsqu’un administrateur autorisé accède au Dashboard :

1. l’autorisation est vérifiée côté serveur ;
2. aucune donnée administrative n’est obtenue avant cette vérification ;
3. la carte « Informations plateforme » reçoit ses données de `AKS.Version` ;
4. la carte « Actions rapides » affiche uniquement les destinations existantes ou un état vide explicite ;
5. aucune carte future n’est simulée ;
6. aucune information de supervision fictive n’est affichée ;
7. aucune logique métier n’est exécutée par l’interface.

Le Dashboard reste pleinement fonctionnel lorsque les services prévus pour ses évolutions futures ne sont pas disponibles.

---

## 10. Sécurité et journalisation

L’accès au Dashboard respecte `SECURITY-001`.

Les règles minimales sont :

- authentification obligatoire ;
- autorisation vérifiée côté serveur ;
- absence de données sensibles dans le modèle de présentation ;
- absence de secret dans le code client ;
- journalisation des refus anormaux et erreurs significatives conformément à `LOG-001` lorsqu’il est disponible.

La simple absence d’un lien dans l’interface ne constitue jamais un contrôle d’autorisation.

---

## 11. Critères d’acceptation

### 11.1 Accès

- l’accès nécessite un compte Google authentifié ;
- chaque accès administratif est autorisé côté serveur ;
- un utilisateur non autorisé reçoit le code `ADMIN001_ACCESS_DENIED` ;
- aucune donnée administrative n’est fournie avant autorisation.

### 11.2 Informations plateforme

- la carte est présente ;
- la version et le nom de la version proviennent exclusivement de `AKS.Version.getReleaseInfo()` ;
- aucune version n’est dupliquée dans l’interface ;
- les informations correspondent au runtime déployé.

### 11.3 Actions rapides

- la carte est présente ;
- seules les destinations réellement disponibles sont affichées ;
- chaque action réalise uniquement une navigation ;
- l’absence d’action disponible n’empêche pas le fonctionnement du Dashboard.

### 11.4 Architecture

- le Dashboard reste déclaratif ;
- aucune logique métier n’est intégrée ;
- aucun service artificiel n’est créé pour relayer `AKS.Version` ;
- aucune dépendance future n’est nécessaire au premier incrément ;
- aucune supervision fictive n’est affichée ;
- le Dashboard fonctionne sans les futurs services de configuration, registre, journalisation ou diagnostic.

### 11.5 Validation

- les tests automatisés `ADMIN-001` sont validés ;
- les tests du service transversal de version restent valides ;
- l’affichage est vérifié dans l’environnement Apps Script réel ;
- l’accès autorisé et le refus d’accès sont vérifiés ;
- aucune régression n’est introduite sur le questionnaire public.

---

## 12. Définition de terminé

`ADMIN-001` est terminé lorsque le premier incrément est livré, testé et documenté avec :

- la page d’accueil du Dashboard ;
- la carte « Informations plateforme » ;
- la carte « Actions rapides » ;
- le contrôle d’autorisation côté serveur ;
- les tests automatisés ;
- la validation réelle Apps Script ;
- la documentation des évolutions futures non bloquantes.

---

## 13. Références

- `ARCH-001`
- `CORE-001`
- `SECURITY-001`
- `LOG-001`
- `UX-001`
- `UI-001`
- `ADMIN-002`
- `ADMIN-003`
- `ADMIN-004`
- `ADMIN-005`

---

## 14. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.1 | 2026-07-24 | Clôture documentaire d’ADMIN-001 après validation de l’implémentation et des tests V1.1 |
| 1.2.0 | 2026-07-23 | Clarification du rôle de premier incrément, séparation avec ADMIN-002 à ADMIN-004, renforcement de la sécurité, des sources et des critères d’acceptation |
| 1.1.0 | 2026-07-19 | Référence initiale de développement du Dashboard |
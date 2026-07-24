# ADM-001 — Centre de pilotage

## Architecture fonctionnelle et principes

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## 1. Objectif

Le Centre de pilotage constitue le point d’entrée unique pour l’exploitation d’AKS Platform.

Il présente une vue consolidée de l’état de la plateforme, des modules actifs, de l’activité récente et des actions d’administration disponibles.

Il ne contient aucune logique métier propre aux modules et n’accède jamais directement à leurs données internes.

---

## 2. Principes directeurs

Le Centre de pilotage respecte les règles suivantes :

- il orchestre et affiche les informations fournies par les composants de la plateforme ;
- il ne calcule pas lui-même les indicateurs métier ;
- il ne détermine pas lui-même les alertes ;
- il ne construit pas lui-même l’historique d’activité ;
- il ne lit jamais directement les données internes d’un module ;
- il n’affiche que les fonctionnalités réellement disponibles ;
- il doit pouvoir intégrer un nouveau module sans modification structurelle de son code ;
- il reste orienté exploitation et non support technique.

---

## 3. Organisation fonctionnelle

Le Centre de pilotage est organisé en trois niveaux clairement séparés.

### 3.1 État de la plateforme

Cette zone est exclusivement informative.

Elle présente notamment :

- l’état général de la plateforme ;
- les alertes actives ;
- l’état des synchronisations ;
- l’état des sauvegardes ;
- les services disponibles ;
- la version fonctionnelle déployée.

Aucune action d’administration n’est exécutée depuis cette zone.

### 3.2 Vue des modules

Chaque module actif publie une synthèse normalisée de son activité.

Exemples :

```text
Questionnaire santé
142 traitements
0 erreur
Dernière activité : il y a 10 minutes
```

```text
AKS Analytics
137 licenciés
89 % de présence
4 rapports disponibles
```

Cette zone reste en lecture seule.

Les modules non installés ou non activés peuvent être représentés sous forme de tuiles grisées, sans action disponible.

### 3.3 Actions rapides

Cette zone regroupe uniquement les fonctions d’administration réellement disponibles.

Pour la V1.1, elle peut contenir :

- Paramétrage ;
- Journalisation ;
- Maintenance ;
- Diagnostic.

La gestion des utilisateurs n’est pas affichée tant qu’un véritable module de gestion des comptes et des droits n’existe pas.

---

## 4. Répartition des responsabilités

### 4.1 Modules métier

Chaque module métier publie sa propre synthèse.

Il reste propriétaire :

- de ses indicateurs ;
- de ses statuts ;
- de sa dernière activité ;
- de ses éventuelles actions autorisées.

Le Centre de pilotage ne connaît pas la structure interne du module.

### 4.2 AKS Logger

L’activité récente est fournie exclusivement par le service de journalisation.

```text
Centre de pilotage
        ↓
AKS Logger / LOG-001
        ↓
Historique consolidé
```

Le Centre de pilotage se limite à afficher les événements retournés.

### 4.3 AlertService

Les alertes sont fournies par un service dédié.

```text
Centre de pilotage
        ↓
AlertService
        ↓
Alertes actives
```

Le Centre de pilotage ne définit ni les seuils, ni la gravité, ni les règles de déclenchement.

Tant que `AlertService` n’est pas disponible, la zone d’alertes peut indiquer qu’aucune source d’alerte n’est configurée.

### 4.4 AKS Core

AKS Core assure :

- la découverte des fournisseurs déclarés ;
- l’agrégation des synthèses ;
- le contrôle de disponibilité des modules ;
- l’exposition des données au Centre de pilotage ;
- la gestion des erreurs d’agrégation.

Le Centre de pilotage ne dialogue pas directement avec les modules.

---

## 5. Contrat de publication des modules

Chaque module souhaitant apparaître dans le Centre de pilotage implémente un contrat commun nommé :

```javascript
DashboardProvider
```

Le contrat minimal repose sur :

```javascript
getDashboardSummary()
```

Cette méthode retourne une structure normalisée contenant uniquement les informations nécessaires à l’affichage.

Exemple conceptuel :

```javascript
{
  id: "health-questionnaire",
  title: "Questionnaire santé",
  status: "operational",
  metrics: [
    { label: "Questionnaires", value: 142 },
    { label: "Erreurs", value: 0 }
  ],
  lastActivity: "2026-07-23T16:40:00+02:00"
}
```

Un contrat complémentaire peut être ajouté ultérieurement :

```javascript
getDashboardWidget()
```

Ce contrat doit retourner une description structurée du widget et jamais du code HTML ou JavaScript exécutable.

Le Centre de pilotage conserve ainsi la maîtrise du rendu, de la sécurité et de la cohérence UX.

---

## 6. Navigation

Le Centre de pilotage devient la page d’entrée de l’espace d’administration.

La navigation V1.1 reste limitée aux fonctions réellement présentes :

```text
Accueil

Administration
   Centre de pilotage
   Paramétrage
   Journalisation

Maintenance
   Diagnostic
   À propos
```

Les entrées liées à de futurs modules apparaissent uniquement lorsque ces modules sont disponibles ou peuvent être affichées grisées dans la vue des capacités de la plateforme.

---

## 7. Informations techniques

Les informations suivantes ne sont pas affichées dans la vue principale :

- branche Git ;
- version Apps Script ;
- date détaillée du dernier déploiement ;
- version du connecteur WordPress ;
- informations destinées au support.

Elles sont regroupées dans un écran dédié `Diagnostic` ou `À propos`.

Le Centre de pilotage reste ainsi orienté exploitation quotidienne.

---

## 8. Gestion des erreurs

Une erreur provenant d’un module ne doit jamais empêcher l’affichage du Centre de pilotage.

AKS Core doit :

- isoler les erreurs par fournisseur ;
- journaliser l’erreur ;
- retourner un état dégradé pour le module concerné ;
- poursuivre l’agrégation des autres modules.

Exemple :

```text
AKS Analytics
État : indisponible
Impossible de charger la synthèse
```

---

## 9. Périmètre de la première livraison

La première version du Centre de pilotage doit fournir au minimum :

- une page d’entrée unique ;
- les trois niveaux d’affichage ;
- une zone d’état de la plateforme ;
- une vue des modules disponibles ;
- les accès rapides vers Paramétrage et Journalisation ;
- l’activité récente issue d’AKS Logger ;
- un mécanisme d’agrégation tolérant aux erreurs ;
- un premier `DashboardProvider` pour le module Questionnaire santé.

Les fonctionnalités suivantes restent hors périmètre initial :

- gestion des comptes utilisateurs ;
- personnalisation libre des widgets ;
- déplacement des widgets par glisser-déposer ;
- règles d’alertes configurables ;
- administration directe des modules depuis les cartes de synthèse.

---

## 10. Critères d’acceptation

ADM-001 est considéré comme validé lorsque les principes suivants sont retenus :

- le composant est nommé « Centre de pilotage » ;
- la séparation entre information, vue des modules et actions est respectée ;
- aucune donnée métier n’est lue directement ;
- les modules publient leurs informations par contrat ;
- AKS Core assure l’agrégation ;
- AKS Logger fournit l’activité récente ;
- AlertService fournit les alertes ;
- les informations techniques détaillées sont déplacées vers Diagnostic ou À propos ;
- une erreur d’un fournisseur ne bloque jamais l’ensemble du Centre de pilotage.

---

## 11. Suite du chantier

Les livrables suivants sont :

- `ADM-002` — Interface utilisateur et navigation ;
- `ADM-003` — Contrat `DashboardProvider` ;
- `ADM-004` — Intégration et orchestration dans AKS Core ;
- `ADM-005` — Validation, tests et documentation.

Ces livrables doivent conduire rapidement à une implémentation fonctionnelle, sans ouvrir un nouveau cycle documentaire disproportionné.

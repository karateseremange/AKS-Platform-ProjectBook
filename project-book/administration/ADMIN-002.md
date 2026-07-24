# ADMIN-002 — Interface utilisateur et navigation du Centre de pilotage

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-002 |
| **Version** | 1.2.0 |
| **Statut** | Référence de développement |
| **Nature** | Spécification fonctionnelle d’interface et de navigation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit exclusivement l’organisation de l’interface utilisateur, la structure de navigation et les règles communes de déplacement dans le Centre de pilotage d’AKS Platform.

Il complète `ADMIN-001`, qui décrit le premier incrément livrable du Dashboard.

Il ne définit pas :

- le modèle fonctionnel détaillé des zones, cartes et états, qui relève de `ADMIN-003` ;
- le contrat d’extension des modules, qui relève de `ADMIN-004` ;
- le référentiel de validation, qui relève de `ADMIN-005`.

---

## 2. Références applicables

`ADMIN-002` applique :

- `ARCH-001` pour l’organisation générale de la plateforme ;
- `CORE-001` pour les services communs ;
- `SECURITY-001` pour les contrôles d’accès ;
- `CONFIG-001` pour les paramètres administrables ;
- `LOG-001` pour les informations de journalisation ;
- `UX-001` pour les principes d’expérience utilisateur ;
- `UI-001` pour les composants et règles visuelles.

Aucun principe transverse n’est redéfini localement.

---

## 3. Finalité

Le Centre de pilotage constitue le point d’entrée principal de l’administration d’AKS Platform.

Il permet à un administrateur autorisé de :

- identifier les capacités administratives réellement disponibles ;
- accéder aux écrans de la plateforme ;
- retrouver une structure de navigation stable et cohérente ;
- revenir facilement au Centre de pilotage ;
- comprendre sa position dans l’espace d’administration.

Le Centre de pilotage reste un point de navigation et de présentation. Il n’exécute aucune logique métier.

---

## 4. Principes de conception

### 4.1 Application des contrats transverses

L’interface respecte obligatoirement `UX-001` et `UI-001`.

Aucun module ne définit localement une variante incompatible de la navigation administrative.

### 4.2 Navigation déclarative

La navigation affiche uniquement des destinations existantes et autorisées dans la version exécutée.

Elle ne calcule, ne déduit et ne simule aucune fonctionnalité.

### 4.3 Absence de couplage métier

Le Centre de pilotage ne consulte jamais directement les données internes d’un module pour construire sa navigation.

Les entrées de module proviennent exclusivement des déclarations ou contrats publics prévus par AKS Core.

### 4.4 Progressivité

L’interface reste fonctionnelle lorsqu’un service ou un module facultatif n’est pas disponible.

Une destination absente n’est ni simulée ni remplacée par un lien inactif trompeur.

### 4.5 Contrôle côté serveur

La visibilité d’un lien améliore l’expérience utilisateur mais ne constitue jamais une autorisation.

Chaque destination réapplique ses propres contrôles côté serveur.

---

## 5. Structure générale de navigation

La navigation administrative suit l’organisation fonctionnelle cible suivante :

```text
Centre de pilotage

Administration
    Paramétrage
    Journalisation

Modules
    Questionnaire Santé
    Analytics
    Calendar
    Grades

Maintenance
    Diagnostic
    À propos
```

Cette structure est une cible fonctionnelle. Seules les destinations réellement disponibles dans la version exécutée sont affichées.

Les modules apparaissent uniquement lorsqu’ils sont installés, actifs, déclarés auprès d’AKS Core et accessibles à l’utilisateur courant.

---

## 6. Zones de navigation

### 6.1 Accès au Centre de pilotage

Le Centre de pilotage est l’accueil de l’espace d’administration.

Il doit être accessible depuis toute page administrative, sauf contrainte technique temporaire explicitement documentée.

### 6.2 Navigation principale

La navigation principale présente les grandes familles fonctionnelles :

- Administration ;
- Modules ;
- Maintenance.

Ces familles servent uniquement à organiser les destinations. Elles ne portent aucune logique métier.

### 6.3 Actions rapides

Les actions rapides fournissent des raccourcis vers des destinations existantes.

Elles :

- réalisent uniquement une navigation ;
- respectent les autorisations de la destination ;
- disparaissent lorsque leur destination n’existe pas ;
- ne déclenchent pas directement de traitement destructif ou irréversible.

### 6.4 Retour et orientation

Chaque écran administratif fournit :

- un moyen explicite de revenir au Centre de pilotage ;
- un titre clair ;
- une indication suffisante de la section courante ;
- une navigation cohérente avec les autres écrans.

---

## 7. Règles de navigation

### 7.1 Destination existante

Aucun lien ne doit conduire vers un écran inexistant, désactivé ou non disponible.

### 7.2 Autorisation

Chaque écran applique ses propres règles d’accès côté serveur.

Un lien non visible ne dispense jamais de ce contrôle.

### 7.3 Cohérence

La position, le libellé et le comportement des éléments de navigation restent cohérents dans l’ensemble de l’espace d’administration.

### 7.4 Absence de traitement métier

Une action de navigation ne réalise aucun traitement métier avant l’ouverture de sa destination.

### 7.5 Liens externes

Un lien externe doit :

- être explicitement identifié comme tel ;
- utiliser une destination approuvée ;
- ne jamais contenir de secret ;
- respecter les règles de sécurité et de confidentialité applicables.

### 7.6 Documents

L’ouverture d’un document respecte `DOCUMENT-001` et les autorisations associées.

---

## 8. Sources des entrées de navigation

| Élément | Source responsable |
|---|---|
| Identité et version | Service transversal de version d’AKS Core |
| Paramétrage | Service conforme à `CONFIG-001` |
| Journalisation | Service conforme à `LOG-001` |
| Diagnostic | Service de diagnostic lorsqu’il existe |
| Modules disponibles | Registre des modules d’AKS Core |
| Actions publiées par les modules | Contrat défini par `ADMIN-004` |

Chaque entrée doit posséder une source identifiée et une destination réelle.

---

## 9. Responsive et accessibilité

La navigation est utilisable sur ordinateur, tablette et smartphone.

L’adaptation responsive peut modifier :

- la disposition ;
- le mode d’ouverture du menu ;
- la présentation des regroupements.

Elle ne modifie pas :

- le sens des destinations ;
- les autorisations ;
- l’ordre logique de lecture ;
- les actions disponibles.

L’interface doit notamment :

- être utilisable au clavier ;
- conserver un ordre de navigation logique ;
- fournir des libellés explicites ;
- présenter un focus visible ;
- rester compréhensible sans dépendre uniquement de la couleur ou d’une icône ;
- être compatible avec les technologies d’assistance.

---

## 10. Responsabilités

### 10.1 Centre de pilotage

Il est responsable :

- de la structure générale de navigation ;
- de la présentation des destinations disponibles ;
- de la cohérence des libellés et parcours ;
- de l’application de `UX-001` et `UI-001` ;
- du retour vers l’accueil administratif.

### 10.2 Services et modules

Ils sont responsables :

- de déclarer leurs destinations ;
- de fournir des libellés compréhensibles ;
- d’appliquer les contrôles d’accès ;
- de maintenir leurs écrans de destination ;
- de retirer ou désactiver une entrée lorsque sa destination n’est plus disponible.

### 10.3 Product Owner

Il valide :

- la structure fonctionnelle ;
- les libellés ;
- l’ordre des familles ;
- les exceptions de navigation ;
- les évolutions incompatibles.

---

## 11. Hors périmètre

`ADMIN-002` ne définit pas :

- le détail des zones de contenu du Dashboard ;
- le cycle de vie des cartes ;
- les états fonctionnels des widgets ;
- le contrat `DashboardProvider` et `DashboardWidget` ;
- l’implémentation des services de configuration, journalisation ou diagnostic ;
- les règles métier des modules ;
- la gestion des utilisateurs ;
- la supervision d’infrastructure ;
- les écrans détaillés de chaque fonction administrative.

---

## 12. Critères d’acceptation

`ADMIN-002` est respecté lorsque :

- le Centre de pilotage constitue le point d’entrée de l’administration ;
- la structure Administration / Modules / Maintenance est cohérente ;
- seules les destinations réellement disponibles sont affichées ;
- les modules absents ou inactifs ne sont pas présentés ;
- chaque écran fournit un retour explicite vers le Centre de pilotage ;
- les liens ne déclenchent aucune logique métier locale ;
- les contrôles d’autorisation sont réappliqués côté serveur ;
- les liens externes sont identifiés et sécurisés ;
- l’interface respecte `UX-001` et `UI-001` ;
- la navigation reste utilisable sur ordinateur, tablette et smartphone ;
- aucune information fictive ou destination inexistante n’est présentée.

---

## 13. Définition de terminé

`ADMIN-002` est terminé lorsque :

- la structure de navigation est validée ;
- les familles et destinations sont définies ;
- les règles de retour et d’orientation sont documentées ;
- les responsabilités et limites sont explicites ;
- les contrôles d’accessibilité et responsive sont validés ;
- les critères d’acceptation sont utilisables pour l’implémentation.

---

## 14. Références

- `ARCH-001`
- `CORE-001`
- `SECURITY-001`
- `CONFIG-001`
- `LOG-001`
- `DOCUMENT-001`
- `UX-001`
- `UI-001`
- `ADMIN-001`
- `ADMIN-003`
- `ADMIN-004`
- `ADMIN-005`

---

## 15. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.0 | 2026-07-23 | Recentrage sur l’interface et la navigation, suppression des chevauchements avec ADMIN-003, ajout des responsabilités et règles de sécurité |
| 1.1.0 | 2026-07-23 | Première spécification de l’interface et de la navigation |
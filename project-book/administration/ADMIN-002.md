# ADMIN-002 — Interface utilisateur et navigation du Centre de pilotage

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-002 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Nature** | Spécification fonctionnelle d’interface |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit l’organisation de l’interface utilisateur et de la navigation du Centre de pilotage d’AKS Platform.

Il complète `ADMIN-001`, qui décrit le premier incrément du Dashboard d’administration.

`ADMIN-002` ne redéfinit aucun principe transverse. Il applique les références fondatrices suivantes :

- `ARCH-001` pour l’organisation générale de la plateforme ;
- `CORE-001` pour les services communs ;
- `CONFIG-001` pour les paramètres administrables ;
- `LOG-001` pour les informations de journalisation ;
- `UX-001` pour les principes d’expérience utilisateur ;
- `UI-001` pour les composants et règles visuelles.

---

## 2. Finalité

Le Centre de pilotage constitue le point d’entrée principal de l’administration d’AKS Platform.

Il permet à un administrateur autorisé de :

- identifier l’état fonctionnel général de la plateforme ;
- accéder aux fonctionnalités administratives disponibles ;
- consulter les informations synthétiques publiées par les modules ;
- rejoindre les écrans de paramétrage, de journalisation et de diagnostic lorsqu’ils existent.

Le Centre de pilotage reste un agrégateur d’informations et un point de navigation. Il n’exécute aucune logique métier.

---

## 3. Principes de conception

### 3.1 Application des contrats transverses

L’interface respecte obligatoirement `UX-001` et `UI-001`.

Aucun module ne définit localement une variante du Centre de pilotage ou de ses composants communs.

### 3.2 Architecture déclarative

Le Centre de pilotage affiche uniquement :

- des informations déjà déterminées par leurs services sources ;
- des états déjà calculés ;
- des actions de navigation vers des destinations existantes.

Il ne calcule, ne déduit et ne simule aucune information.

### 3.3 Absence de couplage métier

Le Centre de pilotage ne consulte jamais directement les données internes d’un module.

Les informations de module sont obtenues exclusivement par les contrats publics prévus à cet effet.

### 3.4 Progressivité

L’interface reste fonctionnelle lorsqu’un service ou un module facultatif n’est pas disponible.

Une fonctionnalité absente n’est ni simulée ni remplacée par une donnée fictive.

---

## 4. Organisation générale de l’interface

Le Centre de pilotage est organisé en trois zones fonctionnelles.

### 4.1 État de la plateforme

Cette zone présente les informations transverses disponibles sur la plateforme.

Elle peut notamment contenir :

- l’identité et la version exécutée ;
- l’état des services communs lorsqu’un service de diagnostic le fournit ;
- les alertes administratives actives ;
- les informations de configuration utiles à l’administration.

Cette zone est en lecture seule.

Aucune information technique d’infrastructure n’est affichée sans service source explicitement responsable de son calcul.

### 4.2 Vue des modules

Cette zone présente les synthèses déclarées par les modules installés.

Chaque module peut publier un ou plusieurs widgets selon le contrat défini dans `ADMIN-003`.

Le Centre de pilotage :

- reçoit les widgets déclarés ;
- applique les règles de présentation de `UI-001` ;
- organise leur affichage ;
- ne connaît pas leur logique métier.

### 4.3 Actions rapides

Cette zone regroupe les points d’entrée vers les fonctions administratives réellement disponibles.

Les actions initialement envisagées sont :

- Paramétrage ;
- Journalisation ;
- Diagnostic ;
- À propos.

Une action :

- réalise uniquement une navigation ;
- n’est affichée que si sa destination existe ;
- respecte les règles d’autorisation de l’écran ciblé ;
- ne déclenche aucun traitement métier directement depuis le Dashboard.

---

## 5. Navigation principale

La navigation administrative suit la structure logique suivante :

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

Cette structure représente une organisation fonctionnelle cible. Seules les destinations réellement disponibles dans la version exécutée sont affichées.

Les modules apparaissent dans la navigation uniquement lorsqu’ils sont installés, actifs et déclarés auprès d’AKS Core.

---

## 6. Règles de navigation

### 6.1 Destination existante

Aucun lien ne doit conduire vers un écran inexistant ou non disponible.

### 6.2 Autorisation

L’affichage d’un lien ne remplace jamais le contrôle d’autorisation côté serveur.

Chaque écran administratif applique ses propres règles d’accès.

### 6.3 Retour au Centre de pilotage

Chaque écran administratif fournit un moyen explicite de revenir au Centre de pilotage.

### 6.4 Navigation cohérente

La position, le libellé et le comportement des éléments de navigation restent cohérents dans l’ensemble de l’espace d’administration.

### 6.5 Absence de traitement métier

Une action de navigation ne réalise aucun traitement métier avant l’ouverture de sa destination.

---

## 7. Widgets du Centre de pilotage

Chaque widget est présenté à l’aide du composant `AKS.UI.Card` défini dans `UI-001`.

La carte comporte obligatoirement :

- un en-tête ;
- un contenu.

Elle peut également comporter :

- un état ;
- des indicateurs ;
- des actions ;
- un pied de carte.

Le Centre de pilotage ne crée aucune présentation spécifique à un module en dehors des composants du Design System.

---

## 8. États fonctionnels

Les états affichés utilisent exclusivement les états normalisés de `UI-001` :

- Succès ;
- Information ;
- Attention ;
- Incident ;
- Désactivé.

Chaque état comporte un libellé textuel. Aucune information essentielle ne repose uniquement sur la couleur.

Le Centre de pilotage affiche l’état fourni par sa source. Il ne le recalcule pas.

---

## 9. Sources d’information

| Élément affiché | Source responsable |
|---|---|
| Identité et version de la plateforme | Service transversal de version d’AKS Core |
| Paramètres administrables | Service de configuration conforme à `CONFIG-001` |
| Activité récente | Service de journalisation conforme à `LOG-001` |
| État technique fonctionnel | Service de diagnostic lorsqu’il existe |
| Synthèses des modules | Contrats de Dashboard définis dans `ADMIN-003` |
| Alertes administratives | Service responsable de l’alerte |

Chaque information affichée doit posséder une source identifiée et traçable.

---

## 10. Responsive et accessibilité

Le Centre de pilotage est utilisable sur ordinateur, tablette et smartphone.

L’adaptation responsive modifie la disposition des zones et des cartes sans modifier leur comportement fonctionnel.

L’interface applique le principe *Accessibility by Design* défini dans `UI-001`.

Elle doit notamment :

- être utilisable au clavier ;
- conserver un ordre de navigation logique ;
- fournir des libellés explicites ;
- présenter des contrastes suffisants ;
- rester compréhensible sans dépendre uniquement de la couleur ;
- être compatible avec les technologies d’assistance.

---

## 11. Responsabilités

### 11.1 Le Centre de pilotage est responsable de

- l’organisation générale de l’interface administrative ;
- l’agrégation des informations fournies par les contrats publics ;
- la présentation homogène des widgets ;
- la navigation vers les fonctionnalités disponibles ;
- l’application de `UX-001` et `UI-001`.

### 11.2 Le Centre de pilotage n’est pas responsable de

- calculer des indicateurs métier ;
- interpréter les données d’un module ;
- consulter directement les stockages des modules ;
- modifier l’état d’un module ;
- administrer une infrastructure ;
- simuler des informations indisponibles ;
- remplacer les contrôles d’autorisation côté serveur.

---

## 12. Périmètre d’implémentation

`ADMIN-002` définit l’organisation cible de l’interface et de la navigation.

Son implémentation peut être progressive.

Le premier incrément reste celui défini dans `ADMIN-001` :

- carte « Informations plateforme » ;
- carte « Actions rapides » ;
- contrôle d’autorisation côté serveur.

Les zones, entrées de navigation et widgets supplémentaires sont ajoutés uniquement lorsque leurs services sources et leurs destinations existent réellement.

---

## 13. Hors périmètre

`ADMIN-002` ne définit pas :

- le contrat technique des widgets ;
- le registre des modules ;
- l’implémentation des services de configuration, journalisation ou diagnostic ;
- les règles métier des modules ;
- la gestion des utilisateurs ;
- la supervision d’infrastructure ;
- les écrans détaillés de chaque fonction administrative.

Le contrat technique des widgets et de leurs fournisseurs est défini dans `ADMIN-003`.

---

## 14. Critères d’acceptation

`ADMIN-002` est respecté lorsque :

- le Centre de pilotage constitue le point d’entrée de l’espace d’administration ;
- l’interface respecte `UX-001` et `UI-001` ;
- les informations proviennent exclusivement de services ou contrats identifiés ;
- aucun indicateur métier n’est calculé par l’interface ;
- aucune donnée de module n’est consultée directement ;
- les widgets utilisent `AKS.UI.Card` ;
- seules les destinations existantes sont affichées ;
- les contrôles d’autorisation restent exécutés côté serveur ;
- l’absence d’un module ou d’un service facultatif ne bloque pas le Centre de pilotage ;
- aucune information fictive ou simulée n’est présentée ;
- l’interface reste utilisable sur ordinateur, tablette et smartphone ;
- les exigences d’accessibilité de `UI-001` sont appliquées.

---

## 15. Définition de terminé

`ADMIN-002` est terminé lorsque :

- l’organisation de l’interface est validée ;
- la structure de navigation est validée ;
- les responsabilités et limites du Centre de pilotage sont explicites ;
- les règles de présentation des widgets sont définies ;
- les critères d’acceptation sont utilisables pour l’implémentation ;
- le document est publié dans le Project Book sur la branche de développement.

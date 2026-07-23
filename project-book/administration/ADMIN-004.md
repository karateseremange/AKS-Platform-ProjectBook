# ADMIN-004 — Contrat DashboardProvider et DashboardWidget

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-004 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Nature** | Contrat d’extension du Centre de pilotage |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit le contrat permettant aux modules d’AKS Platform de publier des contenus dans le Centre de pilotage.

Il formalise deux abstractions complémentaires :

- `DashboardProvider`, qui expose un ensemble de widgets pour un module ou un service transverse ;
- `DashboardWidget`, qui représente une unité d’information ou d’action affichable dans le Centre de pilotage.

`ADMIN-004` complète :

- `ADMIN-001`, qui définit le Dashboard d’administration ;
- `ADMIN-002`, qui définit son interface utilisateur et sa navigation ;
- `ADMIN-003`, qui définit le modèle fonctionnel du Centre de pilotage.

---

## 2. Principes directeurs

Le contrat d’extension respecte les principes suivants :

- absence de dépendance directe entre le Centre de pilotage et les modules métier ;
- absence de logique métier dans les widgets ;
- publication déclarative des contenus ;
- traçabilité de la source de chaque widget ;
- isolation des erreurs par fournisseur ;
- compatibilité avec `CORE-001`, `UX-001` et `UI-001` ;
- dégradation maîtrisée lorsqu’un fournisseur est indisponible.

Le Centre de pilotage orchestre l’affichage. Il ne devient jamais propriétaire des données publiées.

---

## 3. Rôles et responsabilités

### 3.1 Centre de pilotage

Le Centre de pilotage :

- découvre les fournisseurs enregistrés ;
- demande à chaque fournisseur les widgets accessibles dans le contexte courant ;
- valide la conformité minimale des descriptions reçues ;
- trie et compose les widgets ;
- applique les règles d’autorisation et d’affichage ;
- isole les erreurs d’un fournisseur ;
- rend les widgets avec les composants définis par `UI-001`.

Il ne :

- calcule aucune donnée métier ;
- interroge directement les stockages métier ;
- transforme une information métier en décision ;
- corrige ou complète les données d’un fournisseur ;
- crée de dépendance vers un module particulier.

### 3.2 DashboardProvider

Un `DashboardProvider` représente une source identifiée de widgets.

Il :

- appartient à un module ou à un service transverse unique ;
- possède un identifiant stable ;
- expose uniquement les widgets dont il maîtrise la source ;
- applique les autorisations nécessaires avant publication ;
- transforme les données de son domaine en modèles de présentation déclaratifs ;
- signale explicitement les états vide, indisponible ou erreur.

Il ne :

- rend directement du HTML ;
- manipule la vue du Centre de pilotage ;
- modifie les widgets d’un autre fournisseur ;
- déclenche un traitement métier lors de la simple consultation du Dashboard ;
- contourne les contrats de services de son module.

### 3.3 DashboardWidget

Un `DashboardWidget` est une description immuable d’un contenu à afficher.

Il contient uniquement les informations nécessaires à sa présentation, à sa priorité, à son état et à ses actions de navigation.

Un widget ne possède aucune capacité d’accès direct aux données et aucune logique métier exécutable.

---

## 4. Contrat DashboardProvider

### 4.1 Interface fonctionnelle minimale

Tout fournisseur expose les opérations conceptuelles suivantes :

```text
DashboardProvider
├── getProviderId()
├── getProviderMetadata()
└── getWidgets(context)
```

### 4.2 getProviderId()

Retourne un identifiant :

- unique dans la plateforme ;
- stable dans le temps ;
- indépendant du libellé affiché ;
- composé de caractères techniques normalisés.

Exemple :

```text
aks.analytics.dashboard
```

### 4.3 getProviderMetadata()

Retourne les métadonnées déclaratives du fournisseur :

| Propriété | Obligatoire | Description |
|---|---|---|
| `providerId` | Oui | Identifiant stable du fournisseur |
| `moduleId` | Oui | Module ou service propriétaire |
| `label` | Oui | Libellé fonctionnel |
| `version` | Oui | Version du contrat implémenté |
| `enabled` | Oui | Disponibilité fonctionnelle du fournisseur |

### 4.4 getWidgets(context)

Retourne une collection de `DashboardWidget` adaptée au contexte courant.

Le contexte peut contenir :

- l’identité de l’utilisateur autorisé ;
- ses rôles ou permissions utiles ;
- la langue ou les préférences d’affichage ;
- les capacités disponibles dans la version exécutée ;
- les informations de navigation nécessaires.

Le contexte ne fournit jamais un accès générique aux données internes de la plateforme.

---

## 5. Contrat DashboardWidget

### 5.1 Structure minimale

```text
DashboardWidget
├── identity
├── source
├── placement
├── presentation
├── state
├── content
└── actions
```

### 5.2 Propriétés obligatoires

| Propriété | Description |
|---|---|
| `widgetId` | Identifiant stable et unique du widget |
| `providerId` | Identifiant du fournisseur |
| `type` | Type de widget supporté |
| `zone` | Zone fonctionnelle définie par `ADMIN-003` |
| `title` | Titre affiché |
| `state` | État normalisé du widget |
| `priority` | Priorité d’affichage |
| `content` | Modèle de contenu déclaratif |

### 5.3 Propriétés optionnelles

| Propriété | Description |
|---|---|
| `subtitle` | Information secondaire |
| `status` | Badge ou état synthétique |
| `metrics` | Indicateurs chiffrés déjà calculés par la source |
| `actions` | Actions de navigation autorisées |
| `footer` | Information complémentaire |
| `updatedAt` | Date de fraîcheur de l’information |
| `accessibilityLabel` | Libellé d’accessibilité complémentaire |

### 5.4 Types initiaux

Les types initiaux sont :

- `information` ;
- `metric` ;
- `status` ;
- `navigation` ;
- `notification` ;
- `empty-state`.

L’ajout d’un nouveau type doit répondre à plusieurs cas d’usage réels et respecter la gouvernance de `UI-001`.

---

## 6. États normalisés

Un widget utilise exclusivement les états définis par `ADMIN-003` :

- `loading` ;
- `available` ;
- `empty` ;
- `unavailable` ;
- `error` ;
- `access-denied`.

Le fournisseur détermine l’état fonctionnel de son widget.

Le Centre de pilotage peut remplacer cet état par `error` uniquement lorsque le fournisseur ne respecte pas le contrat ou provoque une erreur non gérée.

Aucun état ne doit être déduit d’une absence ambiguë de données.

---

## 7. Contenu déclaratif

Le contenu d’un widget est un modèle de présentation sérialisable.

Il ne contient pas :

- de fonction exécutable ;
- de fragment HTML fourni par un module ;
- de script client ;
- de référence directe à une ressource interne non autorisée ;
- de données sensibles inutiles à l’affichage.

Le rendu final relève exclusivement du Centre de pilotage et des composants `UI-001`.

---

## 8. Actions

Une action de widget est déclarative.

Elle contient au minimum :

| Propriété | Description |
|---|---|
| `actionId` | Identifiant stable |
| `label` | Libellé utilisateur |
| `type` | Type d’action autorisé |
| `target` | Destination déclarée |

Les types initiaux autorisés sont :

- `navigate` ;
- `open-document` ;
- `open-external`.

Une action du Dashboard ne déclenche jamais directement un traitement métier destructif ou irréversible.

Toute destination réapplique ses propres contrôles d’autorisation côté serveur.

---

## 9. Enregistrement des fournisseurs

Les fournisseurs sont enregistrés dans un registre transverse maîtrisé par AKS Core.

Le registre :

- associe un `providerId` unique à une implémentation ;
- refuse les doublons ;
- permet l’activation ou la désactivation contrôlée ;
- expose uniquement les fournisseurs valides ;
- ne contient aucune logique métier propre aux modules.

L’enregistrement est réalisé lors de l’initialisation de la plateforme ou du module.

Le Centre de pilotage ne recherche pas dynamiquement des fonctions par nom et ne parcourt pas le namespace global.

---

## 10. Isolation et gestion des erreurs

L’échec d’un fournisseur ne doit pas empêcher l’affichage des widgets des autres fournisseurs.

Pour chaque fournisseur :

1. l’appel est isolé ;
2. les erreurs sont journalisées conformément à `LOG-001` ;
3. les détails techniques ne sont pas exposés à l’utilisateur ;
4. un état d’indisponibilité ou d’erreur peut être affiché ;
5. la composition du Dashboard se poursuit.

Le code d’erreur fonctionnel recommandé est :

```text
ADMIN004_PROVIDER_FAILURE
```

Un contrat invalide utilise :

```text
ADMIN004_INVALID_WIDGET
```

---

## 11. Autorisation et confidentialité

Chaque fournisseur filtre ses widgets selon les droits du contexte courant.

Le Centre de pilotage applique en complément les contrôles généraux d’accès à l’administration.

Règles :

- aucun widget interdit ne doit être retourné puis simplement masqué côté client ;
- aucune donnée sensible ne doit être incluse dans un widget non autorisé ;
- les actions conservent un contrôle d’autorisation côté destination ;
- les erreurs ne révèlent ni structure interne ni données métier.

---

## 12. Ordonnancement et composition

Le Centre de pilotage compose les widgets selon :

1. la zone fonctionnelle ;
2. la priorité déclarée ;
3. un ordre stable déterminé par `widgetId` en cas d’égalité.

Un fournisseur ne peut imposer l’ordre absolu des widgets des autres fournisseurs.

La priorité est une indication de composition, pas un droit de préemption sur l’interface.

---

## 13. Compatibilité et version du contrat

Chaque fournisseur déclare la version du contrat qu’il implémente.

Pour V1.1, la version de contrat attendue est :

```text
1.0
```

Une évolution incompatible du contrat nécessite :

- une nouvelle version explicite ;
- une stratégie de compatibilité ou de migration ;
- une mise à jour documentaire ;
- des tests de non-régression.

---

## 14. Exemple conceptuel

```javascript
{
  providerId: 'aks.analytics.dashboard',
  moduleId: 'AKS_ANALYTICS',
  version: '1.0',
  widgets: [
    {
      widgetId: 'analytics.licensed-members',
      providerId: 'aks.analytics.dashboard',
      type: 'metric',
      zone: 'overview',
      title: 'Licenciés',
      state: 'available',
      priority: 100,
      content: {
        value: 137,
        label: 'licenciés enregistrés'
      },
      actions: [
        {
          actionId: 'open-analytics',
          label: 'Voir les statistiques',
          type: 'navigate',
          target: 'analytics'
        }
      ]
    }
  ]
}
```

Cet exemple illustre la forme du contrat. Il ne constitue pas une implémentation définitive d’AKS Analytics.

---

## 15. Hors périmètre

`ADMIN-004` ne définit pas :

- l’implémentation technique du registre dans AKS Core ;
- le protocole de chargement client ;
- les composants graphiques eux-mêmes ;
- les données métier publiées par chaque module ;
- les règles métier des modules ;
- les traitements déclenchés depuis les écrans de destination ;
- la personnalisation libre du Dashboard par utilisateur ;
- un système de plugins externes.

---

## 16. Critères d’acceptation

### 16.1 Fournisseurs

- chaque fournisseur possède un identifiant unique et stable ;
- chaque fournisseur appartient à un module ou service identifié ;
- aucun fournisseur ne rend directement du HTML ;
- un fournisseur filtre ses contenus avant leur retour.

### 16.2 Widgets

- chaque widget respecte la structure minimale ;
- chaque widget possède une source traçable ;
- les états sont explicites et normalisés ;
- le contenu est déclaratif et sérialisable ;
- aucune logique métier exécutable n’est intégrée au widget.

### 16.3 Centre de pilotage

- les fournisseurs sont découverts via un registre explicite ;
- une erreur fournisseur n’interrompt pas l’ensemble du Dashboard ;
- l’ordre d’affichage est stable ;
- les composants `UI-001` assurent le rendu ;
- aucune dépendance directe vers un module métier n’est introduite.

### 16.4 Sécurité

- les contrôles d’autorisation sont réalisés côté serveur ;
- les widgets non autorisés ne sont jamais transmis ;
- les destinations réappliquent leurs propres contrôles ;
- aucun détail technique sensible n’est exposé.

### 16.5 Validation

- les contrats sont couverts par des tests automatisés ;
- les cas fournisseur valide, vide, indisponible, invalide et en erreur sont testés ;
- les doublons de `providerId` et `widgetId` sont refusés ;
- les tests existants d’ADMIN-001 restent valides ;
- aucune régression n’est introduite sur les modules publics.

---

## 17. Définition de terminé

`ADMIN-004` est terminé lorsque :

- les contrats `DashboardProvider` et `DashboardWidget` sont implémentés ;
- le registre des fournisseurs existe dans AKS Core ;
- le Centre de pilotage consomme exclusivement ce registre ;
- au moins un fournisseur transverse et un fournisseur de module peuvent être intégrés sans dépendance directe ;
- l’isolation des erreurs est validée ;
- les contrôles d’autorisation sont testés ;
- la conformité à `ADMIN-001`, `ADMIN-002`, `ADMIN-003`, `CORE-001`, `LOG-001`, `UX-001` et `UI-001` est démontrée.
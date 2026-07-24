# ADMIN-004 — Contrat DashboardProvider et DashboardWidget

| Propriété | Valeur |
|---|---|
| **Document ID** | ADMIN-004 |
| **Version** | 1.2.0 |
| **Statut** | Référence de développement |
| **Nature** | Contrat d’extension du Centre de pilotage |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit exclusivement le contrat permettant aux modules et services transverses d’AKS Platform de publier des contenus dans le Centre de pilotage.

Il formalise :

- `DashboardProvider`, source déclarative d’un ensemble de widgets ;
- `DashboardWidget`, modèle immuable d’une unité de présentation ;
- le registre des fournisseurs ;
- les règles de validation, d’isolation, de versionnement et de compatibilité.

Il complète `ADMIN-001`, `ADMIN-002` et `ADMIN-003` sans redéfinir leur périmètre.

---

## 2. Références applicables

Le contrat applique notamment :

- `ARCH-001` — architecture générale ;
- `CORE-001` — services communs et registre ;
- `API-001` — conventions de contrat ;
- `SECURITY-001` — autorisation et confidentialité ;
- `CONFIG-001` — activation et paramètres ;
- `LOG-001` — journalisation ;
- `ERROR-001` — gestion des erreurs ;
- `DOCUMENT-001` — ouverture des documents ;
- `UX-001` et `UI-001` — expérience et rendu.

---

## 3. Principes directeurs

Le contrat respecte les principes suivants :

- absence de dépendance directe entre le Centre de pilotage et un module métier ;
- absence de logique métier dans les widgets ;
- publication déclarative et sérialisable ;
- traçabilité de la source ;
- minimisation des données ;
- contrôles d’autorisation côté serveur ;
- isolation des erreurs par fournisseur ;
- compatibilité versionnée ;
- dégradation maîtrisée ;
- absence de recherche dynamique dans le namespace global.

Le Centre de pilotage orchestre l’affichage sans devenir propriétaire des données publiées.

---

## 4. Rôles et responsabilités

### 4.1 Centre de pilotage

Il :

- découvre les fournisseurs enregistrés ;
- demande les widgets accessibles dans le contexte courant ;
- valide la conformité des descriptions ;
- refuse les contrats invalides ;
- trie et compose les widgets ;
- isole les erreurs ;
- rend les widgets avec `UI-001`.

Il ne :

- calcule aucune donnée métier ;
- interroge directement les stockages métier ;
- corrige ou complète les données d’un fournisseur ;
- crée de dépendance vers un module particulier.

### 4.2 DashboardProvider

Un fournisseur :

- appartient à un module ou service unique ;
- possède un identifiant stable ;
- expose uniquement les contenus dont il maîtrise la source ;
- applique les autorisations avant publication ;
- transforme les données de son domaine en modèles déclaratifs ;
- indique explicitement les états et la fraîcheur ;
- respecte la version du contrat.

Il ne :

- rend directement du HTML ;
- fournit de script client ;
- manipule la vue ;
- modifie un autre fournisseur ;
- déclenche un traitement métier lors de la consultation ;
- contourne les services publics de son module.

### 4.3 DashboardWidget

Un widget est une description immuable et sérialisable.

Il contient uniquement les informations nécessaires à sa présentation, son état, sa priorité, sa fraîcheur et ses actions autorisées.

Il ne possède aucune capacité d’accès direct aux données et aucune logique métier exécutable.

---

## 5. Contrat DashboardProvider

### 5.1 Interface minimale

```text
DashboardProvider
├── getProviderId()
├── getProviderMetadata()
└── getWidgets(context)
```

### 5.2 getProviderId()

Retourne un identifiant :

- unique dans la plateforme ;
- stable dans le temps ;
- indépendant du libellé ;
- sans donnée personnelle ;
- conforme à une convention technique documentée.

Exemple :

```text
aks.analytics.dashboard
```

### 5.3 getProviderMetadata()

| Propriété | Obligatoire | Description |
|---|---|---|
| `providerId` | Oui | Identifiant stable |
| `moduleId` | Oui | Module ou service propriétaire |
| `label` | Oui | Libellé fonctionnel |
| `contractVersion` | Oui | Version du contrat implémenté |
| `providerVersion` | Oui | Version du fournisseur |
| `enabled` | Oui | Disponibilité fonctionnelle |

### 5.4 getWidgets(context)

Retourne une collection de widgets adaptée au contexte courant.

Le contexte peut contenir :

- une identité technique minimale ;
- les rôles ou permissions utiles ;
- la langue ou les préférences d’affichage ;
- les capacités disponibles ;
- les informations de navigation nécessaires ;
- un identifiant de corrélation.

Le contexte ne fournit jamais :

- un accès générique au stockage ;
- un secret ;
- un jeton exposable au client ;
- des données métier sans rapport avec le fournisseur.

---

## 6. Contrat DashboardWidget

### 6.1 Structure minimale

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

### 6.2 Propriétés obligatoires

| Propriété | Description |
|---|---|
| `widgetId` | Identifiant stable et unique |
| `providerId` | Identifiant du fournisseur |
| `type` | Type de widget supporté |
| `zone` | Zone définie par `ADMIN-003` |
| `title` | Titre affiché |
| `state` | État normalisé |
| `priority` | Priorité d’affichage |
| `content` | Modèle de contenu déclaratif |

### 6.3 Propriétés optionnelles

| Propriété | Description |
|---|---|
| `subtitle` | Information secondaire |
| `status` | État synthétique |
| `metrics` | Indicateurs déjà calculés |
| `actions` | Actions déclaratives |
| `footer` | Information complémentaire |
| `updatedAt` | Date de fraîcheur |
| `expiresAt` | Date après laquelle le contenu ne doit plus être présenté comme actuel |
| `accessibilityLabel` | Libellé d’accessibilité |
| `correlationId` | Référence technique de corrélation lorsque justifiée |

### 6.4 Types initiaux

- `information` ;
- `metric` ;
- `status` ;
- `navigation` ;
- `notification` ;
- `empty-state`.

Un nouveau type doit répondre à plusieurs cas d’usage réels et respecter la gouvernance de `UI-001`.

---

## 7. États normalisés

Un widget utilise exclusivement les états définis par `ADMIN-003` :

- `loading` ;
- `available` ;
- `empty` ;
- `unavailable` ;
- `error` ;
- `access-denied` ;
- `disabled`.

Le fournisseur détermine l’état fonctionnel.

Le Centre de pilotage peut remplacer cet état par `error` lorsqu’un contrat est invalide ou qu’une erreur non gérée survient.

Aucun état n’est déduit d’une absence ambiguë de données.

---

## 8. Contenu déclaratif

Le contenu est sérialisable et ne contient pas :

- de fonction exécutable ;
- de fragment HTML fourni par un module ;
- de script client ;
- de référence directe à une ressource interne non autorisée ;
- de secret ;
- de donnée personnelle inutile ;
- de contenu métier détaillé qui relève d’un écran spécialisé.

Le rendu final relève exclusivement du Centre de pilotage et de `UI-001`.

---

## 9. Actions

Une action contient au minimum :

| Propriété | Description |
|---|---|
| `actionId` | Identifiant stable |
| `label` | Libellé utilisateur |
| `type` | Type autorisé |
| `target` | Destination déclarée |

Types initiaux :

- `navigate` ;
- `open-document` ;
- `open-external`.

Règles :

- aucune action ne déclenche directement un traitement destructif ou irréversible ;
- toute destination réapplique ses autorisations ;
- `open-document` respecte `DOCUMENT-001` ;
- `open-external` utilise une destination approuvée et identifiée ;
- aucune cible ne contient de secret ou de donnée sensible inutile.

---

## 10. Registre des fournisseurs

Les fournisseurs sont enregistrés dans un registre transverse maîtrisé par AKS Core.

Le registre :

- associe un `providerId` unique à une implémentation ;
- refuse les doublons ;
- vérifie la version de contrat ;
- permet l’activation ou la désactivation contrôlée ;
- expose uniquement les fournisseurs valides ;
- ne contient aucune logique métier.

L’enregistrement est réalisé lors de l’initialisation de la plateforme ou du module.

Le Centre de pilotage ne recherche pas dynamiquement des fonctions par nom et ne parcourt pas le namespace global.

---

## 11. Validation d’un contrat

Avant affichage, le Centre de pilotage vérifie au minimum :

- la présence des propriétés obligatoires ;
- l’unicité du `widgetId` dans le périmètre du fournisseur ;
- la cohérence entre `providerId` et registre ;
- la version du contrat ;
- le type et la zone autorisés ;
- l’état normalisé ;
- la sérialisabilité ;
- l’absence de contenu exécutable ;
- la validité minimale des actions.

Un widget invalide est refusé sans bloquer les autres widgets.

---

## 12. Isolation et erreurs

L’échec d’un fournisseur ne doit pas empêcher l’affichage des autres.

Pour chaque fournisseur :

1. l’appel est isolé ;
2. un délai maximal peut être appliqué ;
3. les erreurs sont journalisées conformément à `LOG-001` ;
4. les détails techniques ne sont pas exposés ;
5. un état d’erreur ou d’indisponibilité peut être présenté ;
6. la composition se poursuit.

Codes recommandés :

```text
ADMIN004_PROVIDER_FAILURE
ADMIN004_INVALID_WIDGET
ADMIN004_UNSUPPORTED_CONTRACT
ADMIN004_DUPLICATE_IDENTIFIER
```

---

## 13. Autorisation et confidentialité

Chaque fournisseur filtre ses widgets avant leur retour.

Le Centre de pilotage applique en complément les contrôles généraux d’accès.

Règles obligatoires :

- aucun widget interdit n’est retourné puis simplement masqué côté client ;
- aucune donnée sensible n’est incluse dans un widget non autorisé ;
- les actions réappliquent les contrôles à destination ;
- les erreurs ne révèlent ni structure interne ni données métier ;
- les journaux ne reproduisent pas le contenu complet des widgets.

---

## 14. Ordonnancement

Le Centre de pilotage compose selon :

1. la zone ;
2. la priorité ;
3. un ordre stable déterminé par `widgetId` en cas d’égalité.

Un fournisseur ne peut imposer l’ordre absolu des widgets des autres fournisseurs.

---

## 15. Compatibilité et version

Pour V1.1, la version de contrat attendue est :

```text
1.0
```

Une évolution incompatible nécessite :

- une nouvelle version explicite ;
- une stratégie de compatibilité ou migration ;
- une mise à jour documentaire ;
- des tests de non-régression ;
- une décision validée par le Product Owner.

Un fournisseur utilisant une version non supportée est refusé explicitement.

---

## 16. Exemple conceptuel

```javascript
{
  providerId: 'aks.analytics.dashboard',
  moduleId: 'AKS_ANALYTICS',
  contractVersion: '1.0',
  providerVersion: '1.0.0',
  widgets: [
    {
      widgetId: 'analytics.licensed-members',
      providerId: 'aks.analytics.dashboard',
      type: 'metric',
      zone: 'modules',
      title: 'Licenciés',
      state: 'available',
      priority: 100,
      updatedAt: '2026-07-23T19:00:00Z',
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

Cet exemple est illustratif et ne constitue pas une source de données réelle.

---

## 17. Hors périmètre

`ADMIN-004` ne définit pas :

- l’organisation fonctionnelle des zones ;
- la navigation générale ;
- l’implémentation technique détaillée du registre ;
- le protocole de chargement client ;
- les composants graphiques ;
- les données métier publiées ;
- les règles métier des modules ;
- la personnalisation libre par utilisateur ;
- un système de plugins externes.

---

## 18. Critères d’acceptation

Le contrat est conforme lorsque :

- chaque fournisseur possède un identifiant unique et stable ;
- chaque fournisseur appartient à un propriétaire identifié ;
- la version de contrat est vérifiée ;
- aucun fournisseur ne rend directement du HTML ;
- les contenus sont filtrés avant retour ;
- chaque widget respecte la structure minimale ;
- les états sont normalisés ;
- le contenu est déclaratif et sérialisable ;
- aucune logique métier exécutable n’est intégrée ;
- les fournisseurs sont découverts via le registre ;
- une erreur n’interrompt pas l’ensemble du Dashboard ;
- l’ordre est stable ;
- les contrôles d’autorisation sont réalisés côté serveur ;
- les widgets non autorisés ne sont jamais transmis ;
- les doublons et contrats incompatibles sont refusés ;
- les tests couvrent les cas valide, vide, indisponible, invalide, désactivé et en erreur.

---

## 19. Définition de terminé

`ADMIN-004` est terminé lorsque :

- les contrats sont implémentés ;
- le registre existe dans AKS Core ;
- le Centre de pilotage consomme exclusivement ce registre ;
- au moins un fournisseur transverse et un fournisseur de module sont intégrables sans dépendance directe ;
- l’isolation, la validation et les autorisations sont testées ;
- la conformité aux références applicables est démontrée.

---

## 20. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.0 | 2026-07-23 | Renforcement du contrat, de la validation, de la sécurité, du versionnement, de la fraîcheur et de la gestion des incompatibilités |
| 1.1.0 | 2026-07-23 | Première définition des contrats DashboardProvider et DashboardWidget |
# AUDIT-002

# Audit de l'architecture transverse d'AKS Platform

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | AUDIT-002 |
| **Titre** | Audit de l'architecture transverse d'AKS Platform |
| **Version** | 1.0.0 |
| **Statut** | Review |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-19 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Le présent document décrit l'architecture transverse effectivement implémentée dans AKS Platform au terme de DASHBOARD-001.

Il constitue un état des lieux factuel du code existant. Il ne définit pas encore les règles normatives qui seront formalisées dans ARCH-002.

L'audit couvre :

- les services transversaux exposés par la plateforme ;
- les composants d'administration ;
- les mécanismes de factories et d'injection de dépendances ;
- l'usage du conteneur de services ;
- les conventions d'immutabilité ;
- la gestion des erreurs ;
- l'organisation des tests ;
- les dépendances réellement observées entre composants.

---

# 2. Périmètre analysé

## 2.1 Dépôt applicatif

L'analyse porte sur le dépôt `karateseremange/AKS-Platform`, branche `develop`, jusqu'au commit :

```text
ef2d15f — test(dashboard): use dedicated dashboard model namespace
```

Les composants principaux examinés sont :

- `src/config/ConfigApi.gs` ;
- `src/core/LoggerApi.gs` ;
- `src/core/VersionApi.gs` ;
- `src/core/DashboardApi.gs` ;
- `src/app/AdminAccess.gs` ;
- `src/app/AdminDashboardController.gs` ;
- `src/core/container/Container.gs` ;
- `src/core/registry/ServiceRegistry.gs` ;
- `src/core/registry/ModuleRegistry.gs` ;
- `src/core/application/Application.gs` ;
- `src/app/Bootstrap.gs` ;
- les suites de tests associées.

## 2.2 Dépôt documentaire

L'analyse est rapprochée des documents existants du Project Book, notamment :

- ARCH-001 ;
- CORE-001 ;
- ADMIN-001 ;
- CONFIG-001 ;
- LOG-001 ;
- ERROR-001 ;
- API-001 ;
- SECURITY-001.

## 2.3 Hors périmètre

L'audit ne décrit pas l'architecture interne détaillée du module Questionnaire Santé.

Il ne définit pas non plus l'architecture future d'AKS Analytics, d'AKS Calendar ou d'autres modules métier non encore développés.

---

# 3. Vue d'ensemble de l'architecture observée

L'implémentation actuelle distingue quatre ensembles principaux :

```text
AKS Core
  ├─ cycle de vie de l'application
  ├─ conteneur de dépendances
  ├─ registre de modules
  ├─ résultat et exceptions
  └─ logger historique du Core

Services transversaux publics
  ├─ AKS.Config
  ├─ AKS.Logger
  └─ AKS.Version

Administration
  ├─ AKS.Admin.Access
  ├─ AKS.Admin.Dashboard
  ├─ AKS.Admin.DashboardModel
  └─ AKS.Admin.getDashboard

Modules métier
  └─ AKS.Modules.HealthQuestionnaire
```

Deux mécanismes coexistent pour fournir des dépendances :

1. le conteneur historique `AKS.Core.Container`, utilisé par le cycle de vie du Core et le chargement des modules ;
2. l'injection explicite par paramètres de factory, utilisée par `AKS.Config`, `AKS.Logger`, `AKS.Version` et `AKS.Admin.DashboardModel`.

Cette coexistence est réelle dans le code actuel.

---

# 4. Inventaire des composants transversaux

## 4.1 AKS.Config

### Responsabilité observée

`AKS.Config` expose les paramètres de configuration autorisés à être consommés par les autres composants.

Dans l'implémentation actuelle, son contrat public porte sur la liste des administrateurs autorisés.

### Factory

```javascript
AKS_createConfigApi_(configProvider)
```

La factory reçoit un provider de configuration et n'accède pas directement à la constante `CONFIG` pendant les tests.

L'instance de production est créée ainsi :

```javascript
AKS.Config = AKS_createConfigApi_(function () {
  return typeof CONFIG === "undefined" ? null : CONFIG;
});
```

### API publique

```text
AKS.Config.getAuthorizedAdminEmails()
```

### Garanties observées

- validation de la présence de la configuration ;
- validation du format des adresses électroniques ;
- normalisation en minuscules ;
- suppression des espaces périphériques ;
- rejet des doublons ;
- retour d'une copie figée du tableau ;
- API publique figée avec `Object.freeze`.

### Erreur exposée

```text
CONFIG001_INVALID_ADMIN_CONFIGURATION
```

### Dépendances observées

`AKS.Config` ne dépend d'aucune autre API publique AKS.

L'instance de production dépend uniquement de la constante interne `CONFIG`, encapsulée derrière le provider.

---

## 4.2 AKS.Logger

### Responsabilité observée

`AKS.Logger` expose une API minimale et stable de journalisation.

### Factory

```javascript
AKS_createLoggerApi_(loggingProvider)
```

### API publique

```text
AKS.Logger.info(message, context)
AKS.Logger.warn(message, context)
AKS.Logger.error(message, context)
```

### Garanties observées

- le provider est injecté dans la factory ;
- l'API publique est figée ;
- les niveaux sont normalisés par l'API ;
- l'appel est tolérant à l'absence d'un provider fonctionnel.

### Limite observée

Le provider de production actuellement enregistré transmet au service Apps Script `Logger.log` le niveau et le message, mais pas le paramètre `context`.

Le contrat public accepte donc un contexte, alors que le provider de production actuel ne le restitue pas dans la sortie technique.

### Dépendances observées

`AKS.Logger` ne dépend d'aucune autre API publique AKS.

Il dépend du service natif Apps Script `Logger` uniquement dans son provider de production.

---

## 4.3 AKS.Version

### Responsabilité observée

`AKS.Version` fournit les métadonnées officielles de la release applicative.

### Données internes

Les métadonnées sont stockées dans la constante privée figée :

```javascript
AKS_RELEASE_INFO_
```

Elle contient actuellement :

- `version` ;
- `build` ;
- `releaseName`.

### Factory

```javascript
AKS_createVersionApi_(releaseProvider)
```

### API publique

```text
AKS.Version.getReleaseInfo()
```

### Garanties observées

- validation du provider ;
- validation du type de l'objet retourné ;
- validation des trois chaînes obligatoires ;
- normalisation des espaces périphériques ;
- création d'un nouvel objet à chaque appel ;
- objet retourné figé ;
- API publique figée.

### Erreur exposée

```text
VERSION001_INVALID_RELEASE_METADATA
```

### Dépendances observées

`AKS.Version` ne dépend d'aucune autre API publique AKS.

---

## 4.4 AKS.Admin.Access

### Responsabilité observée

`AKS.Admin.Access` applique les règles d'autorisation côté serveur pour l'administration.

L'authentification est déléguée à Google Apps Script via `Session.getActiveUser().getEmail()`.

### API publique

```text
AKS.Admin.Access.isAuthorizedEmail(email, authorizedEmails?)
AKS.Admin.Access.getCurrentUserEmail()
AKS.Admin.Access.assertAuthorized(email, authorizedEmails?)
AKS.Admin.Access.assertCurrentUserAuthorized()
```

### Garanties observées

- normalisation des adresses électroniques ;
- possibilité d'injecter une liste d'administrateurs pour les tests ;
- usage par défaut de `AKS.Config.getAuthorizedAdminEmails()` ;
- refus fermé lorsque l'adresse n'est pas autorisée ;
- API publique figée.

### Erreur exposée

```text
ADMIN001_ACCESS_DENIED
```

### Dépendances observées

En production :

```text
AKS.Admin.Access
  ├─ AKS.Config
  └─ Session.getActiveUser()
```

Dans les tests unitaires, la dépendance à `AKS.Config` peut être contournée par le paramètre optionnel `authorizedEmails`.

---

## 4.5 AKS.Admin.Dashboard

### Responsabilité observée

`AKS.Admin.Dashboard` est le contrôleur de présentation de l'espace d'administration défini par ADMIN-001.

Il construit un modèle de vue et rend le fichier HTML du tableau de bord.

### API publique

```text
AKS.Admin.Dashboard.getViewModel()
AKS.Admin.Dashboard.render()
AKS.Admin.Dashboard.buildViewModelForAuthorizedUser(email)
```

### Dépendances observées

```text
AKS.Admin.Dashboard
  ├─ AKS.Admin.Access
  ├─ AKS.Version
  └─ HtmlService
```

### Immutabilité observée

Le modèle retourne des sous-objets figés :

- `platform` ;
- `administrator` ;
- `actions` ;
- objet racine.

### Divergence factuelle observée

Le contrôleur lit actuellement :

```javascript
releaseInfo.codename
```

alors que le contrat public actuel de `AKS.Version.getReleaseInfo()` expose :

```text
version
build
releaseName
```

La propriété `codename` n'est donc pas fournie par VERSION-001.

Cette divergence n'empêche pas les tests actuels de passer, car les tests ADMIN-001 utilisent un stub de version compatible avec l'ancien contrat.

---

## 4.6 AKS.Admin.DashboardModel

### Responsabilité observée

`AKS.Admin.DashboardModel` agrège l'état des services transversaux destiné au tableau de bord d'administration.

Il correspond au composant DASHBOARD-001.

### Factory

```javascript
AKS_createDashboardApi_(
  adminAccessApi,
  versionApi,
  configApi,
  loggerApi
)
```

### API publique

```text
AKS.Admin.DashboardModel.getDashboard()
AKS.Admin.getDashboard()
```

`AKS.Admin.getDashboard` est un alias public vers `AKS.Admin.DashboardModel.getDashboard`.

### Dépendances injectées

- API d'accès administratif ;
- API de version ;
- API de configuration ;
- API de journalisation.

### Garanties observées

- autorisation obligatoire avant toute lecture ;
- propagation de l'erreur `ADMIN001_ACCESS_DENIED` ;
- refus fermé si l'API d'accès est indisponible ;
- mode dégradé pour Version, Configuration et Logger ;
- modèle profondément figé ;
- nouvelles copies à chaque appel ;
- résolution tardive des dépendances publiques pour éviter les problèmes d'ordre de chargement Apps Script ;
- séparation du namespace `AKS.Admin.Dashboard` déjà détenu par ADMIN-001.

### Erreur exposée

```text
DASHBOARD001_ADMIN_ACCESS_UNAVAILABLE
```

### Dépendances de production

```text
AKS.Admin.DashboardModel
  ├─ AKS.Admin.Access
  ├─ AKS.Version
  ├─ AKS.Config
  └─ AKS.Logger
```

---

# 5. Conteneur et registres historiques du Core

## 5.1 AKS.Core.Container

`AKS.Core.Container` est un conteneur de dépendances léger disposant des opérations suivantes :

```text
register
factory
resolve
has
remove
list
clear
```

Il prend en charge :

- l'enregistrement de valeurs ;
- l'enregistrement de factories ;
- les singletons par défaut ;
- les instances non singletons sur option explicite ;
- la détection des doublons ;
- la validation des noms ;
- la suppression et la réinitialisation pour les tests.

Les erreurs sont émises sous forme de `AKS.Core.Exception`.

## 5.2 Usage réel du Container

Dans le code audité, le conteneur est utilisé par `AKS.Core.Application` pour enregistrer et résoudre le logger historique du Core sous le nom :

```text
logger
```

Les services publics introduits par CONFIG-001, LOGGER-001, VERSION-001 et DASHBOARD-001 ne sont pas enregistrés dans le conteneur.

Ils sont exposés directement dans le namespace global `AKS` et injectés explicitement dans leurs factories de test.

Le conteneur est donc réellement utilisé, mais son périmètre actuel reste limité au cycle de vie historique du Core et au chargement des modules.

## 5.3 AKS.Core.Services

`AKS.Core.Services` est une façade de compatibilité au-dessus de `AKS.Core.Container`.

Le commentaire du code précise que les nouveaux développements doivent utiliser directement `AKS.Core.Container`.

## 5.4 AKS.Core.Modules

`AKS.Core.Modules` conserve les descripteurs normalisés des modules chargés.

Les descripteurs enregistrés sont figés et contiennent :

- `id` ;
- `name` ;
- `version` ;
- `status`.

## 5.5 AKS.App.Bootstrap

`AKS.App.Bootstrap` est le point unique déclarant les modules concrets disponibles.

Dans l'état audité, il référence uniquement :

```text
AKS.Modules.HealthQuestionnaire.Module
```

---

# 6. Factories et injection de dépendances

## 6.1 Factories observées

Les services V1.1 utilisent les factories internes suivantes :

```text
AKS_createConfigApi_(configProvider)
AKS_createLoggerApi_(loggingProvider)
AKS_createVersionApi_(releaseProvider)
AKS_createDashboardApi_(adminAccessApi, versionApi, configApi, loggerApi)
```

## 6.2 Caractéristiques communes

Les factories observées :

- restent accessibles techniquement au runtime Apps Script, mais ne sont pas publiées comme propriétés du namespace `AKS` ;
- permettent l'injection de doubles de test ;
- retournent une API publique figée ;
- isolent la source concrète des données ou du service ;
- limitent les dépendances directes aux implémentations de production.

## 6.3 Variantes observées

Deux formes d'injection coexistent :

- provider injecté pour Config, Logger et Version ;
- API complètes injectées pour DashboardModel.

`AKS.Admin.Access` n'utilise pas de factory dédiée. Il autorise néanmoins l'injection ponctuelle de la liste des administrateurs dans deux méthodes publiques afin de rendre les règles d'autorisation testables.

---

# 7. Immutabilité et copies défensives

## 7.1 APIs publiques

Les composants suivants exposent une API figée avec `Object.freeze` :

- `AKS.Config` ;
- `AKS.Logger` ;
- `AKS.Version` ;
- `AKS.Admin.Access` ;
- `AKS.Admin.Dashboard` ;
- `AKS.Admin.DashboardModel` ;
- `AKS.Core.Container` ;
- `AKS.Core.Services` ;
- `AKS.Core.Modules` ;
- `AKS.Core.Application` ;
- `AKS.App.Bootstrap`.

## 7.2 Données retournées

Les garanties observées sont différentes selon les composants :

- Config retourne un nouveau tableau figé ;
- Version retourne un nouvel objet figé ;
- Dashboard retourne un nouveau modèle profondément figé ;
- Admin.Dashboard retourne un modèle composé d'objets figés ;
- ModuleRegistry conserve et retourne des descripteurs figés ;
- Container retourne les références enregistrées sans les copier ni les figer.

L'immutabilité est donc systématique sur les contrats publics V1.1 étudiés, mais elle n'est pas une propriété universelle de toutes les valeurs transitant par le Core historique.

---

# 8. Gestion des erreurs

## 8.1 Erreurs codifiées observées

| Composant | Code |
|-----------|------|
| Config | `CONFIG001_INVALID_ADMIN_CONFIGURATION` |
| Version | `VERSION001_INVALID_RELEASE_METADATA` |
| Admin Access | `ADMIN001_ACCESS_DENIED` |
| Dashboard | `DASHBOARD001_ADMIN_ACCESS_UNAVAILABLE` |
| Container | codes `CONTAINER_*` via `AKS.Core.Exception` |
| Module Registry | codes `MODULE_*` via `AKS.Core.Exception` |

## 8.2 Deux modèles d'erreurs

Deux modèles coexistent :

1. création d'un `Error` JavaScript puis ajout d'une propriété `code` dans les composants V1.1 ;
2. instanciation de `AKS.Core.Exception` dans les composants historiques du Core.

## 8.3 Comportement du Dashboard

DASHBOARD-001 distingue deux catégories d'échec :

- contrôle d'accès : l'erreur est propagée et l'accès reste fermé ;
- services d'information : l'erreur est absorbée et représentée par un état dégradé dans le modèle.

Ce comportement est explicitement couvert par les tests.

---

# 9. Organisation des namespaces

## 9.1 Namespaces publics observés

```text
AKS
├─ Config
├─ Logger
├─ Version
├─ Admin
│  ├─ Access
│  ├─ Dashboard
│  ├─ DashboardModel
│  └─ getDashboard
├─ Core
│  ├─ Application
│  ├─ Container
│  ├─ Services
│  └─ Modules
└─ Modules
   └─ HealthQuestionnaire
```

## 9.2 Incident de collision corrigé

La première implémentation de DASHBOARD-001 avait réutilisé `AKS.Admin.Dashboard`, déjà détenu par ADMIN-001.

Cette collision supprimait la méthode publique :

```text
AKS.Admin.Dashboard.buildViewModelForAuthorizedUser
```

La correction validée a créé le namespace distinct :

```text
AKS.Admin.DashboardModel
```

et a conservé l'entrée simplifiée :

```text
AKS.Admin.getDashboard
```

Les tests ADMIN-001 et DASHBOARD-001 passent après cette correction.

---

# 10. Analyse des dépendances

## 10.1 Matrice observée

| Consommateur | Config | Logger | Version | Admin.Access | Container | Modules | HtmlService | Session |
|--------------|:------:|:------:|:-------:|:------------:|:---------:|:-------:|:-----------:|:-------:|
| AKS.Config | — | — | — | — | — | — | — | — |
| AKS.Logger | — | — | — | — | — | — | — | — |
| AKS.Version | — | — | — | — | — | — | — | — |
| AKS.Admin.Access | X | — | — | — | — | — | — | X |
| AKS.Admin.Dashboard | — | — | X | X | — | — | X | — |
| AKS.Admin.DashboardModel | X | X | X | X | — | — | — | — |
| AKS.Core.Application | — | logger Core | — | — | X | X | — | — |
| AKS.App.Bootstrap | — | — | — | — | — | module concret | — | — |

## 10.2 Dépendances circulaires

Aucune dépendance circulaire n'a été observée entre Config, Logger, Version, Admin.Access et DashboardModel.

Le graphe principal est acyclique :

```text
Config ───────────────► Admin.Access ─────────────► DashboardModel
  │                                                     ▲
  └─────────────────────────────────────────────────────┤
Logger ─────────────────────────────────────────────────┤
Version ────────────────────────────────────────────────┘
```

`Admin.Dashboard` consomme séparément `Admin.Access` et `Version`.

---

# 11. Tests observés

## 11.1 Organisation

Les composants V1.1 disposent chacun d'un dossier de tests et d'un runner dédié :

```text
src/tests/admin
src/tests/config
src/tests/logger
src/tests/version
src/tests/dashboard
```

Les runners observés sont :

```text
AKS_runAdmin001Tests()
AKS_runConfig001Tests()
AKS_runLogger001Tests()
AKS_runVersion001Tests()
AKS_runDashboard001Tests()
```

## 11.2 Isolation

Les factories permettent de tester les composants sans modifier les objets de production.

Les tests couvrent notamment :

- existence et gel des API publiques ;
- validation des entrées ;
- erreurs codifiées ;
- normalisation ;
- copies défensives ;
- immutabilité ;
- mode dégradé du Dashboard ;
- refus d'accès ;
- préservation du namespace ADMIN-001.

## 11.3 Non-régression

L'incident de namespace sur `AKS.Admin.Dashboard` a démontré que les suites de tests existantes détectent une incompatibilité publique entre composants.

Après correction, les tests ADMIN-001 et DASHBOARD-001 ont été exécutés avec succès.

---

# 12. Constats de conformité

## 12.1 Points conformes observés

- séparation visible entre services transversaux, administration et modules métier ;
- APIs publiques explicites sous le namespace `AKS` ;
- factories internes testables ;
- injection de dépendances utilisée pour les nouveaux services ;
- APIs publiques figées ;
- copies défensives pour Config, Version et Dashboard ;
- contrôle d'accès centralisé dans `AKS.Admin.Access` ;
- absence de dépendance des services Config, Logger et Version vers un module métier ;
- absence de dépendance circulaire entre les composants V1.1 étudiés ;
- suites de tests dédiées et cumulatives ;
- utilisation réelle, mais limitée, du Container historique.

## 12.2 Écarts ou divergences observés

Les éléments suivants sont des constats factuels et non des décisions de correction :

1. `AKS.Admin.Dashboard` lit `releaseInfo.codename`, propriété absente du contrat actuel de `AKS.Version`.
2. `AKS.Logger` accepte un paramètre `context`, mais le provider Apps Script actuel ne l'écrit pas.
3. Deux mécanismes de dépendances coexistent : Container historique et injection directe par factories.
4. Deux modèles d'erreurs coexistent : `AKS.Core.Exception` et `Error` enrichi avec `code`.
5. `AKS.Core.Services` reste présent comme façade de compatibilité, alors que son commentaire réserve `AKS.Core.Container` aux nouveaux usages.
6. Le Container n'enregistre pas les APIs publiques V1.1 Config, Logger, Version ou Dashboard.
7. Les factories suffixées `_` sont internes par convention, mais restent globalement adressables dans l'environnement Apps Script.

---

# 13. Risques observés

## 13.1 Compatibilité des contrats publics

L'écart entre `codename` et `releaseName` montre qu'un test isolé avec un stub peut rester vert alors que deux contrats de production divergent.

## 13.2 Collisions de namespaces

Le namespace global Apps Script ne protège pas automatiquement une propriété publique contre un remplacement ultérieur.

L'incident corrigé sur `AKS.Admin.Dashboard` confirme ce risque.

## 13.3 Multiplication des mécanismes de dépendances

La coexistence entre Container et factories n'est pas en elle-même une défaillance, mais elle peut créer des intégrations différentes selon les composants si son périmètre n'est pas formalisé.

## 13.4 Contexte de journalisation

Le contexte accepté par l'API Logger n'est actuellement pas exploité par son provider de production, ce qui limite les informations disponibles lors d'un diagnostic.

---

# 14. Synthèse

L'architecture transverse V1.1 est structurée autour d'APIs publiques figées et de factories internes permettant l'injection de dépendances.

Les services Config, Logger et Version sont indépendants des modules métier. L'administration s'appuie sur ces services via `AKS.Admin.Access`, `AKS.Admin.Dashboard` et `AKS.Admin.DashboardModel`.

Le Container historique demeure actif dans le cycle de vie d'AKS Core, mais les services transversaux ajoutés en V1.1 ne l'utilisent pas.

L'architecture observée est globalement acyclique et testable. Les principaux écarts identifiés concernent la cohérence de certains contrats publics, la coexistence de conventions historiques et V1.1, et la protection des namespaces publics.

Ces constats constituent la base factuelle de DEP-002 et d'ARCH-002.

---

# 15. Références techniques

## 15.1 Dépôt applicatif

- `src/config/ConfigApi.gs`
- `src/core/LoggerApi.gs`
- `src/core/VersionApi.gs`
- `src/core/DashboardApi.gs`
- `src/app/AdminAccess.gs`
- `src/app/AdminDashboardController.gs`
- `src/core/container/Container.gs`
- `src/core/registry/ServiceRegistry.gs`
- `src/core/registry/ModuleRegistry.gs`
- `src/core/application/Application.gs`
- `src/app/Bootstrap.gs`
- `src/tests/admin/AdminDashboardTest.gs`
- `src/tests/config/ConfigTest.gs`
- `src/tests/logger/LoggerTest.gs`
- `src/tests/version/VersionTest.gs`
- `src/tests/dashboard/DashboardTest.gs`

## 15.2 Project Book

- ARCH-001 — Architecture fonctionnelle d'AKS Platform
- CORE-001 — AKS Core
- ADMIN-001 — Tableau de bord d'administration
- CONFIG-001 — Paramétrage centralisé
- LOG-001 — Journalisation
- ERROR-001 — Gestion des erreurs
- API-001 — Principes des APIs
- SECURITY-001 — Principes de sécurité

---

# 16. Conclusion

AUDIT-002 établit l'état réel de l'architecture transverse au terme de DASHBOARD-001.

Il ne préjuge pas de l'architecture interne des futurs modules métier et ne crée pas d'abstraction anticipée.

Il fournit les constats nécessaires à la cartographie détaillée des dépendances dans DEP-002, puis à la formalisation des règles normatives dans ARCH-002.

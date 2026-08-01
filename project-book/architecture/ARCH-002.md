| Propriété | Valeur |
|-----------|--------|
| **Document ID** | ARCH-002 |
| **Titre** | Architecture transverse et composition des composants |
| **Version** | 1.1.0 |
| **Statut** | Proposition consolidée |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-19 |
| **Version du produit** | V1.1 |

---

# 1. Objet

Le présent document précise l’architecture transverse d’AKS Platform à partir des constats formulés dans `AUDIT-002` et des règles de dépendances définies dans `DEP-002`.

Il complète `ARCH-001` sans le remplacer.

Son objectif est de formaliser :

- l’organisation des composants transversaux ;
- leur composition ;
- leurs contrats publics ;
- leur cycle de création ;
- les règles de propagation des erreurs ;
- les exigences de testabilité ;
- les règles d’évolution applicables à partir de la V1.1.

`ARCH-002` constitue le contrat d’architecture d’implémentation des services communs d’AKS Core.

---

# 2. Position dans l’architecture

`ARCH-001` définit l’architecture fonctionnelle globale d’AKS Platform.

`ARCH-002` précise l’architecture interne des capacités transversales suivantes :

- configuration ;
- journalisation ;
- version ;
- administration ;
- sécurité ;
- audit ;
- notifications ;
- stockage ;
- gestion des erreurs ;
- composition des composants.

Les documents spécialisés restent applicables :

- `CORE-001` ;
- `CONFIG-001` ;
- `LOG-001` ;
- `VERSION-001` ;
- `ADMIN-001` ;
- `SECURITY-001` ;
- `ERROR-001` ;
- `AUDIT-001` ;
- `NOTIF-001` ;
- `STORAGE-001` ;
- `DEP-002`.

En cas de divergence :

1. `ARCH-001` fait autorité sur l’organisation globale ;
2. `ARCH-002` fait autorité sur la composition transverse ;
3. le document spécialisé fait autorité sur son domaine fonctionnel ;
4. le code doit être corrigé lorsqu’il contredit ces documents.

---

# 3. Principes structurants

## 3.1 Services transversaux sans logique métier

Les services transversaux fournissent des capacités communes.

Ils ne contiennent aucune règle propre au questionnaire santé, à Analytics, à Calendar, aux grades ou à tout autre module métier.

## 3.2 Contrats publics minimaux

Chaque composant expose uniquement les opérations nécessaires à ses consommateurs.

Les détails internes, dépendances techniques et structures temporaires restent privés.

## 3.3 Création contrôlée

Tout composant possédant des dépendances est créé par une factory ou par un point de composition explicite.

La création directe dispersée dans le code applicatif est interdite.

## 3.4 Échec précoce

Une dépendance obligatoire absente ou invalide provoque une erreur immédiate, codifiée et compréhensible.

Les erreurs tardives dues à une composition incomplète sont interdites.

## 3.5 Immutabilité des résultats publics

Les objets de configuration, informations de version, modèles de tableau de bord et autres objets de lecture sont immuables lorsque l’environnement le permet.

## 3.6 Compatibilité progressive

L’application de `ARCH-002` doit préserver les fonctionnalités validées de la V1.0.

Les composants existants sont alignés progressivement, sans refonte globale non justifiée.

---

# 4. Vue logique transverse

```text
POINTS D’ENTRÉE
    │
    ▼
BOOTSTRAP / COMPOSITION ROOT
    │
    ├── Configuration
    ├── Logger
    ├── Version
    ├── Sécurité / Autorisations
    ├── Audit
    ├── Notifications
    ├── Stockage
    └── Adaptateurs d’intégration
    │
    ▼
FACTORIES DE COMPOSANTS
    │
    ▼
SERVICES / ORCHESTRATEURS
    │
    ▼
MODÈLES DE SORTIE IMMUABLES
```

Le point de composition est responsable de relier les composants.

Les composants métier ne construisent pas eux-mêmes les services transversaux.

---

# 5. Point de composition

## 5.1 Définition

Le point de composition est l’endroit où les implémentations concrètes sont assemblées.

Il peut être situé :

- dans le bootstrap d’AKS Core ;
- dans un point d’entrée Apps Script ;
- dans une factory de haut niveau ;
- dans un adaptateur d’exécution documenté.

## 5.2 Responsabilités

Le point de composition :

- instancie les implémentations concrètes ;
- lit la configuration nécessaire ;
- injecte les dépendances ;
- enregistre les services dans le conteneur lorsque cela est justifié ;
- retourne des composants prêts à l’emploi ;
- garantit l’ordre d’initialisation ;
- journalise les erreurs de démarrage lorsque cela est possible.

## 5.3 Limites

Le point de composition ne contient pas :

- de règle métier ;
- de rendu HTML ;
- de traitement fonctionnel ;
- de logique de décision administrative ;
- de duplication de validation métier.

---

# 6. Conteneur AKS Core

## 6.1 Rôle

Le conteneur constitue un mécanisme de composition et de substitution des services transversaux.

Il n’est pas une API métier.

## 6.2 Services admissibles

Peuvent être enregistrés dans le conteneur :

- configuration ;
- logger ;
- version ;
- contrôle d’accès ;
- audit ;
- notifications ;
- stockage ;
- adaptateurs externes ;
- horloge ;
- générateur d’identifiants ;
- services techniques partagés.

## 6.3 Résolution

La résolution d’un service est autorisée uniquement dans :

- le bootstrap ;
- les points d’entrée ;
- les factories de composition ;
- les tests d’intégration ;
- les adaptateurs documentés.

Un service métier ne doit pas appeler directement `resolve()`.

## 6.4 Enregistrement

L’enregistrement d’un service doit :

- utiliser une clé stable ;
- empêcher les collisions silencieuses ;
- permettre le remplacement explicite dans les tests ;
- échouer si la définition est invalide ;
- rester documenté.

## 6.5 Cycle de vie

Par défaut, un service transversal est créé une fois par exécution.

Un cycle de vie différent doit être justifié par :

- un état mutable nécessaire ;
- un coût d’instanciation significatif ;
- une contrainte d’intégration ;
- un besoin d’isolation explicite.

---

# 7. Factories

## 7.1 Contrat

Une factory doit :

- recevoir les dépendances nécessaires ;
- vérifier leur présence ;
- vérifier les opérations minimales utilisées ;
- appliquer uniquement les valeurs par défaut autorisées ;
- retourner une instance directement exploitable ;
- ne pas exposer les dépendances internes.

## 7.2 Validation par capacités

La validation porte sur les méthodes réellement utilisées.

Exemple : un consommateur utilisant uniquement `logger.info()` et `logger.error()` ne doit pas imposer une implémentation complète du logger.

## 7.3 Nommage

Les factories publiques suivent un nom explicite, par exemple :

- `AKS.Config.create(...)` ;
- `AKS.Logger.create(...)` ;
- `AKS.Admin.Dashboard.create(...)` ;
- `AKS.Admin.DashboardModel.create(...)`.

Les noms génériques ou ambigus sont évités.

## 7.4 Valeurs de repli

Une valeur de repli est autorisée uniquement si :

- elle est sûre ;
- elle est déterministe ;
- elle est documentée ;
- elle ne masque pas une erreur de configuration ;
- elle n’altère pas le niveau de sécurité.

---

# 8. Configuration

## 8.1 Accès centralisé

Les composants accèdent à la configuration via le service public défini dans `CONFIG-001`.

Ils ne lisent pas directement `PropertiesService` hors adaptateur ou composant de configuration.

## 8.2 Valeurs publiques

Les objets de configuration retournés :

- utilisent des noms stables ;
- sont immuables ;
- excluent les secrets inutiles au consommateur ;
- distinguent valeur absente, valeur vide et valeur invalide ;
- documentent les valeurs par défaut.

## 8.3 Secrets

Les secrets ne doivent jamais être :

- copiés dans un modèle de vue ;
- inclus dans une erreur utilisateur ;
- journalisés ;
- exposés dans un objet public générique ;
- stockés dans le conteneur sous forme directement consultable sans contrôle.

---

# 9. Journalisation

## 9.1 Contrat commun

Le logger expose un contrat stable pour :

- information ;
- avertissement ;
- erreur ;
- débogage lorsque celui-ci est activé.

## 9.2 Structure des événements

Chaque événement contient lorsque disponible :

- niveau ;
- message ;
- composant ;
- opération ;
- résultat ;
- identifiant de corrélation ;
- métadonnées minimales.

## 9.3 Isolation

Un échec de journalisation non critique ne doit pas masquer l’erreur d’origine.

Le comportement en cas d’échec est défini par `LOG-001` et `ERROR-001`.

## 9.4 Absence de données sensibles

Les journaux ne contiennent jamais :

- mot de passe ;
- jeton ;
- clé privée ;
- secret de signature ;
- réponses détaillées au questionnaire santé ;
- données personnelles non nécessaires au diagnostic.

---

# 10. Version

## 10.1 Source unique

`AKS.Version` constitue la source officielle des informations de version de l’application.

## 10.2 Contrat public

Le contrat public utilise des propriétés stables, notamment :

- `version` ;
- `releaseName` ;
- `channel` lorsque applicable ;
- `build` lorsque applicable.

La propriété `codename` ne fait pas partie du contrat public V1.1.

## 10.3 Consommation

Les consommateurs utilisent uniquement le contrat public.

Ils ne reconstruisent pas localement la version et ne maintiennent pas une constante concurrente.

## 10.4 Compatibilité

Tout usage résiduel de `codename` doit être remplacé par `releaseName`.

Cette correction s’applique notamment au tableau de bord d’administration identifié dans `AUDIT-002`.

---

# 11. Administration

## 11.1 Séparation des responsabilités

L’administration est organisée en composants distincts :

- contrôle d’accès ;
- collecte d’informations ;
- construction du modèle ;
- rendu ;
- exécution des actions administratives.

## 11.2 Contrôle d’accès

Toute action administrative vérifie l’autorisation avant d’exécuter un traitement sensible.

Le contrôle d’accès ne doit pas être dupliqué dans chaque vue.

## 11.3 Modèle de tableau de bord

Le modèle de tableau de bord :

- est construit à partir de données déjà préparées ;
- n’accède pas directement aux services externes ;
- n’exécute aucune action administrative ;
- est immuable ;
- expose des noms alignés sur les contrats publics.

## 11.4 Rendu

Le rendu consomme le modèle sans effectuer de logique métier ni d’accès technique direct.

---

# 12. Gestion des erreurs

## 12.1 Erreurs codifiées

Les erreurs transversales utilisent :

- un code stable ;
- un message compréhensible ;
- un contexte technique minimal ;
- une cause interne lorsque cela est possible ;
- un niveau de sensibilité adapté.

## 12.2 Frontière utilisateur

Les erreurs présentées à l’utilisateur :

- ne contiennent pas de stack trace ;
- ne contiennent pas de secret ;
- restent actionnables ;
- distinguent refus, validation, indisponibilité et erreur interne.

## 12.3 Propagation

Un composant :

- traite une erreur lorsqu’il peut réellement la résoudre ;
- l’enrichit lorsqu’il apporte un contexte utile ;
- la propage lorsqu’il ne peut pas la résoudre ;
- ne la masque jamais silencieusement.

## 12.4 Journalisation

Les erreurs techniques sont journalisées une seule fois au niveau approprié afin d’éviter les doublons inutiles.

---

# 13. Immutabilité

## 13.1 Objets concernés

Doivent être immuables lorsque possible :

- configuration publique ;
- informations de version ;
- modèles de vue ;
- résultats de lecture ;
- métadonnées d’administration ;
- événements d’audit prêts à être écrits.

## 13.2 Profondeur

Une simple immobilisation de l’objet racine n’est pas suffisante lorsqu’il contient des objets ou tableaux imbriqués mutables.

La factory doit appliquer une immobilisation cohérente avec la structure retournée.

## 13.3 Exceptions

Un objet mutable doit être explicitement identifié comme tel et limité à une responsabilité nécessitant cet état.

---

# 14. Intégrations externes

## 14.1 Encapsulation

Les appels à Google Workspace, WordPress, Gmail, Calendar, Drive ou toute API tierce sont encapsulés dans des adaptateurs.

## 14.2 Contrat interne

L’adaptateur traduit :

- les formats externes en objets internes ;
- les erreurs externes en erreurs AKS ;
- les identifiants techniques en références métier lorsque nécessaire.

## 14.3 Interdictions

Une vue, un modèle de vue ou une règle métier ne doit pas appeler directement :

- `SpreadsheetApp` ;
- `DriveApp` ;
- `GmailApp` ;
- `MailApp` ;
- `CalendarApp` ;
- `UrlFetchApp` ;
- `PropertiesService`.

Les exceptions sont limitées aux adaptateurs et au service de configuration documenté.

---

# 15. Tests

## 15.1 Tests unitaires

Chaque composant transversal dispose de tests couvrant :

- création nominale ;
- dépendance absente ;
- dépendance invalide ;
- valeur par défaut ;
- erreur attendue ;
- immutabilité ;
- stabilité du contrat public.

## 15.2 Doubles de test

Les dépendances sont remplaçables par des doubles simples sans accès réel à Google Workspace ou à un service externe.

## 15.3 Tests d’intégration

Les tests d’intégration valident :

- le bootstrap ;
- l’enregistrement des services ;
- la résolution ;
- l’ordre de composition ;
- les contrats entre composants ;
- les principaux points d’entrée.

## 15.4 Tests de non-régression

Toute correction issue de l’audit ajoute un test empêchant la réapparition du défaut.

La migration de `codename` vers `releaseName` doit être couverte par un test dédié.

---

# 16. Organisation du code

L’organisation cible suit une séparation lisible :

```text
src/
  core/
    config/
    logger/
    version/
    container/
    errors/
  admin/
    access/
    dashboard/
    dashboard-model/
  integration/
    google/
    wordpress/
  modules/
    <module>/
  bootstrap/

tests/
  unit/
  integration/
  regression/
```

Cette représentation est une cible logique.

Elle n’impose pas une migration massive immédiate des fichiers existants.

---

# 17. Règles d’évolution

Toute évolution d’un composant transversal doit :

1. identifier le contrat public concerné ;
2. analyser les consommateurs ;
3. respecter `DEP-002` ;
4. préserver la compatibilité lorsque cela est raisonnable ;
5. ajouter ou mettre à jour les tests ;
6. mettre à jour le document spécialisé ;
7. ne pas introduire de dépendance implicite ;
8. ne pas dupliquer un service déjà fourni par AKS Core.

Un changement incompatible doit être :

- exceptionnel ;
- justifié ;
- documenté ;
- accompagné d’une migration ;
- annoncé dans la documentation de version.

---

# 18. Plan d’application V1.1

L’application de `ARCH-002` suit l’ordre suivant :

## Étape 1 — Correction du contrat de version

- remplacer `codename` par `releaseName` dans les consommateurs ;
- ajouter le test de non-régression ;
- vérifier le tableau de bord.

## Étape 2 — Consolidation des factories

- valider les dépendances obligatoires ;
- limiter les contrats aux capacités utilisées ;
- uniformiser les erreurs de création.

## Étape 3 — Encadrement du conteneur

- documenter les clés de service ;
- limiter `resolve()` aux points de composition ;
- ajouter les tests de collision et de service absent.

## Étape 4 — Immutabilité

- vérifier les objets imbriqués ;
- appliquer une stratégie d’immobilisation cohérente ;
- ajouter les tests correspondants.

## Étape 5 — Préparation des futurs modules

- utiliser ces règles pour AKS Analytics ;
- utiliser ces règles pour AKS Calendar ;
- refuser toute dépendance directe entre ces modules.

---

# 19. Critères d’acceptation

`ARCH-002` est considéré comme appliqué lorsque :

- les services transversaux ne contiennent pas de logique métier ;
- les composants avec dépendances sont créés par factory ou composition root ;
- le conteneur n’est pas utilisé comme localisateur de services dans le métier ;
- les contrats publics sont stables et minimaux ;
- les objets de lecture sont immuables ;
- les intégrations externes sont encapsulées ;
- les erreurs sont codifiées et non sensibles ;
- les composants sont testables avec des doubles simples ;
- les dépendances circulaires sont absentes ;
- `releaseName` remplace `codename` dans le contrat de version ;
- les tests de non-régression sont présents ;
- la documentation et le code restent synchronisés.

---

# 20. Dépendances documentaires

`ARCH-002` dépend de :

- `ARCH-001` — Architecture fonctionnelle ;
- `AUDIT-002` — Audit transverse du code existant ;
- `DEP-002` — Règles de dépendances ;
- `CORE-001` — AKS Core ;
- `CONFIG-001` — Configuration ;
- `LOG-001` — Journalisation ;
- `VERSION-001` — Version ;
- `ADMIN-001` — Administration ;
- `SECURITY-001` — Sécurité ;
- `ERROR-001` — Gestion des erreurs ;
- `AUDIT-001` — Traçabilité fonctionnelle ;
- `NOTIF-001` — Notifications ;
- `STORAGE-001` — Stockage.

---

# 21. Conclusion

`ARCH-002` transforme les principes généraux d’AKS Platform en règles concrètes de composition et d’implémentation des services transversaux.

Il fournit une base stable pour consolider la V1.1, corriger les écarts observés dans le code existant et préparer l’arrivée d’AKS Analytics puis d’AKS Calendar sans créer de couplage excessif ni de dette architecturale évitable.

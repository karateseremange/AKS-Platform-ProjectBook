# CORE-001

# Architecture d'AKS Core

| Propriété | Valeur |
|-----------|--------|
| **Document ID** | CORE-001 |
| **Titre** | Architecture d'AKS Core |
| **Version** | 1.1.0 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-18 |

---

# 1. Objet

Le présent document décrit l'architecture d'AKS Core, le socle fonctionnel commun de la plateforme AKS Platform.

Il précise les responsabilités, les capacités et les principes de conception d'AKS Core afin de garantir une utilisation homogène par l'ensemble des modules métier.

AKS Core fournit les services communs nécessaires au fonctionnement de la plateforme sans implémenter de logique métier spécifique.

Son objectif est de mutualiser les fonctionnalités transversales, de réduire les duplications et d'assurer une base stable sur laquelle les modules métier peuvent être développés de manière indépendante.

Le présent document complète **ARCH-001**, qui définit l'architecture globale de la plateforme.

Il ne décrit ni les choix techniques d'implémentation, ni les détails du code source.

Ces éléments sont documentés dans les documents techniques ou directement dans les dépôts applicatifs.

---

# 2. Position dans le Project Book

CORE-001 est le document de référence décrivant le socle fonctionnel d'AKS Platform.

Il précise les capacités offertes par AKS Core ainsi que les règles encadrant son évolution.

Il s'appuie sur les principes définis dans **ARCH-001** et constitue la référence pour tous les développements reposant sur le socle commun de la plateforme.

Les modules métier utilisent les services fournis par AKS Core sans en modifier le comportement.

En cas d'évolution du socle, les impacts sur les modules métier doivent être analysés avant toute implémentation.

CORE-001 fait autorité concernant l'organisation et les responsabilités d'AKS Core.

---

# 3. Mission d'AKS Core

AKS Core constitue le socle fonctionnel commun d'AKS Platform.

Sa mission est de fournir les capacités transversales nécessaires au fonctionnement de l'ensemble des modules métier, tout en restant totalement indépendant de leurs règles fonctionnelles.

AKS Core représente la fondation de la plateforme.

Il offre un ensemble de services réutilisables permettant d'assurer la cohérence, la stabilité et l'évolutivité d'AKS Platform.

---

## 3.1 Objectif principal

L'objectif d'AKS Core est de centraliser les fonctionnalités communes afin d'éviter leur duplication dans les différents modules métier.

Cette approche permet :

- d'améliorer la maintenabilité ;
- de favoriser la réutilisation des composants ;
- de garantir un comportement homogène sur l'ensemble de la plateforme ;
- de simplifier le développement des nouveaux modules.

---

## 3.2 Rôle dans l'architecture

AKS Core occupe une position centrale au sein de l'architecture fonctionnelle.

Tous les modules métier peuvent utiliser les capacités qu'il met à disposition.

En revanche, AKS Core reste totalement indépendant des modules qui l'utilisent.

Cette indépendance garantit la stabilité du socle et facilite l'évolution des fonctionnalités métier.

---

## 3.3 Ce qu'AKS Core fournit

AKS Core met à disposition des modules métier des capacités communes telles que :

- la gestion du paramétrage ;
- la journalisation des événements ;
- la gestion des notifications ;
- la gestion des erreurs ;
- les mécanismes de sécurité ;
- les interfaces communes ;
- les services d'intégration ;
- les fonctionnalités de support nécessaires au fonctionnement de la plateforme.

Ces capacités sont conçues pour être génériques et réutilisables.

---

## 3.4 Ce qu'AKS Core ne fait pas

AKS Core n'implémente jamais de logique propre à un domaine fonctionnel.

Il ne contient notamment :

- aucune règle métier ;
- aucune décision fonctionnelle ;
- aucun traitement spécifique à un module ;
- aucune dépendance envers un module métier.

Les règles métier restent exclusivement dans les modules concernés.

---

## 3.5 Bénéfices apportés par AKS Core

L'utilisation d'AKS Core apporte plusieurs avantages :

- mutualisation des fonctionnalités communes ;
- réduction des duplications ;
- simplification de la maintenance ;
- homogénéisation des comportements ;
- amélioration de la qualité des développements ;
- accélération de la création de nouveaux modules.

Ces bénéfices contribuent directement à la pérennité d'AKS Platform.

---

## 3.6 Principes fondamentaux

AKS Core est conçu selon les principes suivants :

- indépendance vis-à-vis des modules métier ;
- responsabilité unique ;
- faible couplage ;
- forte réutilisabilité ;
- interfaces stables ;
- évolutivité maîtrisée ;
- compatibilité avec les versions précédentes.

Ces principes garantissent la stabilité du socle commun tout au long du cycle de vie de la plateforme.

---

## 3.7 Vision à long terme

AKS Core est destiné à accompagner durablement l'évolution d'AKS Platform.

Au fil des versions, de nouvelles capacités communes pourront être intégrées lorsque plusieurs modules exprimeront un besoin identique.

Cette évolution progressive permet de renforcer le socle de la plateforme sans remettre en cause son architecture de référence.

AKS Core constitue ainsi la pierre angulaire sur laquelle repose l'ensemble des modules présents et futurs d'AKS Platform.

---

# 4. Principes de conception

AKS Core est conçu comme un socle fonctionnel stable, générique et réutilisable.

Ses principes de conception garantissent la cohérence de la plateforme, limitent les dépendances entre composants et facilitent l'évolution d'AKS Platform au fil des versions.

Ces principes s'appliquent à toute évolution du socle commun.

---

## 4.1 Indépendance

AKS Core est totalement indépendant des modules métier.

Il ne connaît ni leur organisation, ni leurs règles fonctionnelles, ni leurs traitements spécifiques.

Les modules utilisent AKS Core, mais AKS Core ne dépend jamais d'eux.

Cette indépendance constitue le fondement de la stabilité de la plateforme.

---

## 4.2 Responsabilité unique

Chaque composant d'AKS Core possède une responsabilité clairement définie.

Une fonctionnalité ne doit être implémentée qu'à un seul endroit.

Cette organisation facilite :

- la compréhension du socle ;
- la maintenance ;
- les évolutions futures ;
- les tests.

---

## 4.3 Mutualisation

Toute capacité susceptible d'être utilisée par plusieurs modules doit être intégrée à AKS Core ou à un service commun.

La mutualisation permet :

- d'éviter les duplications ;
- d'assurer un comportement homogène ;
- de simplifier les évolutions ;
- de réduire la dette technique.

---

## 4.4 Faible couplage

Les composants d'AKS Core communiquent au travers d'interfaces clairement définies.

Ils ne doivent pas dépendre de l'implémentation interne des autres composants.

Cette approche permet :

- de remplacer un composant sans impacter les autres ;
- de simplifier les tests ;
- de limiter les régressions.

---

## 4.5 Forte cohésion

Chaque composant regroupe des fonctionnalités ayant un objectif commun.

Les responsabilités ne doivent pas être dispersées entre plusieurs composants.

Une forte cohésion améliore la lisibilité de l'architecture et facilite sa maintenance.

---

## 4.6 Réutilisabilité

Les capacités fournies par AKS Core sont conçues pour être réutilisées par tous les modules métier.

Aucune fonctionnalité du socle ne doit être développée pour répondre exclusivement à un besoin spécifique.

Lorsqu'un besoin est propre à un seul module, il reste implémenté dans ce module.

---

## 4.7 Évolutivité

AKS Core doit pouvoir évoluer sans remettre en cause les modules existants.

Les nouvelles capacités sont ajoutées progressivement lorsque leur intérêt devient transversal.

Cette évolution incrémentale permet de préserver la stabilité de la plateforme.

---

## 4.8 Compatibilité

Les évolutions d'AKS Core doivent préserver, dans la mesure du possible, la compatibilité avec les modules déjà développés.

Toute rupture de compatibilité doit :

- être exceptionnelle ;
- être documentée ;
- être justifiée ;
- être validée avant son implémentation.

---

## 4.9 Simplicité

Les solutions retenues privilégient la simplicité.

AKS Core ne doit pas devenir un framework complexe.

Chaque capacité intégrée au socle doit apporter une réelle valeur à plusieurs modules.

La simplicité favorise :

- une meilleure compréhension ;
- un développement plus rapide ;
- une maintenance facilitée ;
- une évolution maîtrisée.

---

## 4.10 Pérennité

AKS Core est conçu pour accompagner durablement le développement d'AKS Platform.

Les choix de conception privilégient des solutions robustes, génériques et indépendantes des technologies utilisées.

Cette approche garantit la stabilité du socle tout en permettant son adaptation aux besoins futurs de la plateforme.

---

# 5. Capacités fonctionnelles d'AKS Core

AKS Core met à disposition un ensemble de capacités fonctionnelles communes destinées à être utilisées par l'ensemble des modules métier.

Ces capacités constituent les fondations de la plateforme.

Elles sont conçues pour être génériques, réutilisables et indépendantes de tout domaine fonctionnel particulier.

---

## 5.1 Principes généraux

Les capacités d'AKS Core répondent aux principes suivants :

- être réutilisables par plusieurs modules ;
- être indépendantes des règles métier ;
- proposer des interfaces stables ;
- être faiblement couplées ;
- pouvoir évoluer sans impacter les modules existants.

Une capacité n'est intégrée à AKS Core que lorsqu'elle présente un intérêt transversal pour la plateforme.

---

## 5.2 Gestion du paramétrage

AKS Core fournit un mécanisme centralisé de gestion du paramétrage.

Cette capacité permet notamment :

- la gestion des paramètres globaux de la plateforme ;
- la gestion des paramètres propres aux modules ;
- la centralisation des valeurs de configuration ;
- la consultation des paramètres par les modules autorisés.

Les règles fonctionnelles liées à l'utilisation de ces paramètres restent sous la responsabilité des modules métier.

---

## 5.3 Journalisation

AKS Core fournit les mécanismes nécessaires à la journalisation des événements de la plateforme.

Cette capacité permet :

- l'enregistrement des événements applicatifs ;
- la traçabilité des traitements ;
- le suivi des erreurs ;
- l'aide au diagnostic ;
- le support des opérations de maintenance.

La politique de journalisation est commune à l'ensemble des modules.

---

## 5.4 Notifications

AKS Core met à disposition un service unifié de gestion des notifications.

Cette capacité permet aux modules métier de produire des notifications sans gérer directement les mécanismes d'envoi.

Selon les besoins de la plateforme, les notifications pourront être transmises par différents canaux, tels que :

- courrier électronique ;
- notifications internes ;
- services tiers validés.

Le choix du canal reste transparent pour les modules métier.

---

## 5.5 Gestion documentaire

AKS Core fournit les mécanismes communs nécessaires à la production de documents.

Cette capacité peut notamment être utilisée pour :

- générer des attestations ;
- produire des rapports ;
- créer des documents administratifs ;
- exporter des données.

La mise en forme spécifique d'un document relève du module métier qui en fait la demande.

---

## 5.6 Sécurité

AKS Core centralise les mécanismes de sécurité communs à l'ensemble de la plateforme.

Cette capacité comprend notamment :

- la gestion des autorisations ;
- la protection des échanges ;
- les contrôles d'accès ;
- les mécanismes d'authentification lorsqu'ils sont nécessaires ;
- les fonctions de sécurité transverses.

Les règles d'autorisation propres à un domaine fonctionnel restent sous la responsabilité des modules métier.

---

## 5.7 Gestion des erreurs

AKS Core fournit un mécanisme commun de gestion des erreurs.

Cette capacité permet :

- de détecter les anomalies ;
- de normaliser leur traitement ;
- de faciliter le diagnostic ;
- de garantir un comportement homogène de la plateforme.

Les modules métier restent responsables de la gestion de leurs exceptions fonctionnelles.

---

## 5.8 Interfaces communes

AKS Core définit les interfaces communes utilisées par les différents composants de la plateforme.

Ces interfaces garantissent :

- des échanges homogènes ;
- un faible couplage entre composants ;
- une meilleure évolutivité ;
- une simplification des tests.

Les composants communiquent exclusivement au travers de ces interfaces.

---

## 5.9 Services d'intégration

AKS Core fournit les mécanismes permettant aux modules métier d'interagir avec les services externes via les services communs.

Cette capacité permet notamment :

- d'uniformiser les échanges ;
- de limiter les dépendances techniques ;
- de simplifier le remplacement d'un service externe ;
- de garantir une architecture cohérente.

Les modules métier ne communiquent jamais directement avec les systèmes externes.

---

## 5.10 Évolution des capacités

Les capacités d'AKS Core évoluent progressivement en fonction des besoins de la plateforme.

Une nouvelle capacité ne peut être intégrée au socle que si :

- elle répond à un besoin partagé par plusieurs modules ;
- elle respecte les principes définis dans le présent document ;
- elle apporte une valeur durable à la plateforme ;
- elle ne crée pas de dépendance envers un module métier.

Cette approche garantit la stabilité et la pérennité d'AKS Core.

---

# 6. Services communs

Les services communs regroupent les fonctionnalités transversales mises à disposition par AKS Core.

Ils permettent de mutualiser les traitements techniques utilisés par plusieurs modules métier et garantissent un comportement homogène sur l'ensemble de la plateforme.

Chaque service possède une responsabilité clairement définie et reste indépendant des règles métier.

---

## 6.1 Principes généraux

Les services communs sont conçus selon les principes suivants :

- responsabilité unique ;
- forte réutilisabilité ;
- faible couplage ;
- interfaces stables ;
- indépendance vis-à-vis des modules métier.

Ils constituent les briques techniques partagées de la plateforme.

---

## 6.2 Service de paramétrage

Le service de paramétrage centralise les paramètres de fonctionnement de la plateforme.

Il permet notamment :

- la consultation des paramètres globaux ;
- la gestion des paramètres applicatifs ;
- la gestion des paramètres propres aux modules ;
- la centralisation des valeurs de configuration.

Les modules métier restent responsables de l'interprétation fonctionnelle de ces paramètres.

---

## 6.3 Service de journalisation

Le service de journalisation assure la traçabilité des événements de la plateforme.

Il permet notamment :

- l'enregistrement des opérations importantes ;
- le suivi des traitements ;
- la journalisation des erreurs ;
- l'aide au diagnostic ;
- le support des opérations de maintenance.

La politique de journalisation est commune à tous les modules.

---

## 6.4 Service de notifications

Le service de notifications prend en charge la diffusion des messages générés par les modules métier.

Il assure notamment :

- la préparation des notifications ;
- la sélection du canal de diffusion ;
- la gestion des modèles de messages ;
- le suivi des envois lorsque cela est nécessaire.

Les modules métier expriment uniquement le besoin de notifier ; ils ne gèrent pas les mécanismes d'envoi.

---

## 6.5 Service documentaire

Le service documentaire fournit les capacités communes de production de documents.

Il peut être utilisé pour :

- générer des attestations ;
- produire des rapports ;
- créer des documents administratifs ;
- exporter des données dans différents formats.

Le contenu métier du document reste sous la responsabilité du module qui en fait la demande.

---

## 6.6 Service de sécurité

Le service de sécurité regroupe les mécanismes communs de protection de la plateforme.

Il comprend notamment :

- la gestion des autorisations ;
- les contrôles d'accès ;
- les mécanismes d'authentification ;
- la protection des échanges ;
- les fonctions de sécurité transverses.

Les décisions d'autorisation liées à un domaine métier restent sous la responsabilité du module concerné.

---

## 6.7 Service de gestion des erreurs

Le service de gestion des erreurs fournit un cadre commun pour le traitement des anomalies.

Il permet :

- la normalisation des erreurs ;
- la centralisation des traitements ;
- l'amélioration des diagnostics ;
- la production d'informations exploitables pour la maintenance.

Les erreurs métier restent gérées par les modules concernés.

---

## 6.8 Service d'intégration

Le service d'intégration assure les échanges avec les services et systèmes externes.

Il permet notamment :

- l'utilisation des API externes ;
- les échanges avec Google Workspace ;
- les interactions avec WordPress ;
- les communications avec Google Calendar ;
- les échanges avec GitHub ;
- les futures intégrations validées dans la feuille de route.

Les spécificités techniques des services externes restent encapsulées dans ce service.

---

## 6.9 Collaboration entre les services

Les services communs sont conçus pour fonctionner de manière complémentaire.

Ils peuvent collaborer entre eux lorsque cela est nécessaire tout en conservant des responsabilités clairement séparées.

Par exemple :

- une erreur peut être journalisée avant de déclencher une notification ;
- la génération d'un document peut utiliser le service de paramétrage ;
- une intégration externe peut produire des événements enregistrés par le service de journalisation.

Ces collaborations ne doivent jamais créer de dépendances circulaires.

---

## 6.10 Évolution des services communs

Un nouveau service commun peut être créé lorsqu'une capacité :

- est utilisée par plusieurs modules métier ;
- présente un intérêt durable pour la plateforme ;
- respecte les principes définis dans ARCH-001 et CORE-001 ;
- peut être mutualisée sans introduire de dépendance métier.

Les services communs évoluent progressivement afin d'accompagner le développement d'AKS Platform tout en préservant la stabilité du socle.

---

# 7. Organisation interne

AKS Core est organisé en composants fonctionnels indépendants, chacun étant responsable d'une capacité commune de la plateforme.

Cette organisation favorise la modularité, la réutilisation et l'évolutivité du socle tout en limitant les dépendances entre les différents services.

---

## 7.1 Principes d'organisation

L'organisation interne d'AKS Core repose sur les principes suivants :

- séparation des responsabilités ;
- faible couplage entre composants ;
- forte cohésion des services ;
- interfaces clairement définies ;
- absence de dépendances circulaires.

Chaque composant peut évoluer indépendamment tant que son interface publique reste compatible.

---

## 7.2 Vue d'ensemble

L'organisation logique d'AKS Core peut être représentée comme suit :

```text
                     AKS Core
                         │
 ┌───────────────┬────────┼────────┬───────────────┐
 │               │        │        │               │
 ▼               ▼        ▼        ▼               ▼
Paramétrage Journalisation Notifications Sécurité Gestion documentaire
 │               │        │        │               │
 └───────────────┴────────┼────────┴───────────────┘
                          ▼
                 Service d'intégration
                          │
                          ▼
                Services et systèmes externes
```

Cette représentation est fonctionnelle.

Elle ne décrit pas l'organisation technique du code source.

---

## 7.3 Indépendance des composants

Chaque composant d'AKS Core possède son propre périmètre de responsabilité.

Il peut évoluer sans nécessiter de modification des autres composants, sous réserve de conserver une interface compatible.

Cette indépendance permet :

- de simplifier la maintenance ;
- de limiter les régressions ;
- de faciliter les tests ;
- de favoriser les évolutions progressives.

---

## 7.4 Interfaces internes

Les composants communiquent exclusivement au travers d'interfaces clairement définies.

Une interface expose uniquement les capacités nécessaires à son utilisation.

Les détails d'implémentation restent internes au composant.

Cette approche permet :

- de réduire le couplage ;
- de masquer la complexité interne ;
- de préserver la stabilité des échanges.

---

## 7.5 Flux internes

Lorsqu'un module métier sollicite AKS Core, la demande est orientée vers le ou les composants concernés.

Le traitement peut mobiliser plusieurs services communs successivement.

Exemple de flux :

```text
Module métier
      │
      ▼
AKS Core
      │
      ├──► Paramétrage
      ├──► Sécurité
      ├──► Journalisation
      ├──► Notifications
      └──► Service d'intégration
```

Chaque composant intervient uniquement lorsque sa responsabilité est requise.

---

## 7.6 Échanges entre composants

Les composants peuvent collaborer lorsque cela est nécessaire.

Par exemple :

- le service documentaire peut consulter le service de paramétrage ;
- le service de notifications peut enregistrer un événement dans le service de journalisation ;
- le service d'intégration peut utiliser les mécanismes de sécurité avant un échange externe.

Ces échanges restent limités aux besoins strictement nécessaires.

Les dépendances circulaires sont interdites.

---

## 7.7 Évolutivité de l'organisation

L'organisation interne d'AKS Core est conçue pour évoluer progressivement.

L'ajout d'un nouveau composant est possible lorsqu'une nouvelle capacité :

- est commune à plusieurs modules ;
- présente un intérêt durable ;
- respecte les principes définis dans ARCH-001 et CORE-001.

L'introduction d'un nouveau composant ne doit pas remettre en cause l'organisation existante.

---

## 7.8 Stabilité du socle

La stabilité d'AKS Core repose sur la maîtrise de son organisation interne.

Toute évolution doit préserver :

- les interfaces publiques ;
- les responsabilités des composants ;
- les règles de dépendances ;
- la compatibilité avec les modules métier existants.

Cette stabilité garantit la pérennité du socle et facilite l'évolution continue d'AKS Platform.

---

# 8. Interfaces avec les modules métier

Les modules métier s'appuient sur AKS Core pour accéder aux capacités communes de la plateforme.

Les interfaces définissent les modalités d'interaction entre les modules métier et le socle commun, tout en garantissant leur indépendance réciproque.

Elles constituent le point de contact officiel entre AKS Core et les modules métier.

---

## 8.1 Principes généraux

Les interfaces d'AKS Core respectent les principes suivants :

- stabilité ;
- simplicité ;
- indépendance des implémentations ;
- faible couplage ;
- évolutivité.

Les modules métier utilisent uniquement les interfaces publiques d'AKS Core.

Ils ne doivent jamais accéder directement aux composants internes du socle.

---

## 8.2 Utilisation des interfaces

Lorsqu'un module métier nécessite une capacité commune, il sollicite l'interface correspondante d'AKS Core.

Par exemple :

- consulter un paramètre ;
- enregistrer un événement ;
- générer un document ;
- envoyer une notification ;
- accéder à un service d'intégration.

Le module métier reste responsable de la décision fonctionnelle.

AKS Core exécute uniquement la capacité demandée.

---

## 8.3 Contrat d'interface

Chaque interface constitue un contrat entre AKS Core et les modules métier.

Ce contrat définit :

- les capacités mises à disposition ;
- les informations attendues en entrée ;
- les résultats fournis en sortie ;
- les comportements garantis.

Les modules métier ne doivent pas dépendre des détails d'implémentation des services internes.

---

## 8.4 Indépendance des modules

Tous les modules métier utilisent les mêmes interfaces.

Aucune interface spécifique ne doit être créée pour un module particulier.

Lorsqu'un besoin est propre à un seul module, il doit être traité dans ce module et non dans AKS Core.

Cette règle garantit un socle commun réellement générique.

---

## 8.5 Évolution des interfaces

Les interfaces publiques d'AKS Core évoluent de manière maîtrisée.

Toute modification doit :

- préserver la compatibilité avec les modules existants lorsque cela est possible ;
- être documentée dans le Project Book ;
- être validée avant son implémentation.

Une évolution d'interface ne doit jamais imposer une modification systématique de tous les modules métier.

---

## 8.6 Gestion des erreurs

Les interfaces d'AKS Core fournissent un comportement homogène en cas d'erreur.

Les erreurs techniques sont traitées par AKS Core selon les mécanismes communs de la plateforme.

Les erreurs métier restent sous la responsabilité du module appelant.

Cette séparation garantit une répartition claire des responsabilités.

---

## 8.7 Schéma des interactions

Les échanges entre les modules métier et AKS Core suivent le modèle suivant :

```text
                 Module métier
                       │
                       ▼
          Interface publique d'AKS Core
                       │
                       ▼
          Composants internes d'AKS Core
                       │
                       ▼
              Services communs
                       │
                       ▼
          Services et systèmes externes
```

Le module métier n'interagit jamais directement avec les composants internes d'AKS Core ni avec les services externes.

Toutes les communications transitent par les interfaces publiques.

---

## 8.8 Garanties apportées

Les interfaces d'AKS Core offrent les garanties suivantes :

- une utilisation uniforme des capacités communes ;
- une indépendance entre le socle et les modules métier ;
- une stabilité des échanges ;
- une meilleure maintenabilité ;
- une évolutivité maîtrisée de la plateforme.

Ces garanties permettent le développement de nouveaux modules sans remettre en cause les composants existants.

---

# 9. Règles d'évolution d'AKS Core

AKS Core constitue le socle commun d'AKS Platform.

Son évolution doit être maîtrisée afin de préserver la stabilité de la plateforme tout en répondant aux nouveaux besoins exprimés par les modules métier.

Les règles définies dans ce chapitre encadrent toute évolution du socle.

---

## 9.1 Principes généraux

Toute évolution d'AKS Core doit respecter les principes suivants :

- préserver la stabilité du socle ;
- maintenir son indépendance vis-à-vis des modules métier ;
- favoriser la réutilisation des capacités communes ;
- limiter les ruptures de compatibilité ;
- rester conforme aux principes définis dans ARCH-001.

Une évolution ne doit jamais remettre en cause les fondements de l'architecture de la plateforme.

---

## 9.2 Conditions d'ajout d'une nouvelle capacité

Une nouvelle capacité peut être intégrée à AKS Core uniquement si elle répond aux critères suivants :

- elle est utile à plusieurs modules métier ;
- elle présente un intérêt durable pour la plateforme ;
- elle est indépendante de toute logique métier ;
- elle peut être conçue comme une capacité générique et réutilisable.

Une fonctionnalité propre à un seul module ne doit pas être intégrée à AKS Core.

---

## 9.3 Évolution des composants existants

Les composants existants peuvent évoluer afin :

- d'améliorer leurs performances ;
- de simplifier leur maintenance ;
- d'étendre leurs capacités ;
- de renforcer leur sécurité ;
- d'améliorer leur qualité.

Ces évolutions ne doivent pas modifier leur responsabilité principale.

---

## 9.4 Compatibilité

La compatibilité avec les modules métier existants doit être préservée autant que possible.

Lorsqu'une rupture de compatibilité est inévitable, elle doit :

- être exceptionnelle ;
- être justifiée ;
- être documentée ;
- être validée avant son implémentation.

Les impacts sur les modules concernés doivent être identifiés avant toute mise en œuvre.

---

## 9.5 Dépréciation des capacités

Lorsqu'une capacité devient obsolète, elle peut être déclarée comme dépréciée.

Une capacité dépréciée :

- reste disponible pendant une période transitoire ;
- continue à fonctionner selon les conditions définies par la plateforme ;
- fait l'objet d'une documentation indiquant son remplacement lorsqu'il existe.

La suppression définitive d'une capacité intervient uniquement après validation et mise à jour de la documentation.

---

## 9.6 Gestion des dépendances

Toute évolution d'AKS Core doit préserver les règles de dépendances définies dans ARCH-001.

En particulier :

- AKS Core ne dépend jamais d'un module métier ;
- les dépendances circulaires sont interdites ;
- les interfaces publiques restent le point d'accès unique aux capacités du socle.

Toute nouvelle dépendance doit être justifiée et documentée.

---

## 9.7 Documentation des évolutions

Toute évolution significative d'AKS Core doit être documentée avant son implémentation.

La documentation doit préciser :

- l'objectif de l'évolution ;
- les composants concernés ;
- les impacts éventuels sur les modules métier ;
- les éventuelles évolutions des interfaces publiques.

Le Project Book demeure la référence officielle.

---

## 9.8 Validation des évolutions

Avant d'intégrer une évolution dans AKS Core, les questions suivantes doivent être examinées :

- La capacité est-elle réellement commune à plusieurs modules ?
- Son intégration renforce-t-elle le socle de la plateforme ?
- Introduit-elle une dépendance non souhaitée ?
- Les interfaces publiques restent-elles cohérentes ?
- Les modules existants restent-ils compatibles ?

Une évolution ne répondant pas à ces critères ne doit pas être intégrée au socle.

---

## 9.9 Vision à long terme

AKS Core est conçu pour évoluer progressivement avec AKS Platform.

Son développement privilégie l'enrichissement progressif des capacités communes plutôt que l'augmentation de la complexité.

Chaque évolution doit contribuer à renforcer le rôle d'AKS Core comme socle fonctionnel de référence, tout en conservant les qualités qui fondent son architecture :

- simplicité ;
- stabilité ;
- réutilisabilité ;
- évolutivité ;
- indépendance.

---

# 10. Gouvernance d'AKS Core

La gouvernance d'AKS Core définit les règles permettant d'assurer la cohérence, la stabilité et l'évolution maîtrisée du socle commun d'AKS Platform.

Elle garantit que les capacités fournies par AKS Core restent génériques, réutilisables et conformes aux principes d'architecture définis dans le Project Book.

---

## 10.1 Objectifs

La gouvernance d'AKS Core poursuit les objectifs suivants :

- préserver la stabilité du socle commun ;
- garantir la cohérence de son évolution ;
- assurer la qualité des services fournis ;
- maintenir la compatibilité avec les modules métier ;
- limiter la dette technique ;
- maintenir une documentation à jour.

---

## 10.2 Documents de référence

La gouvernance d'AKS Core s'appuie principalement sur les documents suivants :

- **VISION-001** — Vision d'AKS Platform ;
- **OBJECTIVES-001** — Objectifs de la plateforme ;
- **ROADMAP-001** — Planification des évolutions ;
- **ARCH-001** — Architecture fonctionnelle d'AKS Platform ;
- **CORE-001** — Architecture d'AKS Core.

Ces documents constituent le cadre de référence pour toute évolution du socle.

---

## 10.3 Processus d'évolution

Toute évolution d'AKS Core suit le processus suivant :

1. identification d'un besoin commun ;
2. analyse de son caractère transversal ;
3. étude des impacts sur les composants existants ;
4. validation de la solution retenue ;
5. mise à jour du Project Book ;
6. implémentation ;
7. validation fonctionnelle et technique.

La documentation précède systématiquement le développement.

---

## 10.4 Critères d'intégration

Avant d'intégrer une nouvelle capacité dans AKS Core, les critères suivants doivent être vérifiés :

- la capacité est commune à plusieurs modules ;
- elle ne contient aucune logique métier ;
- elle respecte les principes définis dans ARCH-001 ;
- elle peut être maintenue indépendamment des modules métier ;
- elle apporte une valeur durable à la plateforme.

Une capacité ne répondant pas à ces critères reste implémentée dans le module métier concerné.

---

## 10.5 Gestion des exceptions

Dans des situations exceptionnelles, une dérogation aux principes d'AKS Core peut être envisagée.

Toute dérogation doit :

- être exceptionnelle ;
- être justifiée ;
- être documentée ;
- être validée avant son implémentation.

Une exception ne modifie jamais les principes fondamentaux du socle.

---

## 10.6 Revue du socle

AKS Core fait l'objet de revues régulières afin de vérifier :

- la pertinence des capacités proposées ;
- l'absence de dépendances métier ;
- la cohérence des interfaces publiques ;
- la qualité des services communs ;
- les opportunités de simplification ou de mutualisation.

Ces revues permettent de maintenir un socle robuste et durable.

---

## 10.7 Gestion des versions

Chaque évolution significative d'AKS Core donne lieu à une nouvelle version du présent document.

Les modifications doivent être :

- identifiées ;
- documentées ;
- historisées.

La version publiée constitue la référence officielle jusqu'à sa révision.

---

## 10.8 Responsabilité de la gouvernance

La gouvernance d'AKS Core relève du **Product Owner**.

Il est responsable :

- de la cohérence du socle commun ;
- de la validation des nouvelles capacités ;
- de la conformité des évolutions avec ARCH-001 ;
- de la stabilité des interfaces publiques ;
- de l'approbation des évolutions structurantes d'AKS Core.

Les contributeurs au projet appliquent les principes définis dans le présent document lors de toute évolution du socle fonctionnel.

---

# 11. Documents associés

CORE-001 s'inscrit dans l'architecture documentaire du Project Book et complète les documents de gouvernance ainsi que les documents d'architecture de la plateforme.

Il constitue le document de référence décrivant le socle fonctionnel commun d'AKS Platform.

Les documents associés précisent les principes, les responsabilités et les règles d'évolution applicables au développement des modules métier.

---

## 11.1 Documents de gouvernance

Les documents de gouvernance définissent la stratégie et le cadre général du projet.

| Document | Objet |
|----------|-------|
| **README** | Présentation générale du Project Book |
| **VISION-001** | Vision d'AKS Platform |
| **OBJECTIVES-001** | Objectifs stratégiques |
| **SCOPE-001** | Périmètre fonctionnel |
| **ROADMAP-001** | Planification des évolutions |

Ces documents définissent les objectifs poursuivis par la plateforme.

---

## 11.2 Documents d'architecture

Les documents d'architecture décrivent l'organisation fonctionnelle de la plateforme et de ses principaux composants.

| Document | Objet |
|----------|-------|
| **ARCH-001** | Architecture fonctionnelle d'AKS Platform |
| **CORE-001** | Architecture d'AKS Core |

ARCH-001 définit les principes d'architecture généraux tandis que CORE-001 décrit le fonctionnement du socle commun.

---

## 11.3 Documentation des modules métier

Chaque module métier dispose de sa propre documentation.

Cette documentation décrit notamment :

- son objectif ;
- son périmètre fonctionnel ;
- ses règles métier ;
- ses dépendances ;
- ses interfaces ;
- ses évolutions.

Les modules métier utilisent les capacités d'AKS Core conformément aux principes définis dans le présent document.

---

## 11.4 Documentation technique

La documentation technique complète la documentation fonctionnelle lorsque cela est nécessaire.

Elle peut notamment comprendre :

- les conventions de développement ;
- les guides d'installation ;
- les procédures de déploiement ;
- les guides d'administration ;
- les procédures de maintenance ;
- les documentations des interfaces techniques.

Ces documents détaillent les aspects techniques d'implémentation sans modifier les responsabilités d'AKS Core.

---

## 11.5 Références externes

AKS Core peut s'appuyer sur des documentations externes relatives aux technologies utilisées par la plateforme.

Ces références peuvent notamment concerner :

- Google Workspace ;
- Google Apps Script ;
- Google Drive ;
- Google Calendar ;
- WordPress ;
- GitHub ;
- les API et services tiers intégrés à AKS Platform.

Ces documentations complètent le Project Book sans s'y substituer.

---

## 11.6 Position de CORE-001 dans le Project Book

CORE-001 occupe une position intermédiaire entre l'architecture générale de la plateforme et la documentation des modules métier.

```text
README
│
├── VISION-001
├── OBJECTIVES-001
├── SCOPE-001
├── ROADMAP-001
│
├── ARCH-001
│      │
│      └── CORE-001
│              │
│              ├── Modules métier
│              ├── Services communs
│              └── Documentation technique
│
└── Documents opérationnels
```

Cette organisation garantit une séparation claire entre :

- les principes d'architecture de la plateforme ;
- les responsabilités du socle commun ;
- les règles métier propres à chaque module ;
- les aspects techniques d'implémentation.

CORE-001 constitue ainsi le document de référence pour tout développement reposant sur AKS Core.

---

# 12. Conclusion

AKS Core constitue le socle fonctionnel commun d'AKS Platform.

Il fournit les capacités transversales nécessaires au fonctionnement de l'ensemble des modules métier tout en demeurant indépendant de leurs règles fonctionnelles.

Le présent document définit les responsabilités, les principes de conception, les capacités fonctionnelles et les règles d'évolution du socle afin de garantir une architecture cohérente, stable et durable.

AKS Core repose sur plusieurs principes fondamentaux :

- la séparation des responsabilités ;
- l'absence de logique métier ;
- la mutualisation des services communs ;
- des interfaces publiques stables ;
- un faible couplage entre les composants ;
- une évolutivité maîtrisée.

Cette organisation permet de développer de nouveaux modules métier sans remettre en cause les fondements de la plateforme.

Elle favorise :

- la réutilisation des composants ;
- la simplification des développements ;
- la réduction de la dette technique ;
- l'amélioration de la qualité des livrables ;
- la pérennité d'AKS Platform.

AKS Core évolue progressivement en fonction des besoins communs identifiés au sein de la plateforme.

Chaque évolution est analysée, documentée et validée avant son implémentation afin de préserver la cohérence du socle et la compatibilité avec les modules existants.

CORE-001 constitue ainsi la référence officielle pour la conception, l'évolution et l'utilisation d'AKS Core.

Tout développement reposant sur le socle commun d'AKS Platform doit respecter les principes, les responsabilités et les règles définis dans le présent document.
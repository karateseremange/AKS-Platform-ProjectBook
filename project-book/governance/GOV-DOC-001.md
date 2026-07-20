# GOV-DOC-001

# Gouvernance documentaire

| Propriété | Valeur |
|-----------|--------|
| Document ID | GOV-DOC-001 |
| Titre | Gouvernance documentaire |
| Version | 1.0.0 |
| Statut | Published |
| Propriétaire | Product Owner |
| Dernière mise à jour | 2026-07-20 |
| Version du produit | V1.1 |

---

## 1. Objet

Le présent document définit les règles de gouvernance documentaire applicables à AKS Platform.

Il précise comment les documents de référence sont conçus, rédigés, revus, publiés et maintenus afin que le Project Book demeure la référence normative officielle du projet.

---

## 2. Périmètre

Le présent document couvre :

- le rôle des différents référentiels du projet ;
- le statut normatif du Project Book ;
- la notion de baseline documentaire ;
- le cycle de vie des documents ;
- les règles de publication ;
- la synchronisation entre documentation et développement ;
- le référencement documentaire dans les User Stories.

Sont exclus de son périmètre :

- les règles de développement logiciel, de gestion des branches, de revue de code et de qualité ;
- les motivations architecturales ayant conduit à l'organisation documentaire du projet ;
- les mécanismes avancés de gestion de configuration ;
- les Configuration Items ;
- les manifestes et comparaisons de baselines ;
- les politiques avancées de versionnement.

Ces sujets relèvent d'autres documents ou pourront être traités ultérieurement lorsqu'un besoin concret aura été observé.

---

## 3. Référentiels du projet

AKS Platform repose sur trois référentiels distincts.

```text
Atelier de conception
        │
        ▼
Project Book
Baseline documentaire
        │
        ▼
Implémentation
```

### 3.1 Conversations ChatGPT

Les conversations ChatGPT constituent l'atelier de conception du projet.

Elles sont utilisées pour :

- analyser les besoins ;
- élaborer et comparer des solutions ;
- préparer les décisions ;
- rédiger et revoir les documents ;
- accompagner la réalisation des livrables.

Les conversations, propositions et brouillons ne constituent jamais une référence normative.

### 3.2 Dépôt documentaire

Le dépôt `AKS-Platform-ProjectBook` contient la documentation officielle d'AKS Platform.

Il constitue le référentiel normatif du projet pour :

- la gouvernance ;
- les décisions d'architecture ;
- l'architecture fonctionnelle et technique ;
- les spécifications ;
- les règles transverses ;
- les documents de référence des User Stories.

Seuls les documents publiés dans ce dépôt avec le statut `Published` font autorité.

### 3.3 Dépôt applicatif

Le dépôt `AKS-Platform` constitue le référentiel d'implémentation.

Il contient notamment :

- le code source ;
- les scripts ;
- les tests ;
- les ressources nécessaires à l'exécution ;
- la documentation directement liée à l'utilisation ou à la maintenance du code.

Le dépôt applicatif implémente les règles définies dans le Project Book. Il ne remplace pas la documentation normative.

---

## 4. Flux d'autorité

Le flux d'autorité entre les référentiels est unidirectionnel.

```text
Conception
      ↓
Documentation
      ↓
Code
```

Les décisions sont élaborées dans l'atelier de conception, formalisées dans le Project Book, puis implémentées dans le dépôt applicatif.

Le code ne doit pas devenir, par sa seule existence, une nouvelle règle fonctionnelle, architecturale ou de gouvernance.

Lorsqu'une divergence est détectée entre le code et la documentation publiée, elle doit être analysée et corrigée. La correction peut conduire à modifier le code, la documentation ou les deux, mais toute nouvelle décision doit être formalisée dans le Project Book avant d'être considérée comme normative.

---

## 5. Baseline documentaire

Le Project Book publié constitue la baseline documentaire d'AKS Platform.

Cette baseline correspond à l'état officiel et exploitable des documents normatifs disponibles à un instant donné.

Elle permet notamment :

- d'identifier les règles applicables au développement ;
- de disposer d'une référence commune pour les revues ;
- d'assurer la continuité du projet sans dépendre de l'historique des conversations ;
- de faciliter l'arrivée de nouveaux contributeurs ;
- d'établir la traçabilité entre les besoins, les documents et l'implémentation.

Le présent document ne définit pas de système avancé de gestion de configuration. De tels mécanismes ne seront formalisés qu'après avoir été pratiqués et après constat d'un besoin réel.

---

## 6. Cycle de vie documentaire

Un document suit le cycle de vie suivant :

```text
Discussion
        ↓
Rédaction
        ↓
Review
        ↓
Published
```

### 6.1 Discussion

Le besoin documentaire est analysé dans l'atelier de conception.

Les décisions, contraintes et informations nécessaires sont identifiées.

### 6.2 Rédaction

Le document est préparé conformément aux décisions validées et aux conventions éditoriales du Project Book.

À ce stade, son contenu n'est pas normatif.

### 6.3 Review

Le document est relu afin de vérifier :

- sa conformité aux décisions prises ;
- sa cohérence avec les documents existants ;
- l'absence de contradiction avec des décisions ultérieures ;
- la clarté de son périmètre ;
- son aptitude à servir de référence au développement.

### 6.4 Published

Le document est intégré dans `AKS-Platform-ProjectBook` avec le statut `Published`.

À compter de cette publication, il devient une référence normative officielle.

Seule la version publiée dans le dépôt documentaire fait autorité.

---

## 7. Règles fondamentales

### 7.1 Règle GOV-DOC-001

> Seuls les documents ayant le statut `Published` dans `AKS-Platform-ProjectBook` constituent la référence officielle d'AKS Platform.

Toute information présente uniquement dans une conversation, un brouillon ou un document non publié reste non normative.

### 7.2 Règle GOV-DOC-002

> Aucun développement ne débute tant que les documents de référence nécessaires ne sont pas publiés.

Réciproquement :

> Aucune User Story n'est considérée comme terminée tant que sa documentation n'est pas publiée et synchronisée avec le code.

Ces règles s'appliquent aux nouvelles fonctionnalités, aux évolutions fonctionnelles, aux décisions d'architecture et aux règles transverses.

---

## 8. Processus de publication

Avant publication, chaque document est consolidé selon le processus suivant :

```text
Dernière version validée
        ↓
Vérification des décisions ultérieures
        ↓
Intégration des compléments validés
        ↓
Mise au format Project Book
        ↓
Review
        ↓
Published
```

La publication doit refléter l'état final validé du sujet traité.

Une proposition ancienne ou remplacée ne doit pas être publiée comme référence simplement parce qu'elle figure dans l'historique des échanges.

Lorsqu'un document existant est révisé, sa nouvelle version suit le même processus.

---

## 9. Synchronisation entre documentation et code

La documentation et l'implémentation évoluent conjointement.

Le cycle de référence est le suivant :

```text
Analyse
        ↓
Documentation
        ↓
Publication
        ↓
Développement
        ↓
Tests
        ↓
Mise à jour documentaire
```

Les règles suivantes s'appliquent :

- les documents nécessaires sont publiés avant le début du développement ;
- le code respecte les documents publiés ;
- les tests vérifient l'implémentation des règles documentées ;
- toute modification réalisée pendant le développement est reportée dans la documentation concernée ;
- la documentation et le code doivent être cohérents au moment de la clôture de la User Story ;
- une divergence connue interdit de considérer la User Story comme terminée.

---

## 10. Référencement documentaire dans les User Stories

Chaque User Story référence explicitement les documents du Project Book sur lesquels elle s'appuie.

Ces références doivent permettre d'identifier :

- les règles fonctionnelles applicables ;
- les contraintes architecturales ;
- les services transverses utilisés ;
- les exigences de sécurité, de journalisation, d'audit ou de qualité concernées ;
- les documents à mettre à jour avant clôture.

Une User Story ne doit pas s'appuyer uniquement sur une conversation ou sur une compréhension implicite du besoin.

Lorsqu'un document requis n'existe pas encore ou n'est pas publié, sa production précède le développement de la User Story.

---

## 11. Responsabilités

### 11.1 Product Owner

Le Product Owner :

- valide le besoin documentaire ;
- confirme le périmètre fonctionnel ;
- participe à la review ;
- valide la publication des documents normatifs ;
- s'assure qu'une User Story référence les documents nécessaires.

### 11.2 Contributeur

Tout contributeur :

- utilise le Project Book comme référence ;
- signale les divergences entre documentation et code ;
- met à jour les documents concernés par ses modifications ;
- ne transforme pas une décision implicite ou locale en règle normative sans publication.

### 11.3 Atelier de conception

L'atelier de conception prépare les décisions et les livrables documentaires.

Il ne se substitue jamais au Project Book.

---

## 12. Principe d'évolution pragmatique

AKS Platform adopte le principe suivant :

> Nous ne figeons un processus qu'après l'avoir pratiqué au moins une fois.

La gouvernance documentaire doit répondre aux besoins réels du projet sans introduire prématurément des mécanismes complexes.

Les évolutions futures de cette gouvernance seront fondées sur le retour d'expérience acquis lors de l'utilisation des documents publiés pendant les développements.

---

## 13. Critères d'acceptation

La gouvernance documentaire est correctement appliquée lorsque :

- le Project Book est utilisé comme référence normative ;
- les conversations restent un atelier de conception non normatif ;
- les documents nécessaires sont publiés avant le développement ;
- chaque User Story référence ses documents de référence ;
- le code et la documentation sont cohérents à la clôture ;
- les documents publiés reflètent les dernières décisions validées ;
- les brouillons et échanges ne sont pas présentés comme des références officielles ;
- les mécanismes documentaires restent proportionnés aux besoins constatés.

---

## 14. Dépendances

`GOV-DOC-001` ne dépend d'aucun autre document du Project Book.

Il constitue le cadre de publication applicable aux documents qui seront publiés après lui.

---

## 15. Références

Aucune référence normative antérieure.

Les documents suivants complètent ce cadre sans appartenir au périmètre du présent document :

- `ADR-001` — Architecture documentaire d'AKS Platform ;
- `GOV-DEV-001` — Gouvernance de développement.

---

## 16. Conclusion

Le Project Book est la référence normative officielle d'AKS Platform.

Les conversations servent à concevoir et à revoir les décisions, tandis que le dépôt applicatif en assure l'implémentation.

La publication documentaire précède le développement, et la synchronisation entre documentation et code conditionne la clôture des User Stories.

Cette gouvernance fournit un cadre simple, rigoureux et directement applicable à la poursuite de la V1.1.
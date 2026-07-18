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

Le présent document définit l'architecture fonctionnelle et les responsabilités d'**AKS Core**, socle de services communs d'AKS Platform.

Il précise :

- la mission d'AKS Core ;
- les services de plateforme qu'il fournit ;
- les règles d'utilisation de ces services par les modules métier ;
- les limites de responsabilité du socle ;
- les principes d'évolution et de compatibilité ;
- les critères d'acceptation applicables à toute évolution d'AKS Core.

CORE-001 complète **ARCH-001**, qui définit l'architecture globale de la plateforme.

ARCH-001 décrit l'organisation générale d'AKS Platform. CORE-001 décrit le fonctionnement attendu de sa couche centrale de services.

---

# 2. Position dans le Project Book

CORE-001 constitue la référence officielle pour toute fonctionnalité transverse intégrée à AKS Platform.

Il s'applique :

- au socle applicatif ;
- aux services partagés ;
- aux contrats exposés aux modules métier ;
- aux mécanismes d'intégration communs ;
- aux évolutions futures de la plateforme.

Les documents spécialisés complètent CORE-001 sans pouvoir le contredire, notamment :

- **ARCH-001** — Architecture fonctionnelle d'AKS Platform ;
- **CONFIG-001** — Paramétrage de la plateforme ;
- **LOG-001** — Journalisation ;
- **UX-001** — Principes d'expérience utilisateur ;
- **ADMIN-001** — Tableau de bord d'administration ;
- les documents propres aux modules métier.

En cas de divergence, ARCH-001 fait autorité sur l'architecture globale et CORE-001 sur les responsabilités d'AKS Core.

---

# 3. Mission d'AKS Core

AKS Core constitue la couche de **Platform Services** d'AKS Platform.

Sa mission est de fournir aux modules métier un ensemble de capacités communes, stables, cohérentes et réutilisables.

AKS Core permet aux modules de se concentrer exclusivement sur leur domaine fonctionnel.

Il centralise les mécanismes qui ne doivent pas être réimplémentés dans chaque module.

## 3.1 Objectifs

AKS Core poursuit les objectifs suivants :

- mutualiser les capacités transversales ;
- garantir un comportement homogène ;
- réduire la duplication de code et de logique ;
- limiter les dépendances techniques des modules ;
- simplifier l'ajout de nouveaux modules ;
- sécuriser les échanges et les traitements ;
- faciliter l'exploitation et le diagnostic ;
- préserver la stabilité de la plateforme.

## 3.2 Position dans l'architecture

```text
Utilisateurs
     │
     ▼
Présentation
     │
     ▼
Modules métier
     │
     ▼
AKS Core — Platform Services
     │
     ▼
Intégrations et infrastructure
```

Les modules métier consomment les services d'AKS Core.

AKS Core ne dépend jamais d'un module métier.

## 3.3 Ce qu'AKS Core fournit

AKS Core fournit notamment :

- la configuration ;
- la journalisation ;
- les notifications ;
- la gestion des erreurs ;
- les API internes ;
- le cache ;
- l'audit ;
- le stockage commun ;
- la génération documentaire ;
- les adaptateurs d'intégration ;
- les mécanismes de sécurité transverses ;
- à terme, l'authentification et les rôles.

## 3.4 Ce qu'AKS Core ne fait pas

AKS Core n'implémente :

- aucune règle métier propre à un module ;
- aucune décision administrative spécifique ;
- aucun workflow propre à un domaine fonctionnel ;
- aucune interface utilisateur métier ;
- aucune dépendance directe envers un module ;
- aucun accès externe non encapsulé.

Les règles métier restent exclusivement dans les modules concernés.

---

# 4. Principes de conception

## 4.1 Indépendance

AKS Core est indépendant des modules métier.

Il ne connaît ni leurs règles fonctionnelles, ni leurs écrans, ni leur organisation interne.

## 4.2 Responsabilité unique

Chaque service d'AKS Core possède une responsabilité clairement définie.

Une même capacité ne doit pas être dispersée entre plusieurs composants.

## 4.3 Faible couplage

Les modules consomment les services d'AKS Core au travers de contrats explicites.

Ils ne dépendent jamais de leur implémentation interne.

## 4.4 Forte cohésion

Chaque service regroupe uniquement les fonctions liées à son objectif.

## 4.5 Réutilisabilité

Une capacité n'est intégrée à AKS Core que lorsqu'elle présente une valeur transverse.

Un besoin propre à un seul module reste dans ce module.

## 4.6 Simplicité

AKS Core doit rester simple, lisible et proportionné aux besoins réels de la plateforme.

Il ne doit pas devenir un framework générique sans lien avec les besoins d'AKS Platform.

## 4.7 Compatibilité

Les interfaces existantes doivent être préservées autant que possible.

Toute rupture de compatibilité doit être exceptionnelle, justifiée, documentée et validée.

## 4.8 Sécurité par conception

Les services communs appliquent les contrôles de sécurité de manière uniforme.

La sécurité ne doit pas dépendre de l'initiative individuelle de chaque module.

## 4.9 Observabilité

Tout service critique doit fournir les informations nécessaires au diagnostic, à la supervision et à l'audit.

## 4.10 Évolutivité incrémentale

AKS Core évolue progressivement, en fonction des besoins validés de plusieurs modules.

---

# 5. Catalogue des services de plateforme

## 5.1 Configuration

Le service de configuration fournit un accès centralisé aux paramètres de la plateforme.

Il gère :

- les paramètres globaux ;
- les paramètres propres aux modules ;
- les valeurs par environnement ;
- les valeurs par défaut ;
- la validation des paramètres ;
- la protection des données sensibles.

Les modules ne doivent pas coder en dur une valeur configurable.

Les règles détaillées sont définies dans **CONFIG-001**.

## 5.2 Journalisation

Le service de journalisation enregistre les événements techniques et fonctionnels nécessaires à l'exploitation.

Il fournit :

- des niveaux de journalisation homogènes ;
- un format commun ;
- des identifiants de corrélation ;
- la traçabilité des traitements ;
- la protection des données personnelles ;
- des mécanismes de rétention adaptés.

Les règles détaillées sont définies dans **LOG-001**.

## 5.3 Notifications

Le service de notifications permet aux modules d'émettre un message sans gérer directement son transport.

Il prend en charge :

- le choix du canal ;
- les modèles de messages ;
- l'identité de l'expéditeur ;
- la gestion des erreurs d'envoi ;
- la traçabilité ;
- les tentatives de renvoi lorsque cela est pertinent.

Le module fournit l'intention fonctionnelle et les données nécessaires. AKS Core exécute l'envoi.

## 5.4 Gestion des erreurs

Le service de gestion des erreurs définit un traitement uniforme des anomalies.

Il doit :

- distinguer les erreurs fonctionnelles et techniques ;
- fournir un message exploitable à l'utilisateur ;
- journaliser le détail technique ;
- éviter la divulgation d'informations sensibles ;
- associer un identifiant de corrélation ;
- permettre un diagnostic ultérieur.

## 5.5 API internes

Les API internes exposent les services d'AKS Core aux modules métier.

Elles doivent être :

- explicites ;
- documentées ;
- versionnées lorsque nécessaire ;
- stables ;
- testables ;
- indépendantes de l'implémentation technique.

Un module ne doit pas contourner une API publique pour accéder à un composant interne.

## 5.6 Cache

Le service de cache peut être utilisé pour améliorer les performances des données fréquemment consultées et peu volatiles.

Le cache ne constitue jamais la source de vérité.

Toute donnée mise en cache doit posséder :

- une durée de validité ;
- une règle d'invalidation ;
- un comportement de repli ;
- une stratégie évitant la diffusion de données obsolètes critiques.

## 5.7 Audit

Le service d'audit conserve la trace des opérations sensibles ou administratives.

Il permet d'identifier :

- l'action réalisée ;
- la date et l'heure ;
- l'acteur ;
- l'objet concerné ;
- le résultat ;
- les informations nécessaires à l'explication de l'opération.

L'audit ne doit pas stocker inutilement le contenu sensible des données traitées.

## 5.8 Stockage commun

Le service de stockage fournit des conventions communes pour les données techniques, documents et métadonnées partagés.

Il définit :

- les règles de nommage ;
- les responsabilités de lecture et d'écriture ;
- les durées de conservation ;
- les mécanismes de suppression ;
- les contrôles d'accès ;
- les stratégies de sauvegarde lorsque nécessaires.

Les données métier restent sous la responsabilité de leur module propriétaire.

## 5.9 Génération documentaire

Le service documentaire fournit des mécanismes communs pour produire :

- des attestations ;
- des rapports ;
- des exports ;
- des documents PDF ;
- des fichiers structurés.

Le module fournit les données validées et le type de document attendu.

AKS Core gère le rendu, le format, les métadonnées techniques et les erreurs de génération.

## 5.10 Intégrations externes

Les intégrations externes sont encapsulées par des adaptateurs gérés par AKS Core.

Elles peuvent concerner notamment :

- Google Workspace ;
- Google Apps Script ;
- Google Calendar ;
- WordPress ;
- GitHub ;
- d'autres services validés dans la feuille de route.

Un module métier ne doit pas dépendre directement de l'API spécifique d'un fournisseur externe.

## 5.11 Sécurité transverse

AKS Core fournit les mécanismes communs de sécurité, notamment :

- validation des entrées ;
- contrôle des accès ;
- gestion des secrets ;
- sécurisation des échanges ;
- limitation des appels abusifs ;
- contrôle de l'intégrité ;
- protection contre les rejouements lorsque nécessaire.

## 5.12 Authentification — capacité future

L'authentification centralisée sera intégrée à AKS Core lorsqu'un espace privé nécessitera l'identification d'un utilisateur.

Elle devra rester indépendante des modules métier.

## 5.13 Rôles et permissions — capacité future

La gestion des rôles et permissions sera centralisée dans AKS Core.

Les modules exprimeront les permissions nécessaires sans implémenter leur propre système d'autorisation.

---

# 6. Contrats avec les modules métier

## 6.1 Principe général

Un module métier consomme une capacité d'AKS Core au travers d'un contrat stable.

Le contrat définit :

- l'objectif du service ;
- les données d'entrée ;
- le résultat attendu ;
- les erreurs possibles ;
- les règles de sécurité ;
- les exigences de journalisation ;
- les garanties de compatibilité.

## 6.2 Responsabilités du module

Le module métier doit :

- appliquer ses règles fonctionnelles ;
- valider les données propres à son domaine ;
- transmettre uniquement les données nécessaires ;
- interpréter le résultat fonctionnel ;
- respecter les interfaces publiques ;
- gérer l'indisponibilité d'un service selon le contrat prévu.

## 6.3 Responsabilités d'AKS Core

AKS Core doit :

- valider le contrat technique ;
- exécuter le service demandé ;
- protéger les données ;
- journaliser les événements nécessaires ;
- retourner un résultat explicite ;
- préserver la stabilité de l'interface ;
- isoler les détails d'implémentation.

## 6.4 Interdictions

Un module ne doit jamais :

- accéder directement au stockage interne d'AKS Core ;
- contourner un service public ;
- modifier la configuration globale ;
- appeler directement un fournisseur externe lorsqu'un adaptateur existe ;
- dupliquer une capacité transverse ;
- dépendre d'une classe ou d'un composant interne non contractuel.

---

# 7. Cycle de vie d'un service Core

## 7.1 Identification

Une nouvelle capacité est envisagée lorsqu'un besoin transverse est identifié.

## 7.2 Qualification

Avant intégration dans AKS Core, il faut vérifier :

- que le besoin concerne plusieurs modules ou la plateforme entière ;
- qu'il ne s'agit pas d'une règle métier ;
- qu'aucun service existant ne répond déjà au besoin ;
- que sa mutualisation apporte une valeur réelle.

## 7.3 Conception

La conception définit :

- la responsabilité du service ;
- son contrat ;
- ses dépendances ;
- ses erreurs ;
- sa sécurité ;
- sa journalisation ;
- sa stratégie de test.

## 7.4 Implémentation

L'implémentation respecte les conventions du dépôt applicatif et ne débute qu'après mise à jour de la documentation.

## 7.5 Validation

Le service doit être testé indépendamment et depuis au moins un cas d'utilisation métier représentatif.

## 7.6 Publication

Une capacité n'est considérée comme disponible qu'après :

- validation de son contrat ;
- documentation ;
- tests ;
- intégration dans une version officielle.

## 7.7 Dépréciation

Une interface obsolète est d'abord déclarée dépréciée.

Sa suppression exige :

- une justification ;
- une solution de remplacement ;
- une analyse des consommateurs ;
- une période de transition ;
- une mise à jour documentaire.

---

# 8. Sécurité et protection des données

AKS Core applique les principes suivants :

- minimisation des données ;
- protection des secrets ;
- limitation des privilèges ;
- validation systématique des entrées ;
- traçabilité des opérations sensibles ;
- absence de données sensibles dans les journaux ;
- suppression des données selon les durées définies ;
- chiffrement ou signature des échanges lorsque nécessaire.

Les réponses détaillées aux questionnaires de santé ne doivent notamment jamais être stockées par un service commun.

---

# 9. Résilience et performances

## 9.1 Résilience

Une défaillance d'un service externe ne doit pas provoquer une corruption des données métier.

Les services critiques doivent prévoir, selon le besoin :

- une gestion des délais d'attente ;
- un nombre limité de nouvelles tentatives ;
- un mécanisme d'idempotence ;
- un mode dégradé ;
- un message d'erreur exploitable ;
- une journalisation adaptée.

## 9.2 Performances

AKS Core doit éviter :

- les appels externes inutiles ;
- les lectures répétées de configuration ;
- les traitements bloquants non nécessaires ;
- les volumes de journalisation excessifs ;
- la génération répétée d'une même ressource.

Les optimisations ne doivent jamais dégrader la lisibilité ou la fiabilité.

---

# 10. Testabilité

Chaque service Core doit pouvoir être testé indépendamment.

Les tests doivent couvrir :

- les cas nominaux ;
- les entrées invalides ;
- les erreurs techniques ;
- les indisponibilités externes ;
- les règles de sécurité ;
- la compatibilité du contrat ;
- les effets de bord ;
- la journalisation attendue.

Les intégrations externes doivent pouvoir être remplacées par des doubles de test.

---

# 11. Gouvernance

## 11.1 Propriété

AKS Core est un composant central placé sous la responsabilité du Product Owner.

## 11.2 Évolution

Toute évolution doit :

1. répondre à un besoin identifié ;
2. respecter ARCH-001 ;
3. être documentée avant développement ;
4. analyser les impacts sur les modules ;
5. préserver la compatibilité ;
6. être testée ;
7. être intégrée dans une version officielle.

## 11.3 Exceptions

Toute exception doit être :

- justifiée ;
- limitée ;
- documentée ;
- validée ;
- associée à une stratégie de régularisation.

Une exception ne devient jamais automatiquement une règle.

---

# 12. Critères d'acceptation

Une évolution d'AKS Core est acceptable lorsque tous les critères suivants sont satisfaits :

- [ ] La capacité répond à un besoin transverse validé.
- [ ] Elle ne contient aucune règle métier propre à un module.
- [ ] Sa responsabilité est clairement définie.
- [ ] Son contrat est documenté.
- [ ] Ses entrées et sorties sont validées.
- [ ] Ses erreurs sont explicites et maîtrisées.
- [ ] Sa journalisation respecte LOG-001.
- [ ] Sa configuration respecte CONFIG-001.
- [ ] Ses interfaces respectent ARCH-001.
- [ ] Les données sensibles sont protégées.
- [ ] Les intégrations externes sont encapsulées.
- [ ] Les tests couvrent les cas nominaux et les erreurs.
- [ ] La compatibilité avec les consommateurs existants est vérifiée.
- [ ] La documentation du Project Book est à jour.
- [ ] Aucun module ne doit être modifié sans justification architecturale.

---

# 13. Références

| Document | Rôle |
|----------|------|
| **ARCH-001** | Architecture globale et règles de dépendance |
| **CONFIG-001** | Gestion du paramétrage |
| **LOG-001** | Politique de journalisation |
| **UX-001** | Principes d'expérience utilisateur |
| **ADMIN-001** | Administration de la plateforme |
| **ROADMAP-001** | Planification des évolutions |

Les documents propres aux modules doivent référencer CORE-001 dès qu'ils utilisent un service de plateforme.

---

# 14. Conclusion

AKS Core constitue le socle de services d'AKS Platform.

Il garantit que les capacités communes sont conçues, sécurisées, documentées et maintenues de manière homogène.

Son rôle n'est pas de centraliser toutes les fonctionnalités, mais de fournir les services transversaux nécessaires à des modules métier autonomes.

Le respect de CORE-001 permet :

- de maîtriser la complexité ;
- de limiter la duplication ;
- de préserver l'indépendance des modules ;
- de faciliter les futurs développements ;
- de garantir une plateforme stable et évolutive.

Toute évolution d'AKS Core doit rester conforme à ARCH-001 et aux documents spécialisés du Project Book.
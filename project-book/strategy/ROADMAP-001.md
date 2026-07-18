# ROADMAP-001
## Feuille de route officielle — AKS Platform

| Propriété | Valeur |
|---|---|
| **Document ID** | ROADMAP-001 |
| **Titre** | Feuille de route officielle d’AKS Platform |
| **Version** | 1.1.1 |
| **Statut** | Validé |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-18 |

---

# 1. Objet

ROADMAP-001 définit l’ordre officiel des évolutions d’AKS Platform, le rôle de chaque étape, les dépendances entre versions et modules, ainsi que les règles de gouvernance permettant de faire évoluer cette feuille de route.

Le document distingue explicitement :

- la **vision produit**, qui décrit la direction générale ;
- la **roadmap**, qui fixe le séquencement validé ;
- le **périmètre d’une version**, qui définit les résultats attendus ;
- le **backlog**, qui regroupe les besoins non encore engagés ;
- les **livrables**, qui constituent les éléments réellement produits et vérifiables.

ROADMAP-001 ne constitue ni un planning détaillé, ni une promesse de date. Les dates éventuelles sont indicatives tant qu’elles ne sont pas validées dans un jalon de publication.

---

# 2. Position dans le Project Book

ROADMAP-001 est le document de référence pour le séquencement des versions et des modules d’AKS Platform.

Il s’appuie notamment sur :

- **VISION-001**, pour la direction produit ;
- **OBJECTIVES-001**, pour les objectifs prioritaires ;
- **SCOPE-001**, pour les limites fonctionnelles ;
- **ARCH-001**, pour l’architecture globale ;
- **CORE-001**, pour les services communs ;
- **RELEASE-001**, pour le processus de publication.

Toute évolution importante de l’ordre, du périmètre ou des dépendances décrites dans ce document doit faire l’objet d’une décision de gouvernance documentée.

---

# 3. Principes de gouvernance de la roadmap

## 3.1 Une roadmap orientée résultats

Chaque étape de la roadmap doit produire un résultat exploitable, testable et documenté.

Une étape ne peut pas être considérée comme terminée sur la seule base d’une intention, d’un prototype ou d’un document non appliqué.

## 3.2 Une évolution incrémentale

AKS Platform évolue par incréments maîtrisés.

Chaque version doit :

- préserver les fonctionnalités déjà publiées ;
- limiter les régressions ;
- réduire les dépendances implicites ;
- fournir des livrables intégrables ;
- maintenir la cohérence entre code, exploitation et documentation.

## 3.3 Une priorité fondée sur la valeur

La priorité d’un élément est déterminée selon :

1. la valeur pour l’association ;
2. le caractère obligatoire ou réglementaire ;
3. la réduction d’un risque ;
4. les dépendances nécessaires aux étapes suivantes ;
5. l’effort de réalisation et de maintenance ;
6. la capacité à préserver la stabilité du produit.

## 3.4 Distinction entre engagement et intention

Les éléments sont classés selon les statuts suivants :

| Statut | Signification |
|---|---|
| **Publié** | Disponible en production et faisant référence. |
| **Engagé** | Périmètre validé et réalisation autorisée. |
| **Planifié** | Ordre validé, cadrage détaillé restant à finaliser. |
| **Candidat** | Besoin identifié mais non engagé. |
| **Différé** | Élément volontairement reporté. |
| **Abandonné** | Élément retiré de la trajectoire produit. |

Seuls les éléments **engagés** peuvent alimenter directement une version en cours.

## 3.5 Règle de changement

Toute modification significative doit préciser :

- le besoin à l’origine du changement ;
- la valeur attendue ;
- les impacts sur les versions et modules ;
- les dépendances ajoutées ou supprimées ;
- les risques de régression ;
- la décision du Product Owner ;
- les documents à mettre à jour.

---

# 4. Trajectoire produit officielle

```text
AKS Platform v1.0.0 — Référence stable
        ↓
AKS Platform v1.1 — Consolidation du socle
        ↓
AKS Analytics — Statistiques et rapports
        ↓
AKS Calendar — Intégration Google Calendar
        ↓
Modules futurs priorisés selon la valeur métier
```

Cette séquence est la trajectoire de référence au 18 juillet 2026.

---

# 5. AKS Platform v1.0.0 — Référence stable

## 5.1 Statut

**Publié**.

La version 1.0.0 constitue la référence stable de production.

## 5.2 Périmètre publié

- AKS Core ;
- Questionnaire santé pour les licenciés mineurs ;
- saisie de l’identité et de la date de naissance ;
- décision administrative ;
- attestation PDF FFKDA conditionnelle ;
- QR code et identité documentaire ;
- notifications du représentant légal et du club ;
- intégration WordPress sécurisée ;
- accès public sans compte WordPress ou Google ;
- documentation opérationnelle associée.

## 5.3 Règle de stabilité

La V1.0.0 est figée.

Elle ne peut être modifiée que dans les cas suivants :

- correction d’un défaut ;
- correction de sécurité ;
- adaptation réglementaire obligatoire ;
- correction documentaire reflétant le fonctionnement réellement publié.

Les corrections applicatives sont traitées selon le processus de hotfix défini dans RELEASE-001.

---

# 6. AKS Platform v1.1 — Consolidation

## 6.1 Statut

**Engagé**.

## 6.2 Objectif

La V1.1 constitue une version de consolidation.

Elle ne vise pas à ajouter un nouveau module métier, mais à renforcer la plateforme avant l’arrivée d’AKS Analytics et d’AKS Calendar.

Le résultat attendu est une plateforme :

- gouvernée ;
- modulaire ;
- administrable ;
- paramétrable ;
- journalisée ;
- cohérente sur le plan UX ;
- documentée ;
- prête à accueillir de nouveaux modules sans remettre en cause la V1.0.0.

## 6.3 Axes prioritaires validés

L’ordre de priorité de la V1.1 est le suivant :

1. gouvernance produit ;
2. consolidation de ROADMAP-001 ;
3. architecture fonctionnelle de la plateforme ;
4. tableau de bord d’administration ;
5. paramétrage centralisé ;
6. journalisation commune ;
7. améliorations UX ;
8. documentation.

## 6.4 Gouvernance produit

La V1.1 doit :

- formaliser les responsabilités produit ;
- homogénéiser les documents du Project Book ;
- normaliser les livrables et critères d’acceptation ;
- distinguer les décisions, spécifications et procédures ;
- définir les critères d’entrée et de sortie des versions ;
- clarifier le cycle de développement et de publication.

## 6.5 Architecture fonctionnelle

La V1.1 doit :

- clarifier les responsabilités des composants ;
- distinguer AKS Core des modules métier ;
- formaliser les services de plateforme ;
- réduire les dépendances implicites ;
- définir les contrats entre le socle et les modules ;
- préparer l’extension fonctionnelle sans surarchitecture.

Toute évolution d’architecture doit répondre à un besoin concret ou réduire un risque identifié.

## 6.6 Tableau de bord d’administration

Le tableau de bord doit fournir un point d’entrée centralisé vers :

- l’état général de la plateforme ;
- les campagnes et traitements disponibles ;
- les paramètres ;
- les journaux fonctionnels ;
- les outils d’administration ;
- les actions nécessitant une attention ;
- les futurs modules autorisés.

## 6.7 Paramétrage centralisé

Le système de paramétrage doit notamment couvrir :

- la saison active ;
- l’identité et les coordonnées du club ;
- les adresses utilisées pour les notifications ;
- les options applicatives ;
- les identifiants des ressources ;
- les paramètres des modules ;
- les intégrations externes ;
- les valeurs sensibles selon des mécanismes adaptés.

Un paramètre ne doit pas être dupliqué dans plusieurs composants.

## 6.8 Journalisation

La journalisation commune doit permettre :

- le suivi des traitements ;
- le diagnostic des erreurs ;
- la traçabilité des opérations importantes ;
- l’audit fonctionnel ;
- la supervision depuis l’administration ;
- l’exploitation future par les modules.

Elle ne doit pas conserver de données sensibles inutiles.

## 6.9 Expérience utilisateur

Les améliorations UX doivent porter en priorité sur :

- la cohérence des interfaces ;
- la clarté des messages ;
- la navigation ;
- l’accessibilité ;
- la gestion des erreurs ;
- la lisibilité des états et résultats ;
- la compatibilité mobile lorsque nécessaire.

La V1.1 ne prévoit pas de refonte graphique complète.

## 6.10 Documentation

Tous les composants, paramètres, traitements et procédures réellement ajoutés ou modifiés doivent être documentés avant publication.

La documentation doit correspondre au comportement effectif de la version publiée.

## 6.11 Éléments exclus

Sont explicitement exclus de la V1.1 :

- le développement d’AKS Analytics ;
- le développement d’AKS Calendar ;
- l’ajout d’un nouveau module métier ;
- la refonte graphique complète ;
- la réécriture du Questionnaire santé ;
- la modification d’une fonctionnalité V1.0.0 sans besoin validé ;
- l’introduction d’une infrastructure sans valeur produit démontrée ;
- toute dépendance envers l’environnement Proxmox personnel ;
- tout livrable non directement exploitable.

## 6.12 Critères d’entrée

La réalisation d’un élément V1.1 peut commencer lorsque :

- le besoin est décrit ;
- le périmètre est défini ;
- les dépendances sont identifiées ;
- les risques principaux sont connus ;
- le livrable attendu est explicite ;
- les critères d’acceptation sont définis ;
- les impacts sur la V1.0.0 ont été évalués.

## 6.13 Critères de sortie

La V1.1 pourra être publiée lorsque :

- la gouvernance produit est documentée et validée ;
- ROADMAP-001 est consolidé ;
- ARCH-001 et CORE-001 sont cohérents ;
- le tableau de bord d’administration est opérationnel ;
- le paramétrage centralisé est opérationnel ;
- la journalisation commune est opérationnelle ;
- les améliorations UX engagées sont intégrées ;
- les procédures d’exploitation sont documentées ;
- les tests de non-régression V1.0.0 sont concluants ;
- aucun défaut bloquant ou critique connu ne subsiste ;
- la branche `develop` est stabilisée ;
- le code et la documentation sont synchronisés ;
- la version est prête à être fusionnée dans `main` ;
- le tag de publication peut être créé selon RELEASE-001.

## 6.14 Ordre d’exécution documentaire de la consolidation

L’ordre de consolidation documentaire retenu pour la V1.1 est le suivant :

1. ROADMAP-001 — feuille de route et pilotage ;
2. GOV-001 — gouvernance produit ;
3. ADMIN-001 — tableau de bord d’administration ;
4. SECURITY-001 — sécurité de la plateforme ;
5. AUDIT-001 — audit et traçabilité ;
6. NOTIF-001 — notifications ;
7. API-001 — interfaces et contrats internes ;
8. ERROR-001 — gestion des erreurs ;
9. DOCUMENT-001 — génération documentaire ;
10. STORAGE-001 — stockage et conservation ;
11. DOC-001 — revue finale de la gouvernance documentaire et de la cohérence du Project Book.

Les documents ARCH-001, CORE-001, CONFIG-001, LOG-001 et UX-001 ont été consolidés avant la formalisation de cet ordre. Ils restent des dépendances de référence et doivent être réexaminés uniquement si une consolidation ultérieure introduit une contradiction ou une dépendance nouvelle.

## 6.15 État documentaire de la V1.1

| Document | Domaine | État au 18 juillet 2026 |
|---|---|---|
| ROADMAP-001 | Feuille de route | Consolidé |
| ARCH-001 | Architecture fonctionnelle | Consolidé |
| CORE-001 | Services de plateforme | Consolidé |
| CONFIG-001 | Paramétrage centralisé | Consolidé |
| LOG-001 | Journalisation | Consolidé |
| UX-001 | Expérience utilisateur | Consolidé |
| GOV-001 | Gouvernance produit | À consolider |
| ADMIN-001 | Administration | À consolider |
| SECURITY-001 | Sécurité | À consolider |
| AUDIT-001 | Audit et traçabilité | À consolider |
| NOTIF-001 | Notifications | À consolider |
| API-001 | Interfaces internes | À consolider |
| ERROR-001 | Gestion des erreurs | À consolider |
| DOCUMENT-001 | Génération documentaire | À consolider |
| STORAGE-001 | Stockage et conservation | À consolider |
| DOC-001 | Gouvernance documentaire | Revue finale à réaliser |

L’état **Consolidé** signifie que le document a fait l’objet d’une revue de cohérence V1.1 et d’une mise à jour validée dans le dépôt documentaire. Il ne signifie pas automatiquement que toutes les fonctionnalités décrites sont déjà implémentées dans le dépôt applicatif.

## 6.16 Règle de mise à jour du suivi

Après chaque consolidation documentaire :

- le document concerné est mis à jour dans le dépôt Project Book ;
- le commit constitue la preuve de la consolidation ;
- le tableau de suivi de la présente section est actualisé lorsque nécessaire ;
- les contradictions détectées avec un document déjà consolidé doivent être résolues avant de poursuivre ;
- aucune fonctionnalité ne doit être déclarée opérationnelle sur la seule base de sa documentation.

---

# 7. Dépendances de la V1.1

## 7.1 Dépendances internes

La V1.1 doit assurer la cohérence entre :

- ROADMAP-001 ;
- GOV-001 ;
- ARCH-001 ;
- CORE-001 ;
- ADMIN-001 ;
- CONFIG-001 ;
- LOG-001 ;
- UX-001 ;
- SECURITY-001 ;
- AUDIT-001 ;
- NOTIF-001 ;
- API-001 ;
- ERROR-001 ;
- DOCUMENT-001 ;
- STORAGE-001 ;
- DOC-001 ;
- RELEASE-001.

Aucun de ces documents ne doit définir un comportement contradictoire avec les autres.

L’absence temporaire d’un document dédié n’autorise pas l’implémentation implicite de son domaine. Le besoin doit d’abord être cadré dans le Project Book ou rattaché explicitement à un document existant.

## 7.2 Dépendances avec AKS Analytics

La V1.1 doit fournir à AKS Analytics :

- une architecture modulaire ;
- des services communs stables ;
- un paramétrage centralisé ;
- une journalisation exploitable ;
- un tableau de bord extensible ;
- des conventions documentaires et de publication stabilisées ;
- des mécanismes de stockage et d’export réutilisables lorsque nécessaires.

AKS Analytics ne devra pas modifier le fonctionnement du Questionnaire santé.

## 7.3 Dépendances avec AKS Calendar

La V1.1 doit fournir à AKS Calendar :

- le paramétrage des intégrations externes ;
- la journalisation ;
- le tableau de bord ;
- les règles de sécurité ;
- les conventions d’accès et d’autorisation ;
- les services d’intégration communs.

La première implémentation reposera sur Google Calendar et le compte du club, afin de couvrir rapidement les besoins sans développer un moteur de calendrier interne.

---

# 8. AKS Analytics — Premier module après la V1.1

## 8.1 Statut

**Planifié**.

## 8.2 Objectif

AKS Analytics doit fournir des indicateurs, analyses et rapports exploitables par l’association.

## 8.3 Périmètre prévisionnel

- import et contrôle des données de présence ;
- analyse par cours ;
- rapports séparés Baby, Enfant 1, Enfant 2 et Ado/Adulte ;
- prise en compte explicite du cours féminin dans les analyses globales ;
- synthèse globale ;
- graphiques ;
- commentaires automatiques ou assistés ;
- exports pour bilans et assemblées générales ;
- préparation automatique des ressources d’une nouvelle saison ;
- journal de contrôle des opérations de préparation.

Le cadrage détaillé fera l’objet de documents dédiés avant le démarrage du développement.

## 8.4 Critères d’entrée prévisionnels

AKS Analytics pourra être engagé lorsque :

- la V1.1 sera publiée ;
- les contrats de services communs seront stables ;
- les formats de données sources seront identifiés ;
- les règles de calcul seront validées ;
- les rapports attendus seront définis ;
- les exigences de confidentialité et de conservation seront documentées.

---

# 9. AKS Calendar — Module suivant

## 9.1 Statut

**Planifié**.

## 9.2 Objectif

AKS Calendar doit proposer un calendrier partagé pour les professeurs et responsables du club en s’appuyant prioritairement sur Google Calendar.

## 9.3 Périmètre prévisionnel

- intégration avec le compte Google du club ;
- calendrier partagé ;
- gestion des événements ;
- gestion des accès ;
- visibilité adaptée aux différents publics ;
- administration depuis AKS Platform lorsque cela apporte une valeur concrète ;
- journalisation des opérations importantes.

## 9.4 Principe d’implémentation

Google Calendar est retenu comme moteur initial afin de couvrir l’essentiel des besoins avec un effort maîtrisé.

Un développement interne complet ne pourra être envisagé que si des besoins non couverts justifient clairement son coût et sa maintenance.

---

# 10. Backlog produit après AKS Calendar

Les modules ou évolutions futures restent au statut **candidat** tant qu’ils ne sont pas cadrés et engagés.

Ils pourront notamment concerner :

- la gestion des licenciés ;
- les inscriptions ;
- les grades et passages de grade ;
- les documents associatifs ;
- les communications ;
- les tableaux de bord métier ;
- d’autres intégrations externes.

Leur ordre n’est pas fixé par le présent document.

Chaque candidat devra être évalué selon la valeur, les risques, les dépendances et l’effort de maintenance.

---

# 11. Jalons de version

Chaque version suit au minimum les jalons suivants :

| Jalon | Résultat attendu |
|---|---|
| **Cadrage** | Objectifs, périmètre, exclusions et dépendances validés. |
| **Spécification** | Livrables et critères d’acceptation documentés. |
| **Développement** | Implémentation réalisée sur `develop`. |
| **Validation** | Tests fonctionnels, techniques et de non-régression concluants. |
| **Prépublication** | Documentation et exploitation synchronisées. |
| **Publication** | Fusion dans `main`, tag et version de référence créés. |
| **Clôture** | Bilan, défauts résiduels et suites documentés. |

Le passage d’un jalon au suivant dépend de la validation des résultats attendus, et non du temps écoulé.

---

# 12. Gestion des écarts

Un écart à la roadmap doit être documenté lorsqu’il concerne :

- l’ajout ou le retrait d’un livrable engagé ;
- le changement d’ordre entre modules ;
- une nouvelle dépendance structurante ;
- une rupture de compatibilité ;
- un report significatif ;
- l’introduction d’un nouveau risque ;
- une modification du périmètre publié.

La décision doit indiquer si l’écart est :

- accepté ;
- corrigé dans la version en cours ;
- reporté ;
- traité par hotfix ;
- transféré au backlog ;
- abandonné.

---

# 13. Indicateurs de pilotage

Le suivi de la roadmap repose au minimum sur :

- le nombre de livrables engagés, terminés et reportés ;
- l’état des critères de sortie ;
- les défauts bloquants ou critiques ;
- les dépendances non résolues ;
- l’état de synchronisation du code et de la documentation ;
- les régressions détectées ;
- les décisions de gouvernance ouvertes ;
- l’état de consolidation des documents structurants de la V1.1.

Ces indicateurs servent au pilotage et ne remplacent pas la validation fonctionnelle des livrables.

---

# 14. Règles de branches et de publication

Pour le dépôt applicatif :

- `main` représente la production ;
- `develop` représente l’intégration des évolutions ;
- les correctifs de production suivent le processus de hotfix ;
- les versions publiées sont identifiées par un tag.

Pour le Project Book :

- `master` reste la branche documentaire de référence tant qu’une décision contraire n’est pas validée ;
- la documentation doit être mise à jour avec les évolutions qu’elle décrit ;
- un document validé ne doit pas annoncer comme opérationnel un élément qui ne l’est pas.

---

# 15. Résultat attendu

ROADMAP-001 doit permettre de répondre sans ambiguïté aux questions suivantes :

- quelle est la version stable ?
- quelle étape est engagée ?
- quels résultats sont attendus ?
- quels éléments sont exclus ?
- quelles dépendances doivent être satisfaites ?
- quels critères permettent de publier ?
- quel module vient ensuite ?
- quels éléments restent de simples candidats ?
- comment une modification de trajectoire est-elle décidée ?
- quel est l’état de consolidation documentaire de la V1.1 ?

La trajectoire officielle reste :

```text
AKS Platform v1.0.0
        ↓
AKS Platform v1.1 — Consolidation
        ↓
AKS Analytics
        ↓
AKS Calendar
```

Toute modification de cet ordre ou du périmètre engagé doit être validée et documentée selon les règles de gouvernance du Project Book.

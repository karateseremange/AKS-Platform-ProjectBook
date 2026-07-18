# ROADMAP-001
## Feuille de route officielle — AKS Platform v1.1

Version : 1.0  
Statut : Validé  
Projet : AKS Platform

---

# 1. Objectif

La version **1.1** constitue une version de **consolidation**.

Elle ne vise pas à ajouter de nouveaux modules métier mais à renforcer la plateforme afin de préparer les évolutions futures dans un environnement stable, maintenable et évolutif.

La V1.1 représente le socle technique sur lequel seront développés les prochains modules.

---

# 2. Positionnement de la V1.1

```text
AKS Platform v1.0.0
        ↓
AKS Platform v1.1 — Consolidation
        ↓
AKS Analytics
        ↓
AKS Calendar
        ↓
Modules futurs
```

---

# 3. Rôle de la V1.1

La V1.1 a pour rôle de consolider la plateforme existante avant l’introduction de nouveaux modules métier.

Elle doit notamment :

- stabiliser le socle produit ;
- renforcer la cohérence fonctionnelle et technique ;
- améliorer l’administration de la plateforme ;
- centraliser les paramètres applicatifs ;
- uniformiser la journalisation ;
- améliorer l’expérience utilisateur ;
- compléter la documentation de référence ;
- préparer les dépendances nécessaires à AKS Analytics et AKS Calendar.

La V1.1 ne remet pas en cause les fonctionnalités validées et publiées en V1.0.0.

---

# 4. Périmètre de la V1.1

La V1.1 couvre exclusivement les axes suivants.

## 4.1 Gouvernance produit

- formalisation des règles de gouvernance produit ;
- organisation et homogénéisation des documents du Project Book ;
- normalisation des User Stories et des livrables ;
- définition des critères d’entrée et de sortie des versions ;
- clarification du cycle de développement et de publication.

## 4.2 ROADMAP-001

- définition du rôle de la V1.1 ;
- définition de son périmètre et de ses exclusions ;
- identification des dépendances avec les versions futures ;
- définition des critères de sortie ;
- formalisation de la feuille de route jusqu’à AKS Analytics puis AKS Calendar.

## 4.3 Architecture fonctionnelle de la plateforme

- clarification des responsabilités fonctionnelles des composants ;
- définition des limites entre le socle et les modules métier ;
- identification des services communs ;
- préparation d’une architecture modulaire ;
- réduction des dépendances implicites entre fonctionnalités.

Toute amélioration d’architecture doit répondre à un besoin concret ou réduire un risque identifié.

## 4.4 Tableau de bord d’administration

Le tableau de bord d’administration doit fournir un point d’entrée centralisé vers les fonctions de gestion de la plateforme.

Il doit notamment permettre :

- l’accès aux campagnes et traitements disponibles ;
- l’accès aux paramètres ;
- la consultation des journaux fonctionnels ;
- l’accès aux outils d’administration ;
- la supervision générale de l’état de la plateforme.

## 4.5 Paramétrage

La V1.1 doit introduire ou consolider un système de paramètres centralisés.

Les paramètres concernés pourront notamment inclure :

- la saison active ;
- l’identité et les coordonnées du club ;
- les adresses utilisées pour les notifications ;
- les options applicatives ;
- les identifiants des ressources nécessaires aux modules ;
- les paramètres d’intégration avec les services externes.

Les paramètres ne doivent pas être dupliqués dans plusieurs composants.

## 4.6 Journalisation

La V1.1 doit mettre en place une journalisation homogène permettant :

- le suivi des traitements ;
- le diagnostic des erreurs ;
- l’identification des opérations importantes ;
- l’audit fonctionnel ;
- l’exploitation future par les outils d’administration.

La journalisation ne doit pas stocker de données sensibles non nécessaires.

## 4.7 Améliorations UX

Les améliorations UX doivent porter en priorité sur :

- la cohérence des interfaces ;
- la clarté des messages ;
- la navigation ;
- l’accessibilité ;
- la gestion des erreurs ;
- la lisibilité des états et résultats.

La V1.1 ne prévoit pas de refonte graphique complète.

## 4.8 Documentation

La documentation doit être mise à jour uniquement pour les éléments réellement concernés par la V1.1.

Tous les nouveaux composants, paramètres, traitements et procédures d’exploitation doivent être documentés avant la publication de la version.

---

# 5. Éléments exclus de la V1.1

Les éléments suivants sont explicitement exclus du périmètre :

- le développement d’AKS Analytics ;
- le développement d’AKS Calendar ;
- l’ajout d’un nouveau module métier ;
- la refonte complète de l’interface graphique ;
- la réécriture du module Questionnaire santé ;
- la modification d’une fonctionnalité validée en V1.0.0 sans besoin métier ou correctif identifié ;
- l’introduction d’une infrastructure sans besoin produit concret ;
- toute évolution sans livrable directement exploitable.

Les corrections de défauts affectant la V1.0.0 restent traitées selon le processus de hotfix.

---

# 6. Dépendances avec les versions futures

## 6.1 Dépendances avec AKS Analytics

AKS Analytics sera le premier module métier développé après la V1.1.

La V1.1 doit lui fournir les fondations suivantes :

- une architecture fonctionnelle modulaire ;
- un système de paramètres stable ;
- une journalisation exploitable ;
- un tableau de bord d’administration ;
- une organisation documentaire homogène ;
- des conventions de développement et de publication stabilisées.

AKS Analytics devra pouvoir réutiliser les services communs sans modifier le fonctionnement du Questionnaire santé.

Son périmètre prévisionnel comprend notamment :

- l’analyse des présences ;
- les statistiques par cours ;
- les rapports séparés par groupe ;
- la synthèse globale ;
- les graphiques et commentaires ;
- les exports nécessaires aux bilans et assemblées générales.

## 6.2 Dépendances avec AKS Calendar

AKS Calendar sera développé après AKS Analytics.

La première implémentation reposera sur l’intégration de Google Calendar, afin de fournir rapidement les fonctions de calendrier partagé sans recréer un moteur de calendrier interne.

AKS Calendar devra s’appuyer sur :

- le système de paramètres ;
- la journalisation ;
- le tableau de bord d’administration ;
- les services d’intégration externes ;
- les règles de gouvernance et de sécurité de la plateforme.

Les besoins futurs ne devront pas imposer de dépendance avec l’environnement Proxmox personnel, qui ne fait pas partie de l’infrastructure AKS Platform.

---

# 7. Critères de sortie de la V1.1

La V1.1 pourra être publiée lorsque les conditions suivantes seront remplies :

- la gouvernance produit V1.1 est documentée et validée ;
- ROADMAP-001 est intégrée au Project Book ;
- l’architecture fonctionnelle de la plateforme est documentée ;
- le tableau de bord d’administration est opérationnel ;
- le système de paramétrage centralisé est opérationnel ;
- la journalisation commune est disponible et documentée ;
- les améliorations UX prévues sont intégrées et validées ;
- les procédures d’exploitation concernées sont documentées ;
- les tests de non-régression de la V1.0.0 sont concluants ;
- aucun défaut bloquant ou critique connu ne subsiste ;
- la branche `develop` est stabilisée ;
- la documentation et le code correspondent au contenu réellement publié ;
- la version est prête à être fusionnée dans `main` et étiquetée selon les conventions du projet.

---

# 8. Feuille de route produit

## 8.1 AKS Platform v1.0.0 — Référence stable

**Rôle :** première version de production.

**Périmètre principal :**

- AKS Core ;
- Questionnaire santé pour les licenciés mineurs ;
- décision administrative ;
- attestation PDF FFKDA ;
- notifications ;
- intégration WordPress sécurisée ;
- documentation opérationnelle.

**Statut :** publiée et figée.

Les modifications sont limitées aux correctifs traités par hotfix.

## 8.2 AKS Platform v1.1 — Consolidation

**Rôle :** consolider le socle avant l’arrivée de nouveaux modules métier.

**Périmètre :**

- gouvernance produit ;
- roadmap ;
- architecture fonctionnelle ;
- tableau de bord d’administration ;
- paramétrage ;
- journalisation ;
- améliorations UX ;
- documentation.

**Résultat attendu :** une plateforme stabilisée, administrable, documentée et prête à accueillir de nouveaux modules.

## 8.3 AKS Analytics — Premier module métier après la V1.1

**Rôle :** fournir des indicateurs et rapports statistiques exploitables par l’association.

**Premiers objectifs :**

- intégration des données de présence ;
- analyse par cours ;
- rapports séparés Baby, Enfant 1, Enfant 2 et Ado/Adulte ;
- synthèse globale ;
- graphiques ;
- commentaires automatiques ou assistés ;
- exports adaptés aux bilans associatifs.

La numérotation définitive de cette version sera décidée lors de son cadrage.

## 8.4 AKS Calendar — Module suivant

**Rôle :** proposer un calendrier partagé pour les professeurs et les responsables du club.

**Premiers objectifs :**

- intégration avec le compte Google du club ;
- calendrier partagé ;
- gestion des événements ;
- gestion des accès ;
- visibilité adaptée aux publics concernés ;
- administration depuis AKS Platform lorsque cela apporte une valeur concrète.

La première version privilégiera l’intégration Google Calendar plutôt qu’un développement interne complet.

## 8.5 Versions suivantes

Les modules suivants seront priorisés selon :

- les besoins réels de l’association ;
- la valeur métier ;
- les dépendances disponibles ;
- les risques ;
- les ressources nécessaires ;
- la capacité à préserver la stabilité du produit.

Chaque nouveau module fera l’objet d’un cadrage et d’une feuille de route dédiés.

---

# 9. Principes directeurs

Chaque évolution d’AKS Platform doit respecter les principes suivants :

- préserver les fonctionnalités existantes ;
- éviter toute régression ;
- fournir un livrable directement intégrable ;
- documenter les éléments réellement modifiés ;
- réutiliser les services communs ;
- limiter les dépendances inutiles ;
- ne pas introduire d’architecture sans besoin concret ;
- privilégier la stabilité avant l’extension fonctionnelle ;
- maintenir `main` comme branche de production ;
- utiliser `develop` comme branche d’intégration des évolutions.

---

# 10. Résultat attendu de la feuille de route

ROADMAP-001 constitue la référence officielle pour le séquencement suivant :

```text
AKS Platform v1.0.0
        ↓
AKS Platform v1.1 — Consolidation du socle
        ↓
AKS Analytics — Statistiques et rapports
        ↓
AKS Calendar — Intégration Google Calendar
```

Toute modification de cet ordre ou du périmètre de la V1.1 devra faire l’objet d’une décision de gouvernance documentée.

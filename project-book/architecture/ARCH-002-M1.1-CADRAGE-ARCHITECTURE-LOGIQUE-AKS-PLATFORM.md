# ARCH-002 — M1.1

# Cadrage de l’architecture logique d’AKS Platform

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Définir le cadre de référence de l’architecture logique d’AKS Platform afin de structurer durablement la plateforme, ses composants, ses responsabilités, ses dépendances et ses évolutions futures.

Ce document ouvre officiellement le chantier `ARCH-002` et fixe les principes qui guideront les livrables d’architecture suivants.

---

# 1. Contexte

AKS Platform est une plateforme numérique destinée à soutenir les activités administratives, fonctionnelles et analytiques de l’Association Karaté Serémange.

La version 1.0 a permis de livrer un premier périmètre opérationnel centré sur :

- AKS Core ;
- le questionnaire santé destiné aux licenciés mineurs ;
- la génération conditionnelle d’attestations PDF ;
- les notifications électroniques ;
- l’intégration sécurisée au site WordPress de l’association.

La version 1.1 constitue une phase de consolidation et de structuration. Elle doit préparer l’arrivée progressive de nouveaux modules sans remettre en cause les fonctionnalités déjà validées.

---

# 2. Finalité du chantier ARCH-002

Le chantier `ARCH-002` doit permettre de :

- décrire l’organisation logique globale d’AKS Platform ;
- identifier les principaux composants de la plateforme ;
- clarifier les responsabilités de chaque composant ;
- formaliser les dépendances entre les modules ;
- définir les interfaces entre les couches de la plateforme ;
- préparer l’intégration de futurs modules métier ;
- limiter le couplage entre les fonctionnalités ;
- préserver la stabilité des modules déjà publiés ;
- fournir un cadre de décision pour les évolutions techniques futures.

---

# 3. Périmètre fonctionnel considéré

L’architecture logique doit prendre en compte les composants actuels et prévus suivants.

## 3.1 Composants existants

- **AKS Core** : services communs, configuration, conventions, sécurité et fonctions transverses ;
- **Questionnaire santé** : formulaire public, moteur de décision, génération documentaire et notifications ;
- **Connecteur WordPress** : exposition sécurisée des fonctionnalités publiques dans le site institutionnel ;
- **Google Apps Script** : environnement principal d’exécution de la plateforme ;
- **Google Sheets et Google Drive** : stockage structuré, paramétrage et gestion documentaire.

## 3.2 Composants prévus

- **AKS Administration** : tableau de bord d’administration et fonctions de pilotage ;
- **AKS Settings** : gestion centralisée des paramètres fonctionnels et techniques ;
- **AKS Logging** : journalisation des opérations significatives ;
- **AKS Analytics** : statistiques, indicateurs et rapports ;
- **AKS Calendar** : intégration avec Google Calendar pour les calendriers partagés ;
- autres modules métier validés ultérieurement dans la roadmap.

---

# 4. Principes d’architecture

L’architecture logique d’AKS Platform repose sur les principes suivants.

## 4.1 Modularité

Chaque module doit posséder une responsabilité métier clairement définie et limiter ses dépendances directes avec les autres modules.

## 4.2 Services communs centralisés

Les fonctions transverses doivent être regroupées dans des composants communs afin d’éviter les duplications, notamment :

- configuration ;
- sécurité ;
- journalisation ;
- génération d’identifiants ;
- gestion des erreurs ;
- notifications ;
- accès aux ressources Google.

## 4.3 Compatibilité ascendante

Toute évolution doit préserver les fonctionnalités validées de la version précédente, sauf décision explicite de rupture documentée et approuvée.

## 4.4 Faible couplage

Un module ne doit pas dépendre directement des détails internes d’un autre module. Les échanges doivent s’effectuer au moyen d’interfaces ou de services clairement identifiés.

## 4.5 Traçabilité

Les décisions d’architecture doivent être documentées avant leur implémentation et historisées dans Git.

## 4.6 Sécurité par conception

La sécurité doit être intégrée dès la conception des flux, des accès, des interfaces publiques et des échanges avec les services externes.

## 4.7 Minimisation des données

Chaque module ne doit collecter, traiter ou conserver que les données strictement nécessaires à sa finalité.

## 4.8 Simplicité opérationnelle

L’architecture doit privilégier les services existants lorsque ceux-ci couvrent correctement le besoin, notamment Google Workspace et WordPress, afin d’éviter des développements internes sans valeur ajoutée suffisante.

---

# 5. Découpage logique initial

AKS Platform est organisée autour des couches logiques suivantes :

1. **Canaux d’accès**  
   Interfaces publiques, interfaces d’administration et intégration WordPress.

2. **Modules métier**  
   Questionnaire santé, Analytics, Calendar et futurs modules fonctionnels.

3. **Services applicatifs communs**  
   Configuration, sécurité, notifications, génération documentaire, journalisation et contrôle des accès.

4. **Accès aux données et ressources**  
   Google Sheets, Google Drive, propriétés Apps Script et services Google Workspace.

5. **Services externes**  
   WordPress, Google Calendar, Gmail et autres intégrations explicitement validées.

Ce découpage sera détaillé dans les livrables suivants du chantier `ARCH-002`.

---

# 6. Contraintes structurantes

Les contraintes suivantes sont considérées comme obligatoires :

- le dépôt applicatif reste `karateseremange/AKS-Platform` ;
- le dépôt documentaire reste `karateseremange/AKS-Platform-ProjectBook` ;
- la branche `main` représente la production documentaire ;
- la branche `develop` représente le développement documentaire ;
- les livrables sont cumulatifs ;
- aucun nouveau livrable ne doit casser un livrable déjà validé ;
- les dépendances doivent être analysées avant toute modification ;
- les environnements personnels, notamment Proxmox, sont hors périmètre d’AKS Platform ;
- les solutions standards couvrant correctement le besoin doivent être privilégiées aux développements spécifiques.

---

# 7. Livrables prévus pour ARCH-002

Le chantier pourra être structuré autour des livrables suivants :

- **M1.1** — Cadrage de l’architecture logique ;
- **M1.2** — Cartographie des composants ;
- **M1.3** — Responsabilités et frontières des modules ;
- **M1.4** — Flux et dépendances intermodules ;
- **M1.5** — Interfaces et contrats logiques ;
- **M1.6** — Règles d’évolution et d’extensibilité ;
- **M1.7** — Critères de validation de l’architecture logique.

Cette liste pourra être ajustée si un besoin documentaire réel le justifie, sans multiplier artificiellement les livrables.

---

# 8. Critères d’acceptation de M1.1

Le présent livrable est considéré comme accepté lorsque :

- le périmètre du chantier `ARCH-002` est explicite ;
- les composants actuels et futurs sont identifiés ;
- les principes d’architecture sont formalisés ;
- les contraintes structurantes sont rappelées ;
- le découpage logique initial est compréhensible ;
- la séquence des prochains livrables est définie ;
- le document est publié et vérifié sur la branche `develop`.

---

# Résultat attendu

M1.1 constitue le document de référence pour démarrer la définition détaillée de l’architecture logique d’AKS Platform. Il encadre les prochains travaux sans imposer prématurément une architecture technique détaillée.

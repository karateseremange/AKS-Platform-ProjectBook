# ARCH-002 — M1.3

# Frontières, responsabilités et contrats entre composants

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Définir les frontières fonctionnelles et techniques des composants d’AKS Platform, préciser leurs responsabilités respectives et formaliser les contrats qui régissent leurs échanges.

Ce document complète le cadrage `ARCH-002-M1.1` et la cartographie `ARCH-002-M1.2`. Il constitue la référence pour limiter le couplage, préserver la cohérence de la plateforme et permettre l’ajout de nouveaux modules sans rupture des composants existants.

---

# 1. Principes directeurs

L’architecture logique d’AKS Platform repose sur les principes suivants :

- chaque composant possède une responsabilité principale clairement identifiable ;
- un composant ne doit pas accéder directement aux données internes d’un autre composant ;
- les échanges passent par des contrats explicites et documentés ;
- les services transverses sont portés par AKS Core ;
- les interfaces publiques restent séparées des fonctions d’administration ;
- les modules métier demeurent autonomes dans leur logique fonctionnelle ;
- les dépendances circulaires sont interdites ;
- toute évolution d’un contrat doit préserver la compatibilité ou faire l’objet d’un versionnement.

---

# 2. Frontière d’AKS Core

## 2.1 Responsabilités

AKS Core porte les capacités communes nécessaires à l’ensemble de la plateforme :

- configuration générale ;
- gestion des campagnes et des saisons ;
- identification des composants et versions ;
- sécurité des échanges ;
- signature et validation des appels ;
- journalisation technique et fonctionnelle ;
- génération des références uniques ;
- services communs de notification ;
- accès aux paramètres partagés ;
- exposition des services transverses aux modules métier.

## 2.2 Hors responsabilité

AKS Core ne doit pas :

- contenir la logique métier détaillée d’un module ;
- décider du résultat d’un questionnaire santé ;
- calculer les indicateurs propres à AKS Analytics ;
- gérer directement les événements fonctionnels d’AKS Calendar ;
- porter les règles pédagogiques ou administratives propres à un futur module.

## 2.3 Contrat fourni

AKS Core fournit aux autres composants des services stables, appelés au moyen d’interfaces internes documentées. Les modules transmettent uniquement les données nécessaires à l’exécution du service demandé.

---

# 3. Frontière du module Questionnaire santé

## 3.1 Responsabilités

Le module Questionnaire santé est responsable de :

- l’identification du mineur et du représentant légal ;
- la présentation du questionnaire officiel applicable ;
- l’évaluation éphémère des réponses ;
- la décision « attestation possible » ou « certificat médical requis » ;
- la génération de l’attestation lorsque les conditions sont réunies ;
- la préparation des notifications métier ;
- la conservation exclusive des données administratives autorisées.

## 3.2 Données interdites au stockage

Les réponses détaillées au questionnaire ne sont jamais conservées. Elles ne peuvent pas être transmises à un autre composant, à l’exception du récapitulatif éphémère adressé au répondant dans le cadre du traitement immédiat.

## 3.3 Dépendances autorisées

Le module peut utiliser AKS Core pour :

- obtenir les paramètres de campagne ;
- générer une référence unique ;
- journaliser une opération ;
- sécuriser les échanges avec WordPress ;
- envoyer les notifications ;
- accéder aux ressources documentaires autorisées.

Le module ne dépend pas d’AKS Analytics ni d’AKS Calendar.

---

# 4. Frontière d’AKS Analytics

## 4.1 Responsabilités

AKS Analytics est responsable de :

- l’importation ou la lecture des données statistiques autorisées ;
- la normalisation des données d’analyse ;
- le calcul des indicateurs ;
- la production des analyses par cours ;
- la consolidation globale ;
- la génération de tableaux, graphiques et rapports ;
- la comparaison entre saisons lorsque les données le permettent.

## 4.2 Hors responsabilité

AKS Analytics ne doit pas :

- modifier les données métier sources ;
- devenir la source officielle des inscriptions ou présences ;
- stocker des réponses médicales détaillées ;
- gérer les événements du calendrier ;
- appliquer directement des décisions administratives sur les licenciés.

## 4.3 Contrat d’entrée

Toute source de données doit fournir au minimum :

- une saison ;
- un contexte ou cours ;
- un identifiant technique ou une clé de rapprochement non ambiguë ;
- des valeurs exploitables selon un schéma documenté ;
- une date ou période de référence lorsque nécessaire.

Les données absentes, incomplètes ou non suivies doivent être signalées explicitement et ne doivent pas être estimées silencieusement.

---

# 5. Frontière d’AKS Calendar

## 5.1 Responsabilités

AKS Calendar est responsable de :

- l’intégration avec Google Calendar ;
- la création et la synchronisation des événements autorisés ;
- la gestion des calendriers partagés du club ;
- la présentation des événements selon les droits d’accès ;
- la mise à disposition rapide des fonctionnalités de calendrier sans réimplémentation inutile.

## 5.2 Principe d’intégration

Google Calendar constitue le moteur de calendrier de référence tant qu’il couvre les besoins fonctionnels validés. AKS Platform fournit l’intégration, les règles d’usage et les interfaces nécessaires, mais ne développe pas un moteur de calendrier interne sans justification fonctionnelle future.

## 5.3 Hors responsabilité

AKS Calendar ne gère pas :

- les statistiques de présence ;
- la logique des questionnaires santé ;
- l’authentification générale de la plateforme ;
- les données privées non nécessaires aux événements.

---

# 6. Frontière des interfaces utilisateur

## 6.1 Interface publique

L’interface publique expose uniquement les fonctions accessibles sans compte applicatif lorsque cela est prévu, notamment les formulaires publics sécurisés.

Elle ne doit jamais exposer :

- les paramètres internes ;
- les journaux ;
- les données administratives ;
- les fonctions de gestion ;
- les secrets ou signatures techniques.

## 6.2 Interface d’administration

L’interface d’administration permet le pilotage des campagnes, paramètres, journaux, traitements et modules autorisés.

Elle consomme les services d’AKS Core et des modules métier, sans reproduire leur logique interne.

## 6.3 Interface professeurs

L’interface professeurs est un espace fonctionnel distinct, limité aux données et actions nécessaires à l’encadrement des activités du club. Son périmètre exact sera défini par les futurs besoins validés.

---

# 7. Contrats entre composants

Un contrat entre composants doit préciser :

- le composant fournisseur ;
- le composant consommateur ;
- l’opération demandée ;
- les données d’entrée obligatoires et facultatives ;
- les données retournées ;
- les erreurs possibles ;
- les règles de sécurité ;
- les effets de bord éventuels ;
- les règles de journalisation ;
- la version du contrat.

Les contrats peuvent prendre la forme :

- d’une fonction interne ;
- d’un service applicatif ;
- d’une API sécurisée ;
- d’un événement logique ;
- d’un format de fichier ou de données documenté.

---

# 8. Règles de dépendance

Les dépendances autorisées suivent le sens général suivant :

```text
Interfaces utilisateur
        ↓
Modules métier
        ↓
Services transverses AKS Core
        ↓
Intégrations et services externes
```

Règles obligatoires :

1. une intégration externe ne contient pas la logique métier principale ;
2. une interface utilisateur n’accède pas directement au stockage ;
3. un module métier ne modifie pas les données internes d’un autre module ;
4. AKS Core ne dépend pas d’un module métier ;
5. les modules métier peuvent dépendre d’AKS Core ;
6. un module métier ne doit pas être requis pour faire fonctionner un autre module métier, sauf contrat explicitement approuvé ;
7. les échanges externes sont sécurisés et journalisés selon leur sensibilité.

---

# 9. Gestion des données

Chaque catégorie de données possède un composant responsable.

| Catégorie | Composant responsable |
|---|---|
| Paramètres globaux et campagnes | AKS Core |
| Références et journaux transverses | AKS Core |
| Décision administrative du questionnaire santé | Questionnaire santé |
| Réponses médicales détaillées | Aucun stockage autorisé |
| Données et indicateurs statistiques | AKS Analytics |
| Événements et calendriers partagés | AKS Calendar / Google Calendar |
| Présentation WordPress publique | Connecteur WordPress, sans responsabilité métier |

Le composant responsable garantit la validité, la confidentialité, la durée de conservation et les règles d’accès applicables à ses données.

---

# 10. Évolution et compatibilité

L’ajout d’un nouveau module doit respecter les étapes suivantes :

1. définir sa responsabilité métier ;
2. identifier ses données propres ;
3. déclarer ses dépendances à AKS Core ;
4. formaliser ses contrats d’entrée et de sortie ;
5. vérifier l’absence de dépendance circulaire ;
6. définir ses droits d’accès ;
7. documenter sa journalisation ;
8. prévoir ses tests de non-régression ;
9. mettre à jour la cartographie d’architecture.

Une modification incompatible d’un contrat existant est interdite sans :

- analyse d’impact ;
- stratégie de migration ;
- versionnement ;
- tests des consommateurs existants ;
- validation documentaire préalable.

---

# 11. Critères d’acceptation

Le présent livrable est accepté lorsque :

- les responsabilités de chaque composant principal sont définies ;
- les exclusions de responsabilité sont explicites ;
- les dépendances autorisées sont documentées ;
- les contrats d’échange disposent d’un cadre commun ;
- les responsabilités sur les données sont attribuées ;
- l’ajout futur d’un module peut être réalisé sans remettre en cause les composants existants ;
- les principes de confidentialité du Questionnaire santé sont préservés ;
- Google Calendar reste identifié comme service externe de référence pour AKS Calendar ;
- l’environnement Proxmox personnel demeure hors du périmètre AKS Platform.

---

# 12. Décision

Les frontières, responsabilités et règles contractuelles définies dans ce document sont adoptées comme référence d’architecture pour AKS Platform.

Tout nouveau développement ou document d’architecture doit respecter ces principes ou formaliser explicitement une décision d’architecture justifiant une exception.

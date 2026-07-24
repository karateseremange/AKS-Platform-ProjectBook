# ARCH-002 — M1.5

# Modèle logique des données et responsabilités de stockage

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Définir un cadre simple et directement exploitable pour organiser les données d’AKS Platform, préciser quel composant en est responsable et éviter les accès directs ou les duplications non maîtrisées.

Ce document complète les livrables `ARCH-002-M1.1` à `ARCH-002-M1.4`. Il constitue un guide pour les prochains développements, sans imposer de modélisation complexe ni anticiper des besoins non encore confirmés.

---

# 1. Principes directeurs

Les données d’AKS Platform respectent les règles suivantes :

- chaque donnée métier possède un composant propriétaire clairement identifié ;
- un composant ne modifie pas directement les données internes d’un autre composant ;
- les données partagées sont exposées par un contrat explicite ;
- les duplications sont évitées, sauf pour un besoin justifié de consultation, d’export ou d’historisation ;
- les données sensibles sont limitées au strict nécessaire ;
- les données temporaires sont supprimées dès qu’elles ne sont plus utiles ;
- toute évolution du stockage doit préserver les fonctionnalités déjà validées.

---

# 2. Catégories de données

## 2.1 Données de configuration

Elles décrivent le fonctionnement général de la plateforme :

- saison active ;
- paramètres du club ;
- adresses de notification ;
- identifiants de ressources Google ;
- activation ou désactivation de fonctions ;
- paramètres propres à chaque module.

Les paramètres transverses relèvent d’AKS Core. Les paramètres strictement métier restent sous la responsabilité du module concerné.

## 2.2 Données métier

Elles représentent l’activité fonctionnelle d’un module :

- dossiers de questionnaire santé ;
- décisions administratives ;
- indicateurs statistiques ;
- événements de calendrier ;
- futures données liées aux grades ou à d’autres modules.

Chaque module est propriétaire de ses données métier.

## 2.3 Données techniques

Elles permettent l’exploitation et le diagnostic :

- références internes ;
- horodatages ;
- statut de traitement ;
- erreurs techniques ;
- informations de synchronisation ;
- numéros de version de structure.

Elles doivent rester limitées à ce qui est nécessaire pour l’exploitation.

## 2.4 Données de journalisation

Elles servent à tracer les opérations significatives :

- création ou modification d’un paramètre ;
- exécution d’un traitement ;
- succès ou échec d’une notification ;
- action administrative sensible ;
- erreur nécessitant une intervention.

La journalisation ne doit pas recopier inutilement les données personnelles ou sensibles.

## 2.5 Documents générés

Ils comprennent notamment :

- attestations PDF ;
- rapports ;
- exports ;
- documents de synthèse.

Le module qui génère un document reste responsable de son contenu, de son emplacement et de sa durée de conservation.

## 2.6 Données temporaires

Elles peuvent être utilisées pendant un traitement, mais ne doivent pas devenir une source de référence :

- réponses en cours de saisie ;
- contenu intermédiaire d’un PDF ;
- cache ;
- résultats de calcul transitoires ;
- données préparées pour un envoi.

Elles sont supprimées ou invalidées après usage.

---

# 3. Responsabilités par composant

## 3.1 AKS Core

AKS Core est responsable des données transverses :

- configuration générale ;
- saison active ;
- référentiels communs ;
- identifiants techniques partagés ;
- services de journalisation communs ;
- informations nécessaires à l’intégration des modules.

AKS Core ne devient pas propriétaire des données métier de tous les modules.

## 3.2 Questionnaire santé

Le module Questionnaire santé est responsable de :

- la référence du dossier ;
- l’identité administrative nécessaire au traitement ;
- la date de naissance du licencié ;
- l’identité du représentant légal ;
- le résultat administratif ;
- le statut du dossier ;
- la référence de l’attestation générée, lorsqu’elle existe.

Les réponses détaillées aux questions de santé ne sont jamais stockées. Elles sont utilisées uniquement pendant le traitement et peuvent être récapitulées dans le courriel adressé au répondant, sans conservation par la plateforme.

## 3.3 AKS Analytics

AKS Analytics est responsable de :

- la définition des indicateurs ;
- les calculs statistiques ;
- les résultats consolidés ;
- les rapports et graphiques générés.

Les sources opérationnelles restent la propriété de leurs modules ou fichiers d’origine. AKS Analytics ne doit pas devenir une seconde base métier.

## 3.4 AKS Calendar

AKS Calendar est responsable de :

- la configuration propre aux calendriers ;
- les références d’événements utilisées pour la synchronisation ;
- les statuts de synchronisation ;
- les règles de publication ou de partage propres au module.

Google Calendar reste le service de référence pour les événements effectivement publiés.

## 3.5 Tableau de bord d’administration

Le tableau de bord n’est pas propriétaire des données qu’il affiche. Il consulte les informations fournies par AKS Core et les modules métier, puis présente une vue synthétique.

Une action déclenchée depuis le tableau de bord est transmise au composant responsable du traitement.

## 3.6 Paramétrage

Le composant de paramétrage fournit une interface de gestion. La propriété du paramètre reste attribuée à AKS Core ou au module métier concerné.

## 3.7 Journalisation

Le service de journalisation conserve les événements techniques et administratifs nécessaires au suivi de la plateforme. Il ne doit pas recevoir de réponses de santé détaillées ni de contenu documentaire complet lorsque seule une référence suffit.

---

# 4. Supports de stockage

## 4.1 Google Sheets

Google Sheets peut être utilisé pour :

- les configurations structurées ;
- les registres administratifs ;
- les données métier tabulaires ;
- les journaux ;
- les sources statistiques.

Chaque feuille doit avoir une responsabilité identifiable. Une feuille ne doit pas devenir un stockage générique partagé par tous les modules.

## 4.2 Google Drive

Google Drive peut accueillir :

- les attestations ;
- les rapports ;
- les exports ;
- les modèles documentaires ;
- les archives nécessaires.

Les dossiers doivent être organisés par usage, module ou saison lorsque cela facilite l’exploitation.

## 4.3 Services Google externes

Gmail et Google Calendar conservent les données relevant de leur service :

- messages envoyés et reçus dans Gmail ;
- événements et calendriers dans Google Calendar.

AKS Platform ne doit conserver que les références et statuts nécessaires au pilotage de ces échanges.

## 4.4 WordPress

WordPress porte l’interface publique et le connecteur d’intégration. Il ne constitue pas la base métier principale d’AKS Platform.

Les données transmises doivent être limitées à celles nécessaires à la requête et protégées conformément aux mécanismes d’intégration validés.

---

# 5. Règles d’accès

Les accès suivent les règles suivantes :

- le propriétaire d’une donnée peut la créer, la lire, la modifier et appliquer les règles de suppression prévues ;
- un autre composant consulte la donnée via un service ou un contrat documenté ;
- le tableau de bord et les interfaces ne contournent pas le module propriétaire ;
- un module ne dépend pas de la structure interne d’une feuille appartenant à un autre module ;
- un export ou une vue consolidée ne devient pas automatiquement une nouvelle source de référence ;
- les accès sensibles sont réservés aux fonctions administratives autorisées.

---

# 6. Confidentialité et minimisation

AKS Platform applique les principes suivants :

- ne collecter que les données nécessaires au traitement ;
- ne pas stocker une donnée sensible lorsqu’un résultat administratif suffit ;
- limiter les données présentes dans les journaux ;
- ne pas inclure de données confidentielles dans les messages d’erreur ;
- utiliser des références de dossier plutôt que recopier les informations personnelles ;
- définir une durée de conservation adaptée au besoin réel ;
- supprimer les données temporaires après traitement.

Pour le Questionnaire santé, la règle prioritaire reste l’absence totale de conservation des réponses détaillées.

---

# 7. Cycle de vie

Chaque ensemble de données doit avoir un cycle de vie compréhensible :

1. création par le composant propriétaire ;
2. validation selon les règles métier ;
3. utilisation par les interfaces et services autorisés ;
4. correction ou mise à jour tracée lorsqu’elle est nécessaire ;
5. archivage lorsque la donnée n’est plus active mais doit être conservée ;
6. suppression ou anonymisation lorsque sa conservation n’est plus justifiée.

Les règles détaillées de conservation seront définies au moment du développement de chaque module lorsqu’elles ne sont pas déjà connues.

---

# 8. Ajout d’un nouveau module

Lorsqu’un nouveau module est créé, son développement doit préciser au minimum :

- les données dont il est propriétaire ;
- les données communes qu’il consulte ;
- le support de stockage utilisé ;
- les contrats d’échange nécessaires ;
- les données sensibles ou personnelles manipulées ;
- les règles d’archivage et de suppression ;
- les événements devant être journalisés.

Un nouveau module ne doit pas imposer de modification directe aux structures internes des modules déjà en production.

---

# 9. Schéma logique simplifié

```text
Interfaces publiques / administration / professeurs
                         |
                         v
                  Services applicatifs
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
      AKS Core     Modules métier   Services transverses
          |              |              |
          +--------------+--------------+
                         |
                         v
          Google Sheets / Google Drive
                         |
             Gmail / Google Calendar
```

Chaque module conserve la maîtrise de ses données métier. AKS Core fournit les données et services communs, sans centraliser artificiellement toutes les informations de la plateforme.

---

# 10. Critères d’acceptation

Le présent livrable est accepté lorsque :

- les principales catégories de données sont identifiées ;
- chaque composant dispose d’une responsabilité de stockage claire ;
- les règles d’accès entre composants sont explicites ;
- la non-conservation des réponses détaillées du Questionnaire santé est confirmée ;
- les supports Google et WordPress sont positionnés sans ambiguïté ;
- les règles sont suffisamment simples pour guider les prochains développements ;
- aucune modélisation supplémentaire n’est requise avant le lancement du prochain module.

---

# 11. Décision

Le modèle logique défini dans ce document devient la référence de travail pour les prochains livrables d’AKS Platform.

Il pourra être ajusté lorsqu’un besoin concret l’exige, mais ne doit pas être complexifié de manière préventive.

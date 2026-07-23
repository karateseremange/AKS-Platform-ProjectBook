# ARCH-002 — M1.4

# Flux fonctionnels et échanges entre composants

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Décrire les principaux flux fonctionnels d’AKS Platform et préciser les échanges entre les interfaces, AKS Core, les modules métier et les services externes.

Ce document complète le cadrage `ARCH-002-M1.1`, la cartographie `ARCH-002-M1.2` et les règles de frontières et de contrats définies dans `ARCH-002-M1.3`.

---

# 1. Principes généraux des flux

Les flux d’AKS Platform respectent les principes suivants :

- toute action utilisateur entre par une interface identifiée ;
- l’interface ne porte pas la logique métier ;
- la logique métier appartient au module concerné ;
- les capacités transverses sont fournies par AKS Core ;
- les échanges entre composants utilisent des contrats explicites ;
- chaque composant ne manipule que les données relevant de sa responsabilité ;
- les services externes sont considérés comme des dépendances contrôlées ;
- chaque opération sensible doit pouvoir être journalisée ;
- une erreur dans un composant ne doit pas compromettre l’intégrité des autres composants.

---

# 2. Typologie des échanges

## 2.1 Échanges synchrones

Un échange synchrone est utilisé lorsque le composant appelant doit obtenir immédiatement un résultat pour poursuivre le traitement.

Exemples :

- validation d’un formulaire ;
- lecture d’un paramètre de campagne ;
- contrôle d’une autorisation ;
- calcul d’une décision métier ;
- récupération d’un indicateur pour le tableau de bord.

## 2.2 Échanges différés

Un échange différé est utilisé lorsqu’une opération peut être exécutée après la réponse principale sans bloquer l’utilisateur.

Exemples :

- envoi d’une notification ;
- génération ou archivage d’un document ;
- consolidation statistique ;
- synchronisation avec un service externe ;
- production d’un journal technique.

Dans l’environnement actuel Google Apps Script, ces traitements peuvent rester séquentiels techniquement tout en étant considérés comme différés du point de vue fonctionnel.

## 2.3 Échanges de consultation

Les flux de consultation doivent être séparés des flux de modification.

Une consultation :

- ne modifie aucune donnée métier ;
- ne déclenche pas d’action externe, sauf journalisation nécessaire ;
- applique les mêmes règles d’autorisation que les opérations de modification.

---

# 3. Flux du Questionnaire santé

## 3.1 Initialisation

1. Le représentant légal accède à l’interface publique depuis le site de l’association.
2. L’interface demande à AKS Core la campagne active et les paramètres publics nécessaires.
3. AKS Core retourne uniquement les données autorisées à être exposées publiquement.
4. L’interface affiche le formulaire officiel destiné aux licenciés mineurs.

## 3.2 Soumission

1. L’interface contrôle la complétude et le format des données saisies.
2. La demande est transmise au module Questionnaire santé.
3. Le module contrôle l’éligibilité du mineur et la cohérence des données d’identification.
4. Le moteur de décision analyse les réponses sans les stocker durablement.
5. Le module produit l’un des deux résultats suivants :
   - attestation autorisée ;
   - certificat médical requis.
6. Le module demande à AKS Core la génération d’une référence unique.
7. Seules les données administratives autorisées et le résultat final sont conservés.

## 3.3 Production documentaire et notifications

Lorsque l’attestation est autorisée :

1. le module prépare les données nécessaires ;
2. le service documentaire génère l’attestation PDF ;
3. le document est archivé selon les règles de conservation ;
4. le service de notification transmet l’attestation au représentant légal ;
5. le club reçoit une notification administrative sans les réponses détaillées.

Lorsque le certificat médical est requis :

1. aucun PDF d’attestation n’est généré ;
2. le représentant légal reçoit les consignes adaptées ;
3. le club reçoit le statut administratif correspondant ;
4. les réponses détaillées ne sont ni conservées ni communiquées au club.

---

# 4. Flux du tableau de bord d’administration

1. L’administrateur accède à l’interface privée.
2. AKS Core contrôle son identité et ses autorisations.
3. L’interface demande aux modules concernés leurs données de synthèse par contrat de consultation.
4. Chaque module retourne uniquement les indicateurs dont il est responsable.
5. Le tableau de bord agrège les résultats sans accéder directement aux données internes des modules.
6. Toute action administrative est transmise au composant propriétaire de la fonction.
7. Les opérations sensibles sont journalisées par le service transversal prévu à cet effet.

Le tableau de bord constitue une interface d’orchestration et de présentation. Il ne devient pas propriétaire des règles métier ni des données des modules.

---

# 5. Flux d’AKS Analytics

## 5.1 Alimentation

1. Les sources autorisées fournissent des données structurées ou des agrégats.
2. AKS Analytics contrôle la conformité du format reçu.
3. Les données sont normalisées pour la saison et le périmètre concernés.
4. Les calculs statistiques sont réalisés dans le module Analytics.
5. Les indicateurs produits sont enregistrés ou recalculés selon la stratégie définie.

AKS Analytics ne doit pas contourner les contrats des modules métier pour accéder à leurs données internes.

## 5.2 Restitution

1. Une interface autorisée demande un rapport ou un indicateur.
2. AKS Core contrôle les droits d’accès.
3. AKS Analytics produit la vue demandée.
4. L’interface présente les résultats sans modifier les données sources.
5. Les exports éventuels sont générés par les services documentaires autorisés.

---

# 6. Flux d’AKS Calendar

## 6.1 Création et modification d’événements

1. Un utilisateur autorisé saisit ou modifie une activité depuis l’interface prévue.
2. AKS Core contrôle les droits selon le rôle et le périmètre.
3. AKS Calendar valide les données fonctionnelles de l’événement.
4. Le connecteur Google Calendar exécute l’opération externe.
5. Le résultat de l’opération est retourné à AKS Calendar.
6. AKS Calendar confirme l’état final à l’interface.
7. L’action est journalisée lorsque nécessaire.

## 6.2 Consultation

1. L’interface demande les événements du périmètre autorisé.
2. AKS Calendar interroge Google Calendar au moyen du connecteur prévu.
3. Les données sont filtrées et normalisées.
4. Seules les informations nécessaires sont présentées à l’utilisateur.

Google Calendar reste le service de référence pour les événements tant qu’aucune décision d’architecture contraire n’est validée.

---

# 7. Flux de paramétrage

1. L’administrateur modifie un paramètre depuis l’interface privée.
2. AKS Core contrôle l’autorisation et la validité de la valeur.
3. Le paramètre est enregistré dans le référentiel de configuration.
4. La modification est journalisée.
5. Les modules consommateurs lisent la nouvelle valeur par le service de configuration.

Un module ne doit pas lire directement le support physique de configuration lorsqu’un service AKS Core est disponible.

---

# 8. Flux de journalisation

Chaque composant peut demander l’enregistrement d’un événement en fournissant au minimum :

- la date et l’heure ;
- le composant source ;
- le type d’opération ;
- le niveau de criticité ;
- l’identifiant fonctionnel utile ;
- le résultat de l’opération ;
- les informations techniques nécessaires au diagnostic.

Les journaux ne doivent pas contenir de réponses médicales détaillées, de secrets techniques, de jetons d’accès ni de données personnelles non nécessaires.

---

# 9. Flux avec WordPress

WordPress constitue un point d’entrée public et un support de présentation, mais ne porte pas les règles métier d’AKS Platform.

Le flux de référence est le suivant :

1. l’utilisateur accède à une page du site ;
2. le connecteur WordPress charge ou transmet les données nécessaires ;
3. la requête est authentifiée et contrôlée ;
4. AKS Platform exécute la logique métier ;
5. une réponse limitée au besoin fonctionnel est renvoyée ;
6. WordPress affiche le résultat.

Aucune donnée sensible ne doit être durablement stockée dans WordPress lorsque sa conservation relève d’AKS Platform.

---

# 10. Flux avec Google Workspace

Les services Google Workspace actuellement mobilisables sont notamment :

- Google Sheets pour certains référentiels ou données structurées ;
- Google Drive pour les documents et archives autorisés ;
- Gmail pour les notifications ;
- Google Calendar pour les événements partagés ;
- Google Apps Script pour l’exécution applicative.

Chaque intégration doit être encapsulée afin d’éviter qu’un module métier dépende directement de détails techniques propres au service externe.

---

# 11. Gestion des erreurs

Lorsqu’une erreur survient :

1. le composant détecteur qualifie l’erreur ;
2. l’opération en cours est interrompue sans laisser de données incohérentes ;
3. une réponse compréhensible est retournée à l’interface ;
4. les informations techniques utiles sont journalisées ;
5. aucune donnée sensible n’est exposée à l’utilisateur ;
6. les traitements déjà validés ne sont pas rejoués sans contrôle d’idempotence.

Les erreurs externes, notamment celles de Google Workspace ou WordPress, doivent être distinguées des erreurs métier internes.

---

# 12. Idempotence et prévention des doublons

Les opérations susceptibles d’être rejouées doivent disposer d’un mécanisme d’identification unique.

Cela concerne notamment :

- les soumissions de formulaires ;
- la génération documentaire ;
- l’envoi de notifications ;
- la création d’événements ;
- les imports statistiques ;
- les traitements automatisés.

Une même demande ne doit pas produire plusieurs enregistrements, documents, messages ou événements lorsque son résultat existe déjà et reste valide.

---

# 13. Synthèse des dépendances de flux

Les dépendances autorisées suivent le sens général suivant :

```text
Interfaces
   ↓
AKS Core / Contrôle d’accès / Configuration
   ↓
Modules métier
   ↓
Services transverses et connecteurs
   ↓
Services externes Google Workspace / WordPress
```

Les retours suivent le chemin inverse sous forme de résultats normalisés.

Les dépendances directes entre modules métier doivent rester exceptionnelles, justifiées et formalisées par un contrat. La préférence est donnée à l’utilisation d’un service transversal ou d’un échange de données explicitement défini.

---

# 14. Critères de conformité

Un flux est conforme à l’architecture logique lorsqu’il :

- identifie clairement son point d’entrée ;
- désigne le composant propriétaire de la logique métier ;
- respecte les frontières définies dans `ARCH-002-M1.3` ;
- utilise un contrat documenté pour chaque échange intercomposant ;
- protège les données personnelles et sensibles ;
- prévoit la gestion des erreurs et des doublons ;
- limite les dépendances aux services externes ;
- permet la journalisation des opérations importantes ;
- reste compatible avec les fonctionnalités déjà validées.

---

# 15. Décision d’architecture

Les flux décrits dans ce document constituent la référence fonctionnelle pour les futurs développements d’AKS Platform.

Tout nouveau module devra documenter ses flux entrants, ses traitements, ses échanges, ses sorties, ses erreurs et ses dépendances avant son intégration à la plateforme.

Aucune implémentation ne devra introduire un accès direct non documenté aux données internes d’un autre composant.

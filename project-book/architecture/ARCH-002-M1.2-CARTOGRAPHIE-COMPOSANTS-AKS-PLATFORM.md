# ARCH-002 — M1.2

# Cartographie des composants d’AKS Platform

Version documentaire : 1.0  
Statut : Validé  
Auteur : AKS Platform

---

## Objectif

Établir une cartographie fonctionnelle et logique des composants d’AKS Platform afin d’identifier clairement leurs responsabilités, leurs interactions, leurs dépendances et leur position dans l’architecture globale.

Ce document complète le cadrage défini dans `ARCH-002-M1.1` et constitue la base de référence pour les prochains travaux de découpage modulaire et d’intégration.

---

# 1. Principes de cartographie

La cartographie repose sur les principes suivants :

- séparation claire entre socle technique, services partagés et modules métier ;
- responsabilités explicites pour chaque composant ;
- dépendances orientées vers le socle commun ;
- limitation du couplage direct entre modules métier ;
- possibilité d’évolution indépendante des modules ;
- conservation d’une architecture compatible avec Google Apps Script, Google Workspace et WordPress ;
- absence de dépendance avec l’environnement Proxmox personnel, qui reste hors du périmètre d’AKS Platform.

---

# 2. Vue d’ensemble logique

AKS Platform est structurée autour de cinq ensembles principaux :

1. **Canaux d’accès et interfaces utilisateurs** ;
2. **AKS Core et services transverses** ;
3. **Modules métier** ;
4. **Services d’intégration externes** ;
5. **Stockage, traçabilité et documentation**.

La logique générale est la suivante :

```text
Utilisateurs
    |
    v
Interfaces publiques et privées
    |
    v
AKS Core et services transverses
    |
    +--------------------+--------------------+
    |                    |                    |
    v                    v                    v
Questionnaire santé   AKS Analytics      AKS Calendar
    |                    |                    |
    +--------------------+--------------------+
                         |
                         v
            Google Workspace et services externes
```

---

# 3. Canaux d’accès et interfaces utilisateurs

## 3.1 Site WordPress public

Le site WordPress constitue le point d’entrée public principal pour les licenciés, les représentants légaux et les visiteurs.

Responsabilités :

- présenter les formulaires et services publics ;
- intégrer les interfaces AKS Platform ;
- relayer les requêtes vers les services applicatifs ;
- préserver une expérience cohérente avec le site de l’association ;
- ne pas porter directement la logique métier sensible.

## 3.2 Interfaces Google Apps Script

Les interfaces Apps Script assurent l’exécution des fonctions publiques ou administratives.

Responsabilités :

- afficher les formulaires et écrans applicatifs ;
- valider les données côté client et côté serveur ;
- appeler les services métier ;
- appliquer les règles d’accès ;
- restituer les résultats et messages utilisateurs.

## 3.3 Interfaces administratives

Les interfaces administratives sont destinées aux responsables autorisés de l’association.

Responsabilités :

- administrer les campagnes et paramètres ;
- consulter les résultats autorisés ;
- déclencher certaines opérations ;
- accéder aux journaux et contrôles ;
- préparer les futurs tableaux de bord.

## 3.4 Interfaces professeurs

Les interfaces professeurs constituent un périmètre futur ou progressif.

Responsabilités envisagées :

- consulter les informations nécessaires à l’organisation des cours ;
- accéder au calendrier partagé ;
- consulter certains indicateurs autorisés ;
- limiter l’accès aux seules données utiles à la fonction pédagogique.

---

# 4. AKS Core et services transverses

AKS Core constitue le socle commun de la plateforme. Les modules métier ne doivent pas dupliquer les fonctions déjà fournies par ce socle.

## 4.1 Configuration et paramétrage

Responsabilités :

- centraliser les paramètres généraux ;
- gérer les saisons sportives ;
- gérer les identifiants fonctionnels ;
- fournir les paramètres aux modules ;
- éviter les valeurs techniques dispersées dans le code.

## 4.2 Gestion des accès

Responsabilités :

- identifier les profils autorisés ;
- contrôler l’accès aux fonctions privées ;
- distinguer les usages publics, administratifs et professeurs ;
- appliquer le principe du moindre privilège.

## 4.3 Journalisation

Responsabilités :

- enregistrer les événements techniques et administratifs utiles ;
- faciliter le diagnostic ;
- conserver une trace des opérations sensibles ;
- exclure les données médicales détaillées et les informations non nécessaires.

## 4.4 Services documentaires

Responsabilités :

- produire les documents PDF ;
- appliquer les modèles validés ;
- gérer les noms et références des documents ;
- stocker uniquement les documents autorisés ;
- assurer la cohérence documentaire entre modules.

## 4.5 Services de notification

Responsabilités :

- envoyer les courriels aux destinataires autorisés ;
- centraliser les noms d’expéditeur et adresses de réponse ;
- gérer les modèles de notification ;
- joindre les documents autorisés ;
- éviter l’exposition de données sensibles.

## 4.6 Services de référence

Responsabilités :

- générer les références métier uniques ;
- garantir leur cohérence par saison et par module ;
- faciliter le suivi administratif ;
- fournir des identifiants lisibles aux utilisateurs.

---

# 5. Modules métier

## 5.1 Module Questionnaire santé

Statut : opérationnel en version 1.0.

Responsabilités :

- gérer le questionnaire officiel destiné aux licenciés mineurs ;
- recueillir l’identification nécessaire ;
- appliquer le moteur de décision ;
- ne jamais stocker les réponses médicales détaillées ;
- produire l’attestation lorsque les conditions sont remplies ;
- notifier le représentant légal et le club ;
- conserver uniquement le résultat administratif autorisé.

Dépendances principales :

- configuration AKS Core ;
- génération de références ;
- services PDF ;
- services de notification ;
- journalisation ;
- intégration WordPress.

## 5.2 AKS Analytics

Statut : prochain module métier prévu après la consolidation V1.1.

Responsabilités envisagées :

- analyser les présences et effectifs ;
- produire des indicateurs par cours et par saison ;
- générer des rapports harmonisés ;
- consolider les analyses globales ;
- alimenter les besoins de l’assemblée générale et du pilotage du club.

Dépendances principales :

- données Google Sheets autorisées ;
- configuration des saisons ;
- services documentaires ;
- journalisation ;
- futur tableau de bord d’administration.

## 5.3 AKS Calendar

Statut : intégration future prioritairement fondée sur Google Calendar.

Responsabilités envisagées :

- fournir un calendrier partagé entre professeurs ;
- publier les événements utiles ;
- gérer les accès selon les profils ;
- éviter le développement d’un moteur de calendrier interne sans valeur ajoutée ;
- exploiter les capacités natives de Google Calendar.

Dépendances principales :

- Google Calendar ;
- gestion des accès ;
- configuration AKS Core ;
- éventuelles interfaces WordPress ou Apps Script.

## 5.4 Modules futurs

Des modules complémentaires pourront être ajoutés après validation de leur valeur métier, notamment pour :

- la gestion des grades ;
- le suivi pédagogique ;
- les inscriptions ;
- les statistiques avancées ;
- la communication ou les notifications ciblées.

Tout nouveau module devra respecter les contrats d’architecture définis par `ARCH-002`.

---

# 6. Services d’intégration externes

## 6.1 Google Sheets

Rôles :

- stockage structuré de données administratives autorisées ;
- source de données pour les rapports ;
- support de paramétrage lorsque cela est pertinent ;
- interface de contrôle pour certains usages internes.

## 6.2 Google Drive

Rôles :

- stockage des documents produits ;
- organisation par saison et par module ;
- partage contrôlé ;
- conservation documentaire.

## 6.3 Gmail

Rôles :

- envoi des notifications ;
- utilisation de l’identité officielle du club ;
- traçabilité dans les messages envoyés, sous réserve des règles Gmail mises en place.

## 6.4 Google Calendar

Rôles :

- calendrier partagé ;
- gestion native des invitations et droits ;
- diffusion des événements ;
- réduction du besoin de développement spécifique.

## 6.5 WordPress

Rôles :

- intégration publique ;
- publication des pages et formulaires ;
- mise à disposition d’un accès sans compte Google ;
- présentation cohérente avec l’identité du club.

## 6.6 GitHub

Rôles :

- gestion du code applicatif ;
- gestion du Project Book ;
- contrôle des versions ;
- conservation de l’historique des décisions et livrables.

---

# 7. Stockage et responsabilités sur les données

| Type de donnée | Composant responsable | Conservation |
|---|---|---|
| Paramètres généraux | AKS Core | Durable |
| Références métier | AKS Core / module concerné | Durable |
| Résultats administratifs | Module concerné | Selon nécessité métier |
| Réponses médicales détaillées | Aucun stockage | Interdite |
| Documents PDF autorisés | Services documentaires / Drive | Selon règle documentaire |
| Journaux techniques | Service de journalisation | Limitée et maîtrisée |
| Données de présence | Sources Analytics | Selon saison et règles internes |
| Événements calendrier | Google Calendar | Selon politique du calendrier |

---

# 8. Règles de dépendance

Les règles suivantes deviennent la référence pour l’évolution d’AKS Platform :

1. un module métier peut dépendre d’AKS Core ;
2. AKS Core ne doit pas dépendre d’un module métier particulier ;
3. les modules métier ne doivent pas accéder directement aux données internes d’un autre module ;
4. les échanges intermodules doivent passer par des services ou contrats explicites ;
5. les services externes doivent être encapsulés autant que possible ;
6. les interfaces utilisateurs ne doivent pas contenir la logique métier principale ;
7. les règles de sécurité et de confidentialité s’appliquent à tous les composants ;
8. tout nouveau composant doit être documenté avant son intégration définitive.

---

# 9. Cartographie synthétique

| Ensemble | Composants principaux | Responsabilité dominante |
|---|---|---|
| Interfaces | WordPress, Apps Script, administration, professeurs | Accès et interaction utilisateur |
| Socle | Configuration, accès, journalisation, PDF, notifications, références | Services communs |
| Métier | Questionnaire santé, Analytics, Calendar, futurs modules | Règles fonctionnelles |
| Intégrations | Sheets, Drive, Gmail, Calendar, WordPress, GitHub | Services externes |
| Gouvernance | Project Book, versionnement, décisions | Référentiel et traçabilité |

---

# 10. Critères d’acceptation

Le présent livrable est considéré comme accepté lorsque :

- les principaux composants actuels et futurs sont identifiés ;
- leurs responsabilités sont décrites ;
- les dépendances structurantes sont explicites ;
- AKS Core est confirmé comme socle transversal ;
- les modules métier restent découplés ;
- les services Google et WordPress sont positionnés comme intégrations externes ;
- Proxmox est explicitement exclu du périmètre AKS Platform ;
- la cartographie peut servir de base aux prochains livrables d’architecture.

---

# 11. Suite du chantier

Le prochain livrable d’`ARCH-002` devra détailler les frontières, responsabilités et contrats entre AKS Core, les modules métier et les intégrations externes.

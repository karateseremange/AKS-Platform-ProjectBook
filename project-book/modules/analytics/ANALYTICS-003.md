# ANALYTICS-003 — Services et règles d’orchestration d’AKS Analytics

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-003 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Nature** | Services et orchestration du module |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-26 |
| **Version du produit** | V1.2 |

---

## 1. Objet

Le présent document transforme le modèle métier défini dans `ANALYTICS-002` en une chaîne de traitement explicite, testable, idempotente et traçable.

Il définit les responsabilités des services d’AKS Analytics, leur ordre d’exécution, leurs contrats internes, leurs règles d’erreur et de recalcul, ainsi que leur intégration avec les services transverses d’AKS Platform.

Il ne définit ni les écrans finaux, ni les formats détaillés des sources externes, ni la stratégie complète de validation, qui relèvent respectivement d’`ANALYTICS-004`, `ANALYTICS-005` et `ANALYTICS-006`.

---

## 2. Références applicables

Le présent document applique notamment :

- `ANALYTICS-001` — vision et architecture ;
- `ANALYTICS-002` — modèle métier ;
- `ARCH-001` et `CORE-001` — architecture et socle commun ;
- `API-001` — principes de contrats ;
- `SECURITY-001` — sécurité ;
- `STORAGE-001` — stockage transverse ;
- `ERROR-001` — gestion des erreurs ;
- `LOG-001` — journalisation ;
- `AUDIT-001` — audit et traçabilité ;
- `CONFIG-001` — paramétrage centralisé ;
- `ADMIN-003` — Centre de pilotage ;
- `ADMIN-004` — contrats `DashboardProvider` et `DashboardWidget` ;
- `DOC-001` et `STD-001` — gouvernance documentaire.

Analytics consomme ces services sans dupliquer leurs responsabilités.

---

## 3. Périmètre d’orchestration 2025-2026

La chaîne traite exclusivement les cours suivants :

- Baby ;
- Enfant 1 ;
- Enfant 2 ;
- Ado/Adulte.

Le cours féminin est exclu de l’ingestion analytique, des calculs, des comparaisons, des agrégats et de la synthèse globale 2025-2026. Son exclusion est portée comme métadonnée méthodologique dans les restitutions globales.

Une donnée absente, inconnue, invalide ou non collectée n’est jamais transformée en absence.

Le score AKS reste désactivé tant qu’une formule versionnée n’a pas été validée dans un référentiel approprié.

---

## 4. Principes de conception

1. Chaque service possède une responsabilité unique.
2. Les sources sont consultées en lecture seule.
3. Le modèle normalisé est indépendant de la structure physique des fichiers sources.
4. Les calculs métier sont absents des interfaces et du Centre de pilotage.
5. Tout résultat publié possède une provenance, une version de règle et un état de qualité.
6. Une erreur sur un cours ou une source n’interrompt pas les traitements indépendants.
7. Les traitements répétables produisent le même résultat à données et règles identiques.
8. Aucune publication ne remplace silencieusement un résultat valide par un résultat incomplet.
9. Les responsabilités transverses restent confiées à `AKS.Config`, au logger, à l’audit et au stockage communs.
10. Les contrats internes sont versionnés avant toute rupture.

---

## 5. Chaîne de traitement de référence

La chaîne nominale est :

```text
Lecture → Normalisation → Validation → Calcul
       → Agrégation → Restitution → Publication
```

Chaque étape reçoit un contexte de traitement immuable et retourne un résultat explicite. Elle ne lit pas implicitement l’état d’une étape suivante.

Un traitement est identifié par un `runId` unique et rattaché à une saison, un périmètre, une version de contrat et une version de règles.

---

## 6. Contexte d’exécution

Le contexte minimal contient :

- `runId` ;
- identifiant de saison ;
- mode : contrôle, calcul complet, recalcul ciblé ou préparation de saison ;
- cours demandés ;
- fournisseurs activés ;
- instant de référence ;
- version du modèle normalisé ;
- version des règles d’indicateurs ;
- identité technique de l’appelant ;
- identifiant de corrélation transverse ;
- options autorisées issues de `AKS.Config`.

Le contexte ne contient pas de secret persistant ni de données personnelles inutiles.

---

## 7. Services

### 7.1 AnalyticsOrchestrator

Responsabilités :

- construire et valider le contexte d’exécution ;
- déterminer le plan de traitement ;
- appeler les services dans l’ordre défini ;
- isoler les traitements par source et par cours ;
- consolider les états de succès, avertissement et échec ;
- déclencher la publication uniquement si ses préconditions sont satisfaites ;
- produire le bilan final du traitement.

Il ne lit pas directement les feuilles, ne calcule aucun indicateur et ne génère aucune interface.

### 7.2 AnalyticsSourceProvider

Responsabilités :

- identifier une source autorisée ;
- vérifier sa disponibilité et sa version ;
- lire les données sans les modifier ;
- retourner les données brutes avec leurs métadonnées de provenance ;
- signaler les limitations connues.

Un fournisseur ne corrige pas silencieusement une source et ne réalise aucun calcul métier.

Le contrat minimal retourne :

- identifiant et version du fournisseur ;
- identifiant de source ;
- empreinte ou version de la source ;
- instant de lecture ;
- périmètre déclaré ;
- données brutes ;
- avertissements et erreurs de lecture.

Les formats détaillés seront définis dans `ANALYTICS-005`.

### 7.3 AnalyticsNormalizer

Responsabilités :

- convertir les valeurs brutes vers les entités d’`ANALYTICS-002` ;
- harmoniser dates, identifiants, libellés et statuts ;
- préserver la distinction entre absence, inconnu, non-éligible, séance annulée et donnée invalide ;
- produire les anomalies de transformation ;
- versionner le schéma normalisé.

La normalisation ne complète pas une valeur par supposition.

### 7.4 AnalyticsQualityService

Responsabilités :

- contrôler la structure ;
- détecter doublons, incohérences et valeurs impossibles ;
- vérifier l’appartenance à la saison et au cours ;
- calculer les taux de complétude ;
- classer les anomalies par sévérité ;
- déterminer l’éligibilité de chaque jeu de données au calcul et à la publication.

Niveaux minimaux :

- `INFO` : information sans impact ;
- `WARNING` : résultat calculable avec limite visible ;
- `ERROR` : calcul local impossible ;
- `BLOCKING` : publication du périmètre interdite.

Les seuils structurants sont versionnés et obtenus par configuration autorisée.

### 7.5 AnalyticsIndicatorEngine

Responsabilités :

- appliquer les formules validées ;
- calculer les indicateurs individuels autorisés, par séance, par période et par cours ;
- rattacher chaque valeur à sa définition et à sa version ;
- retourner explicitement `non_calculable` lorsque les préconditions manquent ;
- produire les détails nécessaires à l’explicabilité.

Le moteur n’invente aucune valeur et n’active pas le score AKS sans règle validée.

Chaque résultat d’indicateur contient au minimum :

- identifiant d’indicateur ;
- version de règle ;
- valeur et unité, ou état `non_calculable` ;
- numérateur et dénominateur lorsqu’ils existent ;
- période et périmètre ;
- niveau de complétude ;
- exclusions appliquées ;
- avertissements.

### 7.6 AnalyticsAggregationService

Responsabilités :

- agréger d’abord les résultats validés de chaque cours ;
- produire ensuite la synthèse globale à partir des rapports par cours ;
- respecter les pondérations définies pour chaque indicateur ;
- exclure tout périmètre non éligible ;
- conserver les limites de qualité dans les résultats consolidés.

Une moyenne globale n’est jamais obtenue par moyenne simple des moyennes de cours lorsque les dénominateurs diffèrent. Les numérateurs et dénominateurs validés sont agrégés selon la définition de l’indicateur.

L’échec d’un cours produit une synthèse partielle explicitement marquée ou interdit l’agrégat concerné ; il ne conduit jamais à considérer ce cours comme nul.

### 7.7 AnalyticsReportService

Responsabilités :

- construire un modèle de restitution indépendant de l’interface ;
- produire les jeux de données des tableaux et graphiques ;
- générer des commentaires factuels à partir de règles explicites ;
- joindre les mentions méthodologiques et limites de qualité ;
- produire quatre rapports séparés avant la synthèse globale ;
- préparer les exports autorisés.

Un commentaire automatique décrit un résultat ; il ne pose aucun diagnostic individuel et ne masque jamais une limitation de données.

### 7.8 AnalyticsResultRepository

Responsabilités :

- conserver les résultats autorisés, métadonnées et états de qualité ;
- empêcher la duplication d’un même résultat logique ;
- permettre la récupération de la dernière exécution valide ;
- préserver l’historique requis pour la traçabilité ;
- appliquer `STORAGE-001`.

Il ne devient pas un second référentiel de présences et ne stocke pas sans justification une copie complète des sources.

### 7.9 AnalyticsPublisher

Responsabilités :

- vérifier les préconditions de publication ;
- publier atomiquement un ensemble cohérent de résultats ;
- conserver la dernière version valide en cas d’échec ;
- enregistrer la référence du résultat publié ;
- invalider uniquement les caches concernés.

Aucun résultat provisoire ou bloqué par la qualité n’est présenté comme officiel.

### 7.10 AnalyticsDashboardProvider

Responsabilités :

- implémenter le contrat `DashboardProvider` d’`ADMIN-004` ;
- lire uniquement des résultats Analytics déjà calculés et publiés ;
- exposer des widgets déclaratifs ;
- respecter les droits et les états standard du Centre de pilotage ;
- rester indépendant d’une panne d’un autre fournisseur.

Il n’effectue ni lecture des sources, ni normalisation, ni calcul à l’affichage.

### 7.11 AnalyticsSeasonPreparationService

Responsabilités :

- valider l’identifiant et les dates de la nouvelle saison ;
- construire un plan de ressources avant toute création ;
- détecter les ressources déjà existantes ;
- créer uniquement les dossiers, fichiers, feuilles et métadonnées autorisés ;
- appliquer les modèles et permissions validés ;
- produire un journal de contrôle ;
- permettre une reprise sûre après interruption.

La préparation est idempotente. Elle n’écrase ni ne supprime aucune ressource existante. Toute collision est signalée et soumise à décision.

---

## 8. Objets d’échange internes

### 8.1 SourceBatch

Contient la provenance, la version du fournisseur, l’empreinte de source, le périmètre déclaré, les données brutes et les erreurs de lecture.

### 8.2 NormalizedDataset

Contient les entités normalisées, la version de schéma, les anomalies de transformation et la correspondance vers la provenance.

### 8.3 QualityReport

Contient les contrôles exécutés, les anomalies, la complétude, les exclusions et la décision d’éligibilité.

### 8.4 IndicatorSet

Contient les indicateurs calculés ou non calculables, leurs versions, détails d’explicabilité, périodes et niveaux de qualité.

### 8.5 CourseReportModel

Contient les résultats validés d’un cours, ses graphiques, commentaires, mentions et état global.

### 8.6 GlobalReportModel

Contient les agrégats autorisés issus des rapports par cours, la couverture réelle, les exclusions méthodologiques et les limites d’interprétation.

### 8.7 RunSummary

Contient l’état final, les durées, les sources lues, les cours traités, les étapes exécutées, les avertissements, les erreurs et les références publiées.

---

## 9. Ordre d’orchestration

Pour chaque exécution analytique :

1. charger et valider la configuration ;
2. construire le contexte et le plan ;
3. ouvrir le suivi du traitement ;
4. lire chaque source autorisée ;
5. normaliser chaque lot ;
6. exécuter les contrôles qualité ;
7. calculer les indicateurs éligibles par cours ;
8. produire et valider les quatre rapports de cours ;
9. agréger uniquement les résultats compatibles ;
10. construire la synthèse globale ;
11. persister les résultats candidats ;
12. publier atomiquement les résultats éligibles ;
13. exposer les nouvelles références au fournisseur du tableau de bord ;
14. clôturer et journaliser le traitement.

Une étape ignorée doit avoir un motif explicite.

---

## 10. Isolation des erreurs

L’unité d’isolation est au minimum le couple source-cours.

Les règles sont :

- une source indisponible n’empêche pas la lecture des autres ;
- une structure invalide bloque uniquement le périmètre dépendant ;
- un calcul impossible produit `non_calculable`, jamais zéro ;
- une erreur de rapport d’un cours n’efface pas son dernier rapport valide ;
- une synthèse globale partielle porte la liste exacte des cours couverts ;
- une erreur de publication conserve la dernière publication valide ;
- une erreur transverse empêchant la traçabilité interdit la publication.

L’orchestrateur retourne un état global parmi `SUCCESS`, `PARTIAL_SUCCESS`, `FAILED` ou `NO_CHANGE`.

---

## 11. Recalcul et idempotence

### 11.1 Clé logique

Un résultat logique est identifié par :

- saison ;
- périmètre ;
- période ;
- indicateur ou rapport ;
- version de règle ;
- version du modèle normalisé ;
- empreintes des sources utiles.

### 11.2 Règles

- une exécution identique ne crée pas de doublon ;
- un changement de source, de règle ou de périmètre déclenche un nouveau résultat ;
- un recalcul ciblé ne modifie pas les résultats indépendants ;
- le recalcul complet ne publie qu’après validation de l’ensemble éligible ;
- un résultat historique n’est pas réécrit silencieusement ;
- l’état `NO_CHANGE` est traçable sans republier.

### 11.3 Modes

- **Contrôle** : lecture, normalisation et qualité sans publication ;
- **Calcul complet** : traitement de tous les cours inclus ;
- **Recalcul ciblé** : cours, période ou indicateur explicitement désigné ;
- **Préparation de saison** : création contrôlée des ressources, sans calcul d’indicateur.

---

## 12. Publication atomique et conservation du dernier état valide

La publication suit deux phases :

1. préparation et validation d’un jeu candidat ;
2. activation de sa référence comme version publiée.

Si l’activation échoue, le dernier jeu valide reste actif. Les résultats candidats incomplets ou échoués peuvent être conservés uniquement pour diagnostic selon les règles de stockage et de conservation.

Le Centre de pilotage ne lit jamais un jeu partiellement activé.

---

## 13. Journalisation, audit et traçabilité

Le module utilise le logger transverse pour enregistrer au minimum :

- début et fin du traitement ;
- `runId` et identifiant de corrélation ;
- saison, mode et périmètre ;
- fournisseur et version ;
- volumes lus, normalisés, exclus et calculés ;
- état qualité ;
- indicateurs non calculables ;
- publication, absence de changement ou maintien du dernier état valide ;
- erreurs classées et étapes concernées ;
- durée par étape.

Les événements ne doivent pas exposer de données personnelles inutiles.

Les opérations sensibles, changements de règles, publications et préparations de saison suivent également `AUDIT-001`.

---

## 14. Configuration

Les paramètres administrables utilisent `AKS.Config`. Ils peuvent couvrir :

- saison active ;
- fournisseurs activés ;
- modes de recalcul autorisés ;
- seuils de qualité et de fréquentation ;
- publication des widgets ;
- modèles de saison ;
- formats d’export ;
- conservation des résultats ;
- taille des lots et limites d’exécution.

Une règle de calcul structurante n’est jamais modifiée comme simple valeur libre : elle possède un identifiant, une version, une date d’effet et une justification.

La configuration absente ou invalide échoue explicitement ; elle n’est pas remplacée par une supposition silencieuse.

---

## 15. Sécurité et autorisations

- toute exécution vérifie l’identité et le droit demandé ;
- les fournisseurs utilisent le moindre privilège ;
- les restitutions agrégées sont privilégiées ;
- les rapports nominatifs sont limités aux rôles autorisés ;
- les exports sensibles sont journalisés ;
- le fournisseur du tableau de bord filtre selon le contexte utilisateur ;
- aucune réponse détaillée du Questionnaire santé n’est accessible ;
- les identifiants techniques sont pseudonymisés lorsque possible.

---

## 16. Performance et limites Apps Script

L’orchestration doit :

- traiter par lots lorsque nécessaire ;
- éviter les lectures répétées d’une même source ;
- réutiliser les résultats valides ;
- contrôler le temps restant avant une étape coûteuse ;
- permettre la reprise après interruption ;
- sérialiser les publications concurrentes ;
- isoler les écritures de résultats ;
- éviter tout recalcul lors du simple affichage d’un widget.

Les limites de temps, quotas et verrous seront précisées lors de l’implémentation et couvertes par `ANALYTICS-006`.

---

## 17. Préparation automatisée d’une saison

Le déroulement de référence est :

1. valider les paramètres de saison ;
2. produire un plan sans mutation ;
3. contrôler noms, emplacements et collisions ;
4. demander ou vérifier l’autorisation requise ;
5. créer les ressources manquantes ;
6. appliquer modèles, métadonnées et permissions ;
7. vérifier chaque ressource créée ;
8. produire le journal de contrôle ;
9. retourner un bilan avec liens et anomalies.

La relance du même plan ne crée pas de doublon. Une ressource existante conforme est réutilisée ; une ressource divergente est signalée sans écrasement.

---

## 18. Contrats avec les interfaces

Les interfaces définies ultérieurement dans `ANALYTICS-004` consomment uniquement :

- les modèles de rapport publiés ;
- les états de qualité et de fraîcheur ;
- les références d’exports autorisés ;
- les commandes d’orchestration autorisées ;
- les états de traitement.

Elles ne manipulent pas les sources brutes et ne recalculent aucun indicateur.

---

## 19. Stratégie de tests attendue

`ANALYTICS-006` devra couvrir au minimum :

- ordre des étapes ;
- isolation source-cours ;
- distinctions absence, inconnu, annulé et non-éligible ;
- exactitude des indicateurs ;
- agrégations pondérées ;
- exclusion du cours féminin 2025-2026 ;
- score AKS désactivé ;
- idempotence ;
- recalcul ciblé ;
- publication atomique ;
- maintien du dernier résultat valide ;
- reprise après interruption ;
- préparation de saison sans écrasement ;
- intégration `DashboardProvider` sans calcul à l’affichage ;
- journalisation sans fuite de données.

---

## 20. Critères d’acceptation

`ANALYTICS-003` est accepté lorsque :

- chaque service possède une responsabilité explicite ;
- la chaîne Lecture → Normalisation → Validation → Calcul → Agrégation → Restitution → Publication est définie ;
- les objets d’échange internes sont identifiés ;
- les erreurs sont isolées par source et par cours ;
- les règles d’idempotence et de recalcul sont vérifiables ;
- la publication protège le dernier résultat valide ;
- les agrégations ne transforment pas les données absentes en valeurs nulles ;
- le cours féminin et le score AKS restent exclus conformément à `ANALYTICS-002` ;
- le Centre de pilotage ne contient aucun calcul métier ;
- la journalisation, l’audit, la configuration et le stockage transverses sont réutilisés ;
- la préparation de saison est sûre, contrôlée et non destructive ;
- les responsabilités des documents `ANALYTICS-004` à `ANALYTICS-006` restent préservées.

---

## 21. Décisions structurantes

1. `AnalyticsOrchestrator` coordonne mais ne calcule pas.
2. Les fournisseurs sont en lecture seule et versionnés.
3. La normalisation ne complète aucune valeur par supposition.
4. La qualité décide de l’éligibilité au calcul et à la publication.
5. Les rapports de cours validés précèdent la synthèse globale.
6. Une erreur locale ne bloque pas les périmètres indépendants.
7. Une publication échouée conserve le dernier état valide.
8. L’idempotence repose sur les versions de règles, le périmètre et les empreintes de sources.
9. `AnalyticsDashboardProvider` expose des résultats déjà publiés.
10. La préparation de saison ne remplace ni ne supprime une ressource existante.
11. Le cours féminin est exclu de toute la chaîne analytique 2025-2026.
12. Le score AKS reste désactivé sans formule validée.

---

## 22. Livrables suivants

Après validation des services :

- `ANALYTICS-004` définira les interfaces et restitutions ;
- `ANALYTICS-005` définira les contrats externes et formats de sources ;
- `ANALYTICS-006` définira la stratégie de validation.

Le développement applicatif commencera uniquement lorsque les prérequis documentaires décidés par la gouvernance seront validés.

---

## 23. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.1.0 | 2026-07-26 | Validation comme référence de développement et ouverture d’ANALYTICS-004 pour les interfaces et restitutions |
| 1.0.0 | 2026-07-26 | Création des services, de la chaîne d’orchestration, des règles d’isolation, d’idempotence, de publication et de préparation de saison |

---

## 24. Conclusion

Ce document établit une chaîne de traitement cohérente entre les sources et les restitutions. Il rend les calculs Analytics testables et traçables, protège les résultats valides et prépare l’implémentation sans déplacer les responsabilités vers les interfaces ou les services transverses.

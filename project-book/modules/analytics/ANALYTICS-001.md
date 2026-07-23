# ANALYTICS-001 — Vision et architecture du module AKS Analytics

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-001 |
| **Version** | 1.2.0 |
| **Statut** | Référence de développement |
| **Nature** | Vision et architecture fonctionnelle du module |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-23 |
| **Version du produit** | V1.1 |

---

## 1. Objet

Le présent document définit la vision, le périmètre et les principes d'architecture du module **AKS Analytics**.

AKS Analytics constitue le premier nouveau module métier engagé après la phase de consolidation d'AKS Platform V1.1. Il fournit un cadre commun pour collecter des données autorisées, calculer des indicateurs, produire des analyses et restituer des informations utiles au pilotage de l'association.

Ce document est le point d'entrée documentaire du module. Il ne définit pas encore le détail de chaque indicateur ni les écrans finaux.

---

## 2. Références applicables

AKS Analytics s'inscrit dans les référentiels suivants :

- `VISION-001` — vision d'AKS Platform ;
- `OBJECTIVES-001` — objectifs stratégiques ;
- `SCOPE-001` — périmètre fonctionnel ;
- `ROADMAP-001` — feuille de route officielle ;
- `GOV-001` — gouvernance produit ;
- `DOC-001` — règles générales de documentation ;
- `STD-001` — standard documentaire des modules métier ;
- `ARCH-001` — architecture fonctionnelle ;
- `CORE-001` — services communs d'AKS Core ;
- `API-001` — contrats et principes d'API ;
- `SECURITY-001` — sécurité ;
- `STORAGE-001` — stockage transverse ;
- `ERROR-001` — gestion des erreurs ;
- `LOG-001` — journalisation ;
- `AUDIT-001` — audit et traçabilité ;
- `CONFIG-001` — paramétrage centralisé ;
- `UX-001` — principes d'expérience utilisateur ;
- `UI-001` — contrat d'interface utilisateur ;
- `ADMIN-003` — Centre de pilotage ;
- `ADMIN-004` — contrat `DashboardProvider` et `DashboardWidget` ;
- `ADMIN-005` — validation et conformité du Centre de pilotage.

AKS Analytics applique ces référentiels sans redéfinir leurs responsabilités.

---

## 3. Positionnement dans AKS Platform

AKS Analytics est un module métier transversal de consultation et d'aide au pilotage.

Il ne devient pas propriétaire des données opérationnelles produites par les autres modules. Chaque module métier reste responsable de ses propres données, règles et contrôles.

AKS Analytics consomme uniquement des données exposées par des contrats autorisés, puis produit :

- des indicateurs ;
- des agrégats ;
- des tendances ;
- des comparaisons ;
- des tableaux de bord ;
- des rapports et exports autorisés.

Le module peut publier des widgets dans le Centre de pilotage via le contrat défini dans `ADMIN-004`.

---

## 4. Objectifs

AKS Analytics doit permettre de :

- disposer d'une vision consolidée de l'activité de l'association ;
- suivre les effectifs, la fréquentation et l'évolution des cours ;
- comparer des périodes, saisons, catégories ou groupes autorisés ;
- produire des analyses utiles à l'assemblée générale et au pilotage courant ;
- limiter les retraitements manuels et les fichiers statistiques isolés ;
- garantir la traçabilité des calculs ;
- préparer l'intégration progressive de nouvelles sources de données ;
- fournir des restitutions cohérentes avec les référentiels UX et UI.

---

## 5. Périmètre fonctionnel initial

Le premier périmètre d'AKS Analytics couvre prioritairement :

- les effectifs par cours et catégorie ;
- les taux de présence et d'assiduité ;
- les évolutions entre périodes ou saisons ;
- les répartitions démographiques autorisées ;
- les indicateurs de fidélisation et de renouvellement lorsque les données existent ;
- les comparaisons entre cours ;
- la consolidation globale de la saison ;
- la génération de rapports avec commentaires et graphiques ;
- l'export des données agrégées autorisées.

Le cours féminin peut être intégré à l'analyse globale à partir de ses effectifs, même lorsqu'aucun suivi détaillé des présences n'est disponible. Cette limite doit être explicitement visible dans les restitutions.

---

## 6. Hors périmètre initial

Ne relèvent pas du premier incrément :

- la modification des données sources depuis Analytics ;
- la gestion des inscriptions, licences, grades ou présences ;
- le stockage d'un duplicata complet des données métier ;
- l'analyse médicale ou l'exploitation des réponses détaillées du questionnaire santé ;
- l'intelligence artificielle prédictive ;
- les tableaux de bord publics ;
- les statistiques individuelles sensibles sans besoin validé ;
- la substitution aux outils métier responsables des données.

Toute extension de ce périmètre nécessite une décision documentée.

---

## 7. Principes d'architecture

### 7.1 Séparation des responsabilités

Les modules producteurs restent propriétaires de leurs données. AKS Analytics est responsable des règles de calcul, de consolidation et de restitution analytique.

### 7.2 Lecture seule des sources

AKS Analytics accède aux données métier en lecture seule. Il ne modifie jamais une source opérationnelle.

### 7.3 Contrats explicites

Toute source doit être accessible par un contrat documenté précisant au minimum :

- le fournisseur ;
- les données exposées ;
- le format ;
- la fréquence de disponibilité ;
- les règles de sécurité ;
- les limitations connues ;
- la version du contrat.

### 7.4 Agrégats maîtrisés

Le module peut stocker des agrégats, résultats de calcul, métadonnées de traitement et historiques nécessaires. Il ne doit pas répliquer sans justification les données métier détaillées.

### 7.5 Traçabilité

Chaque résultat analytique doit pouvoir être relié à :

- sa définition ;
- sa période ;
- ses sources ;
- sa date de calcul ;
- sa version de règle ;
- son éventuel niveau de qualité ou de complétude.

### 7.6 Tolérance aux sources incomplètes

Une donnée absente ou incomplète ne doit pas provoquer un résultat trompeur. Le module doit signaler les limites, neutraliser les calculs impossibles ou afficher un état explicite.

---

## 8. Sources de données

Les premières sources envisagées sont :

- feuilles de présence par cours ;
- référentiel des licenciés ;
- données de saison ;
- informations d'inscription autorisées ;
- résultats agrégés des futurs modules ;
- paramètres officiels de l'association.

Chaque source doit être évaluée avant intégration selon :

- sa fiabilité ;
- sa structure ;
- sa fraîcheur ;
- sa complétude ;
- sa sensibilité ;
- sa stabilité ;
- sa capacité à identifier une saison et un cours.

L'intégration d'une source non structurée ne doit pas imposer une dépendance durable à un format provisoire.

---

## 9. Flux fonctionnel de référence

Le flux analytique suit les étapes suivantes :

1. identification d'une source autorisée ;
2. lecture des données via un fournisseur ;
3. validation de structure et de qualité ;
4. normalisation des valeurs nécessaires ;
5. calcul des agrégats et indicateurs ;
6. stockage éventuel des résultats autorisés ;
7. restitution dans les tableaux de bord, rapports ou exports ;
8. journalisation du traitement et des anomalies.

Une erreur provenant d'une source ne doit pas bloquer les autres fournisseurs ni l'ensemble du Centre de pilotage.

---

## 10. Composants fonctionnels

AKS Analytics est organisé autour des responsabilités suivantes :

### 10.1 Fournisseurs de données

Ils exposent les données autorisées depuis les sources métier.

### 10.2 Service de normalisation

Il transforme les données reçues vers un modèle analytique stable sans altérer les sources.

### 10.3 Moteur d'indicateurs

Il applique les définitions et règles de calcul versionnées.

### 10.4 Référentiel analytique

Il conserve les définitions, métadonnées, périodes et résultats autorisés.

### 10.5 Service de restitution

Il fournit les tableaux, graphiques, widgets, commentaires et exports.

### 10.6 Contrôle de qualité

Il détecte les données manquantes, doublons, incohérences de période et limites de couverture.

---

## 11. Intégration avec le Centre de pilotage

AKS Analytics peut publier un ou plusieurs widgets selon `ADMIN-004`.

Un widget Analytics :

- reste déclaratif ;
- n'embarque pas le calcul métier complet ;
- affiche un résultat fourni par le service Analytics ;
- respecte les droits de l'utilisateur ;
- supporte les états chargement, vide, erreur, indisponible et succès ;
- peut être actualisé indépendamment ;
- ne bloque jamais le chargement du Centre de pilotage.

Les premiers widgets potentiels sont :

- effectif total de la saison ;
- assiduité moyenne ;
- évolution par rapport à la période précédente ;
- état de complétude des données ;
- accès au rapport global.

Cette liste n'est pas un engagement d'implémentation exhaustif.

---

## 12. Sécurité et confidentialité

AKS Analytics respecte le principe du moindre privilège.

Le module doit :

- contrôler les droits avant toute restitution ;
- éviter l'exposition de données personnelles non nécessaires ;
- privilégier les résultats agrégés ;
- empêcher la reconstitution d'informations sensibles à partir de petits groupes ;
- respecter les règles propres à chaque source ;
- ne jamais exploiter les réponses détaillées du questionnaire santé ;
- journaliser les accès ou exports sensibles lorsque requis.

Une restitution autorisée à un administrateur n'est pas automatiquement autorisée à un professeur ou à un utilisateur public.

---

## 13. Stockage

Le stockage éventuel d'AKS Analytics peut contenir :

- définitions d'indicateurs ;
- versions de règles de calcul ;
- périodes analytiques ;
- agrégats ;
- résultats de calcul ;
- métadonnées de provenance ;
- états de qualité ;
- journaux techniques conformes aux référentiels.

Le stockage ne doit pas devenir un second référentiel métier.

La durée de conservation des résultats et historiques sera définie dans les documents suivants du module.

---

## 14. Gestion des erreurs et qualité des données

Les erreurs sont classées au minimum en :

- source indisponible ;
- structure invalide ;
- donnée manquante ;
- donnée incohérente ;
- période non identifiable ;
- calcul impossible ;
- droit insuffisant ;
- erreur technique interne.

Le module doit distinguer une absence réelle d'activité d'une absence de données.

Les restitutions doivent pouvoir afficher un indicateur de complétude ou une mention de limitation lorsque cela est nécessaire à l'interprétation.

---

## 15. Paramétrage

Les éléments paramétrables doivent utiliser `CONFIG-001` lorsqu'ils sont transverses ou administrables.

Le paramétrage peut notamment couvrir :

- saison active ;
- périodes de comparaison ;
- seuils d'affichage ;
- activation de fournisseurs ;
- fréquence de recalcul ;
- formats d'export ;
- niveau de détail autorisé ;
- publication de widgets.

Les règles de calcul structurantes ne doivent pas être modifiées sans versionnement ni traçabilité.

---

## 16. Performance et actualisation

AKS Analytics doit privilégier :

- les calculs incrémentaux lorsque pertinents ;
- la réutilisation d'agrégats valides ;
- le chargement progressif des restitutions ;
- l'isolation des traitements coûteux ;
- l'actualisation indépendante des indicateurs ;
- l'absence de recalcul inutile à chaque affichage.

La fréquence de mise à jour doit être adaptée au besoin métier et à la fraîcheur réelle des sources.

---

## 17. Extensibilité

L'ajout d'un nouveau module producteur doit être possible sans modification du noyau d'AKS Analytics, sous réserve qu'il fournisse un contrat compatible.

L'ajout d'un indicateur doit être réalisé par définition et enregistrement explicites, sans duplication de logique dans les interfaces.

L'ajout d'un nouveau type de restitution ne doit pas modifier les sources métier.

---

## 18. Livrables documentaires suivants

Conformément à `STD-001`, le socle documentaire du module Analytics sera complété par :

- `ANALYTICS-002` — Modèle métier ;
- `ANALYTICS-003` — Services ;
- `ANALYTICS-004` — Interfaces ;
- `ANALYTICS-005` — Contrats externes ;
- `ANALYTICS-006` — Validation.

Les besoins documentaires propres au module seront traités, si leur responsabilité le justifie, dans des extensions numérotées à partir de `ANALYTICS-007`.

Les sujets suivants sont actuellement identifiés comme candidats à ces extensions, sans préjuger de leur création :

- catalogue et règles des indicateurs ;
- catalogue des graphiques et restitutions ;
- règles détaillées de qualité et de complétude des données.

Toute extension devra respecter les critères de création définis dans `DOC-001`.

---

## 19. Critères d'acceptation

`ANALYTICS-001` est accepté lorsque :

- le positionnement du module est explicite ;
- la séparation entre données métier et données analytiques est définie ;
- les sources initiales et leurs limites sont identifiées ;
- l'intégration avec AKS Core et le Centre de pilotage est définie ;
- les principes de sécurité, stockage, traçabilité et qualité sont posés ;
- l'extensibilité vers de nouveaux modules est garantie ;
- les documents suivants disposent d'un cadre conforme à `STD-001`.

---

## 20. Décisions structurantes

Les décisions suivantes sont figées par le présent document :

1. AKS Analytics est un consommateur en lecture seule des données métier.
2. Les modules producteurs restent propriétaires de leurs données.
3. Analytics privilégie les agrégats et résultats calculés plutôt que la duplication complète des sources.
4. Tout indicateur doit être défini, traçable et versionnable.
5. Toute limitation de qualité ou de couverture doit être visible dans la restitution.
6. L'intégration au Centre de pilotage respecte `ADMIN-004`.
7. Les données sensibles ne sont jamais exploitées au-delà du besoin validé.
8. Le socle documentaire du module respecte `STD-001`.

---

## 21. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.0 | 2026-07-23 | Alignement du socle documentaire Analytics sur STD-001 et ajout des références DOC-001 et STD-001 |
| 1.1.0 | 2026-07-23 | Version initiale de référence pour le développement du module |

---

## 22. Conclusion

AKS Analytics fournit à AKS Platform une capacité de pilotage fondée sur des données consolidées, traçables et compréhensibles, tout en préservant l'autonomie des modules métier.

Le présent document établit le cadre de référence nécessaire à la conception du modèle métier, des services, des interfaces, des contrats externes, de la validation et des éventuelles extensions documentaires du module.
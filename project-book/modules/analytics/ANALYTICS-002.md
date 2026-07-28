# ANALYTICS-002 — Modèle métier d’AKS Analytics

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-002 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Nature** | Modèle métier du module |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-26 |
| **Version du produit** | V1.2 |

---

## 1. Objet

Le présent document définit le modèle métier initial d’**AKS Analytics** : objets analysés, relations, règles de qualité, indicateurs et limites d’interprétation.

Il complète `ANALYTICS-001` sans définir les services techniques, les interfaces ni les contrats externes, qui relèvent respectivement d’`ANALYTICS-003`, `ANALYTICS-004` et `ANALYTICS-005`.

---

## 2. Périmètre de la saison 2025-2026

Les analyses détaillées et la synthèse globale couvrent exclusivement :

- Baby ;
- Enfant 1 ;
- Enfant 2 ;
- Ado/Adulte.

Le cours féminin est exclu de tous les calculs, comparaisons et agrégats de la saison 2025-2026, car aucun suivi détaillé et homogène des présences n’est disponible. Son effectif connu ne doit pas être ajouté à la population analytique globale.

Cette exclusion doit être mentionnée dans chaque restitution globale afin d’éviter de confondre absence d’activité et absence de données.

L’intégration du cours féminin est planifiée à partir de la saison 2026-2027, sous réserve qu’un suivi complet des séances et présences soit disponible et validé selon les mêmes règles de qualité que les autres cours.

---

## 3. Principes du modèle

1. Une donnée source reste sous la responsabilité de son producteur.
2. Analytics lit les sources sans les modifier.
3. Une saison constitue la frontière principale de calcul et de comparaison.
4. Un indicateur n’est publié que si son périmètre, sa formule, ses sources et sa qualité sont connus.
5. Une donnée absente est distinguée d’une absence réelle.
6. Toute exclusion de cours, séance, licencié ou période est explicite et traçable.
7. Les rapports détaillés par cours précèdent la synthèse globale.
8. Les indicateurs factuels restent prioritaires sur tout score composite.

---

## 4. Entités métier

### 4.1 Saison

Une **Saison** représente une période sportive identifiée, par exemple `2025-2026`.

Attributs minimaux :

- identifiant stable ;
- libellé ;
- date de début ;
- date de fin ;
- statut : préparation, active, clôturée ou archivée ;
- version des règles analytiques ;
- date du dernier calcul.

### 4.2 Cours

Un **Cours** représente un groupe pédagogique analysable pendant une saison.

Attributs minimaux :

- identifiant stable ;
- libellé ;
- tranche d’âge ou public ;
- statut actif ou exclu ;
- motif d’exclusion éventuel ;
- saison de rattachement.

Pour 2025-2026, les quatre cours inclus sont Baby, Enfant 1, Enfant 2 et Ado/Adulte.

### 4.3 Licencié analytique

Un **Licencié analytique** représente une personne rattachée à un cours pour la période analysée.

Attributs minimaux :

- identifiant pseudonymisé ou technique stable ;
- cours ;
- date d’entrée dans le périmètre ;
- date de sortie éventuelle ;
- nombre de séances éligibles ;
- nombre de présences ;
- nombre d’absences ;
- données démographiques strictement autorisées.

Les rapports nominatifs sont réservés aux utilisateurs autorisés. Les restitutions de pilotage privilégient les agrégats.

### 4.4 Séance

Une **Séance** représente une occurrence planifiée d’un cours.

Attributs minimaux :

- identifiant stable ;
- cours ;
- date ;
- statut : prévue, réalisée, annulée ou exclue ;
- nombre de licenciés éligibles ;
- nombre de présents ;
- niveau de complétude ;
- anomalie ou commentaire de qualité éventuel.

Une séance annulée n’entre pas dans le dénominateur des taux de présence.

### 4.5 Présence

Une **Présence** relie un licencié analytique à une séance réalisée.

Valeurs normalisées :

- présent ;
- absent ;
- non éligible ;
- inconnu.

La valeur `inconnu` ne doit jamais être automatiquement assimilée à une absence.

### 4.6 Période analytique

Une **Période analytique** est un sous-ensemble d’une saison utilisé pour les tendances et comparaisons : mois, trimestre, période pédagogique ou intervalle explicite.

Les périodes comparées doivent utiliser des règles compatibles et afficher toute différence de couverture.

### 4.7 Résultat analytique

Un **Résultat analytique** associe :

- un indicateur ;
- un périmètre ;
- une période ;
- une valeur ou un état non calculable ;
- les sources utilisées ;
- le taux de complétude ;
- la version de la règle ;
- la date de calcul ;
- les exclusions et avertissements applicables.

---

## 5. Relations principales

- une saison contient plusieurs cours ;
- un cours contient plusieurs séances ;
- un licencié analytique est rattaché à un cours pour une période déterminée ;
- une présence relie un licencié éligible à une séance réalisée ;
- une période analytique regroupe des séances d’une même saison ;
- un résultat analytique porte sur un licencié, un cours ou la population globale autorisée.

Un changement de cours en cours de saison doit être représenté par des rattachements datés, sans compter deux fois la même personne dans un agrégat global portant sur des individus uniques.

---

## 6. Règles d’éligibilité

Une séance est éligible lorsqu’elle est réalisée, rattachée sans ambiguïté à une saison et à un cours inclus, et que sa feuille de présence atteint le seuil de qualité requis.

Un licencié est éligible à une séance lorsqu’il appartient au cours à la date de cette séance et qu’aucune règle documentée ne l’exclut.

Les séances annulées, hors saison, en doublon ou sans cours identifiable sont exclues et journalisées.

Les entrées et sorties en cours de saison modifient le nombre de séances éligibles individuelles ; elles ne doivent pas pénaliser artificiellement l’assiduité.

---

## 7. Indicateurs factuels prioritaires

### 7.1 Effectifs

- **Effectif du cours** : nombre de licenciés uniques éligibles sur la période.
- **Effectif moyen par séance** : moyenne du nombre de présents aux séances éligibles.
- **Effectif maximal par séance** : maximum observé sur les séances éligibles.
- **Participation d’une séance** : présents / licenciés éligibles à la séance.

### 7.2 Assiduité

- **Taux individuel de présence** : présences / séances individuelles éligibles.
- **Taux moyen d’assiduité** : moyenne des taux individuels éligibles.
- **Taux médian d’assiduité** : médiane des taux individuels, privilégiée pour décrire le licencié type.
- **Répartition par niveaux d’assiduité** : distribution selon des seuils versionnés et paramétrables.

Les libellés initiaux proposés sont : très régulier, régulier, irrégulier et décrochage potentiel. Les seuils précis seront validés dans le catalogue des indicateurs avant implémentation.

### 7.3 Régularité et stabilité

- **Régularité** : dispersion des présences individuelles entre périodes comparables.
- **Évolution mensuelle de fréquentation** : variation du taux ou de l’effectif moyen entre mois.
- **Stabilité du cours** : évolution de la participation entre périodes de la saison.
- **Séances faiblement ou fortement fréquentées** : part des séances franchissant des seuils versionnés.

Aucun seuil métier ne doit être codé en dur avant validation.

### 7.4 Signaux de décrochage

- **Absences consécutives** : plus longue série d’absences connues sur des séances éligibles.
- **Décrochage potentiel** : signal déclenché selon un seuil documenté ; il ne constitue ni un diagnostic ni une sanction.
- **Évolution individuelle** : différence du taux de présence entre deux périodes comparables.

Ces indicateurs servent à attirer l’attention d’un responsable autorisé et doivent toujours conserver leur contexte.

### 7.5 Fidélité et renouvellement

La fidélité ou le renouvellement mesure la présence d’un même licencié sur plusieurs saisons, uniquement lorsqu’un historique fiable et une règle d’appariement autorisée existent.

Pour une seule saison ou sans historique suffisamment fiable, l’indicateur est affiché comme **non calculable** et n’est pas estimé à partir de l’assiduité.

### 7.6 Complétude

- **Complétude des séances** : séances exploitables / séances attendues.
- **Complétude des présences** : statuts connus / statuts attendus.
- **Couverture du rapport** : population et période réellement incluses par rapport au périmètre attendu.

Chaque rapport affiche son niveau de complétude et ses exclusions avant les conclusions.

---

## 8. Score AKS

Le **score AKS** est un indicateur composite secondaire et expérimental.

Il ne peut être utilisé que si :

- ses composantes et pondérations sont publiées ;
- chaque composante est elle-même calculable et suffisamment complète ;
- la valeur peut être expliquée à partir d’indicateurs factuels ;
- il n’est pas utilisé pour classer publiquement les licenciés ni prendre seul une décision.

Tant que sa formule n’est pas validée dans un catalogue d’indicateurs versionné, le score AKS reste désactivé et ne figure pas dans les conclusions principales.

---

## 9. Rapports

Le module produit d’abord quatre rapports séparés et harmonisés :

1. Baby ;
2. Enfant 1 ;
3. Enfant 2 ;
4. Ado/Adulte.

Chaque rapport présente au minimum :

- périmètre et qualité des données ;
- effectifs ;
- fréquentation des séances ;
- assiduité moyenne et médiane ;
- répartition des profils d’assiduité ;
- évolution mensuelle ;
- absences consécutives et signaux à examiner ;
- limites d’interprétation ;
- graphiques et commentaires fondés sur les valeurs calculées.

La synthèse globale est produite uniquement après validation des quatre rapports. Elle agrège les populations compatibles sans introduire le cours féminin pour 2025-2026 et rappelle explicitement cette exclusion.

---

## 10. Qualité et complétude

Les contrôles minimaux portent sur :

- structure et colonnes attendues ;
- saison et cours identifiables ;
- dates valides et comprises dans la saison ;
- doublons de séances ou de présences ;
- statuts inconnus ;
- cohérence entre effectifs, séances et présences ;
- entrées et sorties en cours de saison ;
- séances annulées ;
- couverture temporelle ;
- taux de complétude.

Un résultat est soit calculé, soit non calculable, soit calculé avec avertissement. Il ne doit jamais être remplacé silencieusement par zéro.

Les anomalies sont journalisées avec leur source, leur portée et leur impact sur les indicateurs.

---

## 11. Préparation d’une nouvelle saison

La préparation automatisée d’une saison doit créer de manière contrôlée :

- le dossier de saison ;
- les sous-dossiers nécessaires ;
- les feuilles de suivi par cours ;
- les structures de données et en-têtes versionnés ;
- les permissions attendues ;
- les paramètres de saison ;
- le journal de contrôle de l’opération.

L’opération doit être idempotente ou détecter explicitement les ressources existantes. Elle ne doit ni écraser une saison existante ni accorder de droits supplémentaires sans validation.

Pour 2026-2027, la préparation doit inclure le cours féminin afin de rendre possible son intégration future, mais son inclusion analytique restera conditionnée par la validation de la qualité des données collectées.

---

## 12. Confidentialité

Le modèle applique la minimisation des données.

- les agrégats sont privilégiés ;
- les données nominatives ne sont accessibles qu’aux rôles autorisés ;
- les petits groupes ne doivent pas permettre une réidentification injustifiée ;
- aucune donnée médicale ni réponse détaillée du Questionnaire santé n’est utilisée ;
- les exports sensibles sont contrôlés et journalisés ;
- les durées de conservation sont définies avant implémentation.

---

## 13. Limites connues

Pour 2025-2026 :

- le cours féminin est entièrement exclu ;
- les comparaisons intersaisons dépendent de la disponibilité d’historiques fiables ;
- fidélité et renouvellement peuvent être non calculables ;
- les conclusions dépendent de la complétude réelle des feuilles de présence ;
- les seuils des profils, alertes et séances atypiques restent à valider ;
- le score AKS reste désactivé jusqu’à validation de sa formule.

---

## 14. Critères d’acceptation

`ANALYTICS-002` est accepté lorsque :

- les entités et relations sont définies sans dépendre d’un format provisoire ;
- les règles d’éligibilité distinguent absence, annulation, non-éligibilité et donnée inconnue ;
- les quatre cours inclus en 2025-2026 sont explicitement identifiés ;
- le cours féminin est exclu de tous les calculs 2025-2026 et planifié pour 2026-2027 ;
- chaque famille d’indicateurs dispose d’une définition et d’une limite d’usage ;
- la complétude conditionne l’interprétation des résultats ;
- le score AKS reste secondaire, explicable et désactivé sans formule validée ;
- les quatre rapports séparés précèdent la synthèse globale ;
- la préparation d’une nouvelle saison est cadrée sans risque d’écrasement ;
- les exigences de confidentialité sont respectées.

---

## 15. Décisions structurantes

1. Le périmètre Analytics 2025-2026 contient uniquement Baby, Enfant 1, Enfant 2 et Ado/Adulte.
2. Le cours féminin n’entre dans aucun agrégat 2025-2026.
3. Son intégration est préparée pour 2026-2027 sous condition de données complètes.
4. Les indicateurs factuels et la qualité des données priment sur les scores composites.
5. La médiane complète la moyenne pour décrire l’assiduité.
6. Les absences consécutives sont un signal contextualisé, non un diagnostic.
7. Fidélité et renouvellement restent non calculables sans historique fiable.
8. Toute formule, pondération ou seuil structurant est versionné.
9. La synthèse globale est dérivée des rapports par cours validés.
10. Une valeur inconnue n’est jamais assimilée silencieusement à zéro ou à une absence.

---

## 16. Livrables suivants

Après validation du modèle métier :

- `ANALYTICS-003` définira les services et règles d’orchestration ;
- `ANALYTICS-004` définira les interfaces et restitutions ;
- `ANALYTICS-005` définira les contrats externes et formats de sources ;
- `ANALYTICS-006` définira la stratégie de validation.

Un catalogue détaillé et versionné des indicateurs et seuils pourra être créé à partir d’`ANALYTICS-007` si sa responsabilité justifie un document distinct.

---

## 17. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.1.0 | 2026-07-26 | Validation du modèle métier comme référence de développement et ouverture d’ANALYTICS-003 |\n| 1.0.0 | 2026-07-25 | Création du modèle métier initial, exclusion du cours féminin en 2025-2026 et intégration des indicateurs validés |

---

## 18. Conclusion

Ce modèle fournit une base explicable et vérifiable pour AKS Analytics. Il permet de construire les services sur des règles stables, sans fausser les résultats par des données absentes et sans confondre un signal de pilotage avec une décision automatique.

# ANALYTICS-007 — Catalogue des indicateurs et règles de calcul

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-007 |
| **Version** | 1.0.0 |
| **Statut** | Référence de développement |
| **Nature** | Catalogue versionné des indicateurs et règles de calcul |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-26 |
| **Version du produit** | V1.2 |

---

## 1. Objet

Le présent document définit les indicateurs calculables dans la première version d’AKS Analytics, leurs formules exactes, leurs périmètres, leurs règles d’agrégation et leurs états de qualité.

Il complète `ANALYTICS-001` à `ANALYTICS-006` et constitue la référence normative du moteur d’indicateurs. Une formule, un seuil ou une règle d’agrégation non définis ici ne doivent pas être inventés dans le code.

---

## 2. Références applicables

Le catalogue applique notamment :

- `ANALYTICS-001` — vision et architecture ;
- `ANALYTICS-002` — modèle métier ;
- `ANALYTICS-003` — services et orchestration ;
- `ANALYTICS-004` — interfaces et restitutions ;
- `ANALYTICS-005` — contrats de sources ;
- `ANALYTICS-006` — validation et jeux d’or ;
- `CONFIG-001` — paramétrage centralisé ;
- `LOG-001` — journalisation ;
- `AUDIT-001` — audit et traçabilité.

---

## 3. Périmètre de la V1

### 3.1 Indicateurs activés

La V1 active uniquement :

1. la participation d’une séance ;
2. l’assiduité individuelle ;
3. leurs agrégations explicites par cours et globales.

### 3.2 Indicateurs non calculables

Les indicateurs suivants sont connus mais désactivés faute de formule ou d’historique validés :

- régularité ;
- stabilité ;
- fidélité.

Ils retournent l’état `NON_CALCULABLE`, sans valeur estimée ni formule de substitution.

### 3.3 Indicateur exclu

Le score AKS est exclu de la V1 :

- aucune formule ;
- aucun calcul ;
- aucun stockage ;
- aucun affichage ;
- aucune utilisation dans un commentaire ou une décision.

---

## 4. Statuts de présence et contribution aux calculs

| Statut | Numérateur | Dénominateur | Couverture | Règle |
|---|---:|---:|---:|---|
| `PRESENT` | Oui | Oui | Connu | Présence constatée |
| `ABSENT` | Non | Oui | Connu | Absence constatée |
| `EXCUSE` | Non | Oui | Connu | Absence excusée, comptée séparément |
| `NON_RENSEIGNE` | Non | Non | Inconnu | Ne devient jamais une absence |
| `NON_ELIGIBLE` | Non | Non | Hors périmètre | Ne participe à aucun calcul |

Une séance annulée, prévue mais non réalisée, exclue ou hors périmètre ne contribue à aucun numérateur ni dénominateur.

---

## 5. Contrat commun d’un résultat

Chaque résultat d’indicateur expose au minimum :

- `indicator_id` ;
- `rule_version` ;
- `scope_type` et `scope_id` ;
- saison et période ;
- `value`, ou `null` si non calculable ;
- `numerator` ;
- `denominator` ;
- `expected_count` ;
- `known_count` ;
- `coverage_rate` ;
- `status` ;
- diagnostics, exclusions et avertissements ;
- date de calcul et références de sources.

Les états autorisés sont :

| État | Condition |
|---|---|
| `VALIDE` | Dénominateur strictement positif et couverture complète |
| `PARTIEL` | Dénominateur strictement positif mais couverture incomplète |
| `NON_CALCULABLE` | Dénominateur nul, données minimales absentes, indicateur désactivé ou périmètre incompatible |

Une valeur nulle n’est jamais remplacée par zéro.

---

## 6. IND-PARTICIPATION-001 — Participation d’une séance

### 6.1 Définition

La participation mesure la part des licenciés éligibles dont la présence est connue et constatée pour une séance réalisée.

### 6.2 Formule

[
Participation = \frac{Nombre\ de\ statuts\ PRESENT}{Nombre\ de\ statuts\ connus\ des\ licenciés\ éligibles}
]

Les statuts connus sont `PRESENT`, `ABSENT` et `EXCUSE`.

### 6.3 Couverture

[
Couverture = \frac{Nombre\ de\ statuts\ connus}{Nombre\ de\ licenciés\ éligibles\ attendus}
]

### 6.4 Conditions

- la séance doit être `REALISEE` et exploitable ;
- le cours et la saison doivent être inclus ;
- au moins un statut connu doit exister pour calculer une valeur ;
- si la couverture est inférieure à 100 %, le résultat est `PARTIEL` ;
- si aucun statut connu n’existe, le résultat est `NON_CALCULABLE`.

### 6.5 Données conservées

Le résultat conserve séparément :

- présents ;
- absents ;
- excusés ;
- non renseignés ;
- licenciés éligibles attendus ;
- statuts connus ;
- taux de couverture.

---

## 7. IND-ASSIDUITE-001 — Assiduité individuelle

### 7.1 Définition

L’assiduité individuelle mesure la part des séances éligibles d’un licencié pour lesquelles une présence connue a été constatée.

### 7.2 Formule

[
Assiduité = \frac{Nombre\ de\ statuts\ PRESENT}{Nombre\ de\ statuts\ connus\ sur\ les\ séances\ éligibles}
]

### 7.3 Couverture

[
Couverture = \frac{Nombre\ de\ statuts\ connus}{Nombre\ de\ séances\ individuelles\ éligibles\ attendues}
]

### 7.4 Conditions

- seules les séances réalisées et exploitables sont attendues ;
- les séances antérieures à l’entrée ou postérieures à la sortie du licencié sont `NON_ELIGIBLE` ;
- une cellule vide ou inconnue reste `NON_RENSEIGNE` ;
- si au moins un statut est connu mais que la couverture est incomplète, le résultat est `PARTIEL` ;
- si aucun statut connu n’existe, le résultat est `NON_CALCULABLE`.

### 7.5 Données conservées

Le résultat conserve séparément :

- présences ;
- absences ;
- absences excusées ;
- statuts non renseignés ;
- séances éligibles attendues ;
- séances connues ;
- taux de couverture.

---

## 8. Agrégations

### 8.1 Principe impératif

Une agrégation est calculée à partir de la somme des numérateurs et de la somme des dénominateurs compatibles.

Elle n’est jamais obtenue par une moyenne simple des pourcentages déjà calculés.

### 8.2 Participation d’un cours

Pour un cours et une période :

[
Participation_{cours} =
\frac{\sum Présents_{séances}}
{\sum Statuts\ connus_{séances}}
]

Les séances non calculables ne fournissent aucun dénominateur. Leur absence de couverture reste visible dans les diagnostics du cours.

### 8.3 Assiduité d’un cours

Pour un cours et une période :

[
Assiduité_{cours} =
\frac{\sum Présences_{licenciés}}
{\sum Statuts\ connus_{licenciés}}
]

Chaque présence admissible ne doit contribuer qu’une fois. Les doublons et conflits sont traités avant le calcul selon le contrat de consolidation.

### 8.4 Synthèse globale

La synthèse globale additionne uniquement les numérateurs et dénominateurs des cours compatibles et inclus.

Elle doit :

- indiquer le nombre de cours attendus et couverts ;
- être `PARTIEL` si un cours attendu est absent, en erreur ou incomplet ;
- conserver les diagnostics de chaque cours ;
- ne jamais présenter une couverture partielle comme complète.

### 8.5 Périmètre 2025-2026

Pour 2025-2026, seuls les cours suivants participent aux calculs détaillés et globaux :

- Baby ;
- Enfant 1 ;
- Enfant 2 ;
- Ado/Adulte.

Le cours féminin est totalement exclu des numérateurs, dénominateurs, effectifs et comparaisons. Chaque restitution globale mentionne explicitement cette exclusion.

Son intégration à partir de 2026-2027 reste conditionnée par la disponibilité et la validation d’un suivi complet et homogène.

---

## 9. Précision et arrondi

- les calculs utilisent les nombres entiers sources et conservent la valeur non arrondie ;
- aucune étape intermédiaire n’est arrondie ;
- le pourcentage est affiché avec une décimale ;
- la règle d’affichage ne modifie jamais la valeur de référence ;
- les tests comparent numérateur et dénominateur exactement ;
- aucune tolérance ne masque une divergence de dénominateur.

---

## 10. Diagnostics minimaux

Les résultats exposent au minimum, lorsqu’ils s’appliquent :

- couverture incomplète ;
- donnée non renseignée ;
- dénominateur nul ;
- séance exclue ou annulée ;
- licencié non éligible ;
- cours exclu ;
- cours en erreur ;
- périmètre global incomplet ;
- règle désactivée ;
- historique intersaisons insuffisant.

Un diagnostic décrit un fait et son impact. Il ne transforme pas une donnée et ne produit pas de jugement sur un licencié.

---

## 11. Indicateurs désactivés

### 11.1 Régularité

État : `NON_CALCULABLE`.

Aucune mesure de dispersion, aucun seuil et aucune périodicité ne sont validés. Le moteur ne doit pas dériver une régularité à partir de l’assiduité.

### 11.2 Stabilité

État : `NON_CALCULABLE`.

Aucune période de comparaison ni formule de variation ne sont validées. Le moteur ne doit pas assimiler stabilité et participation moyenne.

### 11.3 Fidélité

État : `NON_CALCULABLE`.

La fidélité exige un historique intersaisons fiable et une règle d’appariement autorisée. Elle ne doit jamais être estimée depuis la seule saison 2025-2026 ou depuis l’assiduité.

---

## 12. Règles de commentaire et de restitution

Les restitutions peuvent décrire :

- la valeur calculée ;
- son numérateur et son dénominateur ;
- la couverture ;
- les exclusions ;
- les limites connues ;
- l’évolution uniquement lorsqu’une formule distincte est ultérieurement validée.

Elles ne doivent pas :

- inventer une cause ;
- poser un diagnostic ;
- convertir `NON_RENSEIGNE` en absence ;
- afficher un indicateur désactivé ;
- classer publiquement les licenciés ;
- masquer une couverture partielle.

---

## 13. Versionnement

La version de règle initiale est `analytics-indicators/1.0.0`.

Toute modification de formule, de contribution d’un statut, de périmètre ou de règle d’agrégation exige :

1. une nouvelle version du catalogue ;
2. une nouvelle version de règle ;
3. l’adaptation des jeux d’or ;
4. des tests de non-régression ;
5. la traçabilité des résultats recalculés.

Une modification de présentation sans effet sur le calcul ne change pas nécessairement la version majeure de la règle.

---

## 14. Cas de test obligatoires

### 14.1 Participation

- séance complète avec présents, absents et excusés ;
- séance avec `NON_RENSEIGNE` produisant `PARTIEL` ;
- séance sans statut connu produisant `NON_CALCULABLE` ;
- séance annulée hors calcul ;
- licencié non éligible hors calcul.

### 14.2 Assiduité

- licencié éligible toute la période ;
- arrivée en cours de saison ;
- départ en cours de saison ;
- statuts `EXCUSE` comptés au dénominateur ;
- valeurs `NON_RENSEIGNE` hors dénominateur avec couverture réduite ;
- aucune valeur connue produisant `NON_CALCULABLE`.

### 14.3 Agrégations

- agrégation pondérée différente d’une moyenne simple ;
- résultat partiel multi-cours ;
- exclusion complète du cours féminin 2025-2026 ;
- absence de double comptage ;
- ordre d’entrée sans effet sur le résultat ;
- résultat profondément immuable.

### 14.4 Désactivations

- régularité `NON_CALCULABLE` ;
- stabilité `NON_CALCULABLE` ;
- fidélité `NON_CALCULABLE` ;
- score AKS absent de tout résultat et de toute restitution.

Les cas s’appuient prioritairement sur `GOLD-001`, `GOLD-002`, `GOLD-003`, `GOLD-004` et `GOLD-006` définis dans `ANALYTICS-006`.

---

## 15. Critères d’acceptation

`ANALYTICS-007` est accepté lorsque :

- participation et assiduité disposent d’une formule exacte ;
- chaque statut de présence a une contribution non ambiguë ;
- `NON_RENSEIGNE` ne devient jamais une absence ;
- les résultats incomplets sont `PARTIEL` et exposent leur couverture ;
- un dénominateur nul produit `NON_CALCULABLE` ;
- les agrégations utilisent les numérateurs et dénominateurs cumulés ;
- la précision et l’arrondi sont définis ;
- régularité, stabilité et fidélité restent `NON_CALCULABLE` ;
- le score AKS est exclu ;
- le cours féminin est exclu des calculs 2025-2026 ;
- les cas de test nécessaires à l’implémentation sont définis.

---

## 16. Décisions structurantes

1. Seules la participation et l’assiduité sont activées en V1.
2. `PRESENT`, `ABSENT` et `EXCUSE` sont des statuts connus.
3. `EXCUSE` contribue au dénominateur, mais pas au numérateur.
4. `NON_RENSEIGNE` est hors numérateur et hors dénominateur.
5. `NON_ELIGIBLE` est hors calcul.
6. Toute couverture incomplète est visible et produit un état `PARTIEL` lorsqu’une valeur reste calculable.
7. Les agrégations sont pondérées par les dénominateurs.
8. Régularité, stabilité et fidélité sont `NON_CALCULABLE`.
9. Le score AKS est exclu.
10. Le cours féminin est totalement exclu du périmètre analytique 2025-2026.

---

## 17. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-26 | Création du catalogue V1 ; activation de la participation et de l’assiduité ; désactivation de la régularité, de la stabilité et de la fidélité ; exclusion du score AKS |

---

## 18. Conclusion

Ce catalogue fournit au moteur d’indicateurs un contrat calculable, explicable et testable. Il autorise la reprise du quatrième incrément applicatif sans inventer de formule et garantit que toute limite de couverture reste visible dans les résultats.

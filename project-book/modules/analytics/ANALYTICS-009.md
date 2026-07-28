# ANALYTICS-009 — Guide d’alimentation Google Sheets V1.2.0

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-009 |
| **Version** | 1.0.0 |
| **Statut** | Validé |
| **Nature** | Guide d’exploitation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | V1.2.0 |

---

## 1. Objet

Ce guide décrit la saisie manuelle des données consommées par AKS Analytics V1.2.0 dans les classeurs Google Sheets de la saison 2026-2027.

Il documente l’implémentation effectivement publiée au tag applicatif `v1.2.0`, notamment `AnalyticsSheetsProvider.gs`. Le fournisseur lit les classeurs en lecture seule : Analytics ne corrige et ne complète jamais les sources.

Un classeur distinct est utilisé pour chaque cours :

- `BABY` ;
- `ENFANT_1` ;
- `ENFANT_2` ;
- `ADO_ADULTE` ;
- `FEMININ` à partir de 2026-2027.

## 2. Structure réellement lue en V1.2.0

Quatre feuilles sont obligatoires et leurs noms, accents et en-têtes doivent être conservés exactement :

| Feuille | Rôle | Saisie |
|---|---|---|
| `Configuration` | Identifie la saison, le cours et la version du modèle | Administration uniquement |
| `Licenciés` | Référentiel des personnes suivies dans le cours | Manuelle |
| `Séances` | Liste et état des séances | Manuelle |
| `Présences` | Statut d’un licencié pour une séance | Manuelle |
| `Contrôle` | Contrôles visibles éventuels | Facultative, non lue par Analytics |
| `Tableau de bord` | Restitution éventuelle | Facultative, non lue par Analytics |

Les feuilles `_Metadata`, `Licencies`, `Inscriptions`, `Seances`, `Presences`, `Import_Log` et `Readme` décrites comme structure cible dans `ANALYTICS-005` ne sont pas consommées par le fournisseur Sheets de la V1.2.0. Elles ne doivent pas être utilisées pour alimenter la version déployée.

## 3. Feuille `Configuration`

Les colonnes obligatoires sont `Clé` et `Valeur`.

| Clé | Valeur attendue |
|---|---|
| `saison` | `2026-2027` |
| `code_cours` | Code exact du classeur |
| `version_modele` | `1.0` |

Ne pas modifier cette feuille lors de la saisie courante. Une incohérence de saison, de cours ou de version place tout le classeur en erreur.

## 4. Feuille `Licenciés`

En-têtes utilisés :

| Colonne | Règle |
|---|---|
| `ID licencié` | Obligatoire, stable, unique, format `LIC-xxxxxx` |
| `Numéro licence FFK` | Facultatif ; s’il est renseigné, huit chiffres |
| `Nom` | Recommandé pour l’exploitation humaine |
| `Prénom` | Recommandé pour l’exploitation humaine |
| `Date entrée` | Obligatoire pour déterminer l’éligibilité |
| `Date sortie` | Facultative ; vide si la personne reste inscrite |

Les dates sont de vraies dates Google Sheets. L’ID licencié ne doit jamais être réutilisé pour une autre personne ni modifié après le début du suivi.

## 5. Feuille `Séances`

En-têtes obligatoires :

| Colonne | Règle |
|---|---|
| `ID séance` | Identifiant stable et unique |
| `Date séance` | Date réelle de la séance |
| `État` | `REALISEE`, `ANNULEE` ou `EXCLUE` |

Seules les séances `REALISEE` contribuent aux indicateurs. Les présences liées à une séance `ANNULEE` ou `EXCLUE` sont ignorées.

## 6. Feuille `Présences`

En-têtes obligatoires :

| Colonne | Règle |
|---|---|
| `Saison` | `2026-2027` |
| `Cours` | Code exact du cours |
| `Date séance` | Doit correspondre à une date de `Séances` |
| `ID licencié` | Doit exister dans `Licenciés` |
| `Statut` | Valeur autorisée ci-dessous |

Valeurs autorisées :

| Statut | Signification |
|---|---|
| `PRESENT` | Licencié présent |
| `ABSENT` | Licencié absent et éligible |
| `EXCUSE` | Absence excusée |
| `NON_RENSEIGNE` | Présence non encore renseignée |
| `NON_ELIGIBLE` | Personne hors période d’inscription |

Une cellule de statut vide est interprétée comme `NON_RENSEIGNE`, jamais comme `ABSENT`. Il est néanmoins recommandé de saisir explicitement le statut afin de rendre la couverture contrôlable.

## 7. Procédure de saisie actuelle

### Avant le début de saison

1. vérifier `Configuration` dans chaque classeur ;
2. renseigner la liste initiale dans `Licenciés` ;
3. préparer les séances connues dans `Séances` ;
4. ne pas modifier les noms des feuilles ni les en-têtes.

### Pour chaque séance

1. vérifier ou créer la ligne dans `Séances` ;
2. utiliser l’état `REALISEE`, `ANNULEE` ou `EXCLUE` ;
3. créer dans `Présences` une ligne par licencié concerné ;
4. renseigner explicitement le statut ;
5. contrôler les dates et identifiants avant de lancer Analytics.

### En cours de saison

- ajouter les nouveaux licenciés sans modifier les IDs existants ;
- renseigner `Date sortie` lorsqu’une inscription prend fin ;
- ne jamais supprimer l’historique de présence ;
- corriger une erreur dans la ligne concernée, sans créer de statut contradictoire.

## 8. Contrôle avant Analytics

Avant la prévisualisation ou la publication :

- les cinq classeurs attendus pour 2026-2027 sont configurés dans l’administration ;
- chaque classeur possède les quatre feuilles obligatoires ;
- les métadonnées correspondent au cours et à la saison ;
- les IDs licenciés sont présents, uniques et au bon format ;
- chaque date de présence correspond à une séance ;
- les statuts utilisent uniquement les valeurs autorisées ;
- les cellules vides ne sont pas considérées comme des absences ;
- aucune séance annulée ou exclue n’est attendue dans les calculs.

L’écran Analytics doit être utilisé d’abord en diagnostic et prévisualisation. Une publication Drive ne doit être confirmée qu’après contrôle du périmètre et des anomalies.

## 9. Limites de la V1.2.0

La V1.2.0 ne propose pas encore :

- d’interface graphique de saisie des présences ;
- de création guidée des séances depuis l’application ;
- de gestion des professeurs, assistants et affectations aux cours ;
- de contrôle d’accès par rôle sur la saisie ;
- de synchronisation automatique depuis un référentiel des licenciés.

La saisie directe dans Google Sheets est donc une solution transitoire. Le prochain chantier doit concevoir une interface mobile/tablette, puis intégrer les rôles et droits avec des contrôles côté serveur.

## 10. Références

- `ANALYTICS-005` — contrats externes et format cible ;
- `ANALYTICS-008` — bilan d’implémentation et recette ;
- tag applicatif `v1.2.0` ;
- `docs/features/ANALYTICS-013-Modele-et-fournisseur-Sheets.md` ;
- `src/modules/analytics/AnalyticsSheetsProvider.gs`.

## 11. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-28 | Création du guide conforme au fournisseur Google Sheets réellement publié en V1.2.0 et explicitation de l’écart avec la structure cible d’ANALYTICS-005 |

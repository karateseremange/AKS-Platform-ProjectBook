# ANALYTICS-005 — Contrats externes et formats des sources

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-005 |
| **Version** | 1.1.0 |
| **Statut** | Référence de développement |
| **Nature** | Contrats externes, formats de sources et règles d’import |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-26 |
| **Version du produit** | V1.2 |

---

## 1. Objet

Le présent document définit les contrats d’entrée d’**AKS Analytics**. Il permet de lire les fichiers historiques 2025-2026 sans les modifier et fixe le format standard à utiliser à partir de 2026-2027.

Il formalise :

- les sources autorisées ;
- les colonnes, identifiants et codes attendus ;
- la conversion vers le modèle normalisé d’`ANALYTICS-002` ;
- les contrôles d’import et les rapports d’anomalies ;
- la préparation non destructive d’une nouvelle saison ;
- la compatibilité entre le format historique et le format cible.

Analytics recalcule tous ses résultats depuis les données élémentaires. Les formules, pourcentages, graphiques et tableaux de bord contenus dans les fichiers sources ne constituent jamais une référence de calcul.

---

## 2. Références applicables

Le document applique notamment :

- `ANALYTICS-001` — vision et architecture ;
- `ANALYTICS-002` — modèle métier ;
- `ANALYTICS-003` — services et orchestration ;
- `ANALYTICS-004` — interfaces et restitutions ;
- `STORAGE-001` — stockage transverse ;
- `SECURITY-001` — sécurité ;
- `CONFIG-001` — paramétrage ;
- `LOG-001` et `AUDIT-001` — journalisation et traçabilité ;
- `STD-001` — standard documentaire des modules.

---

## 3. Principes directeurs

1. Les sources opérationnelles sont lues en lecture seule.
2. Une cellule vide n’est jamais transformée automatiquement en absence.
3. Une donnée non éligible est distinguée d’une donnée non renseignée.
4. Les résultats existants dans les fichiers sources sont ignorés et recalculés.
5. Toute conversion vers le modèle normalisé est explicite, déterministe et versionnée.
6. Une anomalie locale n’empêche pas l’import des données indépendantes valides.
7. Aucun rejet n’est silencieux.
8. Le contrat historique reste isolé du contrat standard.
9. Le moteur Analytics consomme uniquement le modèle normalisé.
10. La préparation d’une saison ne remplace ni ne supprime une ressource existante.
11. Les données personnelles sont limitées au besoin métier et protégées par les autorisations existantes.
12. Le cours féminin est exclu de tout import Analytics 2025-2026.

---

## 4. Périmètre des contrats

Deux adaptateurs sont définis :

| Contrat | Saison | Finalité |
|---|---|---|
| `HISTORICAL_ATTENDANCE_V1` | 2025-2026 | Lire les quatre fichiers existants sans modification |
| `STANDARD_ATTENDANCE_V1` | À partir de 2026-2027 | Alimenter Analytics avec des fichiers homogènes et contrôlables |

Les deux adaptateurs produisent les mêmes objets normalisés : saison, cours, licencié, inscription au cours, séance et présence.

---

## 5. Contrat historique 2025-2026

### 5.1 Sources couvertes

Le périmètre comprend un fichier distinct pour chacun des cours suivants :

- Baby ;
- Enfant 1 ;
- Enfant 2 ;
- Ado/Adulte.

Le cours féminin n’est ni lu, ni agrégé, ni compté dans la synthèse 2025-2026.

### 5.2 Feuilles reconnues

L’adaptateur accepte :

- une feuille `Adhérents` ;
- les feuilles mensuelles de présence ;
- une feuille `Dashboard`, ignorée pour les calculs ;
- l’indication historique du nombre de cours mensuels en `B1`, utilisée uniquement après validation de cohérence.

Une feuille inconnue produit un avertissement et n’est pas interprétée automatiquement.

### 5.3 Codes historiques

| Valeur source | État normalisé | Effet |
|---|---|---|
| `P` | `PRESENT` | Présence comptabilisée |
| `A` | `ABSENT` | Absence comptabilisée si la personne est éligible |
| `E` | `EXCUSE` | Absence excusée, conservée séparément |
| cellule vide | `NON_RENSEIGNE` | Ne vaut jamais absence |
| hors période d’inscription | `NON_ELIGIBLE` | Exclu du dénominateur |
| code inconnu | `INVALID` | Rejet local et anomalie explicite |

Les variantes de casse et espaces périphériques peuvent être normalisées. Toute autre correction doit être signalée.

### 5.4 Population et éligibilité

L’adaptateur distingue :

- le panel annuel issu d’`Adhérents` ;
- la population effectivement présente dans chaque feuille mensuelle ;
- la date d’entrée ;
- la date de sortie lorsqu’elle est connue ;
- l’éligibilité à chaque séance.

Une séance antérieure à l’entrée ou postérieure à la sortie produit `NON_ELIGIBLE`. Si les dates sont inconnues et que l’historique ne permet pas de conclure, la donnée reste `NON_RENSEIGNE`.

### 5.5 Limites documentées

Les différences de structure, les changements de population en cours d’année et l’ambiguïté des cellules vides alimentent le rapport de qualité. L’adaptateur ne reconstitue pas une certitude absente de la source.

---

## 6. Contrat standard à partir de 2026-2027

### 6.1 Métadonnées du fichier

Chaque fichier expose au minimum :

| Champ | Règle |
|---|---|
| `schema_id` | `AKS_ATTENDANCE` |
| `schema_version` | Version du contrat, initialement `1.0` |
| `season_id` | Format stable, par exemple `2026-2027` |
| `course_id` | Identifiant issu de la configuration |
| `generated_at` | Date et heure de préparation |
| `source_id` | Identifiant stable de la ressource |
| `timezone` | `Europe/Paris` sauf configuration contraire |

### 6.2 Identité des licenciés

Deux champs distincts sont conservés :

| Champ | Rôle | Obligation |
|---|---|---|
| `licencie_id` | Identifiant technique interne, permanent et immuable | Obligatoire |
| `numero_licence` | Identifiant fédéral et clé métier externe | Facultatif jusqu’à validation administrative |

Règles obligatoires :

- Analytics relie les inscriptions et présences avec `licencie_id` ;
- `licencie_id` est généré à la création du licencié et ne change jamais ;
- l’absence temporaire de `numero_licence` ne bloque ni l’inscription, ni le suivi, ni les calculs ;
- après validation administrative, le numéro de licence peut être renseigné ;
- lorsqu’il est renseigné, il doit être unique après normalisation ;
- un doublon de numéro de licence est une erreur bloquante pour les lignes concernées ;
- le numéro de licence facilite les rapprochements fédéraux mais ne devient pas la dépendance technique d’Analytics ;
- toute correction d’un numéro de licence est tracée sans modifier `licencie_id`.

### 6.3 Référentiel des cours

Les cours proviennent d’une liste fermée et configurable. Pour 2026-2027, la configuration peut inclure Baby, Enfant 1, Enfant 2, Ado/Adulte et le cours féminin lorsque son suivi complet est effectivement mis en place.

Un libellé libre ne remplace jamais `course_id`.

### 6.4 Inscription au cours

Chaque inscription comporte au minimum :

- `season_id` ;
- `course_id` ;
- `licencie_id` ;
- `entry_date` ;
- `exit_date`, facultative ;
- `enrollment_status` ;
- `updated_at`.

L’unicité porte sur la combinaison saison, cours et licencié, sauf règle explicitement versionnée de réinscription.

### 6.5 Séances

Chaque séance comporte :

| Champ | Description |
|---|---|
| `session_id` | Identifiant stable et unique |
| `season_id` | Saison |
| `course_id` | Cours |
| `session_date` | Date locale |
| `start_time` | Heure prévue |
| `session_status` | `PREVUE`, `REALISEE`, `ANNULEE` ou `EXCLUE` |
| `exclusion_reason` | Motif lorsque requis |
| `updated_at` | Dernière modification |

Seules les séances `REALISEE` et exploitables contribuent aux indicateurs de présence.

### 6.6 Présences

Une présence est identifiée par `session_id` et `licencie_id`.

Les états autorisés sont :

- `PRESENT` ;
- `ABSENT` ;
- `EXCUSE` ;
- `NON_RENSEIGNE` ;
- `NON_ELIGIBLE`.

Une absence ne peut être comptabilisée que pour une séance réalisée et un licencié éligible.

---

## 7. Structure recommandée des fichiers 2026-2027

La préparation standard crée des feuilles homogènes :

- `_Metadata` ;
- `Licencies` ;
- `Inscriptions` ;
- `Seances` ;
- `Presences` ;
- `Import_Log` ;
- `Readme`.

Les feuilles techniques protégées restent modifiables uniquement par les rôles autorisés. Les vues de saisie peuvent être adaptées sans changer le contrat normalisé.

---

## 8. Pipeline d’import

L’ordre obligatoire est :

1. identifier la source et sa version ;
2. contrôler les métadonnées ;
3. lire sans modifier ;
4. normaliser les valeurs ;
5. valider la structure ;
6. valider les références et l’unicité ;
7. déterminer l’éligibilité ;
8. produire les objets normalisés ;
9. calculer la qualité et la couverture ;
10. publier le rapport d’import ;
11. transmettre uniquement les données acceptées au moteur Analytics.

Aucun calcul d’indicateur ne se déroule dans l’adaptateur de source.

---

## 9. Contrôles obligatoires

### 9.1 Structure

- feuilles ou tables requises ;
- colonnes obligatoires ;
- version de schéma reconnue ;
- type et format des champs ;
- dates appartenant à la saison ;
- cours configuré.

### 9.2 Références

- `licencie_id` connu ;
- `session_id` connu ;
- cohérence saison-cours ;
- inscription compatible avec la présence ;
- numéro de licence unique lorsqu’il est renseigné.

### 9.3 Doublons

Les doublons exacts peuvent être regroupés uniquement si le résultat est identique et tracé. Deux états différents pour la même séance et le même licencié produisent un conflit bloquant local.

### 9.4 Qualité

Le rapport distingue :

- erreurs bloquantes ;
- rejets de lignes ;
- avertissements ;
- normalisations automatiques ;
- valeurs non renseignées ;
- données non éligibles ;
- source ou cours partiellement exploitable.

---

## 10. Rapport d’import

Chaque exécution produit au minimum :

- identifiant du traitement ;
- source et version du contrat ;
- saison et cours ;
- date de lecture ;
- empreinte ou version de la source ;
- nombre de lignes lues ;
- lignes acceptées ;
- lignes rejetées ;
- avertissements ;
- erreurs par règle ;
- couverture obtenue ;
- décision de poursuite ou d’arrêt ;
- référence du dernier résultat valide.

Les anomalies ne doivent contenir que les données personnelles strictement nécessaires au diagnostic autorisé.

---

## 11. Gestion des erreurs et résultats partiels

Une erreur affectant un fichier ou un cours n’annule pas automatiquement les imports indépendants. La synthèse indique précisément le périmètre accepté.

Les règles suivantes s’appliquent :

- aucune donnée invalide n’est corrigée silencieusement ;
- aucune valeur inconnue n’est remplacée par zéro ;
- le dernier résultat valide reste disponible ;
- un import partiel ne remplace pas une publication complète sans décision conforme à `ANALYTICS-003` ;
- la reprise utilise l’identifiant de source et son empreinte afin d’éviter les doublons.

---

## 12. Préparation automatisée d’une saison

La préparation crée de manière contrôlée :

- le dossier de saison ;
- les sous-dossiers nécessaires ;
- les fichiers par cours ou ressources normalisées ;
- les feuilles standard ;
- les protections et droits ;
- les métadonnées de schéma ;
- le journal de création ;
- un rapport final des ressources créées, existantes ou en erreur.

L’opération est idempotente et non destructive :

- une ressource existante n’est jamais écrasée ;
- un conflit de nom ou d’identifiant est signalé ;
- une reprise ne recrée pas ce qui est déjà conforme ;
- aucun droit plus large que le modèle autorisé n’est accordé automatiquement.

---

## 13. Sécurité et confidentialité

- accès limité aux rôles autorisés ;
- lecture seule des sources par Analytics ;
- minimisation des données personnelles ;
- aucune donnée médicale issue du Questionnaire santé ;
- aucune réponse détaillée de questionnaire ;
- journalisation des imports et préparations ;
- masquage des détails sensibles dans les messages publics ;
- conservation et suppression conformes aux règles transverses.

---

## 14. Compatibilité et évolution du schéma

Toute évolution incompatible augmente la version majeure du schéma. Une évolution additive compatible augmente sa version mineure.

Un adaptateur :

- refuse une version majeure inconnue ;
- peut accepter une version mineure compatible ;
- documente toute valeur par défaut ;
- ne modifie jamais la source pour la rendre compatible ;
- conserve la version appliquée dans le rapport d’import.

Le contrat historique 2025-2026 reste figé et isolé après validation.

---

## 15. Critères d’acceptation

`ANALYTICS-005` est accepté lorsque :

- les contrats historique et standard sont séparés ;
- les quatre sources 2025-2026 sont lisibles sans modification ;
- le cours féminin est exclu en 2025-2026 ;
- les cellules vides restent non renseignées ;
- `P`, `A` et `E` possèdent une conversion explicite ;
- dates d’entrée, sortie et éligibilité sont prises en compte ;
- `licencie_id` constitue l’identifiant technique obligatoire ;
- le numéro de licence est facultatif avant validation, unique lorsqu’il est renseigné et non bloquant pour Analytics ;
- séances, inscriptions et présences possèdent des identifiants stables ;
- les contrôles de structure, références, dates, codes et doublons sont définis ;
- chaque import produit un rapport exploitable ;
- les formules des fichiers sources sont ignorées ;
- la préparation de saison est idempotente et non destructive ;
- le moteur Analytics ne consomme que des objets normalisés.

---

## 16. Décisions structurantes

1. Deux contrats isolent l’historique du format cible.
2. Les fichiers 2025-2026 ne sont jamais modifiés.
3. Une cellule vide n’est jamais une absence.
4. `licencie_id` porte la continuité interne.
5. Le numéro de licence porte l’identification fédérale sans devenir une dépendance technique.
6. Son absence temporaire ne bloque pas Analytics.
7. Son unicité est contrôlée dès qu’il est renseigné.
8. Les indicateurs sont recalculés depuis les données élémentaires.
9. Le moteur consomme uniquement le modèle normalisé.
10. Chaque import est traçable et qualifié.
11. Une saison est préparée sans écrasement.
12. Le cours féminin pourra entrer dans le contrat standard lorsqu’un suivi complet sera disponible.

---

## 17. Livrable suivant

Après validation des contrats externes, `ANALYTICS-006` définira la stratégie de validation, les jeux d’essai, la recette, les preuves attendues et les conditions d’entrée en développement applicatif.

---

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.1.0 | 2026-07-26 | Validation comme référence de développement et ouverture d’ANALYTICS-006 pour la stratégie de validation, les jeux d’essai et la recette |
| 1.0.0 | 2026-07-26 | Création des contrats historique et standard, des formats, contrôles d’import et règles d’identification des licenciés |

---

## 19. Conclusion

Ce contrat permet d’exploiter fidèlement les données 2025-2026 tout en préparant un suivi homogène dès 2026-2027. Il protège les calculs contre les ambiguïtés historiques, garantit la continuité grâce à `licencie_id` et conserve le numéro de licence comme référence fédérale utile mais non bloquante.

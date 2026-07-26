# ANALYTICS-006 — Stratégie de validation, jeux d’essai et recette

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-006 |
| **Version** | 1.0.0 |
| **Statut** | Proposition soumise à validation |
| **Nature** | Stratégie de validation, jeux d’essai, recette et preuves |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-26 |
| **Version du produit** | V1.2 |

---

## 1. Objet

Le présent document définit la stratégie de validation d’**AKS Analytics** avant tout développement applicatif. Il fixe les niveaux de contrôle, les jeux d’essai, les résultats attendus, les preuves de recette et les conditions de non-régression.

Il valide séparément :

- la reprise fidèle des fichiers historiques 2025-2026 ;
- le fonctionnement du format standard à partir de 2026-2027 ;
- la normalisation et la qualité des données ;
- les calculs définis dans `ANALYTICS-002` ;
- l’orchestration définie dans `ANALYTICS-003` ;
- les restitutions définies dans `ANALYTICS-004` ;
- les contrats de sources définis dans `ANALYTICS-005` ;
- la préparation automatisée et non destructive d’une saison.

Aucun résultat historique déjà calculé dans les fichiers sources ne constitue un oracle. Les résultats attendus sont établis depuis les données élémentaires et, pour les jeux d’or, vérifiés manuellement.

---

## 2. Références applicables

Le document applique notamment :

- `ANALYTICS-001` — vision et architecture ;
- `ANALYTICS-002` — modèle métier ;
- `ANALYTICS-003` — services et orchestration ;
- `ANALYTICS-004` — interfaces et restitutions ;
- `ANALYTICS-005` — contrats externes et formats des sources ;
- `ADMIN-004` — contrat `DashboardProvider` et `DashboardWidget` ;
- `CONFIG-001` — paramétrage ;
- `LOG-001` et `AUDIT-001` — journalisation et traçabilité ;
- `SECURITY-001` — sécurité ;
- `STORAGE-001` — stockage ;
- `UI-001` et `UX-001` — interfaces et expérience utilisateur ;
- `STD-001` — standard documentaire des modules.

---

## 3. Principes directeurs

1. Chaque règle métier doit posséder au moins un scénario vérifiable.
2. Les chemins nominaux, limites et erreurs sont testés.
3. Une cellule vide reste `NON_RENSEIGNE` et ne devient jamais `ABSENT`.
4. Une personne hors période d’inscription reste `NON_ELIGIBLE`.
5. Une séance annulée ou exclue ne contribue à aucun indicateur de présence.
6. Une anomalie locale ne bloque pas les cours et sources indépendants.
7. Aucun rejet, remplacement ou résultat partiel n’est silencieux.
8. Les valeurs non calculables ne sont jamais remplacées par zéro.
9. Le dernier résultat valide reste disponible après échec.
10. Le cours féminin est exclu de tous les traitements 2025-2026.
11. Le score AKS reste absent des calculs, tests et interfaces tant que sa formule n’est pas validée.
12. Les tests sont déterministes, répétables, versionnés et indépendants de l’ordre d’exécution.
13. Les données de test nominatives sont fictives ou pseudonymisées.
14. La recette produit des preuves lisibles et conservables.

---

## 4. Niveaux de validation

### 4.1 Niveau V1 — Contrats de sources

Ce niveau vérifie :

- l’identification de `HISTORICAL_ATTENDANCE_V1` et `STANDARD_ATTENDANCE_V1` ;
- les feuilles, tables et colonnes requises ;
- les versions de schéma ;
- les types, formats, dates et identifiants ;
- les cours configurés ;
- la lecture seule des sources ;
- le refus explicite d’une version majeure inconnue ;
- l’acceptation contrôlée d’une version mineure compatible.

### 4.2 Niveau V2 — Normalisation et qualité

Ce niveau vérifie :

- la conversion de `P`, `A` et `E` ;
- les variantes de casse et espaces périphériques autorisées ;
- la distinction entre `ABSENT`, `EXCUSE`, `NON_RENSEIGNE` et `NON_ELIGIBLE` ;
- les inscriptions et départs en cours de saison ;
- les doublons identiques et contradictoires ;
- les codes inconnus ;
- les références de licenciés et séances ;
- l’unicité du numéro de licence lorsqu’il est renseigné ;
- la non-obligation temporaire du numéro de licence ;
- la production d’un rapport d’import complet.

### 4.3 Niveau V3 — Calculs métier

Ce niveau vérifie :

- l’effectif analysé ;
- le nombre de séances réalisées et exploitables ;
- la fréquentation par séance ;
- l’assiduité individuelle, moyenne et médiane ;
- les profils d’assiduité ;
- l’évolution mensuelle ;
- la complétude et la couverture ;
- les absences consécutives ;
- les évolutions individuelles significatives ;
- la fidélité, la régularité, la stabilité et la participation lorsqu’elles sont calculables ;
- les résultats partiels ;
- les valeurs non calculables ;
- l’exclusion des données inconnues du dénominateur conformément à `ANALYTICS-002`.

### 4.4 Niveau V4 — Orchestration

Ce niveau vérifie :

- l’ordre Lecture → Normalisation → Validation → Calcul → Agrégation → Restitution → Publication ;
- l’isolation des erreurs par source et par cours ;
- l’idempotence ;
- le recalcul complet et ciblé ;
- la reprise après échec ;
- la conservation du dernier résultat valide ;
- la publication atomique ;
- la traçabilité des versions, sources et règles ;
- la journalisation via le service transverse ;
- l’absence de calcul métier dans le tableau de bord.

### 4.5 Niveau V5 — Restitutions

Ce niveau vérifie :

- les quatre rapports séparés Baby, Enfant 1, Enfant 2 et Ado/Adulte ;
- la synthèse globale produite après les rapports valides ;
- l’indication exacte du périmètre couvert en cas de résultat partiel ;
- la cohérence entre tableaux, graphiques et commentaires ;
- l’affichage de la qualité, de la fraîcheur et des limites ;
- l’accessibilité des informations sans dépendre du seul graphique ;
- les commentaires strictement factuels ;
- l’absence de donnée nominative dans le Centre de pilotage ;
- l’absence du score AKS ;
- la mention explicite de l’exclusion du cours féminin pour 2025-2026 ;
- la contribution pré-calculée au `DashboardProvider`.

### 4.6 Niveau V6 — Préparation de saison

Ce niveau vérifie :

- la création initiale des ressources 2026-2027 ;
- une deuxième exécution sans doublon ;
- la détection des ressources existantes ;
- l’absence d’écrasement ;
- les conflits de nom ou d’identifiant ;
- la création des feuilles et métadonnées standard ;
- l’application des protections et droits attendus ;
- le journal de création ;
- le rapport final des ressources créées, existantes ou en erreur.

---

## 5. Types de tests

| Type | Finalité | Exécution |
|---|---|---|
| Test unitaire | Vérifier une règle isolée de normalisation ou de calcul | À chaque changement concerné |
| Test de contrat | Vérifier un schéma de source ou d’objet d’échange | À chaque changement de contrat |
| Test d’intégration | Vérifier plusieurs services et le stockage transverse | À chaque incrément |
| Test de bout en bout | Vérifier import, calcul, rapport et publication | Avant recette |
| Test de non-régression | Protéger les règles validées et la V1 existante | Avant toute fusion |
| Test de sécurité | Vérifier droits, minimisation et absence de données interdites | Avant recette |
| Test de performance | Vérifier un volume représentatif sans dégrader l’usage | Avant publication |
| Recette fonctionnelle | Confirmer le résultat attendu par le Product Owner | Avant passage en développement validé ou publication |

---

## 6. Catalogue des jeux d’essai

### 6.1 GOLD-001 — Jeu nominal complet

Jeu de petite taille calculable manuellement, comprenant :

- un cours ;
- quatre licenciés ;
- quatre séances réalisées ;
- des états `PRESENT`, `ABSENT` et `EXCUSE` ;
- aucune donnée manquante ;
- des profils d’assiduité distincts.

Preuves attendues :

- effectif et dénominateurs ;
- résultats individuels ;
- moyenne et médiane ;
- fréquentation de chaque séance ;
- répartition des profils ;
- agrégats du cours ;
- commentaire factuel associé.

### 6.2 GOLD-002 — Éligibilité temporelle

Le jeu contient :

- un licencié présent toute la période ;
- un licencié arrivé après deux séances ;
- un licencié parti avant la dernière séance ;
- des séances réalisées avant et après les périodes d’inscription.

Les séances hors période doivent produire `NON_ELIGIBLE` et rester hors dénominateur.

### 6.3 GOLD-003 — Données incomplètes

Le jeu contient :

- des cellules vides ;
- un mois sans donnée exploitable ;
- une présence connue entourée de données inconnues ;
- une source partiellement complète.

Résultats attendus :

- aucune cellule vide convertie en absence ;
- complétude et couverture diminuées ;
- indicateurs non calculables signalés explicitement ;
- aucune valeur inconnue remplacée par zéro.

### 6.4 GOLD-004 — Séances annulées et exclues

Le jeu contient des séances `PREVUE`, `REALISEE`, `ANNULEE` et `EXCLUE`.

Seules les séances `REALISEE` et exploitables contribuent aux indicateurs. Les autres restent traçables mais hors calcul.

### 6.5 GOLD-005 — Doublons et conflits

Le jeu contient :

- deux lignes strictement identiques ;
- deux lignes portant des états contradictoires pour le même couple `session_id` et `licencie_id` ;
- un doublon d’inscription ;
- deux licenciés partageant le même numéro de licence.

Les doublons identiques peuvent être regroupés avec trace. Les conflits sont bloquants uniquement pour les lignes concernées. Le doublon de numéro de licence n’altère jamais les `licencie_id`.

### 6.6 GOLD-006 — Résultat partiel multi-cours

Le jeu contient quatre cours valides, puis introduit une anomalie bloquante sur Enfant 2.

Résultats attendus :

- Baby, Enfant 1 et Ado/Adulte restent traités ;
- Enfant 2 est signalé en erreur ;
- la synthèse indique exactement trois cours couverts ;
- le dernier rapport valide d’Enfant 2 reste disponible ;
- aucune publication partielle n’est présentée comme complète.

### 6.7 GOLD-007 — Identifiants

Le jeu contient :

- un `licencie_id` valide sans numéro de licence ;
- un numéro de licence renseigné et unique ;
- un `licencie_id` absent ;
- un `licencie_id` inconnu ;
- deux numéros de licence identiques après normalisation.

L’absence temporaire du numéro de licence produit au plus un avertissement de qualité. Un `licencie_id` absent ou inconnu provoque le rejet local attendu.

### 6.8 GOLD-008 — Exclusion du cours féminin 2025-2026

Une source 2025-2026 présente à tort un cours féminin avec des données.

Résultats attendus :

- aucune ligne n’est importée ;
- aucun effectif ni indicateur n’est produit ;
- la source est signalée comme hors périmètre ;
- les quatre rapports autorisés restent inchangés ;
- la synthèse globale exclut totalement ce cours.

### 6.9 GOLD-009 — Version de schéma

Le jeu contient :

- la version standard 1.0 ;
- une version mineure compatible ;
- une version majeure inconnue ;
- une métadonnée obligatoire absente.

La version majeure inconnue et l’absence de métadonnée bloquent la source concernée avec une anomalie explicite.

### 6.10 GOLD-010 — Préparation de saison

Le jeu exécute successivement :

1. une création initiale ;
2. une nouvelle exécution sans changement ;
3. une exécution avec ressource conforme existante ;
4. une exécution avec conflit ;
5. une exécution avec droit insuffisant simulé.

Aucune ressource existante n’est écrasée et chaque état figure dans le rapport final.

---

## 7. Matrice minimale de scénarios

| ID | Scénario | Résultat essentiel |
|---|---|---|
| SRC-001 | Fichier historique valide | Import accepté en lecture seule |
| SRC-002 | Cellule vide historique | `NON_RENSEIGNE`, jamais `ABSENT` |
| SRC-003 | Code inconnu | Rejet local et anomalie |
| SRC-004 | Version majeure inconnue | Source refusée explicitement |
| NRM-001 | Variantes de casse et espaces | Normalisation tracée |
| NRM-002 | Arrivée en cours de saison | Période antérieure non éligible |
| NRM-003 | Départ en cours de saison | Période postérieure non éligible |
| NRM-004 | Numéro de licence absent | Suivi et calculs autorisés |
| NRM-005 | Numéro de licence dupliqué | Lignes concernées en erreur |
| CAL-001 | Assiduité nominale | Résultat égal au jeu d’or |
| CAL-002 | Médiane paire et impaire | Résultat exact |
| CAL-003 | Mois non exploitable | Valeur non calculable explicite |
| CAL-004 | Séance annulée | Hors calcul |
| CAL-005 | Absences consécutives | Séquence exacte |
| ORC-001 | Relance identique | Aucun doublon, même résultat |
| ORC-002 | Erreur d’un cours | Autres cours traités |
| ORC-003 | Échec avant publication | Dernier résultat valide conservé |
| ORC-004 | Reprise après échec | Reprise tracée sans duplication |
| UI-001 | Rapport par cours | Indicateurs, qualité et limites cohérents |
| UI-002 | Synthèse partielle | Périmètre couvert visible |
| UI-003 | Centre de pilotage | Données agrégées pré-calculées |
| UI-004 | Accessibilité graphique | Information disponible en texte ou tableau |
| SEA-001 | Première préparation | Ressources créées conformément au contrat |
| SEA-002 | Deuxième préparation | Aucun doublon ni écrasement |
| SEC-001 | Données interdites | Aucune donnée médicale ou réponse QS |
| REG-001 | Cours féminin 2025-2026 | Exclusion totale |
| REG-002 | Score AKS | Aucun calcul ni affichage |

---

## 8. Définition d’un cas de test

Chaque cas de test documente au minimum :

| Champ | Contenu |
|---|---|
| Identifiant | Stable et unique |
| Règle couverte | Référence documentaire précise |
| Préconditions | Configuration, saison, source et droits |
| Données d’entrée | Jeu et version utilisés |
| Étapes | Actions reproductibles |
| Résultat attendu | Valeurs, statuts et anomalies exacts |
| Preuve attendue | Rapport, capture, export, journal ou comparaison |
| Résultat observé | Renseigné lors de l’exécution |
| Statut | Réussi, échoué ou bloqué |
| Référence du défaut | Obligatoire en cas d’échec |
| Exécutant et date | Traçabilité de la recette |

---

## 9. Oracles et jeux d’or

Les jeux d’or sont de taille volontairement limitée. Leurs résultats sont calculés manuellement et revus indépendamment de l’implémentation.

Chaque jeu d’or conserve :

- les données sources ;
- la version du schéma ;
- la version des règles métier ;
- le détail des calculs manuels ;
- les résultats attendus sérialisés ;
- le rapport et les graphiques attendus lorsque pertinents ;
- une empreinte des fichiers ;
- la date de validation.

Une modification d’oracle exige une justification documentaire. Un test ne doit jamais être rendu vert par modification silencieuse du résultat attendu.

---

## 10. Tolérances et comparaisons

- les effectifs, comptes et statuts exigent une égalité exacte ;
- les pourcentages sont calculés avec la précision définie dans `ANALYTICS-002` puis arrondis uniquement à l’affichage ;
- la comparaison automatisée porte sur la valeur non arrondie lorsque disponible ;
- les dates et heures sont comparées dans le fuseau configuré, par défaut `Europe/Paris` ;
- l’ordre des éléments n’est significatif que s’il appartient au contrat ;
- aucune tolérance ne permet de masquer une différence de dénominateur ;
- un commentaire automatique est comparé sur ses faits et règles de génération, sans introduire de diagnostic.

---

## 11. Validation des restitutions

Pour chaque rapport, la recette vérifie :

1. le titre, la saison, le cours et la date de calcul ;
2. l’effectif analysé et la couverture ;
3. la cohérence de tous les indicateurs ;
4. la correspondance entre tableau et graphique ;
5. les libellés des valeurs non calculables ;
6. les avertissements et limites ;
7. la fraîcheur des données ;
8. les commentaires factuels ;
9. l’absence de score AKS ;
10. l’absence de données non autorisées.

Pour la synthèse globale, elle vérifie en plus :

- la présence des quatre cours attendus lorsque tous sont valides ;
- l’exclusion du cours féminin pour 2025-2026 ;
- le périmètre exact en cas de résultat partiel ;
- l’absence de double comptage ;
- la génération postérieure aux rapports de cours.

---

## 12. Validation de l’orchestration

### 12.1 Idempotence

Deux exécutions avec les mêmes sources, versions et paramètres doivent produire le même résultat fonctionnel et ne créer aucun doublon.

### 12.2 Publication atomique

Une publication n’est visible que lorsque tous ses artefacts requis sont cohérents. Un échec intermédiaire ne remplace pas le dernier résultat valide.

### 12.3 Isolation

Une erreur est qualifiée par source, saison et cours. Les unités indépendantes continuent leur traitement.

### 12.4 Recalcul

La recette couvre :

- le recalcul complet d’une saison ;
- le recalcul ciblé d’un cours ;
- le recalcul après correction d’une source ;
- l’absence de recalcul à l’affichage ;
- la traçabilité de la version des règles appliquées.

### 12.5 Journalisation

Les événements attendus sont contrôlés sans exposer inutilement de données personnelles. Une panne de journalisation ne doit pas falsifier un résultat métier ; son traitement suit le contrat transverse applicable.

---

## 13. Validation de la préparation de saison

La recette vérifie la présence et la conformité :

- du dossier de saison ;
- des sous-dossiers ;
- des ressources par cours ;
- des feuilles `_Metadata`, `Licencies`, `Inscriptions`, `Seances`, `Presences`, `Import_Log` et `Readme` ;
- de `schema_id`, `schema_version`, `season_id`, `course_id`, `source_id`, `generated_at` et `timezone` ;
- des protections et droits ;
- du journal de création ;
- du rapport final.

Une ressource existante conforme est conservée. Une ressource existante non conforme est signalée et n’est jamais remplacée automatiquement.

---

## 14. Non-régression

La suite minimale de non-régression comprend :

- tous les jeux d’or ;
- les conversions de codes historiques ;
- l’éligibilité temporelle ;
- l’exclusion des séances non réalisées ;
- la distinction absence, excusé, inconnu et non éligible ;
- l’isolation des quatre cours ;
- l’exclusion du cours féminin 2025-2026 ;
- l’absence du score AKS ;
- la conservation du dernier résultat valide ;
- l’idempotence des imports et préparations ;
- les contrôles de sécurité ;
- les tests existants d’AKS Platform nécessaires pour garantir l’absence de régression du Questionnaire santé et des services transverses.

Toute correction de défaut ajoute un test de non-régression lorsqu’elle révèle un cas reproductible.

---

## 15. Données, sécurité et confidentialité

- aucun jeu d’essai ne contient de réponse au Questionnaire santé ;
- aucune donnée médicale n’est importée ;
- les identités réelles sont remplacées par des données fictives ou pseudonymisées ;
- les numéros de licence de test ne correspondent pas volontairement à des licenciés réels ;
- les preuves publiques ou partagées minimisent les données personnelles ;
- les droits de lecture, écriture et administration sont testés ;
- Analytics conserve une lecture seule sur les sources opérationnelles ;
- les journaux n’exposent que les informations nécessaires au diagnostic autorisé.

---

## 16. Performance et volumétrie

Avant publication, un jeu représentatif vérifie :

- une saison complète ;
- les cours et effectifs attendus ;
- le volume de séances correspondant au fonctionnement réel ;
- la génération des quatre rapports et de la synthèse ;
- l’absence de dépassement non maîtrisé des limites Apps Script ;
- la reprise ou le découpage prévu par `ANALYTICS-003` ;
- un temps de consultation compatible avec l’usage sur ordinateur et tablette.

Les seuils chiffrés sont enregistrés avec les mesures réelles. Ils ne sont pas inventés avant le premier prototype mesurable.

---

## 17. Gestion des anomalies de recette

| Gravité | Définition | Effet |
|---|---|---|
| Bloquante | Empêche la recette ou produit un résultat dangereux/inexploitable | Interdit la validation |
| Critique | Fausse un calcul, le périmètre ou la confidentialité | Interdit la validation |
| Majeure | Dégrade une fonction importante sans contournement acceptable | Validation reportée sauf décision explicite |
| Mineure | Défaut limité avec contournement acceptable | Peut être accepté et planifié |
| Cosmétique | Présentation sans effet sur compréhension ni résultat | Peut être reporté |

Toute dérogation précise le risque, le responsable, l’échéance et la décision du Product Owner.

---

## 18. Critères d’entrée en développement applicatif

Le développement applicatif peut commencer lorsque :

- `ANALYTICS-001` à `ANALYTICS-006` sont des références de développement ;
- aucune règle métier structurante n’est indéterminée ;
- les jeux d’essai et jeux d’or sont approuvés ;
- les résultats attendus sont vérifiables ;
- les responsabilités des services et interfaces sont stables ;
- les formats 2025-2026 et 2026-2027 sont validés ;
- la stratégie de non-régression est définie ;
- les seuils non validés restent désactivés ou configurables ;
- le score AKS reste exclu ;
- le cours féminin reste exclu de 2025-2026 ;
- les dépendances applicatives et fichiers existants ont été analysés.

---

## 19. Critères de sortie de recette

La recette est concluante lorsque :

- tous les cas bloquants et critiques réussissent ;
- aucun défaut bloquant ou critique n’est ouvert ;
- les jeux d’or produisent exactement les résultats attendus ;
- les résultats partiels et non calculables sont correctement présentés ;
- les quatre rapports et la synthèse sont cohérents ;
- la préparation de saison est idempotente et non destructive ;
- la sécurité et la confidentialité sont respectées ;
- les tests de non-régression sont réussis ;
- les preuves sont enregistrées et rattachées à la version testée ;
- le Product Owner prononce la validation.

---

## 20. Preuves attendues

Le dossier de recette conserve au minimum :

- la version du code et des documents ;
- les versions de schéma et de règles ;
- les jeux d’essai utilisés et leurs empreintes ;
- les rapports d’import ;
- les résultats calculés ;
- les comparaisons avec les jeux d’or ;
- les rapports et exports générés ;
- les journaux techniques utiles ;
- les contrôles de droits ;
- la liste des anomalies ;
- le procès-verbal ou compte rendu de recette ;
- la décision finale.

---

## 21. Critères d’acceptation d’ANALYTICS-006

`ANALYTICS-006` est accepté lorsque :

- les deux chemins 2025-2026 et 2026-2027 sont couverts séparément ;
- les six niveaux de validation sont définis ;
- les cas nominaux, limites et erreurs sont recensés ;
- les jeux d’or permettent une vérification manuelle indépendante ;
- les cellules vides restent inconnues ;
- les périodes non éligibles et séances annulées sont exclues des calculs ;
- les erreurs sont isolées par source et par cours ;
- le dernier résultat valide est protégé ;
- les rapports, graphiques, commentaires et états de qualité sont testables ;
- la préparation de saison est testée en création, reprise et conflit ;
- la stratégie de non-régression est définie ;
- la sécurité et la confidentialité sont couvertes ;
- le score AKS est absent ;
- le cours féminin est totalement exclu de 2025-2026 ;
- les conditions d’entrée en développement applicatif sont explicites.

---

## 22. Décisions structurantes

1. La validation historique et la validation du format standard sont distinctes.
2. Les jeux d’or, et non les anciens tableaux de bord, portent les résultats attendus.
3. Toute donnée inconnue reste inconnue.
4. Toute donnée hors éligibilité reste hors dénominateur.
5. Une anomalie locale n’invalide pas les cours indépendants.
6. La publication protège le dernier résultat valide.
7. La préparation de saison est idempotente et non destructive.
8. Le numéro de licence absent ne bloque pas Analytics ; son unicité est contrôlée lorsqu’il existe.
9. Le score AKS reste exclu.
10. Le cours féminin reste exclu de 2025-2026.
11. Le développement applicatif ne commence qu’après validation du corpus et des jeux d’essai.

---

## 23. Livrable suivant

Après validation d’`ANALYTICS-006`, le cadrage documentaire préalable au développement applicatif sera complet. La prochaine décision de gouvernance portera sur :

- la validation formelle d’`ANALYTICS-006` ;
- la préparation des jeux d’essai exécutables ;
- le découpage du premier incrément applicatif ;
- l’analyse des dépendances avec le dépôt applicatif existant ;
- l’ouverture du développement sur une branche dédiée.

---

## 24. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-26 | Création de la stratégie de validation, des jeux d’essai, jeux d’or, règles de recette, preuves et conditions d’entrée en développement |

---

## 25. Conclusion

Cette stratégie rend le développement d’AKS Analytics vérifiable avant même son démarrage. Elle protège les règles métier essentielles, distingue clairement reprise historique et format cible, organise la non-régression et garantit que chaque résultat livré pourra être expliqué, recalculé et prouvé.

# INSCRIPTIONS-010 — Quatrième incrément : persistance technique en recette contrôlée

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-010 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Nature** | Autorisation d’un incrément applicatif borné |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-03 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit et borne le quatrième incrément applicatif d’AKS Inscriptions après la validation du moteur sans écriture, du contrôle d’accès avec audit injecté et du journal de commandes reprenable sans Google.

L’incrément prépare la première persistance Google exclusivement dans un environnement de recette isolé. Il matérialise un schéma physique technique minimal, une garde d’environnement et des adaptateurs persistants pour les séquences et le journal de commandes. L’audit fonctionnel reste produit par le service commun conforme à `AUDIT-001` au moyen d’un port injecté.

Il ne persiste aucune donnée nominative, ne crée aucun licencié, responsable, dossier saisonnier, affectation, formalité, règlement, lot ou ligne d’import et n’autorise aucune écriture de production.

## 2. Question traitée

Comment prouver que les contrats de concurrence, de version, d’idempotence et de reprise déjà validés peuvent être persistés dans Google Sheets en recette, sans ouvrir prématurément le référentiel métier ni permettre qu’une configuration incorrecte cible la production ?

Cette responsabilité est distincte :

- de la création complète du référentiel Inscriptions ;
- de l’analyse et de l’application des trois Google Forms ;
- des décisions administratives et des interfaces privées ;
- de la fixture SIKADA ;
- du pont Analytics/Présences et de `BODY_KARATE` ;
- de la sauvegarde, migration et restauration complètes ;
- de tout déploiement de production.

## 3. Point de départ vérifié

Le socle validé fournit déjà :

- un moteur métier pur et seize jeux d’or ;
- les six capacités Inscriptions et leurs périmètres fermés ;
- une autorisation recalculée avant toute lecture du journal ;
- un cycle d’audit injectable en deux temps ;
- un journal de commandes `inscriptions-command/1.0` ;
- une machine d’états fermée, une version optimiste et un plafond de trois tentatives ;
- une reprise après reconstruction du service et une réconciliation avant rejeu ;
- une suite cumulative à **380/380 tests réussis, 0 échec** ;
- un bilan de **13 jeux réussis, 1 partiel et 2 bloqués** ;
- un manifeste Apps Script déjà aligné sur `Europe/Paris`.

Il ne fournit pas encore d’adaptateur Google persistant, de verrou réel de recette ni de preuve de concurrence sur Google Sheets.

## 4. Périmètre autorisé

Le quatrième incrément autorise uniquement :

1. un registre de schéma physique versionné pour les onglets techniques de recette ;
2. une garde serveur vérifiant l’environnement, l’identifiant de ressource, le marqueur de recette, le schéma et le fuseau ;
3. un adaptateur Google Sheets du journal de commandes conforme à `INSCRIPTIONS-009` ;
4. un adaptateur Google Sheets des séquences conforme à `INSCRIPTIONS-005` ;
5. l’utilisation de `LockService` avec une durée d’attente bornée pour les réservations et mises à jour ;
6. un port d’audit vers le mécanisme commun AKS Core, sans créer un audit autonome propre au module ;
7. une composition de recette explicite et inaccessible depuis les routes publiques ou administratives ordinaires ;
8. des tests unitaires et de contrat utilisant des passerelles injectées sans API Google ;
9. des fonctions de recette Google nommées explicitement, exclues de `AKS_runValidationSuiteV11` et protégées contre un lancement accidentel ;
10. une campagne de recette sur données exclusivement techniques et fictives ;
11. la preuve de réservation concurrente, de version optimiste, d’idempotence et de reprise après reconstruction ;
12. l’intégration des tests automatiques sans Google à `AKS_runValidationSuiteV11`.

## 5. Schéma physique technique minimal

Le classeur de recette porte une version de schéma explicite `inscriptions-recipe-tech/1.0`. Seuls les onglets suivants sont autorisés dans cet incrément :

| Onglet | Responsabilité | Données autorisées |
|---|---|---|
| `Metadata` | Identifier et verrouiller l’environnement | Schéma, environnement, fuseau, identifiant technique et dates de contrôle |
| `Sequences` | Allouer des identifiants techniques sans réutilisation | Type, portée, dernière valeur, version et métadonnées techniques |
| `Commandes` | Persister le journal `inscriptions-command/1.0` | Enregistrement minimisé défini par `INSCRIPTIONS-009` |

Aucun autre onglet du schéma métier décrit dans `INSCRIPTIONS-005` n’est créé ou alimenté par cet incrément.

### 5.1 Métadonnées obligatoires

L’onglet `Metadata` contient exactement les clés minimales suivantes :

| Clé | Valeur attendue |
|---|---|
| `schema_version` | `inscriptions-recipe-tech/1.0` |
| `environment` | `RECETTE` |
| `timezone` | `Europe/Paris` |
| `resource_kind` | `AKS_INSCRIPTIONS_RECIPE` |
| `resource_id` | Identifiant technique égal au classeur ouvert |
| `created_at` | Horodatage non ambigu |
| `validated_at` | Horodatage du dernier contrôle réussi |

Une clé absente, dupliquée, inconnue ou incohérente provoque un refus fermé.

### 5.2 En-têtes de `Sequences`

Les en-têtes sont figés dans cet ordre :

`sequence_type`, `scope_key`, `last_value`, `row_version`, `updated_at`, `updated_by`.

L’unicité porte sur `sequence_type + scope_key`. `last_value` et `row_version` sont des entiers positifs ou nuls selon l’état initial documenté.

### 5.3 En-têtes de `Commandes`

Les en-têtes sont figés dans cet ordre :

`schema_version`, `command_id`, `idempotency_key`, `payload_fingerprint`, `actor`, `action`, `target_type`, `target_id`, `module`, `season`, `section`, `course_code`, `correlation_id`, `status`, `attempt_count`, `created_at`, `updated_at`, `row_version`, `failure_code`.

Aucun contenu métier complet n’est sérialisé dans une cellule. Les objets `target` et `scope` sont projetés dans des colonnes techniques déterministes.

## 6. Garde d’environnement obligatoire

Toute opération Google vérifie côté serveur, avant lecture ou écriture du journal ou des séquences :

1. `INSCRIPTIONS_ENVIRONMENT=RECETTE` résolu par `CONFIG-001` ;
2. présence de `INSCRIPTIONS_SPREADSHEET_ID` ;
3. correspondance exacte entre l’identifiant configuré et le classeur ouvert ;
4. présence et unicité des trois onglets autorisés ;
5. conformité exacte des en-têtes ;
6. marqueur `resource_kind=AKS_INSCRIPTIONS_RECIPE` ;
7. `environment=RECETTE` ;
8. `timezone=Europe/Paris` ;
9. `schema_version=inscriptions-recipe-tech/1.0`.

Une ressource non marquée, une valeur `PRODUCTION`, une cible inconnue, un schéma différent ou un fuseau incompatible produit un refus avant toute mutation.

La garde ne se fie jamais à un paramètre fourni par le client. L’identifiant du classeur et l’environnement sont résolus côté serveur.

## 7. Adaptateur persistant du journal

L’adaptateur implémente strictement les opérations `load`, `reserve` et `save` attendues par `INSCRIPTIONS-009`.

### 7.1 Lecture

- recherche par clé idempotente exacte ;
- refus de plusieurs lignes pour la même clé ;
- reconstruction déterministe de l’enregistrement ;
- validation du schéma, de l’état, des compteurs et de la version avant retour ;
- absence de donnée métier libre dans le résultat.

### 7.2 Réservation

Sous verrou applicatif :

1. relire l’onglet et rechercher la clé ;
2. refuser si la clé existe ;
3. vérifier l’enregistrement minimisé ;
4. ajouter une seule ligne ;
5. relire la ligne persistée ;
6. vérifier l’identité complète et la version ;
7. retourner l’enregistrement relu.

Une collision produit `INSCRIPTIONS_IDEMPOTENCY_CONFLICT` sans seconde ligne.

### 7.3 Mise à jour

Sous le même verrou applicatif :

1. retrouver une seule ligne par clé ;
2. comparer `row_version` à la version attendue ;
3. refuser toute divergence ;
4. vérifier la transition d’état en amont ;
5. remplacer uniquement les colonnes autorisées ;
6. relire et contrôler le résultat ;
7. retourner l’enregistrement persistant.

Une divergence produit `INSCRIPTIONS_JOURNAL_VERSION_CONFLICT`.

## 8. Adaptateur persistant des séquences

L’adaptateur respecte les formats et portées définis par `INSCRIPTIONS-005`.

Sous verrou applicatif, une allocation :

1. valide `sequence_type` et `scope_key` ;
2. retrouve zéro ou une ligne ;
3. initialise la séquence à partir de zéro si la portée est autorisée et absente ;
4. incrémente `last_value` et `row_version` ;
5. persiste l’acteur technique et l’horodatage ;
6. relit et contrôle la valeur ;
7. retourne l’identifiant formaté.

Le maximum des identifiants existants, le nombre de lignes, une formule Sheets ou un cache ne peuvent jamais déterminer la prochaine valeur. Une valeur consommée n’est jamais décrémentée ni réattribuée.

## 9. Verrouillage et concurrence

- seul un verrou applicatif fourni par `LockService.getScriptLock()` est autorisé ;
- l’attente est bornée et configurable dans une limite documentée ;
- l’absence de verrou produit `INSCRIPTIONS_LOCK_TIMEOUT` ;
- le verrou est libéré dans un bloc `finally` ;
- aucune API Google n’est appelée avant la garde d’environnement, sauf les lectures minimales nécessaires pour identifier et contrôler la ressource ;
- les tests automatiques utilisent un port de verrou injecté ;
- la concurrence réelle est exécutée uniquement dans la campagne de recette dédiée.

## 10. Audit fonctionnel commun

L’incrément ne crée ni onglet ni service d’audit propre à Inscriptions.

Les événements `INTENTION`, `REUSSI` et `ECHEC` sont transmis au port commun d’audit conforme à `AUDIT-001`. La composition refuse de démarrer si ce port ne garantit pas une persistance de recette contrôlable.

Chaque événement reste minimisé et corrélé. Il ne contient ni registre d’accès, ni dossier, ni coordonnées, ni réponse médicale, ni règlement.

Une commande sensible n’est jamais déclarée `CONFIRMEE` lorsque l’audit obligatoire échoue.

## 11. Séparation des tests automatiques et de la recette Google

### 11.1 Suite cumulative

`AKS_runValidationSuiteV11` utilise exclusivement :

- une passerelle de table injectée ;
- un verrou injecté ;
- une configuration injectée ;
- une horloge injectée ;
- un audit injecté.

Elle ne doit appeler ni `SpreadsheetApp`, ni `DriveApp`, ni `LockService`, ni une ressource Google réelle.

### 11.2 Recette explicite

Les fonctions utilisant Google réellement :

- portent un nom commençant par `AKS_recipeInscriptions010_` ;
- refusent toute ressource autre que `RECETTE` ;
- ne sont appelées par aucune route ou suite automatique ;
- exigent une confirmation technique explicite propre à la campagne ;
- ne traitent que des clés, identifiants et acteurs fictifs ;
- produisent un rapport minimisé et un identifiant de corrélation ;
- restaurent l’état initial ou signalent explicitement l’écart.

Le nombre de nouveaux tests et le futur total cumulatif ne seront enregistrés qu’après implémentation et exécution probante.

## 12. Campagne de recette minimale

La campagne réelle démontre au minimum :

1. refus d’un environnement absent, inconnu ou `PRODUCTION` ;
2. refus d’un mauvais identifiant, marqueur, fuseau, schéma ou en-tête ;
3. réservation unique d’une clé idempotente sous concurrence ;
4. conflit de version optimiste sans écriture partielle ;
5. allocation concurrente unique et monotone pour une portée fictive ;
6. persistance des états du journal après reconstruction du service ;
7. reprise d’une commande technique fictive interrompue avant commit ;
8. réconciliation sans double commit après interruption simulée ;
9. corrélation identique entre journal et audit commun ;
10. absence de modification hors des trois onglets autorisés ;
11. remise du classeur dans son état initial technique ;
12. preuve avant/après par empreintes et versions.

La campagne ne crée aucun objet métier et ne promeut aucun statut de jeu d’or à elle seule.

## 13. Codes d’erreur complémentaires

| Code | Signification |
|---|---|
| `INSCRIPTIONS_RECIPE_REQUIRED` | Environnement différent de `RECETTE` ou non déclaré |
| `INSCRIPTIONS_RECIPE_RESOURCE_MISMATCH` | Identifiant ou marqueur de ressource incohérent |
| `INSCRIPTIONS_SCHEMA_MISMATCH` | Version, onglet ou en-tête incompatible |
| `INSCRIPTIONS_LOCK_TIMEOUT` | Verrou applicatif non obtenu dans le délai |
| `INSCRIPTIONS_JOURNAL_DUPLICATE` | Plusieurs lignes portent la même clé |
| `INSCRIPTIONS_JOURNAL_VERSION_CONFLICT` | Version persistante différente de la version attendue |
| `INSCRIPTIONS_SEQUENCE_CONFLICT` | Portée absente, dupliquée ou incohérente |
| `INSCRIPTIONS_AUDIT_REQUIRED` | Audit commun obligatoire indisponible |
| `INSCRIPTIONS_RECIPE_PROOF_INCOMPLETE` | Preuve avant/après ou remise à zéro insuffisante |

Les messages publics restent génériques et corrélables. Les détails techniques sont journalisés sans donnée nominative.

## 14. Effet attendu sur les jeux d’or

Cet incrément renforce les preuves techniques de :

- `INS-GOLD-008` — séquences concurrentes ;
- `INS-GOLD-009` — idempotence et reprise ;
- `INS-GOLD-012` — audit obligatoire.

Ces trois jeux sont déjà réussis. Leur statut ne change pas artificiellement.

Le bilan attendu reste :

- **13 réussis** ;
- **1 partiel** : `INS-GOLD-016`, car la campagne ne constitue pas encore une restauration Google complète du référentiel ;
- **2 bloqués** : `INS-GOLD-013` pour SIKADA et `INS-GOLD-015` pour Analytics/`BODY_KARATE` ;
- **0 échec d’oracle**.

## 15. Éléments explicitement interdits

Cet incrément n’autorise pas :

- un identifiant ou une ressource de production ;
- la création du référentiel métier complet ;
- les onglets `Licencies`, `ResponsablesLegaux`, `LiensResponsables`, `DossiersSaisonniers`, `Affectations`, `Formalites`, `Reglements`, `LiensExternes`, `LotsImport`, `LignesImport` ou `DecisionsImport` ;
- toute identité ou donnée réelle de licencié ;
- l’analyse réelle des trois Google Forms ;
- l’application d’un lot, même fictif ;
- une interface, une route ou une carte du Centre de pilotage ;
- un audit autonome propre au module ;
- SIKADA ou sa fixture non validée ;
- Analytics, Présences ou `BODY_KARATE` ;
- une sauvegarde, migration ou restauration complète du référentiel ;
- une modification de partage ou d’habilitation réelle ;
- une purge automatique ;
- un déploiement de production.

## 16. Critères d’acceptation

L’incrément sera validable lorsque :

- le diff applicatif reste limité au schéma technique, aux gardes, adaptateurs, compositions de recette et tests ;
- la garde refuse toute cible non explicitement marquée `RECETTE` avant mutation ;
- seuls `Metadata`, `Sequences` et `Commandes` sont créés ou modifiés ;
- le journal persistant respecte `INSCRIPTIONS-009` ;
- les séquences respectent `INSCRIPTIONS-005` ;
- le verrou réel protège les réservations et mises à jour ;
- l’audit utilise le service commun et reste obligatoire ;
- les tests automatiques n’appellent aucune API Google ;
- la suite ciblée réussit ;
- la suite cumulative Apps Script réussit sans échec ;
- la campagne Google explicite réussit sur une ressource isolée ;
- les preuves avant/après et la remise à zéro sont complètes ;
- le bilan des jeux d’or reste honnêtement séparé des preuves obtenues ;
- aucune donnée nominative, application de lot, interface ou production n’est introduite ;
- aucun déploiement n’est créé.

## 17. Dépendances

- `INSCRIPTIONS-005` — stockage, schéma, séquences, concurrence et intégrations ;
- `INSCRIPTIONS-006` — jeux d’or, niveaux de validation et recette ;
- `INSCRIPTIONS-008` — accès et audit obligatoire ;
- `INSCRIPTIONS-009` — journal, idempotence et reprise ;
- `CONFIG-001` — résolution des identifiants et de l’environnement ;
- `ACCESS-001` — autorité d’accès ;
- `AUDIT-001` — audit fonctionnel commun ;
- `STORAGE-001` — stockage et protection ;
- `SECURITY-001` — refus fermé et minimisation ;
- `ERROR-001` — erreurs contrôlées.

## 18. Décisions structurantes proposées

1. La première persistance Google reste limitée à trois onglets techniques de recette.
2. Les données nominatives et les objets métier restent interdits.
3. La garde d’environnement précède toute mutation.
4. Le journal et les séquences utilisent le même verrou applicatif.
5. L’audit reste un service commun AKS Core, jamais une table métier autonome.
6. Les tests automatiques restent sans Google ; la recette Google est explicite et séparée.
7. Une preuve technique persistante ne lève ni SIKADA, ni Analytics/`BODY_KARATE`, ni la restauration complète.
8. Aucun total de tests ou statut de jeu d’or n’est annoncé avant preuve.

## 19. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-03 | Création du contrat bornant le quatrième incrément à la persistance technique du journal et des séquences dans une recette Google isolée, avec garde d’environnement et audit commun, sans donnée nominative ni application de lot |

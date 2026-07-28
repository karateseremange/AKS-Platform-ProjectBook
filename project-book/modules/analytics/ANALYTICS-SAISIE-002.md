# ANALYTICS-SAISIE-002 — Contrat d’écriture des séances et présences

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-002 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Nature** | Spécification fonctionnelle, technique et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Ce document définit le contrat d’écriture sécurisé utilisé par la future interface de saisie des présences. Il fixe la frontière serveur, les règles de validation, l’idempotence, le verrouillage, les écritures dans Google Sheets, la gestion des brouillons et clôtures, la concurrence, l’audit et les tests.

Il applique `ANALYTICS-SAISIE-001`, `ACCESS-001`, `ANALYTICS-009`, `SECURITY-001`, `AUDIT-001`, `LOG-001`, `API-001` et `ERROR-001`.

## 2. Principes

- Le serveur résout l’identité, les capacités, le cours, la saison et le classeur.
- Aucun identifiant de classeur, rôle, capacité ou auteur reçu du client n’est considéré fiable.
- Une sauvegarde porte sur l’ensemble de la séance, jamais sur une cellule isolée.
- Toute écriture est validée intégralement avant mutation.
- Les mutations d’un même cours sont sérialisées par verrou Apps Script.
- Une requête rejouée ne crée ni séance ni présence en double.
- Une erreur entraîne l’absence de mutation partielle.
- Une séance clôturée ne peut être corrigée que par un administrateur autorisé.
- Le fournisseur Analytics ne doit pas exploiter un brouillon.

## 3. Compatibilité avec le modèle V1.2.0

Le contrat conserve les quatre feuilles réellement publiées :

- `Configuration` ;
- `Licenciés` ;
- `Séances` ;
- `Présences`.

Les en-têtes obligatoires V1.2.0 restent inchangés. Des colonnes techniques optionnelles sont ajoutées à droite ; le lecteur V1.2.0 ignore déjà les colonnes supplémentaires.

### 3.1 Deux dimensions d’état

La colonne existante `État` de `Séances` décrit la réalité du cours :

- `REALISEE` ;
- `ANNULEE` ;
- `EXCLUE`.

Le workflow de saisie est distinct et utilise une nouvelle colonne `État saisie` :

- `BROUILLON` ;
- `CLOTUREE`.

Cette séparation évite de détourner `REALISEE`, déjà consommé par Analytics.

Avant l’activation des écritures, le fournisseur Sheets doit être adapté pour ignorer les présences dont la séance possède `État saisie = BROUILLON`. Pour compatibilité historique, une ligne sans colonne ou valeur `État saisie` reste interprétée selon le comportement V1.2.0.

## 4. Contrat des feuilles

### 4.1 Feuille `Séances`

| Colonne | Règle |
|---|---|
| `ID séance` | Identifiant stable et unique dans le classeur |
| `Date séance` | Date ISO `AAAA-MM-JJ`, unique par cours dans le premier incrément |
| `État` | `REALISEE`, `ANNULEE` ou `EXCLUE` |
| `État saisie` | `BROUILLON` ou `CLOTUREE` |
| `Version saisie` | Entier strictement croissant, initialisé à 1 |
| `Modifiée le` | Horodatage ISO serveur |
| `Modifiée par` | Adresse Google normalisée de l’acteur |

Une séance créée depuis l’interface est initialisée avec `État = REALISEE`, `État saisie = BROUILLON` et `Version saisie = 1`.

### 4.2 Feuille `Présences`

| Colonne | Règle |
|---|---|
| `Saison` | Saison résolue côté serveur |
| `Cours` | Code stable résolu côté serveur |
| `Date séance` | Date de la séance |
| `ID licencié` | Identifiant présent dans `Licenciés` et éligible à la date |
| `Statut` | `PRESENT`, `ABSENT`, `EXCUSE` ou `NON_RENSEIGNE` |
| `ID séance` | Référence stable vers `Séances` |
| `Version saisie` | Version du lot ayant produit la ligne |
| `Modifiée le` | Horodatage ISO serveur |
| `Modifiée par` | Acteur résolu côté serveur |

L’unicité métier est `Saison + Cours + ID séance + ID licencié`. Les anciennes lignes sans `ID séance` restent lisibles par date, mais toute nouvelle écriture renseigne l’identifiant.

## 5. Charge utile serveur

La commande logique de sauvegarde contient uniquement :

- `courseCode` ;
- `season` ;
- `sessionId` ou `sessionDate` pour une création ;
- `expectedVersion` ;
- `submissionId` unique généré par le client ;
- `targetState` : `BROUILLON` ou `CLOTUREE` ;
- `attendances[]` avec `licencieId` et `status` ;
- `correctionReason` uniquement pour une correction après clôture.

Le serveur ignore tout champ supplémentaire et rejette les champs obligatoires absents ou incohérents.

## 6. Autorisation

Chaque commande recalcule les droits avec `ACCESS-001` :

- création : `SESSION_CREATE` ;
- sauvegarde d’un brouillon : `ATTENDANCE_WRITE_DRAFT` ;
- clôture : `SESSION_CLOSE` ;
- correction après clôture : `ATTENDANCE_CORRECT_CLOSED`.

Le cours et le classeur sont résolus depuis la configuration serveur. Une falsification du cours, de la saison, du rôle ou de la version entraîne un refus fermé.

## 7. Validation métier

Avant toute écriture, le service vérifie :

1. identité et capacité ;
2. saison au format valide et active ;
3. cours configuré et affecté ;
4. classeur conforme à `Configuration` ;
5. feuilles et en-têtes obligatoires ;
6. séance unique pour la date ;
7. état de séance compatible avec l’opération ;
8. version attendue égale à la version persistée ;
9. absence de doublon de licencié dans la charge utile ;
10. appartenance et éligibilité de chaque licencié à la date ;
11. statut appartenant au catalogue ;
12. lot complet pour une clôture ;
13. motif de correction non vide après clôture.

Un brouillon peut contenir `NON_RENSEIGNE`. Une clôture exige un statut `PRESENT`, `ABSENT` ou `EXCUSE` pour chaque licencié éligible.

## 8. Transaction logique et verrouillage

L’ordre d’exécution est :

1. valider la forme de la commande sans écriture ;
2. acquérir un `ScriptLock` avec délai borné ;
3. relire configuration, séance, version et présences sous verrou ;
4. recalculer l’autorisation et les validations dépendant de l’état ;
5. préparer les lignes cibles en mémoire ;
6. remplacer le lot de la séance ;
7. mettre à jour la ligne `Séances` et incrémenter la version ;
8. relire et vérifier les clés, le nombre de lignes et la version ;
9. écrire l’événement d’audit ;
10. libérer le verrou dans un bloc `finally`.

Les valeurs précédentes sont conservées en mémoire pendant la mutation. Si une écriture ou la vérification échoue, le service restaure le lot précédent et signale l’échec. Une restauration impossible produit une alerte critique corrélée.

## 9. Idempotence et concurrence

- `submissionId` identifie une intention de sauvegarde.
- Le résultat d’une soumission réussie est mémorisé pendant une durée bornée.
- Le rejeu du même `submissionId` avec la même empreinte retourne le résultat initial.
- Le même identifiant avec une charge différente est rejeté.
- `expectedVersion` applique un contrôle optimiste.
- Une version périmée retourne `ATTENDANCE_VERSION_CONFLICT` sans écriture.
- L’interface doit alors recharger la séance et faire choisir l’utilisateur ; aucune fusion silencieuse n’est réalisée.

## 10. Résultat public

Une réussite retourne au minimum :

- `ok: true` ;
- `submissionId` ;
- `sessionId` ;
- `sessionDate` ;
- `workflowState` ;
- `version` ;
- `savedCount` ;
- `completedCount` ;
- `expectedCount` ;
- `correlationId`.

Les détails internes, adresses d’autres utilisateurs, identifiants de classeur et traces techniques ne sont jamais exposés.

## 11. Codes d’erreur

| Code | Signification publique |
|---|---|
| `ATTENDANCE_COMMAND_INVALID` | Demande invalide |
| `ATTENDANCE_SESSION_NOT_FOUND` | Séance introuvable |
| `ATTENDANCE_SESSION_DUPLICATE` | Plusieurs séances correspondent |
| `ATTENDANCE_SESSION_STATE_INVALID` | État incompatible |
| `ATTENDANCE_MEMBER_INVALID` | Licencié non autorisé pour la séance |
| `ATTENDANCE_STATUS_INVALID` | Statut inconnu |
| `ATTENDANCE_INCOMPLETE` | Clôture impossible car saisie incomplète |
| `ATTENDANCE_VERSION_CONFLICT` | La séance a été modifiée depuis son chargement |
| `ATTENDANCE_SUBMISSION_CONFLICT` | Identifiant de soumission réutilisé différemment |
| `ATTENDANCE_LOCK_TIMEOUT` | Ressource temporairement occupée |
| `ATTENDANCE_WRITE_FAILED` | Enregistrement impossible |
| `ATTENDANCE_ROLLBACK_FAILED` | Restauration impossible |

Les erreurs d’accès conservent les codes définis dans `ACCESS-001`.

## 12. Audit et journalisation

Sont audités :

- création d’une séance ;
- sauvegarde d’un brouillon ;
- clôture ;
- correction après clôture ;
- conflit de version ;
- refus sensible ;
- échec d’écriture ou de restauration.

L’événement contient acteur, action, cours, saison, séance, version avant/après, compteurs agrégés, motif de correction si requis, résultat, corrélation et horodatage. Il ne copie pas toute la liste nominative dans les journaux.

## 13. Frontière applicative

Un service dédié expose conceptuellement :

- `createOrGetTodaySession(command)` ;
- `saveAttendanceBatch(command)` ;
- `closeAttendanceSession(command)` ;
- `correctClosedAttendance(command)` ;
- `getAttendanceSession(courseCode, season, sessionId)`.

Le service d’écriture est distinct de `AnalyticsSheetsProvider`, qui reste responsable de la lecture Analytics. L’adaptateur Google Sheets est injectable afin que les tests n’écrivent jamais dans les classeurs réels.

## 14. Matrice minimale de tests

Les tests couvrent au minimum :

- création nominale et rejeu idempotent ;
- séance existante retrouvée sans duplication ;
- cours ou saison falsifié ;
- classeur incohérent ;
- licencié absent, dupliqué ou non éligible ;
- statut inconnu ;
- brouillon incomplet accepté ;
- clôture incomplète refusée ;
- clôture professeur autorisée ;
- clôture assistant refusée ;
- correction professeur refusée ;
- correction administrateur avec motif ;
- correction sans motif refusée ;
- version périmée ;
- double soumission identique et divergente ;
- verrou indisponible ;
- échec avant écriture sans mutation ;
- échec pendant écriture avec restauration ;
- restauration impossible et alerte critique ;
- fournisseur Analytics ignorant les brouillons ;
- fournisseur Analytics lisant les clôtures ;
- compatibilité des lignes historiques sans colonnes techniques ;
- absence de régression de la suite cumulative V1.2.0.

## 15. Critères d’acceptation

`ANALYTICS-SAISIE-002` sera prêt à développer lorsque :

1. les deux dimensions d’état sont validées ;
2. les colonnes techniques compatibles sont validées ;
3. le lot complet constitue l’unité d’écriture ;
4. les règles de brouillon et clôture sont validées ;
5. l’idempotence et le contrôle de version sont validés ;
6. le verrouillage et la restauration sont définis ;
7. les droits sont reliés aux capacités d’`ACCESS-001` ;
8. l’exclusion des brouillons des rapports est obligatoire ;
9. l’audit et les erreurs publiques sont définis ;
10. la matrice de tests couvre nominal, refus, concurrence et reprise.

## 16. Hors périmètre

- interface graphique de saisie ;
- gestion graphique des rôles ;
- modification de la liste des licenciés ;
- import externe ;
- migration générale vers le contrat cible d’`ANALYTICS-005` ;
- fusion automatique de deux saisies concurrentes ;
- mode hors connexion ;
- plusieurs séances du même cours le même jour dans le premier incrément.

## 17. Décisions soumises à validation

1. séparer `État` de séance et `État saisie` ;
2. ajouter les colonnes techniques optionnelles sans migrer le contrat V1.2.0 ;
3. enregistrer chaque séance comme un lot complet ;
4. autoriser `NON_RENSEIGNE` en brouillon mais pas à la clôture ;
5. utiliser `ScriptLock`, `expectedVersion` et `submissionId` conjointement ;
6. exclure obligatoirement les brouillons du fournisseur Analytics ;
7. imposer un motif pour toute correction après clôture ;
8. limiter le premier incrément à une séance par cours et par date.

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-28 | Première spécification du contrat d’écriture soumise à validation |

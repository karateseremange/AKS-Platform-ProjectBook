# INSCRIPTIONS-009 — Troisième incrément : journal de commandes et reprise sans Google

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-009 |
| **Version** | 1.0.0 |
| **Statut** | En revue |
| **Nature** | Autorisation d’un incrément applicatif borné |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-03 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

Le présent document définit et borne le troisième incrément applicatif d’AKS Inscriptions après la validation du moteur sans écriture et du contrôle d’accès avec audit injecté.

L’incrément transforme le cycle de commande prévu par `INSCRIPTIONS-005` et amorcé par `INSCRIPTIONS-008` en contrat de journal versionné, idempotent et reprenable après interruption. Il utilise uniquement des dépendances injectées et des doubles de test ; il ne lit ni n’écrit aucune ressource Google réelle.

## 2. Question traitée

Comment garantir qu’une commande Inscriptions interrompue, rejouée ou reprise après reconstruction du service ne produit ni double mutation, ni succès non prouvé, ni perte de traçabilité, avant l’introduction d’un adaptateur Google persistant ?

Cette responsabilité est distincte :

- du moteur métier et des jeux d’or de `INSCRIPTIONS-006` ;
- des autorisations et du cycle d’audit de `INSCRIPTIONS-008` ;
- du futur stockage physique Google ;
- des interfaces privées et des intégrations externes.

## 3. Point de départ vérifié

Le socle validé fournit déjà :

- les seize jeux d’or et le moteur pur ;
- l’idempotence et la reprise simulées dans `INS-GOLD-009` ;
- les six capacités Inscriptions et leurs périmètres fermés ;
- le refus avant tout accès au dépôt ;
- le cycle `prepare → audit(INTENTION) → commit → contrôle → audit(résultat) → confirmation` ;
- une suite cumulative à **360/360 tests réussis, 0 échec** ;
- un bilan de **13 jeux réussis, 1 partiel et 2 bloqués**.

Il ne fournit pas encore de journal de commandes réutilisable conservant son état lorsque le service est reconstruit.

## 4. Périmètre autorisé

Le troisième incrément autorise uniquement :

1. un contrat `CommandJournalStore` injectable et sans dépendance Google ;
2. un enregistrement de commande versionné et minimisé ;
3. des transitions d’état fermées ;
4. la réservation atomique simulée d’une clé idempotente ;
5. la détection d’un rejeu identique et d’un conflit de contenu ;
6. la reprise d’une commande après reconstruction complète du service ;
7. la réconciliation d’une interruption avant ou après commit au moyen d’un dépôt injecté idempotent ;
8. la limitation du nombre de tentatives et le classement explicite des échecs ;
9. la corrélation obligatoire entre commande, mutation et événements d’audit ;
10. les tests unitaires, de contrat et d’intégration correspondants ;
11. l’intégration des nouveaux tests dans `AKS_runValidationSuiteV11`.

## 5. Enregistrement minimal d’une commande

Chaque entrée du journal contient uniquement :

| Champ | Règle |
|---|---|
| `schemaVersion` | Valeur explicite `inscriptions-command/1.0` |
| `commandId` | Identifiant technique immuable |
| `idempotencyKey` | Clé unique dans la portée autorisée |
| `payloadFingerprint` | Empreinte canonique ; jamais le contenu métier complet |
| `actor` | Identité technique normalisée |
| `action` | Action Inscriptions autorisée |
| `target` | Cible technique minimisée |
| `scope` | Module, saison, section et cours lorsque requis |
| `correlationId` | Identifiant commun au journal, au dépôt et à l’audit |
| `status` | État fermé défini au § 6 |
| `attemptCount` | Nombre de tentatives contrôlé |
| `createdAt`, `updatedAt` | Dates fournies par une horloge injectée |
| `version` | Version optimiste strictement croissante |
| `failureCode` | Code technique autorisé seulement en cas d’échec |

Le journal ne contient ni dossier complet, ni coordonnées nominatives, ni réponse médicale, ni données de règlement, ni registre d’accès.

## 6. Machine d’états fermée

Les seuls états autorisés sont :

- `INTENTION` : commande réservée, mutation non commencée ;
- `EN_COURS` : intention d’audit persistée et mutation autorisée ;
- `CONFIRMEE` : mutation relue, contrôlée et audit final réussi ;
- `ECHEC_RECUPERABLE` : résultat non confirmé, reprise autorisée ;
- `ECHEC_FINAL` : reprise interdite sans décision administrative explicite.

Transitions autorisées :

| Depuis | Vers |
|---|---|
| Aucun enregistrement | `INTENTION` |
| `INTENTION` | `EN_COURS`, `ECHEC_RECUPERABLE`, `ECHEC_FINAL` |
| `EN_COURS` | `CONFIRMEE`, `ECHEC_RECUPERABLE`, `ECHEC_FINAL` |
| `ECHEC_RECUPERABLE` | `EN_COURS`, `ECHEC_FINAL` |
| `CONFIRMEE` | Aucun changement ; rejeu identique retourne le résultat confirmé |
| `ECHEC_FINAL` | Aucun changement automatique |

Toute autre transition est refusée. Une version attendue différente de la version courante produit un conflit fermé.

## 7. Idempotence et reprise

La première exécution réserve la clé avec l’empreinte canonique de la commande. Ensuite :

- même clé et même empreinte : consultation ou reprise de l’entrée existante ;
- même clé et empreinte différente : `INSCRIPTIONS_IDEMPOTENCY_CONFLICT`, sans mutation ;
- commande déjà `CONFIRMEE` : aucun nouveau commit, résultat immuable ;
- commande `INTENTION` : reprise avant mutation ;
- commande `EN_COURS` ou `ECHEC_RECUPERABLE` : réconciliation obligatoire avec le dépôt injecté avant toute décision ;
- résultat déjà appliqué par le dépôt : relecture, contrôle, audit final puis confirmation, sans second commit ;
- résultat absent : reprise du cycle autorisé avec la même clé ;
- résultat ambigu ou invérifiable : `ECHEC_RECUPERABLE` ou `ECHEC_FINAL`, jamais succès.

L’autorisation est recalculée côté serveur à chaque exécution ou reprise. Un droit ancien enregistré dans le journal ne vaut jamais autorisation actuelle.

## 8. Ordre obligatoire

Une nouvelle commande suit l’ordre :

1. identifier l’acteur et recalculer l’autorisation ;
2. valider la portée et la commande ;
3. réserver `INTENTION` dans le journal ;
4. persister l’audit `INTENTION` ;
5. passer en `EN_COURS` ;
6. préparer et committer via le dépôt injecté avec la même clé idempotente ;
7. relire et contrôler le résultat ;
8. persister l’audit `REUSSI` ou `ECHEC` ;
9. passer en `CONFIRMEE` seulement après réussite complète.

Une reprise commence par le chargement du journal, recalcule l’autorisation, puis réconcilie l’état enregistré avec le dépôt avant tout nouveau commit.

## 9. Tests obligatoires

Les tests automatisés démontrent au minimum :

- le schéma exact et la minimisation de l’enregistrement ;
- le refus des états ou transitions inconnus ;
- l’incrément optimiste de version et le refus d’une mise à jour concurrente ;
- la réservation unique d’une clé idempotente ;
- le rejeu identique sans nouveau commit ;
- le conflit de même clé avec une empreinte différente ;
- la reprise après interruption en `INTENTION` ;
- la reprise après interruption en `EN_COURS` avant commit ;
- la réconciliation après commit mais avant audit final ;
- la reconstruction du service avec un nouveau moteur utilisant le même double de journal ;
- le recalcul de l’autorisation lors d’une reprise ;
- l’absence de confirmation si contrôle ou audit final échoue ;
- le passage contrôlé vers `ECHEC_RECUPERABLE` puis `ECHEC_FINAL` ;
- la corrélation identique dans le journal, le dépôt et l’audit ;
- l’absence d’API Google dans le chemin testé ;
- la réussite de la suite cumulative Apps Script.

Le nombre de nouveaux tests et le futur total cumulatif seront enregistrés seulement après implémentation et exécution probante.

## 10. Effet sur les jeux d’or

Cet incrément renforce la preuve de `INS-GOLD-009` et `INS-GOLD-012`, déjà réussis. Il ne change artificiellement aucun statut.

Le bilan attendu reste donc :

- **13 réussis** ;
- **1 partiel** : `INS-GOLD-016`, tant qu’aucune restauration Google réelle n’est prouvée ;
- **2 bloqués** : `INS-GOLD-013` pour SIKADA et `INS-GOLD-015` pour Analytics/`BODY_KARATE` ;
- **0 échec d’oracle**.

## 11. Éléments explicitement interdits

Cet incrément n’autorise pas :

- `SpreadsheetApp`, `DriveApp`, `FormApp`, `PropertiesService`, `LockService` ou toute autre API Google dans le nouveau chemin ;
- la création du référentiel physique Inscriptions ;
- la lecture ou l’écriture de données métier réelles ;
- un journal réel dans Google Sheets ;
- l’analyse ou l’application réelle d’un lot Google Forms ;
- une interface privée ou une nouvelle route ;
- SIKADA ou sa fixture non encore validée ;
- le pont Analytics/Présences ou l’ajout de `BODY_KARATE` ;
- une sauvegarde ou restauration Google ;
- une modification d’accès réel ;
- un déploiement de production.

## 12. Critères d’acceptation

L’incrément sera validable lorsque :

- le diff applicatif reste limité au journal injectable, à l’orchestrateur de reprise, aux fixtures et aux tests ;
- le cycle validé par `INSCRIPTIONS-008` reste inchangé pour une commande nominale ;
- une reconstruction du service conserve les décisions du journal injecté ;
- aucun double commit n’est possible dans les scénarios testés ;
- un conflit ou un état ambigu refuse fermé ;
- l’autorisation est recalculée à chaque reprise ;
- journal et audit sont minimisés et corrélés ;
- aucune API Google réelle n’est appelée ;
- les suites ciblées réussissent ;
- la suite cumulative Apps Script réussit sans échec ;
- aucun déploiement n’est créé.

## 13. Dépendances

- `INSCRIPTIONS-005` — stockage, idempotence, concurrence et reprise ;
- `INSCRIPTIONS-006` — jeux d’or et stratégie de validation ;
- `INSCRIPTIONS-008` — autorisation et commande auditée ;
- `ACCESS-001` — autorité d’accès ;
- `AUDIT-001` — traçabilité ;
- `SECURITY-001` — refus fermé et minimisation ;
- `ERROR-001` — erreurs contrôlées.

## 14. Décisions structurantes proposées

1. Le journal de commandes est une dépendance injectée du domaine.
2. La clé idempotente est réservée avant toute mutation.
3. L’empreinte remplace le contenu métier complet dans le journal.
4. Une reprise recalcule toujours l’autorisation.
5. Une commande `EN_COURS` est réconciliée avec le dépôt avant tout nouveau commit.
6. Seuls contrôle, audit final et journal confirmé permettent d’annoncer le succès.
7. Le troisième incrément reste entièrement sans Google réel.
8. Les adaptateurs persistants Google, les interfaces et les intégrations externes restent des incréments séparés.

## 15. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-03 | Création du contrat bornant le troisième incrément au journal de commandes injectable, à l’idempotence durable simulée et à la reprise après interruption sans API Google |

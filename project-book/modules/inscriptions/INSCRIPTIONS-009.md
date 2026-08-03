# INSCRIPTIONS-009 — Troisième incrément : journal de commandes et reprise sans Google

| Propriété | Valeur |
|---|---|
| **Document ID** | INSCRIPTIONS-009 |
| **Version** | 1.1.0 |
| **Statut** | Validé |
| **Nature** | Contrat et validation d’un incrément applicatif borné |
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
| `payloadFingerprint` | Empreinte canonique du contenu utile ; jamais le contenu métier complet |
| `actor` | Identité technique normalisée |
| `action` | Type d’action Inscriptions autorisée ; composante de l’identité idempotente |
| `target` | Cible technique minimisée ; composante de l’identité idempotente |
| `scope` | Module, saison, section et cours lorsque requis ; composante de l’identité idempotente |
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

La première exécution réserve la clé avec une identité idempotente composée de `action`, `target`, `scope` et `payloadFingerprint`. Ces quatre composantes sont normalisées et comparées ensemble ; l’empreinte seule ne suffit jamais à identifier la commande. Ensuite :

- même clé et identité idempotente strictement identique : consultation ou reprise de l’entrée existante ;
- même clé avec `action`, `target`, `scope` ou `payloadFingerprint` différent : `INSCRIPTIONS_IDEMPOTENCY_CONFLICT`, sans mutation ;
- commande déjà `CONFIRMEE` : aucun nouveau commit, résultat immuable ;
- commande `INTENTION` : reprise avant mutation ;
- commande `EN_COURS` ou `ECHEC_RECUPERABLE` : réconciliation obligatoire avec le dépôt injecté avant toute décision ;
- résultat déjà appliqué par le dépôt : relecture, contrôle, audit final puis confirmation, sans second commit ;
- résultat absent : reprise du cycle autorisé avec la même clé ;
- résultat ambigu ou invérifiable : `ECHEC_RECUPERABLE` ou `ECHEC_FINAL`, jamais succès.

L’autorisation est recalculée côté serveur à chaque exécution ou reprise. Un droit ancien enregistré dans le journal ne vaut jamais autorisation actuelle.

### 7.1 Politique de tentatives

Le nombre maximal de tentatives de mutation est fixé à **3**, tentative initiale comprise.

- `attemptCount` vaut `0` lors de la réservation en `INTENTION` ;
- il est incrémenté atomiquement immédiatement avant chaque transition vers `EN_COURS` autorisant une tentative de commit ;
- une consultation, un rejeu déjà `CONFIRMEE` ou une réconciliation concluant que le dépôt a déjà appliqué le résultat n’incrémente pas le compteur ;
- après un échec récupérable, une nouvelle tentative n’est autorisée que si `attemptCount < 3` et après réconciliation du dépôt ;
- l’échec de la troisième tentative fait passer la commande en `ECHEC_FINAL` ;
- un résultat ambigu ou invérifiable passe en `ECHEC_RECUPERABLE` s’il reste une tentative, sinon en `ECHEC_FINAL`.

Le plafond est une règle du contrat et ne peut pas être relevé silencieusement par un adaptateur. Toute reprise administrative d’une commande en `ECHEC_FINAL` exige une décision explicite hors de ce cycle automatique.

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

## 9. Tests et preuves de validation

Les tests automatisés démontrent au minimum :

- le schéma exact et la minimisation de l’enregistrement ;
- le refus des états ou transitions inconnus ;
- l’incrément optimiste de version et le refus d’une mise à jour concurrente ;
- la réservation unique d’une clé idempotente ;
- le rejeu avec les mêmes `action`, `target`, `scope` et `payloadFingerprint` sans nouveau commit ;
- le conflit de même clé lorsque l’une de ces quatre composantes diffère ;
- la reprise après interruption en `INTENTION` ;
- la reprise après interruption en `EN_COURS` avant commit ;
- la réconciliation après commit mais avant audit final ;
- la reconstruction du service avec un nouveau moteur utilisant le même double de journal ;
- le recalcul de l’autorisation lors d’une reprise ;
- l’absence de confirmation si contrôle ou audit final échoue ;
- le comptage atomique des tentatives, l’absence d’incrément lors d’une simple réconciliation et le passage en `ECHEC_FINAL` après l’échec de la troisième tentative ;
- la corrélation identique dans le journal, le dépôt et l’audit ;
- l’absence d’API Google dans le chemin testé ;
- la réussite de la suite cumulative Apps Script.

L’implémentation applicative est intégrée sur `develop` par la [PR #88](https://github.com/karateseremange/AKS-Platform/pull/88), commit de fusion `b870d6f425e52c1ec63f1bb5ce1b5214296c8465`. Elle ajoute **20 tests ciblés**, tous réussis. Après synchronisation contrôlée par `clasp push` de la tête testée `0ee4bb7b7d37a6f84dea38dc57edccf732053782`, `AKS_runValidationSuiteV11` a produit le 3 août 2026 la preuve cumulative réelle de **380/380 tests réussis, 0 échec**.

Le diff applicatif reste limité au service de journal et reprise injecté, à ses tests et à leur intégration dans la suite V11. Aucun adaptateur Google, stockage métier réel, interface ou déploiement n’a été introduit.

## 10. Effet sur les jeux d’or

Cet incrément renforce la preuve de `INS-GOLD-009` et `INS-GOLD-012`, déjà réussis. Il ne change artificiellement aucun statut.

Le bilan validé reste donc :

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

L’incrément est validé sur les preuves suivantes :

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

## 14. Décisions structurantes validées

1. Le journal de commandes est une dépendance injectée du domaine.
2. La clé idempotente est réservée avant toute mutation.
3. L’identité idempotente compare ensemble l’action, la cible, la portée et l’empreinte, laquelle remplace le contenu métier complet dans le journal.
4. Une reprise recalcule toujours l’autorisation.
5. Une commande `EN_COURS` est réconciliée avec le dépôt avant tout nouveau commit.
6. Seuls contrôle, audit final et journal confirmé permettent d’annoncer le succès.
7. Le troisième incrément reste entièrement sans Google réel.
8. Les adaptateurs persistants Google, les interfaces et les intégrations externes restent des incréments séparés.

## 15. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.1.0 | 2026-08-03 | Validation de l’implémentation : PR applicative #88 fusionnée sur `develop`, 20/20 tests ciblés et suite cumulative Apps Script 380/380, sans API Google réelle ni déploiement |
| 1.0.0 | 2026-08-03 | Création du contrat bornant le troisième incrément au journal de commandes injectable, à l’idempotence durable simulée et à la reprise après interruption sans API Google |

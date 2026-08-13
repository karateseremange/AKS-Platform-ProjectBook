# ACCESS-002 — Administration des utilisateurs et habilitations

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002 |
| **Titre** | Administration des utilisateurs et habilitations privées |
| **Version** | 0.4.20 |
| **Statut** | Réalisation engagée — ACCESS-002-03 lot 4 en revue |
| **Nature** | Spécification fonctionnelle et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-13 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

ACCESS-002 rend administrable le modèle d’autorisation transverse défini par `ACCESS-001`.

L’objectif est de permettre à un gestionnaire habilité de gérer depuis AKS Platform les comptes Google autorisés, leurs rôles, leurs modules accessibles, leurs affectations et leurs capacités, sans modifier le code ni les Script Properties manuellement.

ACCESS-002 ne remplace pas le moteur d’autorisation existant. Il s’appuie sur le registre central `AKS_ACCESS_REGISTRY` et sur `AKS_createAccessService_()` comme sources de vérité côté serveur.

Le cadrage fonctionnel, l’UX de la fiche utilisateur, la stratégie d’amorçage/migration et le découpage de réalisation ont été validés par le Product Owner le 9 août 2026. Aucun arbitrage fonctionnel structurant ne reste ouvert avant le démarrage d’`ACCESS-002-01`.

---

## 2. Principes structurants validés

### 2.1 Authentification, rôles et habilitations

1. Google authentifie l’utilisateur ; AKS Platform décide des autorisations.
2. Tout accès privé est refusé par défaut tant qu’une habilitation effective explicite n’existe pas.
3. Le rôle décrit la fonction générale de la personne ; il n’accorde pas automatiquement l’accès aux modules.
4. Les habilitations sont explicites et indépendantes des rôles.
5. Deux personnes ayant le même rôle peuvent avoir des droits différents.
6. Le multi-rôle est une exigence fonctionnelle essentielle : un même compte peut cumuler plusieurs rôles.
7. Le cumul de rôles ne provoque aucun cumul automatique de droits.
8. Le rôle `CONSULTATION` décrit un profil destiné à la lecture seule mais ne donne, à lui seul, accès à aucun module.
9. ACCESS-002 V1 n’utilise aucun héritage automatique de droits depuis des profils types ou des rôles.
10. Un compte peut être actif et posséder un ou plusieurs rôles sans disposer d’aucune habilitation effective ; dans ce cas, aucun module privé n’est accessible.

### 2.2 Modules métier

11. Présences est une habilitation explicite configurable par saison et par cours ; un professeur peut n’avoir aucun accès Présences.
12. Une personne peut être habilitée à plusieurs cours simultanément.
13. L’interface peut proposer « sélectionner tous les cours actuels d’une section », mais les cours sont enregistrés explicitement ; aucun futur cours n’est ajouté automatiquement.
14. Une habilitation liée à un cours devenu inactif ou archivé est conservée pour l’historique mais devient non effective.
15. Analytics distingue au minimum `ANALYTICS_READ`, `ANALYTICS_PREVIEW` et `ANALYTICS_PUBLISH`.
16. Les droits Analytics sont indépendants de Présences et des autres modules.
17. Inscriptions conserve des capacités fines, notamment `INSCRIPTIONS_READ`, `INSCRIPTIONS_ANALYZE_IMPORT`, `INSCRIPTIONS_CONTROL`, `INSCRIPTIONS_WRITE`, `INSCRIPTIONS_APPLY_IMPORT` et `INSCRIPTIONS_ACTIVATE`.
18. Les droits Inscriptions sont indépendants des autres modules et ne donnent pas l’administration globale.

### 2.3 Administration et ACCESS_MANAGE

19. Les fonctions métier restent séparées des fonctions d’administration générale.
20. La gestion des utilisateurs et habilitations exige explicitement `ACCESS_MANAGE`.
21. Plusieurs utilisateurs peuvent posséder `ACCESS_MANAGE` simultanément.
22. Un détenteur de `ACCESS_MANAGE` peut attribuer ou retirer `ACCESS_MANAGE` à un autre utilisateur.
23. Un détenteur de `ACCESS_MANAGE` peut administrer ses propres rôles et habilitations comme ceux des autres utilisateurs.
24. Toute auto-attribution est soumise aux mêmes validations serveur et à un audit explicite.
25. Le système interdit toute opération laissant zéro gestionnaire actif disposant de `ACCESS_MANAGE`.
26. L’attribution de `ACCESS_MANAGE` est une opération sensible qui exige une confirmation explicite dans l’interface.
27. Le modèle repose sur confiance, traçabilité et garde-fous plutôt que sur une séparation obligatoire des pouvoirs entre plusieurs gestionnaires.
28. Aucun rôle technique `SUPER_ADMIN` n’est créé. Le gestionnaire principal reste soumis au modèle normal de rôles, habilitations, contrôles serveur et audit.

### 2.4 Comptes et identité

29. Un compte est désactivé plutôt que supprimé physiquement afin de préserver la traçabilité.
30. Réactiver un ancien compte ne réactive jamais automatiquement ses anciennes habilitations.
31. L’adresse Google constitue l’identité technique du compte d’accès AKS.
32. Un changement d’adresse Google entraîne la création d’un nouveau compte d’accès ; l’ancien est désactivé et conservé pour l’historique.
33. Les adresses sont normalisées simplement côté serveur : suppression des espaces accidentels, passage en minuscules et contrôle de format.
34. L’unicité est stricte après normalisation, y compris vis-à-vis des comptes désactivés.
35. AKS ne tente pas de rapprocher automatiquement les alias Gmail, les adresses avec `+...` ou les variantes liées aux particularités de Gmail.

### 2.5 Temporalité

36. Une habilitation peut comporter facultativement une date de début et/ou une date de fin.
37. Sans date de fin, elle reste valable jusqu’à modification, désactivation du compte ou invalidation de son périmètre.
38. Une habilitation expirée est automatiquement non effective sans être supprimée et n’est jamais renouvelée automatiquement.
39. Une date de début future est autorisée et active automatiquement l’habilitation à cette date, tant que cela reste une simple règle de validité et ne nécessite pas de mécanisme complexe de planification.
40. Les autres habilitations encore valides d’un utilisateur restent inchangées lorsqu’une habilitation particulière expire.

---

## 3. État de l’existant

Le socle `ACCESS-001` fournit déjà l’identité Google active, le registre persistant `AKS_ACCESS_REGISTRY`, les rôles, affectations explicites par saison et cours, capacités Présences/Analytics/Inscriptions, refus fermé côté serveur, compatibilité d’amorçage avec l’ancien mécanisme administrateur, protection contre la perte du dernier administrateur selon le modèle existant et sauvegarde auditée du registre.

La saisie des présences est déjà raccordée à `ACCESS-001` côté serveur.

Les écrans Centre de pilotage, Analytics administratif, Configuration, Journaux et écrans administratifs apparentés utilisent encore tout ou partie de `AKS.Admin.Access`. ACCESS-002 doit organiser leur migration sans réduire le niveau de sécurité existant.

---

## 4. Portail privé cible

Le Centre de pilotage évolue vers le portail privé commun d’AKS Platform. Son accès ne signifie plus « administrateur » : son contenu dépend des habilitations effectives de l’utilisateur.

Un professeur peut ne voir que Présences, ou Présences et Analytics en lecture. Un responsable Inscriptions peut ne voir que les fonctions Inscriptions attribuées. Un gestionnaire d’accès voit « Utilisateurs et habilitations ». Configuration, Journaux, Audit et Maintenance restent invisibles et inaccessibles sans les capacités correspondantes.

Le portail affiche clairement le compte Google identifié. Un compte authentifié sans habilitation active reçoit un message fonctionnel générique ; les causes techniques détaillées restent dans les journaux et l’audit.

---

## 5. Modèle d’autorisation cible

```text
Compte Google
    ↓
Compte d’accès AKS actif
    ↓
Rôle(s) descriptif(s)
    ↓
Habilitation(s) explicite(s)
    ↓
Module / saison / section / cours / période
    ↓
Capacité(s) effective(s)
    ↓
Autorisation serveur
```

Aucune autorisation n’est déduite du client. Les rôles et les habilitations restent deux dimensions distinctes.

---

## 6. Modules et niveaux d’accès

### 6.1 Présences

L’accès est attribuable par saison et par un ou plusieurs cours explicites. Un utilisateur sans affectation Présences ne voit aucun cours et ne peut ouvrir directement une route de saisie. Aucune option « tous les cours actuels et futurs » n’est retenue.

### 6.2 Analytics

Les capacités minimales sont `ANALYTICS_READ`, `ANALYTICS_PREVIEW` et `ANALYTICS_PUBLISH`. Elles sont attribuées explicitement et indépendamment.

### 6.3 Inscriptions

ACCESS-002 expose les capacités définies par `ACCESS-001`, notamment `INSCRIPTIONS_READ`, `INSCRIPTIONS_ANALYZE_IMPORT`, `INSCRIPTIONS_CONTROL`, `INSCRIPTIONS_WRITE`, `INSCRIPTIONS_APPLY_IMPORT` et `INSCRIPTIONS_ACTIVATE`. Le périmètre peut dépendre de la saison, de la section et, selon la capacité, du cours.

### 6.4 Administration générale

La gestion des habilitations (`ACCESS_MANAGE`), Configuration, Journaux, Audit, les opérations de maintenance sensibles et les futures fonctions administratives restent soumises à leurs capacités propres.

---

## 7. Interface « Utilisateurs et habilitations »

### 7.1 Vue globale — « Qui a accès à quoi ? »

Réservée à `ACCESS_MANAGE`, elle fournit une synthèse consultative avec recherche par nom/adresse Google et filtres actif/inactif, rôle, module et état temporel. Les modifications se font depuis la fiche individuelle. Les exports et rapports restent hors périmètre initial.

### 7.2 Fiche utilisateur — UX validée

La fiche est organisée en cinq éléments fonctionnels :

1. **Identité et statut** — nom d’affichage, adresse Google non modifiable après création, état actif/inactif et métadonnées utiles ;
2. **Rôles multiples** — présentation explicite de la fonction de la personne, sans ouverture automatique de module ;
3. **Accès aux modules et périmètres** — cartes par module, capacités métier, saisons, sections, cours et dates de validité ;
4. **Synthèse avant enregistrement** — droits effectifs et changements ajoutés/retirés, commentaire facultatif et confirmation renforcée pour `ACCESS_MANAGE` ;
5. **Historique fonctionnel** — changements d’habilitations lisibles depuis la fiche, les preuves techniques complètes restant dans Audit/Journaux.

L’interface doit maintenir une séparation visuelle nette entre **« qui est cette personne ? »** (rôles) et **« que peut-elle faire dans AKS Platform ? »** (habilitations/capacités).

Les détails d’un module peuvent être affichés progressivement lorsque son accès est configuré. Les libellés métier compréhensibles sont privilégiés aux codes techniques.

### 7.3 Mes accès

Tout utilisateur authentifié peut consulter ses propres habilitations effectives dans « Mes accès ». Il ne peut consulter les droits des autres utilisateurs sans `ACCESS_MANAGE`.

---

## 8. Sécurité

Toute lecture globale et toute écriture du registre exigent `ACCESS_MANAGE`. Le registre complet n’est jamais fourni à un utilisateur non autorisé. Les valeurs reçues du navigateur sont intégralement revalidées côté serveur et contrôlées contre les catalogues serveur.

Une modification invalide laisse le registre courant intact. Toute URL ou tout appel direct non autorisé est refusé côté serveur. Les changements prennent effet immédiatement côté serveur ; une page déjà ouverte ne constitue jamais une autorisation persistante.

Le dernier gestionnaire actif disposant de `ACCESS_MANAGE` ne peut pas être désactivé ni perdre ce droit. Un détenteur de `ACCESS_MANAGE` peut modifier ses propres droits : cette décision de confiance forte est assumée, contrôlée et auditée.

---

## 9. Audit et traçabilité

Création, activation/désactivation, rôles, affectations, capacités, auto-modifications, `ACCESS_MANAGE`, périodes de validité, refus, protection du dernier gestionnaire et migration produisent une preuve d’audit.

L’audit conserve au minimum : acteur, action, cible, état avant, état après, résultat, date, identifiant de corrélation et commentaire lorsqu’il existe. Une auto-modification doit être explicitement identifiable.

---

## 10. Comptes, désactivation et historique

Un compte désactivé perd immédiatement ses accès mais reste présent pour l’historique. Sa réactivation ne restaure aucune ancienne habilitation. Un changement d’adresse Google est traité comme un changement d’identité technique : ancien compte désactivé, nouveau compte créé, aucune copie automatique des droits.

---

## 11. Validité temporelle

Une habilitation peut avoir aucune borne, une date de début, une date de fin ou les deux. L’effectivité est évaluée côté serveur à chaque contrôle. Une habilitation future est enregistrée mais non effective avant sa date de début ; une habilitation expirée reste historique sans accorder de droit. Aucun renouvellement automatique inter-saison n’est effectué.

---

## 12. Initialisation et migration administrateur — décision validée

La migration suit un amorçage explicite, audité et réversible :

1. l’ancien mécanisme administratif sert uniquement d’autorité d’amorçage et de filet temporaire de récupération ;
2. `aserridj@gmail.com` est le premier compte gestionnaire principal ACCESS-002 ;
3. ce compte reçoit explicitement les rôles et habilitations nécessaires à l’administration et à ses fonctions métier, dont `ACCESS_MANAGE` ;
4. aucun rôle `SUPER_ADMIN` ni exception cachée liée à l’adresse n’est créé ;
5. une recette réelle vérifie accès autorisé, modification contrôlée, reconnexion, refus d’un compte non habilité et preuve d’audit ;
6. `AKS_ACCESS_REGISTRY` devient ensuite la source normale d’autorisation ;
7. l’ancien mécanisme reste temporairement disponible uniquement comme filet de récupération ;
8. son retrait définitif n’intervient qu’après validation complète en production et test de la procédure de récupération.

L’amorçage est une opération exceptionnelle et ne constitue pas un droit permanent hors du modèle ACCESS-002.

---

## 13. Découpage de réalisation validé

ACCESS-002 est réalisé en six incréments, chacun testable et documentable indépendamment.

| Incrément | Objectif | Résultat attendu |
|---|---|---|
| **ACCESS-002-01** | Socle d’administration | API serveur sécurisée de lecture, validation et modification du registre ; normalisation, atomicité, contrôles, temporalité, protection du dernier gestionnaire et audit avant/après |
| **ACCESS-002-02** | Amorçage et migration | `aserridj@gmail.com` devient le premier gestionnaire ACCESS-002 réel ; rôle `ADMINISTRATEUR` descriptif, `ACCESS_MANAGE` explicite ; recette d’accès/refus/audit concluante ; bootstrap historique limité au registre absent |
| **ACCESS-002-03** | Administration des utilisateurs | Liste, recherche, filtres, création, activation/désactivation et vue « Qui a accès à quoi ? » |
| **ACCESS-002-04** | Fiche et habilitations | UX validée, multi-rôle, modules, cours, capacités, dates, synthèse, commentaire, confirmation sensible et historique |
| **ACCESS-002-05** | Portail privé et Mes accès | Navigation personnalisée selon les droits effectifs et consultation des propres accès |
| **ACCESS-002-06** | Migration définitive des modules | Raccordement progressif Présences, Analytics et fonctions administratives au nouveau modèle ; retrait contrôlé de l’ancien mécanisme |

Règles de séquencement :

- aucun incrément ne doit fragiliser les accès administratifs existants ;
- chaque incrément doit produire un résultat exploitable, testable et documenté ;
- `ACCESS-002-03` ne démarre pas tant que la recette réelle d’`ACCESS-002-02` n’est pas validée ;
- la migration définitive des modules n’intervient qu’après disponibilité de l’administration complète des habilitations ;
- les tests cumulés et de non-régression restent obligatoires à chaque étape.

---

## 14. Hors périmètre ACCESS-002 V1

Sont hors périmètre : authentification propre à AKS, création de comptes Google, annuaire RH, espace licencié public, délégation automatique selon fonction associative, ouverture automatique des modules aux professeurs, héritage automatique depuis des profils types, suppression physique systématique, notification e-mail automatique lors d’un changement d’habilitations, duplication inter-saisons, modifications groupées, exports/reporting et développement métier d’INSCRIPTIONS-011.

---

## 15. Évolutions différées à conserver au backlog

Les besoins suivants sont identifiés mais non engagés et sans version cible tant que leur valeur n’est pas confirmée par l’usage :

1. notifications e-mail lors d’un changement d’habilitations ;
2. duplication assistée des habilitations d’une saison vers la suivante ;
3. modifications groupées de plusieurs utilisateurs ;
4. exports et reporting des habilitations ;
5. modèles d’aide à l’attribution de droits, uniquement comme aides de saisie sans héritage implicite.

---

## 16. Critères d’acceptation consolidés

ACCESS-002 sera considéré comme fonctionnel lorsque :

1. `ACCESS_MANAGE` protège réellement la lecture et l’écriture globales ;
2. les comptes, rôles multiples et habilitations explicites sont administrables ;
3. un compte actif sans habilitation n’accède à aucun module privé ;
4. Présences peut être limité à des cours explicites ;
5. Analytics et Inscriptions disposent de capacités indépendantes ;
6. les habilitations futures/expirées sont correctement évaluées ;
7. les URL et appels serveur non autorisés sont refusés ;
8. le portail privé et « Mes accès » reflètent les droits effectifs ;
9. plusieurs gestionnaires peuvent coexister et l’auto-administration est auditée ;
10. aucune opération ne peut laisser zéro gestionnaire actif ;
11. désactivation, réactivation et changement d’identité respectent les règles historiques validées ;
12. chaque modification conserve une preuve avant/après ;
13. une écriture invalide laisse le registre précédent intact ;
14. `aserridj@gmail.com` est amorcé et validé comme premier gestionnaire sans rôle spécial caché ;
15. le mécanisme historique n’est retiré qu’après recette et récupération validées ;
16. les tests ACCESS-001 et les non-régressions Présences, Analytics et administration restent concluants.

---

## 17. Stratégie de recette

La recette couvre au minimum : gestionnaire principal, second gestionnaire, professeur avec Présences sur un seul cours, professeur multi-rôle, professeur sans Présences mais Analytics lecture, assistant AFA limité, utilisateur Consultation, compte actif sans habilitation, habilitation future, habilitation expirée, compte inactif et compte inconnu.

La recette porte sur l’affichage et surtout sur les appels serveur directs. Des scénarios dédiés vérifient l’auto-attribution, la protection du dernier gestionnaire, l’archivage d’un cours, la désactivation/réactivation, le changement d’identité Google et la migration depuis l’administration historique.

---

## 18. Dépendances et ordre produit

ACCESS-002 dépend notamment de `ACCESS-001`, `ADMIN-001` à `ADMIN-005`, `SECURITY-001`, `AUDIT-001`, `CONFIG-001`, `LOG-001`, `ANALYTICS-SAISIE-001`, `INSCRIPTIONS-004` et des catalogues serveur de saisons, sections et cours.

Ordre produit retenu :

```text
INSCRIPTIONS-010 — clôturé
        ↓
ACCESS-002-01 à ACCESS-002-06
        ↓
INSCRIPTIONS-011 — prochain incrément métier Inscriptions
```

ACCESS-002 est un préalable au prochain écran privé sensible d’AKS Inscriptions.

---

## 19. Décisions de conception

Les trois arbitrages ouverts lors de la version 0.2.0 sont désormais clos :

1. **Fiche utilisateur et UX** — organisation en Identité/statut, Rôles, Accès modules, Synthèse et Historique validée ;
2. **Initialisation / migration administrateur** — amorçage explicite de `aserridj@gmail.com`, sans `SUPER_ADMIN`, avec filet historique temporaire validé ;
3. **Découpage ACCESS-002** — six incréments `ACCESS-002-01` à `ACCESS-002-06` validés.

Le cadrage est terminé. Toute nouvelle évolution fonctionnelle doit être traitée comme changement de périmètre ou élément de backlog, et non comme une micro-décision préalable au développement.

---

## 20. Définition de terminé

ACCESS-002 est terminé lorsque les six incréments sont validés, le registre est administrable depuis l’interface privée, le portail est personnalisé selon les droits effectifs, les contrôles restent systématiquement côté serveur, le multi-rôle fonctionne sans héritage automatique, les modules utilisent leurs capacités propres, la protection du dernier gestionnaire est effective, la récupération est documentée et testée, les changements sont audités avant/après, la recette multi-profils est concluante, les évolutions différées restent au backlog et le Project Book reflète le comportement livré.

---

## 21. État de réalisation

`ACCESS-002-01` est clôturé après fusion de la [PR applicative #93](https://github.com/karateseremange/AKS-Platform/pull/93) dans `develop`, au commit [`91ba7e3`](https://github.com/karateseremange/AKS-Platform/commit/91ba7e37972ce3ab1d96aa74bbdf4fc1bc4d38e8). Les cinq lots intégrés couvrent : ajout compatible de `ANALYTICS_READ` au catalogue des capacités, façade administrative en lecture seule protégée côté serveur, validation stricte et écriture atomique avec verrou, révision optimiste, relecture et restauration vérifiée, audit persistant obligatoire avant/après avec corrélation, puis correction du verrou partagé ACCESS/AUDIT, de l’autorisation d’audit et du raccordement des suites.

La compatibilité du schéma `access/1.0` et le bootstrap historique sont volontairement conservés pendant cette transition. Le rôle `ADMINISTRATEUR` reste une fonction descriptive, sans héritage automatique de capacités dès qu'un registre existe. La commande d’écriture exige désormais une preuve persistante avant mutation et restaure l’état précédent si la preuve finale échoue. ACCESS et AUDIT partagent un seul verrou de script sans acquisition imbriquée ; la voie d’audit sous verrou vérifie sa détention et ne le libère pas. L’implémentation reste couverte par dépendances injectées et n’a provoqué aucune mutation réelle, migration du registre, modification de compte ou suppression d’`AKS.Admin.Access`. Le détail et les preuves disponibles sont consignés dans [`ACCESS-002-01`](ACCESS-002-01.md).

Les validations locales atteignent 193/193 fichiers `.gs` syntaxiquement valides, 18/18 pour ACCESS-001, 19/19 pour ACCESS-002-01, 46/46 pour AUDIT-001 et 9/9 pour Inscriptions ciblés. La tête `84ea68f` a été synchronisée dans le projet Apps Script isolé de recette avec 226 fichiers, puis la suite cumulative a réussi à **477/477 tests, 0 échec**. Le recomptage de la suite confirme 477 fonctions uniques ; la valeur préparatoire 478 était un inventaire statique erroné.

`ACCESS-002-02 — Amorçage et migration` est cadré dans [`ACCESS-002-02`](ACCESS-002-02.md). Le prérequis qui matérialise `ACCESS_MANAGE` comme habilitation transverse explicite est intégré par la [PR applicative #94](https://github.com/karateseremange/AKS-Platform/pull/94), au commit [`e800bdb`](https://github.com/karateseremange/AKS-Platform/commit/e800bdbc38a7618921a12358bdfee1f28ec865e8). Le protocole interne de précontrôle, application et restauration réversible est ensuite intégré par la [PR applicative #95](https://github.com/karateseremange/AKS-Platform/pull/95), au commit [`bbedf0a`](https://github.com/karateseremange/AKS-Platform/commit/bbedf0a02c39e1680917013deda8840269964e28). La tête testée `be7323a` a été synchronisée avec 229 fichiers dans le projet Apps Script isolé, puis la campagne cumulative a réussi à **495/495 tests, 0 échec**.

Le précontrôle en lecture seule a ensuite réussi sur la cible isolée : registre absent, zéro compte avant, un compte proposé et `writePerformed:false`. Il a permis d'identifier avant toute mutation un écart entre le rôle `CONSULTATION` proposé par le code et le rôle descriptif `ADMINISTRATEUR` validé. Le Product Owner a confirmé `ADMINISTRATEUR + ACCESS_MANAGE`, sans `SUPER_ADMIN`, exception d'adresse ni autre capacité attribuée par la recette. La première tête `395de24` de la [PR applicative #96](https://github.com/karateseremange/AKS-Platform/pull/96) a été synchronisée avec **229 fichiers** puis validée à **496/496 tests, 0 échec**, mais la revue finale a montré que le moteur accordait encore implicitement toutes les capacités au rôle. La fusion a été bloquée avant mutation.

Le correctif fonctionnel `7dacc7b`, publié sur la tête `747c9a3`, supprime cet héritage dès qu'un registre existe, conserve le bootstrap historique uniquement lorsque le registre est absent et vérifie les droits effectifs du compte amorcé. Après les correctifs d’audit et de couverture cumulative, le commit applicatif `a1181ed` a été synchronisé avec **229 fichiers** dans la recette Apps Script isolée, puis la suite cumulative réelle a réussi à **507/507 tests, 0 échec**.

La recette réversible d’`ACCESS-002-02` est clôturée : connexion AUDIT persistante vérifiée, précontrôle sans écriture, application explicitement autorisée, accès gestionnaire et refus non habilité confirmés, preuves `INTENTION` et `REUSSI` persistantes pour l’application puis la restauration, révision initiale restaurée exactement, sauvegarde ACCESS supprimée, configuration AUDIT antérieure restaurée exactement et sauvegarde AUDIT supprimée. Aucun état temporaire ne subsiste ; l’amorçage permanent et la production restent hors périmètre. Cette validation permet d’ouvrir le cadrage d’`ACCESS-002-03 — Administration des utilisateurs`.

Le cadrage d’[`ACCESS-002-03`](ACCESS-002-03.md) borne l’incrément à la liste, la recherche, les filtres, la synthèse « Qui a accès à quoi ? », la création minimale d’un compte inactif sans habilitation et son cycle d’activation/désactivation. La fiche multi-rôle et l’édition détaillée des modules, cours, capacités et périodes restent dans `ACCESS-002-04`. Le premier lot de projection serveur est validé à 518/518. Le deuxième lot de commandes minimales est intégré au commit `066aebb` et validé dans Apps Script à 532/532 après synchronisation de 233 fichiers, sans mutation de registre. Le troisième lot de route et d’interface protégées est intégré au commit `846e666`, synchronisé avec 238 fichiers et validé à 537/537. L’écran et la navigation autorisés fonctionnent, tandis que l’accès direct d’un compte non habilité est refusé côté serveur sans projection. Le protocole réversible du lot 4 est en revue dans la PR applicative brouillon #104, validé localement à 5/5 et préparé à 542 références cumulatives. Aucune fonction de recette ni mutation du registre n’a été exécutée.

---

## 22. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.4.20 | 2026-08-13 | ACCESS-002-03 lot 4 préparé dans la PR applicative brouillon #104 : recette réversible du cycle de vie, restauration exacte et récupération automatique ; 5/5 tests ciblés, syntaxe 204/204 et suite préparée à 542 références, sans Apps Script ni mutation réelle |
| 0.4.19 | 2026-08-13 | ACCESS-002-03 lot 3 intégré par la PR #103 au commit `846e666`, 238 fichiers synchronisés et campagne 537/537 réussie ; écran/navigation autorisés et refus direct non habilité validés sans mutation de registre |
| 0.4.18 | 2026-08-13 | ACCESS-002-03 lot 3 publié dans la PR applicative brouillon #103 : route et interface protégées par ACCESS_MANAGE, navigation conditionnelle, confirmations et états de liste ; tests ciblés 5/5, syntaxe 202/202 et suite cumulative préparée à 537 références uniques, sans Apps Script ni mutation réelle |
| 0.4.17 | 2026-08-13 | ACCESS-002-03 lot 2 intégré par la PR #102 au commit `066aebb`, 233 fichiers synchronisés et campagne Apps Script 532/532 réussie sans commande de cycle de vie ni mutation de registre |
| 0.4.16 | 2026-08-13 | ACCESS-002-03 lot 2 corrigé après revue dans la PR applicative brouillon #102 : refus métier audités et révision courante imposée aux retours idempotents ; cycle de vie 13/13, socle ACCESS 20/20, syntaxe 200/200 et suite cumulative préparée à 532 références uniques, sans Apps Script ni donnée réelle |
| 0.4.15 | 2026-08-13 | ACCESS-002-03 lot 1 intégré par la PR #101 au commit `b41787d`, 231 fichiers synchronisés et campagne cumulative Apps Script 518/518 réussie sans mutation de registre ni donnée réelle |
| 0.4.14 | 2026-08-13 | ACCESS-002-03 engagé par la PR applicative brouillon #101 : projection serveur corrigée après revue pour dériver les modules des capacités effectives, validée localement à 11/11, syntaxe 198/198 et suite cumulative préparée à 518 références uniques, sans exécution Apps Script ni donnée réelle |
| 0.4.13 | 2026-08-13 | Cadrage ACCESS-002-03 validé par le Product Owner : création inactive avec rôle descriptif initial, aucune habilitation, réactivation avec effacement confirmé, liste sans pagination et filtres combinables ; implémentation non engagée avant intégration documentaire |
| 0.4.12 | 2026-08-13 | Premier cadrage d’ACCESS-002-03 en revue : projection serveur, liste/recherche/filtres, création inactive sans habilitation, activation/désactivation, synthèse des accès effectifs et séparation stricte de la fiche détaillée ACCESS-002-04 |
| 0.4.11 | 2026-08-13 | ACCESS-002-02 validé après synchronisation du commit `a1181ed`, campagne 507/507 et cycle réversible complet : audit connecté, application et accès/refus prouvés, restauration ACCESS puis déconnexion AUDIT exactes ; aucun état temporaire ou changement de production, ACCESS-002-03 devient le prochain incrément à cadrer |
| 0.4.10 | 2026-08-12 | Campagne cumulative 502/502 validée et garde-fou réel confirmé ; raccordement AUDIT persistant réversible préparé avec déconnexion interdite avant restauration ACCESS et reprise sûre des états partiels, prochaine campagne attendue à 507 tests |
| 0.4.9 | 2026-08-12 | `555ddd3` synchronisé et corpus antérieur validé à 498/498 ; trois tests d’audit omis de l’agrégateur cumulatif, correctif engagé avec garde structurel et nouvelle campagne attendue à 502 tests |
| 0.4.8 | 2026-08-12 | Campagne cumulative 498/498 réussie après synchronisation de `ff0431f`, mais faux positif du précontrôle confirmé ; second correctif engagé pour vérifier réellement le support d’audit avant toute lecture ou mutation ACCESS |
| 0.4.7 | 2026-08-11 | Recette ACCESS-002-02 arrêtée avant écriture faute d’audit persistant de recette ; registre intact confirmé ; correctif du précontrôle d’audit préparé, nouvelle application interdite avant validation |
| 0.4.6 | 2026-08-09 | Correctif fonctionnel de la PR #96 validé sur la tête `747c9a3` : 229 fichiers synchronisés et campagne cumulative réelle 497/497, sans application, restauration ni mutation du registre |
| 0.4.5 | 2026-08-09 | Revue finale de la PR #96 bloquée malgré 496/496 : retrait préparé des droits implicites `ADMINISTRATEUR`, bootstrap limité au registre absent, validations ciblées locales concluantes et suite cumulative portée à 497 tests uniques avant nouvelle recette Apps Script |
| 0.4.4 | 2026-08-09 | Correctif ACCESS-002-02 de la PR applicative #96 synchronisé sur la tête `395de24` avec 229 fichiers et campagne cumulative réelle 496/496, sans application, restauration ni mutation du registre |
| 0.4.3 | 2026-08-09 | Précontrôle ACCESS-002-02 réussi sans écriture ; choix `ADMINISTRATEUR + ACCESS_MANAGE` confirmé et correctif applicatif préparé avec une habilitation ACCESS unique, sans `SUPER_ADMIN`, exception d'adresse ni autre capacité |
| 0.4.2 | 2026-08-09 | Protocole réversible ACCESS-002-02 intégré au commit applicatif `bbedf0a`, tête `be7323a` synchronisée avec 229 fichiers et campagne isolée 495/495 consignée, sans exécution des fonctions de recette ni mutation réelle |
| 0.4.1 | 2026-08-09 | Prérequis explicite d’ACCESS-002-02 intégré au commit applicatif `e800bdb`, campagne isolée 484/484 consignée et prochain lot de recette réversible borné au précontrôle, à la sauvegarde et à la restauration, sans mutation réelle |
| 0.4.0 | 2026-08-09 | ACCESS-002-02 proposé : prérequis d’habilitation transverse explicite identifié, modèle `ACCESS` compatible avec `access/1.0` cadré et phases d’implémentation, recette réversible et amorçage réel séparées, sans mutation |
| 0.3.6 | 2026-08-09 | ACCESS-002-01 clôturé après fusion de la PR applicative #93 dans `develop` au commit `91ba7e3` ; prochain incrément ACCESS-002-02 à préparer séparément, sans amorçage réel |
| 0.3.5 | 2026-08-09 | Campagne Apps Script isolée d’ACCESS-002-01 consignée : tête `84ea68f`, 226 fichiers synchronisés et suite cumulative réelle 477/477 sans échec ; inventaire préparatoire 478 corrigé après recomptage |
| 0.3.4 | 2026-08-09 | Cinquième lot correctif documenté : verrou ACCESS/AUDIT partagé sans acquisition imbriquée, autorisation d’audit alignée, refus ACCESS bornés et suites nettoyées ; validations locales 193/193, 19/19 et 46/46, suite cumulative préparée à 478 fonctions uniques sans exécution Apps Script réelle |
| 0.3.3 | 2026-08-09 | Quatrième lot ACCESS-002-01 documenté : audit persistant obligatoire avant mutation, preuves corrélées, refus et restaurations tracés, restauration sur échec de preuve finale et métadonnées minimisées ; tests locaux 19/19 et AUDIT-001 ciblé 9/9, sans mutation réelle |
| 0.3.2 | 2026-08-09 | Troisième lot ACCESS-002-01 documenté : validation stricte et écriture atomique protégée avec révision, verrou, relecture, restauration, protection du dernier gestionnaire et réactivation sûre ; tests locaux 15/15, sans mutation réelle |
| 0.3.1 | 2026-08-09 | Réalisation d’ACCESS-002-01 engagée : documentation des deux premiers lots applicatifs publiés dans la PR brouillon #93, compatibilité historique et exclusions maintenues, référence cumulative réelle conservée à 455/455 |
| 0.3.0 | 2026-08-09 | Clôture de la conception : UX de la fiche validée, `aserridj@gmail.com` retenu comme premier gestionnaire sans rôle SUPER_ADMIN, stratégie d’amorçage/récupération validée et réalisation découpée en six incréments ACCESS-002-01 à ACCESS-002-06 |
| 0.2.0 | 2026-08-09 | Consolidation des décisions Product Owner : multi-rôle essentiel, habilitations explicites, portail privé personnalisé, ACCESS_MANAGE multi-gestionnaires et auto-administration auditée, validité temporelle, identité Google, historique, vue globale, Mes accès et backlog différé |
| 0.1.0 | 2026-08-09 | Premier cadrage d’ACCESS-002 après audit d’ACCESS-001 et décision de traiter l’administration des habilitations avant INSCRIPTIONS-011 |

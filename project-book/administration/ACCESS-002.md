# ACCESS-002 — Administration des utilisateurs et habilitations

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002 |
| **Titre** | Administration des utilisateurs et habilitations privées |
| **Version** | 0.3.3 |
| **Statut** | Réalisation engagée — ACCESS-002-01 en cours |
| **Nature** | Spécification fonctionnelle et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
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
| **ACCESS-002-02** | Amorçage et migration | `aserridj@gmail.com` devient le premier gestionnaire ACCESS-002 réel ; recette d’accès/refus/audit concluante ; mécanisme historique conservé en secours |
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

`ACCESS-002-01` est engagé dans la [PR applicative brouillon #93](https://github.com/karateseremange/AKS-Platform/pull/93). Quatre lots sont publiés : ajout compatible de `ANALYTICS_READ` au catalogue des capacités, façade administrative en lecture seule protégée côté serveur, validation stricte et écriture atomique avec verrou, révision optimiste, relecture et restauration vérifiée, puis audit persistant obligatoire avant/après avec corrélation, refus et restaurations tracés.

La compatibilité `access/1.0`, le rôle `ADMINISTRATEUR` historique et le bootstrap sont volontairement conservés pendant cette transition. La commande d’écriture exige désormais une preuve persistante avant mutation et restaure l’état précédent si la preuve finale échoue. Elle reste couverte par dépendances injectées et n’a provoqué aucune mutation réelle, migration du registre, modification de compte ou suppression d’`AKS.Admin.Access`. Le détail et les preuves disponibles sont consignés dans [`ACCESS-002-01`](ACCESS-002-01.md).

Les tests locaux ciblés atteignent 18/18 pour ACCESS-001, 19/19 pour ACCESS-002-01, 9/9 pour AUDIT-001 ciblé et 9/9 pour Inscriptions ciblés. La référence cumulative réelle reste **455/455 tests réussis, 0 échec** jusqu’à une nouvelle exécution Apps Script.

---

## 22. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.3.3 | 2026-08-09 | Quatrième lot ACCESS-002-01 documenté : audit persistant obligatoire avant mutation, preuves corrélées, refus et restaurations tracés, restauration sur échec de preuve finale et métadonnées minimisées ; tests locaux 19/19 et AUDIT-001 ciblé 9/9, sans mutation réelle |
| 0.3.2 | 2026-08-09 | Troisième lot ACCESS-002-01 documenté : validation stricte et écriture atomique protégée avec révision, verrou, relecture, restauration, protection du dernier gestionnaire et réactivation sûre ; tests locaux 15/15, sans mutation réelle |
| 0.3.1 | 2026-08-09 | Réalisation d’ACCESS-002-01 engagée : documentation des deux premiers lots applicatifs publiés dans la PR brouillon #93, compatibilité historique et exclusions maintenues, référence cumulative réelle conservée à 455/455 |
| 0.3.0 | 2026-08-09 | Clôture de la conception : UX de la fiche validée, `aserridj@gmail.com` retenu comme premier gestionnaire sans rôle SUPER_ADMIN, stratégie d’amorçage/récupération validée et réalisation découpée en six incréments ACCESS-002-01 à ACCESS-002-06 |
| 0.2.0 | 2026-08-09 | Consolidation des décisions Product Owner : multi-rôle essentiel, habilitations explicites, portail privé personnalisé, ACCESS_MANAGE multi-gestionnaires et auto-administration auditée, validité temporelle, identité Google, historique, vue globale, Mes accès et backlog différé |
| 0.1.0 | 2026-08-09 | Premier cadrage d’ACCESS-002 après audit d’ACCESS-001 et décision de traiter l’administration des habilitations avant INSCRIPTIONS-011 |

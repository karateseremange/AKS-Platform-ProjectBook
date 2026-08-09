# ACCESS-002 — Administration des utilisateurs et habilitations

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002 |
| **Titre** | Administration des utilisateurs et habilitations privées |
| **Version** | 0.2.0 |
| **Statut** | Cadrage fonctionnel consolidé — conception finale en cours |
| **Nature** | Spécification fonctionnelle et de sécurité |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

ACCESS-002 rend administrable le modèle d’autorisation transverse défini par `ACCESS-001`.

L’objectif est de permettre à un gestionnaire habilité de gérer depuis AKS Platform les comptes Google autorisés, leurs rôles, leurs modules accessibles, leurs affectations et leurs capacités, sans modifier le code ni les Script Properties manuellement.

ACCESS-002 ne remplace pas le moteur d’autorisation existant. Il s’appuie sur le registre central `AKS_ACCESS_REGISTRY` et sur `AKS_createAccessService_()` comme sources de vérité côté serveur.

Le présent document consolide les décisions fonctionnelles validées par le Product Owner le 9 août 2026. Trois sujets restent à arbitrer avant engagement du développement :

1. organisation détaillée de la fiche utilisateur et UX ;
2. stratégie d’initialisation et de migration de l’administrateur historique ;
3. découpage d’ACCESS-002 en incréments de réalisation.

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

### 2.4 Comptes et identité

28. Un compte est désactivé plutôt que supprimé physiquement afin de préserver la traçabilité.
29. Réactiver un ancien compte ne réactive jamais automatiquement ses anciennes habilitations.
30. L’adresse Google constitue l’identité technique du compte d’accès AKS.
31. Un changement d’adresse Google entraîne la création d’un nouveau compte d’accès ; l’ancien est désactivé et conservé pour l’historique.
32. Les adresses sont normalisées simplement côté serveur : suppression des espaces accidentels, passage en minuscules et contrôle de format.
33. L’unicité est stricte après normalisation, y compris vis-à-vis des comptes désactivés.
34. AKS ne tente pas de rapprocher automatiquement les alias Gmail, les adresses avec `+...` ou les variantes liées aux particularités de Gmail.

### 2.5 Temporalité

35. Une habilitation peut comporter facultativement une date de début et/ou une date de fin.
36. Sans date de fin, elle reste valable jusqu’à modification, désactivation du compte ou invalidation de son périmètre.
37. Une habilitation expirée est automatiquement non effective sans être supprimée et n’est jamais renouvelée automatiquement.
38. Une date de début future est autorisée et active automatiquement l’habilitation à cette date, tant que cela reste une simple règle de validité et ne nécessite pas de mécanisme complexe de planification.
39. Les autres habilitations encore valides d’un utilisateur restent inchangées lorsqu’une habilitation particulière expire.

---

## 3. État de l’existant

### 3.1 Déjà opérationnel

Le socle `ACCESS-001` fournit déjà :

- l’identité Google active via `Session.getActiveUser().getEmail()` ;
- le registre persistant `AKS_ACCESS_REGISTRY` ;
- les rôles `ADMINISTRATEUR`, `PROFESSEUR`, `ASSISTANT_AFA`, `CONSULTATION` ;
- les affectations explicites par saison et cours ;
- les capacités Présences ;
- les capacités Analytics ;
- les capacités Inscriptions ;
- le refus fermé en cas de registre absent, invalide ou ambigu ;
- la compatibilité avec l’ancien mécanisme administrateur pour amorçage ;
- la protection contre la perte du dernier administrateur selon le modèle existant ;
- la sauvegarde auditée du registre.

La saisie des présences est déjà raccordée à `ACCESS-001` côté serveur.

### 3.2 Raccordements encore historiques

Les écrans administratifs suivants utilisent encore `AKS.Admin.Access` et la liste historique d’administrateurs :

- Centre de pilotage ;
- Analytics administratif ;
- Configuration ;
- Journaux et écrans administratifs apparentés.

ACCESS-002 doit organiser leur migration vers le modèle de capacités sans réduire le niveau de sécurité existant.

---

## 4. Portail privé cible

Le Centre de pilotage évolue vers le portail privé commun d’AKS Platform.

Son accès ne signifie plus « administrateur ». Son contenu dépend des habilitations effectives de l’utilisateur.

Exemples :

- un professeur peut ne voir que Présences ;
- un professeur peut voir Présences et Analytics en lecture ;
- un responsable Inscriptions peut voir uniquement les fonctions Inscriptions qui lui sont attribuées ;
- un gestionnaire d’accès peut voir « Utilisateurs et habilitations » ;
- Configuration, Journaux, Audit et Maintenance restent invisibles et inaccessibles sans les capacités correspondantes.

Le portail affiche clairement le compte Google actuellement identifié afin que l’utilisateur sache avec quelle identité ses droits sont évalués.

Un compte authentifié sans habilitation active reçoit une page fonctionnelle claire indiquant qu’aucune habilitation active ne permet l’accès aux services privés. Le message utilisateur reste générique et ne révèle pas la cause technique détaillée.

Le serveur distingue néanmoins dans les journaux et l’audit : compte inconnu, compte désactivé, habilitations expirées et absence de capacité requise.

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

Aucune autorisation ne doit être déduite du client.

Les rôles et les habilitations sont deux dimensions distinctes. Un rôle peut être nécessaire pour rendre une capacité cohérente avec le modèle métier, mais il ne suffit jamais à ouvrir automatiquement un module.

---

## 6. Modules et niveaux d’accès

### 6.1 Présences

L’accès doit pouvoir être attribué :

- par saison ;
- par un ou plusieurs cours explicites ;
- avec les capacités autorisées par le rôle.

Un utilisateur sans affectation Présences ne voit aucun cours et ne peut ouvrir directement une route de saisie.

Aucune option « tous les cours actuels et futurs » n’est retenue.

### 6.2 Analytics

Les capacités minimales sont :

- `ANALYTICS_READ` ;
- `ANALYTICS_PREVIEW` ;
- `ANALYTICS_PUBLISH`.

La lecture, la prévisualisation et la publication sont dissociées et attribuées explicitement.

### 6.3 Inscriptions

ACCESS-002 expose les capacités définies par `ACCESS-001`, notamment :

- `INSCRIPTIONS_READ` ;
- `INSCRIPTIONS_ANALYZE_IMPORT` ;
- `INSCRIPTIONS_CONTROL` ;
- `INSCRIPTIONS_WRITE` ;
- `INSCRIPTIONS_APPLY_IMPORT` ;
- `INSCRIPTIONS_ACTIVATE`.

Le périmètre peut dépendre de la saison, de la section et, selon la capacité, du cours.

### 6.4 Administration générale

Les fonctions suivantes restent soumises à leurs capacités administratives :

- gestion des habilitations (`ACCESS_MANAGE`) ;
- Configuration ;
- Journaux ;
- Audit ;
- opérations de maintenance sensibles ;
- autres fonctions administratives futures.

---

## 7. Interface « Utilisateurs et habilitations »

### 7.1 Vue globale — « Qui a accès à quoi ? »

Réservée à `ACCESS_MANAGE`, elle fournit une synthèse consultative des comptes et de leurs droits effectifs.

Elle doit permettre au minimum :

- recherche par nom ou adresse Google ;
- filtre actif/inactif ;
- filtre par rôle ;
- filtre par module ;
- filtre sur l’état temporel des habilitations lorsque pertinent : active, future, expirée.

Les modifications se font depuis la fiche individuelle afin de limiter les erreurs.

Les exports CSV/Excel/PDF et fonctions de reporting ne font pas partie du périmètre initial.

### 7.2 Fiche utilisateur

La fiche doit permettre au minimum :

- édition du nom d’affichage ;
- activation/désactivation ;
- gestion multi-rôle ;
- affectations et capacités explicites ;
- sélection multiple de cours ;
- raccourci de sélection de tous les cours actuels d’une section sans héritage futur ;
- dates de début et de fin facultatives ;
- aperçu des droits effectifs avant enregistrement ;
- commentaire/motif facultatif ;
- historique fonctionnel des changements d’habilitations.

L’organisation visuelle détaillée de cette fiche reste à arbitrer avant développement.

### 7.3 Libellés et compréhension

L’interface privilégie les libellés métier compréhensibles :

- « Consulter Analytics » plutôt que `ANALYTICS_READ` ;
- « Contrôler les inscriptions » plutôt que `INSCRIPTIONS_CONTROL` ;
- « Saisir les présences » plutôt qu’un code technique.

Les codes stables restent utilisés côté serveur et dans les données.

### 7.4 Mes accès

Tout utilisateur authentifié peut consulter ses propres habilitations effectives dans une vue « Mes accès ».

Il ne peut pas consulter la liste des autres utilisateurs, leurs rôles, leurs affectations ou leurs habilitations sauf s’il possède `ACCESS_MANAGE`.

---

## 8. Sécurité

ACCESS-002 respecte les règles suivantes :

- toute lecture globale du registre exige `ACCESS_MANAGE` ;
- toute écriture du registre exige `ACCESS_MANAGE` ;
- le registre complet n’est jamais fourni à un utilisateur non autorisé ;
- les valeurs reçues du navigateur sont revalidées intégralement côté serveur ;
- les rôles, capacités, saisons, sections et cours sont vérifiés contre les catalogues serveur ;
- une modification invalide ne doit pas altérer le registre courant ;
- l’interface masquée ne constitue jamais un contrôle de sécurité ;
- toute URL ou tout appel direct non autorisé est refusé côté serveur ;
- les changements d’habilitations prennent effet immédiatement côté serveur, sans attendre une nouvelle connexion ;
- une page déjà ouverte ne constitue jamais une autorisation persistante ;
- le dernier gestionnaire actif disposant de `ACCESS_MANAGE` ne peut pas être désactivé ni perdre ce droit ;
- l’ancien mécanisme administrateur reste temporairement disponible comme filet de récupération pendant la migration ;
- l’attribution de `ACCESS_MANAGE` exige une confirmation renforcée.

Un détenteur de `ACCESS_MANAGE` peut modifier ses propres droits. Cette possibilité est assumée : `ACCESS_MANAGE` représente une décision de confiance forte. L’auto-attribution reste contrôlée et auditée comme toute autre modification.

---

## 9. Audit et traçabilité

Doivent produire une preuve d’audit :

- création d’un compte ;
- activation ou désactivation ;
- modification d’un rôle ;
- ajout ou retrait d’une affectation ;
- ajout ou retrait d’une capacité ;
- auto-attribution ou auto-retrait d’un rôle ou d’une capacité ;
- attribution ou retrait de `ACCESS_MANAGE` ;
- changement de période de validité ;
- tentative de modification refusée ;
- tentative de perte du dernier gestionnaire actif ;
- migration du mécanisme historique vers le registre persistant.

L’audit comporte au minimum :

- acteur ;
- action ;
- cible ;
- état avant ;
- état après ;
- résultat ;
- date ;
- identifiant de corrélation ;
- commentaire/motif lorsqu’il a été renseigné.

Lorsque l’auteur et la cible sont la même personne, l’auto-modification doit être explicitement identifiable.

La fiche utilisateur expose un historique fonctionnel lisible ; les preuves techniques complètes restent dans Audit/Journaux.

---

## 10. Comptes, désactivation et historique

La suppression physique systématique des comptes n’est pas retenue.

Un compte désactivé :

- perd immédiatement ses accès effectifs ;
- reste présent pour l’historique ;
- conserve la traçabilité des opérations passées.

Une réactivation :

- réactive le compte uniquement ;
- ne réactive aucune ancienne habilitation ;
- impose de nouvelles habilitations explicites si des accès sont nécessaires.

Un changement d’adresse Google est traité comme un changement d’identité technique : ancien compte désactivé, nouveau compte créé, aucune copie automatique des droits.

---

## 11. Validité temporelle

Une habilitation peut avoir :

- aucune borne ;
- une date de début uniquement ;
- une date de fin uniquement ;
- une date de début et une date de fin.

L’effectivité est évaluée côté serveur à chaque contrôle.

Une habilitation future est enregistrée mais non effective avant sa date de début. Une habilitation expirée reste historique mais n’accorde plus aucun droit. Aucun renouvellement automatique d’une saison à l’autre n’est effectué.

---

## 12. Migration des contrôles historiques

ACCESS-002 organise une migration progressive.

### Phase 1 — registre administrable

- rendre le registre consultable et modifiable par l’interface ;
- conserver l’ancien mécanisme comme filet de récupération ;
- initialiser et valider au moins un gestionnaire dans le registre persistant.

### Phase 2 — Présences

- conserver le raccordement existant à ACCESS-001 ;
- vérifier la non-régression avec plusieurs profils réels de recette.

### Phase 3 — Analytics

- remplacer le contrôle administrateur générique par les capacités Analytics ;
- permettre la lecture sans donner les droits d’administration globale.

### Phase 4 — Portail privé et administration

- faire évoluer le Centre de pilotage en portail privé personnalisé ;
- distinguer les fonctions administratives des modules métier délégables ;
- migrer Configuration, Journaux et Audit vers les capacités adéquates.

### Phase 5 — Inscriptions

- utiliser directement les capacités ACCESS-001 lors des futurs écrans et opérations métier.

Le détail de l’initialisation du compte administrateur historique reste à valider avant développement.

Aucune phase ne supprime le mécanisme de récupération tant qu’un test réel d’accès autorisé, de refus et de protection du dernier gestionnaire n’a pas été validé.

---

## 13. Hors périmètre ACCESS-002 V1

ACCESS-002 V1 ne comprend pas :

- authentification par mot de passe propre à AKS Platform ;
- création de comptes Google ;
- annuaire RH ;
- espace licencié public ;
- délégation automatique de droits selon le titre ou la fonction associative ;
- ouverture automatique de tous les modules aux professeurs ;
- héritage automatique de droits depuis des profils types ;
- suppression physique systématique des anciens comptes ;
- notification e-mail automatique lors d’un changement d’habilitations ;
- duplication automatique ou assistée des habilitations d’une saison vers la suivante ;
- modification groupée de plusieurs utilisateurs ;
- export CSV/Excel/PDF ou reporting dédié des habilitations ;
- développement fonctionnel d’INSCRIPTIONS-011.

---

## 14. Évolutions différées à conserver au backlog

Les besoins suivants sont identifiés mais non engagés et ne reçoivent pas de version cible tant que leur valeur n’est pas confirmée par l’usage :

1. notifications e-mail lors d’un changement d’habilitations ;
2. duplication assistée des habilitations d’une saison vers la suivante ;
3. modifications groupées de plusieurs utilisateurs ;
4. exports et reporting des habilitations ;
5. modèles d’aide à l’attribution de droits, à condition qu’ils restent des aides de saisie et ne créent jamais d’héritage implicite.

Ces éléments doivent être réévalués après retour d’usage. Leur présence dans le backlog ne constitue pas un engagement de réalisation.

---

## 15. Critères d’acceptation consolidés

ACCESS-002 sera considéré comme fonctionnel lorsque, au minimum :

1. un détenteur de `ACCESS_MANAGE` peut ouvrir et utiliser « Utilisateurs et habilitations » ;
2. un utilisateur non autorisé ne peut ni lire ni modifier le registre ;
3. un compte Google peut être ajouté, activé ou désactivé ;
4. l’unicité des adresses normalisées est garantie ;
5. plusieurs rôles peuvent être attribués à un compte sans ouverture automatique de module ;
6. un compte actif sans habilitation ne peut accéder à aucun module privé ;
7. un professeur peut être configuré sans Présences ;
8. un utilisateur peut être limité à un ou plusieurs cours Présences explicites ;
9. la sélection de tous les cours actuels d’une section n’accorde aucun droit sur les futurs cours ;
10. Analytics Lecture/Prévisualisation/Publication sont indépendants ;
11. les capacités Inscriptions sont configurables indépendamment de l’administration globale ;
12. les habilitations futures et expirées sont correctement évaluées côté serveur ;
13. une URL directe vers un module non autorisé est refusée ;
14. le portail privé n’affiche que les fonctions autorisées ;
15. « Mes accès » expose uniquement les propres droits de l’utilisateur ;
16. la vue « Qui a accès à quoi ? » est réservée à `ACCESS_MANAGE` ;
17. plusieurs gestionnaires `ACCESS_MANAGE` peuvent coexister ;
18. un gestionnaire peut modifier ses propres habilitations et cette auto-modification est auditée ;
19. aucune opération ne peut laisser zéro gestionnaire actif ;
20. la désactivation d’un compte retire immédiatement ses accès ;
21. la réactivation d’un compte ne restaure pas ses anciennes habilitations ;
22. chaque modification conserve auteur, cible, avant/après, résultat, date et corrélation ;
23. le commentaire facultatif est conservé lorsqu’il est renseigné ;
24. une écriture invalide laisse le registre précédent intact ;
25. le mécanisme de récupération administrateur est testé avant retrait de l’ancien système ;
26. les tests ACCESS-001 restent valides ;
27. aucune régression n’est introduite dans Présences, Analytics ou les écrans administratifs existants.

---

## 16. Stratégie de recette

La recette utilise plusieurs comptes Google réels ou profils représentatifs, au minimum :

- gestionnaire principal avec `ACCESS_MANAGE` ;
- second gestionnaire ;
- professeur avec Présences sur un seul cours ;
- professeur multi-rôle ;
- professeur sans Présences mais avec Analytics en lecture ;
- assistant AFA avec droits limités ;
- utilisateur `CONSULTATION` ;
- compte actif sans habilitation ;
- compte avec habilitation future ;
- compte avec habilitation expirée ;
- compte inactif ;
- compte inconnu.

La recette porte sur l’affichage et surtout sur les appels serveur directs.

Des scénarios dédiés vérifient l’auto-attribution par un gestionnaire, la protection du dernier gestionnaire, l’archivage d’un cours, la désactivation/réactivation et le changement d’identité Google.

---

## 17. Dépendances

ACCESS-002 dépend notamment de :

- `ACCESS-001` ;
- `ADMIN-001` à `ADMIN-005` ;
- `SECURITY-001` ;
- `AUDIT-001` ;
- `CONFIG-001` ;
- `LOG-001` ;
- `ANALYTICS-SAISIE-001` ;
- `INSCRIPTIONS-004` ;
- catalogues serveur de saisons, sections et cours.

---

## 18. Ordre produit retenu

```text
INSCRIPTIONS-010 — clôturé
        ↓
ACCESS-002 — administration transverse des habilitations
        ↓
INSCRIPTIONS-011 — premier incrément métier Inscriptions
```

ACCESS-002 est un préalable au développement du prochain écran privé sensible d’AKS Inscriptions.

---

## 19. Décisions de conception restant à valider

Le cadrage fonctionnel est suffisamment consolidé. La revue Product Owner ne doit pas se poursuivre par une série indéfinie de micro-décisions.

Trois sujets restent volontairement ouverts :

1. **Fiche utilisateur et UX** — organisation visuelle et parcours précis ;
2. **Initialisation / migration administrateur** — amorçage du premier gestionnaire et retrait sécurisé de `AKS.Admin.Access` ;
3. **Découpage ACCESS-002** — définition des incréments de développement et de recette.

Ces trois arbitrages doivent être traités avant de déclarer ACCESS-002 engagé pour réalisation.

---

## 20. Définition de terminé

ACCESS-002 est terminé lorsque :

- le registre est administrable depuis l’interface privée ;
- le portail est personnalisé selon les droits effectifs ;
- les droits restent systématiquement contrôlés côté serveur ;
- le multi-rôle fonctionne sans héritage automatique de droits ;
- Présences conserve son fonctionnement avec affectations explicites ;
- Analytics utilise ses capacités propres ;
- les capacités Inscriptions sont administrables ;
- les fonctions administratives sont distinguées des modules métier ;
- la protection du dernier gestionnaire actif est effective ;
- la récupération administrateur est documentée et testée ;
- les changements sont audités avec état avant/après ;
- la recette multi-profils est concluante ;
- les évolutions différées sont conservées au backlog sans être confondues avec le périmètre V1 ;
- le Project Book reflète le comportement réellement livré.

---

## 21. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.2.0 | 2026-08-09 | Consolidation des décisions Product Owner : multi-rôle essentiel, habilitations explicites, portail privé personnalisé, ACCESS_MANAGE multi-gestionnaires et auto-administration auditée, validité temporelle, identité Google, historique, vue globale, Mes accès et backlog différé |
| 0.1.0 | 2026-08-09 | Premier cadrage d’ACCESS-002 après audit d’ACCESS-001 et décision de traiter l’administration des habilitations avant INSCRIPTIONS-011 |

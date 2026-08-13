# ACCESS-002-03 — Administration des utilisateurs

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-03 |
| **Titre** | Liste, recherche et cycle de vie des comptes d’accès |
| **Version** | 0.7.0 |
| **Statut** | Réalisation engagée — lot 3 en revue |
| **Nature** | Spécification d’incrément fonctionnel et technique |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-13 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-03` fournit la première interface exploitable de gestion des comptes d’accès AKS. L’incrément permet à un détenteur effectif de `ACCESS_MANAGE` de consulter les comptes, rechercher et filtrer la liste, créer un compte minimal, l’activer ou le désactiver et comprendre synthétiquement « qui a accès à quoi ».

L’incrément ne fournit pas encore la fiche complète d’édition des rôles, modules, cours, capacités et périodes. Cette responsabilité reste celle d’`ACCESS-002-04`. La séparation évite qu’une première interface de cycle de vie devienne un éditeur partiel du registre ou réintroduise des droits implicites.

## 2. Point de départ vérifié

`ACCESS-002-01` fournit déjà :

- une lecture administrative protégée par `ACCESS_MANAGE` ;
- une vue défensive immuable du registre `access/1.0` ;
- une écriture atomique avec révision optimiste et verrou de script ;
- une normalisation et une validation intégrales côté serveur ;
- la protection du dernier gestionnaire effectif ;
- la règle de réactivation sans anciennes habilitations ;
- des preuves d’audit persistantes corrélées avant et après mutation ;
- une restauration vérifiée en cas d’échec de persistance ou de preuve finale.

`ACCESS-002-02` est validé en version `1.0.0`. Sa recette isolée a réussi à **507/507 tests, 0 échec** et a démontré l’application, les accès/refus, l’audit persistant et les restaurations exactes d’ACCESS puis d’AUDIT. Aucun état temporaire n’a été conservé et aucun amorçage permanent n’est présupposé par le présent cadrage.

La protection du dernier gestionnaire interdit toute première écriture qui laisserait le registre sans détenteur effectif de `ACCESS_MANAGE`. L’interface peut être développée et testée avec des dépendances injectées sans amorçage permanent, mais sa recette de mutation exige soit un registre isolé préparé réversiblement avec un gestionnaire, soit une autorisation distincte d’amorçage permanent. `ACCESS-002-03` ne doit jamais contourner cette précondition.

Le Web App administratif utilise encore `AKS.Admin.Access` et ne possède aucune route « Utilisateurs et habilitations ». `AKS.Core.AccessAdmin` expose actuellement la lecture et la mise à jour globale du registre ; aucun modèle de liste, contrôleur Web ou écran ACCESS n’est encore intégré.

## 3. Résultat fonctionnel attendu

### 3.1 Vue « Utilisateurs et habilitations »

La nouvelle destination administrative affiche une liste synthétique et lisible. Chaque ligne présente au minimum :

- le nom d’affichage ;
- l’adresse Google normalisée ;
- le statut actif ou inactif ;
- les rôles descriptifs ;
- le nombre d’habilitations enregistrées ;
- le nombre d’habilitations actuellement effectives ;
- les modules effectivement accessibles sous forme de synthèse ;
- l’état temporel global : effectif, futur, expiré, inactif ou sans habilitation ;
- la date et l’auteur de la dernière modification lorsque ces métadonnées existent.

La vue ne présente jamais un rôle comme une autorisation. Elle distingue visuellement la fonction de la personne, l’état du compte et ses habilitations effectives.

### 3.2 Recherche et filtres

La recherche porte sans distinction de casse sur le nom d’affichage et l’adresse Google. Les filtres initiaux sont :

- statut du compte : tous, actif ou inactif ;
- rôle descriptif ;
- module accessible ;
- état temporel : effectif, futur, expiré ou sans habilitation.

Les filtres sont combinables. La liste indique le nombre de résultats et permet une réinitialisation explicite. Un état vide explique si aucun compte n’existe ou si aucun compte ne correspond aux critères.

Le tri initial est déterministe : comptes actifs avant les comptes inactifs, puis nom d’affichage et adresse Google. Aucun tri implicite par niveau de droit n’est introduit.

### 3.3 Création minimale d’un compte

La création exige :

- une adresse Google valide et unique après normalisation ;
- un nom d’affichage ;
- exactement un rôle descriptif initial issu du catalogue serveur.

Le compte est créé **inactif**, sans affectation et sans capacité. Sa création ne donne donc accès à aucun module. L’activation constitue une action distincte et explicite. Le multi-rôle, les habilitations, les capacités et les périodes seront administrés dans `ACCESS-002-04`.

L’adresse Google devient immuable après création. Une erreur d’identité est traitée selon la règle validée : ancien compte désactivé et nouveau compte créé, sans copie automatique des droits.

### 3.4 Activation et désactivation

La désactivation :

- prend effet immédiatement côté serveur ;
- conserve le compte, ses rôles, ses habilitations et ses métadonnées pour l’historique ;
- est refusée si elle laisserait zéro gestionnaire effectif ;
- nécessite une confirmation explicite.

La réactivation :

- est refusée tant que d’anciennes affectations sont encore attachées au compte ;
- exige leur retrait explicite dans la même commande ou, dans le périmètre de cet incrément, propose une réactivation qui les efface après confirmation ;
- conserve les rôles descriptifs ;
- ne restaure aucune ancienne habilitation ;
- produit donc un compte actif sans accès métier tant qu’`ACCESS-002-04` n’a pas attribué de nouvelles habilitations.

La suppression physique d’un compte est interdite dans cet incrément.

### 3.5 Vue « Qui a accès à quoi ? »

La vue globale est consultative. Elle synthétise les accès effectifs calculés à la date de consultation et permet de repérer :

- les comptes actifs sans habilitation ;
- les comptes inactifs conservant un historique ;
- les habilitations futures ou expirées ;
- les modules et périmètres actuellement accessibles ;
- les détenteurs effectifs de `ACCESS_MANAGE`.

Elle ne remplace pas la fiche détaillée d’`ACCESS-002-04` et ne permet aucune modification en ligne des rôles ou habilitations.

## 4. Contrat serveur proposé

Le navigateur n’obtient pas directement le registre persistant et ne construit jamais seul une nouvelle version globale. Un service d’application ACCESS dédié compose des commandes métier minimales au-dessus d’`AKS.Core.AccessAdmin`.

Le contrat initial comprend :

1. `listAccounts(query)` — contrôle `ACCESS_MANAGE`, normalise les critères, calcule les états effectifs côté serveur et retourne une projection immuable ;
2. `createAccount(command)` — crée un compte inactif, sans affectation, avec un rôle initial unique ;
3. `deactivateAccount(command)` — désactive un compte sous révision optimiste et protège le dernier gestionnaire ;
4. `reactivateAccount(command)` — réactive un compte après suppression confirmée de ses anciennes affectations ;
5. `getAccountSummary(accountId)` — retourne la synthèse consultative utile à la confirmation, sans ouvrir l’édition détaillée.

Chaque commande de mutation contient au minimum l’adresse cible normalisée, la révision attendue et un identifiant de requête destiné à prévenir les doubles soumissions côté interface. Le serveur relit toujours l’état courant sous verrou et ne fait jamais confiance à une projection reçue du navigateur.

Les erreurs publiques restent bornées : non autorisé, compte introuvable, compte déjà existant, commande invalide, conflit de révision, dernier gestionnaire requis, audit indisponible ou service momentanément indisponible. Aucun registre intégral, détail interne ou identité non nécessaire n’est inclus dans le message public.

## 5. Modèle de lecture

La projection de liste est distincte du schéma persistant. Elle contient uniquement les informations nécessaires à l’écran, notamment :

| Champ | Règle |
|---|---|
| `accountId` | Adresse Google normalisée utilisée comme identifiant technique stable |
| `displayName` | Valeur d’affichage nettoyée |
| `status` | `ACTIVE` ou `INACTIVE` |
| `roles` | Rôles descriptifs triés, sans capacité implicite |
| `assignmentCount` | Nombre d’affectations enregistrées |
| `effectiveAssignmentCount` | Nombre d’affectations effectives à la date serveur |
| `effectiveModules` | Modules effectivement accessibles, triés et dédupliqués |
| `temporalState` | État synthétique calculé côté serveur |
| `accessManager` | Vrai uniquement si `ACCESS_MANAGE` est effectivement accordé |
| `updatedAt`, `updatedBy` | Métadonnées serveur disponibles |

La réponse globale contient la révision courante, les critères normalisés, le nombre total de comptes, le nombre de résultats et la liste triée. Aucun cache client n’est une source d’autorisation.

## 6. Interface et navigation

Une route administrative dédiée, par exemple `?app=access`, est ajoutée au Web App. Son contrôleur :

1. identifie le compte Google côté serveur ;
2. exige `ACCESS_MANAGE` via le nouveau modèle ACCESS ;
3. construit le modèle initial sans exposer le registre brut ;
4. rend une page utilisant les fondations visuelles et accessibles de l’administration existante ;
5. fournit un retour explicite vers le Centre de pilotage.

La destination « Utilisateurs et habilitations » n’apparaît dans la navigation que lorsque la capacité effective `ACCESS_MANAGE` est confirmée côté serveur. La disparition du lien ne remplace jamais le contrôle de la route ni celui des appels asynchrones.

L’interface doit au minimum gérer : chargement, résultat, filtres actifs, état vide, confirmation sensible, succès, conflit de révision, erreur récupérable et refus d’accès. Les boutons de mutation sont désactivés pendant le traitement afin d’éviter les doubles soumissions.

## 7. Sécurité et audit

Toutes les lectures et mutations globales exigent `ACCESS_MANAGE`. Les commandes utilisent le mécanisme atomique et audité déjà intégré ; elles ne contournent ni la validation du registre, ni le verrou, ni la révision optimiste, ni la protection du dernier gestionnaire.

Les créations, activations, désactivations et refus produisent les preuves persistantes prévues par `AUDIT-001`. Les métadonnées d’audit restent minimisées et permettent d’identifier la cible, l’acteur, le type de changement, les révisions avant/après, l’auto-modification et le résultat sans recopier le registre complet.

Une auto-désactivation ou une action touchant un détenteur de `ACCESS_MANAGE` reçoit une confirmation renforcée. Aucune confirmation côté navigateur ne peut lever une interdiction serveur.

## 8. Idempotence et concurrence

La lecture est sans écriture. Les mutations sont idempotentes au niveau métier :

- créer un compte déjà présent est refusé sans fusion ;
- désactiver un compte déjà inactif retourne l’état courant sans nouvelle écriture ;
- réactiver un compte déjà actif retourne l’état courant sans nouvelle écriture ;
- une révision obsolète retourne un conflit et impose le rechargement ;
- une double soumission avec le même identifiant de requête ne crée pas deux mutations.

L’idempotence ne permet jamais d’accepter silencieusement une commande dont les paramètres diffèrent de l’état attendu.

## 9. Périmètre applicatif de l’incrément

L’implémentation attendue couvre :

1. le service serveur de projection, recherche et filtres ;
2. les commandes métier de création minimale, désactivation et réactivation ;
3. la route et le contrôleur Web protégés ;
4. la page de liste et sa synthèse « Qui a accès à quoi ? » ;
5. l’entrée de navigation conditionnée par `ACCESS_MANAGE` ;
6. les confirmations et retours d’action accessibles ;
7. les tests unitaires, de contrat, de sécurité, d’audit, de concurrence et de non-régression ;
8. une recette dans le projet Apps Script isolé avant toute fusion finale.

## 10. Hors périmètre

Sont exclus :

- l’édition détaillée des rôles multiples ;
- l’attribution ou le retrait d’habilitations, modules, cours ou capacités ;
- la gestion des périodes de validité ;
- l’historique fonctionnel détaillé d’une fiche ;
- la modification d’une adresse Google existante ;
- la suppression physique d’un compte ;
- les notifications e-mail ;
- les imports, exports, opérations groupées et duplication inter-saisons ;
- « Mes accès » et la personnalisation complète du portail privé ;
- la migration définitive des modules depuis `AKS.Admin.Access` ;
- l’amorçage permanent, la production et toute modification de `main`.

Ces exclusions restent attribuées à `ACCESS-002-04` à `ACCESS-002-06` ou au backlog validé.

## 11. Scénarios de validation minimaux

| ID | Scénario | Résultat attendu |
|---|---|---|
| A03-01 | Liste avec `ACCESS_MANAGE` | Projection complète et immuable, sans registre brut |
| A03-02 | Liste sans `ACCESS_MANAGE` | Refus serveur sans donnée retournée |
| A03-03 | Recherche nom/adresse | Résultats insensibles à la casse et déterministes |
| A03-04 | Filtres combinés | Résultats, compteur et critères normalisés cohérents |
| A03-05 | Création minimale valide | Compte inactif, rôle initial unique, aucune affectation |
| A03-06 | Adresse invalide ou dupliquée | Refus sans écriture |
| A03-07 | Désactivation d’un compte ordinaire | Compte inactif, historique conservé, accès immédiatement refusés |
| A03-08 | Désactivation du dernier gestionnaire | Refus `ACCESS_LAST_MANAGER_REQUIRED` |
| A03-09 | Réactivation avec anciennes affectations | Effacement explicitement confirmé, compte actif sans habilitation |
| A03-10 | Réactivation sans confirmation d’effacement | Refus sans écriture |
| A03-11 | Révision concurrente | Conflit, aucune écriture de la commande obsolète |
| A03-12 | Double soumission | Une seule mutation et un résultat idempotent |
| A03-13 | Audit avant/après | Preuves corrélées persistantes et métadonnées minimisées |
| A03-14 | Échec de preuve finale | Restauration exacte et réussite non confirmée |
| A03-15 | Route directe non autorisée | Refus générique côté serveur |
| A03-16 | Navigation sans capacité | Destination absente et route toujours protégée |
| A03-17 | Suite cumulative | Tous les tests antérieurs restent concluants |

## 12. Stratégie de réalisation

La réalisation est proposée en quatre lots revus séparément :

1. **projection serveur** — calcul des états, recherche, filtres, tri et tests purs ;
2. **commandes de cycle de vie** — création minimale, désactivation, réactivation, idempotence et audit ;
3. **route et interface** — contrôleur protégé, liste, filtres, confirmations et navigation ;
4. **recette et clôture** — synchronisation isolée, campagne cumulative, tests d’accès/refus, mutations réversibles autorisées et documentation finale.

Aucune donnée réelle n’est modifiée pendant les trois premiers lots. Toute recette qui crée ou modifie des comptes dans le registre isolé exige une autorisation explicite distincte, un gestionnaire effectif préparé sans contourner la protection du dernier gestionnaire et une procédure de restauration vérifiée.

## 13. Critères d’acceptation

`ACCESS-002-03` est terminé lorsque :

1. la route, la lecture et toutes les mutations sont protégées par `ACCESS_MANAGE` côté serveur ;
2. la liste, la recherche, les filtres, les compteurs et les états vides sont utilisables ;
3. la synthèse distingue rôles, statut, habilitations enregistrées et accès effectifs ;
4. la création produit un compte inactif sans habilitation ;
5. l’activation et la désactivation respectent l’historique et la protection du dernier gestionnaire ;
6. aucune ancienne habilitation n’est restaurée automatiquement ;
7. les doubles soumissions et conflits de révision sont traités sans mutation indésirable ;
8. les preuves d’audit persistantes et la restauration sur échec sont vérifiées ;
9. la recette isolée et la suite cumulative sont concluantes ;
10. aucune fonctionnalité d’`ACCESS-002-04`, production ou branche `main` n’est modifiée ;
11. le Project Book reflète exactement l’état livré.

## 14. Décisions validées

Le Product Owner a validé le 13 août 2026 les décisions suivantes :

1. création par défaut en statut `INACTIVE` ;
2. un rôle descriptif initial obligatoire, sans multi-rôle dans cet incrément ;
3. aucune affectation ni capacité à la création ;
4. réactivation avec suppression explicite et confirmée des anciennes affectations ;
5. liste complète triée côté serveur, sans pagination pour le volume actuel du club ;
6. filtres combinables sur statut, rôle, module et état temporel ;
7. aucun amorçage permanent requis pour implémenter et tester les lots sans donnée réelle.

Le cadrage a été intégré dans `develop`, ce qui a permis d’engager le premier lot. Cette validation fonctionnelle n’autorise aucune mutation de donnée réelle, recette modifiant le registre, production, branche `main` ou déploiement.

## 15. Lot 1 — projection serveur validée

La [PR applicative #101](https://github.com/karateseremange/AKS-Platform/pull/101) a intégré le premier lot dans `develop` au commit [`b41787d`](https://github.com/karateseremange/AKS-Platform/commit/b41787dddf290f67a2d3d673ba7ae05ed38fe438), limité à la lecture :

- projection minimisée distincte du registre persistant ;
- calcul à la date serveur des affectations et modules effectifs ;
- recherche normalisée sur le nom et l’adresse ;
- filtres combinables par statut, rôle, module et état temporel ;
- tri stable, compteurs et résultat profondément immuable ;
- refus fermé des valeurs de filtre inconnues avant lecture administrative.

Les validations locales réussissent à **11/11** pour la suite ciblée, notamment la non-régression qui interdit de déduire un accès Présences du seul rôle descriptif. La syntaxe est valide sur **198/198 fichiers `.gs`**. Après fusion, le commit `b41787d` a été synchronisé dans la recette Apps Script avec **231 fichiers**, puis la campagne cumulative réelle a réussi à **518/518 tests, 0 échec**. La campagne reste strictement en lecture pour ce lot : aucune mutation de registre ni donnée réelle n’a été exécutée.

## 16. Lot 2 — commandes de cycle de vie validées

La [PR applicative #102](https://github.com/karateseremange/AKS-Platform/pull/102) a intégré les commandes serveur minimales dans `develop` au commit [`066aebb`](https://github.com/karateseremange/AKS-Platform/commit/066aebb0623d88aa6509f0b90ae9108fd1bf0c86) :

- création inactive avec un rôle descriptif unique et aucune affectation ;
- désactivation avec conservation des rôles, affectations et métadonnées historiques ;
- réactivation avec effacement explicitement confirmé des anciennes affectations ;
- retour idempotent sans écriture lorsque l’état demandé est déjà atteint ;
- validation fermée de l’identité, du rôle, de la révision et de l’identifiant de requête ;
- délégation au socle audité `AccessAdmin` pour toute écriture et preuve `REFUSE` pour les refus métier ;
- contrôle de la révision courante avant tout retour idempotent sans écriture.

Après correction de revue, les validations locales réussissent à **13/13** pour le cycle de vie et **20/20** pour le socle administratif ACCESS. La syntaxe est valide sur **200/200 fichiers `.gs`**. Après fusion, le commit `066aebb` a été synchronisé dans la recette Apps Script avec **233 fichiers**, puis la campagne cumulative réelle a réussi à **532/532 tests, 0 échec**. Aucune commande de cycle de vie ni mutation de registre n’a été exécutée pendant cette campagne.

## 17. Lot 3 — route et interface en revue

La [PR applicative brouillon #103](https://github.com/karateseremange/AKS-Platform/pull/103) publie la route et l’interface d’administration :

- route `?app=access` et chaque appel serveur protégés par `ACCESS_MANAGE` ;
- destination de navigation absente lorsque cette capacité effective n’est pas confirmée ;
- liste avec recherche, filtres combinables, compteurs et état vide ;
- création inactive sans habilitation, désactivation et réactivation avec confirmations explicites ;
- révision optimiste, identifiant de requête et blocage client des doubles soumissions ;
- réactivation avec avertissement renforcé avant effacement des anciennes habilitations.

Les **5/5 tests ciblés** de contrôleur, autorisation, navigation et états interactifs réussissent localement. La syntaxe est valide sur **202/202 fichiers `.gs`** et la suite cumulative est préparée à **537 références uniques**. Aucune synchronisation Apps Script, commande de cycle de vie ou mutation de registre n’a été exécutée pour ce lot.

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.7.0 | 2026-08-13 | Lot 3 publié dans la PR applicative brouillon #103 : route et commandes protégées par ACCESS_MANAGE, navigation conditionnelle, liste/recherche/filtres/états vides, confirmations et blocage des doubles soumissions ; tests ciblés 5/5, syntaxe 202/202 et suite cumulative préparée à 537 références uniques, sans Apps Script ni mutation réelle |
| 0.6.0 | 2026-08-13 | Lot 2 intégré dans `develop` par la PR applicative #102 au commit `066aebb`, synchronisé avec 233 fichiers puis validé dans Apps Script à 532/532 sans échec ; aucune commande de cycle de vie ni mutation de registre exécutée |
| 0.5.0 | 2026-08-13 | Lot 2 publié puis corrigé après revue dans la PR applicative brouillon #102 : refus métier audités sans écriture et révision courante exigée avant retour idempotent ; cycle de vie 13/13, socle ACCESS 20/20, syntaxe 200/200 et inventaire cumulatif préparé à 532 références uniques, sans Apps Script ni donnée réelle |
| 0.4.0 | 2026-08-13 | Lot 1 intégré dans `develop` par la PR applicative #101 au commit `b41787d`, synchronisé avec 231 fichiers dans Apps Script puis validé par la campagne cumulative réelle 518/518 sans échec ; aucune mutation de registre ni donnée réelle |
| 0.3.0 | 2026-08-13 | Premier lot applicatif publié puis corrigé après revue dans la PR brouillon #101 : projection serveur en lecture seule, modules dérivés des capacités réellement effectives, recherche, filtres combinés, tri stable et immutabilité ; tests ciblés 11/11, syntaxe 198/198 et inventaire cumulatif préparé à 518 références uniques, sans exécution Apps Script ni donnée réelle |
| 0.2.0 | 2026-08-13 | Validation Product Owner des sept décisions : création inactive, rôle descriptif initial unique, aucune habilitation à la création, réactivation avec effacement confirmé des anciennes affectations, liste sans pagination au volume actuel, filtres combinables et intégration documentaire préalable à l’implémentation |
| 0.1.0 | 2026-08-13 | Premier cadrage d’ACCESS-002-03 : liste et synthèse « Qui a accès à quoi ? », recherche/filtres, création inactive sans habilitation, activation/désactivation, projection serveur, route protégée, audit, concurrence, recette réversible et séparation stricte d’ACCESS-002-04 |

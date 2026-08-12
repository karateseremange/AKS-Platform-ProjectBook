# ACCESS-002-02 — Amorçage et migration du premier gestionnaire

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-02 |
| **Titre** | Amorçage contrôlé et migration du premier gestionnaire ACCESS |
| **Version** | 0.11.0 |
| **Statut** | Raccordement réversible de l’audit en revue — application interdite |
| **Nature** | Spécification d’incrément, plan de migration et de recette |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-12 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-02` prépare puis exécute de manière contrôlée l’amorçage du premier gestionnaire réel du registre `AKS_ACCESS_REGISTRY`.

L’incrément doit permettre à `aserridj@gmail.com` de disposer explicitement de `ACCESS_MANAGE`, vérifier les accès autorisés et refusés ainsi que les preuves d’audit, puis conserver l’ancien mécanisme `AKS.Admin.Access` comme filet temporaire de récupération.

Le protocole applicatif réversible est intégré dans la recette Apps Script isolée. Les quatre propriétés de garde ont été configurées et le précontrôle en lecture seule a réussi. La première tête de la [PR applicative #96](https://github.com/karateseremange/AKS-Platform/pull/96) a été synchronisée et validée à **496/496 tests, 0 échec**, mais la revue finale a montré que le moteur accordait encore des droits implicites au rôle `ADMINISTRATEUR`. La tête corrigée `747c9a3` a ensuite été synchronisée avec **229 fichiers** et validée dans Apps Script à **497/497 tests, 0 échec**. Le présent état n'autorise aucune application ni restauration, modification du registre, modification de compte ou déploiement.

## 2. Anomalie observée le 11 août 2026

Après autorisation de la recette réversible, `AKS_applyAccess002Recipe` s’est arrêtée sur `ACCESS_AUDIT_REQUIRED` lors de la persistance de la preuve `INTENTION`. Le journal d’audit exposait `environment:"production"` et `AUDIT_RECIPE_REQUIRED`, alors que les gardes ACCESS confirmaient la cible `RECETTE`. L’échec est donc intervenu avant l’écriture du registre ; la sauvegarde temporaire a été supprimée par le mécanisme de récupération. Un nouveau précontrôle a confirmé `accountCountBefore:0`, `accountCountProposed:1` et `writePerformed:false`.

Cause : le précontrôle ACCESS validait la cible, les identités et le registre proposé, mais pas `audit.isPersistentRecipeAudit()`. Le correctif applicatif ajoute ce contrôle avant la lecture préparatoire du registre et refuse fermé avec `ACCESS_RECIPE_AUDIT_REQUIRED`, sans écriture. Un test dédié vérifie le refus et l’absence totale d’opération sur les Script Properties. Toute nouvelle application ou restauration reste interdite jusqu’à intégration, synchronisation dans la recette et précontrôle concluant.

### 2.1 Faux positif du précontrôle observé le 12 août 2026

Après intégration du premier correctif, la tête `ff0431f` a été synchronisée vers le projet Apps Script de recette (`eIRxs4`) avec 229 fichiers. La suite cumulative a réussi à **498/498 tests, 0 échec**. Toutefois, `AKS_preflightAccess002Recipe` a encore retourné `ok:true` alors que le support d’audit n’avait pas été démontré opérationnel.

La revue du code a identifié la cause exacte : `isPersistentRecipeAudit()` retournait une constante `true` dans le service et dans le port public. Le premier test ne simulait qu’un retour booléen `false` et ne détectait donc pas ce faux positif d’intégration. Le second correctif fait exécuter la validation réelle du support — environnement `RECETTE`, identifiant et nom exacts du classeur `AKS Audit RECETTE`, version et en-têtes — sans verrou, écriture ni preuve persistée. Toute erreur est réduite en `ACCESS_RECIPE_AUDIT_REQUIRED` par la recette ACCESS.

L’application et la restauration restent interdites jusqu’à intégration de ce second correctif, nouvelle synchronisation, campagne cumulative sans échec et précontrôle produisant le refus attendu tant que l’audit n’est pas raccordé.

### 2.2 Omission cumulative observée le 12 août 2026

Après fusion du second correctif au commit `555ddd3`, 229 fichiers ont été synchronisés dans la recette. `AKS_runV11TestSuite` a retourné **498/498 tests réussis, 0 échec**, au lieu des 501 annoncés. Le code et les trois tests ciblés étaient présents, mais `TestSuiteV11.gs` n’enregistrait pas ces nouveaux scénarios dans la campagne cumulative.

Le correctif ajoute les trois tests manquants et un garde structurel qui échoue si cette couverture critique disparaît de la suite cumulative. La prochaine campagne attendue comporte donc **502 tests** : les 498 existants, les trois scénarios de validation réelle de l’audit et le garde de couverture. Le résultat 498/498 reste une preuve valide de non-régression du corpus antérieur, mais ne valide pas encore le correctif d’audit.

### 2.3 Raccordement persistant réversible requis

La campagne cumulative corrigée a réussi à **502/502 tests, 0 échec**. Le précontrôle ACCESS a ensuite refusé comme attendu avec `ACCESS_RECIPE_AUDIT_REQUIRED`, confirmant le fonctionnement réel du garde-fou et l’absence de raccordement persistant.

La recette AUDIT-001 existante ne pouvait pas satisfaire ACCESS : elle installait ses trois paramètres uniquement pendant `AKS_runAudit001Recipe`, puis restaurait immédiatement leurs valeurs antérieures. Le correctif ajoute `AKS_connectAudit001Recipe` et `AKS_disconnectAudit001Recipe`. La connexion sauvegarde exactement les trois valeurs antérieures, installe la configuration `RECETTE`, vérifie le support sans produire de preuve d’audit et reste idempotente. La déconnexion refuse de s’exécuter tant que la sauvegarde ACCESS existe, puis restaure exactement la configuration antérieure et supprime sa sauvegarde.

La séquence imposée devient : connexion AUDIT, précontrôle ACCESS, application ACCESS autorisée, contrôles, restauration ACCESS, puis seulement déconnexion AUDIT. Le correctif ajoute quatre tests et porte la prochaine campagne cumulative attendue à **506 tests**.

## 3. Point de départ vérifié

`ACCESS-002-01` est intégré dans `develop` au commit applicatif `91ba7e3`. Le prérequis permettant d'attribuer explicitement `ACCESS_MANAGE` a ensuite été intégré par la [PR applicative #94](https://github.com/karateseremange/AKS-Platform/pull/94), au commit [`e800bdb`](https://github.com/karateseremange/AKS-Platform/commit/e800bdbc38a7618921a12358bdfee1f28ec865e8).

La [PR applicative #95](https://github.com/karateseremange/AKS-Platform/pull/95) a intégré le protocole réversible dans `develop` au commit [`bbedf0a`](https://github.com/karateseremange/AKS-Platform/commit/bbedf0a02c39e1680917013deda8840269964e28). Sa tête testée `be7323a` a été synchronisée avec **229 fichiers** dans le projet Apps Script isolé `[RECETTE] AKS Inscriptions`. La campagne cumulative réelle a réussi à **495/495 tests, 0 échec**. Les validations ciblées ont réussi à **19/19** pour ACCESS-002-01, **7/7** pour l'habilitation explicite et **11/11** pour le protocole réversible ; la syntaxe a été vérifiée sur **196/196 fichiers**.

`AKS_preflightAccess002Recipe` a été exécutée avec succès : cible `RECETTE`, suffixe de script `eIRxs4`, registre absent, zéro compte avant et un compte proposé, avec `writePerformed:false`. `AKS_applyAccess002Recipe` et `AKS_restoreAccess002Recipe` n'ont pas été exécutées. Aucun registre, compte ou environnement de production n'a été modifié.

La tête `395de24` de la [PR applicative #96](https://github.com/karateseremange/AKS-Platform/pull/96) a été synchronisée avec **229 fichiers** dans le même projet Apps Script isolé. La campagne cumulative réelle a réussi à **496/496 tests, 0 échec**. Elle prouvait la structure du registre proposé, mais pas l'absence de droits effectifs hérités du rôle. La revue finale a donc bloqué la fusion avant toute mutation.

Le correctif fonctionnel préparé au commit local `7dacc7b` et publié sur la tête `747c9a3` supprime les raccourcis qui accordaient implicitement les capacités générales, Inscriptions et `ACCESS_MANAGE` à `ADMINISTRATEUR`. Les validations locales réussissent à **18/18** pour ACCESS-001, **19/19** pour ACCESS-002-01, **7/7** pour l'habilitation explicite, **13/13** pour la recette réversible, **19/19** pour Inscriptions ciblé et **1/1** pour le cycle Audit–registre ACCESS. La syntaxe est valide sur **196/196 fichiers**. Cette tête a été synchronisée avec **229 fichiers** dans Apps Script, puis la suite cumulative réelle a réussi à **497/497 tests, 0 échec**.

Le socle fournit déjà :

- la lecture administrative protégée du registre ;
- une commande d’écriture atomique avec révision optimiste et verrou serveur ;
- la validation des comptes, rôles, affectations, capacités et périodes ;
- la protection du dernier gestionnaire actif ;
- une preuve persistante corrélée avant et après chaque mutation ;
- une restauration vérifiée lorsque la persistance ou la preuve finale échoue ;
- le bootstrap historique, limité au cas où le registre est absent.

## 4. Protocole applicatif intégré et reste à faire

Le lot intégré autorise désormais une affectation transverse `ACCESS` et calcule `ACCESS_MANAGE` depuis cette habilitation explicite. Il vérifie notamment :

- le compte et l'affectation actifs dans leur période de validité ;
- la possession effective d'au moins un rôle déclaré par l'affectation ;
- la forme transverse stricte du périmètre `ACCESS` ;
- l'unicité de la capacité `ACCESS_MANAGE` ;
- la conservation d'au moins un gestionnaire effectif.

Le bootstrap historique reste une voie temporaire de récupération uniquement lorsque le registre est absent. Dès qu'un registre existe, le rôle `ADMINISTRATEUR` est strictement descriptif et n'accorde aucune capacité générale, Inscriptions ou administrative.

Le lot intégré fournit trois fonctions éditeur internes, sans route Web ordinaire : précontrôle, application et restauration. Les paramètres de recette sont fournis à l'exécution, sans adresse, valeur de registre ni identifiant de projet codé en dur. L'application est sérialisée sous verrou de script ; une exécution concurrente échoue avant toute mutation et ne peut annuler un état validé par une autre exécution.

Le précontrôle a révélé que la recette intégrée proposait encore `CONSULTATION + ACCESS_MANAGE`. Le Product Owner a confirmé le modèle cible `ADMINISTRATEUR + ACCESS_MANAGE`. Une première correction a aligné la structure, mais la revue finale a détecté que le moteur conservait quatre voies d'héritage implicite. Le correctif `7dacc7b` les retire et ajoute un test de droits effectifs : `ACCESS_MANAGE` est autorisé par l'affectation explicite, tandis que Présences et Inscriptions sont refusées. La mutation réversible demeure interdite jusqu'à synchronisation, validation cumulative réelle, intégration du correctif et autorisation explicite distincte.

## 5. Modèle compatible proposé

Le schéma reste `access/1.0`. L’évolution autorise une affectation transverse présentant exactement les caractéristiques suivantes :

| Champ | Valeur ou règle |
|---|---|
| `module` | `ACCESS` |
| `season` | `*` |
| `section` | vide |
| `courseCode` | vide |
| `status` | `ACTIVE` ou `INACTIVE` |
| `roles` | au moins un rôle connu et détenu par le compte |
| `extraCapabilities` | uniquement `ACCESS_MANAGE` |
| `validFrom`, `validUntil` | règles temporelles communes |

`ACCESS_MANAGE` devient effectif lorsque le compte et l’affectation sont actifs dans leur période de validité et qu’au moins un rôle de l’affectation appartient au compte.

Le bootstrap historique reste temporairement accepté lorsque le registre est absent. Le rôle `ADMINISTRATEUR` reste une valeur descriptive du schéma `access/1.0`, mais son héritage automatique de capacités est retiré dès `ACCESS-002-02`. `ACCESS-002-06` conserve la migration définitive des modules et le retrait du filet historique résiduel ; il ne doit pas réintroduire de droits implicites liés au rôle.

## 6. État initial cible du premier gestionnaire

Le premier enregistrement réel proposé est limité au besoin de migration :

- identité technique normalisée : `aserridj@gmail.com` ;
- statut du compte : `ACTIVE` ;
- rôle descriptif : `ADMINISTRATEUR` ;
- une affectation transverse `ACCESS`, active, sans date de fin ;
- capacité explicite : `ACCESS_MANAGE` ;
- aucune capacité implicite ni autre affectation n'est ajoutée par la recette ;
- aucun rôle `SUPER_ADMIN` et aucune exception liée à l'adresse du compte ;
- aucune copie automatique de droits métier non inventoriés ;
- métadonnées `updatedAt` et `updatedBy` produites exclusivement côté serveur.

Les droits métier ne sont jamais obtenus du seul rôle `ADMINISTRATEUR`. Leur inventaire et leur attribution explicite relèvent des incréments suivants, au plus tard `ACCESS-002-06`.

## 7. Périmètre applicatif intégré

Le lot applicatif intégré couvre uniquement :

1. un service interne de recette, non exposé aux routes ordinaires ;
2. un mode de précontrôle sans écriture ;
3. une sauvegarde temporaire dédiée et vérifiée de l'état initial ;
4. l'application idempotente d'un compte de recette paramétré, jamais codé en dur ;
5. la vérification d'accès, de refus et d'audit avec résultats minimisés ;
6. une commande de restauration exacte, idempotente et vérifiée ;
7. le maintien borné du bootstrap historique lorsque le registre est absent ;
8. les tests unitaires, de contrat et de non-régression ;
9. des fonctions de recette explicitement nommées et exclues de la suite cumulative ordinaire.

Le lot ne contient aucune adresse réelle, aucune valeur de registre et aucun identifiant de projet. Les paramètres d'exécution seront fournis uniquement au moment d'une recette autorisée.

## 8. Hors périmètre

Sont exclus de cet incrément :

- l’interface de gestion des utilisateurs ;
- la création d’un second gestionnaire ;
- l’attribution générale des accès Présences, Analytics ou Inscriptions ;
- la migration définitive des écrans utilisant `AKS.Admin.Access` ;
- la suppression du bootstrap, du rôle historique ou de la Script Property historique ;
- un rôle `SUPER_ADMIN` ou une exception codée en dur liée à une adresse ;
- tout accès client direct au registre ou à la commande d’amorçage ;
- tout déploiement ou bascule de production implicite.

## 9. Garde d’exécution obligatoire

L’amorçage doit échouer fermé avant toute écriture si l’une des conditions suivantes n’est pas satisfaite :

1. fonction interne explicitement sélectionnée ;
2. environnement attendu confirmé côté serveur ;
3. identité active égale à l’identité d’amorçage autorisée par le mécanisme historique ;
4. audit persistant disponible et conforme ;
5. verrou de script disponible ;
6. état courant du registre lisible ;
7. révision attendue identique à la révision courante ;
8. aucune sauvegarde de migration non résolue ;
9. cible exacte `aserridj@gmail.com` ;
10. commande et registre cible conformes au schéma validé.

Le mode de précontrôle retourne uniquement des indicateurs minimisés. Il ne sérialise jamais le registre complet dans les journaux.

## 10. Idempotence, sauvegarde et retour arrière

L’opération doit être idempotente :

- si le registre cible exact est déjà présent, elle confirme l’état sans nouvelle écriture ;
- si un registre différent existe, elle s’arrête sans fusion automatique ;
- si le registre est absent, elle prépare une création unique sous verrou ;
- toute relance après résultat incertain commence par une relecture et une comparaison exacte.

Avant mutation, l’état précédent est sauvegardé dans un support technique temporaire dédié à la récupération. La sauvegarde est relue et vérifiée avant l’écriture cible. Elle n’est supprimée qu’après validation explicite de la recette et de la procédure de récupération.

Le retour arrière restaure exactement l’état antérieur attendu, le relit, vérifie sa révision et produit une preuve d’audit corrélée. Une divergence interdit toute confirmation de réussite.

## 11. Séquence d’exécution

### Phase A — implémentation sans donnée réelle

1. l'affectation transverse `ACCESS` et le calcul explicite de `ACCESS_MANAGE` sont intégrés au commit `e800bdb` ;
2. la campagne cumulative correspondante est validée à **484/484** sur la recette isolée ;
3. le précontrôle, l'idempotence, la sauvegarde et la restauration sont intégrés au commit `bbedf0a` ;
4. la tête `be7323a` est synchronisée avec **229 fichiers** dans le projet Apps Script isolé confirmé ;
5. les validations ciblées réussissent à **19/19**, **7/7** et **11/11**, la syntaxe à **196/196** et la campagne cumulative à **495/495** ;
6. le correctif du rôle initial est porté par la PR applicative #96, dont la tête `395de24` est synchronisée avec **229 fichiers** et validée à **496/496 tests, 0 échec** ;
7. la revue finale bloque cette première tête, car elle ne vérifie pas les droits effectifs hérités du rôle ;
8. le correctif fonctionnel `7dacc7b`, publié sur la tête `747c9a3`, retire cet héritage et réussit les validations ciblées locales ;
9. cette tête est synchronisée avec **229 fichiers** et validée dans Apps Script à **497/497 tests, 0 échec** ;
10. aucune fonction d'application ou de restauration n'est exécutée pendant cette phase.

### Phase B — recette isolée et réversible

1. confirmer le nom du projet, son `scriptId`, l'identité active et l'environnement ;
2. renseigner séparément une identité gestionnaire de recette et une identité de refus autorisées ;
3. enregistrer l'empreinte minimisée de l'état initial et sa révision ;
4. créer, relire et vérifier la sauvegarde temporaire avant toute mutation ;
5. exécuter d’abord le précontrôle sans écriture ;
6. obtenir l'autorisation explicite portant sur le registre de recette et les deux identités ;
7. appliquer l'état cible de recette sous verrou ;
8. vérifier l'accès du gestionnaire, le refus non habilité et les appels serveur directs ;
9. contrôler les preuves `INTENTION` et `REUSSI` corrélées ;
10. exécuter puis vérifier la restauration ;
11. confirmer la révision, l'empreinte et le comportement identiques à l'état initial ;
12. conserver les preuves minimisées et arrêter la fonction de recette.

### Phase C — amorçage réel

Cette phase nécessite une autorisation distincte portant explicitement sur le compte, le registre, les preuves d’audit et l’environnement réels. Elle reprend la séquence de la phase B, sans supprimer le filet historique.

## 12. Scénarios de validation minimaux

| ID | Scénario | Résultat attendu |
|---|---|---|
| A02-01 | Affectation `ACCESS_MANAGE` explicite active | Autorisation accordée côté serveur |
| A02-02 | Même rôle sans affectation explicite, hors compatibilité injectée | Refus |
| A02-03 | Affectation inactive, future ou expirée | Refus |
| A02-04 | Module, périmètre ou capacité transverse invalide | Registre refusé sans mutation |
| A02-05 | Bootstrap historique avant premier registre | Précontrôle autorisé |
| A02-06 | Création du premier gestionnaire | Une écriture, révision nouvelle, audit corrélé |
| A02-07 | Relance sur état cible exact | Succès idempotent sans nouvelle écriture |
| A02-08 | Registre existant différent | Arrêt sans fusion automatique |
| A02-09 | Compte non habilité | `ACCESS_DENIED` ou `ACCESS_CAPABILITY_DENIED` |
| A02-10 | Échec de preuve finale | Restauration exacte et réussite non confirmée |
| A02-11 | Retrait du dernier gestionnaire effectif | Refus |
| A02-12 | Procédure de récupération | État antérieur restauré et vérifié |
| A02-13 | Amorçage du premier gestionnaire | Rôle descriptif `ADMINISTRATEUR`, unique affectation `ACCESS` et unique capacité explicite `ACCESS_MANAGE` |
| A02-14 | Droits effectifs du premier gestionnaire | `ACCESS_MANAGE` autorisé ; Présences, Inscriptions et autres capacités non attribuées refusées |

La suite cumulative doit rester sans échec. Le nombre final de tests sera consigné à partir de l’exécution réelle, sans estimation documentaire.

## 13. Preuves attendues

La clôture exige au minimum :

- commits et PR applicative identifiés ;
- tête exacte synchronisée en recette ;
- résultats des tests ciblés et cumulatifs ;
- identité active confirmée séparément pour chaque scénario réel ;
- révisions avant, après et après restauration ;
- identifiants de corrélation des preuves d’audit ;
- résultat d’accès autorisé ;
- résultat de refus d’un compte non habilité ;
- confirmation du maintien de `AKS.Admin.Access` ;
- confirmation qu’aucune route ordinaire n’expose l’amorçage ;
- absence de modification de `main` et de déploiement non autorisé.

Les preuves documentaires restent minimisées : aucun jeton, secret, contenu intégral du registre ou donnée d’audit sensible n’est copié dans le Project Book.

## 14. Conditions d’arrêt

L’opération s’arrête immédiatement en cas d’identité inattendue, registre illisible ou divergent, audit indisponible, verrou indisponible, révision concurrente, sauvegarde non vérifiée, erreur de restauration, résultat cumulatif en échec ou doute sur l’environnement ciblé.

Après un arrêt, aucune relance n’est effectuée avant diagnostic et nouvelle validation de l’état persistant.

## 15. Critères d’acceptation

`ACCESS-002-02` pourra être clôturé lorsque :

1. `ACCESS_MANAGE` est matérialisé par une habilitation explicite compatible avec `access/1.0` ;
2. le bootstrap historique reste disponible uniquement lorsque le registre est absent ;
3. le premier gestionnaire est créé sans rôle spécial caché ;
4. l’accès gestionnaire et le refus non habilité sont prouvés côté serveur ;
5. l’écriture est atomique, auditée, idempotente et réversible ;
6. la récupération est exécutée et vérifiée en recette ;
7. les tests ciblés et cumulatifs réussissent ;
8. l’amorçage réel, s’il est exécuté, dispose de son autorisation et de ses preuves propres ;
9. le filet historique résiduel n’est pas retiré ;
10. le Project Book reflète exactement l’état livré.

`ACCESS-002-03` ne peut commencer qu’après satisfaction de ces critères et clôture documentaire de l’incrément.

## 16. Autorisations distinctes requises

Le cadrage distingue quatre décisions qui ne doivent pas être confondues :

1. validation du présent cadrage ;
2. autorisation d’implémenter et de publier une PR applicative vers `develop` ;
3. autorisation d’exécuter une recette modifiant un registre et utilisant des identités réelles ;
4. autorisation d’effectuer l’amorçage dans l’environnement réel.

Une fusion, une opération sur `main`, un déploiement ou une suppression du filet historique restent également soumis à une autorisation explicite.

## 17. Feuille de contrôle de la future recette

Cette feuille est préparatoire. Elle ne doit être complétée qu'avec des preuves minimisées après une exécution autorisée.

| Contrôle | État avant exécution | Preuve attendue |
|---|---|---|
| Projet Apps Script isolé et `scriptId` confirmés | Confirmé pour la synchronisation du code | Nom et suffixe minimisé de l'identifiant à reconfirmer avant exécution |
| Branche et commit applicatifs exacts | `develop` au commit `bbedf0a` ; correctif fonctionnel testé sur la tête `747c9a3` de la PR #96 | SHA complet |
| Identité gestionnaire de recette autorisée | Configurée : `a***@gmail.com` | Adresse masquée ou identifiant de scénario |
| Identité de refus autorisée | Configurée : `s***@gmail.com` | Adresse masquée ou identifiant de scénario |
| Précontrôle sans écriture | Réussi : cible `RECETTE`, registre absent, 0 compte avant, 1 proposé, `writePerformed:false` | Résultat et horodatage |
| Sauvegarde créée, relue et vérifiée | Non exécuté | Empreinte et révision minimisées |
| Mutation de recette explicitement autorisée | Non autorisée | Référence de l'autorisation |
| Accès gestionnaire | Non exécuté | Résultat côté serveur |
| Refus non habilité | Non exécuté | Code d'erreur attendu |
| Audit corrélé | Non exécuté | Identifiants de corrélation minimisés |
| Restauration exacte | Non exécutée | Révision et empreinte après restauration |
| Suite cumulative finale | Réussie : tête `747c9a3`, 229 fichiers synchronisés, **497/497 tests, 0 échec** | Résultat observé après synchronisation de la tête corrigée |

Tant que la ligne « Mutation de recette explicitement autorisée » reste non autorisée, seules l'implémentation sans donnée réelle, les validations locales et la synchronisation de code vers le projet isolé sont permises.

## 18. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.11.0 | 2026-08-12 | Campagne 502/502 validée puis refus attendu `ACCESS_RECIPE_AUDIT_REQUIRED` ; mécanisme temporaire AUDIT-001 identifié comme insuffisant, raccordement persistant réversible préparé avec sauvegarde exacte, idempotence, ordre de restauration protégé et prochaine campagne attendue à 506 tests |
| 0.10.0 | 2026-08-12 | Après synchronisation de `555ddd3`, campagne 498/498 sans échec mais trois nouveaux tests absents de l’agrégateur cumulatif ; correction préparée pour les enregistrer et ajouter un garde structurel, prochaine campagne attendue à 502 tests |
| 0.9.0 | 2026-08-12 | Tête `ff0431f` synchronisée, campagne cumulative 498/498 réussie, puis faux positif du précontrôle identifié : `isPersistentRecipeAudit()` retournait toujours `true` ; second correctif préparé pour valider réellement le support sans écriture et convertir tout échec en `ACCESS_RECIPE_AUDIT_REQUIRED` |
| 0.8.0 | 2026-08-11 | Application arrêtée avant écriture sur `AUDIT_RECIPE_REQUIRED` ; registre confirmé intact par précontrôle ; correctif préparé pour exiger l’audit persistant dès le précontrôle, avec refus fermé et test sans mutation |
| 0.7.0 | 2026-08-09 | Tête corrigée `747c9a3` synchronisée avec 229 fichiers et validée dans Apps Script à 497/497, confirmant le rôle `ADMINISTRATEUR` descriptif et `ACCESS_MANAGE` explicite ; application et restauration non exécutées, registre inchangé |
| 0.6.0 | 2026-08-09 | Revue finale de la première tête 496/496 bloquée par les droits implicites du rôle ; correctif fonctionnel `7dacc7b` préparé avec rôle strictement descriptif, bootstrap limité au registre absent, validations ciblées concluantes et suite cumulative portée à 497 tests uniques, nouvelle exécution Apps Script requise |
| 0.5.0 | 2026-08-09 | Correctif `ADMINISTRATEUR + ACCESS_MANAGE` de la PR applicative #96 synchronisé sur sa tête `395de24` avec 229 fichiers et validé à 496/496, sans application, restauration ni mutation du registre |
| 0.4.0 | 2026-08-09 | Précontrôle en lecture seule réussi ; décision confirmée pour `ADMINISTRATEUR + ACCESS_MANAGE`, sans `SUPER_ADMIN`, exception d'adresse ni autre habilitation ; correctif applicatif et test structurel préparés, application et restauration toujours non exécutées |
| 0.3.0 | 2026-08-09 | Protocole réversible intégré par la PR applicative #95 au commit `bbedf0a` ; tête `be7323a` synchronisée avec 229 fichiers et validée à 495/495, sans exécution des fonctions de recette ni mutation réelle |
| 0.2.0 | 2026-08-09 | Prérequis `ACCESS_MANAGE` explicite intégré par la PR applicative #94 au commit `e800bdb`, campagne isolée 484/484 consignée et protocole du prochain lot de recette réversible préparé, sans registre, compte ou donnée réelle |
| 0.1.0 | 2026-08-09 | Proposition de cadrage d’ACCESS-002-02 : écart d’habilitation explicite identifié, modèle transverse `ACCESS` proposé, phases d’implémentation/recette/amorçage séparées et garde réversible définie, sans modification réelle |

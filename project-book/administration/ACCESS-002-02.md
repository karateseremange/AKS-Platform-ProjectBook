# ACCESS-002-02 — Amorçage et migration du premier gestionnaire

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-02 |
| **Titre** | Amorçage contrôlé et migration du premier gestionnaire ACCESS |
| **Version** | 0.1.0 |
| **Statut** | Proposé — cadrage à valider avant implémentation ou amorçage réel |
| **Nature** | Spécification d’incrément, plan de migration et de recette |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-02` prépare puis exécute de manière contrôlée l’amorçage du premier gestionnaire réel du registre `AKS_ACCESS_REGISTRY`.

L’incrément doit permettre à `aserridj@gmail.com` de disposer explicitement de `ACCESS_MANAGE`, vérifier les accès autorisés et refusés ainsi que les preuves d’audit, puis conserver l’ancien mécanisme `AKS.Admin.Access` comme filet temporaire de récupération.

Le présent état est exclusivement documentaire. Il n’autorise ni implémentation applicative, ni écriture dans une Script Property, ni modification de compte, ni recette avec des identités réelles, ni déploiement.

## 2. Point de départ vérifié

`ACCESS-002-01` est intégré dans `develop` au commit applicatif `91ba7e3`. La campagne Apps Script isolée de référence a réussi à **477/477 tests, 0 échec**.

Le socle fournit déjà :

- la lecture administrative protégée du registre ;
- une commande d’écriture atomique avec révision optimiste et verrou serveur ;
- la validation des comptes, rôles, affectations, capacités et périodes ;
- la protection du dernier gestionnaire actif ;
- une preuve persistante corrélée avant et après chaque mutation ;
- une restauration vérifiée lorsque la persistance ou la preuve finale échoue ;
- la compatibilité temporaire avec le bootstrap et le rôle historique `ADMINISTRATEUR`.

## 3. Écart technique à lever avant l’amorçage

Dans l’état intégré, `ACCESS_MANAGE` appartient au catalogue des capacités, mais :

- l’autorisation administrative l’accorde encore par compatibilité au bootstrap ou au rôle `ADMINISTRATEUR` ;
- les affectations du registre refusent actuellement `ACCESS_MANAGE` dans `extraCapabilities` ;
- aucune affectation transverse `ACCESS` ne permet donc de matérialiser cette capacité explicitement.

Un registre contenant seulement le rôle `ADMINISTRATEUR` préserverait le comportement historique, mais ne satisferait pas la décision ACCESS-002 selon laquelle les rôles sont descriptifs et les habilitations explicites.

L’amorçage réel est interdit tant que cet écart n’est pas corrigé et couvert par des tests.

## 4. Modèle compatible proposé

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

Le bootstrap et le rôle historique `ADMINISTRATEUR` restent temporairement acceptés pendant cet incrément. Leur retrait n’appartient pas à `ACCESS-002-02` et demeure réservé à `ACCESS-002-06` après migration des modules.

## 5. État initial cible du premier gestionnaire

Le premier enregistrement réel proposé est limité au besoin de migration :

- identité technique normalisée : `aserridj@gmail.com` ;
- statut du compte : `ACTIVE` ;
- rôle descriptif : `ADMINISTRATEUR` ;
- une affectation transverse `ACCESS`, active, sans date de fin ;
- capacité explicite : `ACCESS_MANAGE` ;
- aucune copie automatique de droits métier non inventoriés ;
- métadonnées `updatedAt` et `updatedBy` produites exclusivement côté serveur.

Les droits métier encore obtenus par compatibilité historique ne sont pas présentés comme migrés. Leur inventaire et leur migration explicite relèvent des incréments suivants, au plus tard `ACCESS-002-06`.

## 6. Périmètre applicatif autorisable après validation

Une future autorisation d’implémentation pourra couvrir uniquement :

1. la prise en charge de l’affectation transverse `ACCESS` ;
2. le calcul explicite de `ACCESS_MANAGE` depuis cette affectation ;
3. le maintien borné des deux voies historiques de récupération ;
4. un service d’amorçage interne à usage exceptionnel, non exposé aux routes ordinaires ;
5. un mode de précontrôle sans écriture ;
6. une sauvegarde et une restauration contrôlées de l’état précédent ;
7. les tests unitaires, de contrat et de non-régression ;
8. une fonction de recette isolée, nommée explicitement et exclue de la suite cumulative ordinaire.

## 7. Hors périmètre

Sont exclus de cet incrément :

- l’interface de gestion des utilisateurs ;
- la création d’un second gestionnaire ;
- l’attribution générale des accès Présences, Analytics ou Inscriptions ;
- la migration définitive des écrans utilisant `AKS.Admin.Access` ;
- la suppression du bootstrap, du rôle historique ou de la Script Property historique ;
- un rôle `SUPER_ADMIN` ou une exception codée en dur liée à une adresse ;
- tout accès client direct au registre ou à la commande d’amorçage ;
- tout déploiement ou bascule de production implicite.

## 8. Garde d’exécution obligatoire

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

## 9. Idempotence, sauvegarde et retour arrière

L’opération doit être idempotente :

- si le registre cible exact est déjà présent, elle confirme l’état sans nouvelle écriture ;
- si un registre différent existe, elle s’arrête sans fusion automatique ;
- si le registre est absent, elle prépare une création unique sous verrou ;
- toute relance après résultat incertain commence par une relecture et une comparaison exacte.

Avant mutation, l’état précédent est sauvegardé dans un support technique temporaire dédié à la récupération. La sauvegarde est relue et vérifiée avant l’écriture cible. Elle n’est supprimée qu’après validation explicite de la recette et de la procédure de récupération.

Le retour arrière restaure exactement l’état antérieur attendu, le relit, vérifie sa révision et produit une preuve d’audit corrélée. Une divergence interdit toute confirmation de réussite.

## 10. Séquence d’exécution

### Phase A — implémentation sans donnée réelle

1. implémenter l’affectation transverse `ACCESS` ;
2. ajouter le calcul explicite de `ACCESS_MANAGE` ;
3. implémenter le précontrôle, l’idempotence et la récupération ;
4. valider les tests ciblés et cumulatifs ;
5. synchroniser uniquement vers le projet Apps Script isolé de recette.

### Phase B — recette isolée et réversible

1. confirmer le projet, l’identité active et l’environnement ;
2. enregistrer l’état initial et sa révision ;
3. exécuter d’abord le précontrôle sans écriture ;
4. effectuer l’amorçage uniquement après autorisation explicite ;
5. vérifier l’accès du gestionnaire, un refus non habilité et les appels serveur directs ;
6. contrôler les preuves `INTENTION` et `REUSSI` corrélées ;
7. exécuter puis vérifier la restauration ;
8. confirmer le retour exact à l’état initial.

### Phase C — amorçage réel

Cette phase nécessite une autorisation distincte portant explicitement sur le compte, le registre, les preuves d’audit et l’environnement réels. Elle reprend la séquence de la phase B, sans supprimer le filet historique.

## 11. Scénarios de validation minimaux

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

La suite cumulative doit rester sans échec. Le nombre final de tests sera consigné à partir de l’exécution réelle, sans estimation documentaire.

## 12. Preuves attendues

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

## 13. Conditions d’arrêt

L’opération s’arrête immédiatement en cas d’identité inattendue, registre illisible ou divergent, audit indisponible, verrou indisponible, révision concurrente, sauvegarde non vérifiée, erreur de restauration, résultat cumulatif en échec ou doute sur l’environnement ciblé.

Après un arrêt, aucune relance n’est effectuée avant diagnostic et nouvelle validation de l’état persistant.

## 14. Critères d’acceptation

`ACCESS-002-02` pourra être clôturé lorsque :

1. `ACCESS_MANAGE` est matérialisé par une habilitation explicite compatible avec `access/1.0` ;
2. les voies historiques restent disponibles uniquement comme compatibilité temporaire ;
3. le premier gestionnaire est créé sans rôle spécial caché ;
4. l’accès gestionnaire et le refus non habilité sont prouvés côté serveur ;
5. l’écriture est atomique, auditée, idempotente et réversible ;
6. la récupération est exécutée et vérifiée en recette ;
7. les tests ciblés et cumulatifs réussissent ;
8. l’amorçage réel, s’il est exécuté, dispose de son autorisation et de ses preuves propres ;
9. le filet historique n’est pas retiré ;
10. le Project Book reflète exactement l’état livré.

`ACCESS-002-03` ne peut commencer qu’après satisfaction de ces critères et clôture documentaire de l’incrément.

## 15. Autorisations distinctes requises

Le cadrage distingue quatre décisions qui ne doivent pas être confondues :

1. validation du présent cadrage ;
2. autorisation d’implémenter et de publier une PR applicative vers `develop` ;
3. autorisation d’exécuter une recette modifiant un registre et utilisant des identités réelles ;
4. autorisation d’effectuer l’amorçage dans l’environnement réel.

Une fusion, une opération sur `main`, un déploiement ou une suppression du filet historique restent également soumis à une autorisation explicite.

## 16. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-09 | Proposition de cadrage d’ACCESS-002-02 : écart d’habilitation explicite identifié, modèle transverse `ACCESS` proposé, phases d’implémentation/recette/amorçage séparées et garde réversible définie, sans modification réelle |

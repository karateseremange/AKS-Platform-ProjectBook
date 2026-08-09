# ACCESS-002-01 — Socle d’administration des accès

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-01 |
| **Titre** | Socle d’administration des utilisateurs et habilitations |
| **Version** | 1.0.0 |
| **Statut** | Validé — intégré dans `develop` |
| **Nature** | Suivi d’implémentation et de validation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-01` réalise progressivement le socle serveur défini par `ACCESS-002` : administration sécurisée du registre, validation, modification atomique, temporalité, protection du dernier gestionnaire et audit avant/après.

Les cinq lots applicatifs ont été fusionnés dans `develop` par la [PR applicative #93](https://github.com/karateseremange/AKS-Platform/pull/93), au commit [`91ba7e3`](https://github.com/karateseremange/AKS-Platform/commit/91ba7e37972ce3ab1d96aa74bbdf4fc1bc4d38e8). Le présent document clôt l’incrément.

---

## 2. État applicatif intégré

### 2.1 Lot 1 — catalogue de capacités compatible

Le commit applicatif [`77092a8`](https://github.com/karateseremange/AKS-Platform/commit/77092a829448aa9ce731441a0513f366bcbe8166) :

- ajoute `ANALYTICS_READ` au catalogue serveur comme capacité explicite et indépendante ;
- préserve le schéma `access/1.0` et le calcul historique des droits Présences ;
- n’effectue aucune migration du registre ;
- ajoute deux scénarios ciblés ACCESS-002-01 au harnais de tests.

Ce lot prépare la séparation cible entre rôles et capacités sans supprimer brutalement les comportements nécessaires à la compatibilité de l’existant.

### 2.2 Lot 2 — lecture administrative protégée

Le commit applicatif [`4b59108`](https://github.com/karateseremange/AKS-Platform/commit/4b5910810ad9bd91db5a853066cc94a6f3fb4819) :

- introduit une façade administrative dédiée et strictement en lecture seule ;
- refuse la lecture globale côté serveur lorsque l’appelant ne dispose pas du droit administratif attendu ;
- conserve temporairement l’autorisation historique du rôle `ADMINISTRATEUR` et du bootstrap afin de ne pas rompre `access/1.0` avant migration ;
- retourne une vue normalisée, défensive et profondément immuable du registre ;
- conserve `updatedAt` et normalise `updatedBy` dans la vue administrative ;
- n’expose aucune méthode d’écriture.

La compatibilité transitoire avec `ADMINISTRATEUR` et le bootstrap ne constitue pas le modèle cible. L’attribution effective explicite de `ACCESS_MANAGE` et la suppression contrôlée de l’héritage historique seront réalisées cumulativement, sans migration de données dans le présent état.

### 2.3 Lot 3 — validation et écriture atomique

Le commit applicatif [`8dddcab`](https://github.com/karateseremange/AKS-Platform/commit/8dddcabbd9fcdb532519055224c0efd18fad22a9) :

- introduit une commande d’écriture administrative protégée par `ACCESS_MANAGE` ;
- impose une révision optimiste et refuse fermé toute concurrence détectée ;
- valide strictement les adresses, dates, périodes, rôles, capacités et périmètres actifs, tout en conservant les périmètres historiques inactifs ;
- utilise un verrou serveur injecté, relit le registre et revérifie l’autorisation sous verrou ;
- impose côté serveur `updatedAt` et `updatedBy` ;
- relit intégralement la sauvegarde et restaure de manière vérifiée l’état précédent en cas d’échec ;
- protège le dernier gestionnaire effectif selon la compatibilité transitoire `ACCESS_MANAGE` ;
- refuse la réactivation d’un compte tant que ses anciennes affectations n’ont pas été supprimées ;
- conserve temporairement la compatibilité de l’ancienne méthode `saveRegistry()`.

Ce lot établit le mécanisme d’écriture et ses garde-fous uniquement par dépendances injectées et tests. Il ne déclenche aucune mutation du registre réel ni d’une Script Property.

### 2.4 Lot 4 — audit persistant avant/après

Le commit applicatif [`4647478`](https://github.com/karateseremange/AKS-Platform/commit/4647478bac0b9cbeff77687d24677338b64429dd) :

- rend obligatoire une preuve persistante `INTENTION` avant toute mutation du registre ;
- produit une preuve finale corrélée `REUSSI`, `ECHEC` ou `REFUSE` selon le résultat réel de la commande ;
- restaure l’état précédent lorsque la preuve finale ne peut pas être persistée après sauvegarde ;
- audite les refus et les restaurations avec le même identifiant de corrélation ;
- étend le catalogue fermé `AUDIT-001` avec l’action `ACCESS_REGISTRY_UPDATE`, le module `ACCESS`, la cible `ACCESS_REGISTRY` et des codes motif dédiés ;
- minimise les métadonnées aux révisions, comptes ciblés, nombre de changements, auto-modification et indicateur de restauration, sans copie complète du registre ;
- valide de bout en bout le cycle ACCESS avec le véritable service d’audit persistant injecté.

L’échec de la preuve d’intention interdit la mutation. L’échec de la preuve finale ne permet jamais de confirmer silencieusement l’écriture : la restauration est exécutée et vérifiée avant retour d’une erreur contrôlée.

### 2.5 Lot 5 — corrections de compatibilité avant campagne cumulative

Le commit applicatif [`84ea68f`](https://github.com/karateseremange/AKS-Platform/commit/84ea68f09b889b3caa2331122ef64d662f890c15) :

- partage un unique verrou de script entre ACCESS et AUDIT, sans acquisition imbriquée ni libération prématurée du verrou détenu par la commande ;
- impose à la voie d’audit « verrou déjà détenu » de vérifier effectivement la détention du verrou et de ne jamais le libérer ;
- aligne l’autorisation d’audit sur la compatibilité transitoire `access/1.0` et `AKS.Admin.Access` ;
- permet de persister les refus ACCESS sous une action `USER/REFUSE` strictement bornée, sans ouvrir d’autre opération d’audit à un appelant non habilité ;
- raccorde les trois nouveaux scénarios à la suite complète AUDIT-001 et supprime deux doublons de la suite cumulative ;
- nettoie la déclaration dupliquée détectée dans le test de restauration après échec d’audit ;
- valide le cycle ACCESS → AUDIT avec un seul faux verrou partagé, acquis et libéré une seule fois.

Ce lot corrige les incompatibilités détectées pendant la revue finale du chemin Apps Script réel. Il a ensuite été synchronisé dans le projet Apps Script isolé lié à `[RECETTE] AKS Inscriptions`, sans déploiement ni modification de la production. La PR #93 a finalement été fusionnée dans `develop` au commit `91ba7e3`.

---

## 3. Validations disponibles

Les contrôles locaux réalisés sur la tête applicative `84ea68f` sont concluants :

| Périmètre | Résultat |
|---|---:|
| ACCESS-001 | 18/18 |
| ACCESS-002-01 | 19/19 |
| AUDIT-001 complet | 46/46 |
| Inscriptions ciblés | 9/9 |
| Syntaxe des fichiers `.gs` | 193/193 |

La tête applicative `84ea68f` a été synchronisée dans le projet Apps Script isolé de recette avec **226 fichiers**. La campagne cumulative réelle a ensuite réussi à **477/477 tests, 0 échec**. Le recomptage selon la construction effective de la suite confirme 477 objets de test, 477 noms uniques et 477 fonctions uniques ; la valeur préparatoire 478 provenait d’un inventaire statique erroné et non d’un test manquant.

---

## 4. Garanties et exclusions maintenues

À ce stade :

- aucun compte réel n’a été créé, modifié, activé ou désactivé ;
- `aserridj@gmail.com` n’a pas été amorcé ;
- `AKS.Admin.Access` reste le mécanisme historique en place ;
- aucun registre réel ni Script Property n’a été migré ou modifié ;
- aucune commande d’écriture n’a été exécutée contre le registre réel ;
- seule la ressource Apps Script isolée de recette a été synchronisée ;
- aucune modification n’a été apportée à `main` ;
- aucun déploiement ni changement de production n’a été réalisé ;
- `ACCESS-002-02` et `INSCRIPTIONS-011` ne sont pas engagés.

---

## 5. Clôture et suite

`ACCESS-002-01` est clôturé sur `develop`. Son périmètre autorisé est intégré, documenté et validé par la campagne cumulative 477/477.

L’incrément suivant est `ACCESS-002-02 — Amorçage et migration`. Il reste à préparer séparément. La migration du premier compte gestionnaire réel, toute modification de compte ou registre réel et toute intervention en production restent exclues tant qu’elles ne sont pas explicitement autorisées.

---

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-09 | Clôture d’ACCESS-002-01 après fusion de la PR applicative #93 dans `develop` au commit `91ba7e3` ; périmètre validé à 477/477, sans compte, registre réel, production ni `main` modifié |
| 0.4.1 | 2026-08-09 | Recette Apps Script isolée consignée sur la tête `84ea68f` : 226 fichiers synchronisés, suite cumulative réelle 477/477 sans échec ; correction de l’inventaire préparatoire 478 après recomptage de 477 objets, noms et fonctions uniques |
| 0.4.0 | 2026-08-09 | Documentation du cinquième lot correctif : verrou ACCESS/AUDIT réellement partagé, autorisation d’audit alignée, refus ACCESS bornés, suites AUDIT et cumulative nettoyées ; syntaxe 193/193, ACCESS-002-01 19/19, AUDIT-001 46/46 et inventaire cumulatif préparé à 478 fonctions uniques, sans exécution Apps Script réelle |
| 0.3.0 | 2026-08-09 | Documentation du quatrième lot : audit persistant obligatoire avant mutation, preuves avant/après corrélées, refus et restaurations audités, restauration sur échec de preuve finale et métadonnées minimisées ; tests locaux ACCESS-002-01 portés à 19/19 et AUDIT-001 ciblé à 9/9, sans mutation réelle |
| 0.2.0 | 2026-08-09 | Documentation du troisième lot : validation stricte, écriture verrouillée avec révision optimiste, relecture, restauration vérifiée, métadonnées serveur, protection du dernier gestionnaire et réactivation sûre ; tests locaux ACCESS-002-01 portés à 15/15, sans mutation réelle |
| 0.1.0 | 2026-08-09 | Documentation des deux premiers lots applicatifs : catalogue `ANALYTICS_READ` compatible puis API administrative de lecture protégée et immuable ; exclusions et référence cumulative 455/455 conservées |

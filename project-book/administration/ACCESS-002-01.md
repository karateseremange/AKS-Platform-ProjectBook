# ACCESS-002-01 — Socle d’administration des accès

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-01 |
| **Titre** | Socle d’administration des utilisateurs et habilitations |
| **Version** | 0.3.0 |
| **Statut** | En cours — quatre lots applicatifs publiés en PR brouillon |
| **Nature** | Suivi d’implémentation et de validation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-09 |
| **Version du produit** | Post-V1.3.0 |

---

## 1. Objet

`ACCESS-002-01` réalise progressivement le socle serveur défini par `ACCESS-002` : administration sécurisée du registre, validation, modification atomique, temporalité, protection du dernier gestionnaire et audit avant/après.

Le présent état documente les quatre premiers lots publiés dans la [PR applicative brouillon #93](https://github.com/karateseremange/AKS-Platform/pull/93). Il ne clôt pas l’incrément.

---

## 2. État applicatif publié

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

---

## 3. Validations disponibles

Les contrôles locaux ciblés réalisés sur la tête applicative `4647478` sont concluants :

| Périmètre | Résultat |
|---|---:|
| ACCESS-001 | 18/18 |
| ACCESS-002-01 | 19/19 |
| AUDIT-001 ciblé | 9/9 |
| Inscriptions ciblés | 9/9 |

Ces résultats ne remplacent pas une exécution cumulative réelle dans Apps Script. La dernière référence cumulative effectivement exécutée reste **455/455 tests réussis, 0 échec**. Les dix-neuf scénarios ACCESS-002-01 et les nouveaux contrôles AUDIT-001 sont intégrés à la suite cumulative, mais cette nouvelle suite n’est pas présentée comme exécutée tant qu’une campagne Apps Script réelle ne l’a pas prouvé.

---

## 4. Garanties et exclusions maintenues

À ce stade :

- aucun compte réel n’a été créé, modifié, activé ou désactivé ;
- `aserridj@gmail.com` n’a pas été amorcé ;
- `AKS.Admin.Access` reste le mécanisme historique en place ;
- aucun registre réel ni Script Property n’a été migré ou modifié ;
- aucune commande d’écriture n’a été exécutée contre le registre réel ;
- aucune modification n’a été apportée à `main` ;
- aucun déploiement ni changement de production n’a été réalisé ;
- `ACCESS-002-02` et `INSCRIPTIONS-011` ne sont pas engagés.

---

## 5. Travaux restant dans ACCESS-002-01

L’incrément reste ouvert. Il doit encore fournir notamment :

1. la validation de compatibilité finale de la branche applicative ;
2. la nouvelle campagne cumulative réelle dans Apps Script ;
3. la consolidation des preuves et la clôture documentaire de l’incrément.

La migration du premier compte gestionnaire réel reste réservée à `ACCESS-002-02`.

---

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.3.0 | 2026-08-09 | Documentation du quatrième lot : audit persistant obligatoire avant mutation, preuves avant/après corrélées, refus et restaurations audités, restauration sur échec de preuve finale et métadonnées minimisées ; tests locaux ACCESS-002-01 portés à 19/19 et AUDIT-001 ciblé à 9/9, sans mutation réelle |
| 0.2.0 | 2026-08-09 | Documentation du troisième lot : validation stricte, écriture verrouillée avec révision optimiste, relecture, restauration vérifiée, métadonnées serveur, protection du dernier gestionnaire et réactivation sûre ; tests locaux ACCESS-002-01 portés à 15/15, sans mutation réelle |
| 0.1.0 | 2026-08-09 | Documentation des deux premiers lots applicatifs : catalogue `ANALYTICS_READ` compatible puis API administrative de lecture protégée et immuable ; exclusions et référence cumulative 455/455 conservées |

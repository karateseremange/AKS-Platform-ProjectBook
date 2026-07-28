# ANALYTICS-SAISIE-006 — Recette fonctionnelle mobile isolée

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-006 |
| **Version** | 1.0.1 |
| **Statut** | Validé sur `develop` — déploiement Web de recette autorisé |
| **Nature** | Spécification d’incrément et état d’implémentation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-29 |

## 1. Objectif

Valider le parcours mobile réel de saisie des présences dans un déploiement Web
distinct, sans exposer ni modifier les classeurs Analytics de production et sans
modifier le déploiement public existant.

La recette doit couvrir l’ouverture de l’écran, la création d’un brouillon, sa
reprise versionnée, la clôture confirmée et le retour en lecture seule.

## 2. Périmètre verrouillé

La composition de recette est reconstruite côté serveur à chaque appel et impose
simultanément :

- compte Google actif : `karate.seremange@gmail.com` ;
- cours : `BABY` ;
- saison : `2026-2027` ;
- date réservée : `2026-09-19` ;
- classeur : `[RECETTE] Analytics Baby 2026-2027` ;
- identifiant Sheets exact : `1iU9Q98uGtlmrEq8-ip5sO6HmW_uThbBYOwacw8iVOH4`.

L’identifiant et le titre du classeur sont contrôlés à chaque ouverture. Une
reprise par identifiant de séance est également refusée si la séance ne
correspond pas à la date réservée.

## 3. Architecture de recette

La route `?app=attendance-recipe` est distincte de la route normale
`?app=attendance`.

Le navigateur utilise exclusivement les fonctions serveur de recette :

- `AKS_getAttendanceRecipeWorkspace` ;
- `AKS_saveAttendanceRecipeBatch`.

Les endpoints habituels restent inchangés. Aucun paramètre persistant, aucun
identifiant de production et aucune modification de manifeste ne sont ajoutés.

## 4. Validation technique

La PR applicative
[#63](https://github.com/karateseremange/AKS-Platform/pull/63) est fusionnée sur
`develop` au commit `0c78284cdf492ca8275b60aa317618c09087042b`.

Quatre scénarios cumulatifs vérifient :

1. l’identité et la cible Sheets exactes ;
2. le cours, la saison et la date réservés ;
3. la route et la composition de recette distinctes ;
4. la séparation des endpoints client de recette et de production.

La syntaxe JavaScript est valide. La suite cumulative Apps Script exécutée le
29 juillet 2026 est concluante : **333/333 tests réussis, 0 échec**.

## 5. Déploiement et recette

Aucun déploiement Web de recette n’a été créé pendant la validation cumulative.

La validation **333/333** autorise désormais la création d’une nouvelle version
Apps Script et d’un déploiement Web distinct. Le déploiement existant et `main` restent
inchangés. La recette ne doit être exécutée qu’une fois sur la date réservée.

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-07-29 | Validation cumulative Apps Script : 333/333 réussis, 0 échec ; déploiement Web de recette isolé autorisé |
| 1.0.0 | 2026-07-29 | Protections et route de recette mobile intégrées sur `develop` ; validation cumulative 333/333 requise |

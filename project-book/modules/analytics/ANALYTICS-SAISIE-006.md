# ANALYTICS-SAISIE-006 — Recette fonctionnelle mobile isolée

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-006 |
| **Version** | 1.0.3 |
| **Statut** | Recette fonctionnelle mobile isolée validée sur `develop` |
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

Le déploiement Web de recette isolé a été créé puis exercé sur la date réservée. La recette navigateur a validé l’ouverture, le brouillon, sa reprise versionnée et la clôture. Deux défauts d’ergonomie ont été observés et corrigés sur `develop` : confirmation du brouillon conservée près des commandes (PR applicative #64, commit `c81eca83`) et sélection d’une séance clôturée avec statuts en lecture seule sans propagation de `PointerEvent` (PR applicative #65, commit `6f3e8f05`).

Après chaque correctif, la suite cumulative Apps Script est restée concluante : **333/333 tests réussis, 0 échec**. Le dernier contrôle navigateur est également concluant : la séance clôturée du `2026-09-19` s’affiche automatiquement, TEST Alpha reste `Présent`, TEST Beta reste `Absent`, les statuts sont en lecture seule, les commandes d’écriture sont absentes et aucun message `[object PointerEvent]` n’apparaît. L’absence de navigation vers d’autres dates est conforme au verrouillage volontaire de cette recette isolée. Le parcours complet — brouillon, reprise, clôture et lecture seule — est validé. `main`, le déploiement de production et les classeurs de production restent inchangés.

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.3 | 2026-07-29 | Recette fonctionnelle mobile isolée entièrement validée : brouillon, reprise, clôture et lecture seule conformes ; navigation limitée à la date réservée conforme au périmètre |
| 1.0.2 | 2026-07-29 | Recette réelle : brouillon, reprise et clôture validés ; correctifs UX PR #64 et lecture seule PR #65 validés par 333/333 ; reprise du dernier contrôle navigateur autorisée |
| 1.0.1 | 2026-07-29 | Validation cumulative Apps Script : 333/333 réussis, 0 échec ; déploiement Web de recette isolé autorisé |
| 1.0.0 | 2026-07-29 | Protections et route de recette mobile intégrées sur `develop` ; validation cumulative 333/333 requise |

# ANALYTICS-SAISIE-005 — Clôture mobile sécurisée

| Propriété | Valeur |
|---|---|
| **Document ID** | ANALYTICS-SAISIE-005 |
| **Version** | 1.0.0 |
| **Statut** | Intégré sur `develop` — validation Apps Script requise |
| **Nature** | Spécification d’incrément et état d’implémentation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-07-28 |
| **Version du produit** | Post-V1.2.0 |

---

## 1. Objet

Cet incrément ajoute la clôture sécurisée d’une séance depuis l’interface mobile,
après saisie complète et confirmation explicite.

## 2. Périmètre livré

- action de clôture distincte de la sauvegarde du brouillon ;
- blocage côté client lorsqu’un licencié reste à `NON_RENSEIGNE` ;
- confirmation explicite avant envoi de la commande ;
- écriture par l’API serveur existante avec `targetState: CLOTUREE` ;
- contrôle optimiste par identifiant de séance et version ;
- clé de soumission unique pour l’idempotence ;
- rechargement automatique de la séance après succès ;
- affichage en lecture seule après clôture.

## 3. Sécurité et cohérence métier

Le navigateur ne fournit ni identité, ni rôle, ni autorisation, ni cible Sheets.
Le serveur recompose ces dépendances et contrôle `SESSION_CLOSE`. La validation
métier côté serveur reste l’autorité : elle refuse toute clôture dont le lot ne
couvre pas tous les licenciés éligibles ou contient `NON_RENSEIGNE`.

Le contrôle côté client constitue un retour immédiat pour l’utilisateur ; il ne
remplace pas les protections du service d’écriture.

## 4. Exclusions

Cet incrément ne permet pas la correction d’une séance clôturée, n’installe pas
le registre réel et ne crée aucun déploiement utilisateur. La recette mobile sur
une copie contrôlée reste requise avant toute publication sur `main`.

## 5. Validation technique

L’implémentation est fusionnée sur `develop` par la PR applicative #61, commit
`6c67719b870a91bb25798e5b6334e7f4b076ee33`.

Les quatre tests ciblés réussissent. Ils contrôlent la confirmation explicite,
le blocage d’une clôture incomplète, la commande serveur versionnée et le retour
en lecture seule. La syntaxe JavaScript des fichiers modifiés est valide.

La suite cumulative Apps Script attendue est de **329/329 tests réussis, 0
échec**. Aucun déploiement Web ni classeur réel n’est modifié à ce stade.

## 6. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-07-28 | Clôture mobile sécurisée intégrée sur `develop` ; 4/4 tests ciblés réussis ; validation cumulative 329/329 requise |

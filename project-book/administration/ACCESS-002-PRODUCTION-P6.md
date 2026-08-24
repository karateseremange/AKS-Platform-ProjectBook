# ACCESS-002-PRODUCTION-P6 — Préparation et déploiement Apps Script contrôlé

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P6 |
| **Titre** | Préparation, déploiement et validation contrôlés de V1.4.0 en production |
| **Version** | 0.1.0 |
| **Statut** | P6-A à P6-D préparés et validés localement — écriture en production non autorisée |
| **Nature** | Procédure opérationnelle et registre de preuves |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-24 |
| **Version cible** | AKS Platform V1.4.0 — build `20260824.1` |

---

## 1. Objet et limite d’autorisation

Ce document consigne la préparation locale du déploiement Apps Script de production. Il ne vaut autorisation ni de `clasp push`, ni de création de version Apps Script, ni de modification du déploiement public, ni d’appel de son URL.

La production n’a pas été modifiée pendant P6-A à P6-D. Chaque mutation future exige une autorisation explicite et distincte.

## 2. Références immuables

| Référence | Valeur contrôlée |
|---|---|
| Tag applicatif | `v1.4.0` |
| Commit applicatif publié | `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5` |
| Têtes applicatives post-release | `main` et `develop` à `7a6b70a341bc869f10e1a18efda8ad4d6ab8fe6d` |
| Projet Apps Script PRODUCTION | suffixe `6x2ZeH` |
| Projet Apps Script RECETTE | suffixe `eIRxs4`, formellement exclu |
| Déploiement public existant | suffixe `wgNc37`, version 53 |
| Inventaire distant | 9 déploiements, 53 versions ; version la plus récente : 53 |
| Point de retour arrière | version Apps Script 53 du déploiement `wgNc37` |

Le HEAD Apps Script n’est jamais utilisé comme point de retour arrière. La version 53, déjà liée au déploiement public, constitue la référence de restauration.

## 3. P6-A — Espace de travail isolé

La préparation a été réalisée dans un espace de travail dédié, au commit exact du tag applicatif. Le projet de production a été identifié uniquement par son suffixe `6x2ZeH`, avec `rootDir = src`.

L’inventaire local contient 263 fichiers : 261 fichiers poussables par clasp et deux fichiers README hors envoi. Le fichier `.clasp.json` existe localement et n’est pas suivi par Git. Le seul écart Git attendu est `src/appsscript.json`.

## 4. P6-B — Contrôle distant sans écriture

Les métadonnées distantes ont été relues sans mutation :

- 9 déploiements et 53 versions ;
- déploiement public `wgNc37` toujours lié à la version 53 ;
- version 53 listée et dernière version numérotée ;
- exécution Web App par l’utilisateur accédant ;
- accès réservé aux utilisateurs disposant d’un compte Google.

Aucun déploiement, aucune version et aucun code distant n’ont été créés ou modifiés.

## 5. P6-C — Sauvegarde préalable et rapprochement

Une sauvegarde fraîche du HEAD et de la version 53 a été produite avant tout déploiement.

| Preuve | Valeur |
|---|---|
| Archive | `predeployment-20260824-222055.zip` |
| SHA-256 | `0DC7391DAA089E3FF4CF7C97CA84AC55C288B6971778232CF7D2852468ACB7D5` |
| Entrées ZIP | 438 |
| Fichiers HEAD frais | 225 |
| Fichiers version 53 frais | 207 |
| HEAD vs archive P3 | 0 différence |
| Version 53 vs archive P3 | 0 différence |

Les deux archives durables P3 ont également été relues avec succès :

- inventaire : `10F14203AD214DA930B16E047A3B16C852F415A78EC72196D1F4013D886C07D6` ;
- rapprochement : `EBBCB6B0CADF5546B933705F328D0A7FFA50286134A41FAC6DEE34530D9FAD79`.

## 6. P6-D — Construction et validation du paquet

### 6.1 Paquet rejeté

Le premier paquet a réintroduit le fuseau historique `America/New_York` en recopiant intégralement le manifeste de la version 53. Il a été marqué invalide et ne doit jamais être déployé.

| Preuve | Valeur |
|---|---|
| Archive rejetée | `deployment-package-v1.4.0-20260824-222406.zip` |
| SHA-256 préservé | `760928B9031EDB6E71127E7B9D6A81B0E86EE2D2C389C4D6FE233812ECDADD0E` |
| Marquage | `INVALID-DO-NOT-DEPLOY.txt` et marqueur adjacent |

### 6.2 Paquet corrigé

Le manifeste final part du tag V1.4.0 et reçoit uniquement la surcouche Web App nécessaire :

- `timeZone = Europe/Paris` ;
- `executeAs = USER_ACCESSING` ;
- `access = ANYONE`.

| Preuve | Valeur |
|---|---|
| Archive candidate | `deployment-package-v1.4.0-corrected-20260824-223358.zip` |
| SHA-256 ZIP | `520BF57BC5CF20C722580F8D3B9B27227BCAAC152FBAD38E2E8BE178540E75B6` |
| Entrées ZIP | 271 |
| Fichiers poussables / clasp status | 261 / 261 |
| SHA-256 inventaire canonique | `1D4EA866CAA5960A9F1DD3DC4FAB7000247BEC45C952BFC7F901326DC06AF3DC` |
| Écart exact vs version 53 | 84 fichiers : 54 ajoutés, 30 modifiés, 0 absent |
| Écart Git attendu | `src/appsscript.json` uniquement |
| `RecipeRunner` | absent |
| Barrière canonique | concluante |
| Autorisation d’écriture production | fausse |

L’écart canonique correspond exactement au diff Git entre l’ancienne référence applicative et le tag `v1.4.0` sous `src`. Le paquet comporte un avertissement indiquant que le push n’est pas autorisé.

## 7. Étapes futures séparément autorisées

### P6-E — Synchronisation du HEAD

Après autorisation explicite uniquement :

1. exécuter `clasp push` depuis le paquet corrigé vers le projet suffixé `6x2ZeH` ;
2. relire immédiatement le HEAD ;
3. comparer exactement les 261 fichiers attendus et le manifeste ;
4. vérifier que le déploiement public `wgNc37` reste encore lié à la version 53.

Cette autorisation ne couvre ni la création d’une version ni la modification du déploiement.

### P6-F — Création d’une version numérotée

Après nouvelle autorisation explicite, créer une version Apps Script numérotée et consigner son numéro, sa description et sa correspondance exacte avec le HEAD validé.

### P6-G — Mise à jour du déploiement existant

Après nouvelle autorisation explicite, faire pointer le déploiement `wgNc37` vers la nouvelle version, sans recréer le déploiement, afin de préserver son URL et ses paramètres Web App. Contrôler immédiatement que l’exécution et l’accès restent `USER_ACCESSING` et `ANYONE`.

### P6-H — Vérification fonctionnelle minimale

Après nouvelle autorisation explicite :

1. vérifier d’abord le Questionnaire santé public ;
2. vérifier ensuite les routes administratives en lecture seule ;
3. ne réaliser aucune mutation de compte, configuration AUDIT ou amorçage ACCESS dans P6.

En cas d’échec, remettre `wgNc37` sur la version 53 et vérifier la restauration. Le HEAD n’est pas un rollback.

## 8. Frontières avec les étapes suivantes

- P7 reste consacré à la configuration AUDIT de production et exige ses propres autorisations ;
- P8 reste consacré à la prévisualisation puis à l’amorçage minimal du premier gestionnaire ;
- aucune identité réelle, aucun secret et aucun identifiant complet de projet ou de déploiement ne sont consignés ici ;
- aucune étape P6-A à P6-D n’a appelé l’URL publique ni modifié la production.

## 9. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-24 | P6-A à P6-D consignés : cible et sauvegardes vérifiées, premier paquet rejeté, paquet corrigé conforme à la barrière canonique 54/30/0 ; aucune écriture de production autorisée |

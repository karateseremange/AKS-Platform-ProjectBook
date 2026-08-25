# ACCESS-002-PRODUCTION-P6 — Préparation et déploiement Apps Script contrôlé

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P6 |
| **Titre** | Préparation, déploiement et validation contrôlés de V1.4.0 en production |
| **Version** | 0.4.0 |
| **Statut** | P6 clôturé — déploiement public en version 54, URL préservée et vérifications P6-H concluantes |
| **Nature** | Procédure opérationnelle et registre de preuves |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-24 |
| **Version cible** | AKS Platform V1.4.0 — build `20260824.1` |

---

## 1. Objet et limite d’autorisation

Ce document consigne la préparation, la synchronisation, le versionnement, la mise à jour du déploiement public et les vérifications fonctionnelles de P6. Chaque mutation a fait l’objet d’une autorisation explicite et distincte.

P6 est clôturé sur la version Apps Script 54. Le déploiement public existant et son URL ont été préservés. Les opérations AUDIT de production, l’amorçage ACCESS et toute attribution réelle de droits restent exclus de P6.

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

P6-E a été explicitement autorisé puis exécuté le 24 août 2026. Le paquet corrigé a été contrôlé immédiatement avant l’écriture :

- SHA-256 ZIP : `520BF57BC5CF20C722580F8D3B9B27227BCAAC152FBAD38E2E8BE178540E75B6` ;
- cible : projet PRODUCTION suffixé `6x2ZeH`, `rootDir = src` ;
- manifeste : `Europe/Paris`, `USER_ACCESSING`, `ANYONE` ;
- `RecipeRunner` absent.

Le `clasp push` a envoyé 261 fichiers au HEAD à 22:49:41. Aucun `clasp version` ni `clasp deploy` n’a été exécuté.

Une relecture fraîche par `clasp pull` a ensuite été créée dans un répertoire distinct. Le contrôle final, compatible avec Windows PowerShell `5.1.26100.9168`, a normalisé les extensions serveur `.gs` et `.js`, les fins de ligne et le manifeste JSON.

| Contrôle après écriture | Résultat |
|---|---|
| Fichiers candidats | 261 |
| Fichiers relus depuis le HEAD | 261 |
| Chemins canoniques candidats | 261 |
| Chemins canoniques relus | 261 |
| Différences de chemin ou de contenu | 0 |
| Déploiement public `wgNc37` | toujours version 53 |

Deux résultats intermédiaires indiquant zéro fichier ont été invalidés : ils provenaient de scripts de contrôle incompatibles avec Windows PowerShell 5.1, notamment l’emploi de `[IO.Path]::GetRelativePath()`. Le diagnostic direct a confirmé 261 fichiers relus, puis la comparaison compatible PowerShell 5.1 a établi le résultat final 261/261 avec zéro différence.

P6-E est clôturé. Le HEAD contient exactement la candidate V1.4.0 tandis que l’URL publique continue d’exécuter la version 53. La création d’une version numérotée relève exclusivement de P6-F et reste non autorisée.

### P6-F — Création d’une version numérotée

P6-F a été explicitement autorisé puis exécuté le 24 août 2026 depuis le répertoire de relecture P6-E. Les préconditions ont confirmé le projet suffixé `6x2ZeH`, 261 fichiers locaux, la dernière version numérotée 53 et le déploiement public `wgNc37` toujours lié à cette version.

Une seule version Apps Script a été créée :

| Propriété | Valeur |
|---|---|
| Version créée | 54 |
| Dernière version listée | 54 |
| Description | `AKS Platform V1.4.0 - build 20260824.1 - P6-F production` |
| Version publique pendant et après P6-F | 53 |

La version 54 a ensuite été relue dans un répertoire neuf avec `clasp pull --versionNumber 54`. La comparaison compatible Windows PowerShell `5.1.26100.9168` a produit :

| Contrôle de la version 54 | Résultat |
|---|---|
| Fichiers candidats | 261 |
| Fichiers version 54 | 261 |
| Chemins canoniques candidats | 261 |
| Chemins canoniques version 54 | 261 |
| Différences de chemin ou de contenu | 0 |
| Déploiement public `wgNc37` | toujours version 53 |

Aucun `clasp deploy` n’a été exécuté. P6-F est clôturé : la version 54 est l’artefact immuable admissible à P6-G. La mise à jour du déploiement existant reste non autorisée.

### P6-G — Mise à jour du déploiement existant

P6-G a été explicitement autorisé puis exécuté le 24 août 2026. Le déploiement public existant, identifié par le suffixe `wgNc37`, a été mis à jour de la version 53 vers la version 54 avec la description `AKS Platform V1.4.0 - build 20260824.1 - PRODUCTION`.

Le contrôle initial du script PowerShell n’a reconnu que sept lignes de déploiement en raison d’un analyseur trop strict. Ce résultat intermédiaire a été invalidé. Une analyse flexible de la sortie réelle de clasp a ensuite établi :

| Contrôle P6-G | Résultat |
|---|---|
| Déploiements avant | 9 |
| Déploiements après | 9 |
| Différences d’identifiants | 0 |
| Déploiement public ciblé | 1 |
| Version avant | 53 |
| Version après | 54 |
| Identifiant préservé | oui |
| URL préservée | oui |

Aucun nouveau déploiement n’a été créé. La version 53 demeure le point de retour arrière, mais aucun retour arrière n’a été déclenché.

### P6-H — Vérification fonctionnelle minimale

P6-H a été explicitement autorisé en lecture fonctionnelle. Les vérifications ont été réalisées sans soumission de questionnaire, modification de configuration, action sur les journaux ou mutation de compte.

| Parcours | Résultat |
|---|---|
| Page publique WordPress du Questionnaire santé | fonctionnelle avec plusieurs comptes et navigateurs |
| Questionnaire santé depuis le parcours public officiel | fonctionnel, aucune régression constatée |
| Portail `?app=admin` | chargé sans erreur avec le compte de production actuel |
| Version affichée | `1.4.0` |
| Nom affiché | `ACCESS et administration sécurisée` |
| Paramétrage `?app=config` | chargé en consultation, valeurs valides visibles |
| Journaux | chargés en consultation, 25 événements visibles |
| Mutation manuelle | aucune |

Le lien Apps Script direct exécuté avec `USER_ACCESSING` reste dépendant des droits Google du compte actif sur les ressources sous-jacentes. Son accès par d’autres comptes Gmail n’est pas présenté comme opérationnel avant P7 et P8. Le parcours public officiel du Questionnaire santé, porté par le site du club, fonctionne indépendamment du compte et constitue le contrôle public de non-régression.

L’absence de « Comptes et accès » dans le portail est attendue avant la configuration AUDIT de production et l’amorçage du premier gestionnaire. P6-H est concluant pour son périmètre. P6 est clôturé ; P7 devient le prochain jalon.

## 8. Frontières avec les étapes suivantes

- P7 reste consacré à la configuration AUDIT de production et exige ses propres autorisations ;
- P8 reste consacré à la prévisualisation puis à l’amorçage minimal du premier gestionnaire ;
- aucune identité réelle, aucun secret et aucun identifiant complet de projet ou de déploiement ne sont consignés ici ;
- P6-E à P6-H ont synchronisé le HEAD, créé la version 54, mis à jour le déploiement existant et vérifié les parcours autorisés ; aucune configuration AUDIT, aucun registre ACCESS et aucun compte réel n’ont été modifiés.

## 9. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.4.0 | 2026-08-24 | P6 clôturé : déploiement public existant mis à jour vers la version 54 avec identifiant et URL préservés ; Questionnaire public, portail, Paramétrage et Journaux vérifiés sans mutation ; P7 devient le prochain jalon |
| 0.3.0 | 2026-08-24 | P6-F clôturé : version Apps Script 54 créée puis relue à 261/261 sans différence avec la candidate ; déploiement public maintenu sur la version 53, P6-G non autorisé |
| 0.2.0 | 2026-08-24 | P6-E clôturé : 261 fichiers poussés vers le HEAD puis relus et comparés à 261/261, zéro différence ; déploiement public maintenu sur la version 53, aucune version ni modification de déploiement exécutée |
| 0.1.0 | 2026-08-24 | P6-A à P6-D consignés : cible et sauvegardes vérifiées, premier paquet rejeté, paquet corrigé conforme à la barrière canonique 54/30/0 ; aucune écriture de production autorisée |

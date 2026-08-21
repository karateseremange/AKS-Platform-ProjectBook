# ACCESS-002-PRODUCTION-P3 — Inventaire de production en lecture seule

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P3 |
| **Titre** | Inventaire technique préalable de la production |
| **Version** | 1.0.0 |
| **Statut** | Inventaire et rapprochement clôturés — production inchangée |
| **Nature** | Protocole d’exploitation sans mutation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-21 |

## 1. Objet

P3 définit l’inventaire nécessaire avant toute publication ou mutation de production. Il doit identifier et sauvegarder l’état Apps Script actuellement publié, permettre son rapprochement avec Git et préparer un retour arrière reproductible.

Les lectures réelles ont ensuite été autorisées par phases distinctes. Les résultats minimisés sont consignés ci-dessous ; les preuves complètes restent dans des archives locales protégées.

## 2. Décisions I1 à I12 validées

### I1 — Finalité strictement bornée

L’inventaire identifie et sauvegarde :

- le projet Apps Script de production ;
- le code source actuellement présent ;
- le déploiement Web public ;
- la version Apps Script associée ;
- l’URL publique ;
- les paramètres non secrets du déploiement ;
- la référence Git pouvant correspondre à cet état ;
- les composants nécessaires au retour arrière.

Il ne teste pas fonctionnellement l’application et ne modifie aucune configuration.

### I2 — Autorisation distincte

L’autorisation d’inventaire couvrira uniquement les lectures expressément listées en I5 et une sauvegarde locale isolée. Elle n’autorisera aucun `clasp push`, `clasp deploy`, création de version, changement de propriété, changement d’identité ou permission, appel d’écriture, amorçage ACCESS, test AUDIT ou fusion vers `main`.

### I3 — Identification préalable

Avant toute commande distante, l’opérateur confirme la source fiable permettant d’identifier le projet de production : console Apps Script, URL d’édition connue ou métadonnée du déploiement existant.

Le projet de recette dont l’identifiant se termine par `eIRxs4` est exclu. Si le projet présumé de production correspond à ce projet, l’opération s’arrête immédiatement.

### I4 — Espace de travail isolé et archive durable

L’inventaire s’exécute dans un nouveau répertoire temporaire hors du dépôt applicatif actif. Le `.clasp.json` de recette n’est ni remplacé ni réutilisé. La copie de production n’est jamais mélangée à la candidate et aucun identifiant sensible n’est ajouté à Git.

Ce répertoire sert uniquement au travail courant. Avant toute étape ultérieure, ses preuves sont copiées dans une archive protégée et durable, distincte du dépôt Git et du répertoire temporaire. L’archive est relue et vérifiée par ses empreintes avant d’être considérée comme sauvegarde de retour arrière.

### I5 — Lectures autorisables

Après autorisation spécifique, le protocole pourra uniquement :

1. lire les métadonnées du projet Apps Script ;
2. lister ses déploiements ;
3. lister ses versions ;
4. récupérer séparément le HEAD courant du projet Apps Script ;
5. identifier le déploiement Web actif et son numéro de version ;
6. récupérer séparément le contenu exact de cette version numérotée ;
7. relever l’URL publique depuis les métadonnées sans l’appeler ;
8. relever les paramètres d’exécution et d’accès du déploiement ;
9. calculer localement les empreintes des deux contenus récupérés ;
10. comparer le HEAD au contenu réellement déployé ;
11. comparer en priorité la version déployée à `main`, aux tags publiés et à la candidate.

Les commandes finales seront présentées avant exécution et revues pour démontrer leur absence d’écriture.

### I6 — Sauvegarde formelle

La sauvegarde restreinte contient :

- la copie exacte et séparée du HEAD Apps Script et de son manifeste ;
- la copie exacte et séparée des fichiers et du manifeste de la version déployée ;
- les identifiants minimisés du projet et du déploiement ;
- le numéro de version ;
- l’URL publique dans une preuve protégée si elle est confidentielle ;
- les paramètres « exécuter en tant que » et « utilisateurs autorisés » ;
- la date et l’identité de l’opérateur ;
- un manifeste horodaté et l’empreinte SHA-256 de chaque fichier des deux états ;
- le résultat de la relecture et de la vérification de l’archive durable ;
- le résultat du rapprochement Git.

L’archive durable n’est ni supprimée ni remplacée avant la confirmation finale de production. Le répertoire temporaire ne constitue jamais à lui seul une sauvegarde valable.

### I7 — Rapprochement Git

| Référence | Contrôle attendu |
|---|---|
| HEAD du projet Apps Script | comparaison avec la version numérotée réellement déployée |
| `main` applicatif actuel | correspondance avec la version réellement déployée |
| tag `v1.2.0` | correspondance avec la version réellement déployée et la dernière version applicative documentée |
| `develop` à `b13fc20` | écart entre la version réellement déployée et la candidate `1.4.0-rc.1` |
| futur commit publié | référence exacte à déployer après autorisation |

`V1.4.0` ne devient pas définitive si l’état public réel reste indéterminé.

### I8 — Propriétés et ressources métier exclues

L’inventaire initial ne lit pas les valeurs des propriétés Script, le contenu des classeurs, le registre ACCESS, les preuves AUDIT, les comptes ou habilitations, ni les données Analytics, Présences, Inscriptions ou Drive liées.

Leur sauvegarde ou leur contrôle exigera une nouvelle autorisation ciblée.

### I9 — URL publique non exécutée

L’URL publique est relevée depuis les métadonnées du déploiement mais n’est pas ouverte. Le contrôle du Questionnaire santé public et des routes administratives relève d’une étape fonctionnelle ultérieure autorisée séparément.

### I10 — Conditions d’arrêt

L’inventaire s’arrête immédiatement si :

- le projet de production reste ambigu ou correspond à la recette ;
- plusieurs déploiements publics sont actifs sans référence claire ;
- la version déployée ne peut pas être déterminée ;
- le contenu exact de la version numérotée déployée ne peut pas être récupéré séparément du HEAD ;
- une commande implique ou peut impliquer une écriture ;
- une donnée sensible apparaît dans une sortie destinée à Git ;
- le HEAD, la version déployée ou leurs empreintes ne peuvent pas être vérifiés ;
- l’archive durable ne peut pas être créée, relue ou validée par ses empreintes ;
- l’accès nécessite d’étendre le périmètre autorisé.

### I11 — Restitution minimisée

Le Project Book reçoit uniquement les suffixes minimisés des identifiants, le numéro de version, les empreintes, la référence Git rapprochée ou la mention « aucune correspondance exacte », les paramètres non secrets du déploiement, les composants nécessaires au retour arrière et les anomalies constatées.

Les identifiants complets, URL restreintes et valeurs sensibles restent dans la preuve d’exploitation protégée.

### I12 — Critères de sortie

P3 est concluant uniquement lorsque sont connus exactement :

- le code actuellement exécuté ;
- l’éventuel écart entre le HEAD Apps Script et la version déployée ;
- la méthode permettant de revenir à cet état ;
- l’URL à conserver ;
- la pertinence du numéro `V1.4.0` ;
- les éléments à sauvegarder avant publication ;
- les autorisations réelles encore nécessaires.

## 3. Résultats de l’inventaire autorisé

L’inventaire réel a été exécuté le 21 août 2026 après autorisations séparées,
uniquement en lecture distante et en traitement local. Aucun `clasp push`,
déploiement, version, propriété, compte, registre ou ressource métier n’a été
créé ou modifié.

### 3.1 Identification minimisée

| Élément | Résultat vérifié |
|---|---|
| Projet Apps Script de production | suffixe `6x2ZeH`, distinct de la recette `eIRxs4` |
| Déploiement Web public | suffixe `wgNc37` |
| Version effectivement exécutée | version Apps Script numérotée `53` |
| Mode d’exécution | utilisateur accédant à l’application |
| Accès | tout utilisateur possédant un compte Google |
| URL publique | identifiée et conservée dans la preuve protégée, non appelée pendant P3 |
| Libellé du déploiement | contient « Recette Présences » malgré son usage confirmé en production ; anomalie documentaire, sans modification pendant P3 |

Neuf déploiements et 53 versions ont été inventoriés. Le déploiement
`wgNc37` a été confirmé par le Product Owner comme déploiement public de
production.

### 3.2 États Apps Script sauvegardés

Le HEAD et la version 53 ont été récupérés séparément :

| État | Fichiers source comparables | Qualification |
|---|---:|---|
| Version 53 déployée | 207 | état public réellement exécuté |
| HEAD Apps Script | 225 | état non déployé, distinct de la version 53 |
| Différence HEAD / version 53 | 6 fichiers modifiés et 18 fichiers ajoutés dans le HEAD | aucune incidence sur le déploiement figé à 53 |

L’archive complète contient 439 fichiers vérifiés sans différence après copie.
Elle conserve séparément les deux états et leurs manifestes.

### 3.3 Rapprochement Git

Les références vérifiées sont :

| Référence | SHA | Résultat |
|---|---|---|
| `main` | `e8fb0fc3d8e5dfcf806ef5a0b7fab0007b84ec49` | 206 fichiers applicatifs identiques sur 206 à la version 53 |
| HEAD Apps Script | `ed03cc428f8a8b055400b59aec7ba2e0a005629f` + `RecipeRunner.js` | 224 fichiers Git identiques, aucun modifié, un lanceur de recette non versionné ajouté |
| `develop` / RC1 | `b13fc202300af6f7ce0c99b65403fa83117ed34b` | candidate `1.4.0-rc.1` non déployée |

Le seul écart entre la version 53 et `main` est `appsscript.json`. Le
manifeste récupéré depuis la version déployée contient les paramètres Web App
`USER_ACCESSING` et `ANYONE`, absents du manifeste Git. Le code
applicatif est identique. Les deux manifestes historiques utilisent encore
`America/New_York` ; la candidate prévoit `Europe/Paris`, à contrôler au
Quality Gate et au déploiement.

Le HEAD Apps Script correspond au commit de fusion d’INSCRIPTIONS-010
`ed03cc4`, avec le seul fichier supplémentaire `RecipeRunner.js`
(SHA-256 `2EB1ED87F758EA0E5070BD7BFE861784622137C7B5B2E9ED866E2CF9ED20687C`).
Ce lanceur appelle des composants INSCRIPTIONS-010 versionnés, n’est pas
présent dans la version 53 et n’est pas inclus dans RC1. Il est qualifié de
résidu non déployé ; P3 ne le supprime pas.

### 3.4 Archives durables vérifiées

| Archive protégée | SHA-256 |
|---|---|
| Inventaire HEAD + version 53 | `10F14203AD214DA930B16E047A3B16C852F415A78EC72196D1F4013D886C07D6` |
| Rapprochement Git complémentaire | `EBBCB6B0CADF5546B933705F328D0A7FFA50286134A41FAC6DEE34530D9FAD79` |

La première archive a été relue à 448 entrées. L’archive complémentaire a été
relue à 13 entrées et confirme que la première archive est restée inchangée.
Les emplacements complets, identifiants complets et URL restent hors Git.

### 3.5 Retour arrière préparé et sortie P3

La référence primaire de retour arrière est la version Apps Script numérotée
53 sur le déploiement existant `wgNc37`, afin de conserver l’URL publique.
Le HEAD ne doit pas servir de sauvegarde de production et aucun `clasp pull`
du HEAD ne doit remplacer la copie de la version 53.

Les critères I12 sont satisfaits : l’état exécuté, l’écart du HEAD, la
référence de retour arrière, l’URL à conserver, les archives et les
autorisations restantes sont identifiés. Le numéro proposé `V1.4.0` reste
cohérent, mais son gel définitif et son build final relèvent du Quality Gate
P4. P3 est clôturé sans mutation de production.

## 4. Séquencement

1. intégrer le présent cadrage dans `develop` du Project Book ;
2. demander une autorisation explicite d’inventaire en lecture seule ;
3. présenter et vérifier les commandes exactes ;
4. exécuter les seules lectures autorisées ;
5. appliquer toute condition d’arrêt sans contournement ;
6. produire la restitution minimisée ;
7. documenter les résultats dans une nouvelle PR ;
8. soumettre séparément la suite du Quality Gate.

## 5. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-21 | Inventaire réel clôturé : version publique 53 identifiée, HEAD rattaché à `ed03cc4` plus un lanceur non versionné, `main` rapproché, RC1 confirmée non déployée et deux archives SHA-256 vérifiées sans mutation de production |
| 0.1.1 | 2026-08-21 | Distinction obligatoire entre HEAD Apps Script et contenu exact de la version déployée ; archive protégée durable, horodatée, relue et vérifiée par SHA-256 |
| 0.1.0 | 2026-08-21 | Décisions I1 à I12 validées : inventaire Apps Script borné en lecture seule, sauvegarde isolée, rapprochement Git, exclusion des propriétés et données métier, URL non exécutée et autorisation réelle différée |

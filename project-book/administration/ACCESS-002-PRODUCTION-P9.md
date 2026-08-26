# ACCESS-002-PRODUCTION-P9 — Validation fonctionnelle et deuxième gestionnaire

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P9 |
| **Titre** | Validation fonctionnelle et ajout du deuxième gestionnaire ACCESS en production |
| **Version** | 1.0.1 |
| **Statut** | Clôturé — P9-A à P9-E conformes ; P10 clôturé ultérieurement |
| **Nature** | Procédure d’exploitation, de sécurité et de preuve |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-26 |
| **Version cible** | AKS Platform V1.4.0 — Apps Script version 54 |

---

## 1. Objet et limites

Ce document consigne la validation fonctionnelle d’ACCESS en production et l’ajout contrôlé du deuxième gestionnaire. P9-B était sans écriture, P9-C autorisait une mutation unique avec audit corrélé, et les contrôles finaux étaient en lecture seule.

Lors de sa clôture initiale, P9 n’autorisait ni P10, ni une autre mutation ACCESS/AUDIT, ni une modification du déploiement, du code, de `main` ou des tags. P10 a ensuite été confirmé séparément par le Product Owner, sans retour arrière ni nouvelle mutation de production. Les identifiants et révisions complets restent hors de Git.

## 2. État initial et compte validé

P9 part du registre `access/1.2` à un compte actif, `karate.seremange@gmail.com`, avec rôle `ADMINISTRATEUR`, affectation globale ACCESS, capacité `ACCESS_MANAGE` et révision suffixée `nshtnj`.

Le deuxième compte validé est `aserridj@gmail.com`, affiché comme `Anthony Serridj`. L’adresse erronée envisagée auparavant a été écartée et n’a jamais été utilisée.

## 3. P9-A et P9-B — contrôles sans écriture

P9-A a confirmé le Portail AKS, « Mes accès », « Comptes et accès », le rôle `ADMINISTRATEUR` et la seule capacité `ACCESS_MANAGE` du premier gestionnaire. Paramétrage et Journaux sont absents et leurs routes directes sont refusées.

P9-B a prévisualisé un registre à deux comptes : cible `aserridj@gmail.com`, statut `ACTIVE`, rôle `ADMINISTRATEUR`, module `ACCESS`, saison `*`, capacité `ACCESS_MANAGE` et révision proposée suffixée `2vedi1`.

La relecture immédiate a confirmé un seul compte persisté et la révision `nshtnj`, avec `writePerformed: false` et `auditWritePerformed: false`. Le fichier temporaire a été supprimé.

## 4. P9-C — ajout contrôlé

Après autorisation explicite, le service officiel a ajouté `aserridj@gmail.com` sans altérer le premier gestionnaire. Le registre final contient deux comptes actifs et la révision persistée se termine par `dlkpc9`.

Les preuves `ACCESS_REGISTRY_UPDATE` portent `INTENTION` puis `REUSSI` et partagent la corrélation suffixée `c9e6d7`. Le fichier `P9C_Temporary.gs` a été supprimé et le projet Apps Script enregistré.

## 5. Vérification finale

La relecture indépendante du support AUDIT confirme un support privé, seize en-têtes, exactement cinq preuves — P7-E, deux preuves P8-C et deux preuves P9-C — et aucun résultat `ECHEC` ou `REFUSE`. Les contrôles fonctionnels n’ont ajouté aucune ligne.

Connecté avec `aserridj@gmail.com`, le deuxième gestionnaire voit uniquement « Mes accès » et « Comptes et accès ». Ses droits effectifs sont `ADMINISTRATEUR`, module `ACCESS`, saison `*` et capacité `ACCESS_MANAGE`. La liste contient exactement les deux gestionnaires actifs. Paramétrage et Journaux sont refusés.

Un troisième compte absent du registre reçoit « Accès non autorisé », sans destination ni action rapide. Le Questionnaire santé public s’affiche normalement et sa première étape reste accessible sans soumission réelle.

## 6. État final

- schéma `access/1.2` et `bootstrap: false` ;
- deux gestionnaires actifs ;
- `karate.seremange@gmail.com` préservé ;
- `aserridj@gmail.com` ajouté ;
- rôle `ADMINISTRATEUR` et capacité `ACCESS_MANAGE` pour chacun ;
- révision suffixée `dlkpc9` ;
- support AUDIT privé à cinq preuves ;
- déploiement public `wgNc37` toujours en version 54.

## 7. Anomalies non bloquantes

Les pages ACCESS utilisent une présentation plus minimale que le Portail AKS. Certains refus directs exposent aussi un nom de fichier interne et un numéro de ligne. Ces écarts ne contournent pas le contrôle d’accès et devront être corrigés ultérieurement.

## 8. Clôture et historique

Tous les critères P9 sont satisfaits. P9 est clôturé. P10 a ensuite confirmé l’état final de production selon [ACCESS-002-PRODUCTION-P10](ACCESS-002-PRODUCTION-P10.md), sans autoriser de retour arrière.

| Version | Date | Évolution |
|---|---|---|
| 1.0.1 | 2026-08-26 | Alignement postérieur : P10 confirmé et clôturé sans retour arrière ni nouvelle mutation de production |
| 1.0.0 | 2026-08-26 | P9 clôturé : deuxième gestionnaire ajouté, révision `dlkpc9`, preuves corrélées par `c9e6d7`, validation multi-compte, refus fermé, Questionnaire public et support AUDIT à cinq preuves conformes ; P10 non autorisé |

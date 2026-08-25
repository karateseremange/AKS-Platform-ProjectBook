# AUDIT-001-PRODUCTION — Audit persistant de production

| Propriété | Valeur |
|---|---|
| **Document ID** | AUDIT-001-PRODUCTION |
| **Titre** | Extension contrôlée d’AUDIT-001 à la production |
| **Version** | 0.6.0 |
| **Statut** | P7-A à P7-D clôturés — précontrôle conforme sans écriture ; P7-E non autorisé |
| **Nature** | Spécification fonctionnelle, technique, sécurité et exploitation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-25 |
| **Version cible** | À confirmer après vérification de `main` et de la production |

---

## 1. Objet

Ce document définit l’extension du socle persistant AUDIT-001 à la production afin de permettre ultérieurement les mutations critiques d’ACCESS. Il complète ACCESS-002-PRODUCTION et ne constitue aucune autorisation d’agir sur une ressource, une propriété, une identité, une configuration ou un déploiement de production.

Le socle multi-environnement est intégré dans `develop`, le support privé de production est préparé, les cinq paramètres techniques sont installés et le précontrôle P7-D a validé le projet, le support, le schéma, les permissions et l’identité technique sans écriture. La preuve contrôlée P7-E demeure obligatoire avant activation et exige une autorisation distincte.

## 2. Principes permanents

- échec fermé pour toute action critique sans preuve persistante conforme ;
- séparation stricte des environnements et des supports ;
- identité et contexte résolus côté serveur ;
- configuration explicite, non administrable depuis l’interface ;
- écriture append-only suivie d’une relecture exacte ;
- minimisation des métadonnées ;
- aucun secret ni identifiant complet dans Git ou les sorties publiques ;
- aucune purge ou suppression implicite ;
- autorisations de préparation et de production séparées.

## 3. Décisions détaillées validées

### P1.1 — Environnements fermés

`audit.environment` accepte exclusivement les valeurs exactes `RECETTE` et `PRODUCTION`. Toute absence, valeur inconnue, variation de casse ou espace provoque un refus fermé.

### P1.2 — Supports distincts

| Environnement | Titre exact | Onglet |
|---|---|---|
| `RECETTE` | `AKS Audit RECETTE` | `AKS_Audit` |
| `PRODUCTION` | `AKS Audit PRODUCTION` | `AKS_Audit` |

L’identifiant configuré, l’identifiant réellement ouvert, le titre et le schéma doivent tous correspondre. Aucun support ne peut être réutilisé dans l’autre environnement.

### P1.3 — Liaison au projet Apps Script

Le paramètre technique non administrable `audit.scriptId` est ajouté. Sa valeur explicite doit correspondre exactement à `ScriptApp.getScriptId()`.

L’identifiant complet reste une donnée technique restreinte : il n’est jamais versionné dans Git et seules ses caractéristiques minimisées peuvent apparaître dans un précontrôle autorisé.

### P1.4 — Schéma commun

Le schéma reste `aks-audit/1.0`, avec les seize colonnes et l’onglet `AKS_Audit`. Aucun nouveau schéma n’est introduit pour la seule distinction d’environnement.

### P1.5 — Contrat AUDIT généralisé

Une capacité générique de contrôle d’audit persistant remplace la dépendance métier à la recette, par exemple `isPersistentAuditAvailable()`.

`isPersistentRecipeAudit()` reste temporairement disponible uniquement pour la compatibilité des recettes existantes. Il ne décide plus de l’autorisation normale d’ACCESS.

### P1.6 — Raccordement ACCESS

ACCESS utilise le contrôle générique et reste en échec fermé si la configuration, le projet, le support, le titre, le schéma, les en-têtes, le verrou, l’écriture ou la relecture ne sont pas conformes.

### P1.7 — Permissions du support

Le contrôle de production vérifie au minimum :

- absence de partage public ;
- absence de partage « toute personne disposant du lien » ;
- permissions déclarées compatibles avec l’écriture par l’identité technique, sans effectuer d’écriture ;
- inventaire minimisé du propriétaire et des éditeurs dans la preuve de précontrôle ;
- absence de modification automatique des permissions.

Une permission incorrecte bloque l’activation. Sa correction exige une autorisation réelle distincte.

### P1.8 — Conservation initiale

La durée initiale est fixée à **1 095 jours**.

Elle est réévaluée avant la première purge selon l’usage, les besoins de sécurité et les obligations applicables. La conservation illimitée par défaut reste exclue.

Aucune purge réelle n’est exécutée pendant la publication et l’amorçage d’ACCESS.

### P1.9 — Purge différée et contrôlée

Le contrat futur de purge doit imposer : prévisualisation, sauvegarde exacte, confirmation distincte, sélection par date, conservation de l’en-tête et des lignes non expirées, relecture, audit avant/après et restauration en cas d’échec.

Aucune route Web, purge automatique ou première purge réelle n’est introduite dans la présente mise en production.

### P1.10 — Sauvegarde et restauration

Une sauvegarde exacte et privée est obligatoire avant activation initiale, évolution de schéma, purge ou réparation exceptionnelle.

Une mutation ACCESS normale ne copie pas le classeur complet : elle conserve le modèle append-only et la relecture exacte.

Le retour arrière traite aussi le support AUDIT :

- le classeur peut être isolé et déconnecté de la configuration ;
- les preuves utiles déjà produites ne sont pas supprimées automatiquement ;
- une suppression, purge ou restauration physique exige une décision distincte ;
- l’intégrité, la finalité et la durée de conservation des preuves restantes sont vérifiées ;
- les sauvegardes temporaires sont supprimées uniquement après confirmation de leur inutilité.

### P1.11 — Précontrôle sans écriture

Le précontrôle est strictement sans écriture. Il vérifie et restitue sous forme minimisée :

- environnement ;
- correspondance du projet Apps Script ;
- correspondance du classeur et de son titre ;
- schéma et nombre de lignes ;
- état des permissions et compatibilité déclarée avec l’écriture, sans la tester ;
- accessibilité effective en lecture ;
- blocages éventuels.

Il ne crée ni onglet, ni en-tête, ni propriété, ni preuve, ni sauvegarde.

### P1.12 — Test contrôlé d’écriture et recette

Le test d’écriture/relecture est distinct du précontrôle et exige une autorisation spécifique. Lui seul démontre la capacité effective d’écrire puis de relire. Il écrit uniquement une preuve contrôlée, la relit exactement, consigne son résultat et ne la présente jamais comme une opération métier réelle.

La campagne applicative préalable, exécutée exclusivement en recette, couvre :

- maintien du comportement RECETTE existant ;
- refus croisés entre environnements et supports ;
- refus d’un mauvais projet Apps Script ;
- refus d’un partage non conforme ;
- audit persistant générique conforme ;
- refus d’une mutation ACCESS sans audit ;
- acceptation avec audit conforme injecté ;
- restauration exacte de la configuration et des ressources de recette ;
- suite cumulative complète.

Cette campagne ne crée ni ressource, ni propriété, ni preuve de production.

## 3.1 État d’implémentation de P1

La [PR applicative #125](https://github.com/karateseremange/AKS-Platform/pull/125) est fusionnée dans `develop` au commit [`ab52dc6`](https://github.com/karateseremange/AKS-Platform/commit/ab52dc6200ca5e138883d182cfcd700352276dad).

L’implémentation fournit notamment :

- les cinq paramètres techniques AUDIT, dont `audit.scriptId` et `audit.retentionDays` ;
- la séparation exacte des supports `RECETTE` et `PRODUCTION` ;
- `isPersistentAuditAvailable()` avec maintien temporaire de `isPersistentRecipeAudit()` pour les recettes existantes ;
- le raccordement générique d’ACCESS, qui reste fermé sans audit conforme ;
- la vérification que l’identité technique est propriétaire ou éditrice du classeur de production ;
- `AKS_preflightAudit001Production()`, strictement sans écriture ;
- `AKS_runAudit001ProductionControlledWriteRead(confirmation)`, distinct, réautorisé côté serveur et inutilisable sans confirmation explicite ;
- l’action technique `AUDIT_SUPPORT_TEST`, qui ne représente aucune opération métier ;
- l’absence de fonction de purge.

La tête `a620b390` a été synchronisée dans l’environnement Apps Script de recette. Les validations ont réussi à **62/62** pour AUDIT-001 et **660/660** pour la campagne cumulative, sans exécuter les deux fonctions de production.

Aucun classeur, paramètre, compte, registre, déploiement ou test réel de production n’a été créé ou modifié. P1 est donc intégré et validé en recette, mais non activé en production.

## 3.2 État du précontrôle P7-A

Le protocole détaillé est consigné dans [ACCESS-002-PRODUCTION-P7](ACCESS-002-PRODUCTION-P7.md).

Le 25 août 2026, les recherches en lecture seule n’ont identifié aucun classeur portant exactement le titre `AKS Audit PRODUCTION` ni dossier de production exact dans le Drive accessible. Le classeur privé `AKS Audit RECETTE` reste distinct et n’est pas réutilisé.

Dans le projet Apps Script de production suffixé `6x2ZeH`, `AKS_preflightAudit001Production()` a atteint le contrôle de configuration puis a refusé la suite avec `Configuration d'audit indisponible.` au premier paramètre requis, `audit.environment`. Ce résultat confirme l’échec fermé avant support conforme.

P7-A n’a créé ni ressource, ni propriété, ni onglet, ni en-tête, ni sauvegarde, ni preuve. Le test contrôlé d’écriture/relecture n’a pas été exécuté. P7-B, consacré au support privé de production, exige une autorisation distincte.

## 3.3 État du support P7-B

Le dossier privé `AKS Platform PRODUCTION` et le classeur Google Sheets natif privé `AKS Audit PRODUCTION` ont été créés dans le Drive accessible. La relecture confirme un seul onglet `AKS_Audit`, les seize en-têtes exacts dans l’ordre contractuel, aucune ligne d’audit et le fuseau `Europe/Paris`.

Le dossier et le classeur sont non partagés. Aucun support de recette n’a été réutilisé. L’écart de fuseau attribué à l’import a été corrigé de façon ciblée avant clôture.

Aucun identifiant Drive complet n’est versionné. Aucune propriété Apps Script, configuration AUDIT ou preuve d’audit n’a été créée. P7-C exige une autorisation distincte.

## 3.4 État de la configuration P7-C

Les cinq paramètres techniques non administrables ont été installés dans les propriétés du projet de production et relus exactement : environnement `PRODUCTION`, projet suffixé `6x2ZeH`, classeur suffixé `GyeQH4`, conservation `1095` jours et schéma `aks-audit/1.0`.

Le résultat confirme `parameterCount: 5`, `exactReadback: true` et `auditWritePerformed: false`. La fonction temporaire a ensuite été supprimée et le projet enregistré. Aucun identifiant complet n’est versionné et le déploiement public version 54 demeure inchangé.

Cette étape ne prouvait pas encore l’accessibilité, les permissions ni l’ensemble du contrat AUDIT, contrôlés séparément en P7-D.

## 3.5 État du précontrôle P7-D

Le 25 août 2026, `AKS_preflightAudit001Production()` a réussi dans le projet de production suffixé `6x2ZeH`. Le résultat confirme `ok: true`, l’environnement `PRODUCTION`, le support suffixé `GyeQH4`, le schéma `aks-audit/1.0`, la conservation de 1 095 jours et `writePerformed: false`.

Le support `AKS Audit PRODUCTION` reste vide avec `rowCount: 0`. Les permissions relues sont disponibles et privées : `sharingAccess: "PRIVATE"`, `sharingPermission: "NONE"`, propriétaire présent, aucun éditeur additionnel et acteur technique présent.

Aucune preuve d’audit n’a été créée. P7-E, test contrôlé d’écriture et de relecture, reste non autorisé.

## 4. Comportement avant configuration

Le nouveau code peut être déployé avant la configuration d’AUDIT et l’amorçage d’ACCESS sans ouvrir de droit :

- aucune ressource ou propriété n’est créée automatiquement ;
- aucun registre ACCESS n’est créé ;
- aucun rôle ou capacité n’est attribué ;
- toute mutation ACCESS exigeant AUDIT est refusée ;
- une lecture invalide ou une configuration partielle ne devient jamais une autorisation ;
- les routes publiques existantes, notamment le Questionnaire santé, conservent leur comportement ;
- les fonctions internes Inscriptions restent non exposées et refusées en production.

Le déploiement seul ne constitue donc ni l’activation d’AUDIT, ni l’amorçage d’ACCESS.

## 5. Inventaire préalable obligatoire

Avant toute publication réelle, une opération sans mutation doit identifier et sauvegarder formellement :

- le projet Apps Script de production ;
- l’identifiant du déploiement public ;
- la version Apps Script actuellement déployée ;
- l’URL publique de production ;
- le commit ou tag applicatif correspondant lorsqu’il est démontrable ;
- la référence actuelle de `main` ;
- la configuration nécessaire au retour arrière.

Cette preuve conditionne la confirmation de la version cible. `V1.4.0` reste une proposition tant que l’état réel de `main` et de la production n’est pas rapproché.

## 6. Deux niveaux d’autorisation

### Niveau 1 — Préparation

La validation du présent cadrage autorise :

- les modifications documentaires ;
- l’implémentation applicative sur une branche dédiée ;
- les tests locaux et la recette isolée ;
- les PR vers `develop`.

Elle n’autorise aucune opération réelle de production.

### Niveau 2 — Production

Une autorisation spécifique est nécessaire pour chacune des opérations suivantes :

- consultation ou sauvegarde d’un identifiant/configuration sensible de production ;
- création ou modification du classeur AUDIT de production ;
- modification de propriétés ;
- test réel d’écriture/relecture ;
- fusion vers `main` ;
- création de tag ;
- déploiement Apps Script ;
- amorçage ou modification d’un compte ;
- purge, restauration ou suppression.

Une autorisation accordée pour une opération ne vaut pas pour les suivantes.

## 7. Découpage de réalisation

1. documentation du contrat ;
2. paramètres multi-environnement et liaison au projet ;
3. contrôle générique AUDIT avec compatibilité recette ;
4. raccordement ACCESS ;
5. contrôle des permissions et précontrôle sans écriture ;
6. contrat de conservation, sauvegarde et purge sans exécution réelle ;
7. tests ciblés et campagne cumulative en recette ;
8. revue et clôture de P1 sur `develop` ;
9. inventaire réel de production après autorisation spécifique ;
10. poursuite du Quality Gate ACCESS-002-PRODUCTION.

## 8. Critères d’acceptation de P1

P1 est prêt pour la suite lorsque :

- P1.1 à P1.12 sont implémentés et testés ;
- RECETTE conserve son fonctionnement ;
- PRODUCTION ne peut être confondue avec RECETTE ;
- le code reste fermé avant configuration ;
- ACCESS refuse toute mutation sans audit générique conforme ;
- le précontrôle ne réalise aucune écriture ;
- le test d’écriture reste séparé et non exécuté sans autorisation ;
- 1 095 jours sont documentés sans purge réelle ;
- le retour arrière préserve les preuves utiles ;
- aucune ressource ou configuration de production n’a été modifiée ;
- le Project Book reflète précisément l’état atteint.

## 9. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.6.0 | 2026-08-25 | P7-D clôturé : précontrôle de production réussi, support privé vide, permissions compatibles et `writePerformed: false` ; aucune preuve créée, P7-E non autorisé |
| 0.5.0 | 2026-08-25 | P7-C clôturé : cinq paramètres techniques installés et relus exactement, sans écriture d’audit ; fichier temporaire supprimé et P7-D non autorisé |
| 0.4.0 | 2026-08-25 | P7-B clôturé : support privé créé et relu conforme sur le titre, l’onglet, les seize en-têtes, l’absence de lignes, les permissions et le fuseau `Europe/Paris` ; configuration absente et P7-C non autorisé |
| 0.3.0 | 2026-08-25 | P7-A clôturé en lecture seule : aucun support exact accessible identifié et précontrôle arrêté de façon fermée sur `audit.environment` indisponible ; aucune ressource, configuration ou preuve créée, P7-B non autorisé |
| 0.2.0 | 2026-08-21 | P1 intégré par la PR applicative #125 au commit `ab52dc6` ; validations de recette **62/62** et **660/660**, contrôles production non exécutés et aucune ressource réelle modifiée |
| 0.1.0 | 2026-08-20 | P1.1 à P1.12 consolidés et validés avec séparation précontrôle/écriture, fermeture avant configuration, inventaire préalable, retour arrière conservatoire, rétention de 1 095 jours et double niveau d’autorisation |

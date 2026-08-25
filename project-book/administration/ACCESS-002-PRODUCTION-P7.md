# ACCESS-002-PRODUCTION-P7 — Activation contrôlée d’AUDIT en production

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P7 |
| **Titre** | Activation contrôlée d’AUDIT en production |
| **Version** | 0.1.0 |
| **Statut** | P7-A clôturé en lecture seule — P7-B non autorisé |
| **Nature** | Procédure d’exploitation et de preuve |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-25 |
| **Version cible** | AKS Platform V1.4.0 — Apps Script version 54 |

---

## 1. Objet et limite d’autorisation

Ce document consigne le précontrôle P7-A et découpe l’activation d’AUDIT en opérations séparément autorisées. P7-A n’autorise aucune création de ressource Drive, aucune propriété de script, aucune modification de permissions, aucune écriture d’audit et aucun amorçage ACCESS.

Les identifiants complets et secrets restent hors de Git. Seuls les noms contractuels et les suffixes déjà autorisés sont documentés.

## 2. Résultat de P7-A — lecture seule

Le contrôle du Drive accessible au compte de production n’a trouvé ni classeur portant exactement le titre `AKS Audit PRODUCTION`, ni dossier de production exact parmi les intitulés recherchés. Cette conclusion est limitée aux ressources accessibles et aux recherches exécutées ; elle ne prouve pas une inexistence globale hors de ce périmètre.

Le support `AKS Audit RECETTE` existe dans l’espace de recette, reste privé et distinct, et ne doit pas être réutilisé en production.

Dans le projet Apps Script de production suffixé `6x2ZeH`, l’exécution autorisée de `AKS_preflightAudit001Production()` a échoué de façon fermée avec `Configuration d'audit indisponible.` au premier paramètre requis, `audit.environment`. Elle n’a créé ni propriété, ni onglet, ni en-tête, ni preuve, ni sauvegarde.

La fonction `AKS_runAudit001ProductionControlledWriteRead` n’a pas été exécutée.

## 3. Contrat du support de production

Le support attendu est un classeur privé portant exactement le titre `AKS Audit PRODUCTION`, avec un onglet `AKS_Audit` et les seize colonnes, dans cet ordre :

1. `schema_version`
2. `audit_id`
3. `occurred_at`
4. `environment`
5. `actor_type`
6. `actor_id`
7. `action`
8. `module`
9. `target_type`
10. `target_id`
11. `result`
12. `reason_code`
13. `correlation_id`
14. `metadata_json`
15. `created_at`
16. `created_by`

Le classeur ne doit être ni public ni accessible à toute personne disposant du lien. L’identité technique doit en être propriétaire ou éditrice.

## 4. Configuration attendue

Les cinq paramètres techniques non administrables sont :

| Paramètre | Valeur attendue |
|---|---|
| `audit.environment` | `PRODUCTION` |
| `audit.scriptId` | identifiant complet exact du projet Apps Script de production |
| `audit.spreadsheetId` | identifiant complet exact du classeur de production |
| `audit.retentionDays` | `1095` |
| `audit.schemaVersion` | `aks-audit/1.0` |

Les identifiants complets sont configurés uniquement dans l’environnement autorisé et ne sont pas copiés dans Git.

## 5. Séquence d’activation

Chaque étape exige une autorisation distincte :

1. **P7-B — Support privé** : sélectionner un dossier privé de production ou, puisqu’aucun dossier exact accessible n’a été identifié, en créer un ; créer ensuite le classeur `AKS Audit PRODUCTION`, l’onglet et les en-têtes exacts.
2. **P7-C — Configuration** : renseigner les cinq paramètres techniques, sans passer par l’interface d’administration.
3. **P7-D — Précontrôle** : exécuter `AKS_preflightAudit001Production()` en lecture seule et exiger une réussite complète.
4. **P7-E — Écriture/relecture contrôlée** : après autorisation explicite, appeler `AKS_runAudit001ProductionControlledWriteRead("CONFIRMER_TEST_ECRITURE_AUDIT_PRODUCTION")`, puis vérifier la relecture exacte.
5. **P7-F — Sauvegarde et clôture** : sauvegarder et relire les preuves minimisées avant de déclarer P7 terminé.

Aucune purge n’est exécutée pendant P7.

## 6. Arrêt et retour arrière

Tout écart de titre, projet, support, schéma, en-tête, permission, identité, verrou, écriture ou relecture bloque la suite.

En cas d’arrêt après configuration, le classeur est isolé et la configuration peut être déconnectée après autorisation. Les preuves déjà produites ne sont jamais supprimées automatiquement. Toute suppression, purge, restauration physique ou modification de permissions exige une décision séparée.

## 7. Critères de clôture

P7 ne peut être clôturé que si :

- le support privé de production respecte exactement le contrat ;
- les cinq paramètres correspondent au projet et au support de production ;
- le précontrôle réussit sans écriture ;
- le test contrôlé, séparément autorisé, écrit et relit exactement sa preuve ;
- les preuves et la procédure de retour arrière sont sauvegardées ;
- aucune ressource de recette n’a été réutilisée ;
- le Project Book reflète l’état réellement atteint.

## 8. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-25 | P7-A clôturé en lecture seule : aucun support exact accessible identifié, précontrôle arrêté de façon fermée sur la configuration indisponible ; aucune ressource, propriété ou preuve créée, P7-B non autorisé |

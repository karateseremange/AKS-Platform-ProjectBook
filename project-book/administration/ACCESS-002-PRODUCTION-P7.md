# ACCESS-002-PRODUCTION-P7 — Activation contrôlée d’AUDIT en production

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P7 |
| **Titre** | Activation contrôlée d’AUDIT en production |
| **Version** | 0.4.0 |
| **Statut** | P7-A à P7-D clôturés — précontrôle réussi sans écriture ; P7-E non autorisé |
| **Nature** | Procédure d’exploitation et de preuve |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-25 |
| **Version cible** | AKS Platform V1.4.0 — Apps Script version 54 |

---

## 1. Objet et limite d’autorisation

Ce document consigne le précontrôle initial P7-A, la préparation du support privé P7-B, la configuration technique P7-C et le précontrôle conforme P7-D, puis découpe la suite de l’activation d’AUDIT en opérations séparément autorisées. La clôture de P7-D n’autorise ni écriture d’audit P7-E, ni amorçage ACCESS.

Les identifiants complets et secrets restent hors de Git. Seuls les noms contractuels et les suffixes déjà autorisés sont documentés.

## 2. Résultat de P7-A — lecture seule

Le contrôle du Drive accessible au compte de production n’a trouvé ni classeur portant exactement le titre `AKS Audit PRODUCTION`, ni dossier de production exact parmi les intitulés recherchés. Cette conclusion est limitée aux ressources accessibles et aux recherches exécutées ; elle ne prouve pas une inexistence globale hors de ce périmètre.

Le support `AKS Audit RECETTE` existe dans l’espace de recette, reste privé et distinct, et ne doit pas être réutilisé en production.

Dans le projet Apps Script de production suffixé `6x2ZeH`, l’exécution autorisée de `AKS_preflightAudit001Production()` a échoué de façon fermée avec `Configuration d'audit indisponible.` au premier paramètre requis, `audit.environment`. Elle n’a créé ni propriété, ni onglet, ni en-tête, ni preuve, ni sauvegarde.

La fonction `AKS_runAudit001ProductionControlledWriteRead` n’a pas été exécutée.

## 2.1 Résultat de P7-B — support privé

Le 25 août 2026, un dossier privé `AKS Platform PRODUCTION` a été créé à la racine du Drive accessible, puis un classeur Google Sheets natif privé `AKS Audit PRODUCTION` y a été placé.

La relecture a confirmé :

- dossier et classeur non partagés ;
- un seul onglet `AKS_Audit` ;
- les seize en-têtes exacts, dans l’ordre contractuel ;
- aucune ligne d’audit ;
- fuseau du classeur corrigé et relu à `Europe/Paris` ;
- aucune ressource de recette réutilisée.

L’import avait initialement attribué `America/Los_Angeles`. Cette valeur a été détectée avant clôture, corrigée uniquement sur la propriété `timeZone`, puis relue sans changement du contenu, des permissions ou de l’emplacement.

Aucun identifiant Drive complet n’est consigné dans Git. Aucune propriété Apps Script n’a été créée, aucune configuration AUDIT n’a été appliquée et aucune preuve d’audit n’a été écrite. P7-C reste non autorisé.

## 2.2 Résultat de P7-C — configuration technique

Le 25 août 2026, les cinq paramètres techniques non administrables ont été installés dans les propriétés du projet Apps Script de production, puis relus exactement :

| Paramètre | Preuve minimisée |
|---|---|
| `audit.environment` | `PRODUCTION` |
| `audit.scriptId` | suffixe `6x2ZeH` |
| `audit.spreadsheetId` | suffixe `GyeQH4` |
| `audit.retentionDays` | `1095` |
| `audit.schemaVersion` | `aks-audit/1.0` |

Le contrôle a confirmé cinq paramètres, une relecture exacte et `auditWritePerformed: false`. Les identifiants complets restent hors de Git.

La fonction temporaire d’installation a été supprimée immédiatement après succès et le projet Apps Script a été enregistré. Le déploiement public version 54 n’a pas été modifié.

## 2.3 Résultat de P7-D — précontrôle sans écriture

Le 25 août 2026, `AKS_preflightAudit001Production()` a réussi dans le projet de production suffixé `6x2ZeH`. Le résultat confirme `ok: true`, `environment: "PRODUCTION"` et `writePerformed: false`.

Le support `AKS Audit PRODUCTION`, suffixé `GyeQH4`, a été relu avec le schéma `aks-audit/1.0`, une conservation de 1 095 jours et `rowCount: 0`. Les permissions sont disponibles et privées : `sharingAccess: "PRIVATE"`, `sharingPermission: "NONE"`, propriétaire présent, aucun éditeur additionnel et acteur technique présent.

Aucune ligne ni preuve d’audit n’a été créée. P7-E reste non autorisé.

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

1. **P7-B — Support privé — clôturé** : dossier et classeur privés créés, onglet, en-têtes et fuseau relus conformes, aucune ligne d’audit.
2. **P7-C — Configuration — clôturé** : cinq paramètres techniques installés et relus exactement ; fichier temporaire supprimé, aucune écriture d’audit.
3. **P7-D — Précontrôle — clôturé** : `AKS_preflightAudit001Production()` a réussi en lecture seule, avec support vide, permissions compatibles et `writePerformed: false`.
4. **P7-E — Écriture/relecture contrôlée — non autorisé** : après autorisation explicite, appeler `AKS_runAudit001ProductionControlledWriteRead("CONFIRMER_TEST_ECRITURE_AUDIT_PRODUCTION")`, puis vérifier la relecture exacte.
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
| 0.4.0 | 2026-08-25 | P7-D clôturé : précontrôle réussi sur les suffixes `6x2ZeH` et `GyeQH4`, support privé vide, permissions compatibles et `writePerformed: false` ; P7-E non autorisé |
| 0.3.0 | 2026-08-25 | P7-C clôturé : cinq paramètres techniques installés et relus exactement sur les suffixes `6x2ZeH` et `GyeQH4`, sans écriture d’audit ; fichier temporaire supprimé, P7-D non autorisé |
| 0.2.0 | 2026-08-25 | P7-B clôturé : dossier et classeur privés créés, onglet unique, seize en-têtes et fuseau `Europe/Paris` relus conformes ; aucune propriété Apps Script ni preuve d’audit, P7-C non autorisé |
| 0.1.0 | 2026-08-25 | P7-A clôturé en lecture seule : aucun support exact accessible identifié, précontrôle arrêté de façon fermée sur la configuration indisponible ; aucune ressource, propriété ou preuve créée, P7-B non autorisé |

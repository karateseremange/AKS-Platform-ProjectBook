# ACCESS-002-06 — Procédure de récupération exceptionnelle

| Champ | Valeur |
|---|---|
| **Document ID** | ACCESS-002-06-RECOVERY |
| **Version** | 1.0.0 |
| **Statut** | Validé par recette réversible — récupération réelle non exécutée |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-20 |

## 1. Objet

Cette procédure décrit le rétablissement exceptionnel d’un gestionnaire ACCESS lorsque le registre est absent, invalide ou inaccessible, ou lorsqu’aucun gestionnaire effectif ne peut intervenir.

Elle distingue strictement la recette réversible, temporaire et obligatoirement restaurée, de la récupération réelle, exceptionnelle, hors ACCESS-002-06 et conservable uniquement après autorisation renforcée et confirmation finale.

## 2. Conditions d’ouverture

Une récupération réelle ne peut être envisagée que si :

1. aucune administration normale par ACCESS_MANAGE n’est possible ;
2. l’identité technique opératrice est formellement identifiée ;
3. le support AUDIT persistant est disponible ;
4. une autorisation renforcée distincte est donnée ;
5. le registre brut initial peut être sauvegardé exactement, y compris lorsqu’il est absent ;
6. aucune modification concurrente du registre n’est en cours ;
7. une restauration reste possible jusqu’à la confirmation finale.

Un administrateur historique ne peut pas utiliser cette procédure pour contourner les capacités ACCESS pendant le fonctionnement normal.

## 3. Précontrôle sans écriture

~~~javascript
AKS_preflightAccess002RecoveryRehearsal()
~~~

Le précontrôle confirme l’environnement RECETTE, l’identité autorisée, la révision, la version brute initiale ou l’absence du registre, l’absence de sauvegarde antérieure, la disponibilité de l’audit, writePerformed à false et realRecoveryExecutable à false.

Il est bloqué par PERSISTENT_AUDIT_REQUIRED lorsque l’audit de recette est déconnecté.

## 4. Recette réversible validée

~~~javascript
AKS_runAccess002RecoveryReversibleRehearsal()
~~~

Cette commande atomique répète le précontrôle, sauvegarde le registre sérialisé exact, applique l’amorçage minimal existant, produit les preuves AUDIT, vérifie l’état temporaire, restaure obligatoirement dans le même appel, compare les états bruts et refuse toute restauration inexacte ou propriété temporaire résiduelle.

Elle retourne realRecoveryExecuted à false et ne fournit aucun moyen de conserver l’état temporaire.

## 5. Connexion AUDIT temporaire

Après autorisation distincte :

~~~javascript
AKS_prepareAudit001Recipe()
AKS_connectAudit001Recipe()
~~~

Après restauration ACCESS :

~~~javascript
AKS_disconnectAudit001Recipe()
~~~

La déconnexion confirme exactRestore à true et backupRemoved à true.

## 6. Récupération réelle exceptionnelle

ACCESS-002-06 n’expose aucune commande de récupération réelle.

Une future opération réelle devra comprendre : précontrôle sans écriture, autorisation renforcée nominative, sauvegarde exacte, opération minimale, preuves AUDIT persistantes, vérification de la reconnexion du gestionnaire, contrôle du registre obtenu, confirmation finale explicite avant conservation, restauration exacte sans confirmation et nettoyage des propriétés temporaires.

## 7. Décision concernant AKS.Admin.Access

Le composant est maintenu temporairement. Il n’autorise plus les routes normales Analytics, Paramétrage, Journaux ou la projection normale du Portail.

Ses usages résiduels sont limités à la compatibilité d’amorçage lorsque le registre ACCESS est absent, à l’autorisation des commandes de recette exécutées depuis l’éditeur et à des API internes historiques sans destination du Portail.

Il n’accorde aucune capacité ACCESS et ne doit pas devenir une voie alternative lorsqu’un registre existe. Son retrait complet est reporté à un incrément dédié après remplacement des dernières API internes et validation d’un mécanisme de récupération indépendant.

## 8. Preuves du 20 août 2026

- PR applicative : [#124](https://github.com/karateseremange/AKS-Platform/pull/124) ;
- tête testée : 2ededfa8a19325511290d47d540c2d99952a4437 ;
- commit de fusion : a90ef3052d569548c928737e70de75c8014c3ee6 ;
- tests ciblés : **10/10** ;
- campagne cumulative : **651/651** ;
- registre initial et final : absents ;
- restauration exacte : confirmée ;
- AUDIT : restauré et déconnecté ;
- sauvegardes temporaires : supprimées ;
- récupération réelle : non exécutée.

# ACCESS-002-PRODUCTION-P8 — Amorçage minimal du premier gestionnaire

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P8 |
| **Titre** | Amorçage minimal du premier gestionnaire ACCESS en production |
| **Version** | 1.0.0 |
| **Statut** | Clôturé — P8-A à P8-D conformes ; P9 non autorisé |
| **Nature** | Procédure d’exploitation, de sécurité et de preuve |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-26 |
| **Version cible** | AKS Platform V1.4.0 — Apps Script version 54 |

---

## 1. Objet et limite d’autorisation

Ce document encadre l’amorçage minimal du registre ACCESS de production après la clôture de P7 et l’activation technique d’AUDIT-001.

P8-A et P8-B ont été exécutés strictement sans écriture. P8-C a ensuite été explicitement autorisé pour une tentative unique et a amorcé le registre minimal. P8-D a vérifié l’état final en lecture seule. La clôture de P8 ne constitue aucune autorisation d’ajouter un autre compte, de modifier le registre ou le déploiement, ni d’engager P9.

Les identifiants complets, la révision complète du registre et les secrets restent hors de Git. Seuls les suffixes minimisés et les valeurs fonctionnelles autorisées sont documentés.

## 2. Résultat de P8-A — inventaire en lecture seule

Le 26 août 2026, un contrôleur temporaire a appelé uniquement la lecture administrative du registre ACCESS dans le projet de production suffixé `6x2ZeH`.

Le résultat confirme :

- identité active `karate.seremange@gmail.com` ;
- schéma cible `access/1.2` ;
- `bootstrap: true` ;
- aucun compte existant ;
- révision initiale suffixée `yj2w2m` ;
- `writePerformed: false` ;
- `auditWritePerformed: false`.

Le fichier temporaire P8-A a été supprimé immédiatement et le projet Apps Script enregistré. La relecture du support AUDIT a confirmé une seule ligne, inchangée depuis P7-E.

## 3. Résultat de P8-B — prévisualisation sans écriture

Le premier gestionnaire a été explicitement confirmé :

`karate.seremange@gmail.com`

La prévisualisation serveur du registre minimal a réussi sur la révision initiale suffixée `yj2w2m`. Elle propose exactement un compte et calcule la future révision suffixée `bdt4m9`.

| Élément | Valeur prévisualisée |
|---|---|
| Nom affiché | Association Karaté Serémange |
| Statut | `ACTIVE` |
| Rôle | `ADMINISTRATEUR` |
| Module | `ACCESS` |
| Saison | `*` |
| Statut de l’affectation | `ACTIVE` |
| Capacité explicite | `ACCESS_MANAGE` |

Aucun `SUPER_ADMIN`, droit Analytics, droit Administration, droit Inscriptions ou droit métier implicite n’est proposé.

Le résultat confirme `writePerformed: false` et `auditWritePerformed: false`. Le fichier temporaire P8-B a été supprimé et le projet enregistré. Le support AUDIT contient toujours exactement une ligne et sa date de modification demeure celle de P7-E.

## 4. Résultat de P8-C — amorçage réel contrôlé

Le 26 août 2026, le Product Owner a autorisé explicitement une tentative unique d’amorçage avec `karate.seremange@gmail.com` comme premier gestionnaire. Le lanceur a relu l’état initial exact, confirmé la révision suffixée `yj2w2m`, puis reproduit la prévisualisation suffixée `bdt4m9` avant toute écriture.

Le service ACCESS officiel a ensuite exécuté sous verrou :

- le contrôle de l’identité et du droit historique d’amorçage ;
- la validation stricte du registre `access/1.2` ;
- le contrôle de cohérence de `ADMINISTRATEUR + ACCESS_MANAGE` ;
- le contrôle optimiste de révision ;
- la preuve AUDIT `INTENTION` ;
- l’écriture atomique et la relecture exacte ;
- la preuve AUDIT `REUSSI`.

L’amorçage a créé exactement un compte actif et une affectation globale ACCESS active. Après estampillage serveur des champs de traçabilité, la révision réellement persistée se termine par `nshtnj`. Le suffixe `bdt4m9` reste la preuve de la forme métier prévisualisée avant estampillage ; il n’est pas la révision persistée finale.

Les deux preuves `ACCESS_REGISTRY_UPDATE` partagent la corrélation suffixée `4d3bb3`. Aucune preuve `ECHEC` ou `REFUSE` n’a été créée. Le fichier `P8C_Temporary.gs` a été supprimé et le projet enregistré.

## 5. Retour arrière et état conservé

L’état de retour arrière de référence demeure le registre ACCESS absent, `bootstrap: true`, zéro compte et révision suffixée `yj2w2m`. Le mécanisme interne n’a pas eu à le restaurer, car P8-C a réussi jusqu’à la preuve finale.

L’état opérationnel conservé après P8-C est le registre `access/1.2` à un compte, `bootstrap: false`, avec révision suffixée `nshtnj`. Les trois preuves AUDIT existantes sont conservées.

Toute suppression manuelle du registre, restauration, purge ou nouvelle mutation exige une autorisation distincte fondée sur l’état réellement relu.

## 6. Séquence réalisée

1. **P8-A — Inventaire — clôturé** : registre absent, zéro compte, aucune écriture.
2. **P8-B — Prévisualisation — clôturé** : registre minimal validé, révision prévisualisée `bdt4m9`, aucune écriture.
3. **P8-C — Amorçage réel — clôturé** : registre minimal créé atomiquement, révision persistée `nshtnj`, preuves `INTENTION` et `REUSSI` corrélées.
4. **P8-D — Vérification — clôturé** : registre, droits effectifs, support AUDIT privé à trois preuves et déploiement public version 54 relus conformes, sans écriture.
5. **P9 — Validation fonctionnelle — non autorisé** : vérifier le portail, les refus et l’ajout contrôlé d’un autre compte.

## 7. Critères de clôture de P8

P8 ne peut être clôturé que si :

- le compte exact confirmé est le seul compte initial ;
- le registre persistant est en schéma `access/1.2` ;
- le rôle `ADMINISTRATEUR` est explicite ;
- l’affectation globale `ACCESS` est active ;
- `ACCESS_MANAGE` est la seule capacité initiale ;
- la forme métier correspond à la prévisualisation et la révision persistée après estampillage est tracée ;
- les preuves AUDIT corrélées sont relues ;
- le compte conserve l’accès administratif ;
- aucune capacité métier implicite n’est accordée ;
- les preuves minimisées sont sauvegardées dans le Project Book.

Tous ces critères sont satisfaits. P8 est clôturé ; P9 reste non autorisé.

## 8. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.0.0 | 2026-08-26 | P8-C et P8-D clôturés : registre `access/1.2` amorcé à un gestionnaire, révision persistée `nshtnj`, preuves `INTENTION` et `REUSSI` corrélées par `4d3bb3`, relecture ACCESS/AUDIT conforme, déploiement public toujours en version 54, fichiers temporaires supprimés ; P8 clôturé, P9 non autorisé |
| 0.1.0 | 2026-08-26 | P8-A et P8-B clôturés sans écriture : registre absent, zéro compte, révision `yj2w2m`, registre minimal prévisualisé pour `karate.seremange@gmail.com` et future révision `bdt4m9` ; P8-C non autorisé |

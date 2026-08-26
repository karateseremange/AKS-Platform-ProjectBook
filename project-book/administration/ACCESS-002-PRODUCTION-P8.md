# ACCESS-002-PRODUCTION-P8 — Amorçage minimal du premier gestionnaire

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION-P8 |
| **Titre** | Amorçage minimal du premier gestionnaire ACCESS en production |
| **Version** | 0.1.0 |
| **Statut** | P8-A et P8-B clôturés — état initial et prévisualisation conformes ; P8-C non autorisé |
| **Nature** | Procédure d’exploitation, de sécurité et de preuve |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-26 |
| **Version cible** | AKS Platform V1.4.0 — Apps Script version 54 |

---

## 1. Objet et limite d’autorisation

Ce document encadre l’amorçage minimal du registre ACCESS de production après la clôture de P7 et l’activation technique d’AUDIT-001.

P8-A et P8-B sont strictement sans écriture. La présente version ne constitue aucune autorisation d’exécuter P8-C, de créer le registre, d’attribuer un rôle, d’ajouter un autre compte, de modifier le déploiement ou d’engager P9.

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

## 4. Contrat de P8-C — amorçage réel non autorisé

P8-C devra reprendre la révision complète lue immédiatement avant l’écriture et exiger qu’elle corresponde toujours à l’état initial suffixé `yj2w2m`.

L’écriture réelle utilisera le service ACCESS officiel :

- contrôle de l’identité et du droit historique d’amorçage ;
- validation stricte du registre `access/1.2` ;
- contrôle de cohérence de `ADMINISTRATEUR + ACCESS_MANAGE` ;
- verrou de script ;
- contrôle optimiste de révision ;
- preuve AUDIT d’intention ;
- écriture atomique et relecture du registre ;
- preuve AUDIT de réussite ;
- restauration du registre initial si la preuve finale échoue.

Une exécution réussie doit produire le registre à un compte et une nouvelle révision correspondant à la prévisualisation suffixée `bdt4m9`. Elle doit normalement ajouter deux preuves AUDIT corrélées, `INTENTION` puis `REUSSI`.

Toute erreur, révision différente, identité différente, preuve indisponible ou résultat inattendu interdit une seconde tentative automatique. Une vérification séparée est alors obligatoire avant toute décision.

## 5. État initial et retour arrière

L’état initial sauvegardé est :

- registre ACCESS absent ;
- `bootstrap: true` ;
- zéro compte ;
- révision suffixée `yj2w2m` ;
- support AUDIT privé contenant une seule preuve technique P7.

En cas d’échec après début d’écriture, le service doit restaurer le registre absent lorsque son mécanisme interne le prévoit. Les preuves AUDIT déjà créées ne sont jamais supprimées automatiquement.

Toute suppression manuelle du registre, restauration, purge ou seconde tentative exige une autorisation distincte fondée sur l’état réellement relu.

## 6. Séquence autorisée

1. **P8-A — Inventaire — clôturé** : registre absent, zéro compte, aucune écriture.
2. **P8-B — Prévisualisation — clôturé** : registre minimal validé, future révision `bdt4m9`, aucune écriture.
3. **P8-C — Amorçage réel — non autorisé** : créer atomiquement le registre minimal après confirmation explicite.
4. **P8-D — Vérification — non autorisé** : relire le registre, les droits effectifs et les preuves AUDIT.
5. **P9 — Validation fonctionnelle — non autorisé** : vérifier le portail, les refus et l’ajout contrôlé d’un autre compte.

## 7. Critères de clôture de P8

P8 ne peut être clôturé que si :

- le compte exact confirmé est le seul compte initial ;
- le registre persistant est en schéma `access/1.2` ;
- le rôle `ADMINISTRATEUR` est explicite ;
- l’affectation globale `ACCESS` est active ;
- `ACCESS_MANAGE` est la seule capacité initiale ;
- la révision obtenue correspond à la prévisualisation ;
- les preuves AUDIT corrélées sont relues ;
- le compte conserve l’accès administratif ;
- aucune capacité métier implicite n’est accordée ;
- les preuves minimisées sont sauvegardées dans le Project Book.

## 8. Historique

| Version | Date | Évolution |
|---|---|---|
| 0.1.0 | 2026-08-26 | P8-A et P8-B clôturés sans écriture : registre absent, zéro compte, révision `yj2w2m`, registre minimal prévisualisé pour `karate.seremange@gmail.com` et future révision `bdt4m9` ; P8-C non autorisé |

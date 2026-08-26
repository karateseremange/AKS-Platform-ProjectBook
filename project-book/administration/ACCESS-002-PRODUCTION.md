# ACCESS-002-PRODUCTION — Publication et amorçage contrôlés

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION |
| **Titre** | Publication, déploiement et amorçage d’ACCESS en production |
| **Version** | 1.2.13 |
| **Statut** | P6 à P8 clôturés — premier gestionnaire ACCESS actif ; P9 non autorisé |
| **Nature** | Spécification de publication et d’exploitation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-26 |
| **Version cible** | AKS Platform V1.4.0 — build `20260824.1`, publication `main` requise |

---

## 1. Contexte et rectification d’état

Les incréments `ACCESS-002-01` à `ACCESS-002-06` sont implémentés dans la branche applicative `develop` et validés en recette. Ils ne sont pas présents dans `main`, aucun nouveau déploiement Apps Script de production n’a été effectué, aucun registre ACCESS de production n’a été amorcé et aucun compte réel ne possède encore `ACCESS_MANAGE`.

Le chantier ACCESS ne peut donc pas être considéré comme publié ni opérationnel. Le présent jalon est prioritaire avant `INSCRIPTIONS-011`.

## 2. État technique vérifié

- le dépôt applicatif pointe sur `develop` à `52024ab` (candidate `1.4.0-rc.5`, P4 concluant) et sur `main` à `e8fb0fc` ;
- le cadrage P3 est intégré dans le Project Book à partir de `develop` `4ebc8d6` ;
- l’écart applicatif contient ACCESS, AUDIT et des fondations Inscriptions internes ;
- ACCESS exige une preuve AUDIT persistante pour toute mutation du registre ;
- AUDIT accepte désormais les contrats fermés `RECETTE` et `PRODUCTION` dans `develop`, sans aucune configuration de production ;
- le projet Apps Script utilisé pour les campagnes précédentes est un environnement de recette ;
- la version publique exécute le déploiement `wgNc37` figé à la version Apps Script 53 ;
- la version 53 correspond au code applicatif de `main` `e8fb0fc`, avec pour seul écart le manifeste Web App ;
- le HEAD Apps Script non déployé correspond à `ed03cc4` plus un lanceur de recette non versionné ;
- la candidate `b13fc20` n’est pas déployée en production.

Une fusion sélective de quelques commits ACCESS n’est pas retenue par défaut : ACCESS dépend des évolutions AUDIT et transverses cumulatives. Le périmètre exact de la candidate devra toutefois être confirmé par l’audit de release.

## 3. Décisions validées

### P1 — Audit de production distinct

Le cadrage détaillé [AUDIT-001-PRODUCTION](AUDIT-001-PRODUCTION.md) est validé. AUDIT doit distinguer explicitement `RECETTE` et `PRODUCTION`, lier chaque support au projet Apps Script attendu et conserver des ressources strictement séparées.

Le précontrôle sans écriture et le test contrôlé d’écriture/relecture constituent deux opérations différentes. Le second exige une autorisation spécifique qui n’est pas accordée par la validation du cadrage.

Le comportement reste fermé si le nouveau code est déployé avant configuration : aucun registre n’est créé, aucune capacité n’est inférée, aucune mutation ACCESS n’est possible sans audit persistant conforme et les services publics existants restent inchangés.

La durée initiale de conservation est fixée à **1 095 jours**, réévaluable avant la première purge. Aucune purge réelle n’est exécutée pendant cette mise en production.

P1 est intégré par la [PR applicative #125](https://github.com/karateseremange/AKS-Platform/pull/125), fusionnée dans `develop` au commit [`ab52dc6`](https://github.com/karateseremange/AKS-Platform/commit/ab52dc6200ca5e138883d182cfcd700352276dad). La tête `a620b390` a réussi à **62/62** sur AUDIT-001 et **660/660** sur la campagne cumulative dans l’environnement Apps Script de recette. Aucun précontrôle, test d’écriture, support, paramètre ou déploiement de production n’a été exécuté ou modifié.

### P2 — Candidate de publication

Une candidate de publication cohérente est préparée à partir de l’état validé de `develop`. La version proposée est `V1.4.0`, sous réserve de vérification formelle de la référence actuelle de `main` et de la production, puis de confirmation au Quality Gate.

Les décisions détaillées P2.1 à P2.10, le périmètre de l’écart et la checklist sont définis dans [ACCESS-002-PRODUCTION-P2](ACCESS-002-PRODUCTION-P2.md). La candidate de travail est `1.4.0-rc.1` et ne constitue pas une publication.

La candidate comprend principalement ACCESS, la migration administrative, AUDIT et les fondations internes déjà intégrées. Les fondations Inscriptions restent non exposées et refusées en production.

La version embarquée, le README et le changelog ont été synchronisés par la [PR applicative #126](https://github.com/karateseremange/AKS-Platform/pull/126), fusionnée dans `develop` au commit [`b13fc20`](https://github.com/karateseremange/AKS-Platform/commit/b13fc202300af6f7ce0c99b65403fa83117ed34b). La tête exacte a réussi à **8/8** sur VERSION-001 et **661/661** sur la campagne cumulative dans Apps Script de recette. Aucune opération de production n’a été exécutée.

### P3 — Inventaire et rapprochement de production

La préparation du code et de la documentation ne crée aucun registre de production, n’attribue aucune capacité, ne modifie aucun compte réel et ne crée ou modifie aucun déploiement de production.

Le protocole et ses résultats minimisés sont définis dans [ACCESS-002-PRODUCTION-P3](ACCESS-002-PRODUCTION-P3.md). Après autorisations séparées, le projet de production, le déploiement `wgNc37`, la version 53, le HEAD et leurs écarts Git ont été inventoriés sans écriture. Deux archives durables ont été relues et vérifiées par SHA-256. La production est restée inchangée ; P3 est clôturé et P4 devient l’étape suivante.

### P4 — Quality Gate

Le protocole [ACCESS-002-PRODUCTION-P4](ACCESS-002-PRODUCTION-P4.md) a été
exécuté jusqu'à RC5. Le rapport
[ACCESS-002-PRODUCTION-P4-G](ACCESS-002-PRODUCTION-P4-G.md) a été validé le
24 août 2026 : Quality Gate concluant sur `1.4.0-rc.5` au commit
`52024aba72a76247179bb801cfb93006151ebbb9`, aucun défaut bloquant ou
critique ouvert et candidate admissible à P5.

La clôture de P4 n'autorise ni P5, ni publication vers `main`, ni tag, ni
opération de production.

### P5 — Publication Git contrôlée

Le protocole détaillé [ACCESS-002-PRODUCTION-P5](ACCESS-002-PRODUCTION-P5.md)
est en exécution contrôlée. P5-A à P5-C sont clôturés :

- précontrôle Git conforme sur RC5 `52024ab` ;
- commit stable exact `5f16d9072b99a4449e1198454b26e484b92de954` ;
- version `1.4.0`, build `20260824.1` ;
- validation RECETTE : **8/8 VERSION-001** et **665/665 cumulés** ;
- PR applicative #131 fusionnée dans `develop` au commit
  `32a511a93eb341efa29cedffd3358f638c7b1d30`.

P5-D est clôturé. Après une revue cumulative conforme, la PR applicative
[#132](https://github.com/karateseremange/AKS-Platform/pull/132) a été fusionnée
dans `main` au commit `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5`.
Le contenu publié est identique à `develop` et conserve les marqueurs
`1.4.0` et `20260824.1`.

P5-E et P5-F sont clôturés :

- Project Book publié dans `main` par la PR #170 au commit
  `7cfa3ce62b12edaf26d38e743e4cdd2da2ce43c1` ;
- tag applicatif `v1.4.0` vérifié sur
  `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5` ;
- tag documentaire `v1.4.0` vérifié sur
  `7cfa3ce62b12edaf26d38e743e4cdd2da2ce43c1`.

Ces deux SHA sont les commits de publication ciblés par les tags, et non des
têtes `main` destinées à rester figées. Après la correction documentaire
applicative #134, `main` applicatif pointe sur `7a6b70a341bc869f10e1a18efda8ad4d6ab8fe6d`,
tandis que son tag `v1.4.0` reste sur `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5`. La publication
post-release du Project Book peut faire avancer sa branche `main` sans déplacer
le tag documentaire.

P5 est clôturé. P6 et toute opération Apps Script ou de production restent
soumis à des autorisations distinctes.

### P6 — Déploiement Apps Script de production

Le protocole détaillé [ACCESS-002-PRODUCTION-P6](ACCESS-002-PRODUCTION-P6.md) est clôturé. P6-A à P6-H sont validés :

- cible immuable : tag `v1.4.0` au commit `fa8876fcc57dcc46b943c8a3ce451e006bfa5bb5` ;
- projet PRODUCTION suffixé `6x2ZeH`, distinct de la RECETTE suffixée `eIRxs4` ;
- déploiement public `wgNc37` toujours figé à la version 53 ;
- sauvegarde fraîche vérifiée par SHA-256 et identique aux archives P3 ;
- premier paquet marqué invalide après détection d’un mauvais fuseau ;
- paquet corrigé validé sur `Europe/Paris`, `USER_ACCESSING` et `ANYONE` ;
- barrière canonique conforme : 54 fichiers ajoutés, 30 modifiés et aucun absent par rapport à la version 53 ;
- 261 fichiers poussables, sans `RecipeRunner` ;
- P6-E : 261 fichiers poussés vers le HEAD, relus à 261/261 et comparés sans différence sous Windows PowerShell 5.1 ;
- version Apps Script 54 créée puis relue à 261/261 sans différence avec la candidate ;
- déploiement public `wgNc37` mis à jour de la version 53 vers la version 54, sans changement d’identifiant ni d’URL ;
- 9 déploiements avant et après, aucun identifiant ajouté ou supprimé ;
- Questionnaire santé public, portail V1.4.0, Paramétrage et Journaux vérifiés sans mutation.

P6 est clôturé. La version 53 demeure le point de retour arrière historique. Le support AUDIT privé est préparé en P7-B, la configuration technique installée en P7-C, le précontrôle P7-D validé sans écriture, la preuve contrôlée P7-E créée puis relue et la vérification finale P7-F concordante. P7 est clôturé. P8 a ensuite amorcé le premier gestionnaire ACCESS et vérifié son droit effectif ; l’ouverture fonctionnelle à d’autres comptes relève de P9 et reste non engagée.

### P7 — Ressources de production

Le protocole détaillé est défini dans [ACCESS-002-PRODUCTION-P7](ACCESS-002-PRODUCTION-P7.md).

P7-A est clôturé en lecture seule :

- aucun classeur portant exactement le titre `AKS Audit PRODUCTION` ni dossier de production exact n’a été identifié dans le Drive accessible ;
- le support privé `AKS Audit RECETTE` reste distinct et n’est pas réutilisé ;
- `AKS_preflightAudit001Production()` a refusé la suite de façon fermée sur la configuration indisponible au premier paramètre requis, `audit.environment` ;
- aucun support, paramètre, onglet, en-tête, sauvegarde ou preuve n’a été créé ;
- le test contrôlé d’écriture/relecture n’a pas été exécuté.

P7-B est clôturé : le dossier privé `AKS Platform PRODUCTION` et le classeur Google Sheets natif privé `AKS Audit PRODUCTION` ont été créés. La relecture confirme l’onglet unique `AKS_Audit`, les seize en-têtes exacts, aucune ligne d’audit, l’absence de partage et le fuseau `Europe/Paris`. Aucun support de recette n’a été réutilisé.

P7-C est clôturé : les cinq paramètres techniques ont été installés et relus exactement pour l’environnement `PRODUCTION`, les suffixes `6x2ZeH` et `GyeQH4`, la conservation `1095` et le schéma `aks-audit/1.0`. Aucune preuve d’audit n’a été écrite. La fonction temporaire a été supprimée et le déploiement public version 54 est inchangé.

P7-D est clôturé : `AKS_preflightAudit001Production()` a réussi pour l’environnement `PRODUCTION`, les suffixes `6x2ZeH` et `GyeQH4`, le support privé `AKS Audit PRODUCTION`, le schéma `aks-audit/1.0` et la conservation de 1 095 jours. Le support reste vide (`rowCount: 0`), les permissions sont compatibles, l’acteur technique est présent et `writePerformed: false`.

P7-E est clôturé : une exécution unique a créé puis relu exactement une preuve technique `AUDIT_SUPPORT_TEST`. Le résultat confirme `phase: "WRITE_READ_VERIFIED"`, `controlledProof: true` et `businessOperation: false`, avec les suffixes minimisés `ac6e57` et `895d54`. Le fichier temporaire a été supprimé et le projet enregistré.

P7-F est clôturé : la relecture directe confirme une preuve unique `AUDIT_SUPPORT_TEST` et le précontrôle final confirme `rowCount: 1`, `writePerformed: false` et des permissions privées conformes. Les résultats Drive et Apps Script concordent, et les preuves minimisées sont sauvegardées dans le Project Book.

P7 est clôturé et AUDIT-001 est techniquement actif en production. P8-A à P8-D sont également clôturés : le premier gestionnaire ACCESS est amorcé et vérifié. P9 reste non autorisé. Les secrets et identifiants sensibles ne sont jamais consignés en clair dans Git.

### P8 — Amorçage minimal du premier gestionnaire

Le protocole détaillé et les résultats minimisés sont définis dans [ACCESS-002-PRODUCTION-P8](ACCESS-002-PRODUCTION-P8.md).

P8-A et P8-B sont clôturés : l’état initial absent a été inventorié sans écriture sur la révision suffixée `yj2w2m`, puis le registre minimal `access/1.2` a été prévisualisé avec la révision suffixée `bdt4m9`.

P8-C est clôturé après autorisation explicite d’une tentative unique. Le service ACCESS officiel a créé atomiquement un seul compte actif `karate.seremange@gmail.com`, affiché comme `Association Karaté Serémange`, avec le rôle `ADMINISTRATEUR`, une affectation globale ACCESS active et la seule capacité `ACCESS_MANAGE`. Après estampillage serveur, la révision persistée se termine par `nshtnj`.

Les preuves AUDIT `INTENTION` et `REUSSI` sont corrélées par le suffixe `4d3bb3`. Le support privé contient exactement trois preuves au total, sans `ECHEC` ni `REFUSE`.

P8-D est clôturé sans écriture : registre, compte, rôle, capacité effective, preuves AUDIT, unicité du déploiement `wgNc37` et version 54 ont été relus conformes. Tous les fichiers temporaires P8 ont été supprimés. P8 est clôturé ; P9 reste non autorisé.

### P9 — Validation fonctionnelle en production

Après amorçage, le Product Owner vérifie au minimum :

- le Portail AKS ;
- « Mes accès » ;
- « Comptes et accès » ;
- une modification contrôlée d’un compte test autorisé ;
- la preuve AUDIT correspondante ;
- le refus d’un compte non habilité ;
- la non-régression du Questionnaire santé public.

### P10 — Confirmation finale ou retour arrière

L’état de production n’est confirmé qu’après validation finale explicite. En cas d’échec :

- revenir au déploiement Apps Script précédent ;
- restaurer la configuration sauvegardée ;
- restaurer ou supprimer le registre selon son état initial ;
- isoler le classeur AUDIT de production si nécessaire sans supprimer automatiquement les preuves utiles ;
- conserver les preuves déjà produites lorsque leur intégrité et leur utilité demeurent établies ;
- contrôler la restauration de chaque composant ;
- soumettre toute suppression ou purge à une décision ultérieure distincte.

## 4. Séquencement autorisé

1. correction documentaire du statut ;
2. adaptation AUDIT pour la production sur une branche applicative dédiée ;
3. revue, tests et recette isolée ;
4. préparation de la candidate et du Quality Gate ;
5. validation explicite des PR vers `main` ;
6. publication Git et tags ;
7. déploiement Apps Script de production ;
8. configuration du support AUDIT de production ;
9. prévisualisation puis autorisation de l’amorçage ;
10. validation fonctionnelle et confirmation finale ou retour arrière.

Deux niveaux d’autorisation restent formellement séparés :

1. validation du cadrage et démarrage des modifications documentaires/applicatives ;
2. autorisation ultérieure spécifique pour chaque opération réelle de production, notamment inventaire sensible, création ou configuration de ressource, test d’écriture, fusion vers `main`, déploiement, amorçage, modification de compte, purge ou retour arrière.

La présente validation accorde uniquement le premier niveau. Chaque mutation de production exige l’autorisation correspondant à son étape. Une validation du cadrage ne vaut pas autorisation de fusionner dans `main`, de déployer ou de modifier un compte réel.

## 5. Critères de clôture du chantier ACCESS

Le chantier ACCESS peut être déclaré publié et opérationnel uniquement lorsque :

- le code et la documentation validés sont présents sur `main` et identifiés par des tags cohérents ;
- le déploiement de production exécute la version publiée ;
- AUDIT de production est distinct, contrôlé et fonctionnel ;
- le premier gestionnaire est explicitement amorcé ;
- les écrans et refus serveur sont vérifiés en production ;
- le Questionnaire santé public reste opérationnel ;
- le Product Owner confirme l’état final ;
- le Project Book consigne les preuves et l’état réellement publié.

## 6. Règle permanente de suivi

Les statuts suivants doivent rester distincts dans le Project Book :

- documenté ;
- implémenté ;
- validé en recette ;
- fusionné dans `develop` ;
- publié sur `main` ;
- déployé ;
- amorcé ;
- validé en production.

Le terme « clôturé » ne doit plus être utilisé pour une fonctionnalité qui attend encore sa publication, son activation ou sa validation opérationnelle.

## 7. Historique

| Version | Date | Évolution |
|---|---|---|
| 1.2.13 | 2026-08-26 | P8-C et P8-D clôturés : premier gestionnaire ACCESS amorcé, révision persistée `nshtnj`, preuves `INTENTION` et `REUSSI` corrélées par `4d3bb3`, support privé à trois preuves, déploiement `wgNc37` toujours en version 54 ; P8 clôturé, P9 non autorisé |
| 1.2.12 | 2026-08-26 | P8-A et P8-B clôturés sans écriture : registre initial absent, premier gestionnaire confirmé, prévisualisation minimale `access/1.2`, révisions `yj2w2m` puis `bdt4m9`, support AUDIT toujours à une preuve ; P8-C non autorisé |
| 1.2.11 | 2026-08-25 | P7-F et P7 clôturés : preuve unique relue, précontrôle final `rowCount: 1`, `writePerformed: false` et permissions privées conformes ; AUDIT activé, P8 non autorisé |
| 1.2.10 | 2026-08-25 | P7-E clôturé : preuve `AUDIT_SUPPORT_TEST` créée et relue exactement, non métier, suffixes `ac6e57` et `895d54` ; fichier temporaire supprimé, P7-F non autorisé |
| 1.2.9 | 2026-08-25 | P7-D clôturé : précontrôle réussi sans écriture, support privé vide et permissions compatibles ; `writePerformed: false`, P7-E non autorisé |
| 1.2.8 | 2026-08-25 | P7-C clôturé : cinq paramètres techniques installés et relus exactement, sans écriture d’audit ; fichier temporaire supprimé, déploiement inchangé et P7-D non autorisé |
| 1.2.7 | 2026-08-25 | P7-B clôturé : dossier et classeur AUDIT privés créés, onglet, seize en-têtes, absence de lignes, permissions et fuseau `Europe/Paris` relus conformes ; P7-C non autorisé |
| 1.2.6 | 2026-08-25 | P7-A clôturé en lecture seule : aucun support exact accessible identifié, précontrôle fermé sur la configuration indisponible, aucune ressource ni preuve créée ; P7-B non autorisé |
| 1.2.5 | 2026-08-24 | P6 clôturé : déploiement public existant mis à jour vers la version 54, identifiant et URL préservés ; contrôles publics et administratifs en lecture concluants, P7 non engagé |
| 1.2.4 | 2026-08-24 | P6-F clôturé : version Apps Script 54 créée, relue à 261/261 et comparée sans différence ; déploiement public toujours sur la version 53, P6-G non autorisé |
| 1.2.3 | 2026-08-24 | P6-E clôturé : HEAD de production synchronisé avec 261 fichiers puis relu et comparé à 261/261 sans différence ; déploiement public toujours sur la version 53, P6-F non autorisé |
| 1.2.2 | 2026-08-24 | P6-A à P6-D préparés et validés localement : cible V1.4.0, sauvegarde fraîche, paquet erroné rejeté et paquet corrigé conforme à la barrière canonique 54/30/0 ; aucune écriture de production autorisée |
| 1.2.1 | 2026-08-24 | Références post-release clarifiées : commits de publication/tagués distingués des têtes `main`; application `main@7a6b70a` après la PR #134, tags inchangés et production non engagée |
| 1.2.0 | 2026-08-24 | P5 clôturé : application et Project Book publiés sur `main`, tags légers `v1.4.0` vérifiés sur `fa8876f` et `7cfa3ce`; P6, Apps Script et production non engagés |
| 1.1.0 | 2026-08-24 | P5-D clôturé : V1.4.0 publiée dans `main` par la PR #132 au commit `fa8876f`, contenu identique à `develop`; P5-E engagé, tags, Apps Script et production inchangés |
| 1.0.0 | 2026-08-24 | P5-A à P5-C clôturés : finalisation stable `1.4.0` build `20260824.1` validée à 8/8 et 665/665, PR #131 fusionnée dans `develop` à `32a511a`; P5-D, `main`, tags et production non engagés |
| 0.9.0 | 2026-08-24 | Cadrage P5 validé et consigné : P5.1 à P5.12, P5-A à P5-F, finalisation stable explicite et publications Git séparément autorisées ; P6 et production restent interdits |
| 0.8.0 | 2026-08-21 | P4 cadré : décisions P4.1 à P4.12 et étapes P4-A à P4-G validées, candidate `b13fc20` figée, contrôles Git/RECETTE/production séparés et toute exécution réelle soumise à autorisation distincte |
| 0.7.0 | 2026-08-21 | P3 clôturé : déploiement public `wgNc37` version 53 rapproché de `main`, HEAD rattaché à `ed03cc4` plus `RecipeRunner.js`, RC1 confirmée non déployée et archives durables vérifiées ; P4 Quality Gate devient prioritaire |
| 0.6.0 | 2026-08-21 | P2 clôturé sur `develop` par la PR documentaire #161 ; cadrage I1 à I12 de P3 validé, inventaire réel toujours soumis à une autorisation distincte |
| 0.5.1 | 2026-08-21 | Note V1.4.0 candidate et checklist P2 renseignée ajoutées ; clôture documentaire encore soumise à la revue de la PR Project Book |
| 0.5.0 | 2026-08-21 | Candidate `1.4.0-rc.1` intégrée par la PR #126 au commit `b13fc20` et validée en recette à **8/8** VERSION-001 et **661/661** cumulés ; production inchangée |
| 0.4.0 | 2026-08-21 | P2.1 à P2.10 validés : candidate complète `1.4.0-rc.1` depuis `develop`, métadonnées et documentation à aligner, Quality Gate transverse, recette obligatoire, aucune PR vers `main`, aucun tag ni aucune opération de production |
| 0.3.0 | 2026-08-21 | P1 intégré dans `develop` par la PR #125 au commit `ab52dc6`, validé en recette à **62/62** et **660/660** ; aucune opération de production exécutée, prochaine étape limitée à la préparation de la candidate et du Quality Gate |
| 0.2.0 | 2026-08-20 | P1 consolidé : précontrôle séparé du test d’écriture autorisé distinctement, fermeture avant configuration, inventaire préalable de la production, retour arrière AUDIT conservatoire, rétention initiale de 1 095 jours sans purge et V1.4.0 conditionnelle |
| 0.1.0 | 2026-08-20 | Cadrage P1 à P10 validé ; rectification de l’état ACCESS et priorité donnée à la publication, au déploiement et à l’amorçage avant INSCRIPTIONS-011 |

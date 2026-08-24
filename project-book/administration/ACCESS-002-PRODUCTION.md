# ACCESS-002-PRODUCTION — Publication et amorçage contrôlés

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION |
| **Titre** | Publication, déploiement et amorçage d’ACCESS en production |
| **Version** | 1.0.0 |
| **Statut** | P5-A à P5-C clôturés — version stable intégrée dans `develop`, P5-D non engagé |
| **Nature** | Spécification de publication et d’exploitation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-24 |
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

P5-D n'est pas engagé. La publication applicative `develop → main`, la
publication documentaire, chaque tag et toute opération P6 ou de production
restent soumis à des autorisations distinctes.

### P6 — Déploiement Apps Script de production

Après publication Git :

1. identifier formellement le projet Apps Script, le déploiement, la version et l’URL publics de production existants ;
2. sauvegarder leur état exact et vérifier leur correspondance avec `main` avant de figer la version cible ;
3. synchroniser exactement le commit publié ;
4. créer une nouvelle version Apps Script ;
5. mettre à jour le déploiement existant afin de conserver son URL lorsque cela est possible ;
6. vérifier d’abord le Questionnaire santé public.

Aucun projet de recette ne doit être requalifié implicitement en production.

### P7 — Ressources de production

Après autorisation spécifique, créer ou sélectionner :

- le classeur `AKS Audit PRODUCTION` ;
- l’onglet et le schéma AUDIT contrôlés ;
- les paramètres techniques de production ;
- les règles de conservation, sauvegarde et restauration.

Les secrets et identifiants sensibles ne sont jamais consignés en clair dans Git.

### P8 — Amorçage minimal du premier gestionnaire

L’amorçage réel fait l’objet d’une prévisualisation et d’une autorisation distincte. Il crée le registre minimal et attribue explicitement au premier gestionnaire :

- le rôle `ADMINISTRATEUR` ;
- la capacité `ACCESS_MANAGE`.

Aucun `SUPER_ADMIN` ni droit métier implicite n’est créé. Les capacités Analytics, Paramétrage, Journaux et autres droits sont sélectionnées explicitement.

L’identité exacte du premier gestionnaire est confirmée immédiatement avant l’opération réelle ; aucune adresse pressentie ne vaut autorisation.

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

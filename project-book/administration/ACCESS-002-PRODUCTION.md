# ACCESS-002-PRODUCTION — Publication et amorçage contrôlés

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION |
| **Titre** | Publication, déploiement et amorçage d’ACCESS en production |
| **Version** | 0.5.0 |
| **Statut** | P2 validé en recette — inventaire de production et Quality Gate final en attente |
| **Nature** | Spécification de publication et d’exploitation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-21 |
| **Version cible proposée** | AKS Platform V1.4.0, à confirmer au Quality Gate |

---

## 1. Contexte et rectification d’état

Les incréments `ACCESS-002-01` à `ACCESS-002-06` sont implémentés dans la branche applicative `develop` et validés en recette. Ils ne sont pas présents dans `main`, aucun nouveau déploiement Apps Script de production n’a été effectué, aucun registre ACCESS de production n’a été amorcé et aucun compte réel ne possède encore `ACCESS_MANAGE`.

Le chantier ACCESS ne peut donc pas être considéré comme publié ni opérationnel. Le présent jalon est prioritaire avant `INSCRIPTIONS-011`.

## 2. État technique vérifié

- le dépôt applicatif pointe sur `develop` à `ab52dc6` et sur `main` à `e8fb0fc` ;
- le Project Book pointe sur `develop` à `ae3630a` et sur `main` à `647ae45` avant la présente mise à jour documentaire ;
- l’écart applicatif contient ACCESS, AUDIT et des fondations Inscriptions internes ;
- ACCESS exige une preuve AUDIT persistante pour toute mutation du registre ;
- AUDIT accepte désormais les contrats fermés `RECETTE` et `PRODUCTION` dans `develop`, sans aucune configuration de production ;
- le projet Apps Script utilisé pour les campagnes précédentes est un environnement de recette ;
- la version applicative embarquée reste à synchroniser avec la future release ;
- la référence Git de `main` est identifiée, mais sa correspondance avec le déploiement Apps Script public reste à démontrer avant de confirmer `V1.4.0`.

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

### P3 — Aucune mutation réelle pendant la préparation

La préparation du code et de la documentation ne crée aucun registre de production, n’attribue aucune capacité, ne modifie aucun compte réel et ne crée ou modifie aucun déploiement de production.

### P4 — Quality Gate

Le Quality Gate vérifie au minimum :

- la suite cumulative de référence et les suites ciblées ACCESS/AUDIT ;
- le Questionnaire santé public ;
- Analytics et Présences ;
- le refus des fonctions internes Inscriptions en production ;
- l’absence de route Audit ou Maintenance non cadrée ;
- la cohérence de la version embarquée ;
- les dépendances de l’écart complet entre `main` et `develop` ;
- la procédure de retour vers la version actuellement déployée ;
- l’absence de défaut bloquant ou critique.

### P5 — Publication Git contrôlée

Après validation du Quality Gate seulement :

1. PR applicative `develop` vers `main` ;
2. PR documentaire `develop` vers `main` ;
3. autorisation explicite avant chaque fusion ;
4. tags applicatif et documentaire cohérents ;
5. aucune fusion automatique.

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
| 0.5.0 | 2026-08-21 | Candidate `1.4.0-rc.1` intégrée par la PR #126 au commit `b13fc20` et validée en recette à **8/8** VERSION-001 et **661/661** cumulés ; production inchangée |
| 0.4.0 | 2026-08-21 | P2.1 à P2.10 validés : candidate complète `1.4.0-rc.1` depuis `develop`, métadonnées et documentation à aligner, Quality Gate transverse, recette obligatoire, aucune PR vers `main`, aucun tag ni aucune opération de production |
| 0.3.0 | 2026-08-21 | P1 intégré dans `develop` par la PR #125 au commit `ab52dc6`, validé en recette à **62/62** et **660/660** ; aucune opération de production exécutée, prochaine étape limitée à la préparation de la candidate et du Quality Gate |
| 0.2.0 | 2026-08-20 | P1 consolidé : précontrôle séparé du test d’écriture autorisé distinctement, fermeture avant configuration, inventaire préalable de la production, retour arrière AUDIT conservatoire, rétention initiale de 1 095 jours sans purge et V1.4.0 conditionnelle |
| 0.1.0 | 2026-08-20 | Cadrage P1 à P10 validé ; rectification de l’état ACCESS et priorité donnée à la publication, au déploiement et à l’amorçage avant INSCRIPTIONS-011 |

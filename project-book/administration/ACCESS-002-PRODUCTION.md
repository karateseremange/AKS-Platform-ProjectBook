# ACCESS-002-PRODUCTION — Publication et amorçage contrôlés

| Propriété | Valeur |
|---|---|
| **Document ID** | ACCESS-002-PRODUCTION |
| **Titre** | Publication, déploiement et amorçage d’ACCESS en production |
| **Version** | 0.1.0 |
| **Statut** | Cadrage validé — réalisation non commencée |
| **Nature** | Spécification de publication et d’exploitation |
| **Propriétaire** | Product Owner |
| **Dernière mise à jour** | 2026-08-20 |
| **Version cible proposée** | AKS Platform V1.4.0, à confirmer au Quality Gate |

---

## 1. Contexte et rectification d’état

Les incréments `ACCESS-002-01` à `ACCESS-002-06` sont implémentés dans la branche applicative `develop` et validés en recette. Ils ne sont pas présents dans `main`, aucun nouveau déploiement Apps Script de production n’a été effectué, aucun registre ACCESS de production n’a été amorcé et aucun compte réel ne possède encore `ACCESS_MANAGE`.

Le chantier ACCESS ne peut donc pas être considéré comme publié ni opérationnel. Le présent jalon est prioritaire avant `INSCRIPTIONS-011`.

## 2. État technique vérifié

- le dépôt applicatif `develop` est en avance de 206 commits sur `main`, sans retard ;
- le Project Book `develop` est en avance de 329 commits sur `main`, sans retard ;
- l’écart applicatif contient ACCESS, AUDIT et des fondations Inscriptions internes ;
- ACCESS exige une preuve AUDIT persistante pour toute mutation du registre ;
- AUDIT n’accepte actuellement que `RECETTE` et le support `AKS Audit RECETTE` ;
- le projet Apps Script utilisé pour les campagnes précédentes est un environnement de recette ;
- la version applicative embarquée reste à synchroniser avec la future release.

Une fusion sélective de quelques commits ACCESS n’est pas retenue par défaut : ACCESS dépend des évolutions AUDIT et transverses cumulatives. Le périmètre exact de la candidate devra toutefois être confirmé par l’audit de release.

## 3. Décisions validées

### P1 — Audit de production distinct

AUDIT doit distinguer explicitement `RECETTE` et `PRODUCTION`. Le support de production est un classeur distinct, contrôlé par environnement, identifiant, titre, schéma et autorisations. Le classeur de recette ne peut jamais servir de support de production.

La conservation, la sauvegarde et la restauration des preuves doivent être définies avant ouverture.

### P2 — Candidate de publication

Une candidate de publication cohérente est préparée à partir de l’état validé de `develop`. La version proposée est `V1.4.0`, sous réserve de confirmation au Quality Gate.

La candidate comprend principalement ACCESS, la migration administrative, AUDIT et les fondations internes déjà intégrées. Les fondations Inscriptions restent non exposées et refusées en production.

La version embarquée, le README, le changelog et les notes de publication doivent être synchronisés.

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

1. identifier formellement le projet et le déploiement de production existants ;
2. sauvegarder leurs identifiants, leur version et leur configuration ;
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
- contrôler la restauration ;
- conserver uniquement les preuves nécessaires.

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

Chaque mutation de production exige l’autorisation correspondant à son étape. Une validation du cadrage ne vaut pas autorisation de fusionner dans `main`, de déployer ou de modifier un compte réel.

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
| 0.1.0 | 2026-08-20 | Cadrage P1 à P10 validé ; rectification de l’état ACCESS et priorité donnée à la publication, au déploiement et à l’amorçage avant INSCRIPTIONS-011 |

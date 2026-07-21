# ADMIN-001 — Sprint 1 — Configuration des administrateurs

| Propriété | Valeur |
|---|---|
| **Document parent** | ADMIN-001 |
| **Version** | 1.1.0 |
| **Statut** | Référence d’implémentation |
| **Dernière mise à jour** | 2026-07-19 |

## 1. Décision

Pour ADMIN-001 V1.1, la liste des administrateurs autorisés est une
configuration embarquée et versionnée dans `src/config/Config.gs` :

```javascript
CONFIG.ADMIN.AUTHORIZED_EMAILS
```

Cette configuration est centralisée, immuable à l’exécution et auditée par Git.
Ajouter ou retirer un administrateur nécessite une modification du code, une
revue et un nouveau déploiement Apps Script.

Elle n’est pas présentée comme une configuration administrable sans
redéploiement.

## 2. Responsabilités

`Config.gs` contient la source unique des adresses autorisées.

`AdminAccess.gs` :

- ne contient aucune adresse codée directement ;
- lit la configuration administrative côté serveur ;
- normalise les adresses avant comparaison ;
- refuse l’accès si la configuration est absente, invalide ou vide ;
- retourne `ADMIN001_ACCESS_DENIED` pour tout accès refusé.

Aucun service de configuration et aucun enregistrement supplémentaire dans le
Container ne sont introduits par ce correctif.

## 3. Séparation avec l’application publique

La configuration `CONFIG.ADMIN` appartient au périmètre administratif.

Le questionnaire public :

- ne lit pas `CONFIG.ADMIN.AUTHORIZED_EMAILS` ;
- ne dépend pas de `AKS.Admin.Access` ;
- conserve son routage et son comportement existants ;
- reste accessible sans compte Google.

Le partage du fichier transversal `Config.gs` ne constitue pas une dépendance
fonctionnelle du Web App public envers l’administration.

## 4. Configuration initiale

L’administrateur autorisé initial est :

```text
karate.seremange@gmail.com
```

## 5. Validation automatisée

Les tests ADMIN-001 couvrent :

- l’autorisation du compte configuré ;
- la normalisation de la casse et des espaces ;
- le refus d’un compte inconnu ;
- le refus avec une liste vide ;
- le refus avec une configuration invalide ;
- la construction déclarative et immuable du modèle du Dashboard.

## 6. Évolution future éventuelle

Une administration sans modification du code nécessiterait une configuration de
déploiement sécurisée, par exemple les propriétés du script, ou un futur
service de paramétrage.

Cette évolution est hors du périmètre d’ADMIN-001 et devra faire l’objet d’une
décision d’architecture distincte.
